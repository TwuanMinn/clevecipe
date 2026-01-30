"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Wand2, RefreshCw, Users, Flame, Leaf, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveLayout } from "@/components/layout";
import {
    RecipeCard,
    CookingLoader,
    Button,
    CategoryFilter,
} from "@/components/ui";
import { useMealPlanStore, type MealSlot } from "@/lib/stores";
import type { Recipe } from "@/types";

const mealTypes = [
    { id: "any", label: "Any Meal" },
    { id: "breakfast", label: "Breakfast" },
    { id: "lunch", label: "Lunch" },
    { id: "dinner", label: "Dinner" },
    { id: "snack", label: "Snack" },
];

const cuisineCategories = [
    { id: "any", label: "Any Cuisine" },
    { id: "italian", label: "Italian 🍝" },
    { id: "asian", label: "Asian 🍜" },
    { id: "mexican", label: "Mexican 🌮" },
    { id: "indian", label: "Indian 🍛" },
    { id: "mediterranean", label: "Mediterranean 🫒" },
    { id: "american", label: "American 🍔" },
    { id: "japanese", label: "Japanese 🍣" },
    { id: "thai", label: "Thai 🥢" },
    { id: "french", label: "French 🥐" },
];

const cookingTimeOptions = [
    { id: "any", label: "Any Time", icon: "⏱️" },
    { id: "15", label: "Under 15 min", icon: "⚡" },
    { id: "30", label: "Under 30 min", icon: "🕐" },
    { id: "60", label: "Under 1 hour", icon: "🕑" },
    { id: "60+", label: "1+ hours", icon: "🍲" },
];

const difficultyOptions = [
    { id: "any", label: "Any Level" },
    { id: "easy", label: "Easy 🟢" },
    { id: "medium", label: "Medium 🟡" },
    { id: "hard", label: "Hard 🔴" },
];

const dietaryOptions = [
    { id: "vegetarian", label: "Vegetarian 🥬", color: "bg-green-100 text-green-700 border-green-300" },
    { id: "vegan", label: "Vegan 🌱", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    { id: "gluten-free", label: "Gluten-Free 🌾", color: "bg-amber-100 text-amber-700 border-amber-300" },
    { id: "dairy-free", label: "Dairy-Free 🥛", color: "bg-blue-100 text-blue-700 border-blue-300" },
    { id: "keto", label: "Keto 🥑", color: "bg-purple-100 text-purple-700 border-purple-300" },
    { id: "low-carb", label: "Low Carb 📉", color: "bg-orange-100 text-orange-700 border-orange-300" },
    { id: "high-protein", label: "High Protein 💪", color: "bg-red-100 text-red-700 border-red-300" },
    { id: "paleo", label: "Paleo 🦴", color: "bg-yellow-100 text-yellow-700 border-yellow-300" },
];

const servingsOptions = [1, 2, 3, 4, 5, 6, 8, 10, 12];

function GenerateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFirstTime = searchParams.get("first") === "true";
    const mealFromUrl = searchParams.get("meal");
    const dateFromUrl = searchParams.get("date");

    // Meal plan store
    const { setMeal, addSnack, selectedDate } = useMealPlanStore();
    const targetDate = dateFromUrl || selectedDate || new Date().toISOString().split("T")[0];

    // Pre-select meal type from URL if provided (from plan page)
    const initialMealType = mealFromUrl && ["breakfast", "lunch", "dinner", "snack", "snacks"].includes(mealFromUrl)
        ? (mealFromUrl === "snacks" ? "snack" : mealFromUrl)
        : "any";

    const [selectedMealType, setSelectedMealType] = useState<string>(initialMealType);
    const [selectedCuisine, setSelectedCuisine] = useState<string>("any");
    const [selectedCookingTime, setSelectedCookingTime] = useState<string>("any");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("any");
    const [selectedDietary, setSelectedDietary] = useState<string[]>([]);
    const [servings, setServings] = useState<number>(2);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [, setAddedRecipeId] = useState<string | null>(null);

    const toggleDietary = (id: string) => {
        setSelectedDietary(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const generateRecipes = async () => {
        setIsGenerating(true);
        setShowResults(false);

        try {
            const response = await fetch("/api/recipes/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    meal_type: selectedMealType !== "any" ? selectedMealType : undefined,
                    cuisine_preference: selectedCuisine !== "any" ? selectedCuisine : undefined,
                    max_cooking_time: selectedCookingTime !== "any" ? parseInt(selectedCookingTime) : undefined,
                    difficulty: selectedDifficulty !== "any" ? selectedDifficulty : undefined,
                    dietary_restrictions: selectedDietary.length > 0 ? selectedDietary : undefined,
                    servings: servings,
                }),
            });

            const data = await response.json();

            if (data.success && data.data?.recipes) {
                const recipes = data.data.recipes.map((recipe: Recipe, index: number) => ({
                    ...recipe,
                    id: recipe.id || `generated_${Date.now()}_${index}`,
                    created_at: recipe.created_at || new Date().toISOString(),
                    is_ai_generated: true,
                    is_favorite: false,
                }));
                setGeneratedRecipes(recipes);
                setShowResults(true);
            }
        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Add recipe to meal plan
    const handleAddToMealPlan = (recipe: Recipe) => {
        const mealSlot: MealSlot = {
            id: recipe.id,
            recipeId: recipe.id,
            recipeName: recipe.title,
            recipeImage: recipe.image_url || "/images/recipes/placeholder.png",
            calories: recipe.nutrition?.calories || 0,
            protein: recipe.nutrition?.protein || 0,
            carbs: recipe.nutrition?.carbs || 0,
            fat: recipe.nutrition?.fat || 0,
            servings: servings,
        };

        const mealType = selectedMealType !== "any" ? selectedMealType : (mealFromUrl || "dinner");

        if (mealType === "snack" || mealType === "snacks") {
            addSnack(targetDate, mealSlot);
        } else {
            setMeal(targetDate, mealType as "breakfast" | "lunch" | "dinner", mealSlot);
        }

        // Show success feedback
        setAddedRecipeId(recipe.id);

        // Redirect to home after a brief delay
        setTimeout(() => {
            router.push("/");
        }, 1000);
    };

    const handleRecipeClick = (id: string) => {
        // If coming from plan page, add to meal plan instead of navigating
        if (mealFromUrl) {
            const recipe = generatedRecipes.find(r => r.id === id);
            if (recipe) {
                handleAddToMealPlan(recipe);
            }
        } else {
            router.push(`/recipe/${id}`);
        }
    };

    const handleSaveRecipe = async (recipe: Recipe) => {
        handleAddToMealPlan(recipe);
    };

    return (
        <ResponsiveLayout>
            <div className="space-y-6 pb-8">
                {!showResults ? (
                    <>
                        {/* Hero */}
                        <div className="text-center py-6">
                            <motion.div
                                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-500/30"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <Sparkles className="w-10 h-10 text-white" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                                {isFirstTime
                                    ? "Let's create your first recipe!"
                                    : mealFromUrl
                                        ? `Add ${mealFromUrl.charAt(0).toUpperCase() + mealFromUrl.slice(1)} Recipe`
                                        : "AI Recipe Generator"}
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto">
                                {mealFromUrl
                                    ? `Choose a delicious ${mealFromUrl} recipe for your meal plan.`
                                    : "Customize your preferences and let our AI craft the perfect recipe for you."}
                            </p>
                        </div>

                        {/* Meal Type Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                🍽️ What meal are you planning?
                            </label>
                            <CategoryFilter
                                categories={mealTypes}
                                selectedId={selectedMealType}
                                onSelect={setSelectedMealType}
                            />
                        </motion.div>

                        {/* Cuisine Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.15 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                🌍 Preferred cuisine
                            </label>
                            <CategoryFilter
                                categories={cuisineCategories}
                                selectedId={selectedCuisine}
                                onSelect={setSelectedCuisine}
                            />
                        </motion.div>

                        {/* Cooking Time */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                ⏱️ Cooking time
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {cookingTimeOptions.map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setSelectedCookingTime(option.id)}
                                        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${selectedCookingTime === option.id
                                            ? "bg-[#13ec37] text-[#102213] shadow-md"
                                            : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-[#13ec37]"
                                            }`}
                                    >
                                        {option.icon} {option.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Servings Selector */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.25 }}
                        >
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                👥 Number of servings
                            </label>
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
                                <Users className="w-5 h-5 text-slate-400" />
                                <div className="flex gap-2 flex-wrap">
                                    {servingsOptions.map((num) => (
                                        <button
                                            key={num}
                                            onClick={() => setServings(num)}
                                            className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${servings === num
                                                ? "bg-[#13ec37] text-[#102213] shadow-md"
                                                : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                                                }`}
                                        >
                                            {num}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Advanced Options Toggle */}
                        <motion.button
                            onClick={() => setShowAdvanced(!showAdvanced)}
                            className="w-full flex items-center justify-between px-4 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="flex items-center gap-2">
                                <Flame className="w-4 h-4" />
                                Advanced Options
                            </span>
                            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </motion.button>

                        <AnimatePresence>
                            {showAdvanced && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-6 overflow-hidden"
                                >
                                    {/* Difficulty Level */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                            📊 Difficulty level
                                        </label>
                                        <CategoryFilter
                                            categories={difficultyOptions}
                                            selectedId={selectedDifficulty}
                                            onSelect={setSelectedDifficulty}
                                        />
                                    </div>

                                    {/* Dietary Preferences */}
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                                            <Leaf className="w-4 h-4 inline mr-1" />
                                            Dietary preferences (select all that apply)
                                        </label>
                                        <div className="flex flex-wrap gap-2">
                                            {dietaryOptions.map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => toggleDietary(option.id)}
                                                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${selectedDietary.includes(option.id)
                                                        ? option.color + " border-2"
                                                        : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-[#13ec37]"
                                                        }`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Summary of selections */}
                        {(selectedMealType !== "any" || selectedCuisine !== "any" || selectedDietary.length > 0) && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-4 border border-emerald-200 dark:border-emerald-800"
                            >
                                <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">
                                    ✨ You&apos;ll get: {selectedMealType !== "any" ? selectedMealType : ""} {selectedCuisine !== "any" ? selectedCuisine + " recipes" : "recipes"}
                                    {selectedCookingTime !== "any" && ` ready in ${selectedCookingTime} min`}
                                    {selectedDietary.length > 0 && ` (${selectedDietary.join(", ")})`}
                                    {` for ${servings} ${servings === 1 ? "person" : "people"}`}
                                </p>
                            </motion.div>
                        )}

                        {/* Generate Button */}
                        {isGenerating ? (
                            <CookingLoader message="Creating your perfect recipes..." />
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.35 }}
                            >
                                <Button
                                    size="lg"
                                    onClick={generateRecipes}
                                    className="w-full py-6 text-lg font-semibold"
                                >
                                    <Wand2 className="w-5 h-5 mr-2" />
                                    Generate Recipes
                                </Button>
                            </motion.div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Results */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                                Here&apos;s what we created! ✨
                            </h2>
                            <button
                                onClick={generateRecipes}
                                disabled={isGenerating}
                                className="flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                                {isGenerating ? 'Generating...' : 'Regenerate'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {generatedRecipes.map((recipe) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    onClick={handleRecipeClick}
                                    onFavorite={() => handleSaveRecipe(recipe)}
                                />
                            ))}
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                size="lg"
                                onClick={generateRecipes}
                                disabled={isGenerating}
                                className="flex-1"
                            >
                                <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                                {isGenerating ? 'Generating...' : 'Generate More'}
                            </Button>
                            <Button
                                size="lg"
                                onClick={() => router.push("/")}
                                className="flex-1"
                            >
                                Go to Dashboard
                            </Button>
                        </div>
                    </>
                )}
            </div>
        </ResponsiveLayout>
    );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<CookingLoader message="Loading..." />}>
            <GenerateContent />
        </Suspense>
    );
}

