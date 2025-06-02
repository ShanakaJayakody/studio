// src/app/dashboard/classroom/[courseId]/[moduleId]/[lessonId]/page.tsx
'use client';

import { useState, useEffect, Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getLessonById, getUserLessonProgress, setUserLessonProgress, getLessonsForModule } from '@/services/courseService';
import type { Lesson, UserLessonProgress, ActionItem as ActionItemType } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, ChevronRight, CheckCircle, Download, FileText, Loader2, AlertTriangle, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LessonActionItem extends ActionItemType {
  completed: boolean;
}

export default function LessonPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const moduleId = params.moduleId as string;
  const lessonId = params.lessonId as string;
  const router = useRouter();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [moduleLessons, setModuleLessons] = useState<Lesson[]>([]);
  const [currentIndexInModule, setCurrentIndexInModule] = useState(-1);
  const [userProgress, setUserProgress] = useState<UserLessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionItems, setActionItems] = useState<LessonActionItem[]>([]);

  useEffect(() => {
    if (!courseId || !moduleId || !lessonId || !currentUser) return;
    async function fetchLessonData() {
      try {
        setLoading(true);
        const [lessonData, progressData, allModuleLessonsData] = await Promise.all([
          getLessonById(courseId, moduleId, lessonId),
          getUserLessonProgress(currentUser.uid, lessonId),
          getLessonsForModule(courseId, moduleId)
        ]);
        
        if (!lessonData) { setError("Lesson not found."); setLoading(false); return; }
        setLesson(lessonData);
        setUserProgress(progressData);
        setModuleLessons(allModuleLessonsData);

        const currentIdx = allModuleLessonsData.findIndex(l => l.id === lessonId);
        setCurrentIndexInModule(currentIdx);

        const initialActionItems = lessonData.actionItems?.map(item => ({
            ...item,
            completed: progressData?.actionItemsStatus?.[item.id] || false,
        })) || [];
        setActionItems(initialActionItems);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch lesson:", err);
        setError("Could not load lesson content.");
      } finally {
        setLoading(false);
      }
    }
    fetchLessonData();
  }, [courseId, moduleId, lessonId, currentUser]);

  const handleActionItemToggle = async (itemId: string) => {
    if (!currentUser || !lesson) return;
    const updatedActionItems = actionItems.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    );
    setActionItems(updatedActionItems);

    const newActionItemsStatus = updatedActionItems.reduce((acc, item) => {
      acc[item.id] = item.completed;
      return acc;
    }, {} as Record<string, boolean>);

    try {
      await setUserLessonProgress(currentUser.uid, courseId, moduleId, lesson.id, userProgress?.completed || false, newActionItemsStatus);
      setUserProgress(prev => ({
        ...(prev || { userId: currentUser.uid, lessonId: lesson.id, courseId, moduleId, completed: false }),
        actionItemsStatus: newActionItemsStatus,
      }));
      toast({ title: "Action item status saved." });
    } catch (e) {
      console.error("Error saving action item status:", e);
      toast({ variant: "destructive", title: "Failed to save action item." });
    }
  };
  
  const handleMarkComplete = async () => {
    if (!currentUser || !lesson) return;
    const newCompletedStatus = !userProgress?.completed;
    try {
       const currentActionItemsStatus = actionItems.reduce((acc, item) => {
            acc[item.id] = item.completed;
            return acc;
        }, {} as Record<string, boolean>);

      await setUserLessonProgress(currentUser.uid, courseId, moduleId, lesson.id, newCompletedStatus, currentActionItemsStatus);
      setUserProgress(prev => ({
        ...(prev || { userId: currentUser.uid, lessonId: lesson.id, courseId, moduleId, actionItemsStatus: currentActionItemsStatus }),
        completed: newCompletedStatus,
        completedAt: newCompletedStatus ? new Date() : undefined,
      }));
      toast({ title: `Lesson marked as ${newCompletedStatus ? 'complete' : 'incomplete'}.` });
       if (newCompletedStatus && currentIndexInModule < moduleLessons.length - 1) {
           navigateLesson('next');
       }
    } catch (e) {
      console.error("Error updating lesson completion:", e);
      toast({ variant: "destructive", title: "Failed to update lesson status." });
    }
  };

  const navigateLesson = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' ? currentIndexInModule - 1 : currentIndexInModule + 1;
    if (newIndex >= 0 && newIndex < moduleLessons.length) {
      const nextLessonId = moduleLessons[newIndex].id;
      router.push(`/dashboard/classroom/${courseId}/${moduleId}/${nextLessonId}`);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <span className="ml-2">Loading Lesson...</span></div>;
  if (error) return <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-destructive"><AlertTriangle className="h-8 w-8 mb-2" />{error}</div>;
  if (!lesson) return <div className="text-center py-10 text-muted-foreground">Lesson not found.</div>;

  const isCompleted = userProgress?.completed || false;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      <div className="flex justify-between items-center sticky top-16 bg-background/95 backdrop-blur-sm py-3 z-40 -mx-4 px-4 border-b">
        <Button variant="ghost" onClick={() => router.push(`/dashboard/classroom/${courseId}`)} className="text-muted-foreground hover:text-primary">
          <ChevronLeft className="mr-2 h-4 w-4" /> {courseId}
        </Button>
        <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateLesson('prev')} disabled={currentIndexInModule <= 0}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Prev
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigateLesson('next')} disabled={currentIndexInModule >= moduleLessons.length - 1}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
        </div>
      </div>

      <article className="bg-card p-6 sm:p-8 rounded-lg shadow-lg">
        <header className="mb-6 border-b pb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary">{lesson.order}. {lesson.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">Module: {moduleId} | Course: {courseId}</p>
        </header>

        <section className="space-y-6">
          {lesson.videoEmbedCode && (
            <div className="aspect-video rounded-lg overflow-hidden border shadow-inner" dangerouslySetInnerHTML={{ __html: lesson.videoEmbedCode }} />
          )}
          {lesson.videoUrl && !lesson.videoEmbedCode && (
            <div className="aspect-video rounded-lg overflow-hidden border shadow-inner">
              <iframe
                width="100%"
                height="100%"
                src={lesson.videoUrl.includes("youtube.com/embed") ? lesson.videoUrl : `https://www.youtube.com/embed/${lesson.videoUrl.split('v=')[1]?.split('&')[0] || lesson.videoUrl.split('/').pop()}`}
                title={lesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          )}

          {lesson.textContent && (
            <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none bg-muted/20 p-4 rounded-md border">
              <ReactMarkdown components={{ 
                  // You can customize markdown rendering here if needed
              }}>{lesson.textContent}</ReactMarkdown>
            </div>
          )}
          
          {actionItems.length > 0 && (
            <div className="border-t pt-6">
                <h3 className="text-xl font-semibold mb-3 text-primary flex items-center"><CheckCircle className="mr-2 h-5 w-5"/>Action Items</h3>
                <ul className="space-y-3">
                {actionItems.map((item) => (
                    <li key={item.id} className="flex items-center space-x-3 p-3 border rounded-md bg-card hover:bg-muted/30 transition-colors">
                    <Checkbox
                        id={`action-${item.id}`}
                        checked={item.completed}
                        onCheckedChange={() => handleActionItemToggle(item.id)}
                        aria-labelledby={`action-label-${item.id}`}
                        className="h-5 w-5"
                    />
                    <Label htmlFor={`action-${item.id}`} id={`action-label-${item.id}`} className={cn("flex-grow cursor-pointer text-sm", item.completed && "line-through text-muted-foreground")}>
                        {item.text}
                    </Label>
                    </li>
                ))}
                </ul>
            </div>
          )}

          {lesson.transcript && (
            <Accordion type="single" collapsible className="w-full border-t pt-6">
              <AccordionItem value="transcript" className="border-none">
                <AccordionTrigger className="text-lg font-semibold text-primary hover:no-underline">
                    <div className="flex items-center"><FileText className="mr-2 h-5 w-5"/>View Transcript</div>
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm dark:prose-invert max-w-none p-4 max-h-72 overflow-y-auto bg-muted/20 rounded-md border mt-2">
                  <ReactMarkdown>{lesson.transcript}</ReactMarkdown>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {lesson.attachments && lesson.attachments.length > 0 && (
            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-3 text-primary flex items-center"><Download className="mr-2 h-5 w-5"/>Downloads</h3>
              <ul className="space-y-2">
                {lesson.attachments.map((file, index) => (
                  <li key={index}>
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 p-2.5 border rounded-md hover:bg-muted/50 transition-colors text-primary hover:underline text-sm"
                      download={file.name} // Suggests filename for download
                    >
                      <FileText className="h-4 w-4" />
                      <span>{file.name} {file.type && <span className="text-xs text-muted-foreground">({file.type.toUpperCase()})</span>} {file.size && <span className="text-xs text-muted-foreground">({file.size})</span>}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <footer className="border-t pt-6 mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button
                onClick={handleMarkComplete}
                variant={isCompleted ? "outline" : "default"}
                size="lg"
                className={cn(
                    "transition-all duration-200 ease-in-out hover:scale-105 w-full sm:w-auto",
                    isCompleted ? "border-green-500 text-green-600 hover:bg-green-500/10" : "bg-primary hover:bg-primary/90"
                )}
                >
                <CheckCircle className={cn("mr-2 h-5 w-5", isCompleted && "text-green-500")} />
                {isCompleted ? 'Lesson Completed!' : 'Mark as Complete'}
            </Button>
        </footer>
      </article>
    </div>
  );
}