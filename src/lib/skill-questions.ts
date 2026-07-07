export interface SkillQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

// UK prize competitions require entrants to answer a question involving skill
// or judgement so the competition isn't classed as a game of pure chance
// (illegal lottery) under the Gambling Act 2005. A fresh question is picked at
// random for every checkout attempt. Kept deliberately easy (basic arithmetic
// and everyday knowledge) so it's quick to answer, not a real obstacle.
export const skillQuestions: SkillQuestion[] = [
  { id: 'q1', question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answerIndex: 1 },
  { id: 'q2', question: 'What is 5 + 5?', options: ['10', '15', '5', '20'], answerIndex: 0 },
  { id: 'q3', question: 'What is 10 - 4?', options: ['4', '5', '6', '7'], answerIndex: 2 },
  { id: 'q4', question: 'What is 3 + 1?', options: ['2', '3', '4', '5'], answerIndex: 2 },
  { id: 'q5', question: 'What is 2 x 3?', options: ['5', '6', '7', '8'], answerIndex: 1 },
  { id: 'q6', question: 'How many days are there in a week?', options: ['5', '6', '7', '8'], answerIndex: 2 },
  { id: 'q7', question: 'How many months are there in a year?', options: ['10', '11', '12', '13'], answerIndex: 2 },
  { id: 'q8', question: 'What colour is the sky on a clear day?', options: ['Green', 'Blue', 'Red', 'Purple'], answerIndex: 1 },
  { id: 'q9', question: 'What colour is grass?', options: ['Blue', 'Red', 'Green', 'Yellow'], answerIndex: 2 },
  { id: 'q10', question: 'How many wheels does a car usually have?', options: ['2', '3', '4', '6'], answerIndex: 2 },
  { id: 'q11', question: 'How many days are there in a weekend?', options: ['1', '2', '3', '4'], answerIndex: 1 },
  { id: 'q12', question: 'What is 1 + 1?', options: ['1', '2', '3', '4'], answerIndex: 1 },
  { id: 'q13', question: 'What comes after Monday?', options: ['Wednesday', 'Sunday', 'Tuesday', 'Friday'], answerIndex: 2 },
  { id: 'q14', question: 'How many legs does a dog have?', options: ['2', '4', '6', '8'], answerIndex: 1 },
  { id: 'q15', question: 'What is 10 + 10?', options: ['15', '20', '25', '30'], answerIndex: 1 },
];

export function getRandomSkillQuestion(): SkillQuestion {
  return skillQuestions[Math.floor(Math.random() * skillQuestions.length)];
}

export function checkSkillAnswer(questionId: string, answerIndex: number): boolean {
  const question = skillQuestions.find((q) => q.id === questionId);
  if (!question) return false;
  return question.answerIndex === answerIndex;
}
