"use client";

import { useState } from "react";
import { Search, X } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout";
import {
    RecipeCard,
    CategoryFilter,
    EmptyState,
    CookingLoader,
} from "@/components/ui";
import type { Recipe, CuisineType, Difficulty } from "@/types";
import { demoRecipes } from "@/data/homepage-data";

// Transform homepage data to full Recipe type for search functionality
const allRecipes: Recipe[] = demoRecipes.map((recipe) => ({
    id: recipe.id,
    title: recipe.title,
    description: `Delicious ${recipe.title.toLowerCase()} recipe`,
    cuisine_type: "american" as CuisineType,
    prep_time: recipe.prep_time,
    cook_time: 0,
    servings: 2,
    difficulty: "easy" as Difficulty,
    ingredients: [],
    instructions: [],
    nutrition: { calories: recipe.calories, protein: 0, carbs: 0, fat: 0 },
    dietary_tags: recipe.match_percentage > 90 ? ["high-protein"] : [],
    image_url: recipe.image_url,
    is_ai_generated: true,
    is_favorite: false,
    match_percentage: recipe.match_percentage,
    created_at: new Date().toISOString(),
}));

// Categories derived from dietary tags in shared data
const categories = [
    { id: "all", label: "All" },
    { id: "quick", label: "Quick (<30m)" },
    { id: "high-protein", label: "High Protein" },
    { id: "low-carb", label: "Low Carb" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
];

export default function SearchPage() {
    const [query, setQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [isLoading, setIsLoading] = useState(false);


    // Filter recipes based on search and category
    const filteredRecipes = allRecipes.filter((recipe) => {
        // Text search
        if (query && !recipe.title.toLowerCase().includes(query.toLowerCase())) {
            return false;
        }

        // Category filter
        if (selectedCategory !== "all") {
            if (selectedCategory === "quick") {
                const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
                if (totalTime >= 30) return false;
            } else if (!recipe.dietary_tags.includes(selectedCategory)) {
                return false;
            }
        }

        return true;
    });

    const handleSearch = (value: string) => {
        setQuery(value);
        setIsLoading(true);
        // Simulate search delay
        setTimeout(() => setIsLoading(false), 500);
    };

    const handleRecipeClick = (id: string) => {
        window.location.href = `/recipe/${id}`;
    };

    const handleFavorite = (id: string) => {
        console.log("Toggle favorite:", id);
    };

    return (
        <ResponsiveLayout>
            <div className="space-y-4">
                {/* Search Header */}
                <div className="sticky top-0 z-20 -mx-4 lg:-mx-8 px-4 lg:px-8 py-3 bg-white/80 dark:bg-[#0d1f14]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 space-y-3">
                    {/* Search Input */}
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search recipes..."
                            className="w-full pl-12 pr-12 py-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border-0 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                        />
                        {query && (
                            <button
                                onClick={() => handleSearch("")}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                            >
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>

                    {/* Category Filters */}
                    <CategoryFilter
                        categories={categories}
                        selectedId={selectedCategory}
                        onSelect={setSelectedCategory}
                    />
                </div>

                {/* Content */}
                <div className="py-4">
                    {isLoading ? (
                        <CookingLoader message="Searching recipes..." />
                    ) : filteredRecipes.length === 0 ? (
                        <EmptyState
                            icon={<Search className="w-16 h-16" />}
                            title="No recipes found"
                            description="Try adjusting your search or filters to find what you're looking for."
                            action={{
                                label: "Clear Filters",
                                onClick: () => {
                                    setQuery("");
                                    setSelectedCategory("all");
                                },
                            }}
                        />
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {filteredRecipes.length} recipe{filteredRecipes.length !== 1 && "s"} found
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredRecipes.map((recipe) => (
                                    <RecipeCard
                                        key={recipe.id}
                                        recipe={recipe}
                                        onClick={handleRecipeClick}
                                        onFavorite={handleFavorite}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
