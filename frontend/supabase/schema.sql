-- =============================================
-- CLEVCIPE DATABASE SCHEMA
-- PostgreSQL + Supabase with Row Level Security
-- =============================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    dietary_preferences TEXT[] DEFAULT '{}',
    allergies TEXT[] DEFAULT '{}',
    health_goals TEXT[] DEFAULT '{}',
    daily_calorie_target INTEGER DEFAULT 2000,
    daily_protein_target INTEGER DEFAULT 100,
    daily_carbs_target INTEGER DEFAULT 250,
    daily_fat_target INTEGER DEFAULT 65,
    measurement_unit TEXT DEFAULT 'metric' CHECK (measurement_unit IN ('metric', 'imperial')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- RECIPES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    cuisine_type TEXT,
    prep_time INTEGER, -- minutes
    cook_time INTEGER, -- minutes
    total_time INTEGER GENERATED ALWAYS AS (prep_time + cook_time) STORED,
    servings INTEGER DEFAULT 2,
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    ingredients JSONB NOT NULL DEFAULT '[]',
    instructions TEXT[] DEFAULT '{}',
    nutrition JSONB DEFAULT '{}',
    dietary_tags TEXT[] DEFAULT '{}',
    cost_estimate DECIMAL(10, 2),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    source TEXT, -- 'ai', 'user', 'curated'
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for recipes
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine_type);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_dietary_tags ON recipes USING GIN(dietary_tags);
CREATE INDEX idx_recipes_created_by ON recipes(created_by);

-- RLS for recipes
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Recipes are viewable by everyone"
    ON recipes FOR SELECT
    USING (true);

CREATE POLICY "Users can create recipes"
    ON recipes FOR INSERT
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own recipes"
    ON recipes FOR UPDATE
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own recipes"
    ON recipes FOR DELETE
    USING (auth.uid() = created_by);

-- =============================================
-- FAVORITES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

-- RLS for favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own favorites"
    ON favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own favorites"
    ON favorites FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
    ON favorites FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- MEAL PLANS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
    servings INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, meal_type, recipe_id)
);

-- Indexes for meal plans
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, date);

-- RLS for meal plans
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own meal plans"
    ON meal_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create meal plans"
    ON meal_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own meal plans"
    ON meal_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own meal plans"
    ON meal_plans FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- NUTRITION LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS nutrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_name TEXT NOT NULL,
    calories INTEGER DEFAULT 0,
    protein DECIMAL(10, 2) DEFAULT 0,
    carbs DECIMAL(10, 2) DEFAULT 0,
    fat DECIMAL(10, 2) DEFAULT 0,
    fiber DECIMAL(10, 2) DEFAULT 0,
    logged_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for nutrition logs
CREATE INDEX idx_nutrition_logs_user_date ON nutrition_logs(user_id, date);

-- RLS for nutrition logs
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own nutrition logs"
    ON nutrition_logs FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create nutrition logs"
    ON nutrition_logs FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition logs"
    ON nutrition_logs FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition logs"
    ON nutrition_logs FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- SHOPPING LISTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS shopping_lists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'My Shopping List',
    items JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for shopping lists
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own shopping lists"
    ON shopping_lists FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create shopping lists"
    ON shopping_lists FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own shopping lists"
    ON shopping_lists FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own shopping lists"
    ON shopping_lists FOR DELETE
    USING (auth.uid() = user_id);

-- =============================================
-- USER PREFERENCES HISTORY TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS preference_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    preferences JSONB NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for preference history
ALTER TABLE preference_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own preference history"
    ON preference_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create preference history"
    ON preference_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- =============================================
-- FUNCTIONS & TRIGGERS
-- =============================================

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION handle_new_user();

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shopping_lists_updated_at
    BEFORE UPDATE ON shopping_lists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- =============================================
-- SEED DATA (Sample Recipes)
-- =============================================

-- Insert sample curated recipes
INSERT INTO recipes (title, description, cuisine_type, prep_time, cook_time, servings, difficulty, ingredients, instructions, nutrition, dietary_tags, source)
VALUES
(
    'Mediterranean Quinoa Bowl',
    'A vibrant, protein-packed bowl with fresh vegetables and tangy feta',
    'mediterranean',
    15,
    20,
    2,
    'easy',
    '[{"name": "Quinoa", "amount": 1, "unit": "cups"}, {"name": "Cherry Tomatoes", "amount": 1, "unit": "cups"}, {"name": "Cucumber", "amount": 1, "unit": "whole"}, {"name": "Feta Cheese", "amount": 0.5, "unit": "cups"}]',
    ARRAY['Rinse quinoa and cook according to package instructions.', 'Dice vegetables while quinoa cooks.', 'Combine all ingredients and drizzle with olive oil.'],
    '{"calories": 380, "protein": 14, "carbs": 42, "fat": 18, "fiber": 6}',
    ARRAY['vegetarian', 'gluten-free'],
    'curated'
),
(
    'Honey Garlic Salmon',
    'Perfectly glazed salmon with a sweet and savory honey garlic sauce',
    'asian',
    10,
    15,
    2,
    'easy',
    '[{"name": "Salmon Fillets", "amount": 2, "unit": "pieces"}, {"name": "Honey", "amount": 3, "unit": "tablespoons"}, {"name": "Soy Sauce", "amount": 2, "unit": "tablespoons"}, {"name": "Garlic", "amount": 4, "unit": "cloves"}]',
    ARRAY['Season salmon with salt and pepper.', 'Mix honey, soy sauce, and minced garlic.', 'Sear salmon and glaze with sauce.', 'Bake at 400°F for 8-10 minutes.'],
    '{"calories": 420, "protein": 35, "carbs": 22, "fat": 20, "fiber": 1}',
    ARRAY['high-protein', 'dairy-free'],
    'curated'
),
(
    'Chickpea Curry',
    'Creamy coconut curry with tender chickpeas and aromatic spices',
    'indian',
    10,
    25,
    4,
    'easy',
    '[{"name": "Chickpeas", "amount": 2, "unit": "cups"}, {"name": "Coconut Milk", "amount": 1, "unit": "cups"}, {"name": "Curry Powder", "amount": 2, "unit": "tablespoons"}, {"name": "Spinach", "amount": 2, "unit": "cups"}]',
    ARRAY['Sauté onion and garlic.', 'Add curry powder and cook until fragrant.', 'Add chickpeas and coconut milk.', 'Simmer 15 minutes, add spinach.'],
    '{"calories": 340, "protein": 12, "carbs": 48, "fat": 12, "fiber": 9}',
    ARRAY['vegan', 'dairy-free', 'high-fiber'],
    'curated'
);
