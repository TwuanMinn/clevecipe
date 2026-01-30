"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { useRecipeHistoryStore } from "@/lib/stores";

interface Recipe {
    id: string;
    title: string;
    image_url: string;
    prep_time: number;
    calories: number;
    match_percentage: number;
    is_primary_match: boolean;
}

interface RecipeCardProps {
    recipe: Recipe;
}

export function RecipeCard({ recipe }: RecipeCardProps) {
    // Use the store for favorites
    const { isFavorite, addToFavorites, removeFromFavorites } = useRecipeHistoryStore();
    const isRecipeFavorite = isFavorite(recipe.id);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isRecipeFavorite) {
            removeFromFavorites(recipe.id);
        } else {
            addToFavorites({
                id: recipe.id,
                name: recipe.title,
                image: recipe.image_url,
                calories: recipe.calories,
                protein: 0,
                carbs: 0,
                fat: 0,
                cookTime: recipe.prep_time,
                savedAt: new Date().toISOString(),
            });
        }
    };

    return (
        <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.02, y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="group"
        >
            <Link href={`/recipe/${recipe.id}`}>
                <div className="relative flex w-full flex-col gap-3 rounded-xl bg-white dark:bg-[#1a2e1d] p-2 shadow-sm transition-all hover:shadow-md border border-slate-100 dark:border-slate-800/50">
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Match Badge - TOP LEFT */}
                        <motion.div
                            className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 shadow-lg ${recipe.is_primary_match
                                ? "bg-[#13ec37] shadow-[#13ec37]/20"
                                : "bg-white dark:bg-slate-800"
                                }`}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3, type: "spring" }}
                        >
                            <svg className={`w-3 h-3 ${recipe.is_primary_match ? "text-[#111812]" : "text-[#13ec37]"}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M11 21h-1l1-7H7.5c-.88 0-.33-.75-.31-.78C8.48 10.94 10.42 7.54 13.01 3h1l-1 7h3.51c.4 0 .62.19.4.66C12.98 17.02 11 21 11 21z" />
                            </svg>
                            <span className={`text-xs font-bold ${recipe.is_primary_match ? "text-[#111812]" : "text-[#111812] dark:text-white"}`}>
                                {recipe.match_percentage}%
                            </span>
                        </motion.div>

                        {/* Favorite Button - with animation */}
                        <motion.button
                            onClick={handleFavoriteClick}
                            className={`absolute right-2 top-2 flex size-8 items-center justify-center rounded-full backdrop-blur-md transition-colors ${isRecipeFavorite
                                    ? "bg-red-500 text-white"
                                    : "bg-white/30 text-white hover:bg-white hover:text-red-500"
                                }`}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <AnimatePresence mode="wait">
                                <motion.svg
                                    key={isRecipeFavorite ? "filled" : "empty"}
                                    className="w-5 h-5"
                                    fill={isRecipeFavorite ? "currentColor" : "none"}
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 25 }}
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </motion.svg>
                            </AnimatePresence>
                        </motion.button>
                    </div>

                    <div className="px-1 pb-1">
                        <h3 className="text-sm font-bold leading-tight text-[#111812] dark:text-white line-clamp-2">
                            {recipe.title}
                        </h3>
                        <div className="mt-2 flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-[#13ec37]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                                </svg>
                                <span className="text-xs font-semibold">{recipe.prep_time}m</span>
                            </div>
                            <div className="h-1 w-1 rounded-full bg-slate-300 dark:bg-slate-600" />
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4 text-[#13ec37]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
                                </svg>
                                <span className="text-xs font-semibold">{recipe.calories}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

