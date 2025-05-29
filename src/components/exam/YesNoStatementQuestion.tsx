
'use client';

import type { Statement, YesNoAnswer, Question } from '@/lib/types';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface YesNoStatementQuestionProps {
  question: Question; // Pass the whole question object
}

export default function YesNoStatementQuestion({ question }: YesNoStatementQuestionProps) {
  const { selectAnswer, userAnswers } = useExam();
  
  // Ensure question.type is 'YesNoStatements' to access conclusions
  if (question.type !== 'YesNoStatements') {
    return <p>Invalid question type for this component.</p>;
  }

  const currentAnswersForQuestion = userAnswers[question.id] as Record<string, YesNoAnswer | undefined> || {};

  const handleSelect = (statementId: string, answer: YesNoAnswer) => {
    const newAnswersForQuestion = {
      ...currentAnswersForQuestion,
      [statementId]: currentAnswersForQuestion[statementId] === answer ? undefined : answer, // Toggle or set
    };
    selectAnswer(question.id, newAnswersForQuestion);
  };

  return (
    <div className="mt-4 space-y-6">
      {question.conclusions.map((conclusion, index) => (
        <div 
          key={conclusion.id} 
          className="p-4 border rounded-lg shadow-sm bg-card flex flex-col sm:flex-row justify-between items-start sm:items-center"
        >
          <p className="mb-3 sm:mb-0 sm:mr-4 flex-grow">
            <span className="font-medium">{index + 1}.</span> {conclusion.text}
          </p>
          <div className="flex space-x-2 flex-shrink-0">
            <Button
              onClick={() => handleSelect(conclusion.id, 'yes')}
              variant={currentAnswersForQuestion[conclusion.id] === 'yes' ? 'default' : 'outline'}
              className={cn(
                "w-24 transition-all duration-200",
                currentAnswersForQuestion[conclusion.id] === 'yes' 
                  ? 'bg-green-500 hover:bg-green-600 text-white ring-2 ring-green-500' 
                  : 'border-gray-300 hover:bg-green-500/10'
              )}
              aria-pressed={currentAnswersForQuestion[conclusion.id] === 'yes'}
            >
              <ThumbsUp className="mr-2 h-4 w-4" /> Yes
            </Button>
            <Button
              onClick={() => handleSelect(conclusion.id, 'no')}
              variant={currentAnswersForQuestion[conclusion.id] === 'no' ? 'default' : 'outline'}
              className={cn(
                "w-24 transition-all duration-200",
                currentAnswersForQuestion[conclusion.id] === 'no' 
                  ? 'bg-red-500 hover:bg-red-600 text-white ring-2 ring-red-500' 
                  : 'border-gray-300 hover:bg-red-500/10'
              )}
              aria-pressed={currentAnswersForQuestion[conclusion.id] === 'no'}
            >
              <ThumbsDown className="mr-2 h-4 w-4" /> No
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
