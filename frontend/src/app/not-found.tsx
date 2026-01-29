"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] p-4">
            {/* Background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/40 dark:bg-emerald-900/30 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-20 -left-40 w-96 h-96 bg-emerald-200/30 dark:bg-green-900/20 rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
                    transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                />
            </div>

            <motion.div
                className="relative z-10 text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className="text-8xl font-bold bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                >
                    404
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Page Not Found
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    The recipe you&apos;re looking for seems to have gone missing from our cookbook.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link href="/">
                        <motion.button
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </motion.button>
                    </Link>

                    <Link href="/search">
                        <motion.button
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold w-full sm:w-auto"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Search className="w-5 h-5" />
                            Search Recipes
                        </motion.button>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
