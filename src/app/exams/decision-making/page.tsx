
'use client';

import { useState, useEffect } from 'react';
import { ExamProvider } from '@/contexts/ExamContext';
import InstructionsScreen from '@/components/exam/InstructionsScreen';
import ExamInterface from '@/components/exam/ExamInterface';
import ResultsScreen from '@/components/exam/ResultsScreen';
import ReviewScreen from '@/components/exam/ReviewScreen';
// import { DECISION_MAKING_QUESTIONS } from '@/lib/questions'; // No longer importing static questions
import { getQuestions } from '@/services/questionService'; // Import the new service
import type { ExamPhase, Question } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

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
      if (isClient) { // Only fetch once client-side
        try {
          setQuestionsLoading(true);
          // You might want to specify a collection name if it's not 'questions'
          // e.g., getQuestions('decisionMakingQuestions');
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
    loadQuestions();
  }, [isClient]);

  if (authLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading User Data...</p>
      </div>
    );
  }
  
  if (questionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading Exam Questions...</p>
      </div>
    );
  }

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
  
  if (!currentUser) {
     // Should be handled by the earlier redirect, but as a fallback
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Redirecting to login...</p>
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
