# RenewalRadar — AI-Powered Contract Renewal Tracker

Stop losing money to missed contract renewals. Upload your contracts, let AI extract the dates, and get reminded before it's too late.

## Problem
Small businesses track contracts in Excel. They miss renewal deadlines, get auto-renewed into expensive contracts, or lose valuable clients.

## Solution
RenewalRadar automates contract renewal tracking with AI date extraction and email/SMS reminders.

## Tech Stack
- **Frontend:** Next.js 15 + TypeScript + Tailwind CSS
- **Database:** Supabase (Postgres + Auth + Storage)
- **AI:** OpenAI GPT-4o (contract date extraction)
- **Email:** Resend (reminder emails)
- **Hosting:** Vercel
- **Cron:** Vercel Cron (daily reminder checks)

## Features
- 📄 Upload PDF contracts
- 🤖 AI extracts renewal dates, notice periods, and auto-renewal clauses
- 📧 Automated email reminders (30 days, 7 days, day-of)
- 📊 Dashboard with color-coded renewal status
- 🔒 Secure authentication via Supabase

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/aparajithn/renewalradar.git
cd renewalradar
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Copy `.env.local` and add your API keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
RESEND_API_KEY=your-resend-api-key
CRON_SECRET=your-cron-secret
```

### 4. Run locally
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
vercel --prod
```

## Database Schema

The `contracts` table is automatically created with:
- Contract metadata (name, vendor, dates)
- AI-extracted fields (renewal date, notice period, auto-renews)
- Reminder tracking (30-day, 7-day, day-of sent status)

## Cron Job

Vercel Cron runs daily at 9 AM to check for upcoming renewals and send reminder emails.

## License
MIT

---

Built with ❤️ by [Aparajith N](https://github.com/aparajithn)
