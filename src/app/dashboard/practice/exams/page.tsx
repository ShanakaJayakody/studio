
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, PlayCircle, AlertTriangle } from "lucide-react";
import { getAvailableExams } from '@/services/questionService';
import type { ExamMetadata } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ExamsPage() {
  const [availableExams, setAvailableExams] = useState<ExamMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExams() {
      try {
        setLoading(true);
        const exams = await getAvailableExams();
        setAvailableExams(exams);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch exams:", err);
        setError("Could not load available exams. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchExams();
  }, []);

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-primary">Available Exams</CardTitle>
          <CardDescription className="text-lg">
            Select an exam below to begin your simulation.
          </CardDescription>
        </CardHeader>
      </Card>

      {loading && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Loading available exams...</p>
          </CardContent>
        </Card>
      )}

      {error && (
         <Card className="border-destructive bg-destructive/10">
          <CardContent className="pt-6 flex items-center justify-center text-destructive">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {!loading && !error && availableExams.length > 0 ? (
        <div className="space-y-6">
          {availableExams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div className="mb-4 sm:mb-0">
                    <CardTitle className="text-xl flex items-center">
                      <FileText className="h-6 w-6 mr-3 text-primary"/>
                      {exam.title}
                    </CardTitle>
                    <CardDescription className="mt-1">{exam.description}</CardDescription>
                  </div>
                  <Link href={`/exams/${exam.id}`} passHref legacyBehavior>
                    <Button 
                      asChild 
                      className={cn(
                        "bg-primary hover:bg-primary/90 w-full sm:w-auto",
                        "transition-all duration-200 ease-in-out hover:scale-105"
                        )}
                    >
                      <a><PlayCircle className="mr-2 h-5 w-5" /> Start Exam</a>
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  {exam.durationMinutes && <span>Duration: {exam.durationMinutes} Minutes</span>}
                  {exam.questionCount && <span>Questions: {exam.questionCount}</span>}
                  <span>Section: {exam.section}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}

      {!loading && !error && availableExams.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">No exams available at the moment. Please check back later, or ensure exams are set up in Firestore.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
