
'use client';

import { useState } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';
import NavigatorDialog from './NavigatorDialog';
import { cn } from '@/lib/utils';

export default function BottomBar() {
  const {
    prevQuestion,
    nextQuestion,
    isFirstQuestion,
    isLastQuestion,
    setExamPhase, // Get setExamPhase from context
  } = useExam();

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  const navButtonBaseClass = "bg-accent text-accent-foreground hover:bg-accent/90 transition-transform duration-200 hover:scale-105";
  const navButtonDisabledClass = "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed";

  const handleNextOrReview = () => {
    if (isLastQuestion) {
      setExamPhase('review'); // Go to review screen on last question
    } else {
      nextQuestion();
    }
  };

  return (
    <>
      <div className="h-20 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center justify-end px-6 shadow-md">
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
          >
            <LayoutGrid className="mr-2 h-5 w-5" /> Navigator
          </Button>

          <Button
            onClick={handleNextOrReview}
            aria-label={isLastQuestion ? "Review Answers" : "Next Question"}
            className={cn(navButtonBaseClass)}
          >
            {isLastQuestion ? "Review Answers" : "Next"} <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
      <NavigatorDialog isOpen={isNavigatorOpen} onOpenChange={setIsNavigatorOpen} />
    </>
  );
}
