
'use client';

import { useState, useEffect } from 'react';
import { ExamProvider } from '@/contexts/ExamContext';
import InstructionsScreen from '@/components/exam/InstructionsScreen';
import ExamInterface from '@/components/exam/ExamInterface';
import ResultsScreen from '@/components/exam/ResultsScreen';
import ReviewScreen from '@/components/exam/ReviewScreen';
import { DECISION_MAKING_QUESTIONS } from '@/lib/questions';
import type { ExamPhase } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DecisionMakingTestPage() {
  const [examPhase, setExamPhase] = useState<ExamPhase>('instructions');
  const [isClient, setIsClient] = useState(false);
  const { currentUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !authLoading && !currentUser) {
      router.push('/login');
    }
  }, [isClient, authLoading, currentUser, router]);

  if (authLoading || !isClient || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading Exam...</p>
      </div>
    );
  }

  return (
    <ExamProvider questions={DECISION_MAKING_QUESTIONS} setExamPhase={setExamPhase}>
      {examPhase === 'instructions' && <InstructionsScreen />}
      {examPhase === 'in-progress' && <ExamInterface />}
      {examPhase === 'review' && <ReviewScreen />}
      {examPhase === 'results' && <ResultsScreen />}
    </ExamProvider>
  );
}
