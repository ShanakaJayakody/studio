// src/app/dashboard/classroom/[coursea]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getCourseById, getModulesForCourse, getLessonsForModule, getCourseProgressForUser } from '@/services/courseService'; // Adjust
import type { Course, Module, Lesson, UserLessonProgress } from '@/lib/types'; // Adjust
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { CheckCircle, Circle, ChevronLeft, Loader2, AlertTriangle, PlayCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress'; // Assuming you have this
import { useAuth } from '@/contexts/AuthContext'; // Adjust

interface ModuleWithLessons extends Module {
  lessons: Lesson[];
  completedLessonsCount: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  const { currentUser } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [modulesWithLessons, setModulesWithLessons] = useState<ModuleWithLessons[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [overallProgress, setOverallProgress] = useState(0);
  const [userProgressMap, setUserProgressMap] = useState<Record<string, UserLessonProgress>>({});


  useEffect(() => {
    if (!courseId || !currentUser) return;

    async function fetchData() {
      try {
        setLoading(true);
        const courseData = await getCourseById(courseId);
        if (!courseData) {
          setError("Course not found."); setLoading(false); return;
        }
        setCourse(courseData);

        const fetchedUserProgress = await getCourseProgressForUser(currentUser.uid, courseId);
        setUserProgressMap(fetchedUserProgress);

        const fetchedModules = await getModulesForCourse(courseId);
        const enrichedModules: ModuleWithLessons[] = [];
        let totalLessonsInCourse = 0;
        let completedLessonsInCourse = 0;

        for (const module of fetchedModules) {
          const lessons = await getLessonsForModule(courseId, module.id);
          let completedLessonsInModule = 0;
          lessons.forEach(lesson => {
            if (fetchedUserProgress[lesson.id]?.completed) { // Check specific lesson's progress
              completedLessonsInModule++;
              completedLessonsInCourse++;
            }
          });
          totalLessonsInCourse += lessons.length;
          enrichedModules.push({ ...module, lessons, completedLessonsCount: completedLessonsInModule });
        }

        setModulesWithLessons(enrichedModules);
        setOverallProgress(totalLessonsInCourse > 0 ? Math.round((completedLessonsInCourse / totalLessonsInCourse) * 100) : 0);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch course details:", err);
        setError("Could not load course details.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [courseId, currentUser]);

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading Course...</span></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-destructive"><AlertTriangle className="h-8 w-8 mb-2" />{error}</div>;
  if (!course) return <div className="text-center py-10 text-muted-foreground">Course not found.</div>;

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={() => router.push('/dashboard/classroom')} className="mb-2">
        <ChevronLeft className="mr-2 h-4 w-4" /> Back to Classroom
      </Button>
      <Card className="shadow-lg overflow-hidden">
        <CardHeader className="p-0">
          {course.imageUrl && (
            <div className="relative w-full h-48 md:h-64">
              <Image src={course.imageUrl} alt={course.title} layout="fill" objectFit="cover" />
            </div>
          )}
          <div className="p-6">
            <CardTitle className="text-3xl font-bold text-primary">{course.title}</CardTitle>
            <CardDescription className="text-md mt-1">{course.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
              <span className="text-sm font-semibold text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="w-full h-2.5" />
          </div>

          <h2 className="text-xl font-semibold mb-3 text-primary">Modules</h2>
          {modulesWithLessons.length > 0 ? (
            <Accordion type="single" collapsible className="w-full space-y-3">
              {modulesWithLessons.map((module) => (
                <AccordionItem value={`module-${module.id}`} key={module.id} className="bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow data-[state=open]:border-primary">
                  <AccordionTrigger className="px-4 py-3 text-lg font-medium hover:no-underline data-[state=open]:text-primary">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-left">Module {module.order}: {module.title}</span>
                      {module.lessons.length > 0 && (
                        <span className="text-xs font-normal text-muted-foreground whitespace-nowrap ml-2">
                          {module.completedLessonsCount}/{module.lessons.length} done
                        </span>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-3 pt-0">
                    {module.description && <p className="text-sm text-muted-foreground mb-3">{module.description}</p>}
                    <ul className="space-y-1.5">
                      {module.lessons.map((lesson) => {
                         const isCompleted = userProgressMap[lesson.id]?.completed || false;
                        return (
                        <li key={lesson.id}>
                          <Link href={`/dashboard/classroom/${courseId}/${module.id}/${lesson.id}`} legacyBehavior>
                            <a className="flex items-center justify-between p-2.5 rounded-md hover:bg-muted/60 transition-colors group">
                              <div className="flex items-center">
                                {isCompleted ? (
                                  <CheckCircle className="h-5 w-5 mr-2.5 text-green-500 flex-shrink-0" />
                                ) : (
                                  <Circle className="h-5 w-5 mr-2.5 text-muted-foreground/70 flex-shrink-0" />
                                )}
                                <span className="text-sm font-normal text-card-foreground group-hover:text-primary">
                                  {lesson.order}. {lesson.title}
                                </span>
                              </div>
                              <PlayCircle className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                            </a>
                          </Link>
                        </li>
                      )})}
                      {module.lessons.length === 0 && <p className="text-sm text-muted-foreground italic p-2">No lessons in this module.</p>}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-muted-foreground">No modules available for this course yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}