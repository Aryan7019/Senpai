"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { PlayCircle, BookOpen, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Course {
    id: string;
    courseId: string;
    name: string;
    description: string;
    level: string;
    totalChapters: number;
    createdAt: Date;
}

export default function CourseDashboard({ courses }: { courses: Course[] }) {
    const router = useRouter();

    if (!courses || courses.length === 0) {
        return (
            <div className="w-full flex flex-col items-center justify-center p-16 bg-[#050505]/40 backdrop-blur-xl border border-white/5 rounded-3xl text-center">
                <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
                    <BookOpen className="w-10 h-10 text-white/15" />
                </div>
                <h3 className="text-xl font-bold text-white/80">No courses yet</h3>
                <p className="text-white/40 mt-2 max-w-md text-sm leading-relaxed">
                    Generate your first AI-powered interactive video course above to see it appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
                <div key={course.courseId} className="group relative">
                    {/* Animated hover glow */}
                    <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/30 via-primary/10 to-transparent rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

                    <Card
                        className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden cursor-pointer hover:border-primary/30 transition-all duration-300 h-full flex flex-col"
                        onClick={() => router.push(`/courses/${course.courseId}/preview`)}
                    >
                        {/* Top gradient accent */}
                        <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        {/* Play overlay on hover */}
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-[0_0_30px_-5px_var(--color-primary)] scale-75 group-hover:scale-100 transition-transform duration-500">
                                <PlayCircle className="w-8 h-8 text-primary fill-primary/20" />
                            </div>
                        </div>

                        <CardHeader className="pb-4 relative z-0">
                            <div className="flex items-start justify-between">
                                <span className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider">
                                    {course.level}
                                </span>
                                <span className="text-xs text-white/40 font-medium">
                                    {new Date(course.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <CardTitle className="text-xl font-bold text-white mt-4 line-clamp-1">{course.name}</CardTitle>
                            <CardDescription className="text-white/50 line-clamp-2 text-sm leading-relaxed">
                                {course.description}
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="mt-auto pt-6 border-t border-white/5 relative z-0">
                            <div className="flex items-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-white/70">
                                    <Layers className="w-4 h-4 text-primary" />
                                    <span className="font-medium">{course.totalChapters} Chapters</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            ))}
        </div>
    );
}
