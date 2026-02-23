import React, { ReactNode, Suspense } from 'react'
import { Loader2 } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center w-full min-h-screen bg-[#020202] gap-4">
                <Loader2 className="w-16 h-16 animate-spin text-primary shadow-[0_0_15px_var(--color-primary)] rounded-full" />
                <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary/80 animate-pulse">Loading Analytics...</p>
            </div>
        }>{children}</Suspense>
    )
}

export default Layout