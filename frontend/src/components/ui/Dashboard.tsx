"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface MacroCardProps {
    caloriesConsumed: number;
    caloriesTarget: number;
    proteinLeft?: number;
    carbsLeft?: number;
    fatLeft?: number;
    isOnTrack?: boolean;
    className?: string;
}

export function MacroCard({
    caloriesConsumed,
    caloriesTarget,
    proteinLeft,
    carbsLeft,
    fatLeft,
    isOnTrack = true,
    className,
}: MacroCardProps) {
    const caloriesLeft = caloriesTarget - caloriesConsumed;
    const percentage = Math.min(100, (caloriesConsumed / caloriesTarget) * 100);
    const circumference = 2 * Math.PI * 42; // radius of 42
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            className={cn(
                "bg-gray-900 rounded-3xl p-5",
                "flex items-center gap-5",
                className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
        >
            {/* Calorie Ring - with animated stroke */}
            <div className="relative flex-shrink-0">
                <svg width="100" height="100" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                    />
                    {/* Progress circle - animated */}
                    <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: strokeDashoffset }}
                        transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                    />
                </svg>
                {/* Center text - animated count */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <motion.span
                        className="text-2xl font-bold"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    >
                        {caloriesLeft}
                    </motion.span>
                    <span className="text-xs text-gray-400">Left</span>
                </div>
            </div>

            {/* Macro Info - right side with stagger */}
            <motion.div
                className="flex-1 space-y-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-white text-lg">Daily Macros</h3>
                    {isOnTrack !== undefined && (
                        <motion.span
                            className={cn(
                                "text-xs font-medium px-2.5 py-1 rounded-full",
                                isOnTrack
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                            )}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: "spring", stiffness: 500 }}
                        >
                            {isOnTrack ? "On Track" : "Off Track"}
                        </motion.span>
                    )}
                </div>

                <div className="space-y-1.5">
                    {proteinLeft !== undefined && (
                        <motion.div
                            className="flex items-center justify-between text-sm"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <span className="text-gray-400">Protein</span>
                            <span className="text-white font-medium">{proteinLeft}g left</span>
                        </motion.div>
                    )}
                    {carbsLeft !== undefined && (
                        <motion.div
                            className="flex items-center justify-between text-sm"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <span className="text-gray-400">Carbs</span>
                            <span className="text-white font-medium">{carbsLeft}g left</span>
                        </motion.div>
                    )}
                    {fatLeft !== undefined && (
                        <motion.div
                            className="flex items-center justify-between text-sm"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <span className="text-gray-400">Fat</span>
                            <span className="text-white font-medium">{fatLeft}g left</span>
                        </motion.div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// Category Filter Chips with animation
interface CategoryChip {
    id: string;
    label: string;
}

interface CategoryFilterProps {
    categories: CategoryChip[];
    selectedId: string;
    onSelect: (id: string) => void;
    className?: string;
}

export function CategoryFilter({
    categories,
    selectedId,
    onSelect,
    className,
}: CategoryFilterProps) {
    return (
        <motion.div
            className={cn(
                "flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4",
                className
            )}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            {categories.map((category, index) => (
                <motion.button
                    key={category.id}
                    onClick={() => onSelect(category.id)}
                    className={cn(
                        "relative px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
                        "transition-colors duration-200 border",
                        selectedId === category.id
                            ? "bg-gray-900 text-white border-gray-900"
                            : "bg-white text-gray-700 border-gray-200 hover:border-gray-300"
                    )}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {category.label}

                    {/* Animated selection indicator */}
                    {selectedId === category.id && (
                        <motion.div
                            className="absolute inset-0 bg-gray-900 rounded-full -z-10"
                            layoutId="categoryBg"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                </motion.button>
            ))}
        </motion.div>
    );
}

// Loading State with cooking animation
interface CookingLoaderProps {
    message?: string;
    className?: string;
}

export function CookingLoader({ message, className }: CookingLoaderProps) {
    const messages = [
        "Crafting your recipe...",
        "Adding flavors...",
        "Measuring ingredients...",
        "Almost ready...",
    ];

    const [currentMessage, setCurrentMessage] = React.useState(message || messages[0]);
    const [messageIndex, setMessageIndex] = React.useState(0);

    React.useEffect(() => {
        if (message) return;

        const interval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [message]);

    React.useEffect(() => {
        if (!message) {
            setCurrentMessage(messages[messageIndex]);
        }
    }, [messageIndex, message]);

    return (
        <motion.div
            className={cn("flex flex-col items-center gap-6 py-16", className)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Animated cooking pot */}
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 64 64"
                    fill="none"
                    className="text-green-500"
                >
                    {/* Pot */}
                    <path
                        d="M12 28h40v24c0 4.418-3.582 8-8 8H20c-4.418 0-8-3.582-8-8V28z"
                        fill="currentColor"
                        opacity="0.2"
                    />
                    <path
                        d="M8 24h48v4H8v-4z"
                        fill="currentColor"
                    />
                    <path
                        d="M12 28h40v24c0 4.418-3.582 8-8 8H20c-4.418 0-8-3.582-8-8V28z"
                        stroke="currentColor"
                        strokeWidth="2"
                        fill="none"
                    />
                </svg>

                {/* Animated steam */}
                <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                >
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-4 bg-green-300 rounded-full"
                            animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.3
                            }}
                        />
                    ))}
                </motion.div>
            </motion.div>

            <AnimatePresence mode="wait">
                <motion.p
                    key={currentMessage}
                    className="text-gray-500 font-medium text-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {currentMessage}
                </motion.p>
            </AnimatePresence>
        </motion.div>
    );
}

// Empty State with animation
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) {
    return (
        <motion.div
            className={cn(
                "flex flex-col items-center justify-center py-16 px-4 text-center",
                className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
        >
            {icon && (
                <motion.div
                    className="mb-4 text-gray-300"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                >
                    {icon}
                </motion.div>
            )}
            <motion.h3
                className="text-lg font-semibold text-gray-900"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h3>
            {description && (
                <motion.p
                    className="mt-2 text-sm text-gray-500 max-w-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    {description}
                </motion.p>
            )}
            {action && (
                <motion.button
                    onClick={action.onClick}
                    className="mt-6 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 transition-colors"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    );
}

// Serving Selector with smooth transitions
interface ServingSelectorProps {
    value: number;
    options?: number[];
    onChange: (value: number) => void;
    className?: string;
}

export function ServingSelector({
    value,
    options = [1, 2, 4],
    onChange,
    className,
}: ServingSelectorProps) {
    return (
        <div className={cn("inline-flex rounded-xl bg-gray-100 p-1", className)}>
            {options.map((option) => (
                <motion.button
                    key={option}
                    onClick={() => onChange(option)}
                    className={cn(
                        "relative px-4 py-2 text-sm font-semibold rounded-lg transition-colors",
                        value === option
                            ? "text-white"
                            : "text-gray-600 hover:text-gray-900"
                    )}
                    whileHover={{ scale: value === option ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {value === option && (
                        <motion.div
                            className="absolute inset-0 bg-green-500 rounded-lg -z-10"
                            layoutId="servingBg"
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                    )}
                    {option} Serv
                </motion.button>
            ))}
        </div>
    );
}
