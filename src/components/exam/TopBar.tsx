
'use client';

import { useState, useEffect } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Flag, Calculator as CalculatorIcon } from 'lucide-react';
import CalculatorDialog from './CalculatorDialog';
import { cn } from '@/lib/utils';

const EXAM_DURATION_MINUTES = 37;
const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60;

export default function TopBar() {
  const { currentQuestionIndex, totalQuestions, examPhase, isQuestionFlagged, toggleFlag } = useExam();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (examPhase === 'in-progress') {
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId!);
            // Optionally, trigger exam submission or a warning here
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      setTimeLeft(EXAM_DURATION_SECONDS); 
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [examPhase]); 

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFlagToggle = () => {
    toggleFlag(currentQuestionIndex);
  };

  const flagged = isQuestionFlagged(currentQuestionIndex);

  return (
    <>
      <div className="w-full shadow-md">
        {/* Dark Blue Bar */}
        <div className="h-12 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold">Decision Making Test</h1>
          <div className="flex items-center space-x-4">
            <span className="text-lg font-medium tabular-nums">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
          </div>
        </div>
        {/* Light Blue Bar */}
        <div className="h-12 bg-[hsl(var(--ucat-light-blue-bar-bg))] text-[hsl(var(--ucat-light-blue-bar-fg))] flex items-center justify-between px-6">
          <div>
            <Button
              onClick={() => setIsCalculatorOpen(true)}
              aria-label="Open Calculator"
              variant="ghost"
              className={cn(
                "text-[hsl(var(--ucat-light-blue-bar-fg))] hover:bg-accent/20 hover:text-[hsl(var(--accent-foreground))]",
                "px-3 py-1 h-8 text-base" // Changed from text-sm to text-base
              )}
            >
              <CalculatorIcon className="mr-2 h-4 w-4" /> Calculator
            </Button>
          </div>
          <div>
            <Button
              onClick={handleFlagToggle}
              aria-label={flagged ? "Unflag Question" : "Flag Question"}
              variant="ghost"
              className={cn(
                "px-3 py-1 h-8 text-base", // Changed from text-sm to text-base
                flagged
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "text-[hsl(var(--ucat-light-blue-bar-fg))] hover:bg-accent/20 hover:text-[hsl(var(--accent-foreground))]"
              )}
            >
              <Flag className="mr-2 h-4 w-4" /> {flagged ? "Flagged" : "Flag"}
            </Button>
          </div>
        </div>
      </div>
      <CalculatorDialog isOpen={isCalculatorOpen} onOpenChange={setIsCalculatorOpen} />
    </>
  );
}
