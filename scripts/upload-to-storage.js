const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// Try to get Service Role Key first (better for uploads), then fall back to Anon Key
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase credentials in .env.local');
  console.error('Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = 'portfolio-json';

async function uploadFiles() {
  const dataDir = path.join(process.cwd(), 'public', 'data');
  
  if (!fs.existsSync(dataDir)) {
    console.error('Error: public/data directory not found. Run npm run generate-json first.');
    process.exit(1);
  }

  const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json'));
  
  console.log(`Found ${files.length} JSON files to upload to '${BUCKET_NAME}'...`);
  console.log(`Using key: ${supabaseKey.substring(0, 10)}...`);

  for (const file of files) {
    const filePath = path.join(dataDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    try {
      // Check if file is empty
      if (!fileContent || fileContent.trim().length === 0) {
        console.warn(`⚠️ Skipping empty file: ${file}`);
        continue;
      }

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(file, fileContent, {
          contentType: 'application/json',
          upsert: true
        });

      if (error) {
        console.error(`❌ Failed to upload ${file}:`, error.message);
        if (error.statusCode === "403" || error.message.includes("Policy")) {
          console.error("   Hint: This is likely a permission issue. You might need the Service Role Key.");
        }
      } else {
        console.log(`✅ Uploaded ${file}`);
      }
    } catch (err) {
      console.error(`❌ Error uploading ${file}:`, err.message);
    }
  }
  
  console.log('\nUpload process complete.');
}

uploadFiles();
