
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

-- ========================================
-- Open To Work Settings Table
-- ========================================
-- This table stores visibility state and contact info for the "Open to Work" widget

CREATE TABLE IF NOT EXISTS open_to_work_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_visible BOOLEAN DEFAULT false,
    custom_message TEXT DEFAULT 'I''m currently available for new opportunities and excited to connect with recruiters and hiring managers.',
    contact_email TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    position TEXT DEFAULT 'bottom-right' CHECK (position IN ('bottom-left', 'bottom-right')),
    job_types TEXT[] DEFAULT ARRAY['Full-time', 'Contract'],
    preferred_roles TEXT[] DEFAULT ARRAY['Data Analyst', 'Business Analyst'],
    available_from DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE open_to_work_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow public read access
CREATE POLICY "Allow public read access on open_to_work_settings"
ON open_to_work_settings FOR SELECT TO public USING (true);

-- RLS Policy: Allow authenticated users to manage
CREATE POLICY "Allow authenticated users to manage open_to_work_settings"
ON open_to_work_settings FOR ALL TO authenticated 
USING (true) WITH CHECK (true);

-- Trigger to update updated_at column
CREATE TRIGGER update_open_to_work_settings_updated_at
BEFORE UPDATE ON open_to_work_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Insert default settings (singleton pattern - only one row needed)
INSERT INTO open_to_work_settings (is_visible, position)
VALUES (false, 'bottom-right')
ON CONFLICT DO NOTHING;

-- Enable real-time for instant widget updates
-- ALTER PUBLICATION supabase_realtime ADD TABLE open_to_work_settings;

-- Open To Work Settings Table
-- This table stores the visibility state and contact information for the "Open to Work" widget
-- Safe to run multiple times (uses IF NOT EXISTS and DROP IF EXISTS)

-- Drop existing policies if they exist (to allow re-running this script)
DROP POLICY IF EXISTS "Allow public read access on open_to_work_settings" ON open_to_work_settings;
DROP POLICY IF EXISTS "Allow authenticated users to insert open_to_work_settings" ON open_to_work_settings;
DROP POLICY IF EXISTS "Allow authenticated users to update open_to_work_settings" ON open_to_work_settings;
DROP POLICY IF EXISTS "Allow authenticated users to delete open_to_work_settings" ON open_to_work_settings;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_open_to_work_settings_updated_at ON open_to_work_settings;

-- Create the table (if not exists)
CREATE TABLE IF NOT EXISTS open_to_work_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    is_visible BOOLEAN DEFAULT false,
    
    -- Profile Information
    custom_message TEXT DEFAULT 'I''m currently available for new opportunities and excited to connect with recruiters and hiring managers.',
    
    -- Location & Experience (configurable from Supabase)
    location TEXT DEFAULT 'India',
    experience_type TEXT DEFAULT 'fresher' CHECK (experience_type IN ('fresher', 'entry', 'junior', 'mid', 'senior', 'lead', 'custom')),
    experience_display TEXT DEFAULT 'Fresher',  -- What to show on widget (e.g., "Fresher", "1 Year", "2+ Years", etc.)
    
    -- Contact Information
    contact_email TEXT,
    linkedin_url TEXT,
    twitter_url TEXT,
    
    -- Widget Settings
    position TEXT DEFAULT 'bottom-right' CHECK (position IN ('bottom-left', 'bottom-right')),
    
    -- Job Preferences
    job_types TEXT[] DEFAULT ARRAY['Full-time', 'Internship', 'Remote'],
    preferred_roles TEXT[] DEFAULT ARRAY['Data Analyst', 'Business Analyst', 'BI Developer'],
    skills TEXT[] DEFAULT ARRAY['Power BI', 'SQL', 'Python', 'Excel', 'Tableau'],
    
    -- Availability
    availability TEXT DEFAULT 'Immediate',  -- "Immediate", "2 Weeks", "1 Month", etc.
    available_from DATE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add new columns if table already exists (safe to run multiple times)
DO $$ 
BEGIN
    -- Add location column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'open_to_work_settings' AND column_name = 'location') THEN
        ALTER TABLE open_to_work_settings ADD COLUMN location TEXT DEFAULT 'India';
    END IF;
    
    -- Add experience_type column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'open_to_work_settings' AND column_name = 'experience_type') THEN
        ALTER TABLE open_to_work_settings ADD COLUMN experience_type TEXT DEFAULT 'fresher';
    END IF;
    
    -- Add experience_display column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'open_to_work_settings' AND column_name = 'experience_display') THEN
        ALTER TABLE open_to_work_settings ADD COLUMN experience_display TEXT DEFAULT 'Fresher';
    END IF;
    
    -- Add skills column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'open_to_work_settings' AND column_name = 'skills') THEN
        ALTER TABLE open_to_work_settings ADD COLUMN skills TEXT[] DEFAULT ARRAY['Power BI', 'SQL', 'Python', 'Excel', 'Tableau'];
    END IF;
    
    -- Add availability column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'open_to_work_settings' AND column_name = 'availability') THEN
        ALTER TABLE open_to_work_settings ADD COLUMN availability TEXT DEFAULT 'Immediate';
    END IF;
END $$;

-- Enable Row Level Security (RLS)
ALTER TABLE open_to_work_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (newly created after dropping old ones)
CREATE POLICY "Allow public read access on open_to_work_settings"
ON open_to_work_settings
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow authenticated users to insert open_to_work_settings"
ON open_to_work_settings
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update open_to_work_settings"
ON open_to_work_settings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete open_to_work_settings"
ON open_to_work_settings
FOR DELETE
TO authenticated
USING (true);

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_open_to_work_updated_at()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create the trigger
CREATE TRIGGER update_open_to_work_settings_updated_at
BEFORE UPDATE ON open_to_work_settings
FOR EACH ROW
EXECUTE FUNCTION update_open_to_work_updated_at();

-- Insert default settings if no row exists
INSERT INTO open_to_work_settings (
    is_visible,
    custom_message,
    location,
    experience_type,
    experience_display,
    position,
    job_types,
    preferred_roles,
    skills,
    availability
) 
SELECT 
    false,
    'Passionate Data Analyst seeking my first professional opportunity. Eager to apply my analytical skills and drive data-driven insights.',
    'India',
    'fresher',
    'Fresher',
    'bottom-right',
    ARRAY['Full-time', 'Internship', 'Remote'],
    ARRAY['Data Analyst', 'Business Analyst', 'Junior Data Analyst'],
    ARRAY['Power BI', 'SQL', 'Python', 'Excel', 'Tableau'],
    'Immediate'
WHERE NOT EXISTS (SELECT 1 FROM open_to_work_settings LIMIT 1);

-- ========================================
-- IMPORTANT: Enable Real-time for this table
-- ========================================
-- To enable real-time updates, run this command:
-- ALTER PUBLICATION supabase_realtime ADD TABLE open_to_work_settings;

-- ========================================
-- Quick Commands to Control the Widget
-- ========================================

-- Show the widget:
-- UPDATE open_to_work_settings SET is_visible = true;

-- Hide the widget:
-- UPDATE open_to_work_settings SET is_visible = false;

-- Update your details:
-- UPDATE open_to_work_settings SET 
--   location = 'Mumbai, India',
--   experience_display = 'Fresher • Ready to Learn',
--   skills = ARRAY['Power BI', 'SQL', 'Python', 'Excel', 'Data Visualization'];

