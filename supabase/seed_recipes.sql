-- ============================================
-- CLEVCIPE RECIPE SEED DATA
-- Populates the recipes table with demo data
-- ============================================

-- First, create a system user for public recipes (if needed)
-- These recipes are visible to everyone as the "discover" feed

-- Add policy for public recipes (user_id is NULL = system recipe)
-- Note: Run after schema.sql

CREATE POLICY "Anyone can view public recipes" 
    ON public.recipes FOR SELECT 
    USING (user_id IS NULL OR auth.uid() = user_id);

-- Drop the old restrictive policy if it exists
DROP POLICY IF EXISTS "Users can view own recipes" ON public.recipes;

-- ============================================
-- INSERT DEMO RECIPES (Public/System recipes)
-- ============================================

INSERT INTO public.recipes (
    id,
    user_id,
    title,
    description,
    cuisine_type,
    prep_time,
    cook_time,
    servings,
    difficulty,
    ingredients,
    instructions,
    nutrition,
    dietary_tags,
    image_url,
    is_ai_generated,
    is_favorite,
    match_percentage
) VALUES 
-- Recipe 1: Avocado & Poached Egg Toast
(
    '00000000-0000-0000-0000-000000000001',
    NULL,
    'Avocado & Poached Egg Toast',
    'Fresh avocado on artisan bread with perfectly poached eggs',
    'american',
    10,
    5,
    2,
    'easy',
    '[
        {"name": "avocado", "amount": 1, "unit": "whole", "category": "produce"},
        {"name": "eggs", "amount": 2, "unit": "whole", "category": "dairy"},
        {"name": "sourdough bread", "amount": 2, "unit": "slices", "category": "bakery"},
        {"name": "lemon juice", "amount": 1, "unit": "tbsp", "category": "produce"},
        {"name": "salt", "amount": 0.25, "unit": "tsp", "category": "pantry"},
        {"name": "red pepper flakes", "amount": 0.125, "unit": "tsp", "category": "pantry"}
    ]'::jsonb,
    ARRAY[
        'Toast the sourdough bread until golden brown',
        'While bread toasts, mash avocado with lemon juice and salt',
        'Bring water to a gentle simmer, add splash of vinegar',
        'Create a swirl in water and gently drop eggs in',
        'Poach for 3-4 minutes until whites are set',
        'Spread avocado on toast, top with poached eggs',
        'Season with salt, pepper, and red pepper flakes'
    ],
    '{"calories": 350, "protein": 15, "carbs": 28, "fat": 22, "fiber": 8}'::jsonb,
    ARRAY['vegetarian', 'high-protein'],
    '/images/recipes/avocado-toast.png',
    false,
    false,
    98
),
-- Recipe 2: Superfood Quinoa Power Bowl
(
    '00000000-0000-0000-0000-000000000002',
    NULL,
    'Superfood Quinoa Power Bowl',
    'Colorful Mediterranean bowl with chickpeas and tahini',
    'mediterranean',
    15,
    10,
    2,
    'easy',
    '[
        {"name": "quinoa", "amount": 1, "unit": "cup", "category": "grains"},
        {"name": "chickpeas", "amount": 1, "unit": "can", "category": "pantry"},
        {"name": "cucumber", "amount": 1, "unit": "whole", "category": "produce"},
        {"name": "cherry tomatoes", "amount": 1, "unit": "cup", "category": "produce"},
        {"name": "tahini", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "lemon", "amount": 1, "unit": "whole", "category": "produce"}
    ]'::jsonb,
    ARRAY[
        'Cook quinoa according to package directions',
        'Drain and rinse chickpeas',
        'Dice cucumber and halve tomatoes',
        'Make dressing: whisk tahini, lemon juice, and water',
        'Divide quinoa between bowls',
        'Top with chickpeas, vegetables',
        'Drizzle with tahini dressing'
    ],
    '{"calories": 420, "protein": 14, "carbs": 48, "fat": 18, "fiber": 12}'::jsonb,
    ARRAY['vegetarian', 'gluten-free', 'high-fiber'],
    '/images/recipes/quinoa-bowl.png',
    false,
    false,
    92
),
-- Recipe 3: Zucchini Noodles with Pesto
(
    '00000000-0000-0000-0000-000000000003',
    NULL,
    'Zucchini Noodles with Pesto',
    'Low-carb zoodles with fresh basil pesto',
    'italian',
    15,
    5,
    2,
    'easy',
    '[
        {"name": "zucchini", "amount": 2, "unit": "large", "category": "produce"},
        {"name": "basil pesto", "amount": 0.25, "unit": "cup", "category": "pantry"},
        {"name": "cherry tomatoes", "amount": 1, "unit": "cup", "category": "produce"},
        {"name": "parmesan", "amount": 2, "unit": "tbsp", "category": "dairy"},
        {"name": "pine nuts", "amount": 2, "unit": "tbsp", "category": "pantry"}
    ]'::jsonb,
    ARRAY[
        'Spiralize zucchini into noodles',
        'Halve cherry tomatoes',
        'Heat olive oil in pan over medium heat',
        'Add zoodles and sauté 2-3 minutes',
        'Toss with pesto and tomatoes',
        'Top with parmesan and pine nuts'
    ],
    '{"calories": 210, "protein": 8, "carbs": 12, "fat": 16, "fiber": 4}'::jsonb,
    ARRAY['vegetarian', 'low-carb', 'gluten-free'],
    '/images/recipes/zucchini-pesto.png',
    false,
    false,
    88
),
-- Recipe 4: Honey Garlic Glazed Salmon
(
    '00000000-0000-0000-0000-000000000004',
    NULL,
    'Honey Garlic Glazed Salmon',
    'Sweet and savory glazed salmon with rice',
    'asian',
    10,
    15,
    2,
    'easy',
    '[
        {"name": "salmon fillets", "amount": 2, "unit": "pieces", "category": "seafood"},
        {"name": "honey", "amount": 3, "unit": "tbsp", "category": "pantry"},
        {"name": "soy sauce", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "garlic", "amount": 3, "unit": "cloves", "category": "produce"},
        {"name": "ginger", "amount": 1, "unit": "inch", "category": "produce"},
        {"name": "rice", "amount": 1, "unit": "cup", "category": "grains"}
    ]'::jsonb,
    ARRAY[
        'Cook rice according to package',
        'Mix honey, soy sauce, minced garlic, and ginger',
        'Pat salmon dry and season with salt',
        'Heat pan over medium-high heat',
        'Sear salmon 3-4 minutes per side',
        'Add glaze in last minute of cooking',
        'Serve over rice with extra glaze'
    ],
    '{"calories": 420, "protein": 35, "carbs": 22, "fat": 20, "fiber": 1}'::jsonb,
    ARRAY['high-protein', 'dairy-free'],
    '/images/recipes/honey-salmon.png',
    false,
    false,
    95
),
-- Recipe 5: Creamy Chickpea Curry
(
    '00000000-0000-0000-0000-000000000005',
    NULL,
    'Creamy Chickpea Curry',
    'Rich coconut curry with warm naan bread',
    'indian',
    10,
    25,
    4,
    'easy',
    '[
        {"name": "chickpeas", "amount": 2, "unit": "cans", "category": "pantry"},
        {"name": "coconut milk", "amount": 1, "unit": "can", "category": "pantry"},
        {"name": "curry paste", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "onion", "amount": 1, "unit": "large", "category": "produce"},
        {"name": "garlic", "amount": 4, "unit": "cloves", "category": "produce"},
        {"name": "fresh spinach", "amount": 2, "unit": "cups", "category": "produce"}
    ]'::jsonb,
    ARRAY[
        'Dice onion and mince garlic',
        'Sauté onion until translucent',
        'Add garlic and curry paste, cook 1 minute',
        'Add drained chickpeas and coconut milk',
        'Simmer 15-20 minutes until thickened',
        'Stir in spinach until wilted',
        'Serve with naan bread or rice'
    ],
    '{"calories": 340, "protein": 12, "carbs": 48, "fat": 12, "fiber": 10}'::jsonb,
    ARRAY['vegan', 'dairy-free', 'high-fiber'],
    '/images/recipes/chickpea-curry.png',
    false,
    false,
    90
),
-- Recipe 6: Fresh Greek Salad
(
    '00000000-0000-0000-0000-000000000006',
    NULL,
    'Fresh Greek Salad',
    'Crisp vegetables with feta and lemon dressing',
    'mediterranean',
    15,
    0,
    2,
    'easy',
    '[
        {"name": "cucumber", "amount": 1, "unit": "large", "category": "produce"},
        {"name": "tomatoes", "amount": 2, "unit": "medium", "category": "produce"},
        {"name": "red onion", "amount": 0.5, "unit": "medium", "category": "produce"},
        {"name": "feta cheese", "amount": 4, "unit": "oz", "category": "dairy"},
        {"name": "kalamata olives", "amount": 0.5, "unit": "cup", "category": "pantry"},
        {"name": "olive oil", "amount": 3, "unit": "tbsp", "category": "pantry"}
    ]'::jsonb,
    ARRAY[
        'Chop cucumber and tomatoes into chunks',
        'Thinly slice red onion',
        'Combine vegetables in large bowl',
        'Add olives and crumbled feta',
        'Drizzle with olive oil and lemon juice',
        'Season with oregano, salt, and pepper'
    ],
    '{"calories": 280, "protein": 10, "carbs": 18, "fat": 20, "fiber": 4}'::jsonb,
    ARRAY['vegetarian', 'gluten-free', 'low-carb'],
    '/images/recipes/greek-salad.png',
    false,
    false,
    87
),
-- Recipe 7: Herb Grilled Chicken
(
    '00000000-0000-0000-0000-000000000007',
    NULL,
    'Herb Grilled Chicken',
    'Juicy chicken with roasted vegetables',
    'american',
    15,
    15,
    2,
    'medium',
    '[
        {"name": "chicken breast", "amount": 2, "unit": "pieces", "category": "meat"},
        {"name": "olive oil", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "fresh rosemary", "amount": 2, "unit": "sprigs", "category": "produce"},
        {"name": "fresh thyme", "amount": 4, "unit": "sprigs", "category": "produce"},
        {"name": "garlic", "amount": 3, "unit": "cloves", "category": "produce"},
        {"name": "lemon", "amount": 1, "unit": "whole", "category": "produce"}
    ]'::jsonb,
    ARRAY[
        'Pound chicken to even thickness',
        'Combine oil, herbs, garlic, and lemon zest',
        'Marinate chicken for 30 minutes (or longer)',
        'Preheat grill or pan to medium-high',
        'Grill chicken 6-7 minutes per side',
        'Rest for 5 minutes before slicing'
    ],
    '{"calories": 380, "protein": 42, "carbs": 12, "fat": 18, "fiber": 2}'::jsonb,
    ARRAY['high-protein', 'gluten-free', 'low-carb'],
    '/images/recipes/grilled-chicken.png',
    false,
    false,
    94
),
-- Recipe 8: Berry Smoothie Bowl
(
    '00000000-0000-0000-0000-000000000008',
    NULL,
    'Berry Smoothie Bowl',
    'Vibrant purple bowl with granola toppings',
    'american',
    10,
    0,
    1,
    'easy',
    '[
        {"name": "frozen mixed berries", "amount": 1.5, "unit": "cups", "category": "frozen"},
        {"name": "banana", "amount": 1, "unit": "frozen", "category": "produce"},
        {"name": "almond milk", "amount": 0.5, "unit": "cup", "category": "dairy"},
        {"name": "granola", "amount": 0.25, "unit": "cup", "category": "pantry"},
        {"name": "chia seeds", "amount": 1, "unit": "tbsp", "category": "pantry"}
    ]'::jsonb,
    ARRAY[
        'Blend frozen berries and banana with milk',
        'Blend until thick and smooth',
        'Pour into bowl',
        'Top with granola, fresh berries, and chia seeds'
    ],
    '{"calories": 290, "protein": 8, "carbs": 52, "fat": 6, "fiber": 10}'::jsonb,
    ARRAY['vegan', 'gluten-free'],
    '/images/recipes/berry-smoothie.png',
    false,
    false,
    85
),
-- Recipe 9: Asian Shrimp Stir Fry
(
    '00000000-0000-0000-0000-000000000009',
    NULL,
    'Asian Shrimp Stir Fry',
    'Colorful wok-fried shrimp with vegetables',
    'asian',
    10,
    10,
    2,
    'easy',
    '[
        {"name": "shrimp", "amount": 1, "unit": "lb", "category": "seafood"},
        {"name": "broccoli", "amount": 2, "unit": "cups", "category": "produce"},
        {"name": "bell pepper", "amount": 1, "unit": "large", "category": "produce"},
        {"name": "soy sauce", "amount": 3, "unit": "tbsp", "category": "pantry"},
        {"name": "sesame oil", "amount": 1, "unit": "tbsp", "category": "pantry"},
        {"name": "garlic", "amount": 3, "unit": "cloves", "category": "produce"}
    ]'::jsonb,
    ARRAY[
        'Prep all vegetables before cooking',
        'Heat wok or large pan over high heat',
        'Add oil and shrimp, cook 2 minutes',
        'Remove shrimp, add vegetables',
        'Stir-fry vegetables 3-4 minutes',
        'Add shrimp back with sauce',
        'Toss and serve over rice'
    ],
    '{"calories": 310, "protein": 28, "carbs": 18, "fat": 14, "fiber": 4}'::jsonb,
    ARRAY['high-protein', 'dairy-free'],
    '/images/recipes/shrimp-stir-fry.png',
    false,
    false,
    89
),
-- Recipe 10: Rainbow Buddha Bowl
(
    '00000000-0000-0000-0000-000000000010',
    NULL,
    'Rainbow Buddha Bowl',
    'Nourishing bowl with tahini drizzle',
    'american',
    20,
    5,
    2,
    'easy',
    '[
        {"name": "sweet potato", "amount": 1, "unit": "large", "category": "produce"},
        {"name": "chickpeas", "amount": 1, "unit": "can", "category": "pantry"},
        {"name": "kale", "amount": 2, "unit": "cups", "category": "produce"},
        {"name": "red cabbage", "amount": 1, "unit": "cup", "category": "produce"},
        {"name": "tahini", "amount": 3, "unit": "tbsp", "category": "pantry"},
        {"name": "avocado", "amount": 1, "unit": "whole", "category": "produce"}
    ]'::jsonb,
    ARRAY[
        'Cube and roast sweet potato at 400°F for 25 min',
        'Massage kale with olive oil and salt',
        'Shred red cabbage',
        'Make tahini dressing with lemon and water',
        'Arrange all components in bowls',
        'Drizzle with tahini dressing'
    ],
    '{"calories": 360, "protein": 14, "carbs": 42, "fat": 16, "fiber": 14}'::jsonb,
    ARRAY['vegan', 'gluten-free', 'high-fiber'],
    '/images/recipes/buddha-bowl.png',
    false,
    false,
    91
),
-- Recipe 11: Overnight Oats with Berries
(
    '00000000-0000-0000-0000-000000000011',
    NULL,
    'Overnight Oats with Berries',
    'Creamy make-ahead breakfast in a jar',
    'american',
    5,
    0,
    1,
    'easy',
    '[
        {"name": "rolled oats", "amount": 0.5, "unit": "cup", "category": "grains"},
        {"name": "milk", "amount": 0.5, "unit": "cup", "category": "dairy"},
        {"name": "greek yogurt", "amount": 0.25, "unit": "cup", "category": "dairy"},
        {"name": "chia seeds", "amount": 1, "unit": "tbsp", "category": "pantry"},
        {"name": "mixed berries", "amount": 0.5, "unit": "cup", "category": "produce"},
        {"name": "honey", "amount": 1, "unit": "tbsp", "category": "pantry"}
    ]'::jsonb,
    ARRAY[
        'Combine oats, milk, yogurt, and chia in jar',
        'Stir in honey',
        'Refrigerate overnight (or at least 4 hours)',
        'Top with fresh berries before eating'
    ],
    '{"calories": 320, "protein": 12, "carbs": 48, "fat": 10, "fiber": 8}'::jsonb,
    ARRAY['vegetarian', 'high-fiber'],
    '/images/recipes/overnight-oats.png',
    false,
    false,
    86
),
-- Recipe 12: Turkey Stuffed Peppers
(
    '00000000-0000-0000-0000-000000000012',
    NULL,
    'Turkey Stuffed Peppers',
    'Colorful peppers with lean ground turkey',
    'american',
    20,
    25,
    4,
    'medium',
    '[
        {"name": "bell peppers", "amount": 4, "unit": "large", "category": "produce"},
        {"name": "ground turkey", "amount": 1, "unit": "lb", "category": "meat"},
        {"name": "cooked rice", "amount": 1, "unit": "cup", "category": "grains"},
        {"name": "tomato sauce", "amount": 1, "unit": "cup", "category": "pantry"},
        {"name": "onion", "amount": 1, "unit": "medium", "category": "produce"},
        {"name": "mozzarella", "amount": 1, "unit": "cup", "category": "dairy"}
    ]'::jsonb,
    ARRAY[
        'Preheat oven to 375°F',
        'Cut tops off peppers and remove seeds',
        'Brown turkey with diced onion',
        'Mix turkey with rice and tomato sauce',
        'Stuff peppers with mixture',
        'Top with cheese',
        'Bake 25-30 minutes until peppers are tender'
    ],
    '{"calories": 390, "protein": 32, "carbs": 28, "fat": 16, "fiber": 4}'::jsonb,
    ARRAY['high-protein', 'gluten-free'],
    '/images/recipes/stuffed-peppers.png',
    false,
    false,
    93
),
-- Recipe 13: Hawaiian Tuna Poke Bowl
(
    '00000000-0000-0000-0000-000000000013',
    NULL,
    'Hawaiian Tuna Poke Bowl',
    'Fresh ahi tuna with edamame and seaweed',
    'asian',
    15,
    0,
    2,
    'easy',
    '[
        {"name": "sushi-grade ahi tuna", "amount": 0.5, "unit": "lb", "category": "seafood"},
        {"name": "sushi rice", "amount": 1, "unit": "cup", "category": "grains"},
        {"name": "soy sauce", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "sesame oil", "amount": 1, "unit": "tsp", "category": "pantry"},
        {"name": "edamame", "amount": 0.5, "unit": "cup", "category": "frozen"},
        {"name": "seaweed salad", "amount": 0.25, "unit": "cup", "category": "prepared"}
    ]'::jsonb,
    ARRAY[
        'Cook sushi rice and let cool slightly',
        'Cube tuna into 1/2 inch pieces',
        'Toss tuna with soy sauce, sesame oil, and green onion',
        'Let marinate 10 minutes',
        'Divide rice between bowls',
        'Top with poke, edamame, seaweed, and garnishes'
    ],
    '{"calories": 340, "protein": 28, "carbs": 32, "fat": 12, "fiber": 4}'::jsonb,
    ARRAY['high-protein', 'dairy-free'],
    '/images/recipes/tuna-poke.png',
    false,
    false,
    88
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    cuisine_type = EXCLUDED.cuisine_type,
    prep_time = EXCLUDED.prep_time,
    cook_time = EXCLUDED.cook_time,
    ingredients = EXCLUDED.ingredients,
    instructions = EXCLUDED.instructions,
    nutrition = EXCLUDED.nutrition,
    dietary_tags = EXCLUDED.dietary_tags,
    match_percentage = EXCLUDED.match_percentage;
