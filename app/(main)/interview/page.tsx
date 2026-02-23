import { getVoiceInterviews } from '@/actions/interview'
import React from 'react'
import VoiceInterviewFlow from './_components/voice-interview-flow'
import { Card, CardTitle, CardDescription, CardHeader, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { InterviewsGrid } from './_components/interviews-grid'

export default async function InterviewPage() {
  const interviews = await getVoiceInterviews()

  return (
    <div className="relative min-h-screen overflow-hidden w-full">
      {/* Elevated deeper dark background with premium grid */}
      <div className="absolute inset-0 bg-[#020202] -z-20" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none -z-10"></div>

      {/* Decorative top ambient glow */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

      <div className="container mx-auto space-y-12 py-10 px-4 md:px-8 relative z-10">
        {/* Header section with dramatic typography */}
        <div className="text-center space-y-8 max-w-4xl mx-auto pt-16">
          <div className="mx-auto w-fit inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_-3px_var(--color-primary)] text-primary uppercase tracking-[0.2em] text-[10px] font-black">
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]"></span>
            AI Simulator
          </div>

          <h1 className='text-6xl md:text-8xl font-black tracking-tighter text-white mb-2 leading-[1.1]'>
            Conquer Your Next <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-primary via-primary/80 to-primary/40 drop-shadow-sm">
              Interview Session
            </span>
          </h1>

          <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto font-medium">
            Configure your AI simulation below. Our advanced engine adapts to role specifics in real-time, providing actionable feedback instantly.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><path d="M12 2v20" /><path d="m17 5-5-3-5 3v14l5 3 5-3Z" /></svg>
              <span className="text-sm font-semibold text-white/80">Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" /><path d="m9 12 2 2 4-4" /></svg>
              <span className="text-sm font-semibold text-white/80">Hyper-Realistic AI</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
              <span className="text-sm font-semibold text-white/80">Actionable Feedback</span>
            </div>
          </div>
        </div>

        {/* Premium Glassmorphism Voice flow */}
        <VoiceInterviewFlow>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {/* Clock icon approximation */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Recent Performance</h2>
            </div>
          </div>

          <InterviewsGrid interviews={interviews} />
        </VoiceInterviewFlow>
      </div>
    </div>
  )
}