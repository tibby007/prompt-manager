import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ id: 'mock-id', title: 'Example Prompt', content: 'Prompt content' });
}

