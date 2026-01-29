"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui";

// Demo data
const weekDays = [
    { day: "Mon", date: 12, isPast: true },
    { day: "Tue", date: 13, isPast: true },
    { day: "Wed", date: 14, isToday: true },
    { day: "Thu", date: 15 },
    { day: "Fri", date: 16 },
    { day: "Sat", date: 17 },
    { day: "Sun", date: 18 },
];

const meals = {
    breakfast: {
        title: "Breakfast",
        calories: 350,
        recipe: {
            id: "1",
            title: "Avocado Toast",
            image: "/images/recipes/avocado-toast.png",
            time: 10,
            calories: 350,
        },
    },
    lunch: {
        title: "Lunch",
        calories: 450,
        recipe: {
            id: "2",
            title: "Grilled Chicken Salad",
            image: "/images/recipes/quinoa-bowl.png",
            time: 20,
            calories: 450,
        },
    },
    dinner: {
        title: "Dinner",
        calories: 0,
        recipe: null,
    },
    snacks: {
        title: "Snacks",
        calories: 120,
        recipe: {
            id: "3",
            title: "Greek Yogurt",
            image: "/images/recipes/zucchini-pesto.png",
            time: 5,
            calories: 120,
        },
    },
};

export default function PlanPage() {
    const [selectedDay, setSelectedDay] = useState(14);

    const totalCalories = 1850;
    const targetCalories = 2000;
    const percentage = Math.round((totalCalories / targetCalories) * 100);

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14] font-display text-[#111812] dark:text-white">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-[400px] pointer-events-none z-0">
                <div className="absolute top-10 right-10 w-72 h-72 bg-[#13ec37]/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-32 left-5 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            {/* Top App Bar */}
            <header className="sticky top-0 z-50 bg-gradient-to-b from-emerald-50/95 to-green-50/95 dark:from-[#102213]/95 dark:to-[#0d1f14]/95 backdrop-blur-md border-b border-green-100/50 dark:border-gray-800">
                <div className="flex items-center p-4 pb-2 justify-between">
                    <div className="flex size-12 shrink-0 items-center">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white dark:border-gray-700 shadow-sm bg-[#13ec37]/20 flex items-center justify-center text-[#13ec37] font-bold"
                        >
                            S
                        </div>
                    </div>
                    <h2 className="text-[#111812] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center">
                        Weekly Planner
                    </h2>
                    <div className="flex w-12 items-center justify-end">
                        <button className="flex items-center justify-center rounded-full size-10 bg-transparent text-[#111812] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Horizontal Date Picker */}
                <div className="flex flex-col gap-4 pb-4">
                    <div className="flex items-center justify-between px-4">
                        <p className="text-sm font-bold text-gray-500 dark:text-gray-400">October 2023</p>
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

                    <div className="flex overflow-x-auto px-4 gap-3 no-scrollbar">
                        {weekDays.map((d) => (
                            <motion.button
                                key={d.date}
                                onClick={() => setSelectedDay(d.date)}
                                className={`flex flex-col items-center justify-center min-w-[64px] h-[88px] rounded-full transition-all ${d.isToday || selectedDay === d.date
                                    ? "bg-[#13ec37] shadow-[0_4px_12px_rgba(19,236,55,0.4)] scale-105"
                                    : "bg-white dark:bg-[#1C261E] border border-gray-100 dark:border-gray-800 shadow-sm"
                                    }`}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className={`text-xs font-medium mb-1 ${d.isToday ? "text-[#102213] font-bold" : d.isPast ? "text-gray-400" : "text-gray-500"
                                    }`}>
                                    {d.day}
                                </span>
                                {d.isToday ? (
                                    <div className="size-9 bg-[#102213] text-[#13ec37] rounded-full flex items-center justify-center">
                                        <span className="text-xl font-bold">{d.date}</span>
                                    </div>
                                ) : (
                                    <span className={`text-xl font-bold ${d.isPast ? "text-gray-400" : "text-[#111812] dark:text-white"}`}>
                                        {d.date}
                                    </span>
                                )}
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* Macro Summary Widget */}
                <div className="px-4 pb-4">
                    <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-2xl p-4 shadow-xl shadow-green-500/20">
                        {/* Decorative elements */}
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
                            <span>Protein: <b className="text-white">120g</b></span>
                            <span>Carbs: <b className="text-white">200g</b></span>
                            <span>Fat: <b className="text-white">60g</b></span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Scrollable Content */}
            <main className="flex-1 flex flex-col gap-2 p-4 pt-2">
                {Object.entries(meals).map(([key, meal], index) => (
                    <motion.section
                        key={key}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <div className="flex items-center justify-between py-3">
                            <h2 className="text-[#111812] dark:text-white text-xl font-bold">{meal.title}</h2>
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                                {meal.calories} kcal
                            </span>
                        </div>

                        {meal.recipe ? (
                            <Link href={`/recipe/${meal.recipe.id}`}>
                                <motion.div
                                    className="relative group active:scale-[0.99] transition-transform duration-200"
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="flex items-center justify-between gap-4 rounded-[2rem] bg-white dark:bg-[#1C261E] p-3 pr-5 shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="relative size-20 shrink-0 rounded-full overflow-hidden">
                                            <Image
                                                src={meal.recipe.image}
                                                alt={meal.recipe.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1 flex-1 min-w-0">
                                            <p className="text-[#111812] dark:text-white text-base font-bold leading-tight truncate">
                                                {meal.recipe.title}
                                            </p>
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
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
                                        <div className="text-gray-300 dark:text-gray-600 cursor-grab">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <circle cx="9" cy="5" r="1.5" />
                                                <circle cx="15" cy="5" r="1.5" />
                                                <circle cx="9" cy="12" r="1.5" />
                                                <circle cx="15" cy="12" r="1.5" />
                                                <circle cx="9" cy="19" r="1.5" />
                                                <circle cx="15" cy="19" r="1.5" />
                                            </svg>
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        ) : (
                            <motion.button
                                className="w-full h-24 rounded-[2rem] border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center gap-2 group hover:border-[#13ec37] hover:bg-[#13ec37]/5 transition-all"
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                            >
                                <div className="size-8 rounded-full bg-[#13ec37]/20 flex items-center justify-center text-[#13ec37] group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <span className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-[#13ec37] transition-colors">
                                    Add {meal.title}
                                </span>
                            </motion.button>
                        )}
                    </motion.section>
                ))}
            </main>

            {/* Floating Action Button */}
            <motion.div
                className="fixed bottom-6 right-6 z-40"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
            >
                <motion.button
                    className="flex items-center justify-center size-16 rounded-full bg-[#13ec37] shadow-[0_4px_20px_rgba(19,236,55,0.4)] text-[#102213] hover:scale-110 active:scale-95 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z" />
                    </svg>
                </motion.button>
            </motion.div>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
