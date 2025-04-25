import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { query } = await request.json();

  // Return a dummy prompt list based on search term
  return NextResponse.json({
    results: [
      {
        id: '123',
        title: `Search result for "${query}"`,
        content: 'Example prompt content',
      },
    ],
  });
}

    
