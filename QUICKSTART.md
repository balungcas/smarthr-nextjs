# SmartHR - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Environment
```bash
cp .env.example .env.local
```
Edit `.env.local` and add your credentials.

### Step 3: Set Up Supabase Database
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Go to SQL Editor
4. Run: `supabase/migrations/001_initial_schema.sql`

### Step 4: Run Development Server
```bash
npm run dev
```
Open http://localhost:3000

### Step 5: Register First User
1. Go to http://localhost:3000/register
2. Create account
3. In Supabase, change user role to 'admin'
4. Log back in

## 📚 Full Documentation

- **Setup Guide**: See [SETUP_GUIDE.md](./SETUP_GUIDE.md)
- **Implementation Summary**: See [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)
- **Deployment Checklist**: See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

## 🆘 Need Help?

1. Check [SETUP_GUIDE.md](./SETUP_GUIDE.md) troubleshooting section
2. Review [Next.js docs](https://nextjs.org/docs)
3. Check [Supabase docs](https://supabase.com/docs)

## 📦 What's Included?

- ✅ Authentication & Authorization
- ✅ Employee Management
- ✅ Leave Management
- ✅ Project & Task Tracking
- ✅ Invoice & Payment Processing
- ✅ Payroll System
- ✅ Training Management
- ✅ Asset Tracking
- ✅ Email Notifications
- ✅ And 20+ more modules!

**Built with Next.js 15, Supabase, Stripe, and Resend** 🎉
