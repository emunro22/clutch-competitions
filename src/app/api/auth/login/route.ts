import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { signToken, setAuthCookie } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase();

    const { allowed, retryAfterSeconds } = rateLimit(`login:${normalizedEmail}`, 5, 15 * 60 * 1000);
    if (!allowed) {
      return Response.json(
        { error: `Too many login attempts. Try again in ${retryAfterSeconds} seconds.` },
        { status: 429 }
      );
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!user.emailVerified) {
      return Response.json(
        { error: 'Please verify your email before logging in', requiresVerification: true, email: normalizedEmail },
        { status: 403 }
      );
    }

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
    console.error('Login error:', error);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
