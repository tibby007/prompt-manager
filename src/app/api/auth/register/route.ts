import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { email, password, name } = await request.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: 'Email and password are required' },
      { status: 400 }
    );
  }

  // Just return mock user info for now
  return NextResponse.json({
    success: true,
    user: {
      id: 'new_user',
      email,
      name: name || 'New User',
    },
  });
}

