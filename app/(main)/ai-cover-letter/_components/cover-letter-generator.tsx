"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateCoverLetter } from "@/actions/cover-letter";
import useFetch from "@/hooks/use-fetch";
import { coverLetterSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";

export default function CoverLetterGenerator() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(coverLetterSchema),
  });

  const {
    loading: generating,
    fn: generateLetterFn,
    data: generatedLetter,
  } = useFetch(generateCoverLetter);

  useEffect(() => {
    if (generatedLetter) {
      toast.success("Cover letter generated successfully!");
      //@ts-ignore
      router.push(`/ai-cover-letter/${generatedLetter?.id}`);
      reset();
    }
  }, [generatedLetter]);

  const onSubmit = async (data: any) => {
    try {
      await generateLetterFn(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to generate cover letter");
    }
  };

  return (
    <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-white/5 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <h2 className="text-lg font-bold text-white/90 flex items-center gap-2">
          <div className="w-1.5 h-5 rounded-full bg-primary" /> Job Details
        </h2>
        <p className="text-sm text-white/40 mt-1 ml-4">
          Provide information about the position you&apos;re applying for
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium text-white/70">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Enter company name"
              {...register("companyName")}
            />
            {errors.companyName && (
              <p className="text-sm text-red-400">{errors.companyName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="jobTitle" className="text-sm font-medium text-white/70">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="Enter job title"
              {...register("jobTitle")}
            />
            {errors.jobTitle && (
              <p className="text-sm text-red-400">{errors.jobTitle.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobDescription" className="text-sm font-medium text-white/70">Job Description</Label>
          <Textarea
            id="jobDescription"
            placeholder="Paste the job description here"
            className="h-36"
            {...register("jobDescription")}
          />
          {errors.jobDescription && (
            <p className="text-sm text-red-400">{errors.jobDescription.message}</p>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={generating}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_20px_-5px_var(--color-primary)] h-12 px-8 rounded-xl">
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Cover Letter
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}