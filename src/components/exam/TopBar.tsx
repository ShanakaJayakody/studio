
'use client';

import { useState } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Flag, Calculator as CalculatorIcon } from 'lucide-react';
import CalculatorDialog from './CalculatorDialog';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export default function TopBar() {
  const { currentQuestionIndex, isQuestionFlagged, toggleFlag } = useExam();
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const { toast } = useToast();

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
        <div className="h-12 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center px-6">
          <h1 className="text-xl font-semibold">Decision Making Test</h1>
        </div>
        <div className="h-12 bg-[hsl(var(--ucat-light-blue-bar-bg))] text-[hsl(var(--ucat-light-blue-bar-fg))] flex items-center justify-between px-6">
          {/* Left: Calculator Button */}
          <div>
            <Button
              onClick={() => setIsCalculatorOpen(true)}
              variant="outline"
              aria-label="Open Calculator"
              className="border-accent text-accent hover:bg-accent/10 transition-colors duration-200 px-3 py-1 h-8 text-sm"
            >
              <CalculatorIcon className="mr-2 h-4 w-4" /> Calculator
            </Button>
          </div>
          {/* Center: Section Info */}
          <span className="text-sm font-medium">Section: Decision Making</span>
          {/* Right: Flag Button */}
          <div>
            <Button
              onClick={handleFlagToggle}
              variant={flagged ? "destructive" : "outline"}
              aria-label={flagged ? "Unflag Question" : "Flag Question"}
              className={cn(
                "transition-colors duration-200 px-3 py-1 h-8 text-sm",
                flagged
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "border-accent text-accent hover:bg-accent/10"
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
