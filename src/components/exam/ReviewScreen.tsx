
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag, ArrowRight, ListChecks, Search, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewScreen() {
  const {
    questions,
    userAnswers,
    flaggedQuestions,
    reviewQuestion,
    submitExam,
    isQuestionAnswered,
    setExamPhase, // Added to navigate back to specific questions
  } = useExam();

  const unansweredQuestionsCount = questions.filter(
    (q, i) => !isQuestionAnswered(q.id, q.type)
  ).length;

  const handleReviewQuestion = (index: number) => {
    reviewQuestion(index);
  };

  const handleReviewFirstUnanswered = () => {
    const firstUnansweredIndex = questions.findIndex(
      (q) => !isQuestionAnswered(q.id, q.type)
    );
    if (firstUnansweredIndex !== -1) {
      reviewQuestion(firstUnansweredIndex);
    }
  };

  const handleReviewFirstFlagged = () => {
    const firstFlaggedIndex = questions.findIndex((q, index) =>
      flaggedQuestions.has(index)
    );
    if (firstFlaggedIndex !== -1) {
      reviewQuestion(firstFlaggedIndex);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-[hsl(var(--ucat-content-area-bg))] text-[hsl(var(--ucat-content-area-fg))]">
      {/* Top Bar */}
      <div className="h-16 bg-[hsl(var(--ucat-light-blue-bar-bg))] text-[hsl(var(--ucat-light-blue-bar-fg))] flex items-center justify-between px-6 shadow-md">
        <h1 className="text-xl font-semibold">Review Your Answers</h1>
        <span className="text-sm font-medium">
          ({unansweredQuestionsCount} Unanswered/Incomplete)
        </span>
      </div>

      {/* Main Content - Scrollable Question List */}
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-2">
          {questions.map((question, index) => {
            const isFlagged = flaggedQuestions.has(index);
            const answered = isQuestionAnswered(question.id, question.type);
            return (
              <button
                key={question.id}
                onClick={() => handleReviewQuestion(index)}
                className={cn(
                  "w-full flex items-center justify-between p-3 text-left rounded-md border transition-colors",
                  "hover:bg-accent/10",
                  answered ? "border-green-500/50 bg-green-500/5" : "border-red-500/50 bg-red-500/5"
                )}
              >
                <div className="flex items-center">
                  {isFlagged && <Flag className="h-4 w-4 mr-2 text-destructive" />}
                  <span className="font-medium text-black">Question {index + 1}</span>
                </div>
                <span
                  className={cn(
                    "text-sm font-semibold",
                    answered ? "text-green-600" : "text-red-600"
                  )}
                >
                  {answered ? 'Answered' : 'Unanswered'}
                </span>
              </button>
            );
          })}
        </div>
      </ScrollArea>

      {/* Bottom Bar */}
      <div className="h-20 bg-[hsl(var(--ucat-dark-blue-bg))] text-[hsl(var(--ucat-dark-blue-fg))] flex items-center justify-between px-6 shadow-md">
        <Button
            onClick={submitExam}
            variant="destructive"
            className="transition-colors duration-200"
          >
          <ListChecks className="mr-2 h-5 w-5" /> End Review & Submit
        </Button>
        <div className="flex items-center space-x-2">
          <Button onClick={() => reviewQuestion(0)} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <RotateCcw className="mr-2 h-4 w-4" /> Review All
          </Button>
          <Button onClick={handleReviewFirstUnanswered} disabled={unansweredQuestionsCount === 0} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Search className="mr-2 h-4 w-4" /> Review Unanswered
          </Button>
          <Button onClick={handleReviewFirstFlagged} disabled={flaggedQuestions.size === 0} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <Flag className="mr-2 h-4 w-4" /> Review Flagged
          </Button>
        </div>
      </div>
    </div>
  );
}
