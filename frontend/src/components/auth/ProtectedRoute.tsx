"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth-context";

interface ProtectedRouteProps {
    children: React.ReactNode;
    redirectTo?: string;
}

export function ProtectedRoute({ children, redirectTo = "/login" }: ProtectedRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209]">
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return <>{children}</>;
}

// HOC version for use with pages
export function withAuth<P extends object>(
    Component: React.ComponentType<P>,
    redirectTo?: string
) {
    return function AuthenticatedComponent(props: P) {
        return (
            <ProtectedRoute redirectTo={redirectTo}>
                <Component {...props} />
            </ProtectedRoute>
        );
    };
}
