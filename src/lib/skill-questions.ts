export interface SkillQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
}

// UK prize competitions require entrants to answer a question involving skill
// or judgement so the competition isn't classed as a game of pure chance
// (illegal lottery) under the Gambling Act 2005. A fresh question is picked at
// random for every checkout attempt.
export const skillQuestions: SkillQuestion[] = [
  { id: 'q1', question: 'What is the capital of Spain?', options: ['Lisbon', 'Madrid', 'Barcelona', 'Seville'], answerIndex: 1 },
  { id: 'q2', question: 'What is the capital of France?', options: ['Marseille', 'Lyon', 'Paris', 'Nice'], answerIndex: 2 },
  { id: 'q3', question: 'What is the capital of Italy?', options: ['Milan', 'Rome', 'Venice', 'Naples'], answerIndex: 1 },
  { id: 'q4', question: 'What is the capital of Germany?', options: ['Munich', 'Hamburg', 'Frankfurt', 'Berlin'], answerIndex: 3 },
  { id: 'q5', question: 'What is the capital of Scotland?', options: ['Glasgow', 'Edinburgh', 'Aberdeen', 'Dundee'], answerIndex: 1 },
  { id: 'q6', question: 'What is the capital of Wales?', options: ['Swansea', 'Newport', 'Cardiff', 'Bangor'], answerIndex: 2 },
  { id: 'q7', question: 'What is the capital of Portugal?', options: ['Porto', 'Lisbon', 'Faro', 'Braga'], answerIndex: 1 },
  { id: 'q8', question: 'What is the capital of Japan?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'], answerIndex: 2 },
  { id: 'q9', question: 'How many days are there in a week?', options: ['5', '6', '7', '8'], answerIndex: 2 },
  { id: 'q10', question: 'How many months are there in a year?', options: ['10', '11', '12', '13'], answerIndex: 2 },
  { id: 'q11', question: 'What is 5 + 7?', options: ['10', '11', '12', '13'], answerIndex: 2 },
  { id: 'q12', question: 'What is 9 x 3?', options: ['24', '27', '30', '18'], answerIndex: 1 },
  { id: 'q13', question: 'What is 100 - 45?', options: ['55', '65', '45', '50'], answerIndex: 0 },
  { id: 'q14', question: 'What colour do you get when you mix blue and yellow?', options: ['Purple', 'Orange', 'Green', 'Brown'], answerIndex: 2 },
  { id: 'q15', question: 'How many sides does a triangle have?', options: ['2', '3', '4', '5'], answerIndex: 1 },
  { id: 'q16', question: 'How many sides does a hexagon have?', options: ['5', '6', '7', '8'], answerIndex: 1 },
  { id: 'q17', question: 'What is the largest ocean on Earth?', options: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], answerIndex: 3 },
  { id: 'q18', question: 'What is the largest planet in our solar system?', options: ['Earth', 'Saturn', 'Jupiter', 'Mars'], answerIndex: 2 },
  { id: 'q19', question: 'What is the closest planet to the Sun?', options: ['Venus', 'Mercury', 'Earth', 'Mars'], answerIndex: 1 },
  { id: 'q20', question: 'What currency is used in the United Kingdom?', options: ['Euro', 'Dollar', 'Pound Sterling', 'Franc'], answerIndex: 2 },
  { id: 'q21', question: 'Which animal is known as the "King of the Jungle"?', options: ['Tiger', 'Elephant', 'Lion', 'Gorilla'], answerIndex: 2 },
  { id: 'q22', question: 'What is the freezing point of water in Celsius?', options: ['0°C', '10°C', '32°C', '-10°C'], answerIndex: 0 },
  { id: 'q23', question: 'What is the boiling point of water in Celsius?', options: ['90°C', '100°C', '120°C', '80°C'], answerIndex: 1 },
  { id: 'q24', question: 'Which is the smallest prime number?', options: ['0', '1', '2', '3'], answerIndex: 2 },
  { id: 'q25', question: 'How many continents are there?', options: ['5', '6', '7', '8'], answerIndex: 2 },
  { id: 'q26', question: 'What do bees produce?', options: ['Milk', 'Honey', 'Silk', 'Wax'], answerIndex: 1 },
  { id: 'q27', question: 'What is the tallest mountain in the world?', options: ['K2', 'Kilimanjaro', 'Everest', 'Denali'], answerIndex: 2 },
  { id: 'q28', question: 'How many legs does a spider have?', options: ['6', '8', '10', '4'], answerIndex: 1 },
  { id: 'q29', question: 'What is the capital of England?', options: ['Manchester', 'Liverpool', 'London', 'Birmingham'], answerIndex: 2 },
  { id: 'q30', question: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], answerIndex: 2 },
  { id: 'q31', question: 'What is 12 divided by 4?', options: ['2', '3', '4', '6'], answerIndex: 1 },
  { id: 'q32', question: 'How many hours are there in a day?', options: ['12', '20', '24', '30'], answerIndex: 2 },
  { id: 'q33', question: 'What gas do plants absorb from the atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], answerIndex: 1 },
  { id: 'q34', question: 'What is the main ingredient in guacamole?', options: ['Tomato', 'Avocado', 'Onion', 'Pepper'], answerIndex: 1 },
  { id: 'q35', question: 'Which shape has four equal sides?', options: ['Rectangle', 'Triangle', 'Square', 'Circle'], answerIndex: 2 },
];

export function getRandomSkillQuestion(): SkillQuestion {
  return skillQuestions[Math.floor(Math.random() * skillQuestions.length)];
}

export function checkSkillAnswer(questionId: string, answerIndex: number): boolean {
  const question = skillQuestions.find((q) => q.id === questionId);
  if (!question) return false;
  return question.answerIndex === answerIndex;
}
