# GitHub Pages Deployment Guide

This guide explains how to deploy your Next.js portfolio to GitHub Pages.

## Prerequisites

1. Your code must be pushed to a GitHub repository
2. The repository name should match the `basePath` in `next.config.js` (currently set to `webtest`)
3. You have `gh-pages` installed (already in `package.json`)

## Deployment Steps

### 1. Build the Application

```bash
npm run build
```

This will create an optimized production build in the `out` directory.

### 2. Deploy to GitHub Pages

```bash
npm run deploy
```

This command will:
- Build your application
- Deploy the `out` folder to the `gh-pages` branch
- Preserve dotfiles (like `.nojekyll`)

### 3. Configure GitHub Pages

1. Go to your GitHub repository
2. Navigate to **Settings** → **Pages**
3. Under "Source", select the `gh-pages` branch
4. Click **Save**

Your site will be available at: `https://[your-username].github.io/webtest/`

## Important Configuration Details

### Next.js Configuration (`next.config.js`)

- **`output: 'export'`**: Enables static HTML export
- **`basePath: '/webtest'`**: Sets the base path for your app (matches your repo name)
- **`assetPrefix: '/webtest/'`**: Ensures all assets load with the correct path
- **`trailingSlash: true`**: Adds trailing slashes to URLs for better GitHub Pages compatibility
- **`images.unoptimized: true`**: Required for static export

### Routes

Your application now has the following routes:

- **Home**: `/` - Full portfolio with all sections
- **Skills**: `/skills` - Dedicated skills page
- **Projects**: `/projects` - Dedicated projects page
- **Experience**: `/experience` - Dedicated experience page
- **Education**: `/education` - Dedicated education page
- **Contact**: `/contact` - Dedicated contact page

### Navigation

The Navbar automatically detects which page you're on and adjusts links accordingly:
- On the home page, "About" uses hash navigation (`#about`)
- On other pages, "About" links back to home (`/#about`)
- All other sections link to their dedicated pages

## Troubleshooting

### Assets Not Loading

If images or styles aren't loading:
1. Verify `basePath` and `assetPrefix` match your repository name
2. Ensure `.nojekyll` file exists in the `public` folder
3. Check that all asset paths use relative URLs

### 404 Errors

If you get 404 errors on page refresh:
- This is normal for GitHub Pages with client-side routing
- The app will redirect to the home page and then navigate to the correct route
- For better UX, consider using hash-based routing or a custom 404 page

### Build Errors

If the build fails:
1. Check for any TypeScript errors: `npm run lint`
2. Ensure all dependencies are installed: `npm install`
3. Clear the `.next` cache: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)

## Local Testing

To test the production build locally:

```bash
# Build the app
npm run build

# Serve the out directory (you'll need a static server)
npx serve out
```

## Environment Variables

For production deployment, ensure your environment variables are properly set:
- Create a `.env.production` file with production values
- Never commit sensitive keys to Git
- Use GitHub Secrets for sensitive data if needed

## Updating Your Site

To update your deployed site:

1. Make your changes
2. Commit and push to your main branch
3. Run `npm run deploy`

The deployment script will automatically build and deploy the latest version.

## Custom Domain (Optional)

To use a custom domain:

1. Add a `CNAME` file to the `public` folder with your domain
2. Configure DNS settings with your domain provider
3. Enable "Enforce HTTPS" in GitHub Pages settings

---

**Note**: The deployment uses the `gh-pages` package which automatically creates and manages the `gh-pages` branch. You don't need to manually create this branch.
