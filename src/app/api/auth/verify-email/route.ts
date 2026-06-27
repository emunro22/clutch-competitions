import { db } from '@/lib/db';
import { users, verificationCodes } from '@/lib/db/schema';
import { signToken, setAuthCookie } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { eq, and, gt, isNull } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return Response.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const { allowed, retryAfterSeconds } = rateLimit(`verify-check:${normalizedEmail}`, 5, 5 * 60 * 1000);
    if (!allowed) {
      return Response.json(
        { error: `Too many attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const [user] = await db
      .select({ id: users.id, email: users.email, name: users.name, role: users.role })
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return Response.json({ error: 'Invalid verification code' }, { status: 400 });
    }

    const [validCode] = await db
      .select()
      .from(verificationCodes)
      .where(
        and(
          eq(verificationCodes.userId, user.id),
          eq(verificationCodes.code, code),
          eq(verificationCodes.type, 'email_verification'),
          gt(verificationCodes.expiresAt, new Date()),
          isNull(verificationCodes.usedAt)
        )
      )
      .limit(1);

    if (!validCode) {
      return Response.json({ error: 'Invalid or expired verification code' }, { status: 400 });
    }

    await db.update(verificationCodes)
      .set({ usedAt: new Date() })
      .where(eq(verificationCodes.id, validCode.id));

    await db.update(users)
      .set({ emailVerified: true, updatedAt: new Date() })
      .where(eq(users.id, user.id));

    const token = signToken({ userId: user.id, email: user.email, role: user.role });
    const cookie = setAuthCookie(token);

    const response = Response.json({
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });

    response.headers.set(
      'Set-Cookie',
      `${cookie.name}=${cookie.value}; Path=${cookie.options.path}; Max-Age=${cookie.options.maxAge}; HttpOnly; SameSite=${cookie.options.sameSite}${cookie.options.secure ? '; Secure' : ''}`
    );

    return response;
  } catch (error) {
    console.error('Verify email error:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
