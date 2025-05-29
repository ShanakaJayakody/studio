
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
import { useRouter, usePathname } from 'next/navigation';

export default function DecisionMakingTestPage() {
  const [examPhase, setExamPhase] = useState<ExamPhase>('instructions');
  const [isClient, setIsClient] = useState(false);
  const { currentUser, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!loading && !currentUser && pathname !== '/login' && pathname !== '/signup') {
      router.push('/login');
    } else if (!loading && currentUser && (pathname === '/login' || pathname === '/signup')) {
      router.push('/');
    }
  }, [currentUser, loading, router, pathname]);

  if (loading || (!currentUser && pathname !== '/login' && pathname !== '/signup')) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading...</p>
      </div>
    );
  }
  
  // If on login/signup page, let those pages render themselves
  if (pathname === '/login' || pathname === '/signup') {
      return null; 
  }


  if (!isClient) { // This is for client-side only rendering of the exam parts
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading Decision Making Test...</p>
      </div>
    ); 
  }
  
  // Only render exam content if authenticated and on the root path
  if (currentUser && pathname === '/') {
    return (
      <ExamProvider questions={DECISION_MAKING_QUESTIONS} setExamPhase={setExamPhase}>
        {examPhase === 'instructions' && <InstructionsScreen />}
        {examPhase === 'in-progress' && <ExamInterface />}
        {examPhase === 'review' && <ReviewScreen />}
        {examPhase === 'results' && <ResultsScreen />}
      </ExamProvider>
    );
  }

  // Fallback or if routing hasn't caught up, show loading
  return (
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
      <p className="text-lg text-[hsl(var(--foreground))]">Loading...</p>
    </div>
  );
}
