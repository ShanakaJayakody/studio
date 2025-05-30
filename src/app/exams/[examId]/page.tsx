
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
import { Button } from '@/components/ui/button';

interface DecisionMakingTestPageProps {
  params: {
    examId: string;
  };
}

export default function ExamPage({ params }: DecisionMakingTestPageProps) {
  const { examId } = params;
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
      if (isClient && examId) { 
        try {
          setQuestionsLoading(true);
          // Fetch questions for the specific examId
          const fetchedQuestions = await getQuestions('questions', examId); 
          if (fetchedQuestions.length === 0) {
            setQuestionsError(`No questions found for exam ID "${examId}". Please ensure questions are loaded in Firestore collection 'questions' with the correct examId and security rules allow access.`);
          } else {
            setQuestions(fetchedQuestions);
            setQuestionsError(null);
          }
        } catch (error) {
          console.error("Error fetching questions from Firestore:", error);
          if (error instanceof Error && error.message.includes("Missing or insufficient permissions")) {
            setQuestionsError("Error: Could not load exam questions due to missing or insufficient permissions. Please check Firestore security rules.");
          } else {
            setQuestionsError("Failed to load questions. Please check the console for details.");
          }
        } finally {
          setQuestionsLoading(false);
        }
      }
    }
    if (currentUser) { 
        loadQuestions();
    } else if (isClient && !authLoading && !currentUser) {
        setQuestionsLoading(false);
    }
  }, [isClient, currentUser, authLoading, examId]);

  if (authLoading || !isClient || (questionsLoading && currentUser) ) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">
          {authLoading || !isClient ? "Loading User Data..." : `Loading Exam: ${examId}...`}
        </p>
      </div>
    );
  }
  
  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Redirecting to login...</p>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[hsl(var(--background))] p-4">
        <p className="text-lg text-destructive mb-2">Error Loading Exam</p>
        <p className="text-sm text-muted-foreground text-center mb-4">{questionsError}</p>
        <Button onClick={() => router.push('/dashboard/home')} className="mt-4">
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
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
