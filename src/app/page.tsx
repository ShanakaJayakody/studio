
'use client';

import { useState, useEffect } from 'react';
import { ExamProvider } from '@/contexts/ExamContext';
import InstructionsScreen from '@/components/exam/InstructionsScreen';
import ExamInterface from '@/components/exam/ExamInterface';
import ResultsScreen from '@/components/exam/ResultsScreen';
import { DECISION_MAKING_QUESTIONS } from '@/lib/questions'; // Updated to use new questions
import type { ExamPhase } from '@/lib/types';

export default function DecisionMakingTestPage() { // Renamed component
  const [examPhase, setExamPhase] = useState<ExamPhase>('instructions');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[hsl(var(--background))]">
        <p className="text-lg text-[hsl(var(--foreground))]">Loading Decision Making Test...</p>
      </div>
    ); 
  }

  return (
    <ExamProvider questions={DECISION_MAKING_QUESTIONS} setExamPhase={setExamPhase}>
      {examPhase === 'instructions' && <InstructionsScreen />}
      {examPhase === 'in-progress' && <ExamInterface />}
      {examPhase === 'results' && <ResultsScreen />}
    </ExamProvider>
  );
}
