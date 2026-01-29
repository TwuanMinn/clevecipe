// ============================================
// CLEVCIPE - TypeScript Type Definitions
// ============================================

// -------------------------
// User & Authentication
// -------------------------

export interface User {
    id: string;
    email: string;
    full_name?: string;
    avatar_url?: string;
    onboarding_completed: boolean;
    created_at: string;
    updated_at?: string;
}

export interface UserPreferences {
    id: string;
    user_id: string;
    dietary_restrictions: DietaryRestriction[];
    allergens: string[];
    nutritional_goals: NutritionalGoals;
    taste_preferences: TastePreferences;
    household_info: HouseholdInfo;
    created_at: string;
    updated_at: string;
}

// -------------------------
// Dietary & Nutrition
// -------------------------

export type DietaryRestriction =
    | "vegetarian"
    | "vegan"
    | "gluten-free"
    | "dairy-free"
    | "keto"
    | "paleo"
    | "halal"
    | "kosher"
    | "nut-free"
    | "shellfish-free"
    | "low-sodium"
    | "low-sugar";

export interface NutritionalGoals {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
    goal_type: GoalType;
    meals_per_day: number;
}

export type GoalType =
    | "weight-loss"
    | "muscle-gain"
    | "maintenance"
    | "heart-health"
    | "diabetes-management";

export interface Nutrition {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sodium?: number;
}

// -------------------------
// Taste & Cooking Preferences
// -------------------------

export interface TastePreferences {
    cuisines: CuisineType[];
    spice_level: SpiceLevel;
    cooking_time: CookingTime;
    dislikes: string[];
}

export type CuisineType =
    | "italian"
    | "mexican"
    | "asian"
    | "mediterranean"
    | "american"
    | "indian"
    | "french"
    | "japanese"
    | "chinese"
    | "thai"
    | "greek"
    | "middle-eastern"
    | "korean"
    | "vietnamese";

export type SpiceLevel = "mild" | "medium" | "hot";

export type CookingTime = "quick" | "medium" | "elaborate";

export interface HouseholdInfo {
    servings: number;
    equipment: KitchenEquipment[];
    skill_level: SkillLevel;
}

export type KitchenEquipment =
    | "oven"
    | "stovetop"
    | "microwave"
    | "air-fryer"
    | "slow-cooker"
    | "instant-pot"
    | "grill"
    | "blender"
    | "food-processor";

export type SkillLevel = "beginner" | "intermediate" | "advanced";

// -------------------------
// Recipe
// -------------------------

export interface Recipe {
    id: string;
    user_id?: string;
    title: string;
    description?: string;
    cuisine_type?: CuisineType | string;
    prep_time?: number; // minutes
    cook_time?: number; // minutes
    servings: number;
    difficulty: Difficulty;
    ingredients: Ingredient[];
    instructions: string[];
    nutrition?: Nutrition;
    dietary_tags: string[];
    cost_estimate?: number;
    image_url?: string;
    is_ai_generated: boolean;
    is_favorite: boolean;
    match_percentage?: number;
    rating?: number;
    notes?: string;
    created_at: string;
}

export type Difficulty = "easy" | "medium" | "hard";

export interface Ingredient {
    name: string;
    amount: number;
    unit: IngredientUnit;
    category?: IngredientCategory;
    note?: string;
}

export type IngredientUnit =
    | "cups"
    | "cup"
    | "tablespoons"
    | "tbsp"
    | "teaspoons"
    | "tsp"
    | "ounces"
    | "oz"
    | "pounds"
    | "lb"
    | "grams"
    | "g"
    | "kilograms"
    | "kg"
    | "milliliters"
    | "ml"
    | "liters"
    | "l"
    | "pieces"
    | "slices"
    | "cloves"
    | "whole"
    | "to taste";

export type IngredientCategory =
    | "produce"
    | "meat"
    | "seafood"
    | "dairy"
    | "grains"
    | "pantry"
    | "frozen"
    | "spices"
    | "condiments"
    | "beverages"
    | "other";

// -------------------------
// Meal Planning
// -------------------------

export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export interface MealPlan {
    id: string;
    user_id: string;
    date: string; // YYYY-MM-DD
    meal_type: MealType;
    recipe_id?: string;
    recipe?: Recipe;
    servings_override?: number;
    created_at: string;
}

export interface DailyMealPlan {
    date: string;
    breakfast?: MealPlan;
    lunch?: MealPlan;
    dinner?: MealPlan;
    snacks: MealPlan[];
    total_nutrition: Nutrition;
}

export interface WeeklyMealPlan {
    week_start: string;
    days: DailyMealPlan[];
}

// -------------------------
// Shopping List
// -------------------------

export interface ShoppingList {
    id: string;
    user_id: string;
    week_start_date: string;
    items: ShoppingItem[];
    created_at: string;
    updated_at: string;
}

export interface ShoppingItem {
    id: string;
    name: string;
    amount: number;
    unit: IngredientUnit;
    category: IngredientCategory;
    checked: boolean;
    recipe_ids: string[]; // Which recipes need this ingredient
}

// -------------------------
// Nutrition Tracking
// -------------------------

export interface NutritionLog {
    id: string;
    user_id: string;
    date: string;
    meal_type: MealType;
    recipe_id?: string;
    custom_meal_name?: string;
    nutrition_logged: Nutrition;
    created_at: string;
}

export interface DailyNutrition {
    date: string;
    consumed: Nutrition;
    target: Nutrition;
    logs: NutritionLog[];
}

// -------------------------
// AI Recipe Generation
// -------------------------

export interface RecipeGenerationRequest {
    meal_type: MealType;
    cuisine_preference?: CuisineType;
    cooking_time?: CookingTime;
    specific_ingredients?: string[];
    exclude_ingredients?: string[];
    calorie_range?: {
        min: number;
        max: number;
    };
    override_servings?: number;
}

export interface RecipeGenerationResponse {
    recipes: Recipe[];
    generation_id: string;
}

// -------------------------
// API Response Types
// -------------------------

export interface ApiResponse<T> {
    data?: T;
    error?: {
        code: string;
        message: string;
    };
    success: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

// -------------------------
// Form Types
// -------------------------

export interface OnboardingFormData {
    step1: {
        dietary_restrictions: DietaryRestriction[];
        allergens: string[];
    };
    step2: {
        calories: number;
        protein_ratio: number;
        carbs_ratio: number;
        fat_ratio: number;
        goal_type: GoalType;
        meals_per_day: number;
    };
    step3: {
        cuisines: CuisineType[];
        spice_level: SpiceLevel;
        cooking_time: CookingTime;
        dislikes: string[];
    };
    step4: {
        servings: number;
        equipment: KitchenEquipment[];
        skill_level: SkillLevel;
    };
}

// -------------------------
// UI State Types
// -------------------------

export interface RecipeFilters {
    query?: string;
    cuisine?: CuisineType;
    max_time?: number;
    max_calories?: number;
    dietary_tags?: string[];
    difficulty?: Difficulty;
    sort_by?: "recent" | "rating" | "time" | "calories";
    sort_order?: "asc" | "desc";
}

export interface MealPlannerState {
    selected_date: Date;
    view_mode: "day" | "week";
    is_loading: boolean;
}
