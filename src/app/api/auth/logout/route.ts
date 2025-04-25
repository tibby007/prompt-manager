import { NextResponse } from 'next/server';

export async function POST() {
  // No real session to clear, so just simulate a logout
  return NextResponse.json({ success: true });
}

