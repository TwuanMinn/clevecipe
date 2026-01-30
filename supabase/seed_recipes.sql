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
    'Colorful Mediterranean bowl with chickpeas, fresh veggies, and tahini dressing',
    'mediterranean',
    15,
    15,
    2,
    'easy',
    '[
        {"name": "quinoa", "amount": 1, "unit": "cup", "category": "grains"},
        {"name": "water or vegetable broth", "amount": 2, "unit": "cups", "category": "pantry"},
        {"name": "chickpeas", "amount": 1, "unit": "can (15 oz)", "category": "pantry"},
        {"name": "english cucumber", "amount": 1, "unit": "whole", "category": "produce"},
        {"name": "cherry tomatoes", "amount": 1.5, "unit": "cups", "category": "produce"},
        {"name": "red bell pepper", "amount": 1, "unit": "whole", "category": "produce"},
        {"name": "kalamata olives", "amount": 0.5, "unit": "cup", "category": "pantry"},
        {"name": "tahini", "amount": 3, "unit": "tbsp", "category": "pantry"},
        {"name": "fresh lemon", "amount": 1, "unit": "whole", "category": "produce"},
        {"name": "fresh parsley", "amount": 0.25, "unit": "cup", "category": "produce"},
        {"name": "extra virgin olive oil", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "garlic", "amount": 1, "unit": "clove", "category": "produce"}
    ]'::jsonb,
    ARRAY[
        'Rinse quinoa thoroughly under cold water. Bring 2 cups of water or broth to a boil, add quinoa, reduce heat, cover, and simmer for 15 minutes.',
        'While quinoa cooks, drain and rinse the chickpeas. Pat dry and toss with 1 tbsp olive oil, salt, and pepper. Optionally roast at 400°F for 15 minutes for extra crunch.',
        'Dice the cucumber into small cubes, halve the cherry tomatoes, and dice the bell pepper. Slice the olives if desired.',
        'Make the tahini dressing: Whisk together tahini, lemon juice, minced garlic, and 2-3 tbsp water until smooth. Season with salt.',
        'Fluff the cooked quinoa with a fork and let it cool slightly for about 5 minutes.',
        'Divide the quinoa between serving bowls. Arrange the vegetables, chickpeas, and olives in sections on top.',
        'Drizzle generously with the tahini dressing and remaining olive oil.',
        'Garnish with fresh chopped parsley and a squeeze of lemon. Serve immediately or refrigerate for meal prep.'
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
    'Sweet and savory glazed salmon with steamed rice and vegetables',
    'asian',
    10,
    15,
    2,
    'easy',
    '[
        {"name": "salmon fillets", "amount": 2, "unit": "pieces (6 oz each)", "category": "seafood"},
        {"name": "honey", "amount": 3, "unit": "tbsp", "category": "pantry"},
        {"name": "low-sodium soy sauce", "amount": 3, "unit": "tbsp", "category": "pantry"},
        {"name": "fresh garlic", "amount": 5, "unit": "cloves", "category": "produce"},
        {"name": "fresh ginger", "amount": 2, "unit": "inches", "category": "produce"},
        {"name": "rice vinegar", "amount": 1, "unit": "tbsp", "category": "pantry"},
        {"name": "sesame oil", "amount": 1, "unit": "tbsp", "category": "pantry"},
        {"name": "vegetable oil", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "green onions", "amount": 3, "unit": "stalks", "category": "produce"},
        {"name": "sesame seeds", "amount": 1, "unit": "tbsp", "category": "pantry"},
        {"name": "steamed broccoli", "amount": 2, "unit": "cups", "category": "produce"},
        {"name": "jasmine rice", "amount": 1, "unit": "cup (cooked)", "category": "grains"}
    ]'::jsonb,
    ARRAY[
        'Pat salmon fillets dry with paper towels and season both sides with salt and pepper. Let sit at room temperature for 10 minutes.',
        'In a small bowl, whisk together honey, soy sauce, rice vinegar, and sesame oil. Mince the garlic and grate the ginger finely, then add to the sauce mixture.',
        'Heat vegetable oil in a large oven-safe skillet over medium-high heat until shimmering.',
        'Place salmon fillets skin-side up in the hot pan. Sear without moving for 3-4 minutes until a golden crust forms on the bottom.',
        'Carefully flip the salmon and pour the honey garlic sauce around the fillets. Tilt the pan to coat the salmon evenly.',
        'Transfer the skillet to a preheated 400°F (200°C) oven. Bake for 8-10 minutes until the salmon flakes easily and the glaze is caramelized.',
        'Remove from oven and let rest for 2 minutes. Baste the salmon with the pan sauce one more time.',
        'Garnish with sliced green onions and sesame seeds. Serve immediately over steamed jasmine rice with broccoli.'
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
    'Rich coconut curry with tender chickpeas, warming spices, and fresh naan bread',
    'indian',
    15,
    25,
    4,
    'easy',
    '[
        {"name": "chickpeas", "amount": 2, "unit": "cans (15 oz each)", "category": "pantry"},
        {"name": "full-fat coconut milk", "amount": 1, "unit": "can (14 oz)", "category": "pantry"},
        {"name": "curry powder", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "garam masala", "amount": 1, "unit": "tsp", "category": "pantry"},
        {"name": "yellow onion", "amount": 1, "unit": "large", "category": "produce"},
        {"name": "fresh garlic", "amount": 4, "unit": "cloves", "category": "produce"},
        {"name": "fresh ginger", "amount": 1, "unit": "inch", "category": "produce"},
        {"name": "diced tomatoes", "amount": 1, "unit": "can (14 oz)", "category": "pantry"},
        {"name": "fresh spinach", "amount": 3, "unit": "cups", "category": "produce"},
        {"name": "vegetable oil", "amount": 2, "unit": "tbsp", "category": "pantry"},
        {"name": "fresh cilantro", "amount": 0.25, "unit": "cup", "category": "produce"},
        {"name": "basmati rice or naan", "amount": 2, "unit": "cups cooked", "category": "grains"}
    ]'::jsonb,
    ARRAY[
        'Drain and rinse the chickpeas. Dice the onion, mince the garlic, and grate the ginger. Set aside.',
        'Heat vegetable oil in a large, deep skillet or Dutch oven over medium heat.',
        'Add the diced onion and cook for 5-6 minutes until softened and lightly golden, stirring occasionally.',
        'Add the garlic and ginger, cook for 1 minute until fragrant. Stir in curry powder and garam masala, cook for 30 seconds.',
        'Pour in the diced tomatoes and coconut milk. Stir well to combine and bring to a gentle simmer.',
        'Add the chickpeas and let the curry simmer uncovered for 15-20 minutes, stirring occasionally, until the sauce has thickened slightly.',
        'Stir in the fresh spinach and cook for 2-3 minutes until wilted. Season generously with salt and pepper to taste.',
        'Garnish with fresh cilantro and serve hot over fluffy basmati rice or with warm naan bread. Leftovers keep well for up to 4 days.'
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
