
'use client';

import { useEffect } from 'react';
import { useExam } from '@/contexts/ExamContext';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import QuestionDisplay from './QuestionDisplay';
import { useToast } from '@/hooks/use-toast';

export default function ExamInterface() {
  const { nextQuestion, prevQuestion, toggleFlag, currentQuestionIndex } = useExam();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        event.preventDefault(); // Prevent default browser behavior for Alt combinations
        switch (event.key.toLowerCase()) {
          case 'n':
            nextQuestion();
            break;
          case 'p':
            prevQuestion();
            break;
          case 'f':
            toggleFlag(currentQuestionIndex);
            toast({ title: `Question ${currentQuestionIndex + 1} ${useExam().isQuestionFlagged(currentQuestionIndex) ? 'flagged' : 'unflagged'}` });
            break;
          case 'c':
            // Logic to open calculator dialog will be in BottomBar, this is a conceptual shortcut
            // For now, we'll just toast. In a real scenario, BottomBar would need a way to trigger this.
            const calculatorButton = document.querySelector('button[aria-label="Open Calculator"]') as HTMLButtonElement | null;
            if (calculatorButton) calculatorButton.click(); else toast({ title: "Calculator shortcut pressed (Alt+C)"});
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [nextQuestion, prevQuestion, toggleFlag, currentQuestionIndex, toast]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <TopBar />
      <QuestionDisplay />
      <BottomBar />
    </div>
  );
}
