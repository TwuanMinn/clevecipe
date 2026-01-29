"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniRecipeCard } from "./RecipeCard";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

interface Recipe {
    id: string;
    title: string;
    image_url?: string;
    prep_time?: number;
    cook_time?: number;
    nutrition?: {
        calories?: number;
    };
}

interface MealSlotProps {
    mealType: MealType;
    recipe?: Recipe;
    calories?: number;
    onAdd?: () => void;
    onRemove?: () => void;
    onClick?: () => void;
    className?: string;
}

const mealTypeLabels: Record<MealType, string> = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    snack: "Snacks",
};

export function MealSlot({
    mealType,
    recipe,
    calories,
    onAdd,
    onRemove,
    onClick,
    className,
}: MealSlotProps) {
    return (
        <div className={cn("space-y-3", className)}>
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                    {mealTypeLabels[mealType]}
                </h3>
                {calories !== undefined && (
                    <span className="text-sm text-muted-foreground">{calories} kcal</span>
                )}
            </div>

            {/* Content */}
            {recipe ? (
                <div onClick={onClick} className="cursor-pointer">
                    <MiniRecipeCard recipe={recipe} onRemove={onRemove} />
                </div>
            ) : (
                <button
                    onClick={onAdd}
                    className="meal-slot-empty w-full min-h-[80px]"
                >
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">Add {mealTypeLabels[mealType]}</span>
                </button>
            )}
        </div>
    );
}

// Day Selector Component
interface DaySelectorProps {
    date: Date;
    isActive?: boolean;
    isToday?: boolean;
    onClick?: () => void;
    className?: string;
}

export function DaySelector({
    date,
    isActive = false,
    isToday = false,
    onClick,
    className,
}: DaySelectorProps) {
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const dayNumber = date.getDate();

    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-200",
                isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted text-foreground",
                className
            )}
        >
            <span className="text-xs font-medium uppercase">{dayName}</span>
            <span
                className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold",
                    isActive ? "bg-primary-foreground/20" : "",
                    isToday && !isActive ? "ring-2 ring-primary" : ""
                )}
            >
                {dayNumber}
            </span>
        </button>
    );
}

// Week Navigation
interface WeekNavigatorProps {
    currentDate: Date;
    onPrevWeek: () => void;
    onNextWeek: () => void;
    onSelectDay: (date: Date) => void;
    selectedDate: Date;
    className?: string;
}

export function WeekNavigator({
    currentDate,
    onPrevWeek,
    onNextWeek,
    onSelectDay,
    selectedDate,
    className,
}: WeekNavigatorProps) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get start of week (Monday)
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    // Generate week days
    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + i);
        return date;
    });

    const monthYear = currentDate.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    return (
        <div className={cn("space-y-4", className)}>
            {/* Month/Year header with navigation */}
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{monthYear}</h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrevWeek}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={onNextWeek}
                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Week days */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto scrollbar-hide">
                {weekDays.map((date) => {
                    const isActive = date.toDateString() === selectedDate.toDateString();
                    const isToday = date.toDateString() === today.toDateString();

                    return (
                        <DaySelector
                            key={date.toISOString()}
                            date={date}
                            isActive={isActive}
                            isToday={isToday}
                            onClick={() => onSelectDay(date)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

// Daily Progress Bar
interface DailyProgressProps {
    consumed: number;
    target: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    className?: string;
}

export function DailyProgress({
    consumed,
    target,
    protein,
    carbs,
    fat,
    className,
}: DailyProgressProps) {
    const percentage = Math.min((consumed / target) * 100, 100);
    const isOnTrack = percentage >= 80 && percentage <= 110;

    return (
        <div className={cn("bg-white rounded-xl p-4 shadow-card", className)}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Calories
                </span>
                <span
                    className={cn(
                        "text-sm font-medium",
                        isOnTrack ? "text-primary" : "text-muted-foreground"
                    )}
                >
                    {Math.round(percentage)}%
                </span>
            </div>

            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-2xl font-bold">{consumed.toLocaleString()}</span>
                <span className="text-muted-foreground">/ {target.toLocaleString()}</span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                <div
                    className={cn(
                        "h-full rounded-full transition-all duration-500",
                        percentage > 100 ? "bg-red-500" : "bg-primary"
                    )}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                />
            </div>

            {/* Macros */}
            {(protein !== undefined || carbs !== undefined || fat !== undefined) && (
                <div className="flex items-center justify-between text-sm">
                    {protein !== undefined && (
                        <span className="text-muted-foreground">
                            P: <span className="font-medium text-foreground">{protein}g</span>
                        </span>
                    )}
                    {carbs !== undefined && (
                        <span className="text-muted-foreground">
                            C: <span className="font-medium text-foreground">{carbs}g</span>
                        </span>
                    )}
                    {fat !== undefined && (
                        <span className="text-muted-foreground">
                            F: <span className="font-medium text-foreground">{fat}g</span>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
