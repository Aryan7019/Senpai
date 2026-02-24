"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2, FileText, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/actions/cover-letter";

export default function CoverLetterList({ coverLetters }: any) {
  const router = useRouter();

  const handleDelete = async (id: any) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-16 bg-[#050505]/40 backdrop-blur-xl border border-white/5 rounded-3xl text-center">
        <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-white/15" />
        </div>
        <h3 className="text-xl font-bold text-white/80">No cover letters yet</h3>
        <p className="text-white/40 mt-2 max-w-md text-sm leading-relaxed">
          Create your first AI-powered cover letter to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {coverLetters.map((letter: any) => (
        <div key={letter.id} className="group relative">
          <div className="absolute -inset-0.5 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent rounded-[2rem] blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500" />

          <div className="relative bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/5 rounded-[2rem] overflow-hidden hover:border-primary/20 transition-all duration-300 h-full flex flex-col">
            {/* Top accent */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary shrink-0" />
                    <h3 className="font-bold text-white text-lg line-clamp-1">{letter.jobTitle}</h3>
                  </div>
                  <p className="text-sm text-white/50">at <span className="text-white/70 font-medium">{letter.companyName}</span></p>
                </div>
                <span className="text-xs text-white/30 font-medium shrink-0 ml-4">
                  {format(new Date(letter.createdAt), "dd MMM yyyy")}
                </span>
              </div>

              <p className="text-sm text-white/40 line-clamp-3 leading-relaxed">
                {letter.jobDescription}
              </p>
            </div>

            <div className="p-4 border-t border-white/5 flex justify-end gap-2">
              <Button variant="ghost" size="sm"
                onClick={() => router.push(`/ai-cover-letter/${letter.id}`)}
                className="text-white/50 hover:text-primary hover:bg-primary/10 font-medium rounded-xl">
                <Eye className="h-4 w-4 mr-1" /> View
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-xl">
                    <Trash2 className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-[#0a0a0a] border border-white/10 rounded-2xl">
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-white">Delete Cover Letter?</AlertDialogTitle>
                    <AlertDialogDescription className="text-white/50">
                      This action cannot be undone. This will permanently delete your cover letter for {letter.jobTitle} at {letter.companyName}.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10">Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(letter.id)}
                      className="bg-red-600 text-white hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}