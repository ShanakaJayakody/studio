
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
  const { currentUser, loading: authLoading } = useAuth(); // Renamed loading to authLoading for clarity
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Client-side effect for routing
  useEffect(() => {
    // Ensure this effect runs only on the client and after auth state is known
    if (isClient && !authLoading) {
      if (!currentUser && pathname !== '/login' && pathname !== '/signup') {
        router.push('/login');
      } else if (currentUser && (pathname === '/login' || pathname === '/signup')) {
        router.push('/');
      }
    }
  }, [isClient, authLoading, currentUser, router, pathname]);

  // Universal loading state: Show while auth is resolving or client isn't fully ready.
  // This ensures server and initial client render match.
  if (authLoading || !isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading...</p>
      </div>
    );
  }

  // At this point, isClient is true and authLoading is false.
  // The routing useEffect above will handle redirects if necessary.

  // If we are on a login or signup page, let those pages render themselves.
  // The main app page component should return null for these routes.
  if (pathname === '/login' || pathname === '/signup') {
    return null;
  }

  // If authenticated and on the root path, show the exam.
  // If !currentUser, the useEffect would have redirected to /login by now if not on login/signup.
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

  // Fallback: This might show briefly during client-side navigation or if
  // the user is on a path not covered above (e.g. not logged in, not /login, not /signup, but also not /)
  // though the redirect logic should handle most cases.
  return (
    <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
      <p className="text-lg text-[hsl(var(--foreground))]">Loading...</p>
    </div>
  );
}
