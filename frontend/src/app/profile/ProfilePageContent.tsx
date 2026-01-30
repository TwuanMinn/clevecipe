"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Settings,
    User,
    Heart,
    LogOut,
    ChevronRight,
    Edit3,
    Shield,
    Bell,
    HelpCircle,
    Moon,
} from "lucide-react";
import { NutritionRing } from "@/components/ui";
import { ResponsiveLayout } from "@/components/layout";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/lib/auth-context";
import { usePreferencesStore, useRecipeHistoryStore } from "@/lib/stores";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

const _menuItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: index * 0.05,
            type: "spring",
            stiffness: 400,
            damping: 25
        }
    })
};

export default function ProfilePageContent() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === "dark";
    const { user: authUser, profile, signOut, loading: _loading } = useAuth();
    const { dailyCalorieTarget } = usePreferencesStore();
    const { favorites } = useRecipeHistoryStore();

    // Use auth data - no fake fallbacks
    const user = {
        name: profile?.name || authUser?.email?.split("@")[0] || "Guest",
        email: authUser?.email || null,
        avatar_url: profile?.avatar_url,
        joinedDate: authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "—",
    };

    // Daily nutrition - based on actual tracked meals
    const dailyNutrition = {
        calories: { current: 0, target: dailyCalorieTarget || 2000 },
        protein: { current: 0, target: 150 },
        carbs: { current: 0, target: 250 },
        fat: { current: 0, target: 65 },
    };

    // Menu items configuration
    const menuItems = [
        { icon: Edit3, label: "Edit Profile", href: "/profile/edit", hoverColor: "hover:text-emerald-600" },
        { icon: Heart, label: "Favorite Recipes", href: "/favorites", hoverColor: "hover:text-pink-500", badge: favorites.length > 0 ? favorites.length : undefined },
        { icon: Bell, label: "Notifications", href: "/profile/notifications", hoverColor: "hover:text-amber-500" },
        { icon: Shield, label: "Privacy & Security", href: "/profile/privacy", hoverColor: "hover:text-blue-500" },
        { icon: Settings, label: "Settings", href: "/profile/settings", hoverColor: "hover:text-slate-600 dark:hover:text-slate-400" },
        { icon: HelpCircle, label: "Help & Support", href: "/help", hoverColor: "hover:text-purple-500" },
    ];

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    return (
        <ResponsiveLayout>
            <motion.div
                className="space-y-6 pb-24"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Header Card */}
                <motion.div
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-6 text-white shadow-xl"
                    variants={itemVariants}
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white" />
                        <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white" />
                        <div className="absolute bottom-10 right-10 h-20 w-20 rounded-full bg-white" />
                    </div>

                    <div className="relative flex items-center gap-4">
                        {/* Profile Image with animated ring */}
                        <motion.div
                            className="relative"
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 17 }}
                        >
                            <div className="absolute -inset-1 rounded-full bg-white/30 animate-pulse" />
                            <div className="relative h-20 w-20 rounded-full border-3 border-white/50 overflow-hidden bg-gradient-to-br from-emerald-300 to-teal-400 flex items-center justify-center">
                                {user.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt={user.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="w-10 h-10 text-white/80" />
                                )}
                            </div>
                            <motion.button
                                onClick={() => router.push("/profile/edit")}
                                className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-lg"
                                whileHover={{ scale: 1.1, rotate: 15 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <Edit3 className="w-3.5 h-3.5 text-emerald-600" />
                            </motion.button>
                        </motion.div>

                        {/* User Info */}
                        <div className="flex-1">
                            <h1 className="text-xl font-bold">{user.name}</h1>
                            {user.email && (
                                <p className="text-sm text-white/80">{user.email}</p>
                            )}
                            <p className="text-xs text-white/60 mt-1">
                                Member since {user.joinedDate}
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <motion.div
                        className="relative mt-5 flex justify-around rounded-2xl bg-white/10 backdrop-blur-sm p-4"
                        variants={itemVariants}
                    >
                        <div className="text-center">
                            <motion.p
                                className="text-2xl font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.3, type: "spring", stiffness: 500 }}
                            >
                                {favorites.length}
                            </motion.p>
                            <p className="text-xs text-white/70">Favorites</p>
                        </div>
                        <div className="w-px bg-white/20" />
                        <div className="text-center">
                            <motion.p
                                className="text-2xl font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.4, type: "spring", stiffness: 500 }}
                            >
                                0
                            </motion.p>
                            <p className="text-xs text-white/70">Recipes</p>
                        </div>
                        <div className="w-px bg-white/20" />
                        <div className="text-center">
                            <motion.p
                                className="text-2xl font-bold"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 500 }}
                            >
                                0
                            </motion.p>
                            <p className="text-xs text-white/70">Streak</p>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Daily Progress Card */}
                <motion.div
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 dark:border-white/10"
                    variants={itemVariants}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white">Today&apos;s Progress</h2>
                        <Link
                            href="/insights"
                            className="text-sm text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                        >
                            See Details
                        </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-3">
                        <div className="flex flex-col items-center">
                            <NutritionRing
                                value={dailyNutrition.calories.current}
                                max={dailyNutrition.calories.target}
                                color="calories"
                                label="Cal"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <NutritionRing
                                value={dailyNutrition.protein.current}
                                max={dailyNutrition.protein.target}
                                color="protein"
                                label="Protein"
                                unit="g"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <NutritionRing
                                value={dailyNutrition.carbs.current}
                                max={dailyNutrition.carbs.target}
                                color="carbs"
                                label="Carbs"
                                unit="g"
                            />
                        </div>
                        <div className="flex flex-col items-center">
                            <NutritionRing
                                value={dailyNutrition.fat.current}
                                max={dailyNutrition.fat.target}
                                color="fat"
                                label="Fat"
                                unit="g"
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div
                    className="flex gap-3"
                    variants={itemVariants}
                >
                    <motion.button
                        onClick={toggleTheme}
                        className="flex-1 flex items-center justify-center gap-2 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/50 dark:border-white/10"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            animate={{ rotate: isDarkMode ? 180 : 0 }}
                            transition={{ type: "spring", stiffness: 200 }}
                        >
                            <Moon className={`w-5 h-5 ${isDarkMode ? "text-yellow-400" : "text-slate-600"}`} />
                        </motion.div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                            {isDarkMode ? "Light Mode" : "Dark Mode"}
                        </span>
                    </motion.button>
                </motion.div>

                {/* Menu Items */}
                <motion.div
                    className="space-y-3"
                    variants={containerVariants}
                >
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Account</h3>
                    <motion.div
                        className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-white/10 overflow-hidden"
                        variants={itemVariants}
                    >
                        {menuItems.map((item, _index) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.label}
                                    href={item.href}
                                    className={`w-full flex items-center gap-4 p-4 transition-all border-b border-gray-100/50 dark:border-gray-800/50 last:border-b-0 ${item.hoverColor} dark:hover:bg-white/5 group hover:bg-gray-50`}
                                >
                                    <motion.div
                                        className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center"
                                        whileHover={{ rotate: [0, -10, 10, 0] }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:scale-110 transition-transform" />
                                    </motion.div>
                                    <span className="flex-1 font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
                                    {item.badge && (
                                        <motion.span
                                            className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded-full"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 500 }}
                                        >
                                            {item.badge}
                                        </motion.span>
                                    )}
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            );
                        })}
                    </motion.div>
                </motion.div>

                {/* Logout Button */}
                <motion.div variants={itemVariants}>
                    <motion.button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 font-medium py-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <motion.div
                            whileHover={{ x: -3 }}
                        >
                            <LogOut className="w-5 h-5" />
                        </motion.div>
                        Log Out
                    </motion.button>
                </motion.div>
            </motion.div>
        </ResponsiveLayout>
    );
}
