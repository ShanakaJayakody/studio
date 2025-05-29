
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Question, UserAnswer, AllUserAnswers, ExamPhase, YesNoAnswer } from '@/lib/types'; // Updated imports

interface ExamContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: AllUserAnswers; // Updated to AllUserAnswers
  flaggedQuestions: Set<number>;
  examStartTime: number | null;
  examPhase: ExamPhase;
  currentQuestion: Question | null;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  totalQuestions: number;
  startExam: () => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  selectAnswer: (questionId: string, answer: UserAnswer) => void; // answer is Record<string, YesNoAnswer | undefined>
  toggleFlag: (questionIndex: number) => void;
  submitExam: () => void;
  setExamPhase: (phase: ExamPhase) => void;
  isQuestionFlagged: (questionIndex: number) => boolean;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

interface ExamProviderProps {
  children: ReactNode;
  questions: Question[];
  setExamPhase: (phase: ExamPhase) => void; // Passed from page.tsx
}

export const ExamProvider: React.FC<ExamProviderProps> = ({
  children,
  questions: initialQuestions,
  setExamPhase: setAppExamPhase,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AllUserAnswers>({}); // Initialize as AllUserAnswers
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<number>>(new Set());
  const [examStartTime, setExamStartTime] = useState<number | null>(null);
  const [examPhase, setLocalExamPhase] = useState<ExamPhase>('instructions');

  const currentQuestion = questions[currentQuestionIndex] || null;
  const totalQuestions = questions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  useEffect(() => {
    setAppExamPhase(examPhase);
  }, [examPhase, setAppExamPhase]);

  const startExam = useCallback(() => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setFlaggedQuestions(new Set());
    setExamStartTime(Date.now());
    setLocalExamPhase('in-progress');
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const prevQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  }, [currentQuestionIndex]);

  // This function now expects the complete set of answers for all statements within a single question
  const selectAnswer = useCallback((questionId: string, answer: UserAnswer) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const toggleFlag = useCallback((questionIndex: number) => {
    setFlaggedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionIndex)) {
        newSet.delete(questionIndex);
      } else {
        newSet.add(questionIndex);
      }
      return newSet;
    });
  }, []);
  
  const isQuestionFlagged = useCallback((questionIndex: number) => {
    return flaggedQuestions.has(questionIndex);
  }, [flaggedQuestions]);

  const submitExam = useCallback(() => {
    setLocalExamPhase('results');
  }, []);

  return (
    <ExamContext.Provider
      value={{
        questions,
        currentQuestionIndex,
        userAnswers,
        flaggedQuestions,
        examStartTime,
        examPhase,
        currentQuestion,
        isFirstQuestion,
        isLastQuestion,
        totalQuestions,
        startExam,
        nextQuestion,
        prevQuestion,
        selectAnswer,
        toggleFlag,
        submitExam,
        setExamPhase: setLocalExamPhase, // Use the local setter for context internal changes
        isQuestionFlagged,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = (): ExamContextType => {
  const context = useContext(ExamContext);
  if (context === undefined) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};
