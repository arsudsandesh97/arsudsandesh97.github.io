const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SECTIONS = {
  profile: async () => {
    const { data } = await supabase.from('bio').select('*').single();
    return data;
  },
  projects: async () => {
    const { data } = await supabase.from('projects').select('*, members(*), associations(*)');
    return data;
  },
  skills: async () => {
    const { data: categories } = await supabase.from('skill_categories').select('*').order('id', { ascending: false });
    const { data: skills } = await supabase.from('skills').select('*').order('id', { ascending: true });
    
    return (categories || []).map(category => ({
      id: category.id,
      title: category.title,
      skills: (skills || [])
        .filter(skill => skill.category_id === category.id)
        .map(skill => ({
          id: skill.id,
          name: skill.name,
          image: skill.image,
        })),
    }));
  },
  experience: async () => {
    const { data } = await supabase.from('experiences').select('*');
    return data;
  },
  education: async () => {
    const { data } = await supabase.from('education').select('*');
    return data;
  },
  blogs: async () => {
    const { data } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });
    return data;
  },
  'project-explanations': async () => {
    const { data } = await supabase.from('project_explanations').select('*');
    return data;
  }
};

async function generateJson() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log('Generating local JSON files...');

  for (const [section, fetchFn] of Object.entries(SECTIONS)) {
    try {
      console.log(`Fetching ${section}...`);
      const data = await fetchFn();
      
      const filePath = path.join(dataDir, `${section}.json`);
      const content = JSON.stringify({
        data: data || [],
        generatedAt: new Date().toISOString()
      }, null, 2);
      
      fs.writeFileSync(filePath, content);
      console.log(`✓ Created public/data/${section}.json`);
    } catch (error) {
      console.error(`Error generating ${section}:`, error.message);
    }
  }
  
  console.log('\nDone! Restart your dev server to see changes.');
}

generateJson();
