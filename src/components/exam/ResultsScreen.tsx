
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { UserAnswer, YesNoAnswer, Statement, Question, YesNoStatementsQuestion, MCQQuestion, Option } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ResultsScreen() {
  const { questions, userAnswers, examStartTime, setExamPhase } = useExam();

  const calculateScore = () => {
    let correctQuestions = 0;
    questions.forEach(q => {
      const userAnswerForQuestion = userAnswers[q.id];

      if (q.type === 'YesNoStatements') {
        if (!userAnswerForQuestion || typeof userAnswerForQuestion === 'string') return; // Not answered or wrong type

        let allStatementsCorrect = true;
        // Check if all statements defined in correctAnswer are answered correctly
        for (const conclusion of q.conclusions) {
          const statementId = conclusion.id;
          if (userAnswerForQuestion[statementId] !== q.correctAnswer[statementId]) {
            allStatementsCorrect = false;
            break;
          }
        }
        // Also check if the user answered the exact number of statements required
        if (Object.keys(userAnswerForQuestion).filter(k => userAnswerForQuestion[k] !== undefined).length !== q.conclusions.length) {
            allStatementsCorrect = false;
        }

        if (allStatementsCorrect) {
          correctQuestions++;
        }
      } else if (q.type === 'MCQ') {
        if (typeof userAnswerForQuestion === 'string' && userAnswerForQuestion === q.correctAnswer) {
          correctQuestions++;
        }
      }
    });
    return correctQuestions;
  };

  const score = calculateScore();
  const percentage = questions.length > 0 ? ((score / questions.length) * 100).toFixed(2) : "0.00";
  const timeTaken = examStartTime ? ((Date.now() - examStartTime) / 1000 / 60).toFixed(2) : 'N/A';

  const getAnswerDisplayForYesNo = (answer: Record<string, YesNoAnswer | undefined> | undefined, conclusions: Statement[]) => {
    if (!answer || Object.keys(answer).length === 0) return <span className="text-muted-foreground italic">Not Answered</span>;
    
    return (
      <ul className="list-disc pl-5 text-xs space-y-1">
        {conclusions.map((conclusion, idx) => {
          const userAnswerForStatement = answer[conclusion.id];
          return (
            <li key={conclusion.id}>
              Statement {idx + 1}: <span className="font-semibold">{userAnswerForStatement ? userAnswerForStatement.toUpperCase() : <span className="italic text-muted-foreground">N/A</span>}</span>
            </li>
          );
        })}
      </ul>
    );
  };

  const getAnswerDisplayForMCQ = (answer: string | undefined, options: Option[]) => {
    if (!answer) return <span className="text-muted-foreground italic">Not Answered</span>;
    const selectedOption = options.find(opt => opt.id === answer);
    return <span className="font-semibold">{selectedOption ? selectedOption.text : 'Unknown Option'}</span>;
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[hsl(var(--background))]">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-[hsl(var(--primary))]">Decision Making Test Results</CardTitle>
          <CardDescription className="text-center">
            Here's how you performed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <Card className="p-4 bg-primary/10">
              <CardTitle className="text-2xl text-primary">{score} / {questions.length}</CardTitle>
              <CardDescription>Correct Questions</CardDescription>
            </Card>
            <Card className="p-4 bg-accent/10">
              <CardTitle className="text-2xl text-accent-foreground">{percentage}%</CardTitle>
              <CardDescription>Percentage</CardDescription>
            </Card>
            <Card className="p-4 bg-secondary/20">
              <CardTitle className="text-2xl text-secondary-foreground">{timeTaken} min</CardTitle>
              <CardDescription>Time Taken</CardDescription>
            </Card>
          </div>

          <h3 className="text-xl font-semibold mb-3 text-[hsl(var(--primary))]">Detailed Breakdown:</h3>
          <ScrollArea className="h-[40vh] border rounded-md p-1">
            <div className="space-y-3 p-3">
            {questions.map((q, index) => {
              const userAnswerForQuestion = userAnswers[q.id];
              let isQuestionCorrect = false;
              let isPartiallyOrUnanswered = true;
              let answerDisplay: React.ReactNode;
              let correctAnswerDisplay: React.ReactNode | null = null;

              if (q.type === 'YesNoStatements') {
                const ynq = q as YesNoStatementsQuestion;
                const ynAnswer = userAnswerForQuestion as Record<string, YesNoAnswer | undefined> | undefined;
                answerDisplay = getAnswerDisplayForYesNo(ynAnswer, ynq.conclusions);

                if (ynAnswer && Object.keys(ynAnswer).filter(k => ynAnswer[k] !== undefined).length === ynq.conclusions.length) {
                  isPartiallyOrUnanswered = false;
                  isQuestionCorrect = true;
                  for (const conclusion of ynq.conclusions) {
                    if (ynAnswer[conclusion.id] !== ynq.correctAnswer[conclusion.id]) {
                      isQuestionCorrect = false;
                      break;
                    }
                  }
                } else if (ynAnswer && Object.keys(ynAnswer).filter(k => ynAnswer[k] !== undefined).length > 0) {
                  isPartiallyOrUnanswered = true; // Partially answered
                } else {
                  isPartiallyOrUnanswered = true; // Unanswered
                }
                
                if(!isQuestionCorrect && !isPartiallyOrUnanswered){
                   correctAnswerDisplay = (
                     <ul className="list-disc pl-5 text-xs space-y-1">
                       {ynq.conclusions.map((conc, idx) => (
                         <li key={conc.id}>Statement {idx + 1}: <span className="font-semibold">{ynq.correctAnswer[conc.id]?.toUpperCase()}</span></li>
                       ))}
                     </ul>
                   );
                }
                 if (!isQuestionCorrect && (ynAnswer && Object.keys(ynAnswer).filter(k => ynAnswer[k] !== undefined).length > 0)) {
                     correctAnswerDisplay = (
                         <div>
                             <p className="mt-1"><strong>Correct Answer(s):</strong></p>
                             <ul className="list-disc pl-5 text-xs space-y-1">
                                 {ynq.conclusions.map((conc, idx) => (
                                     <li key={conc.id}>Statement {idx + 1}: <span className="font-semibold">{ynq.correctAnswer[conc.id]?.toUpperCase()}</span></li>
                                 ))}
                             </ul>
                         </div>
                     );
                 }


              } else if (q.type === 'MCQ') {
                const mcq = q as MCQQuestion;
                const mcqAnswer = userAnswerForQuestion as string | undefined;
                answerDisplay = getAnswerDisplayForMCQ(mcqAnswer, mcq.options);
                isPartiallyOrUnanswered = !mcqAnswer;
                if (mcqAnswer) {
                  isQuestionCorrect = mcqAnswer === mcq.correctAnswer;
                }
                if (!isQuestionCorrect && mcqAnswer) {
                  const correctOpt = mcq.options.find(opt => opt.id === mcq.correctAnswer);
                  correctAnswerDisplay = <p className="mt-1"><strong>Correct Answer:</strong> <span className="font-semibold">{correctOpt?.text || 'N/A'}</span></p>;
                }
              } else {
                answerDisplay = <span className="text-muted-foreground italic">Unknown question type</span>;
              }
              
              const Icon = isPartiallyOrUnanswered ? HelpCircle : (isQuestionCorrect ? CheckCircle : XCircle);
              const iconColor = isPartiallyOrUnanswered ? "text-gray-500" : (isQuestionCorrect ? "text-green-500" : "text-red-500");
              const cardBg = isPartiallyOrUnanswered ? "bg-gray-500/10" : (isQuestionCorrect ? "bg-green-500/10" : "bg-red-500/10");


              return (
                <Card key={q.id} className={cn("p-3", cardBg)}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">Q{index + 1}: {q.questionText.split('\\n')[0]}...</p>
                    <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
                  </div>
                  <div className="text-xs mt-1 space-y-1">
                    <p><strong>Your Answer(s):</strong> {answerDisplay}</p>
                    {correctAnswerDisplay}
                    {q.explanation && <p className="mt-1 text-muted-foreground italic"><strong>Explanation:</strong> {q.explanation}</p>}
                  </div>
                </Card>
              );
            })}
            </div>
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button 
            onClick={() => setExamPhase('instructions')} 
            size="lg" 
            className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 transform hover:scale-105"
          >
            Restart Test
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
