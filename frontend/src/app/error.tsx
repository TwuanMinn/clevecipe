"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Application error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] p-4">
            <motion.div
                className="text-center max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <motion.div
                    className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                >
                    <AlertTriangle className="w-10 h-10 text-red-500" />
                </motion.div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Something went wrong!
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                    We encountered an unexpected error. Please try again.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <motion.button
                        onClick={reset}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <RefreshCw className="w-5 h-5" />
                        Try Again
                    </motion.button>

                    <Link href="/">
                        <motion.button
                            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </motion.button>
                    </Link>
                </div>

                {error.digest && (
                    <p className="mt-6 text-xs text-gray-400 dark:text-gray-500">
                        Error ID: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
