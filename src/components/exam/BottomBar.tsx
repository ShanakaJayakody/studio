
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BottomBar() {
  const {
    prevQuestion,
    nextQuestion,
    currentQuestionIndex,
    totalQuestions,
    submitExam,
    isFirstQuestion,
    isLastQuestion,
  } = useExam();

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
            onClick={nextQuestion}
            disabled={isLastQuestion}
            aria-label="Next Question"
            className={cn(navButtonBaseClass, isLastQuestion && navButtonDisabledClass)}
          >
            Next <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>

        <div className="text-sm font-medium">
          Question {currentQuestionIndex + 1} of {totalQuestions}
        </div>

        <div className="flex items-center space-x-2">
          {/* Calculator and Flag buttons removed */}
          <Button
            onClick={submitExam}
            variant="outline"
            className="border-destructive text-destructive hover:bg-destructive/10 transition-colors duration-200"
            aria-label="End Exam"
          >
             <LogOut className="mr-2 h-5 w-5" /> End Exam
          </Button>
        </div>
      </div>
      {/* CalculatorDialog removed from here */}
    </>
  );
}
