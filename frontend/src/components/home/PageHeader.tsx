"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export function PageHeader() {
    return (
        <motion.header
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-0 z-40 flex items-center justify-between p-6 pb-2 bg-[#f6f8f6]/80 dark:bg-[#102213]/80 backdrop-blur-md"
        >
            <div className="flex items-center gap-3">
                <div className="relative group cursor-pointer">
                    <div
                        className="bg-center bg-no-repeat bg-cover rounded-full size-12 ring-2 ring-white dark:ring-[#1a2e1d] shadow-sm"
                        style={{ backgroundImage: `url('/images/avatar.jpg')` }}
                    >
                        {/* Fallback avatar */}
                        <div className="w-full h-full rounded-full bg-[#13ec37]/20 flex items-center justify-center text-[#13ec37] font-bold text-lg">
                            S
                        </div>
                    </div>
                    <div className="absolute bottom-0 right-0 size-3 bg-[#13ec37] rounded-full border-2 border-white dark:border-[#102213]" />
                </div>
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                    href="/search"
                    className="flex items-center justify-center size-12 rounded-full bg-white dark:bg-[#1a2e1d] text-[#111812] dark:text-white shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-800"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </Link>
            </motion.div>
        </motion.header>
    );
}
