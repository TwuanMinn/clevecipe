"use client";

import { motion } from "framer-motion";

export function DashboardStats() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10 px-4 py-4"
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-green-500 to-teal-500 rounded-3xl p-6 shadow-xl shadow-green-500/20">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative flex items-center justify-between">
                    {/* Circular Progress */}
                    <div className="relative size-32 flex-shrink-0 bg-white rounded-full p-1 shadow-lg">
                        <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                            <defs>
                                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#a7f3d0" />
                                    <stop offset="50%" stopColor="#34d399" />
                                    <stop offset="100%" stopColor="#10b981" />
                                </linearGradient>
                            </defs>
                            <circle
                                className="text-gray-100"
                                cx="50" cy="50" r="42"
                                fill="transparent"
                                stroke="currentColor"
                                strokeWidth="10"
                            />
                            <motion.circle
                                cx="50" cy="50" r="42"
                                fill="transparent"
                                stroke="url(#progressGradient)"
                                strokeWidth="10"
                                strokeLinecap="round"
                                strokeDasharray="264"
                                initial={{ strokeDashoffset: 264 }}
                                animate={{ strokeDashoffset: 79 }}
                                transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
                            />
                        </svg>
                        <div className="absolute top-0 left-0 flex size-full flex-col items-center justify-center text-center">
                            <span className="text-xs font-bold text-gray-400">Left</span>
                            <motion.span
                                className="text-2xl font-extrabold text-[#111812]"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.7, type: "spring" }}
                            >
                                600
                            </motion.span>
                            <span className="text-xs font-medium text-gray-400">kcal</span>
                        </div>
                    </div>

                    {/* Macro Pills */}
                    <div className="flex flex-col gap-3 flex-1 pl-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-white text-lg">Daily Macros</h3>
                            <motion.span
                                className="text-xs text-emerald-900 font-bold bg-white/90 px-3 py-1 rounded-full shadow-sm"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.8, type: "spring" }}
                            >
                                ✨ On Track
                            </motion.span>
                        </div>

                        {/* Protein */}
                        <MacroBar label="Protein" amount="80g left" percentage={65} delay={0.4} />

                        {/* Carbs */}
                        <MacroBar label="Carbs" amount="120g left" percentage={40} delay={0.5} />

                        {/* Fat */}
                        <MacroBar label="Fat" amount="40g left" percentage={55} delay={0.6} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface MacroBarProps {
    label: string;
    amount: string;
    percentage: number;
    delay: number;
}

function MacroBar({ label, amount, percentage, delay }: MacroBarProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay }}
        >
            <div className="flex justify-between text-sm mb-1">
                <span className="font-medium text-white/80">{label}</span>
                <span className="font-bold text-white">{amount}</span>
            </div>
            <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                <motion.div
                    className="h-full bg-white rounded-full shadow-sm"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, delay: delay + 0.1, ease: "easeOut" }}
                />
            </div>
        </motion.div>
    );
}
