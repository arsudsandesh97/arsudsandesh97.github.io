
-- Portfolio Table Schema

-- Bio Table
CREATE TABLE Bio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    roles TEXT[],
    description TEXT,
    github TEXT,
    resume TEXT,
    linkedin TEXT,
    twitter TEXT,
    insta TEXT,
    image VARCHAR
);

-- Skills Table
CREATE TABLE Skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES "Skill Categories"(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    image TEXT
);

-- Skill Categories Table
CREATE TABLE "Skill Categories" (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL
);

-- Experiences Table
CREATE TABLE Experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    img TEXT,
    role TEXT NOT NULL,
    company TEXT NOT NULL,
    date TEXT,
    description TEXT,
    description2 TEXT,
    description3 TEXT,
    skills TEXT[],
    doc TEXT
);

-- Projects Table
CREATE TABLE Projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    description2 TEXT,
    description3 TEXT,
    image TEXT,
    tags TEXT[],
    category TEXT,
    github TEXT,
    dashboard TEXT
);

-- Education Table
CREATE TABLE Education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    img TEXT,
    school TEXT NOT NULL,
    date TEXT,
    grade TEXT,
    description TEXT,
    degree TEXT
);

-- Associations Table
CREATE TABLE Associations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES Projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    img TEXT
);

-- Members Table
CREATE TABLE Members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES Projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    img TEXT,
    github TEXT,
    linkedin TEXT
);

-- Copyright Table
CREATE TABLE Copyright (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    copyright VARCHAR NOT NULL
);

-- Contacts Table
CREATE TABLE contacts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE project_explanations (
    project_id UUID PRIMARY KEY REFERENCES Projects(id) ON DELETE CASCADE,
    markdown_content TEXT NOT NULL
);

-- Create index for faster lookups
CREATE INDEX idx_project_explanations_project_id ON project_explanations(project_id);

-- Enable Row Level Security (RLS)
ALTER TABLE project_explanations ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access (anyone can view project explanations)
CREATE POLICY "Allow public read access"
ON project_explanations
FOR SELECT
TO public
USING (true);

-- RLS Policy: Allow authenticated users to insert
CREATE POLICY "Allow authenticated users to insert"
ON project_explanations
FOR INSERT
TO authenticated
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to update
CREATE POLICY "Allow authenticated users to update"
ON project_explanations
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- RLS Policy: Allow authenticated users to delete
CREATE POLICY "Allow authenticated users to delete"
ON project_explanations
FOR DELETE
TO authenticated
USING (true);