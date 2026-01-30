import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Types
interface RecipeGenerationRequest {
    meal_type?: string;
    cuisine_preference?: string;
    max_cooking_time?: number;
    difficulty?: string;
    dietary_restrictions?: string[];
    servings?: number;
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;

export async function POST(request: NextRequest) {
    try {
        const body: RecipeGenerationRequest = await request.json();

        // If Supabase is configured, fetch from database
        if (supabase) {
            const supabaseRecipes = await fetchRecipesFromSupabase(body);
            const mockRecipes = getMockRecipes(body);

            // Get titles from Supabase recipes to avoid duplicates
            const supabaseTitles = new Set(supabaseRecipes.map(r => r.title?.toLowerCase()));

            // Filter out mock recipes that have same title as Supabase recipes
            const uniqueMocks = mockRecipes.filter(m => !supabaseTitles.has(m.title.toLowerCase()));

            // Combine Supabase + unique mock recipes, ensuring at least 3
            let combinedRecipes = [...supabaseRecipes];

            // Add mock recipes if we don't have enough
            if (combinedRecipes.length < 3) {
                const neededCount = 3 - combinedRecipes.length;
                const additionalMocks = uniqueMocks.slice(0, neededCount);
                combinedRecipes = [...combinedRecipes, ...additionalMocks];
            }

            // Shuffle for variety and take 3
            combinedRecipes = combinedRecipes.sort(() => Math.random() - 0.5).slice(0, 3);

            return NextResponse.json({
                success: true,
                data: {
                    recipes: combinedRecipes.map(r => ({
                        ...r,
                        match_percentage: r.match_percentage || calculateMatchPercentage(r, body),
                    })),
                    generation_id: `gen_${Date.now()}`,
                    source: supabaseRecipes.length > 0 ? "supabase+mock" : "mock",
                },
            });
        }

        // Fallback to mock data if no Supabase
        return NextResponse.json({
            success: true,
            data: {
                recipes: getMockRecipes(body),
                generation_id: `gen_${Date.now()}`,
                source: "mock",
            },
        });
    } catch (error) {
        console.error("Recipe generation error:", error);

        return NextResponse.json({
            success: true,
            data: {
                recipes: getMockRecipes({} as RecipeGenerationRequest),
                generation_id: `gen_${Date.now()}`,
                source: "fallback",
            },
        });
    }
}

async function fetchRecipesFromSupabase(body: RecipeGenerationRequest) {
    if (!supabase) return [];

    try {
        // Fetch all recipes (don't filter by user_id since seeded recipes may vary)
        let query = supabase
            .from("recipes")
            .select("*");

        // Filter by cuisine if specified
        if (body.cuisine_preference && body.cuisine_preference !== "any") {
            query = query.ilike("cuisine_type", `%${body.cuisine_preference}%`);
        }

        // Filter by max cooking time
        if (body.max_cooking_time && body.max_cooking_time !== 60) {
            const maxTime = body.max_cooking_time === 60 ? 999 : body.max_cooking_time;
            query = query.lte("cook_time", maxTime);
        }

        // Filter by difficulty
        if (body.difficulty && body.difficulty !== "any") {
            query = query.eq("difficulty", body.difficulty);
        }

        // Limit to 6 recipes
        query = query.limit(6);

        const { data, error } = await query;

        if (error) {
            console.error("Supabase query error:", error);
            return [];
        }

        // If we have results, return them shuffled
        if (data && data.length > 0) {
            // Shuffle the results for variety
            const shuffled = data.sort(() => Math.random() - 0.5);

            // Filter by dietary restrictions if specified
            let filtered = shuffled;
            if (body.dietary_restrictions && body.dietary_restrictions.length > 0) {
                filtered = shuffled.filter(recipe => {
                    const recipeTags = recipe.dietary_tags || [];
                    return body.dietary_restrictions!.some(restriction =>
                        recipeTags.some((tag: string) =>
                            tag.toLowerCase().includes(restriction.toLowerCase())
                        )
                    );
                });
                // If no matches with dietary filter, return all shuffled
                if (filtered.length === 0) {
                    filtered = shuffled;
                }
            }

            // Return top 3
            return filtered.slice(0, 3);
        }

        return [];
    } catch (err) {
        console.error("Error fetching from Supabase:", err);
        return [];
    }
}

function calculateMatchPercentage(recipe: Record<string, unknown>, body: RecipeGenerationRequest): number {
    let score = 85; // Base score

    // Bonus for matching cuisine
    if (body.cuisine_preference && body.cuisine_preference !== "any") {
        const cuisineType = (recipe.cuisine_type as string || "").toLowerCase();
        if (cuisineType.includes(body.cuisine_preference.toLowerCase())) {
            score += 8;
        }
    }

    // Bonus for matching difficulty
    if (body.difficulty && body.difficulty !== "any") {
        if (recipe.difficulty === body.difficulty) {
            score += 5;
        }
    }

    // Bonus for matching dietary restrictions
    if (body.dietary_restrictions && body.dietary_restrictions.length > 0) {
        const recipeTags = (recipe.dietary_tags as string[]) || [];
        const matchCount = body.dietary_restrictions.filter(restriction =>
            recipeTags.some(tag => tag.toLowerCase().includes(restriction.toLowerCase()))
        ).length;
        score += matchCount * 3;
    }

    // Cap at 99%
    return Math.min(score, 99);
}

function getMockRecipes(body: RecipeGenerationRequest) {
    const timestamp = Date.now();

    const allRecipes = [
        // Mediterranean
        {
            id: `recipe_${timestamp}_1`,
            title: "Mediterranean Quinoa Bowl",
            description: "A vibrant, protein-packed bowl with fresh vegetables and tangy feta",
            cuisine_type: "mediterranean",
            prep_time: 15,
            cook_time: 20,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Quinoa", amount: 1, unit: "cups" },
                { name: "Cherry Tomatoes", amount: 1, unit: "cups" },
                { name: "Cucumber", amount: 1, unit: "whole" },
                { name: "Feta Cheese", amount: 0.5, unit: "cups" },
                { name: "Olive Oil", amount: 3, unit: "tablespoons" },
                { name: "Lemon", amount: 1, unit: "whole" },
            ],
            instructions: [
                "Rinse quinoa and cook according to package instructions.",
                "Dice cucumber and halve cherry tomatoes.",
                "Combine quinoa with vegetables, drizzle with olive oil.",
                "Top with crumbled feta and fresh lemon juice.",
            ],
            nutrition: { calories: 380, protein: 14, carbs: 42, fat: 18, fiber: 6 },
            dietary_tags: ["vegetarian", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
        },
        // Asian
        {
            id: `recipe_${timestamp}_2`,
            title: "Honey Garlic Glazed Salmon",
            description: "Perfectly glazed salmon with a sweet and savory honey garlic sauce",
            cuisine_type: "asian",
            prep_time: 10,
            cook_time: 15,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Salmon Fillets", amount: 2, unit: "pieces" },
                { name: "Honey", amount: 3, unit: "tablespoons" },
                { name: "Soy Sauce", amount: 2, unit: "tablespoons" },
                { name: "Garlic", amount: 4, unit: "cloves" },
                { name: "Ginger", amount: 1, unit: "inch" },
            ],
            instructions: [
                "Mix honey, soy sauce, minced garlic, and grated ginger.",
                "Sear salmon skin-side up in a hot pan for 3 minutes.",
                "Flip and pour sauce over salmon.",
                "Bake at 400°F for 10-12 minutes until caramelized.",
            ],
            nutrition: { calories: 420, protein: 35, carbs: 22, fat: 20, fiber: 1 },
            dietary_tags: ["high-protein", "dairy-free"],
            image_url: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
        },
        // Indian
        {
            id: `recipe_${timestamp}_3`,
            title: "Creamy Chickpea Curry",
            description: "Rich coconut curry with tender chickpeas and warming spices",
            cuisine_type: "indian",
            prep_time: 10,
            cook_time: 25,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Chickpeas", amount: 2, unit: "cups" },
                { name: "Coconut Milk", amount: 1, unit: "can" },
                { name: "Curry Powder", amount: 2, unit: "tablespoons" },
                { name: "Fresh Spinach", amount: 2, unit: "cups" },
                { name: "Onion", amount: 1, unit: "large" },
            ],
            instructions: [
                "Sauté diced onion until golden.",
                "Add curry powder and cook 1 minute until fragrant.",
                "Add chickpeas and coconut milk, simmer 15 minutes.",
                "Stir in spinach, season to taste, serve over basmati rice.",
            ],
            nutrition: { calories: 340, protein: 12, carbs: 48, fat: 12, fiber: 9 },
            dietary_tags: ["vegan", "dairy-free", "high-fiber"],
            image_url: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
        },
        // Italian
        {
            id: `recipe_${timestamp}_4`,
            title: "Zucchini Noodles with Pesto",
            description: "Light and fresh zucchini pasta with homemade basil pesto",
            cuisine_type: "italian",
            prep_time: 15,
            cook_time: 5,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Zucchini", amount: 3, unit: "medium" },
                { name: "Fresh Basil", amount: 2, unit: "cups" },
                { name: "Pine Nuts", amount: 0.25, unit: "cups" },
                { name: "Parmesan", amount: 0.5, unit: "cups" },
                { name: "Garlic", amount: 2, unit: "cloves" },
            ],
            instructions: [
                "Spiralize zucchini into noodles.",
                "Blend basil, pine nuts, parmesan, and garlic for pesto.",
                "Lightly sauté zoodles for 2-3 minutes.",
                "Toss with pesto and serve immediately.",
            ],
            nutrition: { calories: 210, protein: 8, carbs: 12, fat: 16, fiber: 4 },
            dietary_tags: ["vegetarian", "low-carb", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        },
        // Mexican
        {
            id: `recipe_${timestamp}_5`,
            title: "Black Bean Tacos",
            description: "Spiced black bean tacos with fresh lime crema and salsa",
            cuisine_type: "mexican",
            prep_time: 15,
            cook_time: 10,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Black Beans", amount: 2, unit: "cans" },
                { name: "Corn Tortillas", amount: 8, unit: "pieces" },
                { name: "Avocado", amount: 2, unit: "whole" },
                { name: "Lime", amount: 2, unit: "whole" },
                { name: "Fresh Cilantro", amount: 0.5, unit: "cups" },
            ],
            instructions: [
                "Mash black beans with cumin and chili powder.",
                "Warm tortillas in a dry pan.",
                "Fill with beans, sliced avocado, and cilantro.",
                "Drizzle with lime juice and serve.",
            ],
            nutrition: { calories: 320, protein: 14, carbs: 52, fat: 10, fiber: 16 },
            dietary_tags: ["vegan", "high-fiber"],
            image_url: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=400&h=300&fit=crop",
        },
        // Japanese
        {
            id: `recipe_${timestamp}_6`,
            title: "Teriyaki Chicken Bowl",
            description: "Juicy teriyaki chicken over rice with steamed vegetables",
            cuisine_type: "japanese",
            prep_time: 15,
            cook_time: 20,
            servings: body.servings || 2,
            difficulty: "medium",
            ingredients: [
                { name: "Chicken Thighs", amount: 1, unit: "lb" },
                { name: "Soy Sauce", amount: 0.25, unit: "cups" },
                { name: "Mirin", amount: 2, unit: "tablespoons" },
                { name: "Jasmine Rice", amount: 1, unit: "cups" },
                { name: "Broccoli", amount: 2, unit: "cups" },
            ],
            instructions: [
                "Cook rice according to package directions.",
                "Pan-fry chicken until golden, about 6 minutes per side.",
                "Add soy sauce and mirin, simmer until glossy.",
                "Serve over rice with steamed broccoli.",
            ],
            nutrition: { calories: 480, protein: 38, carbs: 45, fat: 14, fiber: 3 },
            dietary_tags: ["high-protein", "dairy-free"],
            image_url: "https://images.unsplash.com/photo-1609183480237-ccf5db5c4c9d?w=400&h=300&fit=crop",
        },
        // Thai
        {
            id: `recipe_${timestamp}_7`,
            title: "Thai Green Curry",
            description: "Aromatic green curry with vegetables and coconut milk",
            cuisine_type: "thai",
            prep_time: 15,
            cook_time: 20,
            servings: body.servings || 4,
            difficulty: "medium",
            ingredients: [
                { name: "Green Curry Paste", amount: 3, unit: "tablespoons" },
                { name: "Coconut Milk", amount: 1, unit: "can" },
                { name: "Chicken Breast", amount: 1, unit: "lb" },
                { name: "Thai Basil", amount: 1, unit: "cups" },
                { name: "Bell Peppers", amount: 2, unit: "whole" },
            ],
            instructions: [
                "Fry curry paste in a wok for 1 minute.",
                "Add coconut milk and bring to simmer.",
                "Add sliced chicken and peppers, cook 15 minutes.",
                "Finish with Thai basil, serve over rice.",
            ],
            nutrition: { calories: 390, protein: 28, carbs: 18, fat: 24, fiber: 4 },
            dietary_tags: ["dairy-free", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
        },
        // French
        {
            id: `recipe_${timestamp}_8`,
            title: "French Onion Soup",
            description: "Classic caramelized onion soup with melted gruyère",
            cuisine_type: "french",
            prep_time: 20,
            cook_time: 45,
            servings: body.servings || 4,
            difficulty: "medium",
            ingredients: [
                { name: "Yellow Onions", amount: 4, unit: "large" },
                { name: "Beef Broth", amount: 6, unit: "cups" },
                { name: "Gruyère Cheese", amount: 1, unit: "cups" },
                { name: "Baguette", amount: 1, unit: "whole" },
                { name: "Butter", amount: 4, unit: "tablespoons" },
            ],
            instructions: [
                "Slowly caramelize sliced onions in butter for 30 minutes.",
                "Add beef broth and simmer 15 minutes.",
                "Ladle into oven-safe bowls, top with bread and cheese.",
                "Broil until cheese is bubbly and golden.",
            ],
            nutrition: { calories: 350, protein: 18, carbs: 32, fat: 18, fiber: 3 },
            dietary_tags: ["vegetarian"],
            image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
        },
        // Greek
        {
            id: `recipe_${timestamp}_9`,
            title: "Greek Chicken Souvlaki",
            description: "Grilled marinated chicken skewers with tzatziki sauce",
            cuisine_type: "mediterranean",
            prep_time: 20,
            cook_time: 15,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Chicken Breast", amount: 1.5, unit: "lbs" },
                { name: "Greek Yogurt", amount: 1, unit: "cups" },
                { name: "Cucumber", amount: 1, unit: "whole" },
                { name: "Lemon", amount: 2, unit: "whole" },
                { name: "Oregano", amount: 2, unit: "tablespoons" },
            ],
            instructions: [
                "Marinate chicken in lemon, oregano, and olive oil for 1 hour.",
                "Thread onto skewers and grill 12-15 minutes.",
                "Make tzatziki with yogurt, grated cucumber, and garlic.",
                "Serve with warm pita and fresh vegetables.",
            ],
            nutrition: { calories: 340, protein: 42, carbs: 12, fat: 14, fiber: 2 },
            dietary_tags: ["high-protein", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
        },
        // Korean
        {
            id: `recipe_${timestamp}_10`,
            title: "Korean Bibimbap",
            description: "Colorful rice bowl with vegetables, egg, and gochujang sauce",
            cuisine_type: "asian",
            prep_time: 25,
            cook_time: 15,
            servings: body.servings || 2,
            difficulty: "medium",
            ingredients: [
                { name: "Short Grain Rice", amount: 1.5, unit: "cups" },
                { name: "Beef Bulgogi", amount: 0.5, unit: "lb" },
                { name: "Eggs", amount: 2, unit: "whole" },
                { name: "Gochujang", amount: 2, unit: "tablespoons" },
                { name: "Spinach", amount: 2, unit: "cups" },
            ],
            instructions: [
                "Cook rice and keep warm.",
                "Prepare and sauté vegetables separately.",
                "Cook bulgogi beef until caramelized.",
                "Arrange over rice, top with fried egg and gochujang.",
            ],
            nutrition: { calories: 520, protein: 28, carbs: 62, fat: 18, fiber: 5 },
            dietary_tags: ["high-protein"],
            image_url: "https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop",
        },
        // American
        {
            id: `recipe_${timestamp}_11`,
            title: "Classic Beef Burger",
            description: "Juicy beef burger with all the classic toppings",
            cuisine_type: "american",
            prep_time: 15,
            cook_time: 12,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Ground Beef", amount: 1, unit: "lb" },
                { name: "Burger Buns", amount: 2, unit: "whole" },
                { name: "Cheddar Cheese", amount: 2, unit: "slices" },
                { name: "Lettuce", amount: 2, unit: "leaves" },
                { name: "Tomato", amount: 1, unit: "whole" },
            ],
            instructions: [
                "Form beef into patties, season generously.",
                "Grill or pan-fry 4-5 minutes per side.",
                "Add cheese in last minute to melt.",
                "Assemble with lettuce, tomato, and your favorite sauce.",
            ],
            nutrition: { calories: 650, protein: 42, carbs: 35, fat: 38, fiber: 2 },
            dietary_tags: ["high-protein"],
            image_url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
        },
        // Breakfast
        {
            id: `recipe_${timestamp}_12`,
            title: "Avocado Toast with Poached Egg",
            description: "Creamy avocado on sourdough with a perfect poached egg",
            cuisine_type: "american",
            prep_time: 10,
            cook_time: 5,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Sourdough Bread", amount: 2, unit: "slices" },
                { name: "Avocado", amount: 1, unit: "whole" },
                { name: "Eggs", amount: 2, unit: "whole" },
                { name: "Red Pepper Flakes", amount: 0.5, unit: "teaspoon" },
                { name: "Lemon", amount: 0.5, unit: "whole" },
            ],
            instructions: [
                "Toast sourdough until golden and crispy.",
                "Mash avocado with lemon juice, salt, and pepper.",
                "Poach eggs in simmering water for 3-4 minutes.",
                "Spread avocado on toast, top with egg and chili flakes.",
            ],
            nutrition: { calories: 320, protein: 14, carbs: 28, fat: 18, fiber: 8 },
            dietary_tags: ["vegetarian", "high-fiber"],
            image_url: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
        },
        // Healthy
        {
            id: `recipe_${timestamp}_13`,
            title: "Grilled Chicken Salad",
            description: "Fresh mixed greens with grilled chicken and balsamic vinaigrette",
            cuisine_type: "american",
            prep_time: 15,
            cook_time: 15,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Chicken Breast", amount: 2, unit: "pieces" },
                { name: "Mixed Greens", amount: 4, unit: "cups" },
                { name: "Cherry Tomatoes", amount: 1, unit: "cups" },
                { name: "Balsamic Vinegar", amount: 2, unit: "tablespoons" },
                { name: "Olive Oil", amount: 3, unit: "tablespoons" },
            ],
            instructions: [
                "Season and grill chicken 6-7 minutes per side.",
                "Let rest 5 minutes, then slice.",
                "Toss greens with tomatoes and dressing.",
                "Top with sliced chicken and serve.",
            ],
            nutrition: { calories: 290, protein: 35, carbs: 12, fat: 14, fiber: 4 },
            dietary_tags: ["high-protein", "low-carb", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
        },
        // Vegan
        {
            id: `recipe_${timestamp}_14`,
            title: "Buddha Bowl",
            description: "Nourishing bowl with quinoa, roasted veggies, and tahini dressing",
            cuisine_type: "mediterranean",
            prep_time: 20,
            cook_time: 30,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Quinoa", amount: 1, unit: "cups" },
                { name: "Sweet Potato", amount: 1, unit: "large" },
                { name: "Chickpeas", amount: 1, unit: "can" },
                { name: "Kale", amount: 2, unit: "cups" },
                { name: "Tahini", amount: 3, unit: "tablespoons" },
            ],
            instructions: [
                "Roast cubed sweet potato and chickpeas at 400°F for 25 minutes.",
                "Cook quinoa and massage kale with olive oil.",
                "Make dressing with tahini, lemon, and garlic.",
                "Assemble bowls and drizzle with dressing.",
            ],
            nutrition: { calories: 420, protein: 16, carbs: 58, fat: 16, fiber: 12 },
            dietary_tags: ["vegan", "high-fiber", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1540914124281-342587941389?w=400&h=300&fit=crop",
        },
        // Keto
        {
            id: `recipe_${timestamp}_15`,
            title: "Cauliflower Fried Rice",
            description: "Low-carb fried rice with vegetables and scrambled eggs",
            cuisine_type: "asian",
            prep_time: 15,
            cook_time: 15,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Cauliflower", amount: 1, unit: "large head" },
                { name: "Eggs", amount: 3, unit: "whole" },
                { name: "Soy Sauce", amount: 2, unit: "tablespoons" },
                { name: "Sesame Oil", amount: 1, unit: "tablespoon" },
                { name: "Green Peas", amount: 0.5, unit: "cups" },
            ],
            instructions: [
                "Pulse cauliflower in food processor until rice-sized.",
                "Scramble eggs and set aside.",
                "Stir-fry cauliflower rice with vegetables 5-7 minutes.",
                "Add eggs, soy sauce, and sesame oil. Serve hot.",
            ],
            nutrition: { calories: 180, protein: 12, carbs: 14, fat: 10, fiber: 5 },
            dietary_tags: ["keto", "low-carb", "vegetarian"],
            image_url: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
        },
        // Pasta
        {
            id: `recipe_${timestamp}_16`,
            title: "Creamy Tuscan Pasta",
            description: "Rich and creamy pasta with sun-dried tomatoes and spinach",
            cuisine_type: "italian",
            prep_time: 10,
            cook_time: 20,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Penne Pasta", amount: 1, unit: "lb" },
                { name: "Heavy Cream", amount: 1, unit: "cups" },
                { name: "Sun-dried Tomatoes", amount: 0.5, unit: "cups" },
                { name: "Spinach", amount: 3, unit: "cups" },
                { name: "Parmesan", amount: 0.5, unit: "cups" },
            ],
            instructions: [
                "Cook pasta according to package directions.",
                "Sauté garlic and sun-dried tomatoes.",
                "Add cream and simmer until thickened.",
                "Toss with pasta, spinach, and parmesan.",
            ],
            nutrition: { calories: 520, protein: 18, carbs: 62, fat: 24, fiber: 4 },
            dietary_tags: ["vegetarian"],
            image_url: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
        },
        // Seafood
        {
            id: `recipe_${timestamp}_17`,
            title: "Garlic Butter Shrimp",
            description: "Succulent shrimp in a rich garlic butter sauce",
            cuisine_type: "italian",
            prep_time: 10,
            cook_time: 10,
            servings: body.servings || 2,
            difficulty: "easy",
            ingredients: [
                { name: "Large Shrimp", amount: 1, unit: "lb" },
                { name: "Butter", amount: 4, unit: "tablespoons" },
                { name: "Garlic", amount: 6, unit: "cloves" },
                { name: "White Wine", amount: 0.25, unit: "cups" },
                { name: "Fresh Parsley", amount: 0.25, unit: "cups" },
            ],
            instructions: [
                "Melt butter and sauté garlic until fragrant.",
                "Add shrimp and cook 2 minutes per side.",
                "Deglaze with white wine and simmer 2 minutes.",
                "Garnish with parsley, serve over pasta or bread.",
            ],
            nutrition: { calories: 340, protein: 32, carbs: 6, fat: 22, fiber: 0 },
            dietary_tags: ["high-protein", "low-carb", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
        },
        // Soup
        {
            id: `recipe_${timestamp}_18`,
            title: "Tomato Basil Soup",
            description: "Velvety smooth tomato soup with fresh basil",
            cuisine_type: "italian",
            prep_time: 10,
            cook_time: 30,
            servings: body.servings || 4,
            difficulty: "easy",
            ingredients: [
                { name: "Crushed Tomatoes", amount: 2, unit: "cans" },
                { name: "Vegetable Broth", amount: 2, unit: "cups" },
                { name: "Fresh Basil", amount: 1, unit: "cups" },
                { name: "Heavy Cream", amount: 0.5, unit: "cups" },
                { name: "Onion", amount: 1, unit: "large" },
            ],
            instructions: [
                "Sauté onion until soft.",
                "Add tomatoes and broth, simmer 20 minutes.",
                "Blend until smooth, stir in cream.",
                "Garnish with fresh basil and serve.",
            ],
            nutrition: { calories: 190, protein: 4, carbs: 22, fat: 10, fiber: 4 },
            dietary_tags: ["vegetarian", "gluten-free"],
            image_url: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400&h=300&fit=crop",
        },
    ];

    // Filter by cuisine if specified
    let filtered = allRecipes;
    if (body.cuisine_preference && body.cuisine_preference !== "any") {
        const cuisineFiltered = allRecipes.filter(r =>
            r.cuisine_type.toLowerCase().includes(body.cuisine_preference!.toLowerCase())
        );
        if (cuisineFiltered.length >= 3) {
            filtered = cuisineFiltered;
        }
    }

    // Filter by dietary restrictions if specified
    if (body.dietary_restrictions && body.dietary_restrictions.length > 0) {
        const dietaryFiltered = filtered.filter(r =>
            body.dietary_restrictions!.some(diet =>
                r.dietary_tags.some(tag => tag.toLowerCase().includes(diet.toLowerCase()))
            )
        );
        if (dietaryFiltered.length >= 3) {
            filtered = dietaryFiltered;
        }
    }

    // Shuffle and pick 3 random recipes
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    // Add match percentages
    return selected.map((recipe, index) => ({
        ...recipe,
        match_percentage: Math.floor(85 + Math.random() * 14), // 85-99%
    }));
}


