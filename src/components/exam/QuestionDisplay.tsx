
'use client';

import Image from 'next/image';
import { useExam } from '@/contexts/ExamContext';
import YesNoStatementQuestion from './YesNoStatementQuestion';
import McqOptions from './McqOptions';
import type { YesNoStatementsQuestion, MCQQuestion } from '@/lib/types';
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

  const renderStimulus = (stimulusText: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // Split the text by URLs, keeping the URLs in the resulting array
    const parts = stimulusText.split(urlRegex);

    return parts.map((part, index) => {
      if (part.match(urlRegex)) { // If the part is a URL
        return (
          <div key={index} className="my-4 flex justify-center">
            <Image
              src={part}
              alt="Question stimulus image"
              width={600} 
              height={250} 
              className="rounded-md border object-contain"
            />
          </div>
        );
      } else if (part.trim()) {
        // If the part is text, split by newlines and render each line as a paragraph
        return part.trim().split('\n').map((line, lineIndex) => (
          line.trim() ? <p key={`${index}-${lineIndex}`} className="mb-2 text-sm leading-relaxed">{line}</p> : null
        ));
      }
      return null;
    });
  };

  return (
    <ScrollArea className="flex-grow bg-[hsl(var(--ucat-content-area-bg))] text-[hsl(var(--ucat-content-area-fg))]">
      <div className="p-6">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-[hsl(var(--primary))]">{currentQuestion.section}</CardTitle>
            {currentQuestion.stimulus && (
              <CardDescription className="mt-2 p-3 bg-muted/30 rounded-md border">
                {renderStimulus(currentQuestion.stimulus)}
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
