import React from 'react';
import { db } from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import CourseGeneratorHero from './_components/course-generator-hero';
import CourseDashboard from './_components/course-dashboard';

export default async function CoursesPage() {
    const { userId } = await auth();

    let courses: any[] = [];
    if (userId) {
        const user = await db.user.findUnique({ where: { clerkUserId: userId } });
        if (user) {
            courses = await db.course.findMany({
                where: { createdBy: user.id },
                orderBy: { createdAt: 'desc' }
            });
        }
    }

    return (
        <div className="relative min-h-screen overflow-hidden w-full text-white">
            <div className="absolute inset-0 bg-[#020202] -z-20" />
            <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none -z-10"></div>
            <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

            {/* Glowing Orb */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

            <div className="container mx-auto py-16 px-4 md:px-8 relative z-10 max-w-7xl space-y-16">
                <CourseGeneratorHero />

                <div className="space-y-6">
                    <h2 className="text-2xl font-bold tracking-tight text-white/90">Your Generated Courses</h2>
                    <CourseDashboard courses={courses} />
                </div>
            </div>
        </div>
    );
}
