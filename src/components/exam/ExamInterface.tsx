
'use client';

import { useEffect } from 'react';
import { useExam } from '@/contexts/ExamContext';
import TopBar from './TopBar';
import BottomBar from './BottomBar';
import QuestionDisplay from './QuestionDisplay';
import { useToast } from '@/hooks/use-toast';
import type { MCQQuestion } from '@/lib/types';

export default function ExamInterface() {
  const { 
    nextQuestion, 
    prevQuestion, 
    toggleFlag, 
    currentQuestionIndex, 
    isQuestionFlagged,
    currentQuestion, // Added to get current question details
    selectAnswer      // Added for selecting MCQ answer
  } = useExam();
  const { toast } = useToast();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if focus is on an input, textarea, or contenteditable element
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      if (isTyping) {
        return; // Don't process shortcuts if user is typing in an input field
      }

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
            const wasFlagged = isQuestionFlagged(currentQuestionIndex);
            toggleFlag(currentQuestionIndex);
            toast({ 
              title: `Question ${currentQuestionIndex + 1} ${!wasFlagged ? 'flagged' : 'unflagged'}`,
              duration: 2000 
            });
            break;
          case 'c':
            const calculatorButton = document.querySelector('button[aria-label="Open Calculator"]') as HTMLButtonElement | null;
            if (calculatorButton) {
              calculatorButton.click();
            } else {
              // Fallback, though button should exist in TopBar
              toast({ title: "Calculator button not found via Alt+C" });
            }
            break;
        }
      } else {
        // Handle direct key presses for MCQ options (a, b, c, d, e)
        if (currentQuestion && currentQuestion.type === 'MCQ') {
          const mcq = currentQuestion as MCQQuestion; // Type assertion
          const key = event.key.toLowerCase();
          let optionIndex = -1;

          if (key === 'a') optionIndex = 0;
          else if (key === 'b') optionIndex = 1;
          else if (key === 'c') optionIndex = 2;
          else if (key === 'd') optionIndex = 3;
          else if (key === 'e') optionIndex = 4;

          if (optionIndex !== -1 && mcq.options && optionIndex < mcq.options.length) {
            const selectedOptionId = mcq.options[optionIndex].id;
            selectAnswer(currentQuestion.id, selectedOptionId);
            event.preventDefault(); // Prevent any default action for a-e keys
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    nextQuestion, 
    prevQuestion, 
    toggleFlag, 
    currentQuestionIndex, 
    isQuestionFlagged, 
    toast,
    currentQuestion, // Added dependency
    selectAnswer     // Added dependency
  ]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <TopBar />
      <QuestionDisplay />
      <BottomBar />
    </div>
  );
}
