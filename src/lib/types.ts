
export type Option = {
  id: string;
  text: string;
};

export type Statement = {
  id: string;
  text: string;
};

export type Question = {
  id: string;
  type: 'MCQ' | 'DND';
  section: string; 
  stimulus?: string; 
  questionText: string;
  options?: Option[]; 
  statements?: Statement[]; 
  categories?: string[]; 
  correctAnswer: string | Record<string, string[]>; 
  explanation?: string;
};

export type UserAnswer = string | Record<string, string> | Record<string, string[]>;

export type ExamPhase = 'instructions' | 'in-progress' | 'results';
