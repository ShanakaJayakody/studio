
export type Statement = { // Used for conclusions
  id: string;
  text: string;
};

export type YesNoAnswer = 'yes' | 'no';

export type Option = {
  id: string;
  text: string;
};

// Defines the structure for a Yes/No statements question
export type YesNoStatementsQuestion = {
  id: string;
  type: 'YesNoStatements';
  section: 'Decision Making';
  stimulus: string; // This will hold the "Premises"
  questionText: string; // Main question title
  conclusions: Statement[]; // The list of statements to be evaluated
  correctAnswer: Record<string, YesNoAnswer>; // Maps statementId to its correct 'yes' or 'no' answer
  explanation?: string; // Optional explanation for the entire question or specific parts
};

// Defines the structure for an MCQ question
export type MCQQuestion = {
  id: string;
  type: 'MCQ';
  section: 'Decision Making';
  stimulus?: string; // Stimulus is optional for MCQs
  questionText: string;
  options: Option[];
  correctAnswer: string; // The ID of the correct option
  explanation?: string;
};

// Union type for all possible question structures
export type Question = YesNoStatementsQuestion | MCQQuestion;

// Defines the structure for a user's answer to a single question
// It can be a string (for MCQ option ID) or an object (for YesNo statement answers)
export type UserAnswer = string | Record<string, YesNoAnswer | undefined>;

// Defines the overall structure for all user answers in the exam
// It's a map where each key is a questionId and the value is the UserAnswer for that question
export type AllUserAnswers = Record<string, UserAnswer>;

// Defines the possible phases of the exam
export type ExamPhase = 'instructions' | 'in-progress' | 'review' | 'results';
