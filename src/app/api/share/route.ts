import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const { promptId } = await request.json();

  return NextResponse.json({
    success: true,
    message: `Prompt ${promptId} shared successfully`,
  });
}
