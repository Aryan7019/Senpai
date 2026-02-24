"use client";

import { useState } from "react";
import { calculateATSScore } from "@/actions/resume";
import { Loader2 } from "lucide-react";

export default function ATSScore({ content }: { content: string }) {
    const [score, setScore] = useState<number | null>(null);
    const [label, setLabel] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const analyse = async () => {
        if (!content || content.trim().length < 50 || isLoading) return;
        setIsLoading(true);
        try {
            const result = await calculateATSScore(content);
            setScore(result.score);
            setLabel(result.label);
        } catch { setScore(null); setLabel("Error"); }
        finally { setIsLoading(false); }
    };

    const getScoreColor = () => {
        if (score === null) return "text-muted-foreground";
        if (score >= 80) return "text-emerald-400";
        if (score >= 60) return "text-primary";
        if (score >= 40) return "text-orange-400";
        return "text-red-400";
    };
    const getStrokeColor = () => {
        if (score === null) return "stroke-muted";
        if (score >= 80) return "stroke-emerald-400";
        if (score >= 60) return "stroke-primary";
        if (score >= 40) return "stroke-orange-400";
        return "stroke-red-400";
    };

    const circumference = 2 * Math.PI * 40;
    const offset = score !== null ? circumference - (score / 100) * circumference : circumference;

    if (!content || content.trim().length < 50) return null;

    return (
        <div className="gold-border-gradient rounded-lg md:rounded-xl shadow-xl p-2 md:p-4 flex items-center gap-2 md:gap-4">
            <div className="relative w-9 h-9 md:w-12 md:h-12 shrink-0">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" className="stroke-muted" />
                    <circle cx="50" cy="50" r="40" fill="transparent" strokeWidth="8" strokeLinecap="round"
                        className={`${getStrokeColor()} transition-all duration-700`}
                        strokeDasharray={circumference} strokeDashoffset={offset}
                        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                    />
                </svg>
                <div className={`absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-bold ${getScoreColor()}`}>
                    {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : score ?? "—"}
                </div>
            </div>
            <div className="hidden md:block">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block">ATS Score</span>
                <span className={`text-sm font-semibold ${getScoreColor()}`}>{isLoading ? "Analyzing..." : label || "Not scored"}</span>
            </div>
            <div className="h-6 md:h-8 w-px bg-border" />
            <button onClick={analyse} disabled={isLoading} className="text-[10px] md:text-xs font-semibold text-primary hover:text-primary/80 disabled:opacity-50 transition-colors whitespace-nowrap">
                {isLoading ? "..." : "Analyse"}
            </button>
        </div>
    );
}
