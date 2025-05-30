
'use client';

import { useRef } from 'react';
import { useExam } from '@/contexts/ExamContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Flag, CheckCircle, XCircle, AlertTriangle, HelpCircle, ArrowLeft, Eye } from 'lucide-react';
import type { UserAnswer, YesNoAnswer, Statement, Question, YesNoStatementsQuestion, MCQQuestion, Option } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function ResultsScreen() {
  const { questions, userAnswers, examStartTime, setExamPhase, flaggedQuestions } = useExam();
  const questionDetailsRef = useRef<(HTMLDivElement | null)[]>([]);

  const calculateScoreAndPossibleMarks = () => {
    let currentScore = 0;
    let currentTotalPossibleMarks = 0;

    questions.forEach(q => {
      const userAnswerForQuestion = userAnswers[q.id];
      if (q.type === 'YesNoStatements') {
        currentTotalPossibleMarks += 2;
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
        if (q.conclusions.length === 5 && answeredStatements > 0) {
          if (correctStatements === 5) currentScore += 2;
          else if (correctStatements === 4) currentScore += 1;
        }
      } else if (q.type === 'MCQ') {
        currentTotalPossibleMarks += 1;
        if (typeof userAnswerForQuestion === 'string' && userAnswerForQuestion === q.correctAnswer) {
          currentScore += 1;
        }
      }
    });
    return { score: currentScore, totalPossibleMarks: currentTotalPossibleMarks };
  };

  const { score, totalPossibleMarks } = calculateScoreAndPossibleMarks();
  const percentage = totalPossibleMarks > 0 ? ((score / totalPossibleMarks) * 100).toFixed(2) : "0.00";
  
  const completionDate = examStartTime ? new Date(examStartTime).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true
  }) : 'N/A';

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

  const handleScrollToQuestion = (index: number) => {
    questionDetailsRef.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  const handleReviewAllQuestions = () => {
    // Scrolls to the top of the detailed breakdown list
    const firstDetailElement = document.getElementById('question-detail-0');
    firstDetailElement?.scrollIntoView({ behavior: 'smooth', block: 'start'});
  };


  return (
    <div className="min-h-screen bg-[hsl(var(--background))] p-4 md:p-8">
      <header className="mb-6">
        <Button variant="link" onClick={() => setExamPhase('instructions')} className="text-sm text-muted-foreground px-0 hover:text-primary">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to All Exams (Restart)
        </Button>
        <h1 className="text-3xl font-bold text-[hsl(var(--primary))] mt-2">Decision Making Test Results</h1>
        <p className="text-sm text-muted-foreground">Completed: {completionDate}</p>
        <div className="mt-4">
           <Button onClick={handleReviewAllQuestions} className="bg-primary text-primary-foreground hover:bg-primary/90">
             <Eye className="mr-2 h-4 w-4" /> Review All Questions (Scroll to Details)
           </Button>
        </div>
      </header>

      {/* Summary Cards - Kept for overall stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-center">
        <Card className="p-4 bg-primary/10 shadow-md">
          <CardTitle className="text-2xl text-primary">{score} / {totalPossibleMarks}</CardTitle>
          <CardDescription>Total Score</CardDescription>
        </Card>
        <Card className="p-4 bg-accent/10 shadow-md">
          <CardTitle className="text-2xl text-accent-foreground">{percentage}%</CardTitle>
          <CardDescription>Overall Performance</CardDescription>
        </Card>
      </div>

      {/* Question Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-[hsl(var(--primary))] mb-3">Question Overview</h2>
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2">
          {questions.map((q, index) => {
            const userAnswerForQuestion = userAnswers[q.id];
            let marksObtainedForQuestion = 0;
            let possibleMarksForQuestion = 0;
            let isUnanswered = true;

            if (q.type === 'YesNoStatements') {
              possibleMarksForQuestion = 2;
              const userAnswer = userAnswerForQuestion as Record<string, YesNoAnswer | undefined> | undefined;
              let correctStatements = 0;
              let answeredStatements = 0;
              if (userAnswer) {
                q.conclusions.forEach(conclusion => {
                  if (userAnswer[conclusion.id] !== undefined) answeredStatements++;
                  if (userAnswer[conclusion.id] === q.correctAnswer[conclusion.id]) correctStatements++;
                });
              }
              isUnanswered = answeredStatements === 0;
              if (!isUnanswered && q.conclusions.length === 5) {
                if (correctStatements === 5) marksObtainedForQuestion = 2;
                else if (correctStatements === 4) marksObtainedForQuestion = 1;
              }
            } else if (q.type === 'MCQ') {
              possibleMarksForQuestion = 1;
              isUnanswered = !userAnswerForQuestion;
              if (!isUnanswered && userAnswerForQuestion === q.correctAnswer) {
                marksObtainedForQuestion = 1;
              }
            }

            let boxBgColor = 'bg-gray-100 hover:bg-gray-200';
            let boxTextColor = 'text-gray-700';
            if (isUnanswered) {
              // Default gray for unanswered
            } else if (marksObtainedForQuestion === possibleMarksForQuestion && possibleMarksForQuestion > 0) {
              boxBgColor = 'bg-green-100 hover:bg-green-200'; // Light green for correct
              boxTextColor = 'text-green-700';
            } else if (q.type === 'YesNoStatements' && marksObtainedForQuestion === 1) {
              boxBgColor = 'bg-orange-100 hover:bg-orange-200'; // Light orange for partial
              boxTextColor = 'text-orange-700';
            } else {
              boxBgColor = 'bg-red-100 hover:bg-red-200'; // Light red for incorrect
              boxTextColor = 'text-red-700';
            }
            const isFlagged = flaggedQuestions.has(index);

            return (
              <Button
                key={q.id}
                variant="outline"
                onClick={() => handleScrollToQuestion(index)}
                className={cn(
                  "h-12 w-full flex flex-col items-center justify-center text-xs p-1 relative rounded-md border shadow-sm transition-colors duration-150",
                  boxBgColor,
                  boxTextColor,
                  "border-current" // Use text color for border
                )}
                aria-label={`Review question ${index + 1}`}
              >
                <span className="text-sm font-medium">{index + 1}</span>
                {isFlagged && <Flag className="h-3 w-3 absolute top-1 right-1 text-destructive" />}
              </Button>
            );
          })}
        </div>
      </div>
      
      {/* Detailed Breakdown (Scrollable List) */}
      <div>
        <h2 className="text-xl font-semibold text-[hsl(var(--primary))] mb-3">Detailed Review</h2>
        <ScrollArea className="h-[60vh] border rounded-md p-1 bg-card shadow">
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
                  if (userAnswer[conclusion.id] !== undefined) answeredStatements++;
                  if (userAnswer[conclusion.id] === ynq.correctAnswer[conclusion.id]) correctStatements++;
                });
              }
              isUnanswered = answeredStatements === 0;
              if (!isUnanswered && ynq.conclusions.length === 5) {
                if (correctStatements === 5) marksObtainedForQuestion = 2;
                else if (correctStatements === 4) marksObtainedForQuestion = 1;
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
              if (!isUnanswered && mcqAnswer === mcq.correctAnswer) {
                marksObtainedForQuestion = 1;
              }
              if (!isUnanswered && marksObtainedForQuestion < possibleMarksForQuestion) {
                const correctOpt = mcq.options.find(opt => opt.id === mcq.correctAnswer);
                correctAnswerDisplay = <p className="mt-1 text-xs"><strong>Correct Answer:</strong> <span className="font-semibold">{correctOpt?.text || 'N/A'}</span></p>;
              }
            } else {
              answerDisplay = <span className="text-muted-foreground italic">Unknown question type</span>;
            }
            
            let Icon = HelpCircle;
            let iconColor = "text-gray-500";
            let cardBg = "bg-gray-500/10";

            if (isUnanswered) {
              Icon = HelpCircle; iconColor = "text-gray-500"; cardBg = "bg-gray-100 dark:bg-gray-700/20";
            } else {
              if (marksObtainedForQuestion === possibleMarksForQuestion && possibleMarksForQuestion > 0) {
                Icon = CheckCircle; iconColor = "text-green-500"; cardBg = "bg-green-500/10";
              } else if (q.type === 'YesNoStatements' && marksObtainedForQuestion === 1) {
                Icon = AlertTriangle; iconColor = "text-orange-500"; cardBg = "bg-orange-500/10";
              } else {
                Icon = XCircle; iconColor = "text-red-500"; cardBg = "bg-red-500/10";
              }
            }
            
            return (
              <div 
                key={q.id} 
                id={`question-detail-${index}`} 
                ref={el => questionDetailsRef.current[index] = el} 
                className="scroll-mt-4" // For better scroll positioning
              >
                <Card className={cn("p-3", cardBg)}>
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-sm">Q{index + 1}: {q.questionText.split('\\n')[0].substring(0,100)}...</p>
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
      </div>

      <footer className="mt-8 flex justify-center">
        <Button 
          onClick={() => setExamPhase('instructions')} 
          size="lg" 
          className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-[hsl(var(--primary))]/90 transition-all duration-300 transform hover:scale-105"
        >
          Restart Test
        </Button>
      </footer>
    </div>
  );
}
