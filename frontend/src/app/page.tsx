"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

// Demo data
const demoRecipes = [
    {
        id: "1",
        title: "Avocado & Poached Egg Toast",
        image_url: "/images/recipes/avocado-toast.png",
        prep_time: 15,
        calories: 350,
        match_percentage: 98,
        is_primary_match: true,
    },
    {
        id: "2",
        title: "Superfood Quinoa Power Bowl",
        image_url: "/images/recipes/quinoa-bowl.png",
        prep_time: 25,
        calories: 420,
        match_percentage: 92,
        is_primary_match: false,
    },
    {
        id: "3",
        title: "Zucchini Noodles with Pesto",
        image_url: "/images/recipes/zucchini-pesto.png",
        prep_time: 20,
        calories: 210,
        match_percentage: 88,
        is_primary_match: false,
    },
    {
        id: "4",
        title: "Honey Garlic Glazed Salmon",
        image_url: "/images/recipes/honey-salmon.png",
        prep_time: 25,
        calories: 420,
        match_percentage: 95,
        is_primary_match: true,
    },
    {
        id: "5",
        title: "Creamy Chickpea Curry",
        image_url: "/images/recipes/chickpea-curry.png",
        prep_time: 35,
        calories: 340,
        match_percentage: 90,
        is_primary_match: false,
    },
    {
        id: "6",
        title: "Fresh Greek Salad",
        image_url: "/images/recipes/greek-salad.png",
        prep_time: 15,
        calories: 280,
        match_percentage: 87,
        is_primary_match: false,
    },
    {
        id: "7",
        title: "Herb Grilled Chicken",
        image_url: "/images/recipes/grilled-chicken.png",
        prep_time: 30,
        calories: 380,
        match_percentage: 94,
        is_primary_match: true,
    },
    {
        id: "8",
        title: "Berry Smoothie Bowl",
        image_url: "/images/recipes/berry-smoothie.png",
        prep_time: 10,
        calories: 290,
        match_percentage: 85,
        is_primary_match: false,
    },
    {
        id: "9",
        title: "Asian Shrimp Stir Fry",
        image_url: "/images/recipes/shrimp-stir-fry.png",
        prep_time: 20,
        calories: 310,
        match_percentage: 89,
        is_primary_match: false,
    },
    {
        id: "10",
        title: "Rainbow Buddha Bowl",
        image_url: "/images/recipes/buddha-bowl.png",
        prep_time: 25,
        calories: 360,
        match_percentage: 91,
        is_primary_match: false,
    },
    {
        id: "11",
        title: "Overnight Oats with Berries",
        image_url: "/images/recipes/overnight-oats.png",
        prep_time: 5,
        calories: 320,
        match_percentage: 86,
        is_primary_match: false,
    },
    {
        id: "12",
        title: "Turkey Stuffed Peppers",
        image_url: "/images/recipes/stuffed-peppers.png",
        prep_time: 45,
        calories: 390,
        match_percentage: 93,
        is_primary_match: true,
    },
    {
        id: "13",
        title: "Hawaiian Tuna Poke Bowl",
        image_url: "/images/recipes/tuna-poke.png",
        prep_time: 15,
        calories: 340,
        match_percentage: 88,
        is_primary_match: false,
    },
];

const categories = [
    { id: "for-you", label: "For You" },
    { id: "breakfast", label: "Breakfast" },
    { id: "high-protein", label: "High Protein" },
    { id: "under-30m", label: "Under 30m" },
    { id: "vegan", label: "Vegan" },
];

export default function HomePage() {
    const [selectedCategory, setSelectedCategory] = useState("for-you");

    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden pb-24 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14]">
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

            {/* Sticky Header */}
            <motion.header
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="sticky top-0 z-40 flex items-center justify-between p-6 pb-2 bg-[#f6f8f6]/80 dark:bg-[#102213]/80 backdrop-blur-md"
            >
                <div className="flex items-center gap-3">
                    <div className="relative group cursor-pointer">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-12 ring-2 ring-white dark:ring-[#1a2e1d] shadow-sm"
                            style={{ backgroundImage: `url('/images/avatar.jpg')` }}
                        >
                            {/* Fallback avatar */}
                            <div className="w-full h-full rounded-full bg-[#13ec37]/20 flex items-center justify-center text-[#13ec37] font-bold text-lg">
                                S
                            </div>
                        </div>
                        <div className="absolute bottom-0 right-0 size-3 bg-[#13ec37] rounded-full border-2 border-white dark:border-[#102213]" />
                    </div>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        href="/search"
                        className="flex items-center justify-center size-12 rounded-full bg-white dark:bg-[#1a2e1d] text-[#111812] dark:text-white shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </Link>
                </motion.div>
            </motion.header>

            {/* Greeting Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="relative z-10 px-6 pt-4 pb-2"
            >
                <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#111812] dark:text-white">
                    Good Morning,<br />Sarah! ☀️
                </h1>
                <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">
                    You&apos;re <span className="text-[#13ec37] font-bold">600 kcal</span> away from your goal.
                </p>
            </motion.div>

            {/* Dashboard Stats */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="relative z-10 px-4 py-4"
            >
                <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-3xl p-6 shadow-xl shadow-green-500/20">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative flex items-center justify-between">
                        {/* Circular Progress */}
                        <div className="relative size-32 flex-shrink-0 bg-white rounded-full p-1 shadow-lg">
                            <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                                <defs>
                                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#a7f3d0" />
                                        <stop offset="50%" stopColor="#34d399" />
                                        <stop offset="100%" stopColor="#10b981" />
                                    </linearGradient>
                                </defs>
                                <circle
                                    className="text-gray-100"
                                    cx="50" cy="50" r="42"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                />
                                <motion.circle
                                    cx="50" cy="50" r="42"
                                    fill="transparent"
                                    stroke="url(#progressGradient)"
                                    strokeWidth="10"
                                    strokeLinecap="round"
                                    strokeDasharray="264"
                                    initial={{ strokeDashoffset: 264 }}
                                    animate={{ strokeDashoffset: 79 }}
                                    transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute top-0 left-0 flex size-full flex-col items-center justify-center text-center">
                                <span className="text-xs font-bold text-gray-400">Left</span>
                                <motion.span
                                    className="text-2xl font-extrabold text-[#111812]"
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.7, type: "spring" }}
                                >
                                    600
                                </motion.span>
                                <span className="text-xs font-medium text-gray-400">kcal</span>
                            </div>
                        </div>

                        {/* Macro Pills */}
                        <div className="flex flex-col gap-3 flex-1 pl-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-white text-lg">Daily Macros</h3>
                                <motion.span
                                    className="text-xs text-emerald-900 font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.8, type: "spring" }}
                                >
                                    ✨ On Track
                                </motion.span>
                            </div>

                            {/* Protein */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-white/80">Protein</span>
                                    <span className="font-bold text-white">80g left</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="h-full bg-white rounded-full shadow-sm"
                                        initial={{ width: 0 }}
                                        animate={{ width: "65%" }}
                                        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>

                            {/* Carbs */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-white/80">Carbs</span>
                                    <span className="font-bold text-white">120g left</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="h-full bg-white rounded-full shadow-sm"
                                        initial={{ width: 0 }}
                                        animate={{ width: "40%" }}
                                        transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>

                            {/* Fat */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="font-medium text-white/80">Fat</span>
                                    <span className="font-bold text-white">40g left</span>
                                </div>
                                <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                                    <motion.div
                                        className="h-full bg-white rounded-full shadow-sm"
                                        initial={{ width: 0 }}
                                        animate={{ width: "55%" }}
                                        transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Filter Chips */}
            <div className="sticky top-[88px] z-30 bg-gradient-to-b from-emerald-50/95 to-green-50/95 dark:from-[#102213]/95 dark:to-[#0d1f14]/95 backdrop-blur-sm py-2">
                <div className="flex gap-3 overflow-x-auto px-6 pb-2 no-scrollbar">
                    {categories.map((category, index) => (
                        <motion.button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`shrink-0 rounded-full px-6 py-2.5 text-sm font-bold transition-all active:scale-95 ${selectedCategory === category.id
                                ? "bg-[#111812] text-white shadow-lg shadow-[#13ec37]/20"
                                : "bg-white dark:bg-[#1a2e1d] border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }`}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category.label}
                        </motion.button>
                    ))}
                </div>
            </div>

            {/* Recipe Feed */}
            <motion.div
                className="grid grid-cols-2 gap-5 px-4 pt-2 pb-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {
                    demoRecipes.map((recipe) => (
                        <motion.div
                            key={recipe.id}
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

                                        {/* Save Button */}
                                        <motion.button
                                            className="absolute right-2 top-2 flex size-8 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white transition-colors hover:bg-white hover:text-red-500"
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                            </svg>
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
                    ))
                }
            </motion.div >

            {/* Bottom Navigation */}
            <BottomNav />
        </div >
    );
}
