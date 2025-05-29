
export type Statement = { // Used for conclusions
  id: string;
  text: string;
};

export type YesNoAnswer = 'yes' | 'no';

// Defines the structure for a single question
export type Question = {
  id: string;
  type: 'YesNoStatements'; // This is now the only question type
  section: 'Decision Making'; // All questions will belong to this section
  stimulus: string; // This will hold the "Premises"
  questionText: string; // Main question title (e.g., "Question 1") and instructions
  conclusions: Statement[]; // The list of statements to be evaluated
  correctAnswer: Record<string, YesNoAnswer>; // Maps statementId to its correct 'yes' or 'no' answer
  explanation?: string; // Optional explanation for the entire question or specific parts
};

// Defines the structure for a user's answer to a single YesNoStatements question
// It's a map where each key is a statementId and the value is the user's 'yes' or 'no' choice, or undefined if not answered
export type UserAnswer = Record<string, YesNoAnswer | undefined>;

// Defines the overall structure for all user answers in the exam
// It's a map where each key is a questionId and the value is the UserAnswer for that question
export type AllUserAnswers = Record<string, UserAnswer>;

// Defines the possible phases of the exam
export type ExamPhase = 'instructions' | 'in-progress' | 'results';
