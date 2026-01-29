"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Calendar, User, Sparkles, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

const navItems: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    { href: "/search", label: "Search", icon: Search },
    { href: "/plan", label: "Plan", icon: Calendar },
    { href: "/insights", label: "Insights", icon: BarChart3 },
    { href: "/profile", label: "Profile", icon: User },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <motion.nav
            className="fixed bottom-4 sm:bottom-6 left-4 right-4 sm:left-6 sm:right-6 z-50 mx-auto max-w-lg rounded-2xl sm:rounded-3xl bg-[#111812] px-2 sm:px-4 py-2.5 sm:py-3 shadow-2xl shadow-black/30 backdrop-blur-lg"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
            {/* Subtle glow effect */}
            <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-gradient-to-t from-[#13ec37]/5 to-transparent pointer-events-none" />

            <div className="relative flex items-center justify-around">
                {navItems.map((item, index) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative flex flex-col items-center justify-center"
                        >
                            <motion.div
                                className={cn(
                                    "relative flex flex-col items-center gap-0.5 sm:gap-1 py-1.5 sm:py-2 px-2.5 sm:px-4 rounded-xl transition-colors",
                                    isActive
                                        ? "text-[#13ec37]"
                                        : "text-slate-400 hover:text-white"
                                )}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: index * 0.05, type: "spring", stiffness: 400 }}
                            >
                                {/* Active background glow */}
                                {isActive && (
                                    <motion.div
                                        className="absolute inset-0 bg-[#13ec37]/20 rounded-xl"
                                        layoutId="activeTab"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                                    />
                                )}

                                {/* Icon with bounce */}
                                <motion.div
                                    className="relative z-10"
                                    animate={isActive ? {
                                        y: [0, -3, 0],
                                        scale: [1, 1.15, 1]
                                    } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />

                                    {/* Active glow dot */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute -top-0.5 -right-0.5 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-[#13ec37] rounded-full"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.1, type: "spring" }}
                                        >
                                            <motion.div
                                                className="absolute inset-0 bg-[#13ec37] rounded-full"
                                                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.span
                                    className="relative z-10 text-[9px] sm:text-[11px] font-bold"
                                    animate={isActive ? { fontWeight: 800 } : { fontWeight: 700 }}
                                >
                                    {item.label}
                                </motion.span>
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </motion.nav>
    );
}

// Floating Action Button with animation
interface FABProps {
    onClick?: () => void;
    icon?: React.ReactNode;
    label?: string;
    className?: string;
}

export function FloatingActionButton({
    onClick,
    icon,
    label,
    className,
}: FABProps) {
    return (
        <motion.button
            onClick={onClick}
            className={cn(
                "fixed bottom-24 right-4 md:bottom-6 md:right-6",
                "flex items-center gap-2 px-5 py-3.5 rounded-full",
                "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl shadow-green-500/25",
                "hover:shadow-2xl hover:shadow-green-500/30 transition-shadow duration-300",
                "focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
                className
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
            {icon || <Sparkles className="w-5 h-5" />}
            {label && <span className="font-semibold">{label}</span>}
        </motion.button>
    );
}

// Top Navigation Bar with animation
interface TopNavProps {
    title?: string;
    showBack?: boolean;
    showSearch?: boolean;
    showSettings?: boolean;
    onBack?: () => void;
    onSearch?: () => void;
    onSettings?: () => void;
    leftContent?: React.ReactNode;
    rightContent?: React.ReactNode;
    className?: string;
}

export function TopNav({
    title,
    showBack = false,
    showSearch = false,
    showSettings = false,
    onBack,
    onSearch,
    onSettings,
    leftContent,
    rightContent,
    className,
}: TopNavProps) {
    return (
        <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
                "sticky top-0 z-40 bg-white/95 backdrop-blur-lg",
                "border-b border-gray-100",
                className
            )}
        >
            <div className="container flex items-center justify-between h-14 px-4">
                {/* Left */}
                <div className="flex items-center gap-3">
                    {showBack && (
                        <motion.button
                            onClick={onBack}
                            className="p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </motion.button>
                    )}
                    {leftContent}
                    {title && (
                        <motion.h1
                            className="text-lg font-semibold text-gray-900"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            {title}
                        </motion.h1>
                    )}
                </div>

                {/* Right */}
                <div className="flex items-center gap-2">
                    {showSearch && (
                        <motion.button
                            onClick={onSearch}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <Search className="w-5 h-5 text-gray-700" />
                        </motion.button>
                    )}
                    {showSettings && (
                        <motion.button
                            onClick={onSettings}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </motion.button>
                    )}
                    {rightContent}
                </div>
            </div>
        </motion.header>
    );
}

// User Avatar with greeting and animation
interface UserGreetingProps {
    name: string;
    avatarUrl?: string;
    subtitle?: string;
    onAvatarClick?: () => void;
    className?: string;
}

export function UserGreeting({
    name,
    avatarUrl,
    subtitle,
    onAvatarClick,
    className,
}: UserGreetingProps) {
    // Get greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    const getEmoji = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "🌤";
        if (hour < 17) return "☀️";
        return "🌙";
    };

    return (
        <motion.div
            className={cn("flex items-center gap-3", className)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
        >
            <motion.button
                onClick={onAvatarClick}
                className="relative w-11 h-11 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 ring-2 ring-green-500/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-100 text-green-600 font-bold text-lg">
                        {name.charAt(0).toUpperCase()}
                    </div>
                )}
            </motion.button>
            <div>
                <motion.h1
                    className="font-bold text-lg text-gray-900"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    {getGreeting()}, {name.split(" ")[0]}! {getEmoji()}
                </motion.h1>
                {subtitle && (
                    <motion.p
                        className="text-sm text-green-600 font-medium"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        {subtitle}
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
}
