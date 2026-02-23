"use client";
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { CheckCircle2 } from 'lucide-react'

const HeroSection = () => {
    return (
        <section className="relative w-full pt-24 md:pt-32 pb-16 md:pb-24 overflow-hidden">
            {/* Subtle grid pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            
            {/* Gradient orbs - perfect middle ground */}
            <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-primary/25 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 -right-32 w-[500px] h-[500px] bg-primary/25 rounded-full blur-3xl"></div>
            
            <div className='container mx-auto px-4 relative z-10'>
                <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto'>
                    {/* Left Content */}
                    <div className='space-y-8'>
                        {/* Small badge */}
                        <div className='inline-flex items-center gap-2 px-3 py-1 text-xs text-primary font-semibold uppercase tracking-wider border border-primary/30 rounded-full bg-primary/10'>
                            <span className='w-2 h-2 rounded-full bg-primary animate-pulse'></span>
                            <span>AI-POWERED CAREER PLATFORM</span>
                        </div>

                        {/* Main Heading */}
                        <div className='space-y-6'>
                            <h1 className='text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] text-white'>
                                Your AI Career Coach for
                                <br />
                                <span className='text-primary'>
                                    Professional Success
                                </span>
                            </h1>
                            
                            <p className='text-base md:text-lg text-gray-400 leading-relaxed max-w-xl'> 
                                Advance your career with personalized guidance, interview prep, and AI-powered tools for job success. Get AI-powered insights tailored to your career & a portfolio tailored to your next position.
                            </p>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <Link href={"/dashboard"}>
                                <Button size={"lg"} className='px-8 h-12 rounded-lg bg-primary hover:bg-primary/90'>
                                    Start Free Trial
                                </Button>
                            </Link>
                            <Link href={"#features"}>
                                <Button size={"lg"} className='px-8 h-12 rounded-lg' variant={"outline"}>
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Trust badges */}
                        <div className='flex items-center gap-4 pt-4'>
                            <div className='flex -space-x-2'>
                                <div className='w-8 h-8 rounded-full bg-muted border-2 border-black'></div>
                                <div className='w-8 h-8 rounded-full bg-muted border-2 border-black'></div>
                                <div className='w-8 h-8 rounded-full bg-muted border-2 border-black'></div>
                            </div>
                            <p className='text-sm text-gray-500'>Trusted by 10,000+ professionals</p>
                        </div>
                    </div>

                    {/* Right Visual - Clean image */}
                    <div className='relative hidden lg:block'>
                        <div className='relative aspect-square rounded-2xl overflow-hidden max-w-[600px]'>
                            <div className='relative w-full h-full rounded-2xl overflow-hidden border border-primary/20 bg-black shadow-xl p-2'>
                                {/* Background Image */}
                                <div className='absolute inset-0'>
                                    <Image
                                        src="/career.png"
                                        alt="Career tracking visualization"
                                        fill
                                        className='object-cover rounded-xl opacity-90'
                                        priority
                                    />
                                </div>
                            
                            {/* Feature card overlay - on top of everything */}
                            <div className='absolute bottom-6 left-6 right-6 bg-black/90 backdrop-blur-md border border-primary/20 p-4 rounded-lg shadow-lg z-10'>
                                <div className='flex items-center gap-4'>
                                    <div className='w-12 h-12 rounded bg-primary/20 flex items-center justify-center text-primary'>
                                        <CheckCircle2 className='w-6 h-6' />
                                    </div>
                                    <div>
                                        <h3 className='text-white font-medium text-sm'>Career Trajectory</h3>
                                        <p className='text-primary text-xs mt-1'>Optimization Complete • +45% Growth</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HeroSection