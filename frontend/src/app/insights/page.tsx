"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Plus, ChevronRight } from "lucide-react";
import { BottomNav } from "@/components/ui";

// Demo meal suggestions
const mealSuggestions = [
    {
        id: "1",
        title: "Avocado Toast & Egg",
        image: "/images/recipes/avocado-toast.png",
        tag: "High Protein",
        description: "Perfect for your 12g fat goal",
    },
    {
        id: "2",
        title: "Quinoa Power Bowl",
        image: "/images/recipes/quinoa-bowl.png",
        tag: "Balanced",
        description: "Hits your carb target perfectly",
    },
    {
        id: "3",
        title: "Grilled Salmon",
        image: "/images/recipes/honey-salmon.png",
        tag: "Low Carb",
        description: "Omega-3 boost",
    },
];

// Weekly adherence data
const weeklyData = [
    { day: "M", value: 40, isToday: false },
    { day: "T", value: 65, isToday: false },
    { day: "W", value: 100, isToday: true },
    { day: "T", value: 30, isToday: false },
    { day: "F", value: 85, isToday: false },
    { day: "S", value: 50, isToday: false },
    { day: "S", value: 10, isToday: false },
];

export default function InsightsPage() {
    const [timeframe, setTimeframe] = useState<"week" | "month">("week");

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Header */}
            <motion.header
                className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 backdrop-blur-md px-6 py-5"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">Your Progress</h2>
                    <div className="size-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg shadow-green-500/25 flex items-center justify-center text-white font-bold">
                        S
                    </div>
                </div>
            </motion.header>

            {/* Segmented Control */}
            <div className="px-6 pb-4 relative z-10">
                <div className="flex h-12 w-full items-center justify-center rounded-full bg-white/80 backdrop-blur-sm p-1 shadow-sm border border-white/50">
                    <button
                        onClick={() => setTimeframe("week")}
                        className={`flex h-full grow items-center justify-center rounded-full px-4 text-sm font-medium transition-all duration-200 ${timeframe === "week"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-md"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        This Week
                    </button>
                    <button
                        onClick={() => setTimeframe("month")}
                        className={`flex h-full grow items-center justify-center rounded-full px-4 text-sm font-medium transition-all duration-200 ${timeframe === "month"
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-md"
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
                <div className="flex flex-col gap-4 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-white/50">
                    <div className="flex justify-between items-end">
                        <div className="flex flex-col gap-1">
                            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Weekly Adherence</p>
                            <p className="text-4xl font-extrabold tracking-tighter text-gray-900">85%</p>
                        </div>
                        <div className="flex items-center gap-1 bg-green-100 px-3 py-1.5 rounded-full">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <p className="text-green-700 text-xs font-bold">+5% vs last week</p>
                        </div>
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
                                        style={{ height: `${item.value}%`, opacity: item.value < 20 ? 0.3 : 1 }}
                                    />
                                </div>
                                <p className={`text-xs font-bold ${item.isToday ? "text-gray-900" : "text-gray-400"}`}>
                                    {item.day}
                                </p>
                            </motion.div>
                        ))}
                    </div>
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
                <div className="flex flex-col gap-6 rounded-2xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-white/50">
                    <div className="flex flex-row items-center justify-between gap-6">
                        {/* Donut Chart */}
                        <div className="relative flex items-center justify-center size-32 shrink-0">
                            <div
                                className="absolute inset-0 rounded-full"
                                style={{
                                    background: "conic-gradient(#22c55e 0% 35%, #10b981 35% 60%, #34d399 60% 85%, #e5e7eb 85% 100%)",
                                }}
                            />
                            <div className="absolute inset-2 rounded-full bg-white flex flex-col items-center justify-center z-10">
                                <span className="text-xs text-gray-400 font-medium">Left</span>
                                <span className="text-xl font-bold text-gray-900">420</span>
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
                                <span className="text-sm font-bold text-gray-400">45g</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-semibold text-gray-700">Carbs</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400">120g</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-full bg-green-300" />
                                    <span className="text-sm font-semibold text-gray-700">Fats</span>
                                </div>
                                <span className="text-sm font-bold text-gray-400">32g</span>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bars */}
                    <div className="flex flex-col gap-4 border-t border-gray-100 pt-4">
                        {/* Protein Bar */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-bold tracking-wide">
                                <span className="text-gray-400 uppercase">Protein Remaining</span>
                                <span className="text-gray-900">28g left</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-green-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "65%" }}
                                    transition={{ delay: 0.3, duration: 0.8 }}
                                />
                            </div>
                        </div>

                        {/* Carbs Bar */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-bold tracking-wide">
                                <span className="text-gray-400 uppercase">Carbs Remaining</span>
                                <span className="text-gray-900">85g left</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-emerald-500 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "40%" }}
                                    transition={{ delay: 0.4, duration: 0.8 }}
                                />
                            </div>
                        </div>

                        {/* Fats Bar */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-xs font-bold tracking-wide">
                                <span className="text-gray-400 uppercase">Fats Remaining</span>
                                <span className="text-gray-900">12g left</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-green-300 rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: "75%" }}
                                    transition={{ delay: 0.5, duration: 0.8 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Meal Suggestions Section */}
            <div className="flex flex-col pt-4 pb-8 relative z-10">
                <div className="flex items-center justify-between px-6 pb-4">
                    <h3 className="text-lg font-bold tracking-tight text-gray-900">For Tomorrow</h3>
                    <button className="flex items-center gap-1 text-sm font-bold text-green-600 hover:text-green-700 transition-colors">
                        See all
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex overflow-x-auto gap-4 px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
                    {mealSuggestions.map((meal, index) => (
                        <motion.div
                            key={meal.id}
                            className="snap-center min-w-[260px] flex flex-col gap-3 rounded-2xl bg-white/80 backdrop-blur-sm p-3 shadow-lg border border-white/50 group cursor-pointer hover:border-green-300 transition-all"
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

            {/* Floating Action Button */}
            <motion.button
                className="fixed bottom-24 right-6 size-14 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 flex items-center justify-center z-30"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
            >
                <Plus className="w-7 h-7" />
            </motion.button>

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
