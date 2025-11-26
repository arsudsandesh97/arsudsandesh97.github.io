# Portfolio Website - CDN-Based Architecture

Next.js portfolio website with a CDN-based data architecture using Supabase Storage and Edge Functions.

## Architecture Overview

This portfolio uses a **CDN-first approach** for optimal performance:

1. **Static JSON files** are stored in Supabase Storage (CDN)
2. **Edge Functions** update JSON files when database changes occur
3. **Next.js** fetches from CDN, with automatic fallback to database
4. **Optional ISR** (Incremental Static Regeneration) for instant updates

### Data Flow

```
Database Update → Webhook → Edge Function → JSON Upload → CDN → Next.js
```

## Setup Instructions

### 1. Prerequisites

- Supabase project with service role key
- Node.js 18+ and npm
- Next.js deployment (Vercel recommended)

### 2. Create Supabase Storage Bucket

1. Go to your Supabase Dashboard → Storage
2. Create a new **public** bucket named `portfolio-json`
3. Set bucket to public access

### 3. Deploy Edge Function

Install Supabase CLI if you haven't:
```bash
npm install -g supabase
```

Login to Supabase:
```bash
supabase login
```

Link your project:
```bash
supabase link --project-ref your-project-ref
```

Deploy the Edge Function:
```bash
supabase functions deploy update-section-json
```

Set Edge Function secrets:
```bash
supabase secrets set WEBHOOK_SECRET=your_webhook_secret
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
supabase secrets set STORAGE_BUCKET=portfolio-json
supabase secrets set NEXT_REVALIDATE_URL=https://your-app.vercel.app/api/revalidate
supabase secrets set NEXT_REVALIDATE_SECRET=your_revalidate_secret
```

> **Note**: Generate secure secrets using `openssl rand -hex 32`

### 4. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update all placeholder values in `.env.local` with your actual credentials:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `NEXT_REVALIDATE_SECRET` - Secret for revalidation endpoint
- `NEXT_PUBLIC_*_JSON_URL` - CDN URLs for each section

Replace `[project-ref]` in JSON URLs with your Supabase project reference.

### 5. Generate Initial JSON Files

Trigger the Edge Function to create initial JSON files:

```bash
# Generate all sections
curl -X POST https://your-project-ref.supabase.co/functions/v1/update-section-json \
  -H "x-webhook-secret: your_webhook_secret" \
  -H "Content-Type: application/json" \
  -d '{"sections": ["profile", "projects", "skills", "experience", "education"]}'
```

Verify files were created in Supabase Storage → `portfolio-json` bucket.

### 6. Set Up Database Webhooks (Optional but Recommended)

For automatic updates when data changes:

1. Go to Supabase Dashboard → Database → Webhooks
2. Create webhooks for each table:

**Projects Table Webhook:**
- Table: `projects`
- Events: `INSERT`, `UPDATE`, `DELETE`
- Type: HTTP Request
- Method: POST
- URL: `https://your-project-ref.supabase.co/functions/v1/update-section-json`
- HTTP Headers: Add `x-webhook-secret: your_webhook_secret`
- HTTP Params: `{"section": "projects"}`

Repeat for other tables (`bio`, `skills`, `skill_categories`, `experiences`, `education`).

## Testing

### Test Edge Function

```bash
# Test projects section update
curl -X POST https://your-ref.supabase.co/functions/v1/update-section-json \
  -H "x-webhook-secret: your_secret" \
  -H "Content-Type: application/json" \
  -d '{"section": "projects"}'
```

Expected response:
```json
{
  "success": true,
  "results": [
    {
      "section": "projects",
      "status": "success",
      "fileName": "projects.json"
    }
  ]
}
```

### Test Revalidation Endpoint

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-revalidate-secret: your_secret" \
  -H "Content-Type: application/json" \
  -d '{"paths": ["/", "/projects"]}'
```

### Test CDN Integration

1. Start dev server: `npm run dev`
2. Open browser DevTools → Network tab
3. Navigate to `http://localhost:3000`
4. Verify requests are fetching from CDN URLs (Supabase Storage)
5. Check console for "CDN fetch successful" messages

### Test Fallback

Temporarily break a CDN URL in `.env.local`:
```bash
NEXT_PUBLIC_PROJECTS_JSON_URL=https://invalid-url.example.com/projects.json
```

Restart dev server and verify:
- Console shows "CDN fetch error, falling back to Supabase"
- Projects still load from database

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Environment Variables

See `.env.example` for all required variables.

### Production Deployment

When deploying to Vercel or other platforms:

1. Add all `NEXT_PUBLIC_*` variables to your hosting environment
2. Add `NEXT_REVALIDATE_SECRET` for the revalidation endpoint
3. Ensure Edge Function has correct `NEXT_REVALIDATE_URL` pointing to your production domain

## How It Works

### Data Fetching Flow

1. **CDN First**: Next.js tries to fetch from Supabase Storage JSON files
2. **Automatic Fallback**: If CDN fails, falls back to direct Supabase query
3. **SessionStorage Cache**: Successful fetches are cached in sessionStorage
4. **Source Tracking**: Response includes `source: "cdn" | "supabase" | "cache"`

### Edge Function Logic

1. Validates webhook secret
2. Determines which section(s) to update (from payload or table name)
3. Fetches fresh data from Supabase using service role
4. Serializes to JSON with `generatedAt` timestamp
5. Uploads to Storage with upsert (overwrites existing)
6. Optionally triggers Next.js revalidation for ISR

### Sections

- **profile** → `bio` table
- **projects** → `projects` + `members` + `associations` tables
- **skills** → `skills` + `skill_categories` tables
- **experience** → `experiences` table
- **education** → `education` table

## Troubleshooting

### JSON Files Not Updating

1. Check Edge Function logs in Supabase Dashboard → Edge Functions
2. Verify webhook secret matches
3. Test Edge Function manually with curl
4. Check Supabase Storage permissions (bucket must be public)

### Data Still Loading from Database

1. Verify CDN URLs in `.env.local` are correct (no typos, correct project ref)
2. Check browser console for CDN fetch errors
3. Ensure JSON files exist in Storage bucket
4. Check Network tab to see actual request URLs

### Revalidation Not Working

1. Verify `NEXT_REVALIDATE_SECRET` matches in both Edge Function and Next.js env
2. Check `NEXT_REVALIDATE_URL` points to correct domain
3. Test revalidation endpoint directly with curl
4. Check Next.js logs for revalidation errors

## Project Structure

```
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts          # Revalidation API endpoint
│   ├── page.js                   # Home page
│   └── ...
├── components/                   # React components
├── lib/
│   └── api/
│       └── supabase-client.js   # Data fetching with CDN support
├── supabase/
│   └── functions/
│       └── update-section-json/
│           ├── index.ts          # Edge Function handler
│           └── deno.json         # Deno configuration
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## License

MIT
