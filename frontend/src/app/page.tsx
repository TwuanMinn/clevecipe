"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ResponsiveLayout } from "@/components/layout";
import {
    PageHeader,
    GreetingSection,
    DashboardStats,
    CategoryFilter,
    RecipeCard,
} from "@/components/home";
import { categories } from "@/data/homepage-data";
import { useRecipes } from "@/lib/use-recipes";
import { containerVariants } from "@/lib/animations";
import { CookingLoader } from "@/components/ui";
import { useMealPlanStore, usePreferencesStore } from "@/lib/stores";
import { Calendar, Plus, Coffee, Sun, Moon, Cookie, ChevronRight } from "lucide-react";

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState("for-you");
    const { recipes, isLoading, error, isDemo } = useRecipes();

    // Get today's meal plan
    const today = new Date().toISOString().split("T")[0];
    const { weeklyPlan, getDayTotals } = useMealPlanStore();
    const { dailyCalorieTarget } = usePreferencesStore();
    const todayPlan = weeklyPlan[today];
    const todayTotals = getDayTotals(today);

    const hasMealsPlanned = todayPlan && (
        todayPlan.breakfast ||
        todayPlan.lunch ||
        todayPlan.dinner ||
        todayPlan.snacks.length > 0
    );

    const caloriesRemaining = Math.max(0, dailyCalorieTarget - todayTotals.calories);

    // Meal slot component
    const MealSlotCard = ({
        label,
        icon: Icon,
        meal,
        mealType,
        color,
    }: {
        label: string;
        icon: React.ElementType;
        meal: { recipeName: string; recipeImage: string; calories: number } | null;
        mealType: string;
        color: string;
    }) => (
        <div className="flex items-center gap-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
            <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5 text-white" />
            </div>
            {meal ? (
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                        {meal.recipeName}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {meal.calories} kcal
                    </p>
                </div>
            ) : (
                <Link
                    href={`/generate?meal=${mealType}&date=${today}`}
                    className="flex-1 flex items-center gap-2 text-slate-400 hover:text-[#13ec37] transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span className="text-sm">Add {label}</span>
                </Link>
            )}
        </div>
    );

    return (
        <ResponsiveLayout>
            <div className="relative flex w-full flex-col overflow-x-hidden">
                {/* Animated Gradient Background Accent */}
                <motion.div
                    className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-[#13ec37]/20 via-[#13ec37]/5 to-transparent" />
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#13ec37]/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-40 left-10 w-56 h-56 bg-emerald-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </motion.div>

                {/* Mobile Header - Hidden on desktop (toolbar has nav) */}
                <div className="lg:hidden">
                    <PageHeader />
                </div>

                {/* Greeting */}
                <div className="pt-4 lg:pt-8">
                    <GreetingSection name="Chef" caloriesRemaining={caloriesRemaining} />
                </div>

                {/* Today's Meal Plan Card */}
                <motion.div
                    className="mx-4 lg:mx-0 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-gradient-to-br from-white/80 to-white/60 dark:from-slate-800/80 dark:to-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/50 dark:border-slate-700/50 p-5 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[#13ec37]" />
                                <h2 className="font-bold text-slate-900 dark:text-white">Today&apos;s Meals</h2>
                            </div>
                            <Link
                                href="/plan"
                                className="flex items-center gap-1 text-sm text-[#13ec37] font-semibold hover:underline"
                            >
                                View Plan
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {hasMealsPlanned ? (
                            <div className="grid grid-cols-2 gap-3">
                                <MealSlotCard
                                    label="Breakfast"
                                    icon={Coffee}
                                    meal={todayPlan?.breakfast || null}
                                    mealType="breakfast"
                                    color="bg-orange-400"
                                />
                                <MealSlotCard
                                    label="Lunch"
                                    icon={Sun}
                                    meal={todayPlan?.lunch || null}
                                    mealType="lunch"
                                    color="bg-yellow-500"
                                />
                                <MealSlotCard
                                    label="Dinner"
                                    icon={Moon}
                                    meal={todayPlan?.dinner || null}
                                    mealType="dinner"
                                    color="bg-indigo-500"
                                />
                                <MealSlotCard
                                    label="Snack"
                                    icon={Cookie}
                                    meal={todayPlan?.snacks[0] || null}
                                    mealType="snack"
                                    color="bg-pink-400"
                                />
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-slate-500 dark:text-slate-400 mb-3">
                                    No meals planned for today
                                </p>
                                <Link
                                    href="/plan"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-[#13ec37] text-[#102213] rounded-xl font-semibold text-sm hover:bg-[#13ec37]/90 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Start Planning
                                </Link>
                            </div>
                        )}

                        {hasMealsPlanned && (
                            <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500 dark:text-slate-400">Total Calories</span>
                                    <span className="font-bold text-slate-900 dark:text-white">
                                        {todayTotals.calories} / {dailyCalorieTarget} kcal
                                    </span>
                                </div>
                                <div className="mt-2 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[#13ec37] to-emerald-400 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min((todayTotals.calories / dailyCalorieTarget) * 100, 100)}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Stats Dashboard */}
                <DashboardStats />

                {/* Category Filter */}
                <CategoryFilter
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                />

                {/* Demo Mode Banner */}
                {isDemo && (
                    <div className="mx-4 mb-4 px-4 py-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-300 dark:border-amber-700 rounded-xl text-amber-800 dark:text-amber-200 text-xs text-center">
                        🔧 Demo Mode: Using local data. Connect Supabase for live data.
                    </div>
                )}

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-20">
                        <CookingLoader message="Finding recipes for you..." />
                    </div>
                )}

                {/* Error State */}
                {error && !isLoading && (
                    <div className="mx-4 p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-center">
                        <p className="text-red-600 dark:text-red-400 font-medium">
                            Failed to load recipes
                        </p>
                        <p className="text-red-500/70 dark:text-red-400/70 text-sm mt-1">
                            {error.message}
                        </p>
                    </div>
                )}

                {/* Recipe Feed Grid - Responsive columns */}
                {!isLoading && !error && (
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 px-4 lg:px-0 pt-2 pb-4"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {recipes.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={{
                                    id: recipe.id,
                                    title: recipe.title,
                                    image_url: recipe.image_url || '/images/recipes/placeholder.png',
                                    prep_time: recipe.prep_time || 0,
                                    calories: recipe.nutrition?.calories || 0,
                                    match_percentage: recipe.match_percentage || 0,
                                    is_primary_match: (recipe.match_percentage || 0) >= 95,
                                }}
                            />
                        ))}
                    </motion.div>
                )}
            </div>
        </ResponsiveLayout>
    );
}

