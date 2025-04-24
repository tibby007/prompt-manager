import { getCloudflareContext, addTagToPrompt, removeTagFromPrompt, getTagsForPrompt } from '@/lib/db';
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
    
    const { tagId } = await request.json();
    
    if (!tagId) {
      return NextResponse.json(
        { error: 'Tag ID is required' },
        { status: 400 }
      );
    }
    
    const { db } = getCloudflareContext(request.cf);
    await addTagToPrompt(db, params.id, tagId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Add tag to prompt error:', error);
    return NextResponse.json(
      { error: 'An error occurred while adding tag to prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string, tagId: string } }
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
    await removeTagFromPrompt(db, params.id, params.tagId);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove tag from prompt error:', error);
    return NextResponse.json(
      { error: 'An error occurred while removing tag from prompt' },
      { status: 500 }
    );
  }
}

export async function GET(
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
    const tags = await getTagsForPrompt(db, params.id);
    
    return NextResponse.json({ success: true, tags });
  } catch (error) {
    console.error('Get prompt tags error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching prompt tags' },
      { status: 500 }
    );
  }
}
