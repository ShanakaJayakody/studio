
'use client';

import { useExam } from '@/contexts/ExamContext';
import McqOptions from './McqOptions';
import DragAndDropQuestion from './DragAndDropQuestion';
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
              <CardDescription className="mt-2 p-3 bg-muted/30 rounded-md border text-sm leading-relaxed">
                {currentQuestion.stimulus}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-base mb-4 whitespace-pre-wrap">{currentQuestion.questionText}</p>
            {currentQuestion.type === 'MCQ' && currentQuestion.options && (
              <McqOptions questionId={currentQuestion.id} options={currentQuestion.options} />
            )}
            {currentQuestion.type === 'DND' && currentQuestion.statements && currentQuestion.categories && (
              <DragAndDropQuestion
                questionId={currentQuestion.id}
                statements={currentQuestion.statements}
                categories={currentQuestion.categories}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
