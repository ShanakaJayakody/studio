
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { UserAnswer, YesNoAnswer, Statement } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ResultsScreen() {
  const { questions, userAnswers, examStartTime, setExamPhase } = useExam();

  const calculateScore = () => {
    let correctQuestions = 0;
    questions.forEach(q => {
      if (q.type === 'YesNoStatements') {
        const userAnswerForQuestion = userAnswers[q.id];
        if (!userAnswerForQuestion) return; // Question not answered or partially answered

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
      }
    });
    return correctQuestions;
  };

  const score = calculateScore();
  const percentage = questions.length > 0 ? ((score / questions.length) * 100).toFixed(2) : "0.00";
  const timeTaken = examStartTime ? ((Date.now() - examStartTime) / 1000 / 60).toFixed(2) : 'N/A';

  const getAnswerDisplay = (questionId: string, answer: UserAnswer | undefined, conclusions: Statement[]) => {
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
              if (q.type !== 'YesNoStatements') return null;

              const userAnswerForQuestion = userAnswers[q.id];
              let isQuestionFullyCorrect = false;
              let isPartiallyAnswered = false;
              let answeredCount = 0;

              if (userAnswerForQuestion) {
                answeredCount = Object.values(userAnswerForQuestion).filter(ans => ans !== undefined).length;
                if (answeredCount > 0 && answeredCount < q.conclusions.length) {
                  isPartiallyAnswered = true;
                }

                isQuestionFullyCorrect = true;
                if (answeredCount !== q.conclusions.length) {
                    isQuestionFullyCorrect = false;
                } else {
                    for (const conclusion of q.conclusions) {
                        if (userAnswerForQuestion[conclusion.id] !== q.correctAnswer[conclusion.id]) {
                            isQuestionFullyCorrect = false;
                            break;
                        }
                    }
                }
              }
              
              const Icon = !userAnswerForQuestion || answeredCount === 0 ? HelpCircle : (isQuestionFullyCorrect ? CheckCircle : (isPartiallyAnswered ? AlertTriangle : XCircle));
              const iconColor = !userAnswerForQuestion || answeredCount === 0 ? "text-gray-500" : (isQuestionFullyCorrect ? "text-green-500" : (isPartiallyAnswered ? "text-yellow-500" : "text-red-500"));
              const cardBg = !userAnswerForQuestion || answeredCount === 0 ? "bg-gray-500/10" : (isQuestionFullyCorrect ? "bg-green-500/10" : (isPartiallyAnswered ? "bg-yellow-500/10" : "bg-red-500/10"));

              return (
                <Card key={q.id} className={cn("p-3", cardBg)}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">Q{index + 1}: {q.questionText.split('\\n')[0]}...</p>
                    <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
                  </div>
                  <div className="text-xs mt-1 space-y-1">
                    <p><strong>Your Answer(s):</strong> {getAnswerDisplay(q.id, userAnswerForQuestion, q.conclusions)}</p>
                    {(!isQuestionFullyCorrect || isPartiallyAnswered) && (userAnswerForQuestion && answeredCount > 0) && (
                       <div>
                         <p><strong>Correct Answer(s):</strong></p>
                         <ul className="list-disc pl-5 text-xs space-y-1">
                           {q.conclusions.map((conc, idx) => (
                             <li key={conc.id}>Statement {idx + 1}: <span className="font-semibold">{q.correctAnswer[conc.id]?.toUpperCase()}</span></li>
                           ))}
                         </ul>
                       </div>
                    )}
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
