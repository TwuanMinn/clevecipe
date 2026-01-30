"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Clock, Flame, Search, Trash2, X } from "lucide-react";
import { ResponsiveLayout } from "@/components/layout";
import { useRecipeHistoryStore } from "@/lib/stores";

export default function FavoritesPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [deleteMode, setDeleteMode] = useState(false);

    // Get favorites from the store (persisted in localStorage)
    const { favorites: storedFavorites, removeFromFavorites } = useRecipeHistoryStore();

    // Transform store data to match the expected format
    const favorites = useMemo(() => {
        return storedFavorites.map(recipe => ({
            id: recipe.id,
            title: recipe.name,
            image_url: recipe.image || "/images/recipes/default.png",
            prep_time: recipe.cookTime || 20,
            calories: recipe.calories,
            savedAt: new Date(recipe.savedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            }),
        }));
    }, [storedFavorites]);

    const filteredFavorites = favorites.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleRemoveFromFavorites = (id: string) => {
        removeFromFavorites(id);
    };

    return (
        <ResponsiveLayout>
            <div className="relative">
                {/* Animated background blobs */}
                <div className="absolute top-0 left-0 w-full h-[400px] overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>

                {/* Header */}
                <motion.header
                    className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 backdrop-blur-md px-4 py-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => router.back()}
                                className="p-2 rounded-xl bg-white/80 shadow-sm hover:bg-white transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <h2 className="text-lg font-bold text-gray-900">Favorite Recipes</h2>
                        </div>
                        <button
                            onClick={() => setDeleteMode(!deleteMode)}
                            className={`p-2 rounded-xl transition-colors ${deleteMode
                                ? "bg-red-100 text-red-600"
                                : "bg-white/80 text-gray-600 hover:bg-white"
                                }`}
                        >
                            {deleteMode ? <X className="w-5 h-5" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                    </div>
                </motion.header>

                <div className="relative z-10 px-4 py-4 space-y-4">
                    {/* Stats Banner */}
                    <motion.div
                        className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-4 shadow-lg shadow-pink-500/20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl">
                                    <Heart className="w-6 h-6 text-white" fill="white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white text-lg">{favorites.length}</h3>
                                    <p className="text-sm text-white/80">Saved Recipes</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-white">
                                    {Math.round(favorites.reduce((acc, r) => acc + r.calories, 0) / favorites.length)}
                                </p>
                                <p className="text-xs text-white/70">Avg. Calories</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Search */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search favorites..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/50 outline-none focus:ring-2 focus:ring-pink-500/20 transition-all"
                        />
                    </motion.div>

                    {/* Favorites Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        <AnimatePresence>
                            {filteredFavorites.map((recipe, index) => (
                                <motion.div
                                    key={recipe.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                                    transition={{ delay: 0.1 + index * 0.05 }}
                                    className="relative"
                                >
                                    <Link href={`/recipe/${recipe.id}`}>
                                        <div className="flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 shadow-sm border border-white/50 hover:shadow-md transition-shadow">
                                            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                                <Image
                                                    src={recipe.image_url}
                                                    alt={recipe.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate">{recipe.title}</h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Clock className="w-3 h-3 text-green-500" />
                                                        {recipe.prep_time}m
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-gray-500">
                                                        <Flame className="w-3 h-3 text-orange-500" />
                                                        {recipe.calories} kcal
                                                    </div>
                                                </div>
                                                <p className="text-xs text-gray-400 mt-1">Saved {recipe.savedAt}</p>
                                            </div>
                                            <Heart className="w-5 h-5 text-pink-500 shrink-0" fill="currentColor" />
                                        </div>
                                    </Link>

                                    {/* Delete overlay */}
                                    <AnimatePresence>
                                        {deleteMode && (
                                            <motion.button
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                onClick={() => handleRemoveFromFavorites(recipe.id)}
                                                className="absolute top-2 right-2 p-2 bg-red-500 rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                                            >
                                                <X className="w-4 h-4" />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty State */}
                    {filteredFavorites.length === 0 && (
                        <motion.div
                            className="flex flex-col items-center justify-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="w-20 h-20 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                                <Heart className="w-10 h-10 text-pink-400" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-lg">No favorites yet</h3>
                            <p className="text-sm text-gray-500 text-center mt-1">
                                {searchQuery
                                    ? "No recipes match your search"
                                    : "Start saving recipes you love!"
                                }
                            </p>
                            <Link
                                href="/search"
                                className="mt-4 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-pink-500/25 hover:scale-105 transition-transform"
                            >
                                Discover Recipes
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </ResponsiveLayout>
    );
}
