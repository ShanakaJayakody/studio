
'use client';

import { useState, useEffect } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Flag, Calculator as CalculatorIcon } from 'lucide-react';
import CalculatorDialog from './CalculatorDialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const EXAM_DURATION_MINUTES = 37;
const EXAM_DURATION_SECONDS = EXAM_DURATION_MINUTES * 60;

export default function TopBar() {
  const { currentQuestionIndex, totalQuestions, examPhase, isQuestionFlagged, toggleFlag } = useExam();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    if (examPhase === 'in-progress') {
      if (timeLeft <= 0 && EXAM_DURATION_SECONDS > 0) { 
        setTimeLeft(EXAM_DURATION_SECONDS);
      }
      
      intervalId = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalId!);
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
  }, [examPhase, timeLeft]); // Added timeLeft to dependencies to handle reset correctly

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleFlagToggle = () => {
    const wasFlagged = isQuestionFlagged(currentQuestionIndex);
    toggleFlag(currentQuestionIndex);
    toast({
      title: `Question ${currentQuestionIndex + 1} ${!wasFlagged ? 'flagged' : 'unflagged'}`,
      duration: 2000,
    });
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
              variant="outline"
              aria-label="Open Calculator"
              className={cn(
                "border-[hsl(var(--ucat-light-blue-bar-fg))] text-[hsl(var(--ucat-light-blue-bar-fg))]",
                "hover:bg-accent hover:text-[hsl(var(--accent-foreground))]", // Accent bg is sky blue, accent-foreground is now white
                "transition-colors duration-200 px-3 py-1 h-8 text-sm"
              )}
            >
              <CalculatorIcon className="mr-2 h-4 w-4" /> Calculator
            </Button>
          </div>
          <div>
            <Button
              onClick={handleFlagToggle}
              variant={flagged ? "destructive" : "outline"}
              aria-label={flagged ? "Unflag Question" : "Flag Question"}
              className={cn(
                "transition-colors duration-200 px-3 py-1 h-8 text-sm",
                flagged
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : cn(
                      "border-[hsl(var(--ucat-light-blue-bar-fg))] text-[hsl(var(--ucat-light-blue-bar-fg))]",
                      "hover:bg-accent hover:text-[hsl(var(--accent-foreground))]" // Accent bg is sky blue, accent-foreground is now white
                    )
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
