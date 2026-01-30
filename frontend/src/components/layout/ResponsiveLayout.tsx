"use client";

import * as React from "react";
import Link from "next/link";
import { ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { BottomNav } from "@/components/ui/Navigation";

interface ResponsiveLayoutProps {
    children: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a1f0d] dark:via-[#102213] dark:to-[#0d1f14]">
            {/* Floating Logo - Top Left */}
            <Link href="/" className="fixed top-4 left-4 z-50">
                <motion.div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/90 dark:bg-[#111812]/90 backdrop-blur-lg shadow-lg shadow-black/10"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md shadow-green-500/20">
                        <ChefHat className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg font-bold text-[#111812] dark:text-white hidden sm:block">Clevcipe</span>
                </motion.div>
            </Link>

            {/* Main Content */}
            <main className="min-h-screen pt-16">
                <div className="mx-auto max-w-6xl px-4 lg:px-8 py-6 pb-24">
                    {children}
                </div>
            </main>

            {/* Shared Bottom Navigation */}
            <BottomNav />
        </div>
    );
}
