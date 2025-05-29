
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
    currentQuestion, 
    selectAnswer      
  } = useExam();
  // const { toast } = useToast(); // Toast removed for flagging

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isTyping = activeElement && (
        activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable
      );

      if (isTyping) {
        return; 
      }

      if (event.altKey) {
        event.preventDefault(); 
        switch (event.key.toLowerCase()) {
          case 'n':
            // If it's the last question, nextQuestion in context will handle going to review
            nextQuestion(); 
            break;
          case 'p':
            prevQuestion();
            break;
          case 'f':
            // const wasFlagged = isQuestionFlagged(currentQuestionIndex); // Not needed for toast
            toggleFlag(currentQuestionIndex);
            // toast({ 
            //   title: `Question ${currentQuestionIndex + 1} ${!wasFlagged ? 'flagged' : 'unflagged'}`,
            //   duration: 2000 
            // }); // Toast removed
            break;
          case 'c':
            const calculatorButton = document.querySelector('button[aria-label="Open Calculator"]') as HTMLButtonElement | null;
            if (calculatorButton) {
              calculatorButton.click();
            }
            break;
        }
      } else {
        if (currentQuestion && currentQuestion.type === 'MCQ') {
          const mcq = currentQuestion as MCQQuestion; 
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
            event.preventDefault(); 
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
    // isQuestionFlagged, // Not needed for toast
    // toast, // Toast removed
    currentQuestion, 
    selectAnswer     
  ]);

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden">
      <TopBar />
      <QuestionDisplay />
      <BottomBar />
    </div>
  );
}
