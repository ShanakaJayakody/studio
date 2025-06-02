// src/app/dashboard/classroom/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Library, AlertTriangle, Loader2, ArrowRight } from 'lucide-react';
import { getCourses } from '@/services/courseService'; // Adjust path
import type { Course } from '@/lib/types'; // Adjust path

export default function ClassroomPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCoursesData() {
      try {
        setLoading(true);
        const fetchedCourses = await getCourses();
        setCourses(fetchedCourses);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        setError("Could not load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchCoursesData();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading Classroom...</span></div>;
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/10">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-destructive">
          <AlertTriangle className="h-8 w-8 mb-2" />
          <p className="font-semibold">Error Loading Courses</p>
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <Library className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-primary">My Classroom</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Explore available courses to enhance your UCAT preparation.
          </CardDescription>
        </CardHeader>
      </Card>

      {courses.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link href={`/dashboard/classroom/${course.id}`} key={course.id} legacyBehavior>
              <a className="block hover:no-underline group">
                <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                  {course.imageUrl && (
                    <div className="relative w-full h-48">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-grow">
                    <CardTitle className="text-xl text-primary group-hover:text-primary/90">{course.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm line-clamp-3">{course.description}</CardDescription>
                  </CardHeader>
                  <CardFooter>
                    <Button variant="ghost" className="text-primary p-0 group-hover:underline">
                      Start Learning <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <Card><CardContent className="pt-6 text-center text-muted-foreground">No courses available at the moment.</CardContent></Card>
      )}
    </div>
  );
}