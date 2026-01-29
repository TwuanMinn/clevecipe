"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Fingerprint, Trash2, Download, Share2 } from "lucide-react";
import { BottomNav } from "@/components/ui";

export default function PrivacyPage() {
    const router = useRouter();

    const [privacySettings, setPrivacySettings] = useState({
        profileVisible: true,
        showActivity: true,
        shareProgress: false,
        biometricLock: true,
        twoFactorAuth: false,
    });

    const toggleSetting = (key: keyof typeof privacySettings) => {
        setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const securityOptions = [
        {
            icon: Lock,
            title: "Change Password",
            subtitle: "Last changed 30 days ago",
            color: "bg-blue-100 text-blue-600",
            action: () => console.log("Change password"),
        },
        {
            icon: Fingerprint,
            title: "Biometric Login",
            subtitle: privacySettings.biometricLock ? "Enabled" : "Disabled",
            color: "bg-purple-100 text-purple-600",
            toggle: true,
            enabled: privacySettings.biometricLock,
            onToggle: () => toggleSetting("biometricLock"),
        },
        {
            icon: Shield,
            title: "Two-Factor Authentication",
            subtitle: privacySettings.twoFactorAuth ? "Active" : "Not set up",
            color: "bg-green-100 text-green-600",
            toggle: true,
            enabled: privacySettings.twoFactorAuth,
            onToggle: () => toggleSetting("twoFactorAuth"),
        },
    ];

    const dataOptions = [
        {
            icon: Download,
            title: "Download My Data",
            subtitle: "Export all your data as JSON",
            color: "bg-cyan-100 text-cyan-600",
        },
        {
            icon: Trash2,
            title: "Delete All Data",
            subtitle: "Permanently remove all your data",
            color: "bg-red-100 text-red-600",
            danger: true,
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Header */}
            <motion.header
                className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 backdrop-blur-md px-4 py-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/80 shadow-sm hover:bg-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">Privacy & Security</h2>
                </div>
            </motion.header>

            <div className="relative z-10 px-4 py-6 space-y-6">
                {/* Privacy Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Privacy</h3>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        {/* Profile Visibility */}
                        <div className="flex items-center gap-4 p-4 border-b border-gray-100/50">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                {privacySettings.profileVisible ? (
                                    <Eye className="w-5 h-5 text-indigo-600" />
                                ) : (
                                    <EyeOff className="w-5 h-5 text-indigo-600" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">Profile Visibility</h4>
                                <p className="text-xs text-gray-500">Allow others to see your profile</p>
                            </div>
                            <button
                                onClick={() => toggleSetting("profileVisible")}
                                className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${privacySettings.profileVisible
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                        : "bg-gray-200"
                                    }`}
                            >
                                <motion.div
                                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                    animate={{ left: privacySettings.profileVisible ? 28 : 4 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>

                        {/* Show Activity */}
                        <div className="flex items-center gap-4 p-4 border-b border-gray-100/50">
                            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                                <Share2 className="w-5 h-5 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-800">Share Progress</h4>
                                <p className="text-xs text-gray-500">Allow sharing your meal plans</p>
                            </div>
                            <button
                                onClick={() => toggleSetting("shareProgress")}
                                className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${privacySettings.shareProgress
                                        ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                        : "bg-gray-200"
                                    }`}
                            >
                                <motion.div
                                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                    animate={{ left: privacySettings.shareProgress ? 28 : 4 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Security Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Security</h3>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        {securityOptions.map((option, index) => {
                            const Icon = option.icon;
                            return (
                                <div
                                    key={option.title}
                                    className="flex items-center gap-4 p-4 border-b border-gray-100/50 last:border-b-0"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800">{option.title}</h4>
                                        <p className="text-xs text-gray-500">{option.subtitle}</p>
                                    </div>
                                    {option.toggle ? (
                                        <button
                                            onClick={option.onToggle}
                                            className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${option.enabled
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                                    : "bg-gray-200"
                                                }`}
                                        >
                                            <motion.div
                                                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                                animate={{ left: option.enabled ? 28 : 4 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                            />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={option.action}
                                            className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors"
                                        >
                                            Change
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </motion.div>

                {/* Data Management */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">Your Data</h3>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                        {dataOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.title}
                                    className="w-full flex items-center gap-4 p-4 border-b border-gray-100/50 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <h4 className={`font-semibold ${option.danger ? "text-red-600" : "text-gray-800"}`}>
                                            {option.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">{option.subtitle}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            <BottomNav />
        </div>
    );
}
