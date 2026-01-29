"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import {
    TopNav,
    BottomNav,
    RecipeCard,
    CategoryFilter,
    EmptyState,
    CookingLoader,
} from "@/components/ui";
import type { Recipe, RecipeFilters, CuisineType, Difficulty } from "@/types";

// Demo recipes
const allRecipes: Recipe[] = [
    {
        id: "1",
        title: "Avocado & Poached Egg Toast",
        description: "Fresh avocado on artisan bread with perfectly poached eggs",
        cuisine_type: "american",
        prep_time: 10,
        cook_time: 5,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 350, protein: 15, carbs: 28, fat: 22 },
        dietary_tags: ["vegetarian", "high-protein"],
        image_url: "/images/recipes/avocado-toast.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 98,
        created_at: new Date().toISOString(),
    },
    {
        id: "2",
        title: "Superfood Quinoa Power Bowl",
        description: "Colorful Mediterranean bowl with chickpeas and tahini",
        cuisine_type: "mediterranean",
        prep_time: 15,
        cook_time: 10,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 420, protein: 14, carbs: 48, fat: 18 },
        dietary_tags: ["vegetarian", "gluten-free", "high-fiber"],
        image_url: "/images/recipes/quinoa-bowl.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 92,
        created_at: new Date().toISOString(),
    },
    {
        id: "3",
        title: "Zucchini Noodles with Pesto",
        description: "Low-carb zoodles with fresh basil pesto",
        cuisine_type: "italian",
        prep_time: 15,
        cook_time: 5,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 210, protein: 8, carbs: 12, fat: 16 },
        dietary_tags: ["vegetarian", "low-carb", "gluten-free"],
        image_url: "/images/recipes/zucchini-pesto.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 88,
        created_at: new Date().toISOString(),
    },
    {
        id: "4",
        title: "Honey Garlic Glazed Salmon",
        description: "Sweet and savory glazed salmon with rice",
        cuisine_type: "asian",
        prep_time: 10,
        cook_time: 15,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 420, protein: 35, carbs: 22, fat: 20 },
        dietary_tags: ["high-protein", "dairy-free"],
        image_url: "/images/recipes/honey-salmon.png",
        is_ai_generated: true,
        is_favorite: true,
        match_percentage: 95,
        created_at: new Date().toISOString(),
    },
    {
        id: "5",
        title: "Creamy Chickpea Curry",
        description: "Rich coconut curry with warm naan bread",
        cuisine_type: "indian",
        prep_time: 10,
        cook_time: 25,
        servings: 4,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 340, protein: 12, carbs: 48, fat: 12 },
        dietary_tags: ["vegan", "dairy-free", "high-fiber"],
        image_url: "/images/recipes/chickpea-curry.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 90,
        created_at: new Date().toISOString(),
    },
    {
        id: "6",
        title: "Fresh Greek Salad",
        description: "Crisp vegetables with feta and lemon dressing",
        cuisine_type: "mediterranean",
        prep_time: 15,
        cook_time: 0,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 280, protein: 10, carbs: 18, fat: 20 },
        dietary_tags: ["vegetarian", "gluten-free", "low-carb"],
        image_url: "/images/recipes/greek-salad.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 87,
        created_at: new Date().toISOString(),
    },
    {
        id: "7",
        title: "Herb Grilled Chicken",
        description: "Juicy chicken with roasted vegetables",
        cuisine_type: "american",
        prep_time: 15,
        cook_time: 15,
        servings: 2,
        difficulty: "medium",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 380, protein: 42, carbs: 12, fat: 18 },
        dietary_tags: ["high-protein", "gluten-free", "low-carb"],
        image_url: "/images/recipes/grilled-chicken.png",
        is_ai_generated: true,
        is_favorite: true,
        match_percentage: 94,
        created_at: new Date().toISOString(),
    },
    {
        id: "8",
        title: "Berry Smoothie Bowl",
        description: "Vibrant purple bowl with granola toppings",
        cuisine_type: "american",
        prep_time: 10,
        cook_time: 0,
        servings: 1,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 290, protein: 8, carbs: 52, fat: 6 },
        dietary_tags: ["vegan", "gluten-free"],
        image_url: "/images/recipes/berry-smoothie.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 85,
        created_at: new Date().toISOString(),
    },
    {
        id: "9",
        title: "Asian Shrimp Stir Fry",
        description: "Colorful wok-fried shrimp with vegetables",
        cuisine_type: "asian",
        prep_time: 10,
        cook_time: 10,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 310, protein: 28, carbs: 18, fat: 14 },
        dietary_tags: ["high-protein", "dairy-free"],
        image_url: "/images/recipes/shrimp-stir-fry.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 89,
        created_at: new Date().toISOString(),
    },
    {
        id: "10",
        title: "Rainbow Buddha Bowl",
        description: "Nourishing bowl with tahini drizzle",
        cuisine_type: "american",
        prep_time: 20,
        cook_time: 5,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 360, protein: 14, carbs: 42, fat: 16 },
        dietary_tags: ["vegan", "gluten-free", "high-fiber"],
        image_url: "/images/recipes/buddha-bowl.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 91,
        created_at: new Date().toISOString(),
    },
    {
        id: "11",
        title: "Overnight Oats with Berries",
        description: "Creamy make-ahead breakfast in a jar",
        cuisine_type: "american",
        prep_time: 5,
        cook_time: 0,
        servings: 1,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 320, protein: 12, carbs: 48, fat: 10 },
        dietary_tags: ["vegetarian", "high-fiber"],
        image_url: "/images/recipes/overnight-oats.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 86,
        created_at: new Date().toISOString(),
    },
    {
        id: "12",
        title: "Turkey Stuffed Peppers",
        description: "Colorful peppers with lean ground turkey",
        cuisine_type: "american",
        prep_time: 20,
        cook_time: 25,
        servings: 4,
        difficulty: "medium",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 390, protein: 32, carbs: 28, fat: 16 },
        dietary_tags: ["high-protein", "gluten-free"],
        image_url: "/images/recipes/stuffed-peppers.png",
        is_ai_generated: true,
        is_favorite: true,
        match_percentage: 93,
        created_at: new Date().toISOString(),
    },
    {
        id: "13",
        title: "Hawaiian Tuna Poke Bowl",
        description: "Fresh ahi tuna with edamame and seaweed",
        cuisine_type: "asian",
        prep_time: 15,
        cook_time: 0,
        servings: 2,
        difficulty: "easy",
        ingredients: [],
        instructions: [],
        nutrition: { calories: 340, protein: 28, carbs: 32, fat: 12 },
        dietary_tags: ["high-protein", "dairy-free"],
        image_url: "/images/recipes/tuna-poke.png",
        is_ai_generated: true,
        is_favorite: false,
        match_percentage: 88,
        created_at: new Date().toISOString(),
    },
];

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
    const [showFilters, setShowFilters] = useState(false);
    const [filters, setFilters] = useState<RecipeFilters>({});

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
        <div className="min-h-screen bg-background pb-20">
            {/* Search Header */}
            <div className="sticky top-0 z-40 bg-background border-b px-4 py-3 space-y-3">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder="Search recipes..."
                        className="w-full pl-12 pr-12 py-3 rounded-xl bg-muted border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {query && (
                        <button
                            onClick={() => handleSearch("")}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted-foreground/10"
                        >
                            <X className="w-4 h-4 text-muted-foreground" />
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
            <div className="px-4 py-4">
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
                        <p className="text-sm text-muted-foreground">
                            {filteredRecipes.length} recipe{filteredRecipes.length !== 1 && "s"} found
                        </p>
                        {filteredRecipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onClick={handleRecipeClick}
                                onFavorite={handleFavorite}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
