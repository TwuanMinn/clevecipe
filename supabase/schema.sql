-- ============================================
-- CLEVCIPE DATABASE SCHEMA
-- Dietary App with AI Recipe Generation
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- Extends Supabase auth.users
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- USER PREFERENCES TABLE
-- Dietary restrictions, goals, taste preferences
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
    
    -- Dietary restrictions and allergens
    dietary_restrictions TEXT[] DEFAULT '{}',
    allergens TEXT[] DEFAULT '{}',
    
    -- Nutritional goals
    nutritional_goals JSONB DEFAULT '{
        "calories": 2000,
        "protein": 100,
        "carbs": 250,
        "fat": 65,
        "fiber": 25,
        "sodium": 2300,
        "goal_type": "maintenance",
        "meals_per_day": 3
    }'::jsonb,
    
    -- Taste preferences
    taste_preferences JSONB DEFAULT '{
        "cuisines": [],
        "spice_level": "medium",
        "cooking_time": "medium",
        "dislikes": []
    }'::jsonb,
    
    -- Household info
    household_info JSONB DEFAULT '{
        "servings": 2,
        "equipment": ["oven", "stovetop", "microwave"],
        "skill_level": "intermediate"
    }'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RECIPES TABLE
-- AI-generated and user-saved recipes
-- ============================================
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Basic info
    title TEXT NOT NULL,
    description TEXT,
    cuisine_type TEXT,
    
    -- Timing
    prep_time INTEGER, -- minutes
    cook_time INTEGER, -- minutes
    
    -- Details
    servings INTEGER DEFAULT 2,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
    
    -- Recipe content (JSON)
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    -- Format: [{"name": "flour", "amount": 2, "unit": "cups", "category": "pantry"}]
    
    instructions TEXT[] NOT NULL DEFAULT '{}',
    
    -- Nutrition info
    nutrition JSONB DEFAULT '{}'::jsonb,
    -- Format: {"calories": 350, "protein": 25, "carbs": 30, "fat": 12, "fiber": 5, "sodium": 400}
    
    -- Tags and metadata
    dietary_tags TEXT[] DEFAULT '{}',
    cost_estimate DECIMAL(10,2),
    image_url TEXT,
    
    -- AI and user interaction
    is_ai_generated BOOLEAN DEFAULT true,
    is_favorite BOOLEAN DEFAULT false,
    match_percentage INTEGER, -- AI match score (0-100)
    rating DECIMAL(2,1), -- User rating (0.0-5.0)
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEAL PLANS TABLE
-- Weekly meal planning
-- ============================================
CREATE TABLE IF NOT EXISTS public.meal_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')) NOT NULL,
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
    servings_override INTEGER,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate meal assignments
    UNIQUE(user_id, date, meal_type, recipe_id)
);

-- ============================================
-- SHOPPING LISTS TABLE
-- Auto-generated and manual shopping lists
-- ============================================
CREATE TABLE IF NOT EXISTS public.shopping_lists (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    week_start_date DATE NOT NULL,
    
    items JSONB DEFAULT '[]'::jsonb,
    -- Format: [{"id": "uuid", "name": "eggs", "amount": 12, "unit": "pieces", "category": "dairy", "checked": false, "recipe_ids": ["uuid1", "uuid2"]}]
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NUTRITION LOGS TABLE
-- Daily meal logging
-- ============================================
CREATE TABLE IF NOT EXISTS public.nutrition_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    
    -- Either from recipe or custom
    recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
    custom_meal_name TEXT,
    
    -- Logged nutrition values
    nutrition_logged JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- Users can only access their own data
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nutrition_logs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- User preferences policies
CREATE POLICY "Users can view own preferences" 
    ON public.user_preferences FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences" 
    ON public.user_preferences FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences" 
    ON public.user_preferences FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Recipes policies
CREATE POLICY "Users can view own recipes" 
    ON public.recipes FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own recipes" 
    ON public.recipes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own recipes" 
    ON public.recipes FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own recipes" 
    ON public.recipes FOR DELETE 
    USING (auth.uid() = user_id);

-- Meal plans policies
CREATE POLICY "Users can manage own meal plans" 
    ON public.meal_plans FOR ALL 
    USING (auth.uid() = user_id);

-- Shopping lists policies
CREATE POLICY "Users can manage own shopping lists" 
    ON public.shopping_lists FOR ALL 
    USING (auth.uid() = user_id);

-- Nutrition logs policies
CREATE POLICY "Users can manage own nutrition logs" 
    ON public.nutrition_logs FOR ALL 
    USING (auth.uid() = user_id);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_recipes_user_id ON public.recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_recipes_cuisine ON public.recipes(cuisine_type);
CREATE INDEX IF NOT EXISTS idx_recipes_favorite ON public.recipes(user_id, is_favorite);
CREATE INDEX IF NOT EXISTS idx_recipes_created ON public.recipes(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_meal_plans_user_date ON public.meal_plans(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_plans_date_range ON public.meal_plans(user_id, date DESC);

CREATE INDEX IF NOT EXISTS idx_shopping_lists_user ON public.shopping_lists(user_id);
CREATE INDEX IF NOT EXISTS idx_shopping_lists_week ON public.shopping_lists(user_id, week_start_date);

CREATE INDEX IF NOT EXISTS idx_nutrition_logs_user_date ON public.nutrition_logs(user_id, date);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON public.user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON public.shopping_lists
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    
    INSERT INTO public.user_preferences (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
