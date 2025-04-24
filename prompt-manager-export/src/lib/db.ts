import { D1Database } from '@cloudflare/workers-types';

// Type definitions for our database models
export interface User {
  id: string;
  email: string;
  name: string | null;
  created_at: string;
}

export interface Prompt {
  id: string;
  user_id: string;
  content: string;
  title: string | null;
  source: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
}

export interface PromptTag {
  prompt_id: string;
  tag_id: string;
}

export interface Note {
  id: string;
  prompt_id: string;
  content: string;
  created_at: string;
  updated_at: string;
}

// Database context to be used throughout the application
export interface DatabaseContext {
  db: D1Database;
}

// Get database context from Cloudflare environment
export function getCloudflareContext(env: any): DatabaseContext {
  return {
    db: env.DB,
  };
}

// Helper function to generate unique IDs
export function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

// Database utility functions

// User operations
export async function createUser(db: D1Database, email: string, name: string | null = null): Promise<User> {
  const id = generateId('user');
  await db.prepare(
    'INSERT INTO users (id, email, name) VALUES (?, ?, ?)'
  ).bind(id, email, name).run();
  
  return {
    id,
    email,
    name,
    created_at: new Date().toISOString(),
  };
}

export async function getUserByEmail(db: D1Database, email: string): Promise<User | null> {
  const result = await db.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first<User>();
  
  return result || null;
}

export async function getUserById(db: D1Database, id: string): Promise<User | null> {
  const result = await db.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(id).first<User>();
  
  return result || null;
}

// Prompt operations
export async function createPrompt(
  db: D1Database, 
  user_id: string, 
  content: string, 
  title: string | null = null, 
  source: string | null = null
): Promise<Prompt> {
  const id = generateId('prompt');
  const now = new Date().toISOString();
  
  await db.prepare(
    'INSERT INTO prompts (id, user_id, content, title, source, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, user_id, content, title, source, now, now).run();
  
  return {
    id,
    user_id,
    content,
    title,
    source,
    is_favorite: false,
    created_at: now,
    updated_at: now,
  };
}

export async function updatePrompt(
  db: D1Database, 
  id: string, 
  updates: Partial<Omit<Prompt, 'id' | 'user_id' | 'created_at'>>
): Promise<void> {
  const sets: string[] = [];
  const values: any[] = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    sets.push(`${key} = ?`);
    values.push(value);
  });
  
  // Always update the updated_at timestamp
  sets.push('updated_at = ?');
  values.push(new Date().toISOString());
  
  // Add the id as the last parameter
  values.push(id);
  
  await db.prepare(
    `UPDATE prompts SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function deletePrompt(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM prompts WHERE id = ?').bind(id).run();
}

export async function getPromptById(db: D1Database, id: string): Promise<Prompt | null> {
  const result = await db.prepare(
    'SELECT * FROM prompts WHERE id = ?'
  ).bind(id).first<Prompt>();
  
  return result || null;
}

export async function getPromptsByUserId(
  db: D1Database, 
  user_id: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<Prompt[]> {
  const result = await db.prepare(
    'SELECT * FROM prompts WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?'
  ).bind(user_id, limit, offset).all<Prompt>();
  
  return result.results;
}

export async function getFavoritePrompts(
  db: D1Database, 
  user_id: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<Prompt[]> {
  const result = await db.prepare(
    'SELECT * FROM prompts WHERE user_id = ? AND is_favorite = 1 ORDER BY updated_at DESC LIMIT ? OFFSET ?'
  ).bind(user_id, limit, offset).all<Prompt>();
  
  return result.results;
}

export async function toggleFavorite(db: D1Database, id: string): Promise<void> {
  await db.prepare(
    'UPDATE prompts SET is_favorite = NOT is_favorite, updated_at = ? WHERE id = ?'
  ).bind(new Date().toISOString(), id).run();
}

// Tag operations
export async function createTag(
  db: D1Database, 
  user_id: string, 
  name: string, 
  color: string | null = null
): Promise<Tag> {
  const id = generateId('tag');
  
  await db.prepare(
    'INSERT INTO tags (id, user_id, name, color) VALUES (?, ?, ?, ?)'
  ).bind(id, user_id, name, color).run();
  
  return {
    id,
    user_id,
    name,
    color,
  };
}

export async function updateTag(
  db: D1Database, 
  id: string, 
  updates: Partial<Omit<Tag, 'id' | 'user_id'>>
): Promise<void> {
  const sets: string[] = [];
  const values: any[] = [];
  
  Object.entries(updates).forEach(([key, value]) => {
    sets.push(`${key} = ?`);
    values.push(value);
  });
  
  // Add the id as the last parameter
  values.push(id);
  
  await db.prepare(
    `UPDATE tags SET ${sets.join(', ')} WHERE id = ?`
  ).bind(...values).run();
}

export async function deleteTag(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM tags WHERE id = ?').bind(id).run();
}

export async function getTagsByUserId(db: D1Database, user_id: string): Promise<Tag[]> {
  const result = await db.prepare(
    'SELECT * FROM tags WHERE user_id = ? ORDER BY name'
  ).bind(user_id).all<Tag>();
  
  return result.results;
}

export async function getTagById(db: D1Database, id: string): Promise<Tag | null> {
  const result = await db.prepare(
    'SELECT * FROM tags WHERE id = ?'
  ).bind(id).first<Tag>();
  
  return result || null;
}

// Prompt-Tag operations
export async function addTagToPrompt(db: D1Database, prompt_id: string, tag_id: string): Promise<void> {
  await db.prepare(
    'INSERT OR IGNORE INTO prompt_tags (prompt_id, tag_id) VALUES (?, ?)'
  ).bind(prompt_id, tag_id).run();
}

export async function removeTagFromPrompt(db: D1Database, prompt_id: string, tag_id: string): Promise<void> {
  await db.prepare(
    'DELETE FROM prompt_tags WHERE prompt_id = ? AND tag_id = ?'
  ).bind(prompt_id, tag_id).run();
}

export async function getTagsForPrompt(db: D1Database, prompt_id: string): Promise<Tag[]> {
  const result = await db.prepare(`
    SELECT t.* FROM tags t
    JOIN prompt_tags pt ON t.id = pt.tag_id
    WHERE pt.prompt_id = ?
    ORDER BY t.name
  `).bind(prompt_id).all<Tag>();
  
  return result.results;
}

export async function getPromptsForTag(
  db: D1Database, 
  tag_id: string, 
  user_id: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<Prompt[]> {
  const result = await db.prepare(`
    SELECT p.* FROM prompts p
    JOIN prompt_tags pt ON p.id = pt.prompt_id
    WHERE pt.tag_id = ? AND p.user_id = ?
    ORDER BY p.updated_at DESC
    LIMIT ? OFFSET ?
  `).bind(tag_id, user_id, limit, offset).all<Prompt>();
  
  return result.results;
}

// Search operations
export async function searchPrompts(
  db: D1Database, 
  user_id: string, 
  query: string, 
  limit: number = 50, 
  offset: number = 0
): Promise<Prompt[]> {
  const searchTerm = `%${query}%`;
  
  const result = await db.prepare(`
    SELECT * FROM prompts 
    WHERE user_id = ? AND (content LIKE ? OR title LIKE ?)
    ORDER BY updated_at DESC
    LIMIT ? OFFSET ?
  `).bind(user_id, searchTerm, searchTerm, limit, offset).all<Prompt>();
  
  return result.results;
}

// Note operations (for future implementation)
export async function createNote(
  db: D1Database, 
  prompt_id: string, 
  content: string
): Promise<Note> {
  const id = generateId('note');
  const now = new Date().toISOString();
  
  await db.prepare(
    'INSERT INTO notes (id, prompt_id, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, prompt_id, content, now, now).run();
  
  return {
    id,
    prompt_id,
    content,
    created_at: now,
    updated_at: now,
  };
}

export async function updateNote(
  db: D1Database, 
  id: string, 
  content: string
): Promise<void> {
  await db.prepare(
    'UPDATE notes SET content = ?, updated_at = ? WHERE id = ?'
  ).bind(content, new Date().toISOString(), id).run();
}

export async function deleteNote(db: D1Database, id: string): Promise<void> {
  await db.prepare('DELETE FROM notes WHERE id = ?').bind(id).run();
}

export async function getNotesByPromptId(db: D1Database, prompt_id: string): Promise<Note[]> {
  const result = await db.prepare(
    'SELECT * FROM notes WHERE prompt_id = ? ORDER BY created_at'
  ).bind(prompt_id).all<Note>();
  
  return result.results;
}
