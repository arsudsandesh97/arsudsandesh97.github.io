const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠ Supabase credentials not found – skipping JSON generation.');
  console.warn('  Using existing public/data/*.json files (already committed).');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const SECTIONS = {
  profile: async () => {
    const { data } = await supabase.from('bio').select('*').single();
    return data;
  },
  projects: async () => {
    const { data } = await supabase.from('projects').select('*, members(*), associations(*)').eq('is_published', true);
    
    // Optimize data size by selecting only used fields and removing heavy base64 images
    return (data || []).map(project => ({
      id: project.id,
      title: project.title,
      date: project.date,
      description: project.description,
      description2: project.description2,
      description3: project.description3,
      image: project.image,
      tags: project.tags,
      category: project.category,
      github: project.github,
      dashboard: project.dashboard,
      members: (project.members || []).map(m => ({
        id: m.id,
        name: m.name,
        // Remove base64 images to save space, frontend handles fallback
        img: (m.img && m.img.startsWith('data:')) ? null : m.img,
        github: m.github,
        linkedin: m.linkedin
      })),
      associations: (project.associations || []).map(a => ({
        id: a.id,
        name: a.name,
        // Remove base64 images to save space
        img: (a.img && a.img.startsWith('data:')) ? null : a.img
      }))
    }));
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
          // Remove base64 images to save space
          image: (skill.image && skill.image.startsWith('data:')) ? null : skill.image,
        })),
    }));
  },
  experience: async () => {
    const { data } = await supabase.from('experiences').select('*').eq('is_published', true);
    return data;
  },
  education: async () => {
    const { data } = await supabase.from('education').select('*').eq('is_published', true);
    return data;
  },
  blogs: async () => {
    const { data } = await supabase.from('blog_posts').select('*').eq('published', true).order('published_at', { ascending: false });
    return data;
  },
  'project-explanations': async () => {
    const { data } = await supabase.from('project_explanations').select('*');
    return data;
  },
  copyright: async () => {
    const { data } = await supabase.from('copyright').select('copyright').single();
    return data;
  },
  dashboards: async () => {
    const { data } = await supabase.from('dashboards').select('*').eq('is_published', true).order('created_at', { ascending: false });
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
