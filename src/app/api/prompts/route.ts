import { getCloudflareContext, createPrompt, getPromptsByUserId } from '@/lib/db';
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
    
    const { content, title, source } = await request.json();
    
    if (!content) {
      return NextResponse.json(
        { error: 'Prompt content is required' },
        { status: 400 }
      );
    }
    
    const { db } = getCloudflareContext(request.cf);
    const prompt = await createPrompt(db, userId, content, title || null, source || null);
    
    return NextResponse.json({ success: true, prompt });
  } catch (error) {
    console.error('Create prompt error:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the prompt' },
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
    
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    
    const { db } = getCloudflareContext(request.cf);
    const prompts = await getPromptsByUserId(db, userId, limit, offset);
    
    return NextResponse.json({ success: true, prompts });
  } catch (error) {
    console.error('Get prompts error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching prompts' },
      { status: 500 }
    );
  }
}
