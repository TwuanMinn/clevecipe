"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus, ChevronRight } from "lucide-react";
import Link from "next/link";
import { ResponsiveLayout } from "@/components/layout";
import { useNutritionLogStore, usePreferencesStore } from "@/lib/stores";
import { demoRecipes } from "@/data/homepage-data";

// Derive meal suggestions from shared data (no hard-coding)
const getMealSuggestions = () => {
    // Transform shared recipes into meal suggestions
    return demoRecipes.slice(0, 3).map((recipe) => ({
        id: recipe.id,
        title: recipe.title,
        image: recipe.image_url,
        tag: recipe.match_percentage >= 95 ? "High Protein" : recipe.match_percentage >= 90 ? "Balanced" : "Low Carb",
        description: `${recipe.calories} kcal • ${recipe.prep_time} min prep`,
    }));
};

export default function InsightsPage() {
    const [timeframe, setTimeframe] = useState<"week" | "month">("week");

    // Get real data from stores
    const { dailyCalorieTarget } = usePreferencesStore();
    const { getDailyTotals, getWeeklyData, getWeeklyAdherence } = useNutritionLogStore();

    // Get today's date
    const today = new Date().toISOString().split("T")[0];

    // Get today's nutrition totals
    const todayTotals = useMemo(() => getDailyTotals(today), [getDailyTotals, today]);

    // Get weekly data for the chart
    const weeklyData = useMemo(() => getWeeklyData(dailyCalorieTarget), [getWeeklyData, dailyCalorieTarget]);

    // Get overall weekly adherence percentage
    const weeklyAdherence = useMemo(() => getWeeklyAdherence(dailyCalorieTarget), [getWeeklyAdherence, dailyCalorieTarget]);

    // Calculate calories remaining
    const caloriesRemaining = Math.max(0, dailyCalorieTarget - todayTotals.calories);
    const caloriesOver = todayTotals.calories > dailyCalorieTarget ? todayTotals.calories - dailyCalorieTarget : 0;

    // Calculate macro targets (rough estimates based on calorie target)
    const proteinTarget = Math.round(dailyCalorieTarget * 0.25 / 4); // 25% from protein, 4 cal/g
    const carbsTarget = Math.round(dailyCalorieTarget * 0.45 / 4);   // 45% from carbs, 4 cal/g
    const fatTarget = Math.round(dailyCalorieTarget * 0.30 / 9);      // 30% from fat, 9 cal/g

    // Calculate remaining macros
    const proteinRemaining = Math.max(0, proteinTarget - todayTotals.protein);
    const carbsRemaining = Math.max(0, carbsTarget - todayTotals.carbs);
    const fatRemaining = Math.max(0, fatTarget - todayTotals.fat);

    // Calculate percentages consumed
    const proteinPercent = proteinTarget > 0 ? Math.min((todayTotals.protein / proteinTarget) * 100, 100) : 0;
    const carbsPercent = carbsTarget > 0 ? Math.min((todayTotals.carbs / carbsTarget) * 100, 100) : 0;
    const fatPercent = fatTarget > 0 ? Math.min((todayTotals.fat / fatTarget) * 100, 100) : 0;

    // Calculate donut chart segments
    const totalMacros = todayTotals.protein + todayTotals.carbs + todayTotals.fat;
    const proteinAngle = totalMacros > 0 ? (todayTotals.protein / totalMacros) * 100 : 33;
    const carbsAngle = totalMacros > 0 ? (todayTotals.carbs / totalMacros) * 100 : 33;
    const fatAngle = totalMacros > 0 ? (todayTotals.fat / totalMacros) * 100 : 33;
    const _emptyAngle = 100 - proteinAngle - carbsAngle - fatAngle;

    const hasData = todayTotals.calories > 0 || weeklyAdherence > 0;

    return (
        <ResponsiveLayout>
            <div className="relative">
                {/* Animated background blobs */}
                <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                {/* Page Title */}
                <motion.div
                    className="px-6 pt-6 pb-4 relative z-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">Your Progress</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your nutrition journey</p>
                </motion.div>

                {/* Segmented Control */}
                <div className="px-6 pb-4 relative z-10">
                    <div className="flex h-12 w-full items-center justify-center rounded-2xl bg-white/70 backdrop-blur-xl p-1.5 shadow-lg border border-white/50">
                        <button
                            onClick={() => setTimeframe("week")}
                            className={`flex h-full grow items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${timeframe === "week"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            This Week
                        </button>
                        <button
                            onClick={() => setTimeframe("month")}
                            className={`flex h-full grow items-center justify-center rounded-xl px-4 text-sm font-semibold transition-all duration-200 ${timeframe === "month"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            This Month
                        </button>
                    </div>
                </div>

                {/* Weekly Adherence Chart */}
                <motion.div
                    className="px-6 py-2 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <div className="flex flex-col gap-4 rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/50">
                        <div className="flex justify-between items-end">
                            <div className="flex flex-col gap-1">
                                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Weekly Adherence</p>
                                <p className="text-4xl font-extrabold tracking-tighter text-gray-900">
                                    {weeklyAdherence > 0 ? `${weeklyAdherence}%` : "—"}
                                </p>
                            </div>
                            {weeklyAdherence > 0 && (
                                <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                                    <TrendingUp className="w-4 h-4 text-green-600" />
                                    <p className="text-green-700 text-xs font-bold">Keep it up!</p>
                                </div>
                            )}
                        </div>

                        {/* Bar Chart */}
                        <div className="grid h-48 grid-cols-7 items-end justify-items-center gap-2 pt-4">
                            {weeklyData.map((item, index) => (
                                <motion.div
                                    key={index}
                                    className="group flex flex-col items-center gap-2 w-full h-full justify-end"
                                    initial={{ opacity: 0, scaleY: 0 }}
                                    animate={{ opacity: 1, scaleY: 1 }}
                                    transition={{ delay: 0.2 + index * 0.05 }}
                                    style={{ transformOrigin: "bottom" }}
                                >
                                    <div className="relative w-full rounded-full bg-gray-100 overflow-hidden h-full flex items-end group-hover:bg-gray-200 transition-colors">
                                        <div
                                            className={`w-full rounded-full bg-gradient-to-t from-green-400/60 to-green-500 ${item.isToday ? "shadow-[0_0_10px_rgba(34,197,94,0.4)]" : ""
                                                }`}
                                            style={{ height: `${Math.max(item.value, 5)}%`, opacity: item.value < 20 ? 0.3 : 1 }}
                                        />
                                    </div>
                                    <p className={`text-xs font-bold ${item.isToday ? "text-gray-900" : "text-gray-400"}`}>
                                        {item.day}
                                    </p>
                                </motion.div>
                            ))}
                        </div>

                        {!hasData && (
                            <div className="text-center py-4">
                                <p className="text-gray-500 text-sm">Start logging meals to see your progress!</p>
                                <Link href="/log" className="text-green-600 font-semibold text-sm hover:underline">
                                    Log your first meal →
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Today's Balance Section */}
                <h3 className="px-6 py-4 text-lg font-bold tracking-tight text-gray-900 relative z-10">Today&apos;s Balance</h3>

                <motion.div
                    className="px-6 pb-2 relative z-10"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex flex-col gap-6 rounded-2xl bg-white/70 backdrop-blur-xl p-6 shadow-lg border border-white/50">
                        <div className="flex flex-row items-center justify-between gap-6">
                            {/* Donut Chart */}
                            <div className="relative flex items-center justify-center size-32 shrink-0">
                                <div
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                        background: totalMacros > 0
                                            ? `conic-gradient(#22c55e 0% ${proteinAngle}%, #10b981 ${proteinAngle}% ${proteinAngle + carbsAngle}%, #34d399 ${proteinAngle + carbsAngle}% ${proteinAngle + carbsAngle + fatAngle}%, #e5e7eb ${proteinAngle + carbsAngle + fatAngle}% 100%)`
                                            : "conic-gradient(#e5e7eb 0% 100%)",
                                    }}
                                />
                                <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center z-10">
                                    <span className="text-xs text-gray-400 font-medium">
                                        {caloriesOver > 0 ? "Over" : "Left"}
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        {caloriesOver > 0 ? caloriesOver : caloriesRemaining}
                                    </span>
                                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">Kcal</span>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="flex flex-col flex-1 gap-3 justify-center">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-green-500" />
                                        <span className="text-sm font-semibold text-gray-700">Protein</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-400">{todayTotals.protein}g</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-semibold text-gray-700">Carbs</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-400">{todayTotals.carbs}g</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-2">
                                        <div className="size-3 rounded-full bg-green-300" />
                                        <span className="text-sm font-semibold text-gray-700">Fats</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-400">{todayTotals.fat}g</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                            {/* Protein Bar */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs font-bold tracking-wide">
                                    <span className="text-gray-400 uppercase">Protein Remaining</span>
                                    <span className="text-gray-900">{proteinRemaining}g left</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${proteinPercent}%` }}
                                        transition={{ delay: 0.3, duration: 0.8 }}
                                    />
                                </div>
                            </div>

                            {/* Carbs Bar */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs font-bold tracking-wide">
                                    <span className="text-gray-400 uppercase">Carbs Remaining</span>
                                    <span className="text-gray-900">{carbsRemaining}g left</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-emerald-500 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${carbsPercent}%` }}
                                        transition={{ delay: 0.4, duration: 0.8 }}
                                    />
                                </div>
                            </div>

                            {/* Fats Bar */}
                            <div className="flex flex-col gap-1">
                                <div className="flex justify-between text-xs font-bold tracking-wide">
                                    <span className="text-gray-400 uppercase">Fats Remaining</span>
                                    <span className="text-gray-900">{fatRemaining}g left</span>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-green-300 rounded-full"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${fatPercent}%` }}
                                        transition={{ delay: 0.5, duration: 0.8 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Meal Suggestions Section */}
                <div className="flex flex-col pt-4 pb-28 relative z-10">
                    <div className="flex items-center justify-between px-6 pb-4">
                        <h3 className="text-lg font-bold tracking-tight text-gray-900">For Tomorrow</h3>
                        <button className="flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                            See all
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
                        {getMealSuggestions().map((meal: { id: string; title: string; image: string; tag: string; description: string }, index: number) => (
                            <motion.div
                                key={meal.id}
                                className="snap-center min-w-[260px] flex flex-col gap-3 rounded-2xl bg-white/70 backdrop-blur-xl p-3 shadow-lg border border-white/50 group cursor-pointer hover:border-green-300 transition-all"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + index * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div
                                    className="aspect-[4/3] w-full rounded-xl bg-cover bg-center relative overflow-hidden"
                                    style={{ backgroundImage: `url('${meal.image}')` }}
                                >
                                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide text-gray-800">
                                        {meal.tag}
                                    </div>
                                </div>
                                <div className="flex flex-col px-1">
                                    <h4 className="text-base font-bold text-gray-900 line-clamp-1">{meal.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1">{meal.description}</p>
                                </div>
                                <button className="mt-1 w-full rounded-full bg-gray-100 py-2.5 text-sm font-bold text-gray-700 hover:bg-green-500 hover:text-white transition-colors flex items-center justify-center gap-2 group-hover:bg-green-500 group-hover:text-white">
                                    <Plus className="w-4 h-4" />
                                    Add to Plan
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Floating Action Button - Link to Log Page */}
                <Link href="/log">
                    <motion.button
                        className="fixed bottom-24 lg:bottom-8 right-6 size-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 flex items-center justify-center z-30"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                    >
                        <Plus className="w-7 h-7" />
                    </motion.button>
                </Link>
            </div>
        </ResponsiveLayout>
    );
}
