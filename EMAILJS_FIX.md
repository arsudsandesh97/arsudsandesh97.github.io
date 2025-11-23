# EmailJS Quick Fix Checklist

## ✅ What I've Done

1. ✅ Created `EMAILJS_SETUP.md` - Comprehensive setup guide
2. ✅ Created `.env.example` - Template for environment variables
3. ✅ Updated Contact component to show better error messages when EmailJS is not configured
4. ✅ Contact form now saves to Supabase even if EmailJS is not configured

## 🔧 What You Need to Do

### Step 1: Get EmailJS Credentials

1. Go to https://dashboard.emailjs.com/
2. Sign up or log in
3. Create an email service (Gmail, Outlook, etc.)
4. Create an email template
5. Get your credentials:
   - Service ID
   - Template ID
   - Public Key (from Account > API Keys)

### Step 2: Add to Environment Files

**Option A: Edit `.env.production` directly**

Open `.env.production` and add:
```env
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=your_template_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
```

**Option B: Use the example file**

1. Copy `.env.example` to `.env.production`
2. Fill in your actual values
3. Do the same for `.env.local` for local testing

### Step 3: EmailJS Template Setup

Your EmailJS template should include these variables:
- `{{from_name}}`
- `{{from_email}}`
- `{{subject}}`
- `{{message}}`

Example template:
```
You have a new message from {{from_name}}

Email: {{from_email}}
Subject: {{subject}}

Message:
{{message}}
```

### Step 4: Rebuild and Deploy

```bash
# Rebuild with new environment variables
npm run build

# Deploy to GitHub Pages
npm run deploy
```

## 🧪 Testing

### Test Locally First

1. Add credentials to `.env.local`
2. Run `npm run dev`
3. Go to http://localhost:3000/contact
4. Try sending a test message
5. Check browser console for any errors

### Test on GitHub Pages

After deploying:
1. Go to your live site
2. Navigate to the contact page
3. Send a test message
4. Check your email inbox

## 🐛 Current Behavior

**Without EmailJS configured:**
- ✅ Form still works
- ✅ Messages saved to Supabase
- ✅ Shows message: "Message saved! Email notification not sent (EmailJS not configured)"
- ✅ "Send Email" button opens default email client

**With EmailJS configured:**
- ✅ Form works
- ✅ Messages saved to Supabase
- ✅ Email sent via EmailJS
- ✅ Shows message: "Message sent successfully! 🎉"

## 📝 Important Notes

1. **Environment variables must start with `NEXT_PUBLIC_`** to work in the browser
2. **Restart dev server** after changing environment variables
3. **Rebuild** before deploying to apply new environment variables
4. **EmailJS credentials are safe to expose** in client-side code (they're public keys)
5. **Rate limiting is active** - 5 emails per hour per user

## 🔍 Troubleshooting

### "EmailJS not configured" message
- Check that environment variables are in `.env.production`
- Verify variable names start with `NEXT_PUBLIC_`
- Rebuild the app: `npm run build`

### EmailJS errors in console
- Check Service ID, Template ID, and Public Key are correct
- Verify template exists in EmailJS dashboard
- Check template has the correct variable names

### No email received
- Check EmailJS dashboard for sent emails
- Verify email service is connected properly
- Check spam folder
- Test with EmailJS's test feature first

## 📚 Resources

- [EmailJS Documentation](https://www.emailjs.com/docs/)
- [EmailJS Dashboard](https://dashboard.emailjs.com/)
- Full setup guide: `EMAILJS_SETUP.md`

---

**Quick Start**: Add your EmailJS credentials to `.env.production`, rebuild, and deploy! 🚀
