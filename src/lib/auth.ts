// Simple authentication utilities
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { D1Database } from '@cloudflare/workers-types';
import { createUser, getUserByEmail, User } from './db';

// Session cookie name
const SESSION_COOKIE = 'prompt_manager_session';

// Session data structure
export interface Session {
  userId: string;
  email: string;
  name?: string;
  expiresAt: number; // Unix timestamp
}

// Create a new session for a user
export function createSession(user: User): Session {
  return {
    userId: user.id,
    email: user.email,
    name: user.name || undefined,
    // Session expires in 30 days
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
  };
}

// Save session to cookies
export function saveSession(session: Session): void {
  cookies().set({
    name: SESSION_COOKIE,
    value: JSON.stringify(session),
    expires: new Date(session.expiresAt),
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}

// Get current session from cookies
export function getSession(): Session | null {
  const sessionCookie = cookies().get(SESSION_COOKIE);
  
  if (!sessionCookie) {
    return null;
  }
  
  try {
    const session = JSON.parse(sessionCookie.value) as Session;
    
    // Check if session is expired
    if (session.expiresAt < Date.now()) {
      cookies().delete(SESSION_COOKIE);
      return null;
    }
    
    return session;
  } catch (error) {
    cookies().delete(SESSION_COOKIE);
    return null;
  }
}

// Clear session (logout)
export function clearSession(): void {
  cookies().delete(SESSION_COOKIE);
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  return getSession() !== null;
}

// Get current user ID
export function getCurrentUserId(): string | null {
  const session = getSession();
  return session ? session.userId : null;
}

// Redirect to login if not authenticated
export function requireAuth() {
  if (!isAuthenticated()) {
    redirect('/login');
  }
}

// Login user
export async function loginUser(db: D1Database, email: string, password: string): Promise<User | null> {
  // In a real app, you would verify the password here
  // For this simplified version, we're just checking if the user exists
  const user = await getUserByEmail(db, email);
  
  if (user) {
    const session = createSession(user);
    saveSession(session);
    return user;
  }
  
  return null;
}

// Register new user
export async function registerUser(db: D1Database, email: string, name: string): Promise<User> {
  // In a real app, you would hash the password here
  const user = await createUser(db, email, name);
  const session = createSession(user);
  saveSession(session);
  return user;
}

// Logout user
export function logoutUser(): void {
  clearSession();
}
