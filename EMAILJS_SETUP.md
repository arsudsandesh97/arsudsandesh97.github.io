# EmailJS Configuration Guide

## Problem
EmailJS is not working because the environment variables are not properly configured for the static export build.

## Solution

### 1. Get Your EmailJS Credentials

If you don't have them yet:

1. Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)
2. Sign up or log in
3. Get the following:
   - **Service ID**: From Email Services section
   - **Template ID**: From Email Templates section
   - **Public Key**: From Account > API Keys

### 2. Add to `.env.production`

Add these lines to your `.env.production` file:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

**Important**: Replace the placeholder values with your actual EmailJS credentials.

### 3. Add to `.env.local` (for local development)

Add the same variables to `.env.local`:

```env
# EmailJS Configuration
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id_here
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id_here
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key_here
```

### 4. EmailJS Template Setup

Your EmailJS template should have these variables:

- `{{from_name}}` - Sender's name
- `{{from_email}}` - Sender's email
- `{{subject}}` - Email subject
- `{{message}}` - Email message

Example template:
```
New message from {{from_name}} ({{from_email}})

Subject: {{subject}}

Message:
{{message}}
```

### 5. Rebuild and Deploy

After adding the environment variables:

```bash
# Rebuild the app
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## Testing Locally

To test EmailJS locally:

```bash
# Make sure .env.local has your EmailJS credentials
npm run dev
```

Then navigate to the contact page and try sending a message.

## Troubleshooting

### Environment Variables Not Loading

1. **Check the variable names**: They must start with `NEXT_PUBLIC_`
2. **Restart the dev server**: Environment variables are loaded at startup
3. **Clear the build cache**: `rm -rf .next out`

### EmailJS Errors

1. **Check the browser console** for detailed error messages
2. **Verify your EmailJS credentials** are correct
3. **Check EmailJS dashboard** for usage limits
4. **Ensure your template exists** and has the correct variables

### CORS Errors

EmailJS should work from any domain, but if you get CORS errors:
1. Check your EmailJS service settings
2. Ensure you're using the correct Service ID

### Rate Limiting

The app has built-in rate limiting (5 emails per hour). If you hit the limit:
- Wait an hour
- Or use the "Send Email" button to open your default email client

## Security Notes

1. **Never commit `.env.local`** to Git (it's in `.gitignore`)
2. **EmailJS Public Key is safe to expose** in client-side code
3. **The Service ID and Template ID** are also safe to expose
4. **For production**, consider using EmailJS's allowed domains feature

## Alternative: Using the API Route

If you prefer server-side email sending, you can modify the API route to use a server-side email service like:
- Nodemailer
- SendGrid
- AWS SES
- Resend

However, this won't work with static export (GitHub Pages). You'd need to deploy to Vercel, Netlify, or another platform that supports API routes.

## Current Setup

Your contact form currently:
1. ✅ Stores messages in Supabase
2. ✅ Sends emails via EmailJS (when configured)
3. ✅ Has rate limiting (5 emails/hour)
4. ✅ Has a fallback "Send Email" button
5. ✅ Validates email addresses
6. ✅ Shows loading states and toast notifications

Once you add the environment variables and rebuild, EmailJS will work! 🚀
