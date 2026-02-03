# SmartHR - Modern HR & Payroll Management System

A complete HR and Payroll management solution built with **Next.js 15**, **Supabase**, **Stripe**, and **Resend**. Designed for Netlify deployment with serverless functions.

## 🚀 Features

### Core HR Management
- ✅ **Employee Management** - Complete CRUD operations with profile management
- ✅ **Department & Designations** - Organizational structure management
- ✅ **Leave Management** - Leave requests, approvals, and tracking
- ✅ **Overtime Tracking** - Track and approve employee overtime
- ✅ **Timesheet** - Daily time tracking with clock-in/out
- ✅ **Holidays Calendar** - Company-wide holiday management

### Project & Client Management
- ✅ **Client Management** - Client profiles and contact information
- ✅ **Project Tracking** - Project management with task assignments
- ✅ **Task Management** - Task tracking with progress monitoring
- ✅ **Project Team** - Assign employees to projects

### Finance & Payroll
- ✅ **Payroll Processing** - Monthly payroll with earnings and deductions
- ✅ **Salary Management** - Employee salary configuration
- ✅ **Invoicing** - Create and manage invoices with Stripe integration
- ✅ **Payment Processing** - Online payments via Stripe
- ✅ **Expense Tracking** - Employee expense submissions and approvals
- ✅ **Tax Management** - Tax rate configuration
- ✅ **Provident Fund** - PF contribution tracking

### Performance & Development
- ✅ **Goal Tracking** - Set and monitor employee goals
- ✅ **Training Management** - Training programs and participant tracking
- ✅ **Trainers** - Trainer profiles and expertise

### HR Actions
- ✅ **Promotions** - Track employee promotions
- ✅ **Resignations** - Resignation requests and approvals
- ✅ **Terminations** - Employee termination records

### Assets & Miscellaneous
- ✅ **Asset Management** - Company asset tracking and assignments
- ✅ **Global Search** - Search across all modules
- ✅ **Role-Based Access Control** - Admin, Manager, and Employee roles
- ✅ **Email Notifications** - Automated emails for approvals and updates

## 🛠️ Tech Stack

- **Frontend:** Next.js 15, TypeScript, Tailwind CSS
- **Backend:** Netlify Functions (Serverless)
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth with RLS
- **Payments:** Stripe
- **Email:** Resend
- **State Management:** TanStack Query
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in your credentials for Supabase, Stripe, and Resend.

### 3. Set Up Supabase Database

Run the migration in Supabase SQL Editor:
- File: `supabase/migrations/001_initial_schema.sql`

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
```

## 🌐 Deploy to Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Add environment variables
4. Deploy!

See full documentation in the project for detailed setup instructions.

## 📄 License

MIT License

---

**Built with ❤️ using Next.js and Supabase**
