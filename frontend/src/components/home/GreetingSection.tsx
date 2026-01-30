"use client";

import { motion } from "framer-motion";

interface GreetingSectionProps {
    name: string;
    caloriesRemaining: number;
}

export function GreetingSection({ name, caloriesRemaining }: GreetingSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative z-10 px-6 pt-4 pb-2"
        >
            <h1 className="text-3xl font-bold leading-tight tracking-tight text-[#111812] dark:text-white">
                Good Morning,<br />{name}! ☀️
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500 dark:text-slate-400">
                You&apos;re <span className="text-[#13ec37] font-bold">{caloriesRemaining} kcal</span> away from your goal.
            </p>
        </motion.div>
    );
}
