// Recipe API Service - Fetches recipes from Supabase (no hard-coded data)

import { supabase, isSupabaseConfigured } from './supabase';

// Types matching database schema
export interface Recipe {
    id: string;
    user_id: string | null;
    title: string;
    description: string | null;
    cuisine_type: string | null;
    prep_time: number | null;
    cook_time: number | null;
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    ingredients: Ingredient[];
    instructions: string[];
    nutrition: Nutrition;
    dietary_tags: string[];
    cost_estimate: number | null;
    image_url: string | null;
    is_ai_generated: boolean;
    is_favorite: boolean;
    match_percentage: number | null;
    rating: number | null;
    notes: string | null;
    created_at: string;
}

export interface Ingredient {
    name: string;
    amount: number;
    unit: string;
    category: string;
    note?: string;  // Optional preparation note (e.g., "diced", "minced")
}

export interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
}

// Category definition
export interface Category {
    id: string;
    label: string;
}

// Error class for recipe API errors
export class RecipeAPIError extends Error {
    constructor(message: string, public statusCode?: number) {
        super(message);
        this.name = 'RecipeAPIError';
    }
}

/**
 * Fetch all public recipes (system recipes for homepage/search)
 * These are recipes with user_id = NULL
 */
export async function fetchPublicRecipes(): Promise<Recipe[]> {
    if (!isSupabaseConfigured) {
        throw new RecipeAPIError(
            'Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
            503
        );
    }

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .is('user_id', null)
        .order('match_percentage', { ascending: false });

    if (error) {
        throw new RecipeAPIError(`Failed to fetch recipes: ${error.message}`, 500);
    }

    if (!data || data.length === 0) {
        throw new RecipeAPIError('No recipes found. Please run the seed_recipes.sql migration.', 404);
    }

    return data as Recipe[];
}

/**
 * Fetch a single recipe by ID
 */
export async function fetchRecipeById(id: string): Promise<Recipe> {
    if (!isSupabaseConfigured) {
        throw new RecipeAPIError(
            'Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.',
            503
        );
    }

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        throw new RecipeAPIError(`Failed to fetch recipe: ${error.message}`, 500);
    }

    if (!data) {
        throw new RecipeAPIError(`Recipe with ID ${id} not found`, 404);
    }

    return data as Recipe;
}

/**
 * Fetch user's favorite recipes
 */
export async function fetchUserFavorites(userId: string): Promise<Recipe[]> {
    if (!isSupabaseConfigured) {
        throw new RecipeAPIError('Database not configured.', 503);
    }

    const { data, error } = await supabase
        .from('recipes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_favorite', true)
        .order('created_at', { ascending: false });

    if (error) {
        throw new RecipeAPIError(`Failed to fetch favorites: ${error.message}`, 500);
    }

    return (data || []) as Recipe[];
}

/**
 * Search recipes by query
 */
export async function searchRecipes(query: string, filters?: {
    cuisine?: string;
    difficulty?: string;
    maxTime?: number;
    dietaryTags?: string[];
}): Promise<Recipe[]> {
    if (!isSupabaseConfigured) {
        throw new RecipeAPIError('Database not configured.', 503);
    }

    let queryBuilder = supabase
        .from('recipes')
        .select('*')
        .is('user_id', null);  // Only search public recipes

    // Text search on title
    if (query) {
        queryBuilder = queryBuilder.ilike('title', `%${query}%`);
    }

    // Apply filters
    if (filters?.cuisine) {
        queryBuilder = queryBuilder.eq('cuisine_type', filters.cuisine);
    }

    if (filters?.difficulty) {
        queryBuilder = queryBuilder.eq('difficulty', filters.difficulty);
    }

    if (filters?.maxTime) {
        // Filter by total time (prep + cook)
        queryBuilder = queryBuilder.lte('prep_time', filters.maxTime);
    }

    if (filters?.dietaryTags && filters.dietaryTags.length > 0) {
        // Filter by dietary tags (contains any of the specified tags)
        queryBuilder = queryBuilder.overlaps('dietary_tags', filters.dietaryTags);
    }

    const { data, error } = await queryBuilder
        .order('match_percentage', { ascending: false })
        .limit(50);

    if (error) {
        throw new RecipeAPIError(`Search failed: ${error.message}`, 500);
    }

    return (data || []) as Recipe[];
}

/**
 * Fetch recipes by category/dietary tag
 */
export async function fetchRecipesByCategory(categoryId: string): Promise<Recipe[]> {
    if (categoryId === 'all') {
        return fetchPublicRecipes();
    }

    if (!isSupabaseConfigured) {
        throw new RecipeAPIError('Database not configured.', 503);
    }

    let queryBuilder = supabase
        .from('recipes')
        .select('*')
        .is('user_id', null);

    // Handle special categories
    if (categoryId === 'quick') {
        // Recipes under 30 minutes total
        queryBuilder = queryBuilder.lte('prep_time', 20).lte('cook_time', 10);
    } else {
        // Category is a dietary tag
        queryBuilder = queryBuilder.contains('dietary_tags', [categoryId]);
    }

    const { data, error } = await queryBuilder
        .order('match_percentage', { ascending: false });

    if (error) {
        throw new RecipeAPIError(`Failed to fetch category: ${error.message}`, 500);
    }

    return (data || []) as Recipe[];
}

/**
 * Get available categories (could be fetched from DB in future)
 */
export function getCategories(): Category[] {
    // For now, these are static but could be moved to a DB table
    return [
        { id: 'all', label: 'All' },
        { id: 'quick', label: 'Quick (<30m)' },
        { id: 'high-protein', label: 'High Protein' },
        { id: 'low-carb', label: 'Low Carb' },
        { id: 'vegetarian', label: 'Vegetarian' },
        { id: 'vegan', label: 'Vegan' },
        { id: 'gluten-free', label: 'Gluten Free' },
    ];
}

/**
 * Save a recipe to user's collection
 */
export async function saveRecipe(recipe: Omit<Recipe, 'id' | 'created_at'>, userId: string): Promise<Recipe> {
    if (!isSupabaseConfigured) {
        throw new RecipeAPIError('Database not configured.', 503);
    }

    const { data, error } = await supabase
        .from('recipes')
        .insert({
            ...recipe,
            user_id: userId,
        })
        .select()
        .single();

    if (error) {
        throw new RecipeAPIError(`Failed to save recipe: ${error.message}`, 500);
    }

    return data as Recipe;
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(recipeId: string, isFavorite: boolean): Promise<void> {
    if (!isSupabaseConfigured) {
        throw new RecipeAPIError('Database not configured.', 503);
    }

    const { error } = await supabase
        .from('recipes')
        .update({ is_favorite: isFavorite })
        .eq('id', recipeId);

    if (error) {
        throw new RecipeAPIError(`Failed to update favorite: ${error.message}`, 500);
    }
}
