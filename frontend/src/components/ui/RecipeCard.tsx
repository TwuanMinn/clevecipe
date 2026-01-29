"use client";

import * as React from "react";
import Image from "next/image";
import { Heart, Clock, Flame } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Recipe {
    id: string;
    title: string;
    image_url?: string;
    prep_time?: number;
    cook_time?: number;
    servings?: number;
    nutrition?: {
        calories?: number;
        protein?: number;
        carbs?: number;
        fat?: number;
    };
    dietary_tags?: string[];
    match_percentage?: number;
    is_favorite?: boolean;
}

interface RecipeCardProps {
    recipe: Recipe;
    variant?: "default" | "compact" | "horizontal";
    onFavorite?: (id: string) => void;
    onClick?: (id: string) => void;
    className?: string;
}

export function RecipeCard({
    recipe,
    variant = "default",
    onFavorite,
    onClick,
    className,
}: RecipeCardProps) {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);
    const [isFavorite, setIsFavorite] = React.useState(recipe.is_favorite);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        onFavorite?.(recipe.id);
    };

    if (variant === "horizontal") {
        return (
            <div
                onClick={() => onClick?.(recipe.id)}
                className={cn(
                    "flex items-center gap-4 p-3 bg-white rounded-2xl shadow-sm cursor-pointer",
                    "hover:shadow-md transition-all duration-200",
                    className
                )}
            >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    {recipe.image_url ? (
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Flame className="w-6 h-6 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate text-gray-900">{recipe.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-green-500" />
                            {totalTime}m
                        </span>
                        {recipe.nutrition?.calories && (
                            <span className="flex items-center gap-1 text-green-500">
                                <Flame className="w-3 h-3" />
                                {recipe.nutrition.calories}
                            </span>
                        )}
                    </div>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 6 10">
                    <path d="M1.4 8.56l.6.94 4-5.5-4-5.5-.6.94 3.36 4.56-3.36 4.56z" />
                </svg>
            </div>
        );
    }

    if (variant === "compact") {
        return (
            <div
                onClick={() => onClick?.(recipe.id)}
                className={cn(
                    "relative bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden",
                    "hover:shadow-md transition-all duration-200",
                    className
                )}
            >
                <div className="relative aspect-square">
                    {recipe.image_url ? (
                        <Image
                            src={recipe.image_url}
                            alt={recipe.title}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                            <Flame className="w-8 h-8 text-gray-400" />
                        </div>
                    )}
                </div>
                <div className="p-3">
                    <h3 className="font-semibold text-sm truncate text-gray-900">{recipe.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-green-500" />
                            {totalTime} min
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    // Default variant - with enhanced animations
    return (
        <div
            onClick={() => onClick?.(recipe.id)}
            className={cn(
                "relative bg-white rounded-2xl shadow-sm cursor-pointer overflow-hidden",
                "transition-shadow duration-300",
                className
            )}
        >
            {/* Image Container */}
            <div className="relative h-48 w-full overflow-hidden">
                {recipe.image_url ? (
                    <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-50 flex items-center justify-center">
                        <Flame className="w-12 h-12 text-green-300" />
                    </div>
                )}

                {/* Match percentage badge - with pop animation */}
                {recipe.match_percentage && (
                    <motion.div
                        className="absolute bottom-3 left-3"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 25 }}
                    >
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {recipe.match_percentage}% Match
                        </div>
                    </motion.div>
                )}
            </div>

            {/* Content Section */}
            <div className="p-4 flex items-start justify-between">
                <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-semibold text-base text-gray-900 leading-tight">
                        {recipe.title}
                    </h3>

                    {/* Stats row */}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-green-500" />
                            {totalTime} min
                        </span>
                        {recipe.nutrition?.calories && (
                            <span className="flex items-center gap-1">
                                <Flame className="w-4 h-4 text-green-500" />
                                {recipe.nutrition.calories} kcal
                            </span>
                        )}
                    </div>

                    {/* Dietary tags with stagger animation */}
                    {recipe.dietary_tags && recipe.dietary_tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {recipe.dietary_tags.slice(0, 3).map((tag, index) => (
                                <motion.span
                                    key={tag}
                                    className="text-xs font-medium px-2 py-1 bg-green-50 text-green-700 rounded-full"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 * index }}
                                >
                                    {tag}
                                </motion.span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Favorite button with animation */}
                <motion.button
                    onClick={handleFavoriteClick}
                    className="flex-shrink-0 p-2 rounded-full transition-colors hover:bg-gray-100"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isFavorite ? "filled" : "empty"}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            transition={{ type: "spring", stiffness: 500, damping: 25 }}
                        >
                            <Heart
                                className={cn(
                                    "w-5 h-5 transition-colors",
                                    isFavorite
                                        ? "fill-red-500 text-red-500"
                                        : "text-gray-400"
                                )}
                            />
                        </motion.div>
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    );
}

// Mini recipe card for meal planner
interface MiniRecipeCardProps {
    recipe: Recipe;
    onRemove?: () => void;
    className?: string;
}

export function MiniRecipeCard({
    recipe,
    onRemove,
    className,
}: MiniRecipeCardProps) {
    const totalTime = (recipe.prep_time || 0) + (recipe.cook_time || 0);

    return (
        <motion.div
            className={cn(
                "flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm",
                className
            )}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            whileHover={{ scale: 1.02 }}
        >
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                {recipe.image_url ? (
                    <Image
                        src={recipe.image_url}
                        alt={recipe.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-gray-400" />
                    </div>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate text-gray-900">{recipe.title}</h4>
                <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-green-500" />
                        {totalTime}m
                    </span>
                    {recipe.nutrition?.calories && (
                        <span className="flex items-center gap-1 text-green-500">
                            <Flame className="w-3 h-3" />
                            {recipe.nutrition.calories}
                        </span>
                    )}
                </div>
            </div>
            {/* Drag handle */}
            <div className="flex-shrink-0 p-1">
                <svg
                    className="w-4 h-4 text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                >
                    <circle cx="9" cy="5" r="1.5" />
                    <circle cx="15" cy="5" r="1.5" />
                    <circle cx="9" cy="12" r="1.5" />
                    <circle cx="15" cy="12" r="1.5" />
                    <circle cx="9" cy="19" r="1.5" />
                    <circle cx="15" cy="19" r="1.5" />
                </svg>
            </div>
        </motion.div>
    );
}
