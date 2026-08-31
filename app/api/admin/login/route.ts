import { NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { ADMIN_PASSWORD } from '@/config/config';

export const runtime = 'nodejs';

function matches(candidate: string, expected: string): boolean {
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD is not set in the environment.');
    return NextResponse.json(
      { error: 'Admin password is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const { password } = await request.json();

    if (typeof password !== 'string' || !password) {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    if (!matches(password, ADMIN_PASSWORD)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }
}
