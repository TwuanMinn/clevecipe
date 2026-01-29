// Recipe API Service
// Handles all recipe-related API calls

export interface Recipe {
    id: string;
    title: string;
    description: string;
    cuisine_type: string;
    prep_time: number;
    cook_time: number;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: Array<{ name: string; amount: number; unit: string }>;
    instructions: string[];
    nutrition: {
        calories: number;
        protein: number;
        carbs: number;
        fat: number;
        fiber?: number;
    };
    dietary_tags: string[];
    cost_estimate?: number;
    match_percentage?: number;
    image_url?: string;
}

export interface GenerateRecipeParams {
    meal_type?: string;
    cuisine_preference?: string;
    cooking_time?: string;
    specific_ingredients?: string[];
    exclude_ingredients?: string[];
    calorie_range?: { min: number; max: number };
    servings?: number;
    user_preferences?: {
        dietary_restrictions?: string[];
        allergens?: string[];
        skill_level?: string;
        equipment?: string[];
    };
}

export interface GenerateRecipeResponse {
    success: boolean;
    data?: {
        recipes: Recipe[];
        generation_id: string;
        source: 'ai' | 'mock' | 'fallback';
    };
    error?: {
        code: string;
        message: string;
    };
}

class RecipeService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || '';
    }

    async generateRecipes(params: GenerateRecipeParams): Promise<GenerateRecipeResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/recipes/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Recipe generation failed:', error);
            return {
                success: false,
                error: {
                    code: 'FETCH_ERROR',
                    message: error instanceof Error ? error.message : 'Failed to generate recipes',
                },
            };
        }
    }

    async getRecipeById(id: string): Promise<Recipe | null> {
        // For now, return mock data - will be replaced with Supabase query
        const mockRecipes = await this.getMockRecipes();
        return mockRecipes.find(r => r.id === id) || null;
    }

    async searchRecipes(query: string, filters?: {
        cuisine?: string;
        dietary?: string[];
        maxTime?: number;
        difficulty?: string;
    }): Promise<Recipe[]> {
        // Mock search - will be replaced with Supabase query
        const recipes = await this.getMockRecipes();

        return recipes.filter(recipe => {
            // Match query in title or description
            const matchesQuery = !query ||
                recipe.title.toLowerCase().includes(query.toLowerCase()) ||
                recipe.description.toLowerCase().includes(query.toLowerCase());

            // Match cuisine filter
            const matchesCuisine = !filters?.cuisine ||
                recipe.cuisine_type === filters.cuisine;

            // Match dietary filters
            const matchesDietary = !filters?.dietary?.length ||
                filters.dietary.every(tag => recipe.dietary_tags.includes(tag));

            // Match max time
            const matchesTime = !filters?.maxTime ||
                (recipe.prep_time + recipe.cook_time) <= filters.maxTime;

            // Match difficulty
            const matchesDifficulty = !filters?.difficulty ||
                recipe.difficulty === filters.difficulty;

            return matchesQuery && matchesCuisine && matchesDietary && matchesTime && matchesDifficulty;
        });
    }

    async getPopularRecipes(limit = 10): Promise<Recipe[]> {
        const recipes = await this.getMockRecipes();
        return recipes.slice(0, limit);
    }

    async getRecommendedRecipes(preferences: {
        dietary?: string[];
        cuisines?: string[];
        calorieTarget?: number;
    }): Promise<Recipe[]> {
        const recipes = await this.getMockRecipes();

        // Simple recommendation based on preferences
        return recipes
            .filter(recipe => {
                if (preferences.dietary?.length) {
                    const hasMatch = preferences.dietary.some(pref =>
                        recipe.dietary_tags.includes(pref)
                    );
                    if (!hasMatch) return false;
                }

                if (preferences.cuisines?.length) {
                    if (!preferences.cuisines.includes(recipe.cuisine_type)) return false;
                }

                if (preferences.calorieTarget) {
                    const variance = preferences.calorieTarget * 0.2;
                    if (recipe.nutrition.calories < preferences.calorieTarget - variance ||
                        recipe.nutrition.calories > preferences.calorieTarget + variance) {
                        return false;
                    }
                }

                return true;
            })
            .sort((a, b) => (b.match_percentage || 0) - (a.match_percentage || 0));
    }

    private async getMockRecipes(): Promise<Recipe[]> {
        return [
            {
                id: '1',
                title: 'Mediterranean Quinoa Bowl',
                description: 'A vibrant, protein-packed bowl with fresh vegetables and tangy feta',
                cuisine_type: 'mediterranean',
                prep_time: 15,
                cook_time: 20,
                servings: 2,
                difficulty: 'easy',
                ingredients: [
                    { name: 'Quinoa', amount: 1, unit: 'cups' },
                    { name: 'Cherry Tomatoes', amount: 1, unit: 'cups' },
                    { name: 'Cucumber', amount: 1, unit: 'whole' },
                    { name: 'Feta Cheese', amount: 0.5, unit: 'cups' },
                ],
                instructions: [
                    'Rinse quinoa and cook according to package instructions.',
                    'Dice vegetables while quinoa cooks.',
                    'Combine all ingredients and drizzle with olive oil.',
                ],
                nutrition: { calories: 380, protein: 14, carbs: 42, fat: 18, fiber: 6 },
                dietary_tags: ['vegetarian', 'gluten-free'],
                cost_estimate: 8.50,
                match_percentage: 95,
                image_url: '/images/recipes/quinoa-bowl.jpg',
            },
            {
                id: '2',
                title: 'Honey Garlic Salmon',
                description: 'Perfectly glazed salmon with a sweet and savory honey garlic sauce',
                cuisine_type: 'asian',
                prep_time: 10,
                cook_time: 15,
                servings: 2,
                difficulty: 'easy',
                ingredients: [
                    { name: 'Salmon Fillets', amount: 2, unit: 'pieces' },
                    { name: 'Honey', amount: 3, unit: 'tablespoons' },
                    { name: 'Soy Sauce', amount: 2, unit: 'tablespoons' },
                    { name: 'Garlic', amount: 4, unit: 'cloves' },
                ],
                instructions: [
                    'Season salmon with salt and pepper.',
                    'Mix honey, soy sauce, and minced garlic.',
                    'Sear salmon and glaze with sauce.',
                    'Bake at 400°F for 8-10 minutes.',
                ],
                nutrition: { calories: 420, protein: 35, carbs: 22, fat: 20, fiber: 1 },
                dietary_tags: ['high-protein', 'dairy-free'],
                cost_estimate: 14.00,
                match_percentage: 88,
                image_url: '/images/recipes/salmon.jpg',
            },
            {
                id: '3',
                title: 'Chickpea Curry',
                description: 'Creamy coconut curry with tender chickpeas and aromatic spices',
                cuisine_type: 'indian',
                prep_time: 10,
                cook_time: 25,
                servings: 4,
                difficulty: 'easy',
                ingredients: [
                    { name: 'Chickpeas', amount: 2, unit: 'cups' },
                    { name: 'Coconut Milk', amount: 1, unit: 'cups' },
                    { name: 'Curry Powder', amount: 2, unit: 'tablespoons' },
                    { name: 'Spinach', amount: 2, unit: 'cups' },
                ],
                instructions: [
                    'Sauté onion and garlic.',
                    'Add curry powder and cook until fragrant.',
                    'Add chickpeas and coconut milk.',
                    'Simmer 15 minutes, add spinach.',
                ],
                nutrition: { calories: 340, protein: 12, carbs: 48, fat: 12, fiber: 9 },
                dietary_tags: ['vegan', 'dairy-free', 'high-fiber'],
                cost_estimate: 6.00,
                match_percentage: 92,
                image_url: '/images/recipes/chickpea-curry.jpg',
            },
        ];
    }
}

export const recipeService = new RecipeService();
