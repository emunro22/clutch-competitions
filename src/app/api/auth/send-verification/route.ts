import { db } from '@/lib/db';
import { users, verificationCodes } from '@/lib/db/schema';
import { sendVerificationCode } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';
import { eq, and, gt } from 'drizzle-orm';
import { v4 as uuid } from 'uuid';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const { allowed, retryAfterSeconds } = rateLimit(`verify:${normalizedEmail}`, 3, 5 * 60 * 1000);
    if (!allowed) {
      return Response.json(
        { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const [user] = await db
      .select({ id: users.id, name: users.name, emailVerified: users.emailVerified })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return Response.json({ success: true });
    }

    if (user.emailVerified) {
      return Response.json({ success: true });
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.insert(verificationCodes).values({
      id: uuid(),
      userId: user.id,
      code,
      type: 'email_verification',
      expiresAt,
    });

    await sendVerificationCode({
      email: normalizedEmail,
      name: user.name,
      code,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Send verification error:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
