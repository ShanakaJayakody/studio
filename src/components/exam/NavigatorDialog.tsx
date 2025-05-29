
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigatorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NavigatorDialog({ isOpen, onOpenChange }: NavigatorDialogProps) {
  const { totalQuestions, flaggedQuestions, reviewQuestion, currentQuestionIndex } = useExam();

  const handleQuestionSelect = (index: number) => {
    reviewQuestion(index);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-primary">Question Navigator</DialogTitle>
          <DialogDescription>
            Select a question to jump to. Flagged questions are marked.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="flex-grow">
          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-8 gap-2 p-4">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const isFlagged = flaggedQuestions.has(index);
              const isCurrent = index === currentQuestionIndex;
              return (
                <Button
                  key={index}
                  variant={isCurrent ? 'default' : 'outline'}
                  onClick={() => handleQuestionSelect(index)}
                  className={cn(
                    "h-12 w-full flex flex-col items-center justify-center text-xs p-1 relative",
                    isFlagged && !isCurrent && "bg-destructive/10 border-destructive text-destructive-foreground hover:bg-destructive/20",
                    isFlagged && isCurrent && "bg-primary/80 border-primary text-primary-foreground",
                    isCurrent && "ring-2 ring-ring ring-offset-2"
                  )}
                  aria-label={`Go to question ${index + 1}${isFlagged ? ', flagged' : ''}`}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                  {isFlagged && <Flag className="h-3 w-3 absolute top-1 right-1" />}
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
