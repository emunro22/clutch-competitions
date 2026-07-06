import { getRandomSkillQuestion } from '@/lib/skill-questions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const question = getRandomSkillQuestion();
  return Response.json({
    id: question.id,
    question: question.question,
    options: question.options,
  });
}
