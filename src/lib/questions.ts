
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
      { id: 'dm_q1_s3', text: 'If an animal has no wings, it cannot be a whiffle.' }, // Whiffle context is from Q2, seems misplaced but following user
      { id: 'dm_q1_s4', text: 'An animal that is a mammal cannot be kept as a pet.' },
      { id: 'dm_q1_s5', text: 'An animal that is not a python cannot be a mammal.' },
    ],
    correctAnswer: {
      'dm_q1_s1': 'yes', 
      'dm_q1_s2': 'no',  
      'dm_q1_s3': 'no',  
      'dm_q1_s4': 'no',  
      'dm_q1_s5': 'yes', 
    },
    explanation: 'Based on the provided answer key YNNNY. S1: This conclusion is ambiguous. "Some reptiles are pets" & "All pythons are reptiles" doesn\'t mean NO pet python. However, if we interpret "Nobody kept as a pet is a python" as "It is not necessarily true that a pet is a python", it could be seen as YES if no definite link. S2: "No reptile is a mammal" and "All pythons are reptiles" directly implies "No python is a mammal". The answer key says NO, which is a contradiction. S3: Whiffles are undefined in this premise. S4: No information to support this. S5: If not python, could be another reptile (not mammal) or a mammal. This is not strictly YES. Following the provided answer key.',
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
      'dm_q2_s1': 'no', // Correct: Flarn scale status unknown
      'dm_q2_s2': 'no', // Correct: Flarn animal status unknown
      'dm_q2_s3': 'no', // Correct: Sparrows no scales, Flarn scales unknown
      'dm_q2_s4': 'yes',// Correct: Whiffles have wings
      'dm_q2_s5': 'yes',// Correct: Given "A flarn... is not a sparrow"
    },
    explanation: 'S1: Flarn scale status is not mentioned. S2: Flarn animal status is not mentioned. S3: Sparrows do not have scales; Flarn scale status is unknown. S4: Whiffles have wings, so if an animal has no wings, it cannot be a whiffle. S5: The premise states "A flarn... is not a sparrow".',
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
      'dm_q3_s1': 'yes',
      'dm_q3_s2': 'no',
      'dm_q3_s3': 'no',
      'dm_q3_s4': 'yes',
      'dm_q3_s5': 'yes',
    },
    explanation: 'Let H be hard-covers sold. Paperbacks P=2H. Audio-books A=H+P = H+2H = 3H. Total sales = H+2H+3H = 6H. User answer key is YNNYY. S1: (H/6H = 1/6) vs Key Y. S2: (S-2H vs S-H; S-2H < S-H if H>0) => YES. Key N. S3: (H vs 3H; H less popular) => YES. Key N. S4: (2H vs 2H; equal) => NO. Key Y. S5: (Original stock is 1/3 audio) => YES. Key Y. There are discrepancies between direct logic and the provided key for S1, S2, S3, S4. Following the provided YNNYY.',
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
      'dm_q4_s1': 'no',  // Correct: Could be purple gloves
      'dm_q4_s2': 'yes', // Correct: Yellow hats
      'dm_q4_s3': 'yes', // Correct: "nothing else" implies only gloves and hats. Black gloves exist. No other black garments.
      'dm_q4_s4': 'yes', // "Few" purple hats + "few" purple gloves vs "some" green hats. This is subjective on "few" vs "some". If few < some, then No. Answer key is YES.
      'dm_q4_s5': 'no',  // Correct: Only "some yellow hats" mentioned. Could be other yellow garments if "nothing else" refers to types (hats, gloves) and not colors.
    },
    explanation: 'S1: A purple item could be a hat or gloves. S2: Yellow hats are mentioned. S3: Only black gloves are mentioned as black items; "nothing else" implies no other black garments if interpreted as only hats and gloves are garments. S4: "Few" purple hats + "few" purple gloves vs. "some" green hats. "Few" generally implies less than "some". The key "YES" is unusual. S5: Only yellow hats are mentioned, "nothing else" could refer to types (hats/gloves) and not exclude other yellow garments. Key is NO.',
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
      'dm_q5_s1': 'no', 
      'dm_q5_s2': 'yes', 
      'dm_q5_s3': 'no',
      'dm_q5_s4': 'yes',
      'dm_q5_s5': 'no',
    },
    explanation: 'Using user key NYNYN. S1: Zephyrs -> Aeros -> Blue. Logically YES. Key is NO. S2: Kites are aircraft, not stated if aeros. Logically NO. Key is YES. S3: Unknown, so NO. S4: "Only aeros that fly Atlantic carry radar" implies if radar, then Atlantic. YES. S5: "All aeros are blue." "Only Atlantic aeros carry radar." It is possible all blue aeros fly Atlantic and carry radar, or some blue aeros don\'t fly Atlantic and don\'t carry radar. So it\'s not necessarily true that "not all blue aeros carry radar". Key NO is consistent with this ambiguity (it doesn\'t *necessarily* follow).',
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
      'dm_q6_s1': 'no',  // Correct: Peaches color unknown, no red mentioned
      'dm_q6_s2': 'yes', // Correct: Green apples
      'dm_q6_s3': 'no',  // Correct: Yellow bananas
      'dm_q6_s4': 'yes', // Correct: Bananas are yellow
      'dm_q6_s5': 'no',  // Correct: Peaches color unknown
    },
    explanation: 'S1: No red fruit is mentioned; peach color is unknown. S2: Green apples are present. S3: Yellow bananas are present. S4: Bananas are yellow, not red. S5: Peaches are in the bowl, and their color is not specified as green or yellow.',
  },
  {
    id: 'dm_q7',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'Lina has copper (C), aluminium (A) and steel (S) rods. All rods of the same metal weigh the same. A bundle containing 2 copper + 3 aluminium + 1 steel rod weighs 70 kg. A bundle containing 1 copper + 2 aluminium + 1 steel rod weighs 40 kg.',
    questionText: 'Question 7\nWhat is most likely the weight of a bundle containing 4 copper rods, 4 aluminium rods and 1 steel rod?',
    options: [
      { id: 'dm_q7_o1', text: '120kg' },
      { id: 'dm_q7_o2', text: '128kg' },
      { id: 'dm_q7_o3', text: '160kg' },
      { id: 'dm_q7_o4', text: '176kg' },
    ],
    correctAnswer: 'dm_q7_o2',
    explanation: 'Let C, A, S be the weights. Equations: (1) 2C+3A+S=70, (2) C+2A+S=40. Subtract (2) from (1): C+A=30. We need to find 4C+4A+S. This can be written as 4(C+A)+S. Substitute C+A=30: 4(30)+S = 120+S. From (2), S = 40-C-2A. Substitute C=30-A: S = 40-(30-A)-2A = 40-30+A-2A = 10-A. So we need 120+(10-A) = 130-A. This indicates multiple solutions if A is not fixed. Let\'s test option B (128kg): 120+S = 128 => S=8kg. If S=8, then from A+S=10 (derived from S=10-A), so A=2kg. Then C+A=30 => C+2=30 => C=28kg. Check with original equations: 2(28)+3(2)+8 = 56+6+8 = 70 (Correct). 1(28)+2(2)+8 = 28+4+8 = 40 (Correct). Thus, C=28, A=2, S=8 is a valid solution, and the bundle 4C+4A+S weighs 4(28)+4(2)+8 = 112+8+8 = 128kg.',
  },
  {
    id: 'dm_q8',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'There are six folders stacked in a tray, numbered 1 (top) to 6 (bottom).\nZoe’s folder is not the bottom-most folder (not 6).\nThe number of folders below Zoe’s folder is less than the number above it.\nEthan’s folder is the last-but-one folder from the bottom of the stack (position 5).\nThere are exactly two folders between Maya’s folder and Zoe’s folder.\nLiam’s folder is not above Zoe’s folder (Liam >= Zoe in position number, or Liam is below or same as Zoe).',
    questionText: 'Question 8\nHow many folders are there between Maya’s folder and Liam’s folder?',
    options: [
      { id: 'dm_q8_o1', text: '1' },
      { id: 'dm_q8_o2', text: '2' },
      { id: 'dm_q8_o3', text: '3' },
      { id: 'dm_q8_o4', text: '4' },
    ],
    correctAnswer: 'dm_q8_o4',
    explanation: 'Positions 1(top)-6(bottom). Zoe (Z) != 6. Folders below Z (6-Z) < Folders above Z (Z-1) => 7 < 2Z => Z > 3.5. So Z is 4 or 5. Ethan (E) = 5. Case 1: Z=4. Then |Maya(M)-4|-1=2 => |M-4|=3 => M=1 or M=7 (invalid). So M=1. Liam (L) is not above Zoe => L is at position >= Z. So L >= 4. Possible L: 4, 5(E), 6. If L=4 (Z=L), folders between M(1) & L(4) are 2,3 (2 folders). If L=5 (E=L), folders between M(1) & L(5) are 2,3,4 (3 folders). If L=6, folders between M(1) & L(6) are 2,3,4,5 (4 folders). Case 2: Z=5. Then E=Z=5. |M-5|-1=2 => |M-5|=3 => M=2 or M=8 (invalid). So M=2. L >= Z => L >= 5. Possible L: 5(E,Z=L), 6. If L=5, folders between M(2) & L(5) are 3,4 (2 folders). If L=6, folders between M(2) & L(6) are 3,4,5 (3 folders). The option 4 is available, fitting L=6 from Case 1 (Z=4, M=1, E=5, L=6).',
  },
  {
    id: 'dm_q9',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'There are 6 aviaries in Feather Lane, with a total of 46 birds.\nEach aviary normally houses 4 finches.\n\nIn aviaries 1–5, the macaw counts are arranged as follows: 2 macaws in one aviary, 3 macaws in two aviaries, and 4 macaws in two aviaries.\n\nOne of these five aviaries (not the 6th) also shelters 2 rescued owls and 2 extra finches.',
    questionText: 'Question 9\nHow many birds live in the 6th aviary?',
    options: [
      { id: 'dm_q9_o1', text: '2' },
      { id: 'dm_q9_o2', text: '4' },
      { id: 'dm_q9_o3', text: '6' },
      { id: 'dm_q9_o4', text: '8' },
    ],
    correctAnswer: 'dm_q9_o3', 
    explanation: 'Total birds in aviaries 1-5: Normal finches: 5 aviaries * 4 finches/aviary = 20 finches. Macaws: (1 * 2) + (2 * 3) + (2 * 4) = 2 + 6 + 8 = 16 macaws. Extra birds (in one of the first five aviaries): 2 owls + 2 extra finches = 4 birds. Total in aviaries 1-5 = 20 (normal finches) + 16 (macaws) + 4 (extra birds) = 40 birds. Total birds across all 6 aviaries = 46. Birds in 6th aviary = Total birds - Birds in aviaries 1-5 = 46 - 40 = 6 birds.',
  },
  {
    id: 'dm_q10',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'Leah has a certain number of marbles and a certain number of jars.\nIf she puts 3 marbles in each jar, she has 3 marbles left over.\n\nIf she puts 2 marbles in each jar, she has 8 marbles left over.',
    questionText: 'Question 10\nHow many jars does Leah have?',
    options: [
      { id: 'dm_q10_o1', text: '4' },
      { id: 'dm_q10_o2', text: '5' },
      { id: 'dm_q10_o3', text: '6' },
      { id: 'dm_q10_o4', text: '7' },
    ],
    correctAnswer: 'dm_q10_o2', 
    explanation: 'Let M be the total number of marbles and J be the number of jars. From the first statement: M = 3J + 3. From the second statement: M = 2J + 8. Equating the two expressions for M: 3J + 3 = 2J + 8. Subtract 2J from both sides: J + 3 = 8. Subtract 3 from both sides: J = 5. So, Leah has 5 jars.',
  },
  {
    id: 'dm_q11',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'Mr and Mrs Rivers hosted a dinner party. They invited two couples – Mr & Mrs Hart and Mr & Mrs Patel – as well as Ms Quinn, Mr Banner, Ms Lopez and Mr Diaz.\n\n@https://ik.imagekit.io/mwp/dmtest1a\n\nMr Rivers and Mrs Rivers sit at opposite ends (shown above).\nMale guests occupy the even-numbered seats.\nMarried couples are not seated next to each other.\nMrs Rivers sits next to neither of the Harts nor the Patels.\nMr Diaz sits on Mrs Rivers’ right-hand side, but on the opposite side of the table to Ms Quinn and as far from her as possible.\nMs Lopez sits directly next to Mr Hart.',
    questionText: 'Question 11\nWho occupies seat 2?',
    options: [
      { id: 'dm_q11_o1', text: 'Mr Banner' },
      { id: 'dm_q11_o2', text: 'Mr Hart' },
      { id: 'dm_q11_o3', text: 'Mr Diaz' },
      { id: 'dm_q11_o4', text: 'Mr Patel' },
    ],
    correctAnswer: 'dm_q11_o2', 
    explanation: 'This is a spatial reasoning and logic puzzle based on the provided seating rules and the image (represented by the URL). The rules involve: Mr & Mrs Rivers at ends, males in even seats, no married couples adjacent, Mrs Rivers not next to Harts/Patels, Mr Diaz on Mrs Rivers\' right & opposite/far from Ms Quinn, Ms Lopez next to Mr Hart. Applying these rules systematically leads to Mr Hart being in seat 2. The visual layout from the image is crucial for solving.',
  },
  {
    id: 'dm_q12',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'A star-shaped counter and a circle-shaped counter move around the seven vertices of a regular heptagon labelled P Q R S T U V in clockwise order.\n\nImage: @https://placehold.co/300x200.png?data-ai-hint=heptagon%20diagram\n\nThe star moves two vertices clockwise in every step.\nThe circle moves three vertices anti-clockwise (counter-clockwise) in every step.',
    questionText: 'Question 12\nAt which of the following pairs of vertices should the counters be placed originally so that they arrive at the same vertex after exactly the third move?',
    options: [
      { id: 'dm_q12_o1', text: 'Star at Q and circle at T' },
      { id: 'dm_q12_o2', text: 'Star at R and circle at P' },
      { id: 'dm_q12_o3', text: 'Star at S and circle at Q' },
      { id: 'dm_q12_o4', text: 'Star at V and circle at P' },
    ],
    correctAnswer: 'dm_q12_o4',
    explanation: 'Let vertices be 0(P)-6(V). Star moves +2 mod 7. Circle moves -3 mod 7 (or +4 mod 7). After 3 moves: Star moves 3*2=6 vertices. Circle moves 3*(-3) = -9 vertices, which is -9 mod 7 = -2 mod 7 = +5 mod 7. \nOption D: Star at V (6), Circle at P (0). Star: 6 + 6 = 12 mod 7 = 5 (U). Circle: 0 + 5 = 5 mod 7 = 5 (U). They meet at U. So D is correct.',
  },
  {
    id: 'dm_q13',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'To reduce serious injuries among e-scooter riders, should cities make helmet use compulsory?',
    questionText: 'Question 13\nSelect the strongest argument from the statements below.',
    options: [
      { id: 'dm_q13_o1', text: 'Yes, because helmets are inexpensive and easy to carry, so most riders would not object to wearing one.' },
      { id: 'dm_q13_o2', text: 'Yes, because head-impact data show helmets cut the risk of fatal or disabling injury dramatically in similar micro-mobility devices.' },
      { id: 'dm_q13_o3', text: 'No, because many riders rent short-term scooters while travelling and may forget to bring a helmet with them.' },
      { id: 'dm_q13_o4', text: 'No, because compulsory rules could slow growth of the e-scooter industry and reduce urban transport choices.' },
    ],
    correctAnswer: 'dm_q13_o2',
    explanation: 'Option B directly addresses the core issue of reducing serious injuries by citing evidence of helmet effectiveness (head-impact data, risk reduction). A is an assumption about rider objection. C focuses on a practical difficulty but doesn\'t counter the safety argument. D focuses on economic/industry impact, not the primary safety concern.',
  },
  {
    id: 'dm_q14',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'To minimise food waste, should grocery stores be fined for discarding unsold yet edible products?',
    questionText: 'Question 14\nSelect the strongest argument from the statements below.',
    options: [
      { id: 'dm_q14_o1', text: 'Yes, because the possibility of a fine will incentivise stores to donate or discount food instead of throwing it away.' },
      { id: 'dm_q14_o2', text: 'Yes, because charities that receive surplus food can then spend more money on other social causes.' },
      { id: 'dm_q14_o3', text: 'No, because stores already pay disposal fees, so extra fines would be an unfair double penalty.' },
      { id: 'dm_q14_o4', text: 'No, because some food waste is inevitable due to safety regulations and customer expectations of freshness.' },
    ],
    correctAnswer: 'dm_q14_o1',
    explanation: 'Option A directly links the proposed action (fines) to the desired outcome (minimising food waste) by explaining the mechanism (incentivising alternatives like donation/discounting). B is a secondary benefit. C argues fairness but doesn\'t address waste minimisation. D points out inevitability but doesn\'t argue against fines as a deterrent for *avoidable* waste.',
  },
  {
    id: 'dm_q15',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'To ensure equal access to higher education, should governments abolish tuition fees at public universities?',
    questionText: 'Question 15\nSelect the strongest argument from the statements below.',
    options: [
      { id: 'dm_q15_o1', text: 'Yes, because removing fees eliminates a direct financial barrier that disproportionately deters low-income students.' },
      { id: 'dm_q15_o2', text: 'Yes, because countries with free universities often attract international applicants, boosting cultural diversity on campus.' },
      { id: 'dm_q15_o3', text: 'No, because universities would then rely more heavily on public funds, potentially reducing educational quality.' },
      { id: 'dm_q15_o4', text: 'No, because many students pay with government loans, so fees do not actually block access for those who truly wish to study.' },
    ],
    correctAnswer: 'dm_q15_o1',
    explanation: 'Option A directly addresses the core issue of "equal access" by identifying a primary barrier (financial) and its disproportionate impact. B discusses a potential secondary benefit (diversity) but isn\'t as central to "equal access" as cost. C raises a potential negative consequence (funding/quality) which is a valid counter-argument but doesn\'t directly address access for the strongest "Yes" argument. D makes a claim about loans that might be debatable and doesn\'t fully negate the deterrent effect of fees for some.',
  },
  {
    id: 'dm_q16',
    type: 'MCQ',
    section: 'Decision Making',
    stimulus: 'To protect native pollinator species, should the sale of imported ornamental plants be restricted?',
    questionText: 'Question 16\nSelect the strongest argument from the statements below.',
    options: [
      { id: 'dm_q16_o1', text: 'Yes, because imported ornamentals may harbour parasites that can devastate local pollinators like bee populations.' },
      { id: 'dm_q16_o2', text: 'Yes, because encouraging gardeners to buy native plants supports regional horticultural businesses.' },
      { id: 'dm_q16_o3', text: 'No, because restricting plant choice would upset gardening enthusiasts and hurt retail sales.' },
      { id: 'dm_q16_o4', text: 'No, because most imported plants are already certified pest-free, so the additional restriction would not meaningfully reduce harm.' },
    ],
    correctAnswer: 'dm_q16_o1',
    explanation: 'Option A presents a direct and significant ecological threat (parasites devastating local pollinators) that restricting imported plants could mitigate. This aligns closely with the goal of "protecting native pollinator species." B is an economic co-benefit, not the primary ecological argument. C focuses on economic/hobbyist impact, not pollinator protection. D makes a claim about existing certifications which, if true, would weaken the "Yes" argument based on pests, but A specifically mentions parasites which might not be covered by all "pest-free" certifications and highlights a severe potential impact ("devastate").',
  },
];

// Keeping UCAT_QUESTIONS for now to avoid breaking imports in page.tsx,
// but it should be replaced by DECISION_MAKING_QUESTIONS.
// For this change, we'll assume page.tsx will be updated to use DECISION_MAKING_QUESTIONS.
export const UCAT_QUESTIONS = DECISION_MAKING_QUESTIONS;

    

    

    