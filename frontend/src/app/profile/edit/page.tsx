"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Check, User, Mail, FileText, Calendar } from "lucide-react";
import { BottomNav } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";

export default function EditProfilePage() {
    const router = useRouter();
    const { user: authUser, profile } = useAuth();
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Ensure component is mounted before rendering to avoid hydration issues
    useEffect(() => {
        setMounted(true);
    }, []);

    // Form state - initialized from auth context (no hard-coded defaults)
    const [formData, setFormData] = useState({
        name: profile?.name || authUser?.email?.split("@")[0] || "",
        email: authUser?.email || "",
        bio: "",
        birthDate: "",
        phone: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSaving(false);
        setSaveSuccess(true);

        // Reset success state after animation
        setTimeout(() => {
            setSaveSuccess(false);
            router.push("/profile");
        }, 1000);
    };

    // Show loading skeleton until mounted to prevent hydration mismatch
    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24">
                <div className="animate-pulse p-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
                    <div className="h-28 w-28 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-6" />
                    <div className="space-y-4">
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24 relative">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/3 -left-40 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-[#0a0f0b]/90 dark:via-[#0d1610]/90 dark:to-[#0a1209]/90 backdrop-blur-md px-4 py-4">
                <div className="flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/80 dark:bg-white/10 shadow-sm hover:bg-white dark:hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-xl font-bold text-sm shadow-sm transition-all ${saveSuccess
                            ? "bg-green-500 text-white"
                            : "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-md"
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : saveSuccess ? (
                            <Check className="w-5 h-5" />
                        ) : (
                            "Save"
                        )}
                    </button>
                </div>
            </header>

            <div className="relative z-10 px-4 py-6 space-y-6">
                {/* Avatar Section */}
                <div className="flex flex-col items-center animate-scale-in">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                            <span className="text-4xl font-bold text-white">
                                {formData.name.charAt(0)}
                            </span>
                        </div>
                        <button
                            className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform"
                        >
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">Tap to change photo</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4 animate-slide-up">
                    {/* Name Field */}
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50 dark:border-white/10">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-500"
                            placeholder="Enter your name"
                        />
                    </div>

                    {/* Email Field */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                            <Mail className="w-4 h-4 text-purple-500" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-500"
                            placeholder="Enter your email"
                        />
                    </div>

                    {/* Bio Field */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                            <FileText className="w-4 h-4 text-pink-500" />
                            Bio
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => handleInputChange("bio", e.target.value)}
                            rows={3}
                            className="w-full text-base text-gray-900 dark:text-white bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-500 resize-none"
                            placeholder="Tell us about yourself..."
                        />
                        <p className="text-xs text-gray-400 mt-1">{formData.bio.length}/150 characters</p>
                    </div>

                    {/* Birth Date Field */}
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/50">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-500 mb-2">
                            <Calendar className="w-4 h-4 text-orange-500" />
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            value={formData.birthDate}
                            onChange={(e) => handleInputChange("birthDate", e.target.value)}
                            className="w-full text-lg font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none"
                        />
                    </div>
                </div>

                {/* Delete Account */}
                <div className="pt-6">
                    <button className="w-full py-3 text-red-500 text-sm font-semibold hover:bg-red-50 rounded-xl transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
