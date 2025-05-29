
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
    // Regex to specifically match URLs from ik.imagekit.io or placehold.co
    const urlRegex = /(https?:\/\/(?:ik\.imagekit\.io|placehold\.co)[^\s]+)/g;
    const parts = stimulusText.split(urlRegex);

    return parts.map((part, index) => {
      if (!part) return null; // Skip empty parts that can result from split

      if (part.match(urlRegex)) { // Check if this part *is* a URL matched by the regex
        let imageUrlForDisplay = part;
        let hint = "stimulus image"; // Default hint

        try {
            const urlObj = new URL(part);
            const hintParam = urlObj.searchParams.get('data-ai-hint');

            if (hintParam) {
                hint = decodeURIComponent(hintParam);
                // Clean the URL for display by removing only our custom hint param
                urlObj.searchParams.delete('data-ai-hint');
                imageUrlForDisplay = urlObj.toString();
            } else if (part.startsWith('https://ik.imagekit.io')) {
                // Try to generate a hint from imagekit URL path if no explicit hint param
                const pathSegments = urlObj.pathname.split('/');
                const imageNameWithPotentialQuery = pathSegments[pathSegments.length - 1];
                // Remove any query parameters from the imageName before using it for a hint
                const imageName = imageNameWithPotentialQuery.split('?')[0]; 
                if (imageName) {
                    // Use filename (without extension or query) as hint, improve formatting
                    hint = decodeURIComponent(imageName)
                           .replace(/\.[^/.]+$/, "") // Remove extension
                           .replace(/[-_]/g, ' ') // Replace hyphens/underscores with spaces
                           .trim()
                           .substring(0, 50); // Limit length
                }
            }
        } catch (e) {
            console.warn(`Failed to process URL for hints or cleanup: ${part}`, e);
            // imageUrlForDisplay remains 'part', hint remains default
        }
        
        return (
          <div key={`img-${index}`} className="my-4 flex justify-center">
            <Image
              src={imageUrlForDisplay}
              alt="Question stimulus image"
              width={600} 
              height={300} // Increased height slightly for better display of diagrams
              className="rounded-md border object-contain"
              data-ai-hint={hint}
            />
          </div>
        );
      } else if (part.trim()) {
        // Render text part, splitting by \\n for explicit newlines in the data
        return part.trim().split('\\n').map((line, lineIndex) => (
          line.trim() ? <p key={`text-${index}-${lineIndex}`} className="mb-2 text-base leading-relaxed text-black">{line}</p> : null
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
            {/* <CardTitle className="text-xl font-semibold text-[hsl(var(--primary))]">{currentQuestion.section}</CardTitle> */}
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

    
