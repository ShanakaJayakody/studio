
'use client';

import { useState, useEffect } from 'react';
import { ExamProvider } from '@/contexts/ExamContext';
import InstructionsScreen from '@/components/exam/InstructionsScreen';
import ExamInterface from '@/components/exam/ExamInterface';
import ResultsScreen from '@/components/exam/ResultsScreen';
import ReviewScreen from '@/components/exam/ReviewScreen';
import { getQuestions } from '@/services/questionService';
import type { ExamPhase, Question } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button'; // Added Button import

export default function DecisionMakingTestPage() {
  const [examPhase, setExamPhase] = useState<ExamPhase>('instructions');
  const [isClient, setIsClient] = useState(false);
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !authLoading && !currentUser) {
      router.push('/login');
    }
  }, [isClient, authLoading, currentUser, router]);

  useEffect(() => {
    async function loadQuestions() {
      if (isClient) { 
        try {
          setQuestionsLoading(true);
          const fetchedQuestions = await getQuestions('questions'); 
          if (fetchedQuestions.length === 0) {
            setQuestionsError("No questions found. Please ensure questions are loaded in Firestore collection 'questions' and security rules allow access.");
          } else {
            setQuestions(fetchedQuestions);
            setQuestionsError(null);
          }
        } catch (error) {
          console.error("Failed to load questions:", error);
          setQuestionsError("Failed to load questions. Please check the console for details.");
        } finally {
          setQuestionsLoading(false);
        }
      }
    }
    if (currentUser) { // Only load questions if user is potentially authenticated
        loadQuestions();
    } else if (isClient && !authLoading && !currentUser) {
        // If definitely not authenticated, don't bother loading questions
        setQuestionsLoading(false);
    }
  }, [isClient, currentUser, authLoading]); // Depend on currentUser and authLoading

  if (authLoading || !isClient || (questionsLoading && currentUser) ) { // Show loading if auth is pending, client not ready, or questions loading for an authenticated user
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">
          {authLoading || !isClient ? "Loading User Data..." : "Loading Exam Questions..."}
        </p>
      </div>
    );
  }
  
  // After initial loading, check currentUser explicitly
  if (!currentUser) {
    // This state will be brief as the useEffect above should redirect.
    // This ensures we don't render exam content while redirecting.
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Redirecting to login...</p>
      </div>
    );
  }

  // If user is authenticated, but there was an error loading questions
  if (questionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--background))] p-4">
        <p className="text-lg text-destructive mb-2">Error Loading Exam</p>
        <p className="text-sm text-muted-foreground text-center">{questionsError}</p>
        <Button onClick={() => router.push('/dashboard/home')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  // If questions are still somehow loading here, or no questions (should be caught by questionsError but as a fallback)
  if (questions.length === 0 && !questionsError) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
              <p className="text-lg text-[hsl(var(--foreground))]">Preparing exam...</p>
          </div>
      );
  }

  return (
    <ExamProvider questions={questions} setExamPhase={setExamPhase}>
      {examPhase === 'instructions' && <InstructionsScreen />}
      {examPhase === 'in-progress' && <ExamInterface />}
      {examPhase === 'review' && <ReviewScreen />}
      {examPhase === 'results' && <ResultsScreen />}
    </ExamProvider>
  );
}
