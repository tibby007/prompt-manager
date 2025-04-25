import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    tags: [
      { id: '1', name: 'AI' },
      { id: '2', name: 'Marketing' },
      { id: '3', name: 'Sales' },
    ],
  });
}

   
