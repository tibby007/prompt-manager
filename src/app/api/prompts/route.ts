import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();
  return NextResponse.json({
    id: 'new_prompt_id',
    title,
    content,
    createdAt: new Date().toISOString(),
  });
}
