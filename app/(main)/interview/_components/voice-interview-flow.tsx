"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

const VoiceInterviewFlow = ({ children }: { children?: React.ReactNode }) => {
    const router = useRouter();
    const [targetRole, setTargetRole] = useState("");
    const language = "English";

    const handleStart = () => {
        router.push(`/interview/session?role=${encodeURIComponent(targetRole)}&language=${encodeURIComponent(language)}`);
    }

    return (
        <div className="max-w-4xl mx-auto relative mt-20 lg:mt-28">

            {/* Main Container */}
            <div className="relative overflow-hidden bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-[0_0_80px_-15px_rgba(var(--color-primary),0.2)] transition-all duration-700 hover:shadow-[0_0_100px_-15px_rgba(var(--color-primary),0.3)] hover:border-white/20">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                <div className="w-full flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 relative">

                    <div className="w-full max-w-2xl bg-[#111111]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-end gap-6 shadow-2xl relative z-10">
                        <div className="w-full space-y-2">
                            <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">
                                Target Role
                            </label>
                            <div className="relative">
                                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    placeholder="e.g. Senior Product Designer"
                                    className="bg-[#1a1a1a] border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary pl-11 h-14 text-base rounded-2xl text-white shadow-inner"
                                    value={targetRole}
                                    onChange={(e) => setTargetRole(e.target.value)}
                                />
                            </div>
                        </div>

                        <Button
                            size="lg"
                            className="w-full md:w-auto md:min-w-[200px] h-14 rounded-2xl text-base font-bold text-white bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_var(--color-primary)] transition-all group shrink-0"
                            disabled={!targetRole}
                            onClick={handleStart}
                        >
                            Start Interview
                            <svg className="ml-2 w-4 h-4 group-hover:scale-110 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-24">
                {children}
            </div>
        </div>
    );
};

export default VoiceInterviewFlow;
