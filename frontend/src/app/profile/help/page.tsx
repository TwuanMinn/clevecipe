"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MessageCircle, FileText, Mail, ExternalLink, ChevronRight, Search, Star } from "lucide-react";
import { BottomNav } from "@/components/ui";

export default function HelpSupportPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");

    const faqItems = [
        {
            question: "How do I generate a recipe?",
            answer: "Go to the home page and tap 'Generate Recipe'. Enter your available ingredients and dietary preferences, then our AI will create personalized recipes for you.",
        },
        {
            question: "Can I save recipes offline?",
            answer: "Yes! Tap the heart icon on any recipe to save it to your favorites. Saved recipes are available offline.",
        },
        {
            question: "How do I update my dietary preferences?",
            answer: "Go to Profile > Dietary Preferences to update your allergies, diet type, and food preferences.",
        },
        {
            question: "Why are my macros not updating?",
            answer: "Make sure you've logged your meals for the day. Macros update automatically when you add meals to your plan.",
        },
        {
            question: "How do I cancel my subscription?",
            answer: "Go to Profile > Settings > Subscription to manage or cancel your plan.",
        },
    ];

    const supportOptions = [
        {
            icon: MessageCircle,
            title: "Live Chat",
            subtitle: "Chat with our support team",
            color: "bg-green-100 text-green-600",
            badge: "Online",
            badgeColor: "bg-green-500",
        },
        {
            icon: Mail,
            title: "Email Support",
            subtitle: "support@clevcipe.com",
            color: "bg-blue-100 text-blue-600",
        },
        {
            icon: FileText,
            title: "User Guide",
            subtitle: "Complete documentation",
            color: "bg-purple-100 text-purple-600",
        },
    ];

    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const filteredFaqs = faqItems.filter(
        item =>
            item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24">
                <div className="animate-pulse p-4">
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl mb-6" />
                    <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-6" />
                    <div className="space-y-4">
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                        <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-[#0a0f0b] dark:via-[#0d1610] dark:to-[#0a1209] pb-24">
            {/* Animated background blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-200/30 dark:bg-cyan-900/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 -left-40 w-96 h-96 bg-emerald-200/20 dark:bg-emerald-900/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
            </div>

            {/* Header */}
            <motion.header
                className="sticky top-0 z-20 bg-gradient-to-br from-emerald-50/90 via-green-50/90 to-teal-50/90 dark:from-[#0a0f0b]/90 dark:via-[#0d1610]/90 dark:to-[#0a1209]/90 backdrop-blur-md px-4 py-4"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 rounded-xl bg-white/80 dark:bg-white/10 shadow-sm hover:bg-white dark:hover:bg-white/20 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white">Help &amp; Support</h2>
                </div>
            </motion.header>

            <div className="relative z-10 px-4 py-6 space-y-6">
                {/* Search */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search help articles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 dark:border-white/10 outline-none focus:ring-2 focus:ring-green-500/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                    />
                </motion.div>

                {/* Quick Support Options */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Get Help</h3>
                    <div className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 dark:border-white/10 overflow-hidden">
                        {supportOptions.map((option) => {
                            const Icon = option.icon;
                            return (
                                <button
                                    key={option.title}
                                    className="w-full flex items-center gap-4 p-4 border-b border-gray-100/50 dark:border-gray-800/50 last:border-b-0 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors"
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${option.color}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-semibold text-gray-800 dark:text-gray-100">{option.title}</h4>
                                            {option.badge && (
                                                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full text-white ${option.badgeColor}`}>
                                                    {option.badge}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{option.subtitle}</p>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                                </button>
                            );
                        })}
                    </div>
                </motion.div>

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">
                        Frequently Asked Questions
                    </h3>
                    <div className="space-y-3">
                        {filteredFaqs.map((faq, index) => (
                            <motion.div
                                key={index}
                                className="bg-white/80 dark:bg-white/5 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 dark:border-white/10 overflow-hidden"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + index * 0.05 }}
                            >
                                <button
                                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-4"
                                >
                                    <span className="font-semibold text-gray-800 dark:text-gray-100 text-left">{faq.question}</span>
                                    <motion.div
                                        animate={{ rotate: expandedFaq === index ? 90 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <ChevronRight className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                                    </motion.div>
                                </button>
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: expandedFaq === index ? "auto" : 0,
                                        opacity: expandedFaq === index ? 1 : 0,
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="px-4 pb-4 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Rate App */}
                <motion.div
                    className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-5 shadow-lg shadow-orange-500/20"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/20 rounded-xl">
                            <Star className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white">Enjoying Clevcipe?</h3>
                            <p className="text-sm text-white/80">Rate us on the App Store!</p>
                        </div>
                        <button className="px-4 py-2 bg-white rounded-xl font-bold text-orange-600 text-sm hover:scale-105 transition-transform">
                            Rate
                        </button>
                    </div>
                </motion.div>

                {/* App Version */}
                <div className="text-center py-4">
                    <p className="text-xs text-gray-400">Clevcipe v1.0.0</p>
                </div>
            </div>

            <BottomNav />
        </div>
    );
}
