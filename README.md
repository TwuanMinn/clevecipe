# Clevcipe

A modern recipe discovery and meal planning platform.

## Project Structure

```
Clevcipe/
├── frontend/          # Next.js 14 frontend
│   ├── src/
│   │   ├── app/       # App router pages
│   │   ├── components/ # Reusable components
│   │   ├── hooks/     # Custom React hooks
│   │   ├── lib/       # Utilities and configurations
│   │   ├── types/     # TypeScript type definitions
│   │   └── data/      # Static data and constants
│   └── public/        # Static assets
├── backend/           # Express.js API server
│   ├── controllers/   # Route handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   └── configs/       # Configuration files
└── supabase/          # Database schema files
```

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS with custom design system

## Getting Started

1. Install dependencies:
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

2. Set up environment variables (copy `.env.example` to `.env.local`)

3. Run development servers:
   ```bash
   # Frontend
   cd frontend && npm run dev
   
   # Backend
   cd backend && npm run dev
   ```

## Features

- [ ] Recipe discovery
- [ ] Meal planning
- [ ] Shopping lists
- [ ] User profiles
- [ ] Favorites & collections
