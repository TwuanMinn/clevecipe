import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
            store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
            delete store[key];
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// Import after mocking
import {
    usePreferencesStore,
    useMealPlanStore,
    useRecipeHistoryStore,
    useShoppingListStore,
    useNutritionLogStore,
} from '../lib/stores';

describe('Preferences Store', () => {
    beforeEach(() => {
        localStorageMock.clear();
        usePreferencesStore.getState().resetPreferences();
    });

    it('should have default values', () => {
        const state = usePreferencesStore.getState();
        expect(state.dailyCalorieTarget).toBe(2000);
        expect(state.dietaryPreferences).toEqual([]);
        expect(state.measurementUnit).toBe('metric');
    });

    it('should update dietary preferences', () => {
        const { result } = renderHook(() => usePreferencesStore());

        act(() => {
            result.current.setDietaryPreferences(['vegetarian', 'gluten-free']);
        });

        expect(result.current.dietaryPreferences).toEqual(['vegetarian', 'gluten-free']);
    });

    it('should update calorie target', () => {
        const { result } = renderHook(() => usePreferencesStore());

        act(() => {
            result.current.setDailyCalorieTarget(1800);
        });

        expect(result.current.dailyCalorieTarget).toBe(1800);
    });

    it('should reset to defaults', () => {
        const { result } = renderHook(() => usePreferencesStore());

        act(() => {
            result.current.setDailyCalorieTarget(1500);
            result.current.setAllergies(['peanuts']);
            result.current.resetPreferences();
        });

        expect(result.current.dailyCalorieTarget).toBe(2000);
        expect(result.current.allergies).toEqual([]);
    });
});

describe('Meal Plan Store', () => {
    beforeEach(() => {
        useMealPlanStore.getState().clearWeek();
    });

    it('should set meals for a date', () => {
        const { result } = renderHook(() => useMealPlanStore());
        const testMeal = {
            id: 'meal-1',
            recipeId: 'recipe-1',
            recipeName: 'Test Recipe',
            recipeImage: '/test.jpg',
            calories: 500,
            protein: 30,
            carbs: 50,
            fat: 15,
            servings: 2,
        };

        act(() => {
            result.current.setMeal('2024-01-15', 'lunch', testMeal);
        });

        expect(result.current.weeklyPlan['2024-01-15']?.lunch).toEqual(testMeal);
    });

    it('should calculate day totals', () => {
        const { result } = renderHook(() => useMealPlanStore());

        act(() => {
            result.current.setMeal('2024-01-15', 'breakfast', {
                id: 'meal-1',
                recipeId: 'r1',
                recipeName: 'Breakfast',
                recipeImage: '',
                calories: 300,
                protein: 20,
                carbs: 30,
                fat: 10,
                servings: 1,
            });
            result.current.setMeal('2024-01-15', 'lunch', {
                id: 'meal-2',
                recipeId: 'r2',
                recipeName: 'Lunch',
                recipeImage: '',
                calories: 500,
                protein: 30,
                carbs: 50,
                fat: 15,
                servings: 1,
            });
        });

        const totals = result.current.getDayTotals('2024-01-15');
        expect(totals.calories).toBe(800);
        expect(totals.protein).toBe(50);
    });

    it('should clear day', () => {
        const { result } = renderHook(() => useMealPlanStore());

        act(() => {
            result.current.setMeal('2024-01-15', 'lunch', {
                id: 'meal-1',
                recipeId: 'r1',
                recipeName: 'Lunch',
                recipeImage: '',
                calories: 500,
                protein: 30,
                carbs: 50,
                fat: 15,
                servings: 1,
            });
            result.current.clearDay('2024-01-15');
        });

        expect(result.current.weeklyPlan['2024-01-15']?.lunch).toBeNull();
    });
});

describe('Recipe History Store', () => {
    beforeEach(() => {
        useRecipeHistoryStore.setState({ favorites: [], recentlyViewed: [] });
    });

    it('should add to favorites', () => {
        const { result } = renderHook(() => useRecipeHistoryStore());
        const recipe = {
            id: 'recipe-1',
            name: 'Test Recipe',
            image: '/test.jpg',
            calories: 400,
            protein: 25,
            carbs: 40,
            fat: 15,
            cookTime: 30,
            savedAt: new Date().toISOString(),
        };

        act(() => {
            result.current.addToFavorites(recipe);
        });

        expect(result.current.favorites).toHaveLength(1);
        expect(result.current.isFavorite('recipe-1')).toBe(true);
    });

    it('should not add duplicate favorites', () => {
        const { result } = renderHook(() => useRecipeHistoryStore());
        const recipe = {
            id: 'recipe-1',
            name: 'Test Recipe',
            image: '/test.jpg',
            calories: 400,
            protein: 25,
            carbs: 40,
            fat: 15,
            cookTime: 30,
            savedAt: new Date().toISOString(),
        };

        act(() => {
            result.current.addToFavorites(recipe);
            result.current.addToFavorites(recipe);
        });

        expect(result.current.favorites).toHaveLength(1);
    });

    it('should remove from favorites', () => {
        const { result } = renderHook(() => useRecipeHistoryStore());
        const recipe = {
            id: 'recipe-1',
            name: 'Test Recipe',
            image: '/test.jpg',
            calories: 400,
            protein: 25,
            carbs: 40,
            fat: 15,
            cookTime: 30,
            savedAt: new Date().toISOString(),
        };

        act(() => {
            result.current.addToFavorites(recipe);
            result.current.removeFromFavorites('recipe-1');
        });

        expect(result.current.favorites).toHaveLength(0);
        expect(result.current.isFavorite('recipe-1')).toBe(false);
    });
});

describe('Shopping List Store', () => {
    beforeEach(() => {
        useShoppingListStore.getState().clearAll();
    });

    it('should add items', () => {
        const { result } = renderHook(() => useShoppingListStore());

        act(() => {
            result.current.addItem({
                name: 'Apples',
                quantity: '5',
                unit: 'pieces',
                category: 'Produce',
            });
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].name).toBe('Apples');
    });

    it('should toggle item checked status', () => {
        const { result } = renderHook(() => useShoppingListStore());

        act(() => {
            result.current.addItem({
                name: 'Milk',
                quantity: '1',
                unit: 'gallon',
                category: 'Dairy',
            });
        });

        const itemId = result.current.items[0].id;

        act(() => {
            result.current.toggleItem(itemId);
        });

        expect(result.current.items[0].checked).toBe(true);
    });

    it('should clear checked items', () => {
        const { result } = renderHook(() => useShoppingListStore());

        act(() => {
            result.current.addItem({ name: 'Item 1', quantity: '1', unit: 'pc', category: 'Other' });
            result.current.addItem({ name: 'Item 2', quantity: '1', unit: 'pc', category: 'Other' });
        });

        const firstItemId = result.current.items[0].id;

        act(() => {
            result.current.toggleItem(firstItemId);
            result.current.clearChecked();
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].name).toBe('Item 2');
    });
});

describe('Nutrition Log Store', () => {
    beforeEach(() => {
        useNutritionLogStore.setState({ entries: [] });
    });

    it('should add nutrition entry', () => {
        const { result } = renderHook(() => useNutritionLogStore());

        act(() => {
            result.current.addEntry({
                date: '2024-01-15',
                mealType: 'lunch',
                name: 'Chicken Salad',
                calories: 450,
                protein: 35,
                carbs: 20,
                fat: 25,
            });
        });

        expect(result.current.entries).toHaveLength(1);
    });

    it('should get entries for date', () => {
        const { result } = renderHook(() => useNutritionLogStore());

        act(() => {
            result.current.addEntry({
                date: '2024-01-15',
                mealType: 'breakfast',
                name: 'Oatmeal',
                calories: 300,
                protein: 10,
                carbs: 50,
                fat: 8,
            });
            result.current.addEntry({
                date: '2024-01-16',
                mealType: 'breakfast',
                name: 'Eggs',
                calories: 200,
                protein: 15,
                carbs: 2,
                fat: 14,
            });
        });

        const entries = result.current.getEntriesForDate('2024-01-15');
        expect(entries).toHaveLength(1);
        expect(entries[0].name).toBe('Oatmeal');
    });

    it('should calculate daily totals', () => {
        const { result } = renderHook(() => useNutritionLogStore());

        act(() => {
            result.current.addEntry({
                date: '2024-01-15',
                mealType: 'breakfast',
                name: 'Oatmeal',
                calories: 300,
                protein: 10,
                carbs: 50,
                fat: 8,
            });
            result.current.addEntry({
                date: '2024-01-15',
                mealType: 'lunch',
                name: 'Sandwich',
                calories: 500,
                protein: 25,
                carbs: 60,
                fat: 18,
            });
        });

        const totals = result.current.getDailyTotals('2024-01-15');
        expect(totals.calories).toBe(800);
        expect(totals.protein).toBe(35);
        expect(totals.carbs).toBe(110);
        expect(totals.fat).toBe(26);
    });
});
