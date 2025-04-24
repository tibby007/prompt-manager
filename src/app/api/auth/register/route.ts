import { getCloudflareContext } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
        { status: 400 }
      );
    }
    
    const { db } = getCloudflareContext(request.cf);
    const user = await registerUser(db, email, name);
    
    return NextResponse.json({ 
      success: true, 
      user: { id: user.id, email: user.email, name: user.name } 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
