import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                primary: {
                    DEFAULT: "#13ec37",
                    foreground: "#111812",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },

                // Clevcipe brand colors (updated)
                clevcipe: {
                    primary: "#13ec37",
                    dark: "#111812",
                    bgLight: "#f6f8f6",
                    bgDark: "#102213",
                    surfaceLight: "#ffffff",
                    surfaceDark: "#1a2e1d",
                },

                // Nutrition colors
                nutrition: {
                    calories: "hsl(var(--calories))",
                    protein: "hsl(var(--protein))",
                    carbs: "hsl(var(--carbs))",
                    fat: "hsl(var(--fat))",
                    fiber: "hsl(var(--fiber))",
                },

                // Status colors
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
                error: "hsl(var(--error))",
            },

            fontFamily: {
                sans: ["Manrope", "system-ui", "-apple-system", "sans-serif"],
                display: ["Manrope", "sans-serif"],
            },

            fontSize: {
                // Custom sizes matching spec
                "display-1": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
                "display-2": ["24px", { lineHeight: "1.3", fontWeight: "700" }],
                "recipe-title": ["20px", { lineHeight: "1.4", fontWeight: "700" }],
                "body": ["16px", { lineHeight: "1.5" }],
                "small": ["14px", { lineHeight: "1.5" }],
            },

            spacing: {
                // 8px base unit system
                "unit": "8px",
                "unit-2": "16px",
                "unit-3": "24px",
                "unit-4": "32px",
                "unit-6": "48px",
            },

            borderRadius: {
                DEFAULT: "1rem",
                lg: "1.5rem",
                xl: "2rem",
                "2xl": "2.5rem",
                "card": "12px",
                "button": "8px",
            },

            boxShadow: {
                "card": "0 2px 8px rgba(0, 0, 0, 0.08)",
                "card-hover": "0 8px 24px rgba(0, 0, 0, 0.12)",
                "nav": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                "primary": "0 10px 40px rgba(19, 236, 55, 0.2)",
            },

            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    from: { opacity: "0" },
                    to: { opacity: "1" },
                },
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(10px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "scale-in": {
                    from: { opacity: "0", transform: "scale(0.95)" },
                    to: { opacity: "1", transform: "scale(1)" },
                },
                "slide-in-bottom": {
                    from: { transform: "translateY(100%)" },
                    to: { transform: "translateY(0)" },
                },
                "pulse-ring": {
                    "0%": { transform: "scale(0.95)", opacity: "1" },
                    "50%": { transform: "scale(1)", opacity: "0.8" },
                    "100%": { transform: "scale(0.95)", opacity: "1" },
                },
                "cooking-spin": {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(360deg)" },
                },
                "bounce-light": {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-5px)" },
                },
            },

            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.3s ease-out",
                "fade-up": "fade-up 0.4s ease-out",
                "scale-in": "scale-in 0.2s ease-out",
                "slide-in-bottom": "slide-in-bottom 0.3s ease-out",
                "pulse-ring": "pulse-ring 2s ease-in-out infinite",
                "cooking-spin": "cooking-spin 1s linear infinite",
                "bounce-light": "bounce-light 1s ease-in-out infinite",
            },

            aspectRatio: {
                "recipe": "4 / 3",
                "hero": "16 / 10",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
