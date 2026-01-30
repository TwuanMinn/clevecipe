import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/lib/auth-context";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-poppins",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Clevcipe - AI-Powered Recipe Generator",
    description:
        "Discover personalized recipes based on your dietary preferences, restrictions, and nutritional goals. Powered by AI.",
    keywords: [
        "recipes",
        "meal planning",
        "nutrition",
        "diet",
        "AI",
        "personalized",
        "cooking",
        "healthy eating",
    ],
    authors: [{ name: "Clevcipe" }],
    creator: "Clevcipe",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://clevcipe.vercel.app",
        title: "Clevcipe - AI-Powered Recipe Generator",
        description:
            "Discover personalized recipes based on your dietary preferences, restrictions, and nutritional goals.",
        siteName: "Clevcipe",
    },
    twitter: {
        card: "summary_large_image",
        title: "Clevcipe - AI-Powered Recipe Generator",
        description:
            "Discover personalized recipes based on your dietary preferences and nutritional goals.",
    },
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#10B981" },
        { media: "(prefers-color-scheme: dark)", color: "#059669" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Script to run before React hydrates to prevent flash of wrong theme
    const themeScript = `
        (function() {
            try {
                var theme = localStorage.getItem('clevcipe-theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            } catch (e) {}
        })();
    `;

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body
                className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
            >
                <ThemeProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}

