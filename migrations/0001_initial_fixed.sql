-- Prompt Manager Database Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompts table
CREATE TABLE IF NOT EXISTS prompts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  content TEXT NOT NULL,
  title TEXT,
  source TEXT,
  is_favorite BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  UNIQUE(user_id, name)
);

-- Junction table for prompts and tags (many-to-many relationship)
CREATE TABLE IF NOT EXISTS prompt_tags (
  prompt_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (prompt_id, tag_id)
);

-- Notes table (for future implementation)
CREATE TABLE IF NOT EXISTS notes (
  id TEXT PRIMARY KEY,
  prompt_id TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_prompt_tags_prompt_id ON prompt_tags(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_tags_tag_id ON prompt_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_notes_prompt_id ON notes(prompt_id);

-- Insert default tags for testing
INSERT OR IGNORE INTO tags (id, user_id, name, color) VALUES 
('tag_1', 'default_user', 'Automation', '#3B82F6'),
('tag_2', 'default_user', 'Marketing', '#10B981'),
('tag_3', 'default_user', 'Content Creation', '#F59E0B'),
('tag_4', 'default_user', 'ChatGPT Class', '#8B5CF6');
