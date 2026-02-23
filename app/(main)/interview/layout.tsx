import React, { ReactNode, Suspense } from 'react'
import { Loader2 } from "lucide-react";

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='px-5'>
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center w-full min-h-[60vh] gap-4">
                    <Loader2 className="w-16 h-16 animate-spin text-primary" />
                    <p className="text-sm font-bold tracking-[0.2em] uppercase text-primary/80 animate-pulse">Loading...</p>
                </div>
            }>{children}</Suspense>
        </div>
    )
}

export default Layout