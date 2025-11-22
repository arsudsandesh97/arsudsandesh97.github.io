# React to Next.js Conversion Guide

## Key Architectural Changes

### 1. **Project Structure**
- **Before**: `src/` directory with `App.js` as entry point
- **After**: `app/` directory with App Router (Next.js 13+)
- Components moved to `components/` directory (root level)
- Utils moved to `utils/` directory (root level)
- API routes in `app/api/` directory

### 2. **Routing**
- **Before**: `HashRouter` from `react-router-dom` for GitHub Pages
- **After**: File-based routing with Next.js App Router
- Hash routing removed (not needed for Next.js)
- Navigation uses anchor links (`#section`) for single-page sections

### 3. **Data Fetching**
- **Before**: Client-side fetching with `useEffect` hooks
- **After**: 
  - Server-side fetching in Server Components (where possible)
  - Client-side fetching in Client Components with `"use client"` directive
  - Separate Supabase clients for server and client

### 4. **Environment Variables**
- **Before**: `REACT_APP_*` prefix
- **After**: `NEXT_PUBLIC_*` prefix for client-side variables

### 5. **Styling**
- **Before**: Global CSS in `index.css` and `App.css`
- **After**: Global CSS in `app/globals.css`
- Styled-components work the same but need registry for SSR

### 6. **Components**
- All interactive components need `"use client"` directive
- Components using hooks, browser APIs, or event handlers are Client Components
- Static components can remain Server Components

### 7. **API Integration**
- **Before**: Direct Supabase calls from components
- **After**: 
  - Server Components use `lib/api/supabase.js`
  - Client Components use `lib/api/supabase-client.js`
  - Contact form uses API route at `app/api/contact/route.js`

### 8. **Performance Optimizations**
- Next.js Image component for optimized images
- Automatic code splitting
- Server-side rendering for better SEO
- Static generation where possible

## Dependencies Updated

### Removed:
- `react-scripts` (replaced by Next.js)
- `react-router-dom` (replaced by Next.js routing)
- `gh-pages` (deployment handled differently)
- Testing libraries (can be added back if needed)

### Updated:
- All dependencies updated to latest compatible versions
- Next.js 14.2.0 added
- TypeScript config added (optional, for better DX)

## Migration Checklist

- [x] Update package.json
- [x] Create Next.js config
- [x] Set up Supabase clients (server & client)
- [x] Create app directory structure
- [x] Convert root layout
- [x] Create API routes
- [ ] Convert all components
- [ ] Update environment variables
- [ ] Test all functionality
- [ ] Update deployment configuration

## Environment Variables Required

Create a `.env.local` file with:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_emailjs_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

## Running the Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

