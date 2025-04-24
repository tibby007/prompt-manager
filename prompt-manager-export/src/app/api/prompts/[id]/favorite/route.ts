import { getCloudflareContext, toggleFavorite } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { db } = getCloudflareContext(request.cf);
    await toggleFavorite(db, params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    return NextResponse.json(
      { error: 'An error occurred while toggling favorite status' },
      { status: 500 }
    );
  }
}
