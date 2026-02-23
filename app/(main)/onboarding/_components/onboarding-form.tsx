"use client"
import { Industry } from '@/data/industries';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, } from '@/app/lib/schema';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { updateUser } from '@/actions/user';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
type OnBoardingFormData = {
    industry: string;
    subIndustry: string;
    bio?: string;
    experience: number;
    skills?: string[];
};
interface OnBoardingFormProps {
    industries: Industry[];
    initialData?: any;
}
const OnBoardingForm = ({ industries, initialData }: OnBoardingFormProps) => {
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);
    const router = useRouter();
    const { data: updateResult, loading: updateLoading, fn: updateUserFn } = useFetch(updateUser);
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
        resolver: zodResolver(onboardingSchema)
    });
    const watchIndustry = watch('industry');

    useEffect(() => {
        if (initialData) {
            if (initialData.industry) {
                // The industry is saved as "industryId-subindustry", we need to split it
                // e.g "tech-software-engineering" -> industry: "tech", subIndustry: "software engineering"
                // It might be easier to match against the industries list to find the parent
                const matchedInd = industries.find(ind => initialData.industry.startsWith(`${ind.id}-`));
                if (matchedInd) {
                    setValue('industry', matchedInd.id);
                    setSelectedIndustry(matchedInd);

                    // extract the rest
                    const remaining = initialData.industry.replace(`${matchedInd.id}-`, '');
                    // try to match subindustry exact name by normalizing back
                    const matchedSub = matchedInd.subIndustries.find(
                        sub => sub.toLowerCase().replace(/ /g, "-") === remaining
                    );

                    if (matchedSub) {
                        setValue('subIndustry', matchedSub);
                    }
                }
            }
            if (initialData.experience) setValue('experience', initialData.experience);
            if (initialData.skills && initialData.skills.length > 0) {
                setValue('skills', initialData.skills.join(', '));
            }
            if (initialData.bio) setValue('bio', initialData.bio);
        }
    }, [initialData, industries, setValue]);

    const onSubmit = async (values: OnBoardingFormData) => {
        try {
            const formattedIndustry = `${values.industry}-${values.subIndustry
                .toLowerCase()
                .replace(/ /g, "-")}`;
            await updateUserFn({
                ...values,
                industry: formattedIndustry,
            });

        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    useEffect(() => {
        if (updateResult && !updateLoading) {
            toast.success("Profile updated successfully!");
            router.push('/dashboard');
            router.refresh();
        }
    }, [updateResult, updateLoading, router]);

    return (
        <div className='w-full max-w-2xl'>
            <Card className='relative overflow-hidden bg-[#050505]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-4 md:p-8 shadow-[0_0_80px_-15px_rgba(var(--color-primary),0.2)]'>
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none rounded-[2.5rem]" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />

                <CardHeader className="pb-8 text-center sm:text-left relative z-10">
                    <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/20 backdrop-blur-md shadow-[0_0_15px_-3px_var(--color-primary)] text-primary uppercase tracking-[0.2em] text-[10px] font-black w-fit sm:mx-0 mx-auto">
                        <span className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_var(--color-primary)]"></span>
                        Profile Setup
                    </div>
                    <CardTitle className='text-4xl md:text-5xl font-black tracking-tighter text-white mb-2 leading-[1.1]'>
                        Complete Your <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary via-primary/80 to-primary/40 drop-shadow-sm">Identity</span>
                    </CardTitle>
                    <CardDescription className="text-base text-muted-foreground/80 max-w-md mx-auto sm:mx-0">
                        Select your industry to unlock personalized career insights, mock interviews, and tailored AI recommendations.
                    </CardDescription>
                </CardHeader>

                <CardContent className="relative z-10">
                    <form className='space-y-8' onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className='space-y-2.5'>
                                <Label htmlFor="industry" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Industry</Label>
                                <Select
                                    value={watchIndustry}
                                    onValueChange={(value: string) => {
                                        setValue('industry', value);
                                        setSelectedIndustry(
                                            industries.find((ind) => ind.id === value) || null
                                        );
                                        setValue('subIndustry', '');
                                    }}
                                >
                                    <SelectTrigger id='industry' className="w-full bg-[#1a1a1a] border-white/5 focus:ring-primary/50 focus:border-primary h-14 text-base rounded-2xl text-white shadow-inner transition-all">
                                        <SelectValue placeholder="Select an Industry" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-[#111111] border-white/10 text-white rounded-2xl shadow-2xl">
                                        {industries.map((industry) => {
                                            return (
                                                <SelectItem key={industry.id} value={industry.id} className="focus:bg-white/10 focus:text-white rounded-xl my-0.5 cursor-pointer">
                                                    {industry.name}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                                {errors.industry && (
                                    <p className='text-sm text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded border border-red-400/20 inline-block'>{errors.industry.message?.toString()}</p>
                                )}
                            </div>

                            {watchIndustry && (
                                <div className='space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-300'>
                                    <Label htmlFor="subIndustry" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Specialization</Label>
                                    <Select
                                        value={watch('subIndustry')}
                                        onValueChange={(value: string) => {
                                            setValue('subIndustry', value);
                                        }}
                                    >
                                        <SelectTrigger id='subIndustry' className="w-full bg-[#1a1a1a] border-white/5 focus:ring-primary/50 focus:border-primary h-14 text-base rounded-2xl text-white shadow-inner transition-all">
                                            <SelectValue placeholder="Select a Specialization" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#111111] border-white/10 text-white rounded-2xl shadow-2xl">
                                            {selectedIndustry?.subIndustries.map((subIndustry) => {
                                                return (
                                                    <SelectItem key={subIndustry} value={subIndustry} className="focus:bg-white/10 focus:text-white rounded-xl my-0.5 cursor-pointer">
                                                        {subIndustry}
                                                    </SelectItem>
                                                )
                                            })}
                                        </SelectContent>
                                    </Select>
                                    {errors.subIndustry && (
                                        <p className='text-sm text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded border border-red-400/20 inline-block'>{errors.subIndustry.message?.toString()}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className='space-y-2.5'>
                                <Label htmlFor="experience" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Years of Experience</Label>
                                <Input id="experience" type='number' min="0" max="50" placeholder="e.g. 5"
                                    className="bg-[#1a1a1a] border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary h-14 text-base rounded-2xl text-white shadow-inner transition-all"
                                    {...register('experience')} />

                                {errors.experience && (
                                    <p className='text-sm text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded border border-red-400/20 inline-block'>{errors.experience.message?.toString()}</p>
                                )}
                            </div>

                            <div className='space-y-2.5'>
                                <Label htmlFor="skills" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Key Skills</Label>
                                <Input id="skills" placeholder="React, Node.js, Python..."
                                    className="bg-[#1a1a1a] border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary h-14 text-base rounded-2xl text-white shadow-inner transition-all"
                                    {...register('skills')} />
                                <p className='text-[10px] text-muted-foreground/60 font-semibold uppercase tracking-wider ml-1'>Separate with commas</p>

                                {errors.skills && (
                                    <p className='text-sm text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded border border-red-400/20 inline-block'>{errors.skills.message?.toString()}</p>
                                )}
                            </div>
                        </div>

                        <div className='space-y-2.5'>
                            <Label htmlFor="bio" className="text-xs font-bold text-muted-foreground uppercase tracking-widest ml-1">Professional Bio</Label>
                            <Textarea id="bio" placeholder="Tell us briefly about your professional background and goals..."
                                className="bg-[#1a1a1a] border-white/5 focus-visible:ring-primary/50 focus-visible:border-primary min-h-[140px] text-base rounded-2xl text-white shadow-inner resize-y transition-all p-4 leading-relaxed"
                                {...register('bio')} />

                            {errors.bio && (
                                <p className='text-sm text-red-400 font-medium px-2 py-1 bg-red-400/10 rounded border border-red-400/20 inline-block'>{errors.bio.message?.toString()}</p>
                            )}
                        </div>

                        <div className="pt-4">
                            <Button type='submit' className='w-full h-14 rounded-2xl text-base font-bold text-white bg-primary hover:bg-primary/90 shadow-[0_0_30px_-5px_var(--color-primary)] transition-all group shrink-0' disabled={updateLoading}>
                                {updateLoading ? (
                                    <>
                                        <Loader2 className='animate-spin mr-2 h-5 w-5' />
                                        Saving Profile...
                                    </>

                                ) : (
                                    <>
                                        {initialData?.industry ? "Update Profile & Sync Data" : "Complete Profile & Enter Platform"}
                                        <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default OnBoardingForm