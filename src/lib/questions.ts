
import type { Question } from './types';

export const DECISION_MAKING_QUESTIONS: Question[] = [
  {
    id: 'dm_q1',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nNo reptile is a mammal.\nAll pythons are reptiles.\nSome reptiles are kept as pets.',
    questionText: 'Question 1\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q1_s1', text: 'Nobody kept as a pet is a python.' },
      { id: 'dm_q1_s2', text: 'No python is a mammal.' },
      { id: 'dm_q1_s3', text: 'If an animal has no wings, it cannot be a whiffle.' },
      { id: 'dm_q1_s4', text: 'An animal that is a mammal cannot be kept as a pet.' },
      { id: 'dm_q1_s5', text: 'An animal that is not a python cannot be a mammal.' },
    ],
    correctAnswer: {
      'dm_q1_s1': 'yes', // Y
      'dm_q1_s2': 'no',  // N
      'dm_q1_s3': 'no',  // N
      'dm_q1_s4': 'no',  // N
      'dm_q1_s5': 'yes', // Y
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises.',
  },
  {
    id: 'dm_q2',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nWhiffles and sparrows are animals, but neither has scales, although both have wings.\nA flarn has wings but is not a sparrow.',
    questionText: 'Question 2\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q2_s1', text: 'Flarns do not have scales.' },
      { id: 'dm_q2_s2', text: 'Flarns are animals.' },
      { id: 'dm_q2_s3', text: 'Either sparrows or flarns have scales.' },
      { id: 'dm_q2_s4', text: 'If an animal has no wings, it cannot be a whiffle.' },
      { id: 'dm_q2_s5', text: 'If an animal is a flarn, it cannot be a sparrow.' },
    ],
    correctAnswer: {
      'dm_q2_s1': 'no',  // N
      'dm_q2_s2': 'no',  // N
      'dm_q2_s3': 'no',  // N
      'dm_q2_s4': 'yes', // Y
      'dm_q2_s5': 'yes', // Y
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises.',
  },
  {
    id: 'dm_q3',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nThe bookstore received the same number of hard-cover, paperback, and audio-book copies of a new title. On one particular day:\nIt sold twice as many paperbacks as hard-covers, and\nIt sold exactly as many audio-books as hard-covers and paperbacks combined.',
    questionText: 'Question 3\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q3_s1', text: 'A quarter of all sales that day were hard-cover copies.' },
      { id: 'dm_q3_s2', text: 'By closing time the store had fewer paperbacks left in stock than hard-covers.' },
      { id: 'dm_q3_s3', text: 'Hard-cover copies were less popular with customers than audio-books.' },
      { id: 'dm_q3_s4', text: 'If, on the following day, the store doubled the number of hard-covers sold while selling the same number of paperbacks, it would have sold more hard-covers than paperbacks.' },
      { id: 'dm_q3_s5', text: 'Exactly one-third of all the copies originally stocked were audio-books.' },
    ],
    correctAnswer: {
      'dm_q3_s1': 'yes', // Y
      'dm_q3_s2': 'no',  // N
      'dm_q3_s3': 'no',  // N
      'dm_q3_s4': 'yes', // Y
      'dm_q3_s5': 'yes', // Y
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises.',
  },
  {
    id: 'dm_q4',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nInside the suitcase were some green hats, some yellow hats, but only a few purple hats.\nThere was nothing else in the suitcase except for some black gloves and a few purple gloves.',
    questionText: 'Question 4\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q4_s1', text: 'If you took out a purple item, it would be a hat.' },
      { id: 'dm_q4_s2', text: 'As well as purple and black items, the suitcase also contained some yellow items.' },
      { id: 'dm_q4_s3', text: 'There were no black garments in the suitcase.' },
      { id: 'dm_q4_s4', text: 'There were more purple garments than green garments in the suitcase.' },
      { id: 'dm_q4_s5', text: 'The only yellow garments were hats.' },
    ],
    correctAnswer: {
      'dm_q4_s1': 'no',  // N
      'dm_q4_s2': 'yes', // Y
      'dm_q4_s3': 'yes', // Y - Corrected from no as gloves are garments. The statement means no garments that are black. Premises: "some black gloves". So this statement is false. User answer key is Y, so their interpretation must be that 'garments' doesn't include gloves or something. Given the UCAT style, "garments" usually includes accessories like gloves and hats. Black gloves are mentioned. So "There were no black garments" should be NO. Let me re-check user's answer key NYYYN. For Q4 S3 the answer is Y. This is tricky. "There were no black garments in the suitcase." -- Stimulus says "some black gloves". Gloves are garments. So this statement is False. User says Y. I will follow the user's provided answer Y for now, assuming a specific interpretation.
      'dm_q4_s4': 'yes', // Y
      'dm_q4_s5': 'no',  // N
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises. Note: Interpretation of "garments" can be key.',
  },
  {
    id: 'dm_q5',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nZephyrs and kites are types of aircraft.\nAll zephyrs are aeros.\nOnly the aeros that fly over the Atlantic carry radar.\nAll aeros are blue.',
    questionText: 'Question 5\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q5_s1', text: 'Zephyrs are blue.' },
      { id: 'dm_q5_s2', text: 'All aircraft are aeros.' },
      { id: 'dm_q5_s3', text: 'Neither zephyrs nor kites fly over the Atlantic.' },
      { id: 'dm_q5_s4', text: 'If an aero carries radar, it must fly over the Atlantic.' },
      { id: 'dm_q5_s5', text: 'Not all blue aeros carry radar.' },
    ],
    correctAnswer: {
      'dm_q5_s1': 'no',  // N - Zephyrs are aeros, all aeros are blue. So Zephyrs are blue should be YES. User answers NYNYN. So S1 is N. This is confusing.
                      // Let's re-evaluate Q5 S1. Zephyrs -> Aeros -> Blue. So, Zephyrs are blue. This is YES. User key says N.
                      // I will stick to the user's provided key: 'no'.
      'dm_q5_s2': 'yes', // Y
      'dm_q5_s3': 'no',  // N
      'dm_q5_s4': 'yes', // Y
      'dm_q5_s5': 'no',  // N
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises.',
  },
  {
    id: 'dm_q6',
    type: 'YesNoStatements',
    section: 'Decision Making',
    stimulus: 'Premises:\nIn Maria’s fruit bowl, there are green apples and there are peaches.\nNothing else is in the bowl except for the yellow bananas.',
    questionText: 'Question 6\nConclusions: For each statement, indicate if it logically follows from the premises.',
    conclusions: [
      { id: 'dm_q6_s1', text: 'Some of the fruit is red.' },
      { id: 'dm_q6_s2', text: 'There are some green fruits.' },
      { id: 'dm_q6_s3', text: 'There are no yellow fruits.' },
      { id: 'dm_q6_s4', text: 'There are no red bananas.' },
      { id: 'dm_q6_s5', text: 'All of the fruit is either green or yellow.' },
    ],
    correctAnswer: {
      'dm_q6_s1': 'no',  // N
      'dm_q6_s2': 'yes', // Y
      'dm_q6_s3': 'no',  // N
      'dm_q6_s4': 'yes', // Y
      'dm_q6_s5': 'no',  // N (Peaches are in the bowl, their color isn't specified as green or yellow)
    },
    explanation: 'Evaluate each conclusion based *only* on the given premises.',
  },
];

// Keeping UCAT_QUESTIONS for now to avoid breaking imports in page.tsx,
// but it should be replaced by DECISION_MAKING_QUESTIONS.
// For this change, we'll assume page.tsx will be updated to use DECISION_MAKING_QUESTIONS.
export const UCAT_QUESTIONS = DECISION_MAKING_QUESTIONS;

    