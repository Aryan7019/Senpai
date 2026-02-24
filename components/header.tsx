"use client";

import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { ChevronDown, FileText, GraduationCap, LayoutDashboard, PenBox, Video } from 'lucide-react'
import { DropdownMenuContent, DropdownMenuTrigger, DropdownMenu, DropdownMenuItem } from './ui/dropdown-menu'

const Header = () => {
  return (
    <header className='fixed top-0 w-full border-b bg-background/95 backdrop-blur-sm z-50'>
      <nav className='container mx-auto px-4 h-16 flex items-center justify-between'>
        <Link href="/" className='flex items-center gap-2 group'>
          <Image
            src="/Logo.jpeg"
            alt="SenpAI Logo"
            width={180}
            height={60}
            className='object-contain h-12 w-auto'
            priority
          />
        </Link>
        <div className='flex items-center gap-2'>
          <SignedIn>
            <Link href={"/dashboard"}>
              <Button variant={"ghost"} size="sm">
                <LayoutDashboard className='h-4 w-4 mr-1.5' />
                <span className="hidden md:inline">Dashboard</span>
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <span>Tools</span>
                  <ChevronDown className='h-3.5 w-3.5 ml-1' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className='w-44'>
                <DropdownMenuItem asChild>
                  <Link href={"/resume"} className='flex items-center gap-2 cursor-pointer'>
                    <FileText className='h-4 w-4' />
                    <span>Resume Builder</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/ai-cover-letter"} className='flex items-center gap-2 cursor-pointer'>
                    <PenBox className='h-4 w-4' />
                    <span>Cover Letter</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/interview"} className='flex items-center gap-2 cursor-pointer'>
                    <GraduationCap className='h-4 w-4' />
                    <span>Interview Prep</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/courses"} className='flex items-center gap-2 cursor-pointer'>
                    <Video className='h-4 w-4' />
                    <span>Course Generator</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant={"ghost"} size="sm">Sign In</Button>
            </SignInButton>
            <Link href="/sign-up">
              <Button size="sm">
                Get Started
              </Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8",
                  userButtonPopoverCard: "shadow-xl",
                  userPreviewMainIdentifier: "font-semibold"
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>

    </header>
  )
}

export default Header