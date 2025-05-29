
'use client';

import { useExam } from '@/contexts/ExamContext';
import YesNoStatementQuestion from './YesNoStatementQuestion';
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

  // Since we only have one question type now, we can simplify this
  if (currentQuestion.type !== 'YesNoStatements') {
    return (
      <div className="flex-grow flex items-center justify-center p-6 bg-[hsl(var(--ucat-content-area-bg))]">
        <p className="text-destructive">Error: Unknown question type.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-grow bg-[hsl(var(--ucat-content-area-bg))] text-[hsl(var(--ucat-content-area-fg))]">
      <div className="p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[hsl(var(--primary))]">{currentQuestion.section}</CardTitle>
            {currentQuestion.stimulus && ( // This is the "Premises"
              <CardDescription className="mt-2 p-3 bg-muted/30 rounded-md border text-sm leading-relaxed whitespace-pre-wrap">
                {currentQuestion.stimulus}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-base mb-4 whitespace-pre-wrap font-medium">{currentQuestion.questionText}</p>
            {/* Render YesNoStatementQuestion directly as it's the only type */}
            <YesNoStatementQuestion question={currentQuestion} />
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
