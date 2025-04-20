-- backend/db/migrations/20250418_create_tables.sql

-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- parts table
CREATE TABLE IF NOT EXISTS parts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  make TEXT,
  model TEXT,
  year INTEGER,
  price NUMERIC(10,2),
  part_number TEXT UNIQUE,
  image TEXT
);

