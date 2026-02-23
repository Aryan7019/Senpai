import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl">
            <div className="relative flex items-center justify-center">
                {/* Ambient golden glow behind spinner */}
                <div className="absolute w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-pulse" />

                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
            </div>
            <p className="mt-6 text-sm font-bold tracking-[0.2em] uppercase text-primary/80 animate-pulse">
                Loading Interface...
            </p>
        </div>
    );
}
