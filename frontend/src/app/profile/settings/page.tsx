"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Palette, Globe, Volume2, Download, Info, ChevronRight, LucideIcon } from "lucide-react";
import { BottomNav } from "@/components/ui";

interface SettingsItem {
    icon: LucideIcon;
    label: string;
    color: string;
    value?: string;
    action?: () => void;
    toggle?: boolean;
    enabled?: boolean;
    onToggle?: () => void;
    options?: string[];
}

interface SettingsGroup {
    title: string;
    items: SettingsItem[];
}

export default function SettingsPage() {
    const router = useRouter();

    const [settings, setSettings] = useState({
        language: "English",
        units: "Metric",
        autoDownload: false,
        hapticFeedback: true,
    });

    const settingsGroups: SettingsGroup[] = [
        {
            title: "Preferences",
            items: [
                {
                    icon: Globe,
                    label: "Language",
                    value: settings.language,
                    color: "bg-blue-100 text-blue-600",
                    action: () => console.log("Change language"),
                },
                {
                    icon: Palette,
                    label: "Units",
                    value: settings.units,
                    color: "bg-purple-100 text-purple-600",
                    options: ["Metric", "Imperial"],
                    action: () => console.log("Change units"),
                },
            ],
        },
        {
            title: "App Settings",
            items: [
                {
                    icon: Download,
                    label: "Auto-Download Recipes",
                    color: "bg-green-100 text-green-600",
                    toggle: true,
                    enabled: settings.autoDownload,
                    onToggle: () => setSettings(prev => ({ ...prev, autoDownload: !prev.autoDownload })),
                },
                {
                    icon: Volume2,
                    label: "Haptic Feedback",
                    color: "bg-orange-100 text-orange-600",
                    toggle: true,
                    enabled: settings.hapticFeedback,
                    onToggle: () => setSettings(prev => ({ ...prev, hapticFeedback: !prev.hapticFeedback })),
                },
            ],
        },
        {
            title: "About",
            items: [
                {
                    icon: Info,
                    label: "App Version",
                    value: "1.0.0 (Build 42)",
                    color: "bg-gray-100 text-gray-600",
                },
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
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
                    <h2 className="text-lg font-bold text-gray-900">Settings</h2>
                </div>
            </motion.header>

            <div className="relative z-10 px-4 py-6 space-y-6">
                {settingsGroups.map((group, groupIndex) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: groupIndex * 0.1 }}
                    >
                        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                            {group.title}
                        </h3>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
                            {group.items.map((item, _itemIndex) => {
                                const Icon = item.icon;
                                return (
                                    <div
                                        key={item.label}
                                        className="flex items-center gap-4 p-4 border-b border-gray-100/50 last:border-b-0"
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-800">{item.label}</h4>
                                        </div>

                                        {item.toggle ? (
                                            <button
                                                onClick={item.onToggle}
                                                className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${item.enabled
                                                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                                    : "bg-gray-200"
                                                    }`}
                                            >
                                                <motion.div
                                                    className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                                    animate={{ left: item.enabled ? 28 : 4 }}
                                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                />
                                            </button>
                                        ) : item.value ? (
                                            <button
                                                onClick={item.action}
                                                className="flex items-center gap-2 text-sm text-gray-500"
                                            >
                                                <span>{item.value}</span>
                                                {item.action && <ChevronRight className="w-4 h-4" />}
                                            </button>
                                        ) : null}
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}

                {/* Reset Settings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <button className="w-full py-4 text-red-500 text-sm font-semibold hover:bg-red-50 rounded-xl transition-colors">
                        Reset All Settings
                    </button>
                </motion.div>
            </div>

            <BottomNav />
        </div>
    );
}
