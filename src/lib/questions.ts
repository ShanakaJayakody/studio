import type { Question } from './types';

export const UCAT_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'MCQ',
    section: 'Verbal Reasoning',
    stimulus: 'The quick brown fox jumps over the lazy dog. This sentence is famous for containing all letters of the English alphabet.',
    questionText: 'What is the main characteristic of the sentence "The quick brown fox jumps over the lazy dog"?',
    options: [
      { id: 'q1o1', text: 'It is very long.' },
      { id: 'q1o2', text: 'It contains all letters of the alphabet.' },
      { id: 'q1o3', text: 'It describes an animal interaction.' },
      { id: 'q1o4', text: 'It is hard to pronounce.' },
    ],
    correctAnswer: 'q1o2',
    explanation: 'The sentence is a pangram, meaning it contains every letter of the alphabet.',
  },
  {
    id: 'q2',
    type: 'MCQ',
    section: 'Quantitative Reasoning',
    questionText: 'If a car travels at 60 km/h, how far will it travel in 2.5 hours?',
    options: [
      { id: 'q2o1', text: '120 km' },
      { id: 'q2o2', text: '150 km' },
      { id: 'q2o3', text: '180 km' },
      { id: 'q2o4', text: '24 km' },
    ],
    correctAnswer: 'q2o2',
    explanation: 'Distance = Speed × Time. So, 60 km/h × 2.5 h = 150 km.',
  },
  {
    id: 'q3',
    type: 'DND',
    section: 'Situational Judgement',
    questionText: 'Drag and drop the following statements into the appropriate categories: "Appropriate Action" or "Inappropriate Action" for a medical student observing a senior doctor making a mistake.',
    statements: [
      { id: 'q3s1', text: 'Immediately correct the senior doctor in front of the patient.' },
      { id: 'q3s2', text: 'Speak to the senior doctor privately after the patient encounter.' },
      { id: 'q3s3', text: 'Ignore the mistake as it is not your responsibility.' },
      { id: 'q3s4', text: 'Consult with a trusted faculty member about the observation.' },
    ],
    categories: ['Appropriate Action', 'Inappropriate Action'],
    correctAnswer: {
      'Appropriate Action': ['q3s2', 'q3s4'],
      'Inappropriate Action': ['q3s1', 'q3s3'],
    },
    explanation: 'Correcting publicly can undermine trust. Ignoring can be harmful. Private discussion and consultation are better approaches.',
  },
  {
    id: 'q4',
    type: 'MCQ',
    section: 'Abstract Reasoning',
    questionText: 'Which shape is next in the sequence? (Visual question - placeholder)',
    options: [
      { id: 'q4o1', text: 'Option A (visual)' },
      { id: 'q4o2', text: 'Option B (visual)' },
      { id: 'q4o3', text: 'Option C (visual)' },
      { id: 'q4o4', text: 'Option D (visual)' },
    ],
    correctAnswer: 'q4o1', // Placeholder
    explanation: 'Abstract reasoning questions require identifying patterns in visual sequences.',
  },
   {
    id: 'q5',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'A study found that 80% of people who own a red car also own a cat. John owns a red car.',
    questionText: 'Based on the information, which of the following is most likely true?',
    options: [
      { id: 'q5o1', text: 'John definitely owns a cat.' },
      { id: 'q5o2', text: 'John is likely to own a cat.' },
      { id: 'q5o3', text: 'John definitely does not own a cat.' },
      { id: 'q5o4', text: 'There is no information about John owning a cat.' },
    ],
    correctAnswer: 'q5o2',
    explanation: 'The stimulus provides a probability, not a certainty.',
  },
];
