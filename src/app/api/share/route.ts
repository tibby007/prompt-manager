import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUserId } from '@/lib/auth';
import { getCloudflareContext, createPrompt } from '@/lib/db';

// This route handles the Web Share Target API
export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    
    if (!userId) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    const formData = await request.formData();
    const title = formData.get('title') as string || null;
    const text = formData.get('text') as string || null;
    const url = formData.get('url') as string || null;
    
    // Combine the shared content into a prompt
    let content = '';
    let source = null;
    
    if (text) {
      content = text;
    }
    
    if (url) {
      source = url;
      if (content) {
        content += `\n\nSource: ${url}`;
      } else {
        content = `Shared from: ${url}`;
      }
    }
    
    if (!content && title) {
      content = title;
    } else if (title && content) {
      content = `${title}\n\n${content}`;
    }
    
    if (!content) {
      return NextResponse.redirect(new URL('/?error=empty-share', request.url));
    }
    
    // Save the prompt to the database
    const { db } = getCloudflareContext(request.cf);
    await createPrompt(db, userId, content, title, source);
    
    // Redirect to the home page with success message
    return NextResponse.redirect(new URL('/?share=success', request.url));
  } catch (error) {
    console.error('Share error:', error);
    return NextResponse.redirect(new URL('/?error=share-failed', request.url));
  }
}
