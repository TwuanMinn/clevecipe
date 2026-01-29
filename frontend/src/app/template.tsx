"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// Page transition variants
const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.99,
        transition: {
            duration: 0.2,
            ease: "easeIn",
        },
    },
};

export default function Template({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={pageVariants}
                className="min-h-screen"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}
