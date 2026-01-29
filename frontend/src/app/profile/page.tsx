"use client";

import { useRouter } from "next/navigation";
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
    Sun,
} from "lucide-react";
import { BottomNav, NutritionRing } from "@/components/ui";
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

const menuItemVariants = {
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

export default function ProfilePage() {
    const router = useRouter();
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = theme === "dark";
    const { user: authUser, profile, signOut, loading } = useAuth();
    const { dailyCalorieTarget } = usePreferencesStore();
    const { favorites } = useRecipeHistoryStore();

    // Use auth data or fallback to demo data
    const user = {
        name: profile?.name || authUser?.email?.split("@")[0] || "User",
        email: authUser?.email || "user@example.com",
        avatar_url: profile?.avatar_url,
        joinedDate: authUser?.created_at ? new Date(authUser.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" }) : "Recently",
        recipesGenerated: 42,
        favoriteRecipes: favorites.length,
        mealsPlanned: 156,
    };

    // Nutrition stats - uses user preferences
    const weeklyStats = {
        avgCalories: 1850,
        targetCalories: dailyCalorieTarget,
        avgProtein: 95,
        mealsLogged: 21,
    };

    const handleLogout = async () => {
        await signOut();
        router.push("/login");
    };

    const menuItems = [
        {
            icon: User,
            label: "Edit Profile",
            href: "/profile/edit",
            color: "bg-blue-100 text-blue-600",
            hoverColor: "hover:bg-blue-50",
        },
        {
            icon: Settings,
            label: "Dietary Preferences",
            href: "/onboarding",
            color: "bg-purple-100 text-purple-600",
            hoverColor: "hover:bg-purple-50",
        },
        {
            icon: Heart,
            label: "Favorite Recipes",
            href: "/favorites",
            color: "bg-pink-100 text-pink-600",
            hoverColor: "hover:bg-pink-50",
        },
        {
            icon: Bell,
            label: "Notifications",
            href: "/profile/notifications",
            color: "bg-orange-100 text-orange-600",
            hoverColor: "hover:bg-orange-50",
        },
        {
            icon: Shield,
            label: "Privacy & Security",
            href: "/profile/privacy",
            color: "bg-green-100 text-green-600",
            hoverColor: "hover:bg-green-50",
        },
        {
            icon: HelpCircle,
            label: "Help & Support",
            href: "/profile/help",
            color: "bg-cyan-100 text-cyan-600",
            hoverColor: "hover:bg-cyan-50",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24 transition-colors duration-300">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/40 dark:bg-emerald-900/30 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-200/30 dark:bg-green-900/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                    className="absolute bottom-1/4 right-10 w-64 h-64 bg-teal-200/30 dark:bg-teal-900/20 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, 20, 0]
                    }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                />
            </div>

            {/* Header */}
            <motion.header
                className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-[#0a0f0b]/90 dark:via-[#0d1610]/90 dark:to-[#0a1209]/90 backdrop-blur-md px-6 py-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
            >
                <div className="flex items-center justify-between">
                    <motion.h2
                        className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Profile
                    </motion.h2>
                    <motion.button
                        onClick={() => router.push("/profile/settings")}
                        className="p-2.5 rounded-xl bg-white/80 dark:bg-white/10 shadow-sm hover:bg-white dark:hover:bg-white/20 hover:shadow-md transition-all"
                        whileHover={{ scale: 1.05, rotate: 15 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                    >
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </motion.button>
                </div>
            </motion.header>

            <motion.div
                className="relative z-10 px-4 py-4 space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Profile Card with Gradient */}
                <motion.div
                    className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-3xl p-6 shadow-xl shadow-green-500/25 text-center"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                >
                    {/* Decorative elements with animation */}
                    <motion.div
                        className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 3, repeat: Infinity }}
                    />
                    <motion.div
                        className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"
                        animate={{ scale: [1.2, 1, 1.2] }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />

                    {/* Avatar */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <motion.div
                            className="w-full h-full rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-4 border-white/30 shadow-lg"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            whileHover={{ scale: 1.1 }}
                        >
                            <span className="text-3xl font-bold text-white">
                                {user.name.charAt(0)}
                            </span>
                        </motion.div>
                        <motion.button
                            className="absolute bottom-0 right-0 p-2 bg-white rounded-full text-green-600 shadow-lg"
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: "spring" }}
                        >
                            <Edit3 className="w-4 h-4" />
                        </motion.button>
                    </div>

                    <motion.h2
                        className="text-2xl font-bold text-white"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        {user.name}
                    </motion.h2>
                    <motion.p
                        className="text-sm text-white/80"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        {user.email}
                    </motion.p>
                    <motion.p
                        className="text-xs text-white/60 mt-1"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                    >
                        Member since {user.joinedDate}
                    </motion.p>

                    {/* Quick Stats with Counter Animation */}
                    <div className="flex items-center justify-around mt-6 pt-6 border-t border-white/20">
                        {[
                            { value: user.recipesGenerated, label: "Recipes" },
                            { value: user.favoriteRecipes, label: "Favorites" },
                            { value: user.mealsPlanned, label: "Meals" },
                        ].map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 + index * 0.1 }}
                            >
                                <motion.p
                                    className="text-3xl font-bold text-white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.7 + index * 0.1, type: "spring" }}
                                >
                                    {stat.value}
                                </motion.p>
                                <p className="text-xs text-white/70 font-medium">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Weekly Progress - Glassmorphism Card */}
                <motion.div
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-5 shadow-lg border border-white/50 dark:border-white/10"
                    variants={itemVariants}
                    whileHover={{ scale: 1.01 }}
                >
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <motion.span
                            className="text-lg"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        >
                            📊
                        </motion.span>
                        This Week&apos;s Progress
                    </h3>

                    <div className="flex items-center gap-6">
                        <NutritionRing
                            value={weeklyStats.avgCalories}
                            max={weeklyStats.targetCalories}
                            size="lg"
                            color="calories"
                            label="avg/day"
                        />

                        <div className="flex-1 space-y-3">
                            {[
                                { label: "Avg Protein", value: `${weeklyStats.avgProtein}g` },
                                { label: "Meals Logged", value: weeklyStats.mealsLogged },
                            ].map((item, index) => (
                                <motion.div
                                    key={item.label}
                                    className="flex items-center justify-between"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + index * 0.1 }}
                                >
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.label}</span>
                                    <span className="font-bold text-green-600">{item.value}</span>
                                </motion.div>
                            ))}
                            <motion.div
                                className="flex items-center justify-between"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <span className="text-sm text-gray-500 dark:text-gray-400">Goal Status</span>
                                <motion.span
                                    className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full shadow-sm"
                                    whileHover={{ scale: 1.1 }}
                                    animate={{ boxShadow: ["0 0 0 0 rgba(34,197,94,0.4)", "0 0 0 8px rgba(34,197,94,0)", "0 0 0 0 rgba(34,197,94,0)"] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                >
                                    ✨ On Track
                                </motion.span>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Menu Items - With Colorful Icons and Animations */}
                <motion.div
                    className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-white/10 overflow-hidden"
                    variants={itemVariants}
                >
                    {menuItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <motion.button
                                key={item.label}
                                custom={index}
                                variants={menuItemVariants}
                                onClick={() => router.push(item.href)}
                                className={`w-full flex items-center gap-4 p-4 transition-all border-b border-gray-100/50 dark:border-gray-800/50 last:border-b-0 ${item.hoverColor} dark:hover:bg-white/5 group`}
                                whileHover={{ x: 8, backgroundColor: "rgba(249, 250, 251, 0.8)" }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <motion.div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} transition-transform`}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                >
                                    <Icon className="w-5 h-5" />
                                </motion.div>
                                <span className="flex-1 text-left font-semibold text-gray-800 dark:text-gray-100 group-hover:text-gray-900 dark:group-hover:text-white">
                                    {item.label}
                                </span>
                                <motion.div
                                    initial={{ x: 0 }}
                                    whileHover={{ x: 5 }}
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                                </motion.div>
                            </motion.button>
                        );
                    })}

                    {/* Dark Mode Toggle */}
                    <motion.div
                        className="flex items-center gap-4 p-4"
                        custom={menuItems.length}
                        variants={menuItemVariants}
                    >
                        <motion.div
                            className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center"
                            whileHover={{ scale: 1.15, rotate: -5 }}
                        >
                            <Moon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        </motion.div>
                        <span className="flex-1 font-semibold text-gray-800 dark:text-gray-100">Dark Mode</span>
                        <motion.button
                            onClick={toggleTheme}
                            className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${isDarkMode
                                ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                : "bg-gray-200"
                                }`}
                            whileTap={{ scale: 0.95 }}
                        >
                            <motion.div
                                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center"
                                animate={{
                                    left: isDarkMode ? 28 : 4,
                                    rotate: isDarkMode ? 360 : 0
                                }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            >
                                {isDarkMode && <span className="text-xs">🌙</span>}
                            </motion.div>
                        </motion.button>
                    </motion.div>
                </motion.div>

                {/* Logout Button */}
                <motion.button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-red-200 text-red-500 font-bold hover:bg-red-50 transition-colors"
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, borderColor: "#ef4444" }}
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

            {/* Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
