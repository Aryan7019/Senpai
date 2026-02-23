import { getIndustryInsights } from '@/actions/dashboard';
import { getUserOnboardingStatus } from '@/actions/user';
import { redirect } from 'next/navigation';
import React from 'react'
import DashboardView from './_components/DashboardView';

const IndustryInsightsPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();

  if (!isOnboarded) {
    redirect('/onboarding')
  }
  const insights = await getIndustryInsights()
  return (
    <main className="relative min-h-screen overflow-hidden w-full">
      {/* Elevated deeper dark background with premium grid */}
      <div className="absolute inset-0 bg-[#020202] -z-20" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none -z-10"></div>

      {/* Decorative ambient glows */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[150px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto px-4 pt-4 pb-12 md:pt-6 md:pb-16 relative z-10 w-full">
        <DashboardView insights={insights} />
      </div>
    </main>
  )
}

export default IndustryInsightsPage