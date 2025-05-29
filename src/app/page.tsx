
'use client';

import { useState, useEffect } from 'react';
import { ExamProvider } from '@/contexts/ExamContext';
import InstructionsScreen from '@/components/exam/InstructionsScreen';
import ExamInterface from '@/components/exam/ExamInterface';
import ResultsScreen from '@/components/exam/ResultsScreen';
import { UCAT_QUESTIONS } from '@/lib/questions';
import type { ExamPhase } from '@/lib/types';

export default function UcatChallengerPage() {
  const [examPhase, setExamPhase] = useState<ExamPhase>('instructions');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures that context-dependent components and localStorage/window access
    // only run on the client after hydration.
    setIsClient(true);
  }, []);

  // Render nothing or a loading indicator until client is confirmed
  // to prevent hydration mismatches with components using client-side state/effects.
  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading UCAT Challenger...</p>
      </div>
    ); 
  }

  return (
    <ExamProvider questions={UCAT_QUESTIONS} setExamPhase={setExamPhase}>
      {examPhase === 'instructions' && <InstructionsScreen />}
      {examPhase === 'in-progress' && <ExamInterface />}
      {examPhase === 'results' && <ResultsScreen />}
    </ExamProvider>
  );
}
