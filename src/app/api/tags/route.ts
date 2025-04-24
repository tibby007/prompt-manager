import { getCloudflareContext, createTag, getTagsByUserId } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { name, color } = await request.json();
    
    if (!name) {
      return NextResponse.json(
        { error: 'Tag name is required' },
        { status: 400 }
      );
    }
    
    const { db } = getCloudflareContext(request.cf);
    const tag = await createTag(db, userId, name, color || null);
    
    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error('Create tag error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the tag' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { db } = getCloudflareContext(request.cf);
    const tags = await getTagsByUserId(db, userId);
    
    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error('Get tags error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching tags' },
      { status: 500 }
    );
  }
}
