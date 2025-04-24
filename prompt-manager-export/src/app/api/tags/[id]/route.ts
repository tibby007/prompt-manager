import { getCloudflareContext, getTagById, updateTag, deleteTag } from '@/lib/db';
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
    const tag = await getTagById(db, params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    if (tag.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ success: true, tag });
  } catch (error) {
    console.error('Get tag error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the tag' },
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
    const tag = await getTagById(db, params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    if (tag.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    const { name, color } = await request.json();
    const updates: any = {};
    
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;
    
    await updateTag(db, params.id, updates);
    
    const updatedTag = await getTagById(db, params.id);
    
    return NextResponse.json({ success: true, tag: updatedTag });
  } catch (error) {
    console.error('Update tag error:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the tag' },
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
    const tag = await getTagById(db, params.id);
    
    if (!tag) {
      return NextResponse.json(
        { error: 'Tag not found' },
        { status: 404 }
      );
    }
    
    if (tag.user_id !== userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }
    
    await deleteTag(db, params.id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete tag error:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the tag' },
      { status: 500 }
    );
  }
}
