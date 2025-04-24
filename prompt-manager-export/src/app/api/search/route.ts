import { getCloudflareContext, searchPrompts } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }
    
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const { db } = getCloudflareContext(request.cf);
    const prompts = await searchPrompts(db, userId, query, limit, offset);
    
    return NextResponse.json({ success: true, prompts });
  } catch (error) {
    console.error('Search prompts error:', error);
    return NextResponse.json(
      { error: 'An error occurred while searching prompts' },
      { status: 500 }
    );
  }
}
