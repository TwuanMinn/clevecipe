"use client";

import { motion } from "framer-motion";

interface CategoryFilterProps {
    categories: Array<{ id: string; label: string }>;
    selectedCategory: string;
    onCategoryChange: (id: string) => void;
}

export function CategoryFilter({ categories, selectedCategory, onCategoryChange }: CategoryFilterProps) {
    return (
        <div className="sticky top-[88px] z-30 bg-gradient-to-b from-emerald-50/95 to-green-50/95 dark:from-[#102213]/95 dark:to-[#0d1f14]/95 backdrop-blur-sm py-2">
            <div className="flex gap-3 overflow-x-auto px-6 pb-2 no-scrollbar">
                {categories.map((category, index) => (
                    <motion.button
                        key={category.id}
                        onClick={() => onCategoryChange(category.id)}
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
    );
}
