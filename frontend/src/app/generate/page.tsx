"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Wand2, RefreshCw } from "lucide-react";
import {
    TopNav,
    RecipeCard,
    CookingLoader,
    Button,
    CategoryFilter,
} from "@/components/ui";
import type { Recipe, MealType, CuisineType, CookingTime } from "@/types";

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
];

function GenerateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const isFirstTime = searchParams.get("first") === "true";

    const [selectedMealType, setSelectedMealType] = useState<string>("any");
    const [selectedCuisine, setSelectedCuisine] = useState<string>("any");
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedRecipes, setGeneratedRecipes] = useState<Recipe[]>([]);
    const [showResults, setShowResults] = useState(false);

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
                }),
            });

            const data = await response.json();

            if (data.success && data.data?.recipes) {
                // Add IDs and created_at if missing
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

    const handleRecipeClick = (id: string) => {
        // In real app, save to library first
        router.push(`/recipe/${id}`);
    };

    const handleSaveRecipe = async (recipe: Recipe) => {
        // TODO: Save to Supabase
        console.log("Saving recipe:", recipe.title);
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <TopNav
                title="Generate Recipe"
                showBack={!isFirstTime}
                onBack={() => router.back()}
            />

            <div className="px-4 py-6 space-y-6">
                {!showResults ? (
                    <>
                        {/* Hero */}
                        <div className="text-center py-6">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-primary" />
                            </div>
                            <h1 className="text-2xl font-bold text-foreground">
                                {isFirstTime ? "Let's create your first recipe!" : "Generate New Recipe"}
                            </h1>
                            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                                Tell us what you're in the mood for, and our AI will craft the perfect recipe.
                            </p>
                        </div>

                        {/* Meal Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                What meal are you planning?
                            </label>
                            <CategoryFilter
                                categories={mealTypes}
                                selectedId={selectedMealType}
                                onSelect={setSelectedMealType}
                            />
                        </div>

                        {/* Cuisine Selection */}
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Preferred cuisine
                            </label>
                            <CategoryFilter
                                categories={cuisineCategories}
                                selectedId={selectedCuisine}
                                onSelect={setSelectedCuisine}
                            />
                        </div>

                        {/* Generate Button */}
                        {isGenerating ? (
                            <CookingLoader />
                        ) : (
                            <Button
                                size="lg"
                                onClick={generateRecipes}
                                className="w-full py-6 text-lg font-semibold"
                            >
                                <Wand2 className="w-5 h-5 mr-2" />
                                Generate Recipes
                            </Button>
                        )}
                    </>
                ) : (
                    <>
                        {/* Results */}
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-foreground">
                                Here's what we created! ✨
                            </h2>
                            <button
                                onClick={() => setShowResults(false)}
                                className="flex items-center gap-1 text-sm text-primary font-medium"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Regenerate
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                onClick={() => setShowResults(false)}
                                className="flex-1"
                            >
                                Generate More
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
        </div>
    );
}

export default function GeneratePage() {
    return (
        <Suspense fallback={<CookingLoader message="Loading..." />}>
            <GenerateContent />
        </Suspense>
    );
}
