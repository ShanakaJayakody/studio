
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import type { UserAnswer } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ResultsScreen() {
  const { questions, userAnswers, examStartTime, setExamPhase } = useExam();

  const calculateScore = () => {
    let correctAnswers = 0;
    questions.forEach(q => {
      const userAnswer = userAnswers[q.id];
      if (q.type === 'MCQ') {
        if (userAnswer === q.correctAnswer) {
          correctAnswers++;
        }
      } else if (q.type === 'DND') {
        // Basic DND scoring: all statements must be in correct categories
        // More complex partial scoring could be implemented here.
        const correctAnswerDnd = q.correctAnswer as Record<string, string[]>;
        const userAnswerDnd = userAnswer as Record<string, string[]> | undefined;
        if (userAnswerDnd) {
          let allCorrect = true;
          // Check if all statements in correct answer are present in user's answer in the right category
          for (const category in correctAnswerDnd) {
            const correctStmts = correctAnswerDnd[category].sort();
            const userStmts = (userAnswerDnd[category] || []).sort();
            if (JSON.stringify(correctStmts) !== JSON.stringify(userStmts)) {
              allCorrect = false;
              break;
            }
          }
          // Check if user assigned any statements to categories not in correct answer or vice-versa
           for (const category in userAnswerDnd) {
             if(!correctAnswerDnd[category] && userAnswerDnd[category].length > 0) {
                allCorrect = false;
                break;
             }
           }

          if (allCorrect) correctAnswers++;
        }
      }
    });
    return correctAnswers;
  };

  const score = calculateScore();
  const percentage = ((score / questions.length) * 100).toFixed(2);
  const timeTaken = examStartTime ? ((Date.now() - examStartTime) / 1000 / 60).toFixed(2) : 'N/A';

  const getAnswerDisplay = (questionId: string, type: 'MCQ' | 'DND', answer: UserAnswer | undefined) => {
    if (answer === undefined) return <span className="text-muted-foreground italic">Not Answered</span>;
    if (type === 'MCQ') return <>{answer}</>;
    if (type === 'DND') {
      const dndAnswer = answer as Record<string, string[]>;
      return (
        <ul className="list-disc pl-5 text-xs">
          {Object.entries(dndAnswer).map(([category, statements]) => (
            statements.length > 0 && <li key={category}><strong>{category}:</strong> {statements.join(', ')}</li>
          ))}
        </ul>
      );
    }
    return <>{String(answer)}</>;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[hsl(var(--background))]">
      <Card className="w-full max-w-3xl shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-[hsl(var(--primary))]">Exam Results</CardTitle>
          <CardDescription className="text-center">
            Here's how you performed on the UCAT Challenger.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-center">
            <Card className="p-4 bg-primary/10">
              <CardTitle className="text-2xl text-primary">{score} / {questions.length}</CardTitle>
              <CardDescription>Correct Answers</CardDescription>
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
              const userAnswer = userAnswers[q.id];
              let isCorrect = false;
              if (q.type === 'MCQ') {
                isCorrect = userAnswer === q.correctAnswer;
              } else if (q.type === 'DND') {
                const correctAnswerDnd = q.correctAnswer as Record<string, string[]>;
                const userAnswerDnd = userAnswer as Record<string, string[]> | undefined;
                if (userAnswerDnd) {
                  let allCorrectLocal = true;
                  for (const category in correctAnswerDnd) {
                    const correctStmts = correctAnswerDnd[category].sort();
                    const userStmts = (userAnswerDnd[category] || []).sort();
                    if (JSON.stringify(correctStmts) !== JSON.stringify(userStmts)) {
                      allCorrectLocal = false; break;
                    }
                  }
                  for (const category in userAnswerDnd) {
                    if(!correctAnswerDnd[category] && userAnswerDnd[category].length > 0) {
                       allCorrectLocal = false; break;
                    }
                  }
                  isCorrect = allCorrectLocal;
                }
              }
              const Icon = userAnswer === undefined ? AlertTriangle : (isCorrect ? CheckCircle : XCircle);
              const iconColor = userAnswer === undefined ? "text-yellow-500" : (isCorrect ? "text-green-500" : "text-red-500");

              return (
                <Card key={q.id} className={cn("p-3", userAnswer === undefined ? "bg-yellow-500/10" : (isCorrect ? "bg-green-500/10" : "bg-red-500/10"))}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">Q{index + 1}: {q.questionText.substring(0,50)}...</p>
                    <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
                  </div>
                  <div className="text-xs mt-1">
                    <p><strong>Your Answer:</strong> {getAnswerDisplay(q.id, q.type, userAnswer)}</p>
                    {!isCorrect && userAnswer !== undefined && (
                      <p><strong>Correct Answer:</strong> {getAnswerDisplay(q.id, q.type, q.correctAnswer as UserAnswer)}</p>
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
