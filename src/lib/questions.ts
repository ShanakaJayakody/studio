
import type { Question } from './types';

export const DECISION_MAKING_QUESTIONS: Question[] = [
  {
    id: 'dm_q1',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nAll oranges in the bowl are sweet.\nThis fruit is an orange in the bowl.',
    questionText: 'Question 1\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q1_s1', text: 'This fruit is sweet.' },
      { id: 'dm_q1_s2', text: 'Some sweet fruits in the bowl are oranges.' },
      { id: 'dm_q1_s3', text: 'No non-sweet fruits in the bowl are oranges.' },
      { id: 'dm_q1_s4', text: 'All sweet fruits in the bowl are oranges.' },
      { id: 'dm_q1_s5', text: 'Some fruits in the bowl are not sweet.' },
    ],
    correctAnswer: {
      'dm_q1_s1': 'yes',
      'dm_q1_s2': 'yes',
      'dm_q1_s3': 'yes', // If all oranges are sweet, then no oranges are non-sweet.
      'dm_q1_s4': 'no',  // We only know about oranges, not all sweet fruits.
      'dm_q1_s5': 'no',  // This fruit is an orange and is sweet. We don't know about other fruits.
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises.',
  },
  {
    id: 'dm_q2',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nAll doctors are graduates.\nSome graduates are tired.',
    questionText: 'Question 2\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q2_s1', text: 'All doctors are tired.' },
      { id: 'dm_q2_s2', text: 'Some doctors are tired.' },
      { id: 'dm_q2_s3', text: 'Some graduates are doctors.' },
      { id: 'dm_q2_s4', text: 'No doctors are tired.' },
      { id: 'dm_q2_s5', text: 'All tired people are graduates.' },
    ],
    correctAnswer: {
      'dm_q2_s1': 'no',
      'dm_q2_s2': 'no', // We cannot conclude this. Some graduates are tired, but doctors are a subset of graduates.
      'dm_q2_s3': 'yes', // Since all doctors are graduates, some graduates must be doctors (assuming there are doctors).
      'dm_q2_s4': 'no',
      'dm_q2_s5': 'no',
    },
    explanation: 'Be careful about inferring relationships not explicitly stated or necessarily implied.',
  },
  {
    id: 'dm_q3',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nIf it rains, the street gets wet.\nThe street is wet.',
    questionText: 'Question 3\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q3_s1', text: 'It rained.' },
      { id: 'dm_q3_s2', text: 'It did not rain.' },
      { id: 'dm_q3_s3', text: 'If the street is not wet, it did not rain.' },
      { id: 'dm_q3_s4', text: 'The street can only get wet if it rains.' },
      { id: 'dm_q3_s5', text: 'Something else might have made the street wet.' },
    ],
    correctAnswer: {
      'dm_q3_s1': 'no', // This is affirming the consequent, a fallacy. Other causes for wet street.
      'dm_q3_s2': 'no',
      'dm_q3_s3': 'yes', // This is the contrapositive, which is logically equivalent.
      'dm_q3_s4': 'no', // Premises don't state rain is the *only* cause.
      'dm_q3_s5': 'yes', // Consistent with the fallacy in s1.
    },
    explanation: 'Recognize common logical forms and fallacies. The street could be wet for other reasons (e.g. sprinklers).',
  },
  {
    id: 'dm_q4',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nNo cat is a reptile.\nAll snakes are reptiles.',
    questionText: 'Question 4\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q4_s1', text: 'No cat is a snake.' },
      { id: 'dm_q4_s2', text: 'Some cats are snakes.' },
      { id: 'dm_q4_s3', text: 'All reptiles are snakes.' },
      { id: 'dm_q4_s4', text: 'No snake is a cat.' },
      { id: 'dm_q4_s5', text: 'Some reptiles are not snakes.' },
    ],
    correctAnswer: {
      'dm_q4_s1': 'yes', // If no cat is a reptile, and all snakes are reptiles, then no cat can be a snake.
      'dm_q4_s2': 'no',
      'dm_q4_s3': 'no', // We know all snakes are reptiles, not the other way around.
      'dm_q4_s4': 'yes', // Same as s1.
      'dm_q4_s5': 'no', // Cannot be determined from premises.
    },
    explanation: 'Use set theory or Venn diagrams to visualize relationships if helpful.',
  },
  {
    id: 'dm_q5',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nEvery citizen over 18 has the right to vote.\nSarah is 20 years old and is a citizen.',
    questionText: 'Question 5\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q5_s1', text: 'Sarah has the right to vote.' },
      { id: 'dm_q5_s2', text: 'Sarah does not have the right to vote.' },
      { id: 'dm_q5_s3', text: 'Some 20-year-old citizens do not have the right to vote.' },
      { id: 'dm_q5_s4', text: 'Everyone who has the right to vote is a citizen over 18.' },
      { id: 'dm_q5_s5', text: 'If a person is not over 18 or not a citizen, they do not have the right to vote.' },
    ],
    correctAnswer: {
      'dm_q5_s1': 'yes',
      'dm_q5_s2': 'no',
      'dm_q5_s3': 'no', // Contradicts premise 1.
      'dm_q5_s4': 'yes', // This is a restatement of the premise.
      'dm_q5_s5': 'yes', // This is the contrapositive of the premise.
    },
    explanation: 'Direct application of the rule stated in the premise.',
  },
  {
    id: 'dm_q6',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nA museum ticket costs £10 for adults and £5 for children.\nGroup bookings of 10 or more people get a 10% discount on the total price.',
    questionText: 'Question 6\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q6_s1', text: 'A group of 5 adults and 5 children will pay £75.' },
      { id: 'dm_q6_s2', text: 'A group of 5 adults and 5 children will pay £67.50.' },
      { id: 'dm_q6_s3', text: 'An adult ticket is always twice the price of a child ticket.' },
      { id: 'dm_q6_s4', text: 'A group of 2 adults will get a discount.' },
      { id: 'dm_q6_s5', text: 'The discount for a group of 10 adults is £10.' },
    ],
    correctAnswer: {
      'dm_q6_s1': 'no', // (5*10 + 5*5) = 75. Discount applies. 75 * 0.9 = 67.50
      'dm_q6_s2': 'yes',
      'dm_q6_s3': 'yes', // £10 is twice £5.
      'dm_q6_s4': 'no', // Discount is for 10 or more people.
      'dm_q6_s5': 'yes', // Total for 10 adults = 100. 10% discount = 10.
    },
    explanation: 'Calculate costs and apply discounts carefully.',
  },
];

// Keeping UCAT_QUESTIONS for now to avoid breaking imports in page.tsx,
// but it should be replaced by DECISION_MAKING_QUESTIONS.
// For this change, we'll assume page.tsx will be updated to use DECISION_MAKING_QUESTIONS.
export const UCAT_QUESTIONS = DECISION_MAKING_QUESTIONS;
