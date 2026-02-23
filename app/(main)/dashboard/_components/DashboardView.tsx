"use client"
import { IndustryInsight } from '@prisma/client'
import { Brain, Briefcase, BriefcaseIcon, LineChart, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react'
import { format, formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,

} from "@/components/ui/card"
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label, ResponsiveContainer, } from 'recharts';

interface DashboardViewProps {
    insights: IndustryInsight;
}
interface SalaryRange {
    role: string;
    min: number;
    max: number;
    median: number;
    location: string;
}
const DashboardView = ({ insights }: DashboardViewProps) => {
    const salaryRanges = insights.salaryRanges as unknown as SalaryRange[];
    const salaryData = salaryRanges.map((range) => ({
        name: range?.role,
        min: range?.min / 1000,
        max: range?.max / 100,
        median: range?.median / 100,
    }))

    const getDemandLevelColor = (level: string) => {
        switch (level.toLowerCase()) {
            case "high":
                return "bg-green-500";
            case "medium":
                return "bg-yellow-500";
            case "low":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    }
    const getMarketOutlookInfo = (outlook: string) => {
        switch (outlook.toLowerCase()) {
            case "positive":
                return { icon: TrendingUp, color: "text-green-500" };
            case "neutral":
                return { icon: LineChart, color: "text-yellow-500" };
            case "negative":
                return { icon: TrendingDown, color: "text-red-500" };
            default:
                return { icon: LineChart, color: "text-gray-500" };
        }
    }
    const OutlookIcon = getMarketOutlookInfo(insights.marketOutlook).icon
    const OutlookColor = getMarketOutlookInfo(insights.marketOutlook).color
    const lastUpdateDate = format(new Date(insights.lastUpdated), "dd/MM/yyyy")
    const nextUpdateDistance = formatDistanceToNow(
        new Date(insights.nextUpdate),
        { addSuffix: true }
    )
    return (
        <div className='space-y-8 w-full max-w-7xl mx-auto'>
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div>
                    <div className="mb-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md text-primary uppercase tracking-[0.2em] text-[10px] font-black">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
                        Analytics
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        Industry <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-primary/80 to-primary/40">Overview</span>
                    </h1>
                    <p className="text-muted-foreground mt-2 max-w-xl">
                        AI-generated insights and salary trends for your selected professional track.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Badge variant={"outline"} className="border-white/10 bg-[#111] text-muted-foreground px-4 py-1.5 rounded-full">
                        Last updated: {lastUpdateDate}
                    </Badge>
                    <Button size="sm" className="gap-2 h-9 rounded-full bg-primary text-white hover:bg-primary/90 font-bold transition-all shadow-[0_0_20px_-5px_var(--color-primary)]" onClick={() => window.location.href = '/onboarding'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" /></svg>
                        Edit Details
                    </Button>
                </div>
            </div>

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden group">
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative z-10'>
                        <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Market Outlook</CardTitle>
                        <div className={`p-2 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform ${OutlookColor}`}>
                            <OutlookIcon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className='text-3xl font-black text-white capitalize'>{insights.marketOutlook}</div>
                        <p className='text-xs text-muted-foreground mt-1 font-medium'>Next Update {nextUpdateDistance}</p>
                    </CardContent>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>

                <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden group">
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative z-10'>
                        <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Industry Growth</CardTitle>
                        <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform text-primary">
                            <TrendingUp className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className='text-3xl font-black text-white'>{insights.growthRate.toFixed(1)}%</div>
                        <Progress value={insights.growthRate} className='mt-3 h-1.5 bg-white/10' />
                    </CardContent>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>

                <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden group">
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative z-10'>
                        <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Demand Level</CardTitle>
                        <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform text-white">
                            <BriefcaseIcon className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10">
                        <div className='text-3xl font-black text-white capitalize'>{insights.demandLevel}</div>
                        <div className={`h-1.5 w-full rounded-full mt-3 shadow-[0_0_10px_-2px_currentColor] ${getDemandLevelColor(insights.demandLevel)}`} />
                    </CardContent>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>

                <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 hover:border-white/20 transition-all duration-500 rounded-[2rem] overflow-hidden group">
                    <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2 relative z-10'>
                        <CardTitle className='text-sm font-semibold text-muted-foreground uppercase tracking-wider'>Top Skills</CardTitle>
                        <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:scale-110 transition-transform text-primary">
                            <Brain className="h-4 w-4" />
                        </div>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-2">
                        <div className='flex flex-wrap gap-1.5'>
                            {insights.topSkills.map((skill: string) => (
                                <Badge key={skill} variant={"secondary"} className="bg-white/5 hover:bg-white/10 text-white/90 border-transparent rounded-lg">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
            </div>

            {/* Salary Ranges Chart */}
            <Card className="col-span-4 bg-[#050505]/80 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />
                <CardHeader className="relative z-10 pb-8">
                    <CardTitle className="text-2xl font-black text-white">Salary Ranges by Role</CardTitle>
                    <CardDescription className="text-muted-foreground font-medium">
                        Displaying minimum, median, and maximum salaries (in thousands)
                    </CardDescription>
                </CardHeader>
                <CardContent className="relative z-10">
                    <div className="h-[400px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={salaryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}k`} />
                                <Tooltip
                                    cursor={{ fill: 'transparent' }}
                                    content={({ active, payload, label }) => {
                                        if (active && payload && payload.length) {
                                            return (
                                                <div className="bg-[#111111] border border-white/10 rounded-xl p-4 shadow-xl">
                                                    <p className="font-bold text-white mb-2">{label}</p>
                                                    {payload.map((item) => (
                                                        <div key={item.name} className="flex items-center justify-between gap-4 text-sm mb-1">
                                                            <span className="text-muted-foreground flex items-center gap-2">
                                                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.fill }} />
                                                                {item.name}
                                                            </span>
                                                            <span className="font-mono text-white font-semibold">₹{item.value}k</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                                <Bar dataKey="min" fill="url(#colorMin)" name="Min Salary" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="median" fill="url(#colorMedian)" name="Median Salary" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="max" fill="url(#colorMax)" name="Max Salary" radius={[4, 4, 0, 0]} />

                                <defs>
                                    <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#334155" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#334155" stopOpacity={0.4} />
                                    </linearGradient>
                                    <linearGradient id="colorMedian" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#64748b" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#64748b" stopOpacity={0.4} />
                                    </linearGradient>
                                    <linearGradient id="colorMax" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={1} />
                                        <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Bottom Row: Trends & Recommended Skills */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 pb-12'>
                <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/10 transition-all">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">Key Industry Trends</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            Current trends shaping your profession
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className='space-y-4'>
                            {insights.keyTrends.map((trend, index) => (
                                <li key={index} className='flex items-start space-x-4 bg-white/5 border border-white/5 p-4 rounded-2xl'>
                                    <div className='h-2.5 w-2.5 mt-1.5 rounded-full bg-primary/80 shadow-[0_0_10px_var(--color-primary)] shrink-0'></div>
                                    <span className="text-white/90 leading-relaxed text-sm md:text-base">{trend}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                <Card className="bg-[#050505]/80 backdrop-blur-xl border-white/5 rounded-[2rem] overflow-hidden group hover:border-white/10 transition-all">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-white">Recommended Skills</CardTitle>
                        <CardDescription className="text-muted-foreground/80">
                            High-demand skills to consider developing
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-wrap gap-2'>
                            {insights.recommendedSkills.map((skill: string) => (
                                <Badge key={skill} variant={"secondary"} className="bg-primary/10 border-primary/20 text-primary hover:bg-primary/20 hover:text-primary transition-colors text-sm py-1.5 px-4 rounded-xl">{skill}</Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default DashboardView