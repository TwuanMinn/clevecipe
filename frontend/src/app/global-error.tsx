"use client";

import { ServerCrash, RefreshCw, Home } from "lucide-react";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
                    <div className="text-center max-w-md">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                            <ServerCrash className="w-10 h-10 text-red-500" />
                        </div>

                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Critical Error
                        </h1>
                        <p className="text-gray-500 mb-8">
                            A critical error occurred. Please refresh the page.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={reset}
                                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-500 text-white font-semibold"
                            >
                                <RefreshCw className="w-5 h-5" />
                                Refresh
                            </button>

                            <a href="/">
                                <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 font-semibold">
                                    <Home className="w-5 h-5" />
                                    Go Home
                                </button>
                            </a>
                        </div>

                        {error.digest && (
                            <p className="mt-6 text-xs text-gray-400">
                                Error ID: {error.digest}
                            </p>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
