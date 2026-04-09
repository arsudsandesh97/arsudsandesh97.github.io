# Supabase Type Generation Guide

## Quick Start

Generate TypeScript types from your Supabase database:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
```

Replace `YOUR_PROJECT_ID` with your actual Supabase project ID.

## Finding Your Project ID

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Go to Settings → General
4. Copy the "Reference ID"

## Alternative: Using Project URL

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID --schema public > lib/supabase/database.types.ts
```

## Usage in Code

```typescript
import { Database } from '@/lib/supabase/database.types';

// Type your Supabase client
const supabase = createClient<Database>(url, key);

// Get typed results
const { data } = await supabase
  .from('projects')
  .select('*');
// data is now fully typed!
```

## Updating Types

Re-run the command whenever you change your database schema:

```bash
npm run generate-types  # (add this script to package.json if desired)
```

## Benefits

✅ Full type safety for database queries  
✅ Autocomplete for table/column names  
✅ Catch typos at compile time  
✅ Better IDE support

## Note

This requires the Supabase CLI. Install globally if needed:

```bash
npm install -g supabase
```
