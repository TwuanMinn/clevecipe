"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    Utensils,
    Coffee,
    Sun,
    Moon,
    Flame,
    Target,
    TrendingUp,
    X,
    Trash2,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { BottomNav, NutritionRing } from "@/components/ui";
import { useNutritionLogStore, usePreferencesStore, NutritionEntry } from "@/lib/stores";

const MEAL_TYPES = [
    { id: "breakfast", label: "Breakfast", icon: Coffee, color: "text-orange-500 bg-orange-100 dark:bg-orange-900/30" },
    { id: "lunch", label: "Lunch", icon: Sun, color: "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30" },
    { id: "dinner", label: "Dinner", icon: Moon, color: "text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30" },
    { id: "snack", label: "Snack", icon: Utensils, color: "text-pink-500 bg-pink-100 dark:bg-pink-900/30" },
];

export default function NutritionLogPage() {
    const { entries, addEntry, removeEntry, getDailyTotals } = useNutritionLogStore();
    const { dailyCalorieTarget } = usePreferencesStore();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>("lunch");
    const [newEntry, setNewEntry] = useState({ name: "", calories: "", protein: "", carbs: "", fat: "" });

    const dailyTotals = getDailyTotals(selectedDate);
    const dayEntries = entries.filter(e => e.date === selectedDate);

    const navigateDate = (direction: number) => {
        const date = new Date(selectedDate);
        date.setDate(date.getDate() + direction);
        setSelectedDate(date.toISOString().split("T")[0]);
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

        if (dateStr === today) return "Today";
        if (dateStr === yesterday) return "Yesterday";
        return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    const handleAddEntry = () => {
        if (newEntry.name && newEntry.calories) {
            addEntry({
                date: selectedDate,
                mealType: selectedMealType,
                name: newEntry.name,
                calories: parseInt(newEntry.calories) || 0,
                protein: parseInt(newEntry.protein) || 0,
                carbs: parseInt(newEntry.carbs) || 0,
                fat: parseInt(newEntry.fat) || 0,
            });
            setNewEntry({ name: "", calories: "", protein: "", carbs: "", fat: "" });
            setShowAddModal(false);
        }
    };

    const groupedEntries = MEAL_TYPES.reduce((acc, meal) => {
        acc[meal.id] = dayEntries.filter(e => e.mealType === meal.id);
        return acc;
    }, {} as Record<string, NutritionEntry[]>);

    const calorieProgress = dailyCalorieTarget > 0 ? (dailyTotals.calories / dailyCalorieTarget) * 100 : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-[#0a0f0b]/90 dark:via-[#0d1610]/90 dark:to-[#0a1209]/90 backdrop-blur-md px-6 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nutrition Log</h1>
                    <motion.button
                        onClick={() => setShowAddModal(true)}
                        className="p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus className="w-5 h-5" />
                    </motion.button>
                </div>

                {/* Date Selector */}
                <div className="flex items-center justify-between mt-4">
                    <motion.button
                        onClick={() => navigateDate(-1)}
                        className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10"
                        whileTap={{ scale: 0.95 }}
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                    <span className="font-semibold text-gray-800 dark:text-white">{formatDate(selectedDate)}</span>
                    <motion.button
                        onClick={() => navigateDate(1)}
                        className="p-2 rounded-lg hover:bg-white/50 dark:hover:bg-white/10"
                        whileTap={{ scale: 0.95 }}
                        disabled={selectedDate === new Date().toISOString().split("T")[0]}
                    >
                        <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </motion.button>
                </div>
            </header>

            <div className="px-4 py-4 space-y-4">
                {/* Daily Summary Card */}
                <motion.div
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 dark:border-white/10"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-6">
                        <NutritionRing
                            value={dailyTotals.calories}
                            max={dailyCalorieTarget}
                            size="lg"
                            color="calories"
                            label="cal"
                        />
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Flame className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Calories</span>
                                </div>
                                <span className="font-bold text-gray-900 dark:text-white">
                                    {dailyTotals.calories} / {dailyCalorieTarget}
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${calorieProgress > 100 ? "bg-red-500" : "bg-gradient-to-r from-green-500 to-emerald-500"}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                                    <span className="text-gray-600 dark:text-gray-400">P: {dailyTotals.protein}g</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-amber-500" />
                                    <span className="text-gray-600 dark:text-gray-400">C: {dailyTotals.carbs}g</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-pink-500" />
                                    <span className="text-gray-600 dark:text-gray-400">F: {dailyTotals.fat}g</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Macro Progress Bars */}
                <div className="grid grid-cols-3 gap-3">
                    {[
                        { label: "Protein", value: dailyTotals.protein, target: 100, color: "bg-blue-500", unit: "g" },
                        { label: "Carbs", value: dailyTotals.carbs, target: 250, color: "bg-amber-500", unit: "g" },
                        { label: "Fat", value: dailyTotals.fat, target: 65, color: "bg-pink-500", unit: "g" },
                    ].map((macro) => (
                        <motion.div
                            key={macro.label}
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-3 shadow-md border border-white/50 dark:border-white/10"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{macro.label}</div>
                            <div className="font-bold text-gray-900 dark:text-white text-lg">
                                {macro.value}{macro.unit}
                            </div>
                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mt-2 overflow-hidden">
                                <motion.div
                                    className={`h-full ${macro.color}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((macro.value / macro.target) * 100, 100)}%` }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Meal Sections */}
                {MEAL_TYPES.map((meal) => {
                    const mealEntries = groupedEntries[meal.id] || [];
                    const Icon = meal.icon;
                    const mealCalories = mealEntries.reduce((sum, e) => sum + e.calories, 0);

                    return (
                        <motion.div
                            key={meal.id}
                            className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-white/10 overflow-hidden"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${meal.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800 dark:text-white">{meal.label}</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {mealCalories} cal
                                        </p>
                                    </div>
                                </div>
                                <motion.button
                                    onClick={() => {
                                        setSelectedMealType(meal.id as 'breakfast' | 'lunch' | 'dinner' | 'snack');
                                        setShowAddModal(true);
                                    }}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                </motion.button>
                            </div>

                            {mealEntries.length > 0 ? (
                                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {mealEntries.map((entry) => (
                                        <div key={entry.id} className="flex items-center justify-between p-4">
                                            <div>
                                                <p className="font-medium text-gray-800 dark:text-white">{entry.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {entry.calories} cal • P: {entry.protein}g • C: {entry.carbs}g • F: {entry.fat}g
                                                </p>
                                            </div>
                                            <motion.button
                                                onClick={() => removeEntry(entry.id)}
                                                className="p-2 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </motion.button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-400 dark:text-gray-500 text-sm">
                                    No entries yet
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Add Entry Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-t-3xl p-6"
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Log Food</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Meal Type Selector */}
                            <div className="flex gap-2 mb-4">
                                {MEAL_TYPES.map((meal) => {
                                    const Icon = meal.icon;
                                    return (
                                        <button
                                            key={meal.id}
                                            onClick={() => setSelectedMealType(meal.id as 'breakfast' | 'lunch' | 'dinner' | 'snack')}
                                            className={`flex-1 py-2 rounded-xl flex flex-col items-center gap-1 transition-all ${selectedMealType === meal.id
                                                    ? "bg-green-500 text-white"
                                                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-xs font-medium">{meal.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Food name"
                                    value={newEntry.name}
                                    onChange={e => setNewEntry(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                    autoFocus
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Calories</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newEntry.calories}
                                            onChange={e => setNewEntry(prev => ({ ...prev, calories: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Protein (g)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newEntry.protein}
                                            onChange={e => setNewEntry(prev => ({ ...prev, protein: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Carbs (g)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newEntry.carbs}
                                            onChange={e => setNewEntry(prev => ({ ...prev, carbs: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Fat (g)</label>
                                        <input
                                            type="number"
                                            placeholder="0"
                                            value={newEntry.fat}
                                            onChange={e => setNewEntry(prev => ({ ...prev, fat: e.target.value }))}
                                            className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleAddEntry}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Target className="w-5 h-5 inline mr-2" />
                                    Log Entry
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <BottomNav />
        </div>
    );
}
