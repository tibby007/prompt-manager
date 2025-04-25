import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Simple login simulation without db
  if (email === 'test@example.com' && password === 'password') {
    return NextResponse.json({ success: true, user: { email } });
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}

