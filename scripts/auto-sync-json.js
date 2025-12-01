const fs = require('fs');
const path = require('path');
const https = require('https');
require('dotenv').config({ path: '.env.local' });

const SECTIONS = [
  'profile',
  'projects',
  'skills',
  'experience',
  'education',
  'blogs',
  'project-explanations',
  'dashboards'
];

const BASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL.replace('https://', '').split('.')[0];
const STORAGE_URL = `https://${BASE_URL}.supabase.co/storage/v1/object/public/portfolio-json`;

console.log('🔄 Auto-sync started. Checking for updates every 10 seconds...');
console.log('Press Ctrl+C to stop.\n');

function downloadFile(section) {
  return new Promise((resolve) => {
    const url = `${STORAGE_URL}/${section}.json`;
    
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve(data);
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function syncFiles() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  for (const section of SECTIONS) {
    const filePath = path.join(dataDir, `${section}.json`);
    const newContent = await downloadFile(section);
    
    if (newContent) {
      const existingContent = fs.existsSync(filePath) 
        ? fs.readFileSync(filePath, 'utf-8') 
        : '';
      
      if (newContent !== existingContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`✅ Updated: ${section}.json`);
      }
    }
  }
}

// Initial sync
syncFiles();

// Auto-sync every 10 seconds
setInterval(syncFiles, 10000);
