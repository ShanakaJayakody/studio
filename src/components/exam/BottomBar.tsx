
'use client';

import { useState } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LogOut, LayoutGrid } from 'lucide-react';
import NavigatorDialog from './NavigatorDialog';
import { cn } from '@/lib/utils';

export default function BottomBar() {
  const {
    prevQuestion,
    nextQuestion,
    submitExam,
    isFirstQuestion,
    isLastQuestion,
  } = useExam();

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  const navButtonBaseClass = "bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-200 hover:scale-105";
  const navButtonDisabledClass = "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed";

  return (
    <>
      <div className="h-20 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center justify-between px-6 shadow-md">
        <div className="flex items-center space-x-2">
          <Button
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            aria-label="Previous Question"
            className={cn(navButtonBaseClass, isFirstQuestion && navButtonDisabledClass)}
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Previous
          </Button>
          <Button
            onClick={() => setIsNavigatorOpen(true)}
            aria-label="Open Navigator"
            className={cn(navButtonBaseClass)}
            variant="outline" 
          >
            <LayoutGrid className="mr-2 h-5 w-5" /> Navigator
          </Button>
          {!isLastQuestion && (
            <Button
              onClick={nextQuestion}
              aria-label="Next Question"
              className={cn(navButtonBaseClass)}
            >
              Next <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          )}
        </div>

        {isLastQuestion && (
          <Button
            onClick={submitExam}
            variant="destructive" 
            className="transition-colors duration-200"
            aria-label="End Exam"
          >
             <LogOut className="mr-2 h-5 w-5" /> End Exam
          </Button>
        )}
      </div>
      <NavigatorDialog isOpen={isNavigatorOpen} onOpenChange={setIsNavigatorOpen} />
    </>
  );
}
