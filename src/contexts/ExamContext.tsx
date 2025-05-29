
'use client';

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { Question, UserAnswer, ExamPhase } from '@/lib/types';

interface ExamContextType {
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<string, UserAnswer>;
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
  selectAnswer: (questionId: string, answer: UserAnswer) => void;
  toggleFlag: (questionIndex: number) => void;
  submitExam: () => void;
  setExamPhase: (phase: ExamPhase) => void;
  isQuestionFlagged: (questionIndex: number) => boolean;
}

const ExamContext = createContext<ExamContextType | undefined>(undefined);

interface ExamProviderProps {
  children: ReactNode;
  questions: Question[];
  initialPhase?: ExamPhase;
  onPhaseChange?: (phase: ExamPhase) => void;
}

export const ExamProvider: React.FC<ExamProviderProps & { setExamPhase: (phase: ExamPhase) => void }> = ({
  children,
  questions: initialQuestions,
  setExamPhase: setAppExamPhase, // Renamed to avoid conflict
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, UserAnswer>>({});
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
        setExamPhase: setLocalExamPhase,
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
