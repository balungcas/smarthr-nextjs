# SmartHR - Complete Setup Guide

This guide will walk you through the complete setup of SmartHR from scratch.

## Prerequisites Checklist

Before starting, ensure you have accounts for:

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Git installed
- [ ] [Supabase](https://supabase.com) account (free tier available)
- [ ] [Stripe](https://stripe.com) account (test mode is free)
- [ ] [Resend](https://resend.com) account (free tier: 100 emails/day)
- [ ] [Netlify](https://netlify.com) account (free tier available)
- [ ] [GitHub](https://github.com) account (for deployment)

## Part 1: Local Development Setup

### Step 1: Project Setup

```bash
# Navigate to the project directory
cd smarthr-nextjs

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

### Step 2: Supabase Setup

1. **Create a new Supabase project**
   - Go to https://app.supabase.com
   - Click "New Project"
   - Fill in project details
   - Wait for project to initialize (~2 minutes)

2. **Get your Supabase credentials**
   - Go to Project Settings → API
   - Copy the following:
     - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
     - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

3. **Run database migrations**
   - Go to SQL Editor in Supabase dashboard
   - Click "New Query"
   - Open `supabase/migrations/001_initial_schema.sql`
   - Copy and paste the entire contents
   - Click "Run"
   - Wait for completion (should create ~30 tables)

4. **Verify database setup**
   - Go to Table Editor
   - You should see tables: users, employees, departments, etc.

5. **Set up Storage buckets**
   - Go to Storage in Supabase dashboard
   - Create three buckets:
     - `avatars` (Public bucket)
     - `documents` (Private bucket)
     - `receipts` (Private bucket)
   
   For the `avatars` bucket, add this policy:
   ```sql
   -- Allow public read access to avatars
   CREATE POLICY "Public avatars are viewable by everyone"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'avatars');

   -- Allow authenticated users to upload avatars
   CREATE POLICY "Users can upload their own avatar"
   ON storage.objects FOR INSERT
   WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
   ```

### Step 3: Stripe Setup

1. **Get Stripe API keys**
   - Go to https://dashboard.stripe.com
   - Switch to "Test mode" (toggle in top right)
   - Go to Developers → API keys
   - Copy:
     - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `Secret key` → `STRIPE_SECRET_KEY`

2. **Note:** Webhook setup comes after deployment

### Step 4: Resend Setup

1. **Get Resend API key**
   - Go to https://resend.com/api-keys
   - Click "Create API Key"
   - Give it a name (e.g., "SmartHR Dev")
   - Copy the key → `RESEND_API_KEY`

2. **Verify your domain (for production)**
   - Go to Domains → Add Domain
   - Follow DNS verification steps
   - Use verified domain in `RESEND_FROM_EMAIL`
   - For development, use: `onboarding@resend.dev`

### Step 5: Update .env.local

Edit `.env.local` with all your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=(leave empty for now)

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=onboarding@resend.dev

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### Step 6: Run the Application

```bash
# Start development server
npm run dev
```

Open http://localhost:3000

### Step 7: Create First Admin User

1. Go to http://localhost:3000/register
2. Fill in the registration form
3. After registration, go to Supabase dashboard
4. Table Editor → users table
5. Find your user and change `role` from 'employee' to 'admin'
6. Log out and log back in

## Part 2: Production Deployment on Netlify

### Step 1: Push to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial SmartHR setup"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/yourusername/smarthr.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. **Connect GitHub to Netlify**
   - Go to https://app.netlify.com
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Authorize Netlify
   - Select your repository

2. **Configure build settings**
   - Netlify should auto-detect Next.js
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Click "Deploy site"

3. **Add environment variables**
   - Go to Site settings → Environment variables
   - Add all variables from `.env.local` (except `NEXT_PUBLIC_APP_URL`)
   - For `NEXT_PUBLIC_APP_URL`, use your Netlify URL:
     - Format: `https://your-site-name.netlify.app`

4. **Redeploy**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Deploy site"

### Step 3: Configure Stripe Webhooks

1. **Create webhook endpoint**
   - Go to Stripe Dashboard → Developers → Webhooks
   - Click "Add endpoint"
   - Endpoint URL: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
   - Select events:
     - `payment_intent.succeeded`
     - `payment_intent.payment_failed`
     - `invoice.paid`
   - Click "Add endpoint"

2. **Get webhook secret**
   - Click on the webhook you just created
   - Reveal "Signing secret"
   - Copy this to Netlify environment variables as `STRIPE_WEBHOOK_SECRET`

3. **Redeploy Netlify**
   - Trigger another deploy after adding webhook secret

### Step 4: Update Supabase Auth Settings

1. **Configure auth redirects**
   - Supabase dashboard → Authentication → URL Configuration
   - Add your Netlify URL to "Site URL"
   - Add redirect URLs:
     - `https://your-site.netlify.app/login`
     - `https://your-site.netlify.app/reset-password`

2. **Enable email auth**
   - Authentication → Providers
   - Ensure "Email" is enabled
   - Configure email templates if desired

### Step 5: Custom Domain (Optional)

1. **Add custom domain in Netlify**
   - Site settings → Domain management
   - Click "Add custom domain"
   - Follow DNS configuration steps

2. **Update environment variables**
   - Change `NEXT_PUBLIC_APP_URL` to your custom domain
   - Update Stripe webhook URL
   - Update Supabase auth URLs

## Part 3: Testing

### Test Checklist

- [ ] User registration works
- [ ] Login/logout works
- [ ] Can create departments
- [ ] Can add employees
- [ ] Can submit leave requests
- [ ] Can create clients
- [ ] Can create projects
- [ ] Can generate invoices
- [ ] Stripe payment works (test mode)
- [ ] Email notifications send
- [ ] File uploads work (avatars)
- [ ] Dashboard loads correctly

### Test Users

Create test users with different roles:

1. **Admin**: Full access
2. **Manager**: Can approve leaves, view employees
3. **Employee**: Limited access to own data

## Part 4: Production Checklist

Before going live:

- [ ] Switch Stripe from test mode to live mode
- [ ] Update Stripe API keys in Netlify
- [ ] Verify Resend domain
- [ ] Update `RESEND_FROM_EMAIL` to your domain
- [ ] Review all Supabase RLS policies
- [ ] Set up database backups in Supabase
- [ ] Configure monitoring (Netlify Analytics)
- [ ] Set up error tracking (optional: Sentry)
- [ ] Review security headers in `netlify.toml`
- [ ] Test all payment flows with real cards
- [ ] Set up SSL certificate (automatic with Netlify)
- [ ] Create admin user guide
- [ ] Create employee user guide

## Troubleshooting

### Common Issues

**Issue: "Cannot connect to Supabase"**
- Check if Supabase URL and keys are correct
- Verify project is not paused (free tier pauses after inactivity)

**Issue: "Netlify Functions not working"**
- Check function logs in Netlify dashboard
- Verify environment variables are set correctly
- Ensure `netlify.toml` is present

**Issue: "Stripe payments failing"**
- Verify using test card: `4242 4242 4242 4242`
- Check webhook is configured
- Review Stripe logs

**Issue: "Emails not sending"**
- Verify Resend API key
- Check if domain is verified (production)
- Review Resend logs

**Issue: "File uploads failing"**
- Check Storage policies in Supabase
- Verify bucket names match code
- Check file size limits

**Issue: "Login redirects to wrong page"**
- Update Supabase auth redirect URLs
- Clear browser cache
- Check `NEXT_PUBLIC_APP_URL`

## Support & Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **Resend Docs**: https://resend.com/docs

## Security Best Practices

1. **Never commit `.env.local`** to git
2. **Use strong passwords** for all admin accounts
3. **Regularly review** Supabase RLS policies
4. **Enable 2FA** on all service accounts
5. **Monitor** Stripe webhooks for suspicious activity
6. **Regular backups** of Supabase database
7. **Keep dependencies updated**: `npm audit fix`
8. **Review access logs** regularly

---

**Congratulations! 🎉 Your SmartHR system is now fully set up!**

For questions or issues, please open an issue on GitHub.
