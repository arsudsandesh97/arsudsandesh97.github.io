import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// Read env
const envPath = path.join(rootDir, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const [key, ...vals] = line.split('=');
  if (key && vals.length) env[key.trim()] = vals.join('=').trim();
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Using key type:', env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role' : 'anon');

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET = 'portfolio-images';
const FILE_NAME = 'profile-picture.jpg';
const LOCAL_IMAGE = path.join(rootDir, 'public', 'images', 'pp1.jpg');

async function main() {
  // 1. Check if bucket exists, create if not
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log('Existing buckets:', buckets?.map(b => b.name));
  
  const bucketExists = buckets?.some(b => b.name === BUCKET);
  if (!bucketExists) {
    console.log(`Creating bucket "${BUCKET}"...`);
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error) {
      console.error('Error creating bucket:', error.message);
      // Try using existing bucket
      console.log('Trying portfolio-json bucket instead...');
    } else {
      console.log('Bucket created!');
    }
  }

  // 2. Upload image
  const imageBuffer = fs.readFileSync(LOCAL_IMAGE);
  console.log(`Uploading ${FILE_NAME} (${(imageBuffer.length / 1024 / 1024).toFixed(2)} MB)...`);
  
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(FILE_NAME, imageBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
    });

  if (error) {
    console.error('Upload error:', error.message);
    
    // Fallback: try uploading to portfolio-json bucket
    console.log('Trying portfolio-json bucket...');
    const { data: d2, error: e2 } = await supabase.storage
      .from('portfolio-json')
      .upload(FILE_NAME, imageBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
      });
    
    if (e2) {
      console.error('Fallback upload error:', e2.message);
      process.exit(1);
    }
    
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/portfolio-json/${FILE_NAME}`;
    console.log('Public URL:', publicUrl);
    updateProfileJson(publicUrl);
    return;
  }

  // 3. Get public URL
  const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${FILE_NAME}`;
  console.log('Public URL:', publicUrl);

  // 4. Update profile.json
  updateProfileJson(publicUrl);
}

function updateProfileJson(imageUrl) {
  const profilePath = path.join(rootDir, 'public', 'data', 'profile.json');
  const profile = JSON.parse(fs.readFileSync(profilePath, 'utf8'));
  
  console.log('Old Image URL:', profile.data.Image);
  profile.data.Image = imageUrl;
  console.log('New Image URL:', profile.data.Image);
  
  fs.writeFileSync(profilePath, JSON.stringify(profile, null, 2));
  console.log('profile.json updated!');
}

main().catch(console.error);
