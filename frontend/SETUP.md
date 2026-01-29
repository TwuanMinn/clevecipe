# 🚀 Clevcipe Setup Guide

This guide will walk you through setting up Clevcipe from scratch.

## Prerequisites Checklist

- [ ] Node.js 18+ installed ([Download](https://nodejs.org/))
- [ ] Git installed ([Download](https://git-scm.com/))
- [ ] Code editor (VS Code recommended)
- [ ] Supabase account (free tier available)
- [ ] OpenAI account (optional, for AI features)

---

## Part 1: Project Setup (5 minutes)

### 1. Clone and Install

```bash
# Navigate to your projects folder
cd "c:\Users\Admin\Downloads\IT career projects\Clevcipe\frontend"

# Install dependencies
npm install
```

### 2. Create Environment File

```bash
# Copy the example file
cp .env.example .env.local
```

---

## Part 2: Supabase Setup (10 minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `clevcipe` (or your preference)
   - **Database Password**: Save this securely!
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes for project to initialize

### Step 2: Get Your API Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** → Save for later
   - **anon/public key** → Save for later

### Step 3: Run Database Schema

1. In Supabase dashboard, click **SQL Editor**
2. Click **"New query"**
3. Open `supabase/schema.sql` in your code editor
4. Copy ALL the contents
5. Paste into Supabase SQL Editor
6. Click **"Run"** (bottom right)
7. You should see "Success. No rows returned"

### Step 4: Verify Database Setup

1. Go to **Table Editor** in Supabase
2. You should see these tables:
   - ✅ profiles
   - ✅ recipes
   - ✅ favorites
   - ✅ meal_plans
   - ✅ nutrition_logs
   - ✅ shopping_lists
   - ✅ preference_history

### Step 5: Enable Google OAuth (Optional)

1. Go to **Authentication** → **Providers**
2. Find **Google** and click to expand
3. Toggle **"Enabled"**
4. Follow the instructions to:
   - Create a Google Cloud Project
   - Enable Google+ API
   - Create OAuth credentials
   - Add authorized redirect URIs
5. Save your Client ID and Client Secret in Supabase

---

## Part 3: OpenAI Setup (5 minutes) - Optional

AI recipe generation requires an OpenAI API key. **Skip this if you don't want AI features** (app will use mock recipes).

### Step 1: Create OpenAI Account

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Add payment method (you need credits for API access)

### Step 2: Generate API Key

1. Go to **API Keys** section
2. Click **"Create new secret key"**
3. Name it "Clevcipe"
4. Copy the key **immediately** (you won't see it again!)
5. Save it securely

---

## Part 4: Configure Environment Variables (2 minutes)

Open `.env.local` and fill in your values:

```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# From OpenAI (optional)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Save the file!**

---

## Part 5: Run the Application (1 minute)

```bash
# Start the development server
npm run dev
```

You should see:
```
✓ Ready in 1558ms
▲ Next.js 14.2.35
- Local:   http://localhost:3000
```

Open your browser to **http://localhost:3000** 🎉

---

## Part 6: Test Everything

### ✅ Homepage Test
1. Open http://localhost:3000
2. You should see the Clevcipe homepage with smooth animations
3. Bottom navigation should be visible

### ✅ Sign Up Test
1. Click **"Get Started"** or navigate to `/signup`
2. Fill in:
   - Name: Your name
   - Email: your-email@example.com
   - Password: Strong password (8+ chars, uppercase, number)
3. Check "I agree to terms"
4. Click **"Create Account"**
5. Check your email for confirmation (Supabase sends this)

### ✅ Sign In Test
1. Navigate to `/login`
2. Enter your email and password
3. Click **"Sign In"**
4. You should be redirected to dashboard/home

### ✅ Profile Test
1. Click the **Profile** icon in bottom navigation
2. You should see your profile with:
   - Your name
   - Email
   - Joined date
   - Weekly stats

### ✅ AI Recipe Test (if OpenAI configured)
1. Navigate to `/generate` or click **"Generate"**
2. Fill in recipe preferences
3. Click **"Generate Recipes"**
4. Wait a few seconds
5. You should see 3 AI-generated recipes

### ✅ Shopping List Test
1. Navigate to `/shopping`
2. Click **"Add Item"**
3. Enter: Apples, 5, pieces
4. Item should appear in Produce category
5. Click checkbox to mark as purchased

---

## Troubleshooting

### ❌ "Supabase not configured" warning
**Fix**: Make sure you've added `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to `.env.local`

### ❌ 500 Error on page load
**Fix**: 
1. Stop the dev server (Ctrl+C)
2. Delete `.next` folder: `Remove-Item -Recurse -Force .next`
3. Restart: `npm run dev`

### ❌ Can't sign up / Authentication error
**Checks**:
1. Verify Supabase credentials in `.env.local`
2. Check if email confirmation is sent (check spam folder)
3. Verify database schema ran successfully (check Table Editor)

### ❌ AI recipe generation fails
**Checks**:
1. Verify `OPENAI_API_KEY` is in `.env.local`
2. Check you have credits in OpenAI account
3. Check browser console for error messages

### ❌ Page styles broken / looks bad
**Fix**:
1. Make sure Tailwind CSS is compiling
2. Hard refresh browser (Ctrl+Shift+R)
3. Check browser console for CSS errors

---

## Next Steps

### 🎨 Customize Your App
- Change colors in `tailwind.config.ts`
- Update logo/branding
- Modify recipe categories

### 📊 Add Analytics
- Install Vercel Analytics
- Add Google Analytics
- Track user behavior

### 🚀 Deploy to Production
See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment guide

---

## Need Help?

- 📖 Check the main [README.md](./README.md)
- 🐛 Open an issue on GitHub
- 💬 Check Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- 🤖 Check OpenAI docs: [platform.openai.com/docs](https://platform.openai.com/docs)

---

**Setup Complete! Happy Coding! 🎉**
