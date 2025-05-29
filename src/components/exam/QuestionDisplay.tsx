
'use client';

import { useExam } from '@/contexts/ExamContext';
import YesNoStatementQuestion from './YesNoStatementQuestion';
import McqOptions from './McqOptions'; // Import McqOptions
import type { YesNoStatementsQuestion, MCQQuestion } from '@/lib/types'; // Import specific question types
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function QuestionDisplay() {
  const { currentQuestion } = useExam();

  if (!currentQuestion) {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-[hsl(var(--ucat-content-area-bg))]">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-grow bg-[hsl(var(--ucat-content-area-bg))] text-[hsl(var(--ucat-content-area-fg))]">
      <div className="p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[hsl(var(--primary))]">{currentQuestion.section}</CardTitle>
            {currentQuestion.stimulus && (
              <CardDescription className="mt-2 p-3 bg-muted/30 rounded-md border text-sm leading-relaxed whitespace-pre-wrap">
                {currentQuestion.stimulus}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-base mb-4 whitespace-pre-wrap font-medium">{currentQuestion.questionText}</p>
            
            {currentQuestion.type === 'YesNoStatements' && (
              <YesNoStatementQuestion question={currentQuestion as YesNoStatementsQuestion} />
            )}

            {currentQuestion.type === 'MCQ' && (
              <McqOptions 
                questionId={currentQuestion.id} 
                options={(currentQuestion as MCQQuestion).options} 
              />
            )}

            {currentQuestion.type !== 'YesNoStatements' && currentQuestion.type !== 'MCQ' && (
                 <p className="text-destructive">Error: Unknown question type.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
