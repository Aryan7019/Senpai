"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Play, Loader2, CheckCircle2 } from 'lucide-react';
import { generateCourseLayout } from '@/actions/course';
import { useRouter } from 'next/navigation';

export default function CourseGeneratorHero() {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('');
    const router = useRouter();

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setProgress(5);
        setStatusText("Designing Course Syllabus with AI...");

        try {
            // STEP 1: Generate Layout (Fast)
            const layoutResult = await generateCourseLayout(topic);
            const { course, courseId } = layoutResult;

            setProgress(20);

            // STEP 2: Generate chapters in batches of 2 (parallel Gemini, safe for gemma quota)
            const chapters = course.layout as any[];
            const chapterCount = chapters.length;
            let completed = 0;

            const batchSize = 2;
            for (let i = 0; i < chapterCount; i += batchSize) {
                const batch = chapters.slice(i, i + batchSize);
                await Promise.all(
                    batch.map(async (chapter) => {
                        setStatusText(`Generating: ${chapter.chapterTitle}...`);
                        const fetchRes = await fetch('/api/generate-video-content', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                courseId: course.courseId,
                                chapterId: chapter.chapterId,
                                subTopics: chapter.subTopics
                            })
                        });

                        if (!fetchRes.ok) {
                            const err = await fetchRes.json();
                            throw new Error(err.error || "Failed to generate chapter content");
                        }
                        completed++;
                        setProgress(20 + (completed / chapterCount) * 80);
                    })
                );
            }

            setStatusText("Course generated successfully!");
            setProgress(100);

            // Refresh the page data (server component re-fetches) then redirect
            setTimeout(() => {
                router.refresh(); // Re-fetches server component data
                router.push(`/courses/${courseId}/preview`);
            }, 1000);

        } catch (error: any) {
            console.error("Generation failed:", error);
            setStatusText(`Error: ${error.message}`);
            setIsGenerating(false);
        }
    };

    return (
        <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto pt-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_-3px_var(--color-primary)] text-primary uppercase tracking-[0.2em] text-[10px] font-black">
                <Sparkles className="w-3 h-3" /> AI Course Architect
            </div>

            <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white leading-tight">
                Turn any topic into an <br className="hidden md:block" />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/40 drop-shadow-sm">
                    Interactive Video Course
                </span>
            </h1>

            <p className="text-white/50 text-base md:text-lg max-w-2xl font-medium">
                Our AI researches the topic, builds the curriculum, writes the slides, voices the narration, and renders the video—all in seconds.
            </p>

            {!isGenerating ? (
                <div className="w-full max-w-xl relative mt-4 group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-primary/10 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                    <div className="relative flex items-center bg-[#050505]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-2xl">
                        <Input
                            placeholder="e.g. Advanced Python Concurrency..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="flex-1 bg-transparent border-none text-white placeholder:text-white/30 text-lg px-4 h-14 focus-visible:ring-0 focus-visible:ring-offset-0"
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                        />
                        <Button
                            size="lg"
                            onClick={handleGenerate}
                            disabled={!topic || isGenerating}
                            className="h-14 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-[0_0_20px_-5px_var(--color-primary)] transition-all"
                        >
                            Generate <Play className="ml-2 w-4 h-4 fill-current" />
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="w-full max-w-xl mt-8 space-y-6">
                    <div className="p-8 rounded-3xl bg-[#0a0a0a] border border-white/10 relative overflow-hidden">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
                        <div className="flex flex-col items-center gap-6">
                            {progress < 100 ? (
                                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                            ) : (
                                <CheckCircle2 className="w-12 h-12 text-emerald-500 shadow-[0_0_20px_#10b981] rounded-full" />
                            )}

                            <div className="w-full space-y-3">
                                <div className="flex justify-between text-sm font-semibold">
                                    <span className="text-white/80">{statusText}</span>
                                    <span className="text-primary">{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2 bg-white/5" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
