// React hook for fetching recipes with loading and error states

'use client';

import { useState, useEffect, useCallback } from 'react';
import {
    fetchPublicRecipes,
    fetchRecipeById,
    searchRecipes,
    fetchRecipesByCategory,
    Recipe,
    RecipeAPIError
} from './recipe-api';
import { isSupabaseConfigured } from './supabase';

// Fallback data for demo mode (only used when Supabase is not configured)
import { demoRecipes } from '@/data/homepage-data';

interface UseRecipesResult {
    recipes: Recipe[];
    isLoading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    isDemo: boolean;  // True when using fallback demo data
}

interface UseRecipeResult {
    recipe: Recipe | null;
    isLoading: boolean;
    error: Error | null;
}

/**
 * Hook to fetch all public recipes
 * Falls back to demo data ONLY when Supabase is not configured (dev mode)
 */
export function useRecipes(): UseRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isDemo, setIsDemo] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!isSupabaseConfigured) {
                // Demo mode - use static data (for local development only)
                console.warn('[useRecipes] Supabase not configured. Using demo data.');
                const demoData: Recipe[] = demoRecipes.map(r => ({
                    id: r.id,
                    user_id: null,
                    title: r.title,
                    description: `Delicious ${r.title.toLowerCase()} recipe`,
                    cuisine_type: 'american',
                    prep_time: r.prep_time,
                    cook_time: 0,
                    servings: 2,
                    difficulty: 'easy' as const,
                    ingredients: [],
                    instructions: [],
                    nutrition: { calories: r.calories, protein: 0, carbs: 0, fat: 0 },
                    dietary_tags: [],
                    cost_estimate: null,
                    image_url: r.image_url,
                    is_ai_generated: true,
                    is_favorite: false,
                    match_percentage: r.match_percentage,
                    rating: null,
                    notes: null,
                    created_at: new Date().toISOString(),
                }));
                setRecipes(demoData);
                setIsDemo(true);
            } else {
                // Production mode - fetch from Supabase
                const data = await fetchPublicRecipes();
                setRecipes(data);
                setIsDemo(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch recipes'));
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { recipes, isLoading, error, refetch: fetchData, isDemo };
}

/**
 * Hook to fetch a single recipe by ID
 */
export function useRecipe(id: string): UseRecipeResult {
    const [recipe, setRecipe] = useState<Recipe | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        async function fetchData() {
            setIsLoading(true);
            setError(null);

            try {
                if (!isSupabaseConfigured) {
                    // Demo mode - find in static data
                    const demoRecipe = demoRecipes.find(r => r.id === id);
                    if (demoRecipe) {
                        setRecipe({
                            id: demoRecipe.id,
                            user_id: null,
                            title: demoRecipe.title,
                            description: `Delicious ${demoRecipe.title.toLowerCase()} recipe`,
                            cuisine_type: 'american',
                            prep_time: demoRecipe.prep_time,
                            cook_time: 0,
                            servings: 2,
                            difficulty: 'easy',
                            ingredients: [],
                            instructions: [],
                            nutrition: { calories: demoRecipe.calories, protein: 0, carbs: 0, fat: 0 },
                            dietary_tags: [],
                            cost_estimate: null,
                            image_url: demoRecipe.image_url,
                            is_ai_generated: true,
                            is_favorite: false,
                            match_percentage: demoRecipe.match_percentage,
                            rating: null,
                            notes: null,
                            created_at: new Date().toISOString(),
                        });
                    } else {
                        throw new Error(`Recipe ${id} not found`);
                    }
                } else {
                    const data = await fetchRecipeById(id);
                    setRecipe(data);
                }
            } catch (err) {
                setError(err instanceof Error ? err : new Error('Failed to fetch recipe'));
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [id]);

    return { recipe, isLoading, error };
}

/**
 * Hook for searching recipes
 */
export function useRecipeSearch(query: string, filters?: {
    cuisine?: string;
    difficulty?: string;
    maxTime?: number;
    dietaryTags?: string[];
}): UseRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [isDemo, setIsDemo] = useState(false);

    const fetchData = useCallback(async () => {
        if (!query && !filters) {
            setRecipes([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (!isSupabaseConfigured) {
                // Demo mode - simple client-side filter
                const filtered = demoRecipes.filter(r =>
                    r.title.toLowerCase().includes(query.toLowerCase())
                );
                setRecipes(filtered.map(r => ({
                    id: r.id,
                    user_id: null,
                    title: r.title,
                    description: `Delicious ${r.title.toLowerCase()} recipe`,
                    cuisine_type: 'american',
                    prep_time: r.prep_time,
                    cook_time: 0,
                    servings: 2,
                    difficulty: 'easy' as const,
                    ingredients: [],
                    instructions: [],
                    nutrition: { calories: r.calories, protein: 0, carbs: 0, fat: 0 },
                    dietary_tags: [],
                    cost_estimate: null,
                    image_url: r.image_url,
                    is_ai_generated: true,
                    is_favorite: false,
                    match_percentage: r.match_percentage,
                    rating: null,
                    notes: null,
                    created_at: new Date().toISOString(),
                })));
                setIsDemo(true);
            } else {
                const data = await searchRecipes(query, filters);
                setRecipes(data);
                setIsDemo(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Search failed'));
        } finally {
            setIsLoading(false);
        }
    }, [query, filters]);

    useEffect(() => {
        const debounce = setTimeout(fetchData, 300);
        return () => clearTimeout(debounce);
    }, [fetchData]);

    return { recipes, isLoading, error, refetch: fetchData, isDemo };
}

/**
 * Hook for fetching recipes by category
 */
export function useRecipesByCategory(categoryId: string): UseRecipesResult {
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const [isDemo, setIsDemo] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            if (!isSupabaseConfigured) {
                // Demo mode - return all demo recipes
                setRecipes(demoRecipes.map(r => ({
                    id: r.id,
                    user_id: null,
                    title: r.title,
                    description: `Delicious ${r.title.toLowerCase()} recipe`,
                    cuisine_type: 'american',
                    prep_time: r.prep_time,
                    cook_time: 0,
                    servings: 2,
                    difficulty: 'easy' as const,
                    ingredients: [],
                    instructions: [],
                    nutrition: { calories: r.calories, protein: 0, carbs: 0, fat: 0 },
                    dietary_tags: [],
                    cost_estimate: null,
                    image_url: r.image_url,
                    is_ai_generated: true,
                    is_favorite: false,
                    match_percentage: r.match_percentage,
                    rating: null,
                    notes: null,
                    created_at: new Date().toISOString(),
                })));
                setIsDemo(true);
            } else {
                const data = await fetchRecipesByCategory(categoryId);
                setRecipes(data);
                setIsDemo(false);
            }
        } catch (err) {
            setError(err instanceof Error ? err : new Error('Failed to fetch category'));
        } finally {
            setIsLoading(false);
        }
    }, [categoryId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { recipes, isLoading, error, refetch: fetchData, isDemo };
}
