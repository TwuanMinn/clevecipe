"use client";

import { motion, Variants, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

// Animation variants for common use cases
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.3 }
    }
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export const fadeInDown: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

export const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

export const slideInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    }
};

// Stagger children animation
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

export const staggerItem: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, ease: "easeOut" }
    }
};

// Card hover animation
export const cardHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
};

// Button hover animation
export const buttonHover = {
    rest: { scale: 1 },
    hover: {
        scale: 1.05,
        transition: { duration: 0.2, ease: "easeOut" }
    },
    tap: { scale: 0.95 }
};

// Page transition variants
export const pageTransition: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" }
    },
    exit: {
        opacity: 0,
        y: -20,
        transition: { duration: 0.3 }
    }
};

// Animated components
interface AnimatedDivProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    delay?: number;
}

export function FadeIn({ children, delay = 0, ...props }: AnimatedDivProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function FadeInUp({ children, delay = 0, ...props }: AnimatedDivProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function ScaleIn({ children, delay = 0, ...props }: AnimatedDivProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay, ease: "easeOut" }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggerContainer({ children, ...props }: AnimatedDivProps) {
    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            {...props}
        >
            {children}
        </motion.div>
    );
}

export function StaggerItem({ children, ...props }: AnimatedDivProps) {
    return (
        <motion.div
            variants={staggerItem}
            {...props}
        >
            {children}
        </motion.div>
    );
}

// Re-export motion for convenience
export { motion };
