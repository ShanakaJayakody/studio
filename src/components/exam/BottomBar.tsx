
'use client';

import { useState } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, LayoutGrid, CheckCircle } from 'lucide-react'; // Added CheckCircle
import NavigatorDialog from './NavigatorDialog';
import { cn } from '@/lib/utils';

export default function BottomBar() {
  const {
    prevQuestion,
    nextQuestion,
    isFirstQuestion,
    isLastQuestion,
    setExamPhase,
  } = useExam();

  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);

  const navButtonBaseClass = "bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-200 ease-in-out hover:scale-105 text-base";
  const navButtonDisabledClass = "bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed";

  const handleNextOrReview = () => {
    if (isLastQuestion) {
      setExamPhase('review'); // Go to review screen
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
            {isLastQuestion ? "Review Answers" : "Next"} 
            {isLastQuestion ? <CheckCircle className="ml-2 h-5 w-5" /> : <ArrowRight className="ml-2 h-5 w-5" />}
          </Button>
        </div>
      </div>
      <NavigatorDialog isOpen={isNavigatorOpen} onOpenChange={setIsNavigatorOpen} />
    </>
  );
}
