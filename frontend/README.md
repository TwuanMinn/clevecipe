# 🍳 Clevcipe - AI-Powered Recipe Platform

> Your intelligent cooking companion powered by AI, designed to generate personalized recipes based on your dietary preferences, available ingredients, and health goals.

![Clevcipe Banner](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-green?style=for-the-badge&logo=supabase)
![AI Powered](https://img.shields.io/badge/AI-GPT--4-purple?style=for-the-badge&logo=openai)

## ✨ Features

### 🤖 AI Recipe Generation
- **Smart Recipe Creation**: Generate custom recipes using GPT-4o-mini based on your preferences
- **Dietary Customization**: Support for vegetarian, vegan, keto, paleo, and more
- **Ingredient-Based**: Get recipes based on what you have in your kitchen
- **Nutrition Tracking**: Automatic calorie and macro calculation

### 📱 Core Functionality
- **Weekly Meal Planning**: Plan your meals for the entire week
- **Smart Shopping Lists**: Auto-generate shopping lists from your meal plans
- **Favorites & History**: Save and revisit your favorite recipes
- **Daily Nutrition Log**: Track your daily food intake and macros
- **Multi-Device Sync**: Access your data across all devices

### 🎨 User Experience
- **Beautiful UI**: Modern, animated interface with dark mode support
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Smooth Animations**: Framer Motion powered transitions
- **Glassmorphism**: Premium glass-effect UI components

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (for authentication & database)
- OpenAI API key (for AI recipe generation)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd Clevcipe/frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI API Key (for AI recipe generation)
OPENAI_API_KEY=your_openai_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Supabase database**
- Create a new Supabase project at [supabase.com](https://supabase.com)
- Run the SQL schema from `supabase/schema.sql` in your Supabase SQL editor
- Enable Google OAuth (optional) in Authentication settings

5. **Run the development server**
```bash
npm run dev
```

6. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

### Running the Schema

1. Log into your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/schema.sql`
4. Paste and execute in the SQL editor
5. Verify tables were created in **Table Editor**

### Tables Created
- `profiles` - User profiles and preferences
- `recipes` - Recipe storage (AI generated and curated)
- `favorites` - Saved favorite recipes
- `meal_plans` - Weekly meal planning data
- `nutrition_logs` - Daily nutrition tracking
- `shopping_lists` - Shopping list items

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run Type Checking
```bash
npm run type-check
```

### Run Linting
```bash
npm run lint
```

## 📦 Build for Production

```bash
npm run build
npm start
```

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Install Vercel CLI**
```bash
npm i -g vercel
```

2. **Deploy**
```bash
vercel --prod
```

3. **Add Environment Variables** in Vercel Dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY`

### Deploy to Other Platforms
The app is a standard Next.js application and can be deployed to:
- Netlify
- AWS Amplify
- Railway
- Render
- Any platform supporting Next.js

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Zustand** - State management with persistence

### Backend
- **Supabase** - Authentication, database, real-time subscriptions
- **PostgreSQL** - Relational database with Row Level Security
- **OpenAI GPT-4** - AI recipe generation via Vercel AI SDK

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing
- **TypeScript** - Static type checking

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   ├── login/             # Authentication pages
│   │   ├── signup/
│   │   ├── profile/           # User profile & settings
│   │   ├── shopping/          # Shopping list
│   │   ├── log/               # Nutrition tracking
│   │   └── ...
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   └── auth/              # Auth-related components
│   ├── lib/
│   │   ├── stores.ts          # Zustand state stores
│   │   ├── auth-context.tsx   # Auth provider
│   │   ├── supabase.ts        # Supabase client
│   │   └── recipe-service.ts  # Recipe API service
│   ├── context/
│   │   └── ThemeContext.tsx   # Dark mode provider
│   └── __tests__/             # Unit tests
├── supabase/
│   └── schema.sql             # Database schema
├── public/                     # Static assets
└── package.json
```

## 🎯 Key Features Details

### AI Recipe Generation
The app uses OpenAI's GPT-4o-mini model to generate personalized recipes. It considers:
- User dietary restrictions (vegetarian, vegan, keto, etc.)
- Allergen information
- Available ingredients
- Cooking time preferences
- Skill level
- Calorie targets

### State Management
Zustand stores with localStorage persistence handle:
- User preferences and dietary settings
- Weekly meal planning
- Recipe favorites and history
- Shopping list items
- Daily nutrition logs

### Authentication
Supabase Auth provides:
- Email/password authentication
- Google OAuth sign-in
- Session management
- Secure token handling
- Profile data sync

## 🔒 Security Features

- **Row Level Security (RLS)**: Database policies ensure users only access their own data
- **Environment Variables**: Sensitive keys stored securely
- **Auto-create Profiles**: Automatic profile creation on signup via database triggers
- **Session Validation**: Secure session handling with Supabase

## 🎨 Design System

### Color Palette
- **Primary**: Green gradient (`from-green-500 to-emerald-500`)
- **Background**: Light mode - emerald/green/teal gradients
- **Dark Mode**: Deep green-tinted blacks

### Typography
- **Font**: System font stack optimized for readability
- **Headings**: Bold, modern styling
- **Body**: Easy-to-read proportions

### Animations
- Page transitions with AnimatePresence
- Staggered list animations
- Smooth hover effects
- Loading states with skeleton screens

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🐛 Troubleshooting

### "Missing required error components" Error
✅ Fixed - Error boundaries are now included (`error.tsx`, `global-error.tsx`, `loading.tsx`)

### "Supabase not configured" Warning
This is normal when running without Supabase credentials. The app runs in demo mode. Add your credentials to `.env.local` to enable full functionality.

### Port Already in Use
```bash
# Kill all Node processes
taskkill /F /IM node.exe    # Windows
pkill node                   # Mac/Linux

# Or use a different port
PORT=3001 npm run dev
```

### Build Errors
```bash
# Clear Next.js cache and rebuild
rm -rf .next
npm run build
```

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

## 🎉 Credits

Built with ❤️ using:
- Next.js by Vercel
- Supabase for backend
- OpenAI for AI capabilities
- Framer Motion for animations

---

**Happy Cooking! 🍳👨‍🍳**
