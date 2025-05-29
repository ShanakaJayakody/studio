
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
    const urlRegex = /(https?:\/\/[^\s]+(\.png|\.jpg|\.jpeg|\.gif|\.webp)(\?[^\s]*)?)/g;
    const parts = stimulusText.split(urlRegex);

    return parts.map((part, index) => {
      if (part && part.match(urlRegex)) {
        const isImageKitUrl = part.startsWith('https://ik.imagekit.io');
        let hint = "stimulus image";
        if (part.includes('data-ai-hint=')) {
            try {
                // Extract hint from query param if present
                const urlObj = new URL(part);
                const hintParam = urlObj.searchParams.get('data-ai-hint');
                if (hintParam) {
                    hint = decodeURIComponent(hintParam);
                }
            } catch (e) {
                // Could not parse URL or hint, use default
            }
        } else if (isImageKitUrl) {
            // Try to generate a hint from imagekit URL path
            const pathSegments = part.split('/');
            const imageName = pathSegments[pathSegments.length -1].split('?')[0]; // Get filename before query
            if (imageName) {
                // Use filename as hint, removing URL encoding and truncating
                hint = decodeURIComponent(imageName).replace(/[-_]/g, ' ').substring(0, 50);
            }
        }
        
        const imageUrl = part.split('?data-ai-hint=')[0]; // Remove our custom hint param from src

        return (
          <div key={index} className="my-4 flex justify-center">
            <Image
              src={imageUrl}
              alt="Question stimulus image"
              width={600} 
              height={250} 
              className="rounded-md border object-contain"
              data-ai-hint={hint}
            />
          </div>
        );
      } else if (part && part.trim()) {
        return part.trim().split('\\n').map((line, lineIndex) => ( // Changed from \n to \\n for question.ts
          line.trim() ? <p key={`${index}-${lineIndex}`} className="mb-2 text-base leading-relaxed text-black">{line}</p> : null
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
              <CardDescription className="mt-2 p-3 bg-card rounded-md border">
                {renderStimulus(currentQuestion.stimulus)}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-base mb-4 whitespace-pre-wrap font-medium text-black">{currentQuestion.questionText}</p>
            
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
