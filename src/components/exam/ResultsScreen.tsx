
'use client';

import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { UserAnswer, YesNoAnswer, Statement, Question, YesNoStatementsQuestion, MCQQuestion, Option } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ResultsScreen() {
  const { questions, userAnswers, examStartTime, setExamPhase, reviewQuestion } = useExam();

  const calculateScoreAndPossibleMarks = () => {
    let currentScore = 0;
    let currentTotalPossibleMarks = 0;

    questions.forEach(q => {
      const userAnswerForQuestion = userAnswers[q.id];

      if (q.type === 'YesNoStatements') {
        currentTotalPossibleMarks += 2; // Max 2 marks for YesNoStatements questions
        const userAnswer = userAnswerForQuestion as Record<string, YesNoAnswer | undefined> | undefined;
        let correctStatements = 0;
        let answeredStatements = 0;

        if (userAnswer) {
          q.conclusions.forEach(conclusion => {
            if (userAnswer[conclusion.id] !== undefined) {
              answeredStatements++;
              if (userAnswer[conclusion.id] === q.correctAnswer[conclusion.id]) {
                correctStatements++;
              }
            }
          });
        }
        
        // Scoring logic for 5-part questions (assuming all YesNoStatements are 5-part as per current data)
        if (q.conclusions.length === 5 && answeredStatements > 0) { // Check if at least one part was answered
          if (correctStatements === 5) {
            currentScore += 2;
          } else if (correctStatements === 4) {
            currentScore += 1;
          }
          // 0 marks for 3 or less correct statements
        }
         // If not a 5-part question, or not answered, score remains 0 for this question unless logic is added for other types.
      } else if (q.type === 'MCQ') {
        currentTotalPossibleMarks += 1; // 1 mark for MCQ
        if (typeof userAnswerForQuestion === 'string' && userAnswerForQuestion === q.correctAnswer) {
          currentScore += 1;
        }
      }
    });
    return { score: currentScore, totalPossibleMarks: currentTotalPossibleMarks };
  };

  const { score, totalPossibleMarks } = calculateScoreAndPossibleMarks();
  const percentage = totalPossibleMarks > 0 ? ((score / totalPossibleMarks) * 100).toFixed(2) : "0.00";
  const timeTaken = examStartTime ? ((Date.now() - examStartTime) / 1000 / 60).toFixed(2) : 'N/A';

  const getAnswerDisplayForYesNo = (answer: Record<string, YesNoAnswer | undefined> | undefined, conclusions: Statement[]) => {
    if (!answer || Object.keys(answer).filter(k => answer[k] !== undefined).length === 0) return <span className="text-muted-foreground italic">Not Answered</span>;
    
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

  const handleReviewQuestion = (index: number) => {
    reviewQuestion(index);
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
              <CardTitle className="text-2xl text-primary">{score} / {totalPossibleMarks}</CardTitle>
              <CardDescription>Total Score</CardDescription>
            </Card>
            <Card className="p-4 bg-accent/10">
              <CardTitle className="text-2xl text-accent-foreground">{percentage}%</CardTitle>
              <CardDescription>Overall Performance</CardDescription>
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
              let marksObtainedForQuestion = 0;
              let possibleMarksForQuestion = 0;
              let isUnanswered = true;
              let answerDisplay: React.ReactNode;
              let correctAnswerDisplay: React.ReactNode | null = null;

              if (q.type === 'YesNoStatements') {
                possibleMarksForQuestion = 2;
                const ynq = q as YesNoStatementsQuestion;
                const userAnswer = userAnswerForQuestion as Record<string, YesNoAnswer | undefined> | undefined;
                answerDisplay = getAnswerDisplayForYesNo(userAnswer, ynq.conclusions);
                let correctStatements = 0;
                let answeredStatements = 0;

                if (userAnswer) {
                  ynq.conclusions.forEach(conclusion => {
                    if (userAnswer[conclusion.id] !== undefined) {
                      answeredStatements++;
                      if (userAnswer[conclusion.id] === ynq.correctAnswer[conclusion.id]) {
                        correctStatements++;
                      }
                    }
                  });
                }
                
                isUnanswered = answeredStatements === 0;

                if (!isUnanswered && ynq.conclusions.length === 5) {
                  if (correctStatements === 5) marksObtainedForQuestion = 2;
                  else if (correctStatements === 4) marksObtainedForQuestion = 1;
                  else marksObtainedForQuestion = 0;
                } else if (!isUnanswered) { // Fallback for non-5-part YesNo or if rules change
                   // For now, if not 5-part but answered, it gets 0 from the 2-mark system.
                   // This part might need more specific rules if non-5-part YesNo questions are introduced with different marking.
                   marksObtainedForQuestion = 0;
                }


                if (!isUnanswered && marksObtainedForQuestion < possibleMarksForQuestion) {
                   correctAnswerDisplay = (
                     <div>
                       <p className="mt-1 text-xs"><strong>Correct Answer(s):</strong></p>
                       <ul className="list-disc pl-5 text-xs space-y-1">
                         {ynq.conclusions.map((conc, idx) => (
                           <li key={conc.id}>Statement {idx + 1}: <span className="font-semibold">{ynq.correctAnswer[conc.id]?.toUpperCase()}</span></li>
                         ))}
                       </ul>
                     </div>
                   );
                }
              } else if (q.type === 'MCQ') {
                possibleMarksForQuestion = 1;
                const mcq = q as MCQQuestion;
                const mcqAnswer = userAnswerForQuestion as string | undefined;
                answerDisplay = getAnswerDisplayForMCQ(mcqAnswer, mcq.options);
                isUnanswered = !mcqAnswer;
                if (!isUnanswered) {
                  if (mcqAnswer === mcq.correctAnswer) {
                    marksObtainedForQuestion = 1;
                  }
                }
                if (!isUnanswered && marksObtainedForQuestion < possibleMarksForQuestion) {
                  const correctOpt = mcq.options.find(opt => opt.id === mcq.correctAnswer);
                  correctAnswerDisplay = <p className="mt-1 text-xs"><strong>Correct Answer:</strong> <span className="font-semibold">{correctOpt?.text || 'N/A'}</span></p>;
                }
              } else {
                answerDisplay = <span className="text-muted-foreground italic">Unknown question type</span>;
                possibleMarksForQuestion = 0; // Or handle as error
              }
              
              let Icon = HelpCircle;
              let iconColor = "text-gray-500";
              let cardBg = "bg-gray-500/10";

              if (isUnanswered) {
                Icon = HelpCircle;
                iconColor = "text-gray-500";
                cardBg = "bg-gray-100 dark:bg-gray-700/20";
              } else {
                if (marksObtainedForQuestion === possibleMarksForQuestion && possibleMarksForQuestion > 0) {
                  Icon = CheckCircle;
                  iconColor = "text-green-500";
                  cardBg = "bg-green-500/10";
                } else if (q.type === 'YesNoStatements' && marksObtainedForQuestion === 1) {
                  Icon = AlertTriangle;
                  iconColor = "text-orange-500";
                  cardBg = "bg-orange-500/10";
                } else { // 0 marks but answered
                  Icon = XCircle;
                  iconColor = "text-red-500";
                  cardBg = "bg-red-500/10";
                }
              }
              
              return (
                <div key={q.id} onClick={() => handleReviewQuestion(index)} className="cursor-pointer hover:shadow-md transition-shadow rounded-lg">
                  <Card className={cn("p-3", cardBg)}>
                    <div className="flex justify-between items-start">
                      <p className="font-semibold text-sm">Q{index + 1}: {q.questionText.split('\\n')[0]}...</p>
                      <Icon className={cn("h-5 w-5 shrink-0", iconColor)} />
                    </div>
                    <div className="text-xs mt-1 space-y-1">
                      <p><strong>Your Answer(s):</strong> {answerDisplay}</p>
                      <p><strong>Marks: {marksObtainedForQuestion} / {possibleMarksForQuestion}</strong></p>
                      {correctAnswerDisplay}
                      {q.explanation && !isUnanswered && marksObtainedForQuestion < possibleMarksForQuestion && (
                        <p className="mt-1 text-muted-foreground italic"><strong>Explanation:</strong> {q.explanation}</p>
                      )}
                    </div>
                  </Card>
                </div>
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
