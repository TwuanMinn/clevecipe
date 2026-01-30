"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ResponsiveLayout } from "@/components/layout";
import { useMealPlanStore, usePreferencesStore } from "@/lib/stores";
import { MoreVertical, Trash2 } from "lucide-react";

// Get week days dynamically based on current date
function getWeekDays() {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));

    return Array.from({ length: 7 }, (_, i) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        return {
            day: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i],
            date: date.getDate(),
            fullDate: date.toISOString().split("T")[0], // YYYY-MM-DD
            isPast: date < new Date(today.toDateString()),
            isToday: date.toDateString() === today.toDateString(),
        };
    });
}

export default function PlanPage() {
    const router = useRouter();
    const weekDays = useMemo(() => getWeekDays(), []);
    const todayDate = weekDays.find(d => d.isToday)?.fullDate || weekDays[0].fullDate;

    const [selectedDate, setSelectedDate] = useState(todayDate);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const _selectedDay = weekDays.find(d => d.fullDate === selectedDate)?.date || weekDays[0].date;

    // Get store data
    const { weeklyPlan, getDayTotals, removeMealFromPlan } = useMealPlanStore();
    const { dailyCalorieTarget } = usePreferencesStore();

    // Handle meal removal
    const handleRemoveMeal = (mealType: "breakfast" | "lunch" | "dinner" | "snacks") => {
        removeMealFromPlan(selectedDate, mealType);
        setOpenMenu(null);
    };

    // Close menu when clicking outside
    useEffect(() => {
        if (openMenu) {
            const handleClickOutside = () => setOpenMenu(null);
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenu]);

    // Get the plan for the selected date
    const dayPlan = weeklyPlan[selectedDate];
    const dayTotals = getDayTotals(selectedDate);

    // Create meals structure from store or use defaults
    const meals = useMemo(() => ({
        breakfast: {
            title: "Breakfast",
            calories: dayPlan?.breakfast?.calories || 0,
            recipe: dayPlan?.breakfast ? {
                id: dayPlan.breakfast.recipeId,
                title: dayPlan.breakfast.recipeName,
                image: dayPlan.breakfast.recipeImage || "/images/recipes/avocado-toast.png",
                time: 15,
                calories: dayPlan.breakfast.calories,
            } : null,
        },
        lunch: {
            title: "Lunch",
            calories: dayPlan?.lunch?.calories || 0,
            recipe: dayPlan?.lunch ? {
                id: dayPlan.lunch.recipeId,
                title: dayPlan.lunch.recipeName,
                image: dayPlan.lunch.recipeImage || "/images/recipes/quinoa-bowl.png",
                time: 20,
                calories: dayPlan.lunch.calories,
            } : null,
        },
        dinner: {
            title: "Dinner",
            calories: dayPlan?.dinner?.calories || 0,
            recipe: dayPlan?.dinner ? {
                id: dayPlan.dinner.recipeId,
                title: dayPlan.dinner.recipeName,
                image: dayPlan.dinner.recipeImage || "/images/recipes/honey-salmon.png",
                time: 30,
                calories: dayPlan.dinner.calories,
            } : null,
        },
        snacks: {
            title: "Snacks",
            calories: dayPlan?.snacks?.reduce((sum, s) => sum + s.calories, 0) || 0,
            recipe: dayPlan?.snacks?.[0] ? {
                id: dayPlan.snacks[0].recipeId,
                title: dayPlan.snacks[0].recipeName,
                image: dayPlan.snacks[0].recipeImage || "/images/recipes/zucchini-pesto.png",
                time: 5,
                calories: dayPlan.snacks[0].calories,
            } : null,
        },
    }), [dayPlan]);

    const totalCalories = dayTotals.calories;
    const targetCalories = dailyCalorieTarget || 2000;
    const percentage = Math.round((totalCalories / targetCalories) * 100);

    return (
        <ResponsiveLayout>
            <div className="relative flex w-full flex-col">
                {/* Animated Background Blobs */}
                <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none z-0">
                    <div className="absolute top-10 right-10 w-72 h-72 bg-[#13ec37]/15 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute top-32 left-5 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                {/* Top Section - Date Picker & Summary */}
                <div className="relative z-10 -mx-4 lg:-mx-8 px-4 lg:px-8 bg-white/80 dark:bg-[#102213]/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50">
                    <div className="py-4">
                        <h2 className="text-xl font-bold text-center mb-4 text-slate-900 dark:text-white">
                            Weekly Planner
                        </h2>

                        {/* Horizontal Date Picker */}
                        <div className="flex flex-col gap-4 pb-4">
                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
                                    {new Date(selectedDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                </p>
                                <div className="flex gap-2">
                                    <button className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-[#1C261E] shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <button className="size-8 flex items-center justify-center rounded-full bg-white dark:bg-[#1C261E] shadow-sm">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="flex overflow-x-auto gap-3 no-scrollbar">
                                {weekDays.map((d) => (
                                    <motion.button
                                        key={d.date}
                                        onClick={() => setSelectedDate(d.fullDate)}
                                        className={`flex flex-col items-center justify-center min-w-[64px] h-[88px] rounded-full transition-all ${selectedDate === d.fullDate
                                            ? "bg-[#13ec37] shadow-[0_4px_12px_rgba(19,236,55,0.4)] scale-105"
                                            : "bg-white dark:bg-[#1C261E] border border-slate-100 dark:border-slate-800 shadow-sm"
                                            }`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <span className={`text-xs font-medium mb-1 ${d.isToday ? "text-[#102213] font-bold" : d.isPast ? "text-slate-400" : "text-slate-500"}`}>
                                            {d.day}
                                        </span>
                                        {d.isToday ? (
                                            <div className="size-9 bg-[#102213] text-[#13ec37] rounded-full flex items-center justify-center">
                                                <span className="text-xl font-bold">{d.date}</span>
                                            </div>
                                        ) : (
                                            <span className={`text-xl font-bold ${d.isPast ? "text-slate-400" : "text-slate-900 dark:text-white"}`}>
                                                {d.date}
                                            </span>
                                        )}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Macro Summary Widget */}
                        <div className="pb-4">
                            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-2xl p-4 shadow-xl shadow-green-500/20">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                                <div className="relative flex justify-between items-end mb-3">
                                    <div>
                                        <p className="text-xs font-bold text-white/70 uppercase tracking-wider">Calories</p>
                                        <p className="text-2xl font-bold text-white">
                                            {totalCalories.toLocaleString()} <span className="text-sm font-medium text-white/60">/ {targetCalories.toLocaleString()}</span>
                                        </p>
                                    </div>
                                    <motion.p
                                        className="text-xs font-bold text-emerald-900 bg-white/90 px-3 py-1.5 rounded-full shadow-sm"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ delay: 0.3, type: "spring" }}
                                    >
                                        🔥 {percentage}%
                                    </motion.p>
                                </div>
                                <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="h-full bg-white rounded-full shadow-sm"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percentage}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                                <div className="flex justify-between mt-3 text-xs text-white/80">
                                    <span>Protein: <b className="text-white">{dayTotals.protein || 0}g</b></span>
                                    <span>Carbs: <b className="text-white">{dayTotals.carbs || 0}g</b></span>
                                    <span>Fat: <b className="text-white">{dayTotals.fat || 0}g</b></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Scrollable Content */}
                <main className="flex-1 flex flex-col gap-2 pt-4 relative z-10">
                    {Object.entries(meals).map(([key, meal], index) => (
                        <motion.section
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div className="flex items-center justify-between py-3">
                                <h2 className="text-slate-900 dark:text-white text-xl font-bold">{meal.title}</h2>
                                <span className="text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-full">
                                    {meal.calories} kcal
                                </span>
                            </div>

                            {meal.recipe ? (
                                <div className="relative">
                                    <Link href={`/recipe/${meal.recipe.id}`}>
                                        <motion.div
                                            className="relative group active:scale-[0.99] transition-transform duration-200"
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                        >
                                            <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-white dark:bg-[#1C261E] p-3 pr-5 shadow-sm border border-slate-100 dark:border-slate-800">
                                                <div className="relative size-20 shrink-0 rounded-full overflow-hidden">
                                                    <Image
                                                        src={meal.recipe.image}
                                                        alt={meal.recipe.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1 flex-1 min-w-0">
                                                    <p className="text-slate-900 dark:text-white text-base font-bold leading-tight truncate">
                                                        {meal.recipe.title}
                                                    </p>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z" />
                                                            </svg>
                                                            {meal.recipe.time}m
                                                        </div>
                                                        <div className="flex items-center gap-1 text-xs text-[#13ec37] font-bold">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z" />
                                                            </svg>
                                                            {meal.recipe.calories}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-8" /> {/* Spacer for menu button */}
                                            </div>
                                        </motion.div>
                                    </Link>

                                    {/* Menu Button - positioned absolutely to not interfere with Link */}
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setOpenMenu(openMenu === key ? null : key);
                                        }}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors z-10"
                                    >
                                        <MoreVertical className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                                    </button>

                                    {/* Dropdown Menu */}
                                    <AnimatePresence>
                                        {openMenu === key && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ duration: 0.15 }}
                                                className="absolute right-4 top-full mt-2 bg-white dark:bg-[#1C261E] rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-20"
                                            >
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        handleRemoveMeal(key as "breakfast" | "lunch" | "dinner" | "snacks");
                                                    }}
                                                    className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                    <span className="font-medium">Remove</span>
                                                </button>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.button
                                    onClick={() => router.push(`/generate?meal=${key}&date=${selectedDate}`)}
                                    className="w-full h-24 rounded-[2rem] border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center gap-2 group hover:border-[#13ec37] hover:bg-[#13ec37]/5 transition-all"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="size-8 rounded-full bg-[#13ec37]/20 flex items-center justify-center text-[#13ec37] group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-[#13ec37] transition-colors">
                                        Add {meal.title}
                                    </span>
                                </motion.button>
                            )}
                        </motion.section>
                    ))}
                </main>
            </div>
        </ResponsiveLayout>
    );
}
