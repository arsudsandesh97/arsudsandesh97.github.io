
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


-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blog_posts table
-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  author TEXT DEFAULT 'Sandesh Arsud',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  reading_time INTEGER, -- in minutes
  views INTEGER DEFAULT 0,
  tags TEXT[], -- Array of tags
  category TEXT,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  is_featured BOOLEAN DEFAULT false -- New column for featured posts
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(is_featured) WHERE is_featured = true;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published posts
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts
  FOR SELECT
  USING (published = true);

-- Policy: Authenticated users can view all posts (for admin)
CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert posts (for admin)
CREATE POLICY "Authenticated users can create posts"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update posts (for admin)
CREATE POLICY "Authenticated users can update posts"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete posts (for admin)
CREATE POLICY "Authenticated users can delete posts"
  ON blog_posts
  FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample blog post for testing
INSERT INTO blog_posts (
  title,
  slug,
  excerpt,
  content,
  cover_image,
  published,
  published_at,
  reading_time,
  tags,
  category,
  seo_title,
  seo_description,
  is_featured
) VALUES (
  'Welcome to My Blog',
  'welcome-to-my-blog',
  'An introduction to my blog where I share insights about data analytics, Python, and my journey in the field.',
  '# Welcome to My Blog

I''m excited to start this blog where I''ll be sharing my experiences, insights, and tutorials about:

## Topics I''ll Cover

- **Data Analytics**: Best practices, tools, and techniques
- **Python Programming**: Tips, tricks, and advanced concepts
- **Business Intelligence**: Dashboard design and data storytelling
- **Machine Learning**: Practical applications and tutorials
- **Career Insights**: Lessons learned and advice for aspiring data analysts

## What to Expect

I''ll be posting regularly with:

- In-depth tutorials with code examples
- Case studies from real projects
- Tool comparisons and reviews
- Industry insights and trends

Stay tuned for more content!

```python
# Sample code will look like this
import pandas as pd

df = pd.read_csv(''data.csv'')
print(df.head())
```

Thanks for reading, and welcome to the journey!',
  'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200',
  true,
  NOW(),
  5,
  ARRAY['Welcome', 'Introduction', 'Data Analytics'],
  'General',
  'Welcome to My Data Analytics Blog | Sandesh Arsud',
  'Introduction to my blog covering data analytics, Python, machine learning, and business intelligence.',
  true
);

-- 4. Add 'is_featured' column to 'blog_posts' table
-- This allows you to mark specific posts as featured
alter table public.blog_posts 
add column if not exists is_featured boolean default false;

-- 5. (Optional) Set a few posts as featured for testing
-- Replace 'YOUR_POST_ID' with actual IDs from your blog_posts table if you want to test immediately
-- update public.blog_posts set is_featured = true where id = 'YOUR_POST_ID';

-- Create dashboards table
CREATE TABLE IF NOT EXISTS dashboards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    embed_url TEXT NOT NULL,
    author TEXT DEFAULT 'Sandesh Arsud',
    image_url TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for slug lookup
CREATE INDEX IF NOT EXISTS idx_dashboards_slug ON dashboards(slug);

-- Enable Row Level Security (RLS)
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access
CREATE POLICY "Allow public read access"
ON dashboards
FOR SELECT
TO public
USING (true);

-- RLS Policy: Allow authenticated users to insert/update/delete (for admin)
CREATE POLICY "Allow authenticated users to manage dashboards"
ON dashboards
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Trigger to update updated_at column
CREATE TRIGGER update_dashboards_updated_at
BEFORE UPDATE ON dashboards
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert a sample dashboard
INSERT INTO dashboards (title, slug, description, embed_url, image_url, tags)
VALUES (
    'Sales Performance Dashboard',
    'sales-performance',
    'A comprehensive view of sales performance across different regions and product categories.',
    'https://app.powerbi.com/view?r=eyJrIjoi...', -- Replace with actual URL
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    ARRAY['Sales', 'Business', 'Power BI']
) ON CONFLICT (slug) DO NOTHING;
