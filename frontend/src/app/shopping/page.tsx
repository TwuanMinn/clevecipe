"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart,
    Plus,
    Trash2,
    Check,
    X,
    ChevronDown,
    ChevronUp,
    Sparkles,
} from "lucide-react";
import { BottomNav } from "@/components/ui";
import { useShoppingListStore, ShoppingItem } from "@/lib/stores";

const CATEGORIES = [
    "Produce",
    "Dairy",
    "Meat & Seafood",
    "Bakery",
    "Pantry",
    "Frozen",
    "Beverages",
    "Other",
];

export default function ShoppingListPage() {
    const { items, addItem, removeItem, toggleItem, clearChecked, clearAll } = useShoppingListStore();
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ name: "", quantity: "", unit: "", category: "Produce" });
    const [expandedCategories, setExpandedCategories] = useState<string[]>(CATEGORIES);

    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {} as Record<string, ShoppingItem[]>);

    const toggleCategory = (category: string) => {
        setExpandedCategories(prev =>
            prev.includes(category)
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const handleAddItem = () => {
        if (newItem.name.trim()) {
            addItem({
                name: newItem.name,
                quantity: newItem.quantity || "1",
                unit: newItem.unit || "item",
                category: newItem.category,
            });
            setNewItem({ name: "", quantity: "", unit: "", category: "Produce" });
            setShowAddModal(false);
        }
    };

    const checkedCount = items.filter(i => i.checked).length;
    const totalCount = items.length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24">
            {/* Header */}
            <header className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-[#0a0f0b]/90 dark:via-[#0d1610]/90 dark:to-[#0a1209]/90 backdrop-blur-md px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shopping List</h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {checkedCount}/{totalCount} items checked
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {checkedCount > 0 && (
                            <motion.button
                                onClick={clearChecked}
                                className="px-3 py-2 rounded-xl bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Clear Done
                            </motion.button>
                        )}
                        <motion.button
                            onClick={() => setShowAddModal(true)}
                            className="p-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-5 h-5" />
                        </motion.button>
                    </div>
                </div>
            </header>

            <div className="px-4 py-4 space-y-4">
                {totalCount === 0 ? (
                    <motion.div
                        className="text-center py-16"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <ShoppingCart className="w-10 h-10 text-green-500" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            Your list is empty
                        </h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6">
                            Add items manually or generate from your meal plan
                        </p>
                        <motion.button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Plus className="w-5 h-5 inline mr-2" />
                            Add First Item
                        </motion.button>
                    </motion.div>
                ) : (
                    <>
                        {/* Progress Bar */}
                        <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 dark:border-white/10">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Progress</span>
                                <span className="text-sm font-bold text-green-600">
                                    {totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0}%
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(checkedCount / totalCount) * 100}%` }}
                                    transition={{ duration: 0.5 }}
                                />
                            </div>
                        </div>

                        {/* Categories */}
                        {CATEGORIES.map(category => {
                            const categoryItems = groupedItems[category];
                            if (!categoryItems?.length) return null;

                            const isExpanded = expandedCategories.includes(category);
                            const checkedInCategory = categoryItems.filter(i => i.checked).length;

                            return (
                                <motion.div
                                    key={category}
                                    className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-white/10 overflow-hidden"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <button
                                        onClick={() => toggleCategory(category)}
                                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50/50 dark:hover:bg-white/5"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg">🛒</span>
                                            <span className="font-semibold text-gray-800 dark:text-white">{category}</span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                ({checkedInCategory}/{categoryItems.length})
                                            </span>
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-5 h-5 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0 }}
                                                animate={{ height: "auto" }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4 space-y-2">
                                                    {categoryItems.map(item => (
                                                        <motion.div
                                                            key={item.id}
                                                            className={`flex items-center gap-3 p-3 rounded-xl ${item.checked
                                                                    ? "bg-green-50 dark:bg-green-900/20"
                                                                    : "bg-gray-50 dark:bg-gray-800/30"
                                                                }`}
                                                            layout
                                                        >
                                                            <motion.button
                                                                onClick={() => toggleItem(item.id)}
                                                                className={`w-6 h-6 rounded-full flex items-center justify-center ${item.checked
                                                                        ? "bg-green-500 text-white"
                                                                        : "border-2 border-gray-300 dark:border-gray-600"
                                                                    }`}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                {item.checked && <Check className="w-4 h-4" />}
                                                            </motion.button>
                                                            <div className="flex-1">
                                                                <span className={`font-medium ${item.checked
                                                                        ? "text-gray-400 line-through"
                                                                        : "text-gray-800 dark:text-white"
                                                                    }`}>
                                                                    {item.name}
                                                                </span>
                                                                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                                                                    {item.quantity} {item.unit}
                                                                </span>
                                                            </div>
                                                            <motion.button
                                                                onClick={() => removeItem(item.id)}
                                                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30"
                                                                whileHover={{ scale: 1.1 }}
                                                                whileTap={{ scale: 0.9 }}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </motion.button>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}

                        {/* Clear All Button */}
                        <motion.button
                            onClick={clearAll}
                            className="w-full py-3 text-center text-red-500 dark:text-red-400 font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Clear All Items
                        </motion.button>
                    </>
                )}
            </div>

            {/* Add Item Modal */}
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
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Item</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    placeholder="Item name"
                                    value={newItem.name}
                                    onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                    autoFocus
                                />

                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        placeholder="Qty"
                                        value={newItem.quantity}
                                        onChange={e => setNewItem(prev => ({ ...prev, quantity: e.target.value }))}
                                        className="w-1/3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Unit (lbs, oz, etc)"
                                        value={newItem.unit}
                                        onChange={e => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                    />
                                </div>

                                <select
                                    value={newItem.category}
                                    onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 border-0 focus:ring-2 focus:ring-green-500"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>

                                <motion.button
                                    onClick={handleAddItem}
                                    className="w-full py-4 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Sparkles className="w-5 h-5 inline mr-2" />
                                    Add to List
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
