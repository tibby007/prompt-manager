import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(request: NextRequest) {
  const { name } = await request.json();

  return NextResponse.json({
    success: true,
    updatedTag: { id: 'mock-id', name },
  });
}

export async function DELETE() {
  return NextResponse.json({ success: true, message: 'Tag deleted' });
}

  
 
