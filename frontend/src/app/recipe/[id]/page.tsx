"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Users, ChefHat, Heart, Share2, Bookmark, Printer,
    Play, Pause, RotateCcw, Check, ShoppingCart, Timer, Star, StarHalf,
    ChevronRight, Plus, Minus, AlertCircle, Utensils, X
} from "lucide-react";
import { useRecipe } from "@/lib/use-recipes";
import { CookingLoader } from "@/components/ui";
import { useMealPlanStore, useShoppingListStore, useRecipeHistoryStore, type MealSlot } from "@/lib/stores";

export default function RecipeDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const { recipe: fetchedRecipe, isLoading, error } = useRecipe(params.id);

    // Stores
    const { addToFavorites, removeFromFavorites, isFavorite } = useRecipeHistoryStore();
    const { addItem } = useShoppingListStore();
    const { setMeal, addSnack, selectedDate } = useMealPlanStore();

    // Local state
    const [servings, setServings] = useState(2);
    const [checkedIngredients, setCheckedIngredients] = useState<Set<number>>(new Set());
    const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
    const [activeTab, setActiveTab] = useState<"ingredients" | "instructions" | "nutrition">("ingredients");
    const [cookingMode, setCookingMode] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [timer, setTimer] = useState<number | null>(null);
    const [timerRunning, setTimerRunning] = useState(false);
    const [showAddToPlan, setShowAddToPlan] = useState(false);
    const [showShareMenu, setShowShareMenu] = useState(false);
    const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" }>({ show: false, message: "", type: "success" });
    const [addingToList, setAddingToList] = useState(false);

    // Parse recipe
    const recipe = useMemo(() => {
        if (!fetchedRecipe) return null;
        return {
            ...fetchedRecipe,
            ingredients: fetchedRecipe.ingredients || [],
            instructions: fetchedRecipe.instructions || [],
        };
    }, [fetchedRecipe]);

    // Update servings when recipe loads
    useEffect(() => {
        if (recipe) {
            setServings(recipe.servings || 2);
        }
    }, [recipe]);

    const scaleFactor = recipe ? servings / (recipe.servings || 2) : 1;
    const currentIsFavorite = recipe ? isFavorite(recipe.id) : false;

    // Timer effect
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerRunning && timer !== null && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => (prev !== null && prev > 0) ? prev - 1 : 0);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [timerRunning, timer]);

    // Auto-pause when timer ends
    useEffect(() => {
        if (timer === 0 && timerRunning) {
            setTimerRunning(false);
            // Play notification sound/vibration here
        }
    }, [timer, timerRunning]);

    const toggleIngredient = (index: number) => {
        const newChecked = new Set(checkedIngredients);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedIngredients(newChecked);
    };

    const toggleStep = (index: number) => {
        const newChecked = new Set(checkedSteps);
        if (newChecked.has(index)) {
            newChecked.delete(index);
        } else {
            newChecked.add(index);
        }
        setCheckedSteps(newChecked);
    };

    const scaleAmount = (amount: number): string => {
        const scaled = amount * scaleFactor;
        if (scaled === 0.25) return "¼";
        if (scaled === 0.5) return "½";
        if (scaled === 0.75) return "¾";
        if (scaled === 1.5) return "1½";
        if (Number.isInteger(scaled)) return scaled.toString();
        return scaled.toFixed(1);
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const handleFavoriteToggle = () => {
        if (!recipe) return;
        if (currentIsFavorite) {
            removeFromFavorites(recipe.id);
        } else {
            addToFavorites({
                id: recipe.id,
                name: recipe.title,
                image: recipe.image_url || "",
                calories: recipe.nutrition?.calories || 0,
                protein: recipe.nutrition?.protein || 0,
                carbs: recipe.nutrition?.carbs || 0,
                fat: recipe.nutrition?.fat || 0,
                cookTime: (recipe.prep_time || 0) + (recipe.cook_time || 0),
                savedAt: new Date().toISOString(),
            });
        }
    };

    const showToast = (message: string, type: "success" | "error" = "success") => {
        setToast({ show: true, message, type });
        setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
    };

    const handleAddToShoppingList = () => {
        if (!recipe || addingToList) return;
        setAddingToList(true);

        // Add each ingredient
        recipe.ingredients.forEach((ing) => {
            addItem({
                name: ing.name,
                quantity: scaleAmount(ing.amount),
                unit: ing.unit,
                category: "Groceries",
                recipeId: recipe.id,
                recipeName: recipe.title,
            });
        });

        // Show success feedback
        showToast(`${recipe.ingredients.length} items added to shopping list!`, "success");

        // Reset button after animation
        setTimeout(() => setAddingToList(false), 2000);
    };

    const handleAddToMealPlan = (mealType: string) => {
        if (!recipe) return;
        const mealSlot: MealSlot = {
            id: recipe.id,
            recipeId: recipe.id,
            recipeName: recipe.title,
            recipeImage: recipe.image_url || "",
            calories: recipe.nutrition?.calories || 0,
            protein: recipe.nutrition?.protein || 0,
            carbs: recipe.nutrition?.carbs || 0,
            fat: recipe.nutrition?.fat || 0,
            servings: servings,
        };

        if (mealType === "snack") {
            addSnack(selectedDate, mealSlot);
        } else {
            setMeal(selectedDate, mealType as "breakfast" | "lunch" | "dinner", mealSlot);
        }
        setShowAddToPlan(false);
        router.push("/plan");
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty?.toLowerCase()) {
            case "easy": return "bg-green-100 text-green-700 border-green-300";
            case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "hard": return "bg-red-100 text-red-700 border-red-300";
            default: return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14] flex items-center justify-center">
                <CookingLoader message="Loading recipe..." />
            </div>
        );
    }

    // Error state
    if (error || !recipe) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14] flex items-center justify-center p-6">
                <div className="bg-white dark:bg-[#1a2c1e] rounded-2xl p-8 text-center max-w-md shadow-xl">
                    <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Recipe Not Found</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        {error?.message || "We couldn't find this recipe. It may have been removed or the link is incorrect."}
                    </p>
                    <button
                        onClick={() => router.push("/")}
                        className="px-6 py-3 bg-[#13ec37] text-[#111812] font-bold rounded-full hover:shadow-lg transition-all"
                    >
                        Browse Recipes
                    </button>
                </div>
            </div>
        );
    }

    // Calculate nutrition percentages (based on daily values)
    const nutritionData = [
        { label: "Calories", value: Math.round((recipe.nutrition?.calories || 0) * scaleFactor), unit: "", percent: Math.min(((recipe.nutrition?.calories || 0) * scaleFactor / 2000) * 100, 100), color: "from-orange-400 to-red-500" },
        { label: "Protein", value: Math.round((recipe.nutrition?.protein || 0) * scaleFactor), unit: "g", percent: Math.min(((recipe.nutrition?.protein || 0) * scaleFactor / 50) * 100, 100), color: "from-blue-400 to-indigo-500" },
        { label: "Carbs", value: Math.round((recipe.nutrition?.carbs || 0) * scaleFactor), unit: "g", percent: Math.min(((recipe.nutrition?.carbs || 0) * scaleFactor / 300) * 100, 100), color: "from-amber-400 to-orange-500" },
        { label: "Fat", value: Math.round((recipe.nutrition?.fat || 0) * scaleFactor), unit: "g", percent: Math.min(((recipe.nutrition?.fat || 0) * scaleFactor / 65) * 100, 100), color: "from-purple-400 to-pink-500" },
        { label: "Fiber", value: Math.round((recipe.nutrition?.fiber || 0) * scaleFactor), unit: "g", percent: Math.min(((recipe.nutrition?.fiber || 0) * scaleFactor / 25) * 100, 100), color: "from-green-400 to-emerald-500" },
    ];

    // Cooking Mode View
    if (cookingMode) {
        const currentInstruction = recipe.instructions[currentStep] || "";
        const progress = ((currentStep + 1) / recipe.instructions.length) * 100;

        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                {/* Header */}
                <div className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                        <button
                            onClick={() => setCookingMode(false)}
                            className="flex items-center gap-2 text-white/70 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                            <span>Exit</span>
                        </button>
                        <div className="text-center">
                            <h1 className="font-bold truncate max-w-[200px]">{recipe.title}</h1>
                            <p className="text-xs text-white/60">Step {currentStep + 1} of {recipe.instructions.length}</p>
                        </div>
                        <div className="w-16" />
                    </div>
                    {/* Progress bar */}
                    <div className="h-1 bg-white/10">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[#13ec37] to-emerald-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <div className="pt-24 pb-32 px-6 max-w-2xl mx-auto">
                    {/* Timer */}
                    {timer !== null && (
                        <motion.div
                            className="mb-8 p-6 bg-white/5 rounded-2xl border border-white/10 text-center"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <p className="text-white/60 mb-2">Timer</p>
                            <p className={`text-5xl font-mono font-bold ${timer < 30 ? "text-red-400 animate-pulse" : ""}`}>
                                {formatTime(timer)}
                            </p>
                            <div className="flex justify-center gap-4 mt-4">
                                <button
                                    onClick={() => setTimerRunning(!timerRunning)}
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20"
                                >
                                    {timerRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                                </button>
                                <button
                                    onClick={() => { setTimer(null); setTimerRunning(false); }}
                                    className="p-3 rounded-full bg-white/10 hover:bg-white/20"
                                >
                                    <RotateCcw className="w-6 h-6" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Current Step */}
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#13ec37] to-emerald-500 flex items-center justify-center text-lg font-bold text-slate-900">
                                {currentStep + 1}
                            </div>
                            <div className="flex-1 h-0.5 bg-white/10" />
                        </div>

                        <p className="text-xl leading-relaxed">{currentInstruction}</p>

                        {/* Quick timer buttons */}
                        <div className="flex flex-wrap gap-2 mt-6">
                            {[1, 2, 5, 10, 15, 30].map((mins) => (
                                <button
                                    key={mins}
                                    onClick={() => { setTimer(mins * 60); setTimerRunning(true); }}
                                    className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm font-semibold"
                                >
                                    <Timer className="w-4 h-4 inline mr-1" />
                                    {mins} min
                                </button>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Navigation */}
                <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-white/10 p-4">
                    <div className="max-w-2xl mx-auto flex gap-4">
                        <button
                            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                            disabled={currentStep === 0}
                            className="flex-1 py-4 rounded-xl bg-white/10 font-bold disabled:opacity-30"
                        >
                            Previous
                        </button>
                        {currentStep < recipe.instructions.length - 1 ? (
                            <button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                className="flex-1 py-4 rounded-xl bg-[#13ec37] text-slate-900 font-bold"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={() => setCookingMode(false)}
                                className="flex-1 py-4 rounded-xl bg-[#13ec37] text-slate-900 font-bold"
                            >
                                Done! 🎉
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14] font-display text-[#111812] dark:text-white antialiased min-h-screen">
            {/* Container */}
            <div className="relative w-full max-w-md md:max-w-2xl lg:max-w-6xl mx-auto min-h-screen bg-white/80 dark:bg-[#1a2c1e]/90 backdrop-blur-sm shadow-2xl overflow-hidden pb-24 lg:pb-8">

                {/* Desktop: Side by side layout */}
                <div className="lg:flex lg:flex-row lg:min-h-screen">

                    {/* Hero Section */}
                    <div className="relative h-[350px] lg:h-screen lg:w-[45%] lg:sticky lg:top-0 w-full group">
                        {/* Hero Image */}
                        <div className="absolute inset-0 overflow-hidden">
                            <Image
                                src={recipe.image_url || "/images/recipes/default.png"}
                                alt={recipe.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/40" />
                        </div>

                        {/* Top Bar */}
                        <div className="absolute top-0 left-0 w-full flex items-center justify-between p-4 pt-12 z-20">
                            <motion.button
                                onClick={() => router.back()}
                                className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white hover:bg-white/30"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <ChevronRight className="w-6 h-6 rotate-180" />
                            </motion.button>
                            <div className="flex gap-3">
                                <motion.button
                                    onClick={handleFavoriteToggle}
                                    className={`flex items-center justify-center w-11 h-11 rounded-full backdrop-blur-xl border border-white/20 ${currentIsFavorite ? "bg-red-500" : "bg-white/20"} text-white`}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Heart className={`w-5 h-5 ${currentIsFavorite ? "fill-white" : ""}`} />
                                </motion.button>
                                <motion.button
                                    onClick={() => setShowShareMenu(!showShareMenu)}
                                    className="flex items-center justify-center w-11 h-11 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Share2 className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Share Menu Dropdown */}
                        <AnimatePresence>
                            {showShareMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-24 right-4 bg-white dark:bg-slate-800 rounded-xl shadow-2xl p-2 z-30"
                                >
                                    <button
                                        onClick={() => { navigator.clipboard.writeText(window.location.href); setShowShareMenu(false); }}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3"
                                    >
                                        <Share2 className="w-4 h-4" />
                                        Copy Link
                                    </button>
                                    <button
                                        onClick={() => window.print()}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3"
                                    >
                                        <Printer className="w-4 h-4" />
                                        Print Recipe
                                    </button>
                                    <button
                                        onClick={() => setShowAddToPlan(true)}
                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg flex items-center gap-3"
                                    >
                                        <Bookmark className="w-4 h-4" />
                                        Add to Plan
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bottom Info Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-3">
                                {[1, 2, 3, 4].map((i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <StarHalf className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-white/80 text-sm ml-1">4.5 (128 reviews)</span>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-2">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                                    <Clock className="w-4 h-4" />
                                    <span>{(recipe.prep_time || 0) + (recipe.cook_time || 0)} min</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
                                    <Users className="w-4 h-4" />
                                    <span>{recipe.servings} servings</span>
                                </div>
                                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-sm text-sm ${getDifficultyColor(recipe.difficulty || "easy")}`}>
                                    <ChefHat className="w-4 h-4" />
                                    <span className="capitalize">{recipe.difficulty || "Easy"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:flex-1 lg:overflow-y-auto">
                        <motion.div
                            className="relative z-10 -mt-8 lg:mt-0 bg-white dark:bg-[#1a2c1e] rounded-t-[2rem] lg:rounded-none w-full px-6 lg:px-10 pt-2 lg:pt-10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] lg:shadow-none"
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Pull Indicator - mobile only */}
                            <div className="w-12 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mt-4 mb-6 lg:hidden" />

                            {/* Title & Description */}
                            <div className="mb-6">
                                <h1 className="text-2xl lg:text-4xl font-bold leading-tight tracking-tight mb-3">
                                    {recipe.title}
                                </h1>
                                {recipe.description && (
                                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                        {recipe.description}
                                    </p>
                                )}
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {recipe.dietary_tags?.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 rounded-full bg-[#13ec37]/10 text-[#13ec37] text-sm font-semibold border border-[#13ec37]/20"
                                    >
                                        {tag}
                                    </span>
                                ))}
                                <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-semibold">
                                    {recipe.cuisine_type}
                                </span>
                            </div>

                            {/* Tabs */}
                            <div className="flex gap-1 p-1 bg-gray-100 dark:bg-[#102213] rounded-xl mb-6">
                                {(["ingredients", "instructions", "nutrition"] as const).map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all capitalize ${activeTab === tab
                                            ? "bg-white dark:bg-[#1a2c1e] shadow-sm text-[#111812] dark:text-white"
                                            : "text-gray-500"
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <AnimatePresence mode="wait">
                                {activeTab === "ingredients" && (
                                    <motion.div
                                        key="ingredients"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-8"
                                    >
                                        {/* Servings Adjuster */}
                                        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 dark:bg-[#102213] rounded-xl">
                                            <span className="font-semibold">Servings</span>
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setServings(Math.max(1, servings - 1))}
                                                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center"
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="text-xl font-bold w-8 text-center">{servings}</span>
                                                <button
                                                    onClick={() => setServings(servings + 1)}
                                                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 shadow flex items-center justify-center"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Ingredients List */}
                                        <div className="space-y-3">
                                            {recipe.ingredients.map((ingredient, index) => (
                                                <motion.div
                                                    key={index}
                                                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${checkedIngredients.has(index)
                                                        ? "bg-[#13ec37]/10 border border-[#13ec37]/30"
                                                        : "bg-gray-50 dark:bg-[#102213] hover:bg-gray-100 dark:hover:bg-[#102213]/80"
                                                        }`}
                                                    onClick={() => toggleIngredient(index)}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.03 }}
                                                >
                                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${checkedIngredients.has(index)
                                                        ? "bg-[#13ec37] border-[#13ec37]"
                                                        : "border-gray-300 dark:border-gray-600"
                                                        }`}>
                                                        {checkedIngredients.has(index) && (
                                                            <Check className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <span className={`font-semibold ${checkedIngredients.has(index) ? "line-through text-gray-400" : ""}`}>
                                                            {scaleAmount(ingredient.amount)} {ingredient.unit}
                                                        </span>
                                                        <span className={`ml-2 ${checkedIngredients.has(index) ? "line-through text-gray-400" : ""}`}>
                                                            {ingredient.name}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Add to Shopping List */}
                                        <motion.button
                                            onClick={handleAddToShoppingList}
                                            disabled={addingToList}
                                            className={`w-full mt-6 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${addingToList
                                                ? "bg-[#13ec37] text-[#111812]"
                                                : "bg-gray-100 dark:bg-[#102213] hover:bg-gray-200 dark:hover:bg-[#102213]/80"
                                                }`}
                                            whileTap={{ scale: 0.98 }}
                                            animate={addingToList ? { scale: [1, 1.02, 1] } : {}}
                                        >
                                            <AnimatePresence mode="wait">
                                                {addingToList ? (
                                                    <motion.div
                                                        key="success"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Check className="w-5 h-5" />
                                                        Added!
                                                    </motion.div>
                                                ) : (
                                                    <motion.div
                                                        key="default"
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <ShoppingCart className="w-5 h-5" />
                                                        Add to Shopping List
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </motion.button>
                                    </motion.div>
                                )}

                                {activeTab === "instructions" && (
                                    <motion.div
                                        key="instructions"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-8"
                                    >
                                        <div className="space-y-4">
                                            {recipe.instructions.map((step, index) => (
                                                <motion.div
                                                    key={index}
                                                    className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all ${checkedSteps.has(index)
                                                        ? "bg-[#13ec37]/10 border border-[#13ec37]/30"
                                                        : "bg-gray-50 dark:bg-[#102213] hover:bg-gray-100 dark:hover:bg-[#102213]/80"
                                                        }`}
                                                    onClick={() => toggleStep(index)}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold ${checkedSteps.has(index)
                                                        ? "bg-[#13ec37] text-white"
                                                        : "bg-white dark:bg-slate-700 shadow"
                                                        }`}>
                                                        {checkedSteps.has(index) ? (
                                                            <Check className="w-4 h-4" />
                                                        ) : (
                                                            index + 1
                                                        )}
                                                    </div>
                                                    <p className={`flex-1 leading-relaxed ${checkedSteps.has(index) ? "text-gray-400" : ""}`}>
                                                        {step}
                                                    </p>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "nutrition" && (
                                    <motion.div
                                        key="nutrition"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="mb-8"
                                    >
                                        <div className="p-4 bg-gray-50 dark:bg-[#102213] rounded-xl mb-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Nutrition values are per serving ({servings} servings)
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            {nutritionData.map((item, index) => (
                                                <motion.div
                                                    key={item.label}
                                                    className="flex items-center gap-4"
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: index * 0.05 }}
                                                >
                                                    <div className="w-24 font-semibold">{item.label}</div>
                                                    <div className="flex-1">
                                                        <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                                            <motion.div
                                                                className={`h-full bg-gradient-to-r ${item.color} rounded-full`}
                                                                initial={{ width: 0 }}
                                                                animate={{ width: `${item.percent}%` }}
                                                                transition={{ delay: 0.3 + index * 0.05, duration: 0.5 }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-20 text-right font-bold">
                                                        {item.value}{item.unit}
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>

                                        {/* Daily Value Note */}
                                        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-sm text-blue-700 dark:text-blue-300">
                                            <p>* Percent Daily Values are based on a 2,000 calorie diet.</p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Add to Plan Modal */}
            <AnimatePresence>
                {showAddToPlan && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 flex items-end lg:items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddToPlan(false)}
                    >
                        <motion.div
                            className="bg-white dark:bg-slate-800 rounded-t-3xl lg:rounded-2xl w-full max-w-md p-6"
                            initial={{ y: 100 }}
                            animate={{ y: 0 }}
                            exit={{ y: 100 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold mb-4">Add to Meal Plan</h3>
                            <p className="text-gray-500 mb-4">Select a meal slot for today:</p>
                            <div className="space-y-2">
                                {["breakfast", "lunch", "dinner", "snack"].map((meal) => (
                                    <button
                                        key={meal}
                                        onClick={() => handleAddToMealPlan(meal)}
                                        className="w-full py-3 px-4 bg-gray-100 dark:bg-slate-700 hover:bg-[#13ec37]/20 rounded-xl font-semibold capitalize flex items-center gap-3"
                                    >
                                        <Utensils className="w-5 h-5" />
                                        {meal}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none w-full max-w-md md:max-w-2xl lg:max-w-6xl mx-auto">
                <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white via-white/90 to-transparent dark:from-[#1a2c1e] dark:via-[#1a2c1e]/90 dark:to-transparent lg:from-transparent lg:via-transparent" />
                <div className="relative p-4 pointer-events-auto flex gap-3 lg:justify-end">
                    <motion.button
                        onClick={() => setShowAddToPlan(true)}
                        className="flex-none w-14 h-14 bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 rounded-full flex items-center justify-center shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-6 h-6" />
                    </motion.button>
                    <motion.button
                        onClick={() => setCookingMode(true)}
                        className="flex-1 lg:flex-none lg:min-w-[200px] h-14 bg-gradient-to-r from-[#13ec37] to-emerald-400 text-[#111812] rounded-full text-lg font-bold shadow-[0_0_30px_-5px_rgba(19,236,55,0.5)] flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <Play className="w-5 h-5" />
                        Start Cooking
                    </motion.button>
                </div>
            </div>

            {/* Toast Notification */}
            <AnimatePresence>
                {toast.show && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, x: "-50%" }}
                        animate={{ opacity: 1, y: 0, x: "-50%" }}
                        exit={{ opacity: 0, y: 50, x: "-50%" }}
                        className="fixed bottom-24 left-1/2 z-50 px-6 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${toast.type === "success" ? "bg-[#13ec37]" : "bg-red-500"}`}>
                            {toast.type === "success" ? (
                                <Check className="w-5 h-5 text-slate-900" />
                            ) : (
                                <AlertCircle className="w-5 h-5 text-white" />
                            )}
                        </div>
                        <span className="font-semibold">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
