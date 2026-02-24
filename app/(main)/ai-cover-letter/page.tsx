import { getCoverLetters } from "@/actions/cover-letter";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import CoverLetterList from "./_components/cover-letter-list";

export default async function CoverLetterPage() {
  const coverLetters = await getCoverLetters();

  return (
    <div className="relative min-h-screen overflow-hidden w-full text-white">
      <div className="absolute inset-0 bg-[#020202] -z-20" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto py-10 px-4 md:px-8 relative z-10 max-w-7xl space-y-10">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_-3px_var(--color-primary)] text-primary uppercase tracking-[0.2em] text-[10px] font-black">
              <FileText className="w-3 h-3" /> Cover Letters
            </div>
            <h1 className="font-black text-4xl md:text-5xl tracking-tight text-white">
              My <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary/40">Cover Letters</span>
            </h1>
          </div>
          <Link href="/ai-cover-letter/new">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_var(--color-primary)] h-12 px-6 rounded-xl">
              <Plus className="h-4 w-4 mr-2" /> Create New
            </Button>
          </Link>
        </div>

        <CoverLetterList coverLetters={coverLetters} />
      </div>
    </div>
  );
}