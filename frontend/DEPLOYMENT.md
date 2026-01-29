# 🌐 Deployment Guide - Clevcipe

Deploy your Clevcipe application to production with this comprehensive guide.

## Deployment Options

- **Vercel** (Recommended) - Optimized for Next.js, zero configuration
- **Netlify** - Alternative with good Next.js support
- **Railway** - Full-stack deployment with database
- **AWS Amplify** - Amazon's hosting solution
- **Self-Hosted** - Deploy on your own server

---

## Option 1: Vercel (Recommended) ⭐

### Why Vercel?
- Built by Next.js creators
- Zero configuration needed
- Automatic deployments from Git
- Global CDN
- Free SSL certificates
- Generous free tier

### Prerequisites
- GitHub/GitLab/Bitbucket account
- Vercel account (free)
- Completed local setup

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Clevcipe v1.0"

# Create a new repository on GitHub
# Then push your code
git remote add origin https://github.com/YOUR_USERNAME/clevcipe.git
git branch -M main
git push -u origin main
```

### Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"**
3. Import your GitHub repository
4. Vercel auto-detects Next.js settings ✅

### Step 3: Configure Environment Variables

In the Vercel project settings, add these environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Step 4: Deploy!

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Your app is live! 🎉

### Step 5: Update Supabase Redirect URLs

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Add your Vercel URL:
   ```
   https://your-app.vercel.app/**
   ```
3. For Google OAuth, also add to Google Cloud Console

### Automatic Deployments

Every push to `main` branch automatically deploys! 🚀

---

## Option 2: Netlify

### Step 1: Prepare Build

```bash
# Build the app
npm run build
```

### Step 2: Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize
netlify init

# Deploy
netlify deploy --prod
```

### Step 3: Add Environment Variables

In Netlify Dashboard → **Site settings** → **Environment variables**:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
OPENAI_API_KEY
NEXT_PUBLIC_APP_URL
```

---

## Option 3: Docker (Self-Hosted)

### Create Dockerfile

Already included in the project as `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Build and Run

```bash
# Build Docker image
docker build -t clevcipe .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=your_url \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key \
  -e OPENAI_API_KEY=your_key \
  clevcipe
```

---

## Post-Deployment Checklist

### ✅ Test Core Features

- [ ] Homepage loads correctly
- [ ] Sign up creates new account
- [ ] Sign in works with existing account
- [ ] Email confirmation works
- [ ] Profile page shows user data
- [ ] AI recipe generation works (if OpenAI configured)
- [ ] Shopping list CRUD operations
- [ ] Nutrition logging works
- [ ] Meal planning saves correctly
- [ ] Dark mode toggles properly

### ✅ Performance Checks

```bash
# Run Lighthouse audit
npx lighthouse https://your-app.vercel.app --view

# Check bundle size
npm run build
# Look for warnings about large bundles
```

### ✅ Security Checks

- [ ] Environment variables are set as secrets (not exposed in client)
- [ ] Supabase RLS policies are active
- [ ] API routes validate inputs
- [ ] HTTPS is enforced
- [ ] CSP headers configured (if applicable)

### ✅ SEO Optimization

- [ ] Meta tags in place (`layout.tsx`)
- [ ] Open Graph images set
- [ ] sitemap.xml generated
- [ ] robots.txt configured

---

## Environment-Specific Configuration

### Development (.env.local)
```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Production (Vercel/Netlify)
```env
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

---

## Custom Domain Setup

### Vercel

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `clevcipe.com`
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

### Update Supabase URLs

After adding custom domain:
1. Update `NEXT_PUBLIC_APP_URL` in Vercel env vars
2. Add domain to Supabase redirect URLs
3. Update Google OAuth redirect URIs (if using)

---

## Monitoring & Analytics

### Vercel Analytics (Built-in)

```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Google Analytics

1. Create GA4 property
2. Add tracking ID to env vars
3. Install package:
```bash
npm install @next/third-parties
```

---

## Continuous Integration (CI/CD)

### GitHub Actions

Create `.github/workflows/ci.yml`:

```yaml
name: CI
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm test
      - run: npm run build
```

---

## Scaling Considerations

### Database
- Monitor Supabase usage
- Upgrade tier if needed
- Set up database backups
- Consider read replicas for high traffic

### API Rate Limits
- Monitor OpenAI usage
- Implement caching for AI responses
- Set rate limits on API routes
- Consider Redis for session storage

### CDN & Caching
- Vercel automatically handles this
- For custom CDN, use Cloudflare
- Cache static assets aggressively
- Use ISR (Incremental Static Regeneration) for recipe pages

---

## Troubleshooting Production Issues

### Build Fails

```bash
# Check build locally first
npm run build

# If successful, issue is likely env vars
# Verify all environment variables are set in Vercel/Netlify
```

### 500 Errors in Production

1. Check Vercel/Netlify logs
2. Verify environment variables are correct
3. Check Supabase connection
4. Ensure database schema is deployed

### Performance Issues

1. Check bundle size: `npm run build`
2. Analyze with Bundle Analyzer:
```bash
npm install @next/bundle-analyzer
```

3. Optimize images with next/image
4. Enable caching headers

---

## Cost Estimation

### Free Tier (Hobby Projects)
- **Vercel**: Free (includes analytics)
- **Supabase**: Free (500MB database, 50,000 monthly users)
- **OpenAI**: Pay-as-you-go (≈$0.50-$5/month for light usage)

### Production (1000+ users/month)
- **Vercel Pro**: $20/month
- **Supabase Pro**: $25/month
- **OpenAI**: $20-50/month (depending on usage)

**Total: ~$65-95/month**

---

## Backup & Recovery

### Database Backups

Supabase automatically backs up paid tier projects. For free tier:

```bash
# Export data periodically
pg_dump -h db.xxxxx.supabase.co -U postgres clevcipe > backup.sql
```

### Code Backups

- Git repository is your source of truth
- Consider private GitHub backup repo
- Tag releases: `git tag v1.0.0`

---

## Support

Need deployment help?
- 📖 [Vercel Docs](https://vercel.com/docs)
- 📖 [Supabase Docs](https://supabase.com/docs)
- 🐛 Open an issue on GitHub

---

**Your app is now live! 🌐🎉**
