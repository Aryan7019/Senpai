"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InterviewReportDialog } from "./interview-report-dialog";
import { Target, MessageSquare, ShieldCheck, ArrowRight } from "lucide-react";

export function InterviewsGrid({ interviews }: { interviews: any[] }) {
    const [selectedInterview, setSelectedInterview] = useState<any | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCardClick = (interview: any) => {
        setSelectedInterview(interview);
        setIsDialogOpen(true);
    };

    // In Next.js SSR, we typically use a single pagination size to avoid hydration mismatches, 
    // or we can just default to 12 since the user wants 12 on large devices. 
    // On mobile, they will just see 3 cards before paging, but laid out 2 per row.
    const ITEMS_PER_PAGE = 3;
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(interviews.length / ITEMS_PER_PAGE);

    const paginatedInterviews = interviews.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (interviews.length === 0) {
        return <p className="text-muted-foreground text-center py-12">You haven't completed any voice interviews yet.</p>;
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginatedInterviews.map((interview: any) => (
                    <div key={interview.id} onClick={() => handleCardClick(interview)} className="block">
                        <Card className="hover:shadow-[0_0_40px_-10px_rgba(var(--color-primary),0.2)] transition-all duration-500 cursor-pointer h-full border-white/5 hover:border-primary/30 group bg-[#050505]/60 backdrop-blur-2xl rounded-3xl overflow-hidden relative isolate">
                            {/* Premium Background Effects */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                            <div className="absolute -inset-px bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-0" />
                            
                            {/* Glass Reflections */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />

                            <div className="p-6 space-y-6 relative z-10">
                                {/* Header Row */}
                                <div className="flex items-start justify-between">
                                    <div className="space-y-2">
                                        <CardTitle className="text-xl font-black text-white group-hover:text-primary group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-primary transition-all duration-500 line-clamp-1 leading-tight tracking-tighter">
                                            {interview.targetRole}
                                        </CardTitle>
                                        <div className="flex items-center gap-3 text-[11px] text-white/40 font-bold tracking-wide uppercase">
                                            <span className="flex items-center gap-1.5 py-1 px-2.5 bg-white/5 rounded-lg border border-white/5">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary/70"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                                                {format(new Date(interview.createdAt), "MMM dd")}
                                            </span>
                                            <span className={`px-2.5 py-1 rounded-lg font-black bg-opacity-10 border ${interview.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                                                {interview.status === 'COMPLETED' ? 'PASSED' : 'FAILED'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Score Hub (Premium Design) */}
                                    <div className="shrink-0 relative group/score">
                                        <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                        <div className="relative w-16 h-16 rounded-full border-2 border-white/10 flex flex-col items-center justify-center bg-white/[0.03] backdrop-blur-md group-hover:border-primary/50 transition-all duration-500 shadow-2xl">
                                            <span className="text-2xl font-black text-white leading-none tracking-tighter group-hover:scale-110 transition-transform duration-500">
                                                {interview.technicalScore !== null && interview.communicationScore !== null && interview.confidenceScore !== null
                                                    ? Math.round((interview.technicalScore + interview.communicationScore + interview.confidenceScore) / 3)
                                                    : "--"}
                                            </span>
                                            <span className="text-[9px] text-white/40 font-black uppercase tracking-widest mt-0.5">PTS</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Circular Layout Score Pins - Maximum Visual Impact */}
                                <div className="grid grid-cols-3 gap-1.5 pt-2">
                                    {/* Technical */}
                                    <div className="flex flex-col items-center gap-2 transition-all duration-500 group/rings">
                                        <div className="relative h-16 w-16 flex items-center justify-center text-blue-400">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path className="stroke-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" />
                                                <path stroke="currentColor" strokeDasharray={`${interview.technicalScore || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(96,165,250,0.6)]" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-base font-black text-white group-hover/rings:scale-110 group-hover:text-primary transition-all duration-500">{interview.technicalScore !== null ? Math.round(interview.technicalScore) : "--"}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-white/30 group-hover:text-primary transition-colors duration-500 lg:group-hover:text-primary/90 uppercase tracking-[0.2em]">TECH</span>
                                    </div>
                                    {/* Communication */}
                                    <div className="flex flex-col items-center gap-2 transition-all duration-500 group/rings">
                                        <div className="relative h-16 w-16 flex items-center justify-center text-purple-400">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path className="stroke-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" />
                                                <path stroke="currentColor" strokeDasharray={`${interview.communicationScore || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-base font-black text-white group-hover/rings:scale-110 group-hover:text-primary transition-all duration-500">{interview.communicationScore !== null ? Math.round(interview.communicationScore) : "--"}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-white/30 group-hover:text-primary transition-colors duration-500 lg:group-hover:text-primary/90 uppercase tracking-[0.2em]">COMM</span>
                                    </div>
                                    {/* Confidence */}
                                    <div className="flex flex-col items-center gap-2 transition-all duration-500 group/rings">
                                        <div className="relative h-16 w-16 flex items-center justify-center text-emerald-400">
                                            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                                <path className="stroke-white/5" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" />
                                                <path stroke="currentColor" strokeDasharray={`${interview.confidenceScore || 0}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="2.5" strokeLinecap="round" className="transition-all duration-1000 ease-out drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
                                            </svg>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <span className="text-base font-black text-white group-hover/rings:scale-110 group-hover:text-primary transition-all duration-500">{interview.confidenceScore !== null ? Math.round(interview.confidenceScore) : "--"}</span>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-black text-white/30 group-hover:text-primary transition-colors duration-500 lg:group-hover:text-primary/90 uppercase tracking-[0.2em]">CONF</span>
                                    </div>
                                </div>

                                {/* View Report Footer - Premium Animation */}
                                <div className="pt-5 border-t border-white/5 flex items-center justify-between group/footer">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] text-white/20 font-black uppercase tracking-[0.2em] group-hover:text-primary transition-colors duration-500">View Deep Analysis</span>
                                        <span className="text-[8px] text-white/10 font-bold uppercase tracking-widest mt-0.5 group-hover:text-primary/40 transition-colors duration-500">Comprehensive Feedback</span>
                                    </div>
                                    <div className="w-9 h-9 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:bg-primary group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--color-primary),0.5)] transition-all duration-500 overflow-hidden relative">
                                        <ArrowRight className="w-4 h-4 text-white/40 group-hover:text-black group-hover:translate-x-0 -translate-x-1 transition-all duration-500" />
                                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <div className="flex items-center gap-2">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-lg transition-colors ${currentPage === page
                                    ? "bg-primary text-primary-foreground"
                                    : "text-white hover:bg-white/10"
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 text-sm font-medium text-white bg-white/5 hover:bg-white/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}

            <InterviewReportDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                interview={selectedInterview}
            />
        </div>
    );
}
