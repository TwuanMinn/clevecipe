"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface NutritionRingProps {
    value: number;
    max: number;
    size?: "sm" | "md" | "lg";
    color?: "calories" | "protein" | "carbs" | "fat" | "primary";
    label?: string;
    unit?: string;
    showPercentage?: boolean;
    className?: string;
}

const sizeConfig = {
    sm: { width: 60, strokeWidth: 4, fontSize: "text-sm", labelSize: "text-xs" },
    md: { width: 80, strokeWidth: 5, fontSize: "text-lg", labelSize: "text-xs" },
    lg: { width: 120, strokeWidth: 6, fontSize: "text-2xl", labelSize: "text-sm" },
};

const colorConfig = {
    calories: "stroke-primary",
    protein: "stroke-blue-500",
    carbs: "stroke-orange-500",
    fat: "stroke-purple-500",
    primary: "stroke-primary",
};

export function NutritionRing({
    value,
    max,
    size = "md",
    color = "primary",
    label,
    unit,
    showPercentage = false,
    className,
}: NutritionRingProps) {
    const config = sizeConfig[size];
    const percentage = Math.min((value / max) * 100, 100);
    const radius = (config.width - config.strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className={cn("relative inline-flex items-center justify-center", className)}>
            <svg
                width={config.width}
                height={config.width}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={config.width / 2}
                    cy={config.width / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={config.strokeWidth}
                    className="stroke-muted"
                />
                {/* Progress circle */}
                <circle
                    cx={config.width / 2}
                    cy={config.width / 2}
                    r={radius}
                    fill="none"
                    strokeWidth={config.strokeWidth}
                    strokeLinecap="round"
                    className={cn("transition-all duration-700 ease-out", colorConfig[color])}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: strokeDashoffset,
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn("font-semibold", config.fontSize)}>
                    {showPercentage ? `${Math.round(percentage)}%` : value}
                </span>
                {(label || unit) && (
                    <span className={cn("text-muted-foreground", config.labelSize)}>
                        {label || unit}
                    </span>
                )}
            </div>
        </div>
    );
}

// Compact version for nutrition info display
interface NutritionCircleProps {
    value: number;
    label: string;
    color?: "calories" | "protein" | "carbs" | "fat";
    className?: string;
}

export function NutritionCircle({
    value,
    label,
    color = "calories",
    className,
}: NutritionCircleProps) {
    const bgColorConfig = {
        calories: "bg-primary/10 text-primary",
        protein: "bg-blue-500/10 text-blue-600",
        carbs: "bg-orange-500/10 text-orange-600",
        fat: "bg-purple-500/10 text-purple-600",
    };

    return (
        <div className={cn("flex flex-col items-center gap-1", className)}>
            <div
                className={cn(
                    "w-14 h-14 rounded-full flex items-center justify-center",
                    bgColorConfig[color]
                )}
            >
                <span className="text-sm font-semibold">{value}</span>
            </div>
            <span className="text-xs text-muted-foreground capitalize">{label}</span>
        </div>
    );
}
