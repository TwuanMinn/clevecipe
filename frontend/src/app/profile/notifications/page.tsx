"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Bell, MessageSquare, Mail, Smartphone, Volume2 } from "lucide-react";
import { BottomNav } from "@/components/ui";

interface NotificationSetting {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    enabled: boolean;
}

export default function NotificationsPage() {
    const router = useRouter();

    const [settings, setSettings] = useState<NotificationSetting[]>([
        {
            id: "push",
            title: "Push Notifications",
            description: "Get notified about meal reminders and updates",
            icon: Bell,
            color: "bg-orange-100 text-orange-600",
            enabled: true,
        },
        {
            id: "email",
            title: "Email Notifications",
            description: "Receive weekly summaries and tips via email",
            icon: Mail,
            color: "bg-blue-100 text-blue-600",
            enabled: true,
        },
        {
            id: "sms",
            title: "SMS Reminders",
            description: "Get text reminders for meal prep times",
            icon: Smartphone,
            color: "bg-green-100 text-green-600",
            enabled: false,
        },
        {
            id: "inapp",
            title: "In-App Messages",
            description: "Show tips and suggestions while using the app",
            icon: MessageSquare,
            color: "bg-purple-100 text-purple-600",
            enabled: true,
        },
        {
            id: "sounds",
            title: "Notification Sounds",
            description: "Play sounds for notifications",
            icon: Volume2,
            color: "bg-pink-100 text-pink-600",
            enabled: true,
        },
    ]);

    const toggleSetting = (id: string) => {
        setSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, enabled: !setting.enabled } : setting
            )
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 pb-24">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
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
                    <h2 className="text-lg font-bold text-gray-900">Notifications</h2>
                </div>
            </motion.header>

            <div className="relative z-10 px-4 py-6 space-y-4">
                {/* Info Banner */}
                <motion.div
                    className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 shadow-lg shadow-orange-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Bell className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Stay on Track</h3>
                            <p className="text-sm text-white/80">Notifications help you reach your health goals</p>
                        </div>
                    </div>
                </motion.div>

                {/* Notification Settings */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    {settings.map((setting, index) => {
                        const Icon = setting.icon;
                        return (
                            <motion.div
                                key={setting.id}
                                className="flex items-center gap-4 p-4 border-b border-gray-100/50 last:border-b-0"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + index * 0.05 }}
                            >
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${setting.color}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-semibold text-gray-800">{setting.title}</h4>
                                    <p className="text-xs text-gray-500">{setting.description}</p>
                                </div>
                                <button
                                    onClick={() => toggleSetting(setting.id)}
                                    className={`relative w-14 h-8 rounded-full transition-all shadow-inner ${setting.enabled
                                            ? "bg-gradient-to-r from-green-500 to-emerald-500"
                                            : "bg-gray-200"
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                                        animate={{ left: setting.enabled ? 28 : 4 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </motion.div>
                        );
                    })}
                </motion.div>

                {/* Quiet Hours */}
                <motion.div
                    className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h3 className="font-bold text-gray-900 mb-3">Quiet Hours</h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pause notifications</p>
                            <p className="text-xs text-gray-400">10:00 PM - 7:00 AM</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-200 transition-colors">
                            Edit
                        </button>
                    </div>
                </motion.div>
            </div>

            <BottomNav />
        </div>
    );
}
