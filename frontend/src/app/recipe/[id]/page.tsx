"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Recipe } from "@/types";

// Demo recipe data
const demoRecipe: Recipe = {
    id: "1",
    title: "Avocado & Quinoa Power Bowl",
    description: "A nutritious and delicious power bowl packed with superfoods",
    cuisine_type: "mediterranean",
    prep_time: 15,
    cook_time: 0,
    servings: 2,
    difficulty: "easy",
    ingredients: [
        { name: "Ripe Avocado", amount: 1, unit: "whole", note: "Cubed and peeled" },
        { name: "Quinoa", amount: 2, unit: "cups", note: "Cooked and cooled" },
        { name: "Cherry Tomatoes", amount: 1, unit: "cup", note: "Halved" },
        { name: "Lemon Vinaigrette", amount: 2, unit: "tbsp", note: "olive oil + lemon juice" },
        { name: "Fresh Spinach", amount: 2, unit: "cups" },
        { name: "Feta Cheese", amount: 0.5, unit: "cup", note: "Crumbled" },
    ],
    instructions: [
        "Start by rinsing the quinoa thoroughly under cold water. Cook it in vegetable broth for extra flavor.",
        "While the quinoa cools, chop the avocado and tomatoes into bite-sized pieces.",
        "Arrange the fresh spinach as a base in your serving bowl.",
        "Add the cooked quinoa on top of the spinach.",
        "Top with avocado, cherry tomatoes, and crumbled feta cheese.",
        "Drizzle with lemon vinaigrette and serve immediately.",
    ],
    nutrition: { calories: 340, protein: 12, carbs: 45, fat: 14 },
    dietary_tags: ["Vegan", "Gluten-Free", "High Fiber"],
    image_url: "/images/recipes/avocado-quinoa-bowl.png",
    is_ai_generated: true,
    is_favorite: false,
    match_percentage: 96,
    created_at: new Date().toISOString(),
};

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [recipe] = useState<Recipe>(demoRecipe);
    const [servings, setServings] = useState(recipe.servings);
    const [isFavorite, setIsFavorite] = useState(recipe.is_favorite);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const [showFullInstructions, setShowFullInstructions] = useState(false);

    const scaleFactor = servings / recipe.servings;

    const toggleIngredient = (index: number) => {
        const newChecked = new Set(checkedIngredients);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedIngredients(newChecked);
    };

    const scaleAmount = (amount: number): string => {
        const scaled = amount * scaleFactor;
        if (scaled === 0.25) return "1/4";
        if (scaled === 0.5) return "1/2";
        if (scaled === 0.75) return "3/4";
        if (scaled === 1.5) return "1 1/2";
        if (Number.isInteger(scaled)) return scaled.toString();
        return scaled.toFixed(1);
    };

    // Nutrition percentages for conic gradients
    const nutritionData = [
        { label: "Cal", value: Math.round((recipe.nutrition?.calories || 0) * scaleFactor), percent: 85 },
        { label: "Prot", value: `${Math.round((recipe.nutrition?.protein || 0) * scaleFactor)}g`, percent: 65 },
        { label: "Carb", value: `${Math.round((recipe.nutrition?.carbs || 0) * scaleFactor)}g`, percent: 45 },
        { label: "Fat", value: `${Math.round((recipe.nutrition?.fat || 0) * scaleFactor)}g`, percent: 30 },
    ];

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14] font-display text-[#111812] dark:text-white antialiased min-h-screen">
            <div className="relative w-full max-w-md mx-auto min-h-screen bg-white/80 dark:bg-[#1a2c1e]/90 backdrop-blur-sm shadow-2xl overflow-hidden pb-24">

                {/* Hero Section */}
                <div className="relative h-[400px] w-full group">
                    {/* Hero Image */}
                    <div className="absolute inset-0 overflow-hidden">
                        <Image
                            src={recipe.image_url || "/images/recipes/default.png"}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/20" />
                    </div>

                    {/* Floating Top Bar */}
                    <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 pt-12 z-20">
                        <motion.button
                            onClick={() => router.back()}
                            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/30 active:scale-95 transition-all"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                        <div className="flex gap-3">
                            <motion.button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/30 active:scale-95 transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className={`w-6 h-6 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </motion.button>
                            <motion.button
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-white hover:bg-white/30 active:scale-95 transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                                </svg>
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Main Content Sheet */}
                <motion.div
                    className="relative z-10 -mt-10 bg-white dark:bg-[#1a2c1e] rounded-t-[2.5rem] w-full px-6 pt-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]"
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    {/* Pull Indicator */}
                    <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-4 mb-6" />

                    {/* Title & Metadata */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold leading-tight tracking-tight mb-4 text-[#111812] dark:text-white">
                            {recipe.title}
                        </h1>
                        <div className="flex flex-wrap gap-2">
                            <div className="flex h-8 items-center justify-center gap-x-1.5 rounded-full bg-[#f6f8f6] dark:bg-[#102213]/50 border border-transparent dark:border-white/5 pl-3 pr-4">
                                <svg className="w-4 h-4 text-[#13ec37]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                                </svg>
                                <p className="text-sm font-bold">{recipe.prep_time} mins</p>
                            </div>
                            <div className="flex h-8 items-center justify-center gap-x-1.5 rounded-full bg-[#f6f8f6] dark:bg-[#102213]/50 border border-transparent dark:border-white/5 pl-3 pr-4">
                                <svg className="w-4 h-4 text-[#13ec37]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
                                </svg>
                                <p className="text-sm font-bold">Easy</p>
                            </div>
                            {recipe.dietary_tags?.slice(0, 1).map((tag) => (
                                <div key={tag} className="flex h-8 items-center justify-center gap-x-1.5 rounded-full bg-[#f6f8f6] dark:bg-[#102213]/50 border border-transparent dark:border-white/5 pl-3 pr-4">
                                    <svg className="w-4 h-4 text-[#13ec37]" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M6.05 8.05a7.002 7.002 0 0 0-.02 9.88c1.47-3.4 4.09-6.24 7.36-7.93A15.952 15.952 0 0 0 8 19.32c2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z" />
                                    </svg>
                                    <p className="text-sm font-bold">{tag}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Macro Nutritional Rings */}
                    <div className="mb-8 p-5 rounded-2xl bg-[#f6f8f6] dark:bg-[#102213]/50 border border-transparent dark:border-white/5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">Nutrition</h3>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">per serving</span>
                        </div>
                        <div className="grid grid-cols-4 gap-2">
                            {nutritionData.map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    className="flex flex-col items-center gap-2"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <div
                                        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-inner"
                                        style={{
                                            background: `conic-gradient(#13ec37 ${item.percent}%, #e5e7eb 0)`
                                        }}
                                    >
                                        <div className="absolute inset-1 bg-white dark:bg-[#152318] rounded-full flex flex-col items-center justify-center">
                                            <span className="text-[12px] font-bold leading-none">{item.value}</span>
                                        </div>
                                    </div>
                                    <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400">{item.label}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Ingredients Section */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold">Ingredients</h3>
                        </div>

                        {/* Portion Controller */}
                        <div className="flex mb-6 p-1 bg-[#f6f8f6] dark:bg-[#102213]/50 rounded-full">
                            {[1, 2, 4].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setServings(s)}
                                    className={`flex-1 py-2 px-3 rounded-full text-sm font-bold transition-all ${servings === s
                                        ? "bg-[#13ec37] text-[#111812] shadow-sm"
                                        : "text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    {s} Serv{s > 1 ? "s" : ""}
                                </button>
                            ))}
                        </div>

                        {/* Ingredients List */}
                        <div className="space-y-4">
                            {recipe.ingredients.map((ingredient, index) => (
                                <motion.label
                                    key={index}
                                    className="flex items-start gap-3 cursor-pointer group"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <div
                                        className={`relative mt-0.5 flex items-center justify-center w-6 h-6 rounded-full border-2 transition-colors bg-white dark:bg-transparent ${checkedIngredients.has(index)
                                            ? "bg-[#13ec37] border-[#13ec37]"
                                            : "border-gray-300 dark:border-gray-600 group-hover:border-[#13ec37]"
                                            }`}
                                        onClick={() => toggleIngredient(index)}
                                    >
                                        {checkedIngredients.has(index) && (
                                            <svg className="w-4 h-4 text-[#111812]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <span className={`text-base font-medium transition-colors ${checkedIngredients.has(index) ? "line-through text-gray-400" : ""
                                            }`}>
                                            {scaleAmount(ingredient.amount)} {ingredient.unit} {ingredient.name}
                                        </span>
                                        {ingredient.note && (
                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                {ingredient.note}
                                            </span>
                                        )}
                                    </div>
                                </motion.label>
                            ))}
                        </div>
                    </div>

                    {/* Preparation Teaser */}
                    <div className="mb-10">
                        <h3 className="text-xl font-bold mb-3">Preparation</h3>
                        <div className="bg-[#f6f8f6] dark:bg-[#102213]/50 rounded-2xl p-4">
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm">
                                {showFullInstructions
                                    ? recipe.instructions.join("\n\n")
                                    : recipe.instructions.slice(0, 2).join(" ").substring(0, 200) + "..."}
                            </p>
                            <button
                                onClick={() => setShowFullInstructions(!showFullInstructions)}
                                className="mt-2 text-sm font-bold text-[#13ec37] flex items-center gap-1 hover:underline"
                            >
                                {showFullInstructions ? "Show less" : "Read full instructions"}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Sticky Footer */}
                <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none w-full max-w-md mx-auto">
                    {/* Gradient fade up */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#1a2c1e] dark:via-[#1a2c1e]/90 dark:to-transparent" />

                    {/* Button Container */}
                    <div className="relative p-6 pointer-events-auto flex gap-4">
                        <motion.button
                            className="flex-1 h-14 bg-[#13ec37] text-[#111812] rounded-full text-lg font-bold shadow-[0_0_20px_-5px_rgba(19,236,55,0.5)] hover:shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <svg className="w-6 h-6 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.1 13.34l2.83-2.83L3.91 3.5a4.008 4.008 0 0 0 0 5.66l4.19 4.18zm6.78-1.81c1.53.71 3.68.21 5.27-1.38 1.91-1.91 2.28-4.65.81-6.12-1.46-1.46-4.2-1.1-6.12.81-1.59 1.59-2.09 3.74-1.38 5.27L3.7 19.87l1.41 1.41L12 14.41l6.88 6.88 1.41-1.41L13.41 13l1.47-1.47z" />
                            </svg>
                            Cook Now
                        </motion.button>
                    </div>
                </div>
            </div>
        </div>
    );
}
