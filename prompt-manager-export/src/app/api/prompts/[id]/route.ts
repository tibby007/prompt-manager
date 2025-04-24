import { getCloudflareContext, getPromptById, updatePrompt, deletePrompt } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';

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
    const prompt = await getPromptById(db, params.id);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    if (prompt.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ success: true, prompt });
  } catch (error) {
    console.error('Get prompt error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the prompt' },
      { status: 500 }
    );
  }
}

export async function PUT(
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
    const prompt = await getPromptById(db, params.id);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    if (prompt.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { content, title, source, is_favorite } = await request.json();
    const updates: any = {};
    
    if (content !== undefined) updates.content = content;
    if (title !== undefined) updates.title = title;
    if (source !== undefined) updates.source = source;
    if (is_favorite !== undefined) updates.is_favorite = is_favorite;
    
    await updatePrompt(db, params.id, updates);
    
    const updatedPrompt = await getPromptById(db, params.id);
    
    return NextResponse.json({ success: true, prompt: updatedPrompt });
  } catch (error) {
    console.error('Update prompt error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the prompt' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    const prompt = await getPromptById(db, params.id);
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }
    
    if (prompt.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await deletePrompt(db, params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete prompt error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the prompt' },
      { status: 500 }
    );
  }
}
