import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ================== USER PREFERENCES STORE ==================
interface UserPreferences {
    dietaryPreferences: string[];
    allergies: string[];
    healthGoals: string[];
    dailyCalorieTarget: number;
    servingSize: number;
    measurementUnit: 'metric' | 'imperial';
}

interface PreferencesStore extends UserPreferences {
    setDietaryPreferences: (prefs: string[]) => void;
    setAllergies: (allergies: string[]) => void;
    setHealthGoals: (goals: string[]) => void;
    setDailyCalorieTarget: (target: number) => void;
    setServingSize: (size: number) => void;
    setMeasurementUnit: (unit: 'metric' | 'imperial') => void;
    resetPreferences: () => void;
}

const defaultPreferences: UserPreferences = {
    dietaryPreferences: [],
    allergies: [],
    healthGoals: [],
    dailyCalorieTarget: 2000,
    servingSize: 2,
    measurementUnit: 'metric',
};

export const usePreferencesStore = create<PreferencesStore>()(
    persist(
        (set) => ({
            ...defaultPreferences,
            setDietaryPreferences: (prefs) => set({ dietaryPreferences: prefs }),
            setAllergies: (allergies) => set({ allergies }),
            setHealthGoals: (goals) => set({ healthGoals: goals }),
            setDailyCalorieTarget: (target) => set({ dailyCalorieTarget: target }),
            setServingSize: (size) => set({ servingSize: size }),
            setMeasurementUnit: (unit) => set({ measurementUnit: unit }),
            resetPreferences: () => set(defaultPreferences),
        }),
        {
            name: 'clevcipe-preferences',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ================== MEAL PLAN STORE ==================
export interface MealSlot {
    id: string;
    recipeId: string;
    recipeName: string;
    recipeImage: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    servings: number;
}

export interface DayPlan {
    date: string; // YYYY-MM-DD
    breakfast: MealSlot | null;
    lunch: MealSlot | null;
    dinner: MealSlot | null;
    snacks: MealSlot[];
}

interface MealPlanStore {
    weeklyPlan: Record<string, DayPlan>; // keyed by date
    selectedDate: string;
    setSelectedDate: (date: string) => void;
    setMeal: (date: string, mealType: 'breakfast' | 'lunch' | 'dinner', meal: MealSlot | null) => void;
    addSnack: (date: string, snack: MealSlot) => void;
    removeSnack: (date: string, snackId: string) => void;
    clearDay: (date: string) => void;
    clearWeek: () => void;
    getDayTotals: (date: string) => { calories: number; protein: number; carbs: number; fat: number };
}

const getEmptyDayPlan = (date: string): DayPlan => ({
    date,
    breakfast: null,
    lunch: null,
    dinner: null,
    snacks: [],
});

export const useMealPlanStore = create<MealPlanStore>()(
    persist(
        (set, get) => ({
            weeklyPlan: {},
            selectedDate: new Date().toISOString().split('T')[0],

            setSelectedDate: (date) => set({ selectedDate: date }),

            setMeal: (date, mealType, meal) => set((state) => {
                const dayPlan = state.weeklyPlan[date] || getEmptyDayPlan(date);
                return {
                    weeklyPlan: {
                        ...state.weeklyPlan,
                        [date]: { ...dayPlan, [mealType]: meal },
                    },
                };
            }),

            addSnack: (date, snack) => set((state) => {
                const dayPlan = state.weeklyPlan[date] || getEmptyDayPlan(date);
                return {
                    weeklyPlan: {
                        ...state.weeklyPlan,
                        [date]: { ...dayPlan, snacks: [...dayPlan.snacks, snack] },
                    },
                };
            }),

            removeSnack: (date, snackId) => set((state) => {
                const dayPlan = state.weeklyPlan[date];
                if (!dayPlan) return state;
                return {
                    weeklyPlan: {
                        ...state.weeklyPlan,
                        [date]: {
                            ...dayPlan,
                            snacks: dayPlan.snacks.filter(s => s.id !== snackId),
                        },
                    },
                };
            }),

            clearDay: (date) => set((state) => ({
                weeklyPlan: {
                    ...state.weeklyPlan,
                    [date]: getEmptyDayPlan(date),
                },
            })),

            clearWeek: () => set({ weeklyPlan: {} }),

            getDayTotals: (date) => {
                const dayPlan = get().weeklyPlan[date];
                if (!dayPlan) return { calories: 0, protein: 0, carbs: 0, fat: 0 };

                const meals = [dayPlan.breakfast, dayPlan.lunch, dayPlan.dinner, ...dayPlan.snacks].filter(Boolean) as MealSlot[];
                return meals.reduce(
                    (acc, meal) => ({
                        calories: acc.calories + meal.calories,
                        protein: acc.protein + meal.protein,
                        carbs: acc.carbs + meal.carbs,
                        fat: acc.fat + meal.fat,
                    }),
                    { calories: 0, protein: 0, carbs: 0, fat: 0 }
                );
            },
        }),
        {
            name: 'clevcipe-meal-plan',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ================== RECIPE HISTORY STORE ==================
export interface SavedRecipe {
    id: string;
    name: string;
    image: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    cookTime: number;
    savedAt: string;
    rating?: number;
    notes?: string;
}

interface RecipeHistoryStore {
    favorites: SavedRecipe[];
    recentlyViewed: SavedRecipe[];
    addToFavorites: (recipe: SavedRecipe) => void;
    removeFromFavorites: (recipeId: string) => void;
    isFavorite: (recipeId: string) => boolean;
    addToRecentlyViewed: (recipe: SavedRecipe) => void;
    clearRecentlyViewed: () => void;
    updateRecipeRating: (recipeId: string, rating: number) => void;
    updateRecipeNotes: (recipeId: string, notes: string) => void;
}

export const useRecipeHistoryStore = create<RecipeHistoryStore>()(
    persist(
        (set, get) => ({
            favorites: [],
            recentlyViewed: [],

            addToFavorites: (recipe) => set((state) => {
                if (state.favorites.some(r => r.id === recipe.id)) return state;
                return { favorites: [...state.favorites, { ...recipe, savedAt: new Date().toISOString() }] };
            }),

            removeFromFavorites: (recipeId) => set((state) => ({
                favorites: state.favorites.filter(r => r.id !== recipeId),
            })),

            isFavorite: (recipeId) => get().favorites.some(r => r.id === recipeId),

            addToRecentlyViewed: (recipe) => set((state) => {
                const filtered = state.recentlyViewed.filter(r => r.id !== recipe.id);
                const updated = [{ ...recipe, savedAt: new Date().toISOString() }, ...filtered].slice(0, 20);
                return { recentlyViewed: updated };
            }),

            clearRecentlyViewed: () => set({ recentlyViewed: [] }),

            updateRecipeRating: (recipeId, rating) => set((state) => ({
                favorites: state.favorites.map(r =>
                    r.id === recipeId ? { ...r, rating } : r
                ),
            })),

            updateRecipeNotes: (recipeId, notes) => set((state) => ({
                favorites: state.favorites.map(r =>
                    r.id === recipeId ? { ...r, notes } : r
                ),
            })),
        }),
        {
            name: 'clevcipe-recipe-history',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ================== SHOPPING LIST STORE ==================
export interface ShoppingItem {
    id: string;
    name: string;
    quantity: string;
    unit: string;
    category: string;
    checked: boolean;
    recipeId?: string;
    recipeName?: string;
}

interface ShoppingListStore {
    items: ShoppingItem[];
    addItem: (item: Omit<ShoppingItem, 'id' | 'checked'>) => void;
    removeItem: (itemId: string) => void;
    toggleItem: (itemId: string) => void;
    clearChecked: () => void;
    clearAll: () => void;
    generateFromMealPlan: (weeklyPlan: Record<string, DayPlan>) => void;
}

export const useShoppingListStore = create<ShoppingListStore>()(
    persist(
        (set) => ({
            items: [],

            addItem: (item) => set((state) => ({
                items: [...state.items, { ...item, id: crypto.randomUUID(), checked: false }],
            })),

            removeItem: (itemId) => set((state) => ({
                items: state.items.filter(i => i.id !== itemId),
            })),

            toggleItem: (itemId) => set((state) => ({
                items: state.items.map(i =>
                    i.id === itemId ? { ...i, checked: !i.checked } : i
                ),
            })),

            clearChecked: () => set((state) => ({
                items: state.items.filter(i => !i.checked),
            })),

            clearAll: () => set({ items: [] }),

            generateFromMealPlan: () => set((state) => {
                // This would aggregate ingredients from meal plan recipes
                // For now, keep existing items
                return state;
            }),
        }),
        {
            name: 'clevcipe-shopping-list',
            storage: createJSONStorage(() => localStorage),
        }
    )
);

// ================== NUTRITION LOG STORE ==================
export interface NutritionEntry {
    id: string;
    date: string;
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    loggedAt: string;
}

interface NutritionLogStore {
    entries: NutritionEntry[];
    addEntry: (entry: Omit<NutritionEntry, 'id' | 'loggedAt'>) => void;
    removeEntry: (entryId: string) => void;
    getEntriesForDate: (date: string) => NutritionEntry[];
    getDailyTotals: (date: string) => { calories: number; protein: number; carbs: number; fat: number };
    clearDate: (date: string) => void;
    getWeeklyData: (calorieTarget: number) => { day: string; value: number; isToday: boolean; date: string }[];
    getWeeklyAdherence: (calorieTarget: number) => number;
}

export const useNutritionLogStore = create<NutritionLogStore>()(
    persist(
        (set, get) => ({
            entries: [],

            addEntry: (entry) => set((state) => ({
                entries: [...state.entries, {
                    ...entry,
                    id: crypto.randomUUID(),
                    loggedAt: new Date().toISOString(),
                }],
            })),

            removeEntry: (entryId) => set((state) => ({
                entries: state.entries.filter(e => e.id !== entryId),
            })),

            getEntriesForDate: (date) => get().entries.filter(e => e.date === date),

            getDailyTotals: (date) => {
                const dayEntries = get().entries.filter(e => e.date === date);
                return dayEntries.reduce(
                    (acc, entry) => ({
                        calories: acc.calories + entry.calories,
                        protein: acc.protein + entry.protein,
                        carbs: acc.carbs + entry.carbs,
                        fat: acc.fat + entry.fat,
                    }),
                    { calories: 0, protein: 0, carbs: 0, fat: 0 }
                );
            },

            clearDate: (date) => set((state) => ({
                entries: state.entries.filter(e => e.date !== date),
            })),

            getWeeklyData: (calorieTarget) => {
                const today = new Date();
                const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
                const weekData = [];

                // Get the start of the week (Sunday)
                const startOfWeek = new Date(today);
                startOfWeek.setDate(today.getDate() - today.getDay());

                for (let i = 0; i < 7; i++) {
                    const date = new Date(startOfWeek);
                    date.setDate(startOfWeek.getDate() + i);
                    const dateStr = date.toISOString().split('T')[0];
                    const totals = get().getDailyTotals(dateStr);

                    // Calculate adherence as percentage of daily target achieved (max 100%)
                    const adherence = calorieTarget > 0
                        ? Math.min(Math.round((totals.calories / calorieTarget) * 100), 100)
                        : 0;

                    weekData.push({
                        day: dayNames[date.getDay()],
                        value: adherence,
                        isToday: dateStr === today.toISOString().split('T')[0],
                        date: dateStr,
                    });
                }

                return weekData;
            },

            getWeeklyAdherence: (calorieTarget) => {
                const weekData = get().getWeeklyData(calorieTarget);
                const daysWithData = weekData.filter(d => d.value > 0);
                if (daysWithData.length === 0) return 0;
                const total = daysWithData.reduce((sum, d) => sum + d.value, 0);
                return Math.round(total / daysWithData.length);
            },
        }),
        {
            name: 'clevcipe-nutrition-log',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
