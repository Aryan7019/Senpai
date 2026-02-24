"use client"
import { entrySchema } from '@/app/lib/schema'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, PlusCircle, Sparkles, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import useFetch from '@/hooks/use-fetch'
import { improveWithAi } from '@/actions/resume'
import { toast } from 'sonner'
import { format, parse } from 'date-fns'

const EntryForm = ({ type, entries, onChange }: any) => {
    const [isAdding, setIsAdding] = useState(false)
    const formatDisplayDate = (dateString: any) => {
        if (!dateString) return ""
        const date = parse(dateString, "yyyy-MM", new Date());
        return format(date, "MMM yyyy")
    }
    const {
        register, watch, handleSubmit: handleValidation,
        formState: { errors }, setValue, reset
    } = useForm({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "", organization: "", startDate: "", endDate: "", description: "", current: false
        }
    })
    const current = watch("current");
    const description = watch("description");

    const {
        loading: isImproving, fn: improveWithAiFn,
        data: improvedContent, error: improveError
    } = useFetch(improveWithAi)

    const handleDelete = (index: any) => {
        //@ts-ignore
        const newEntries = entries.filter((_: any, i: number) => i !== index)
        onChange(newEntries)
    }
    const handleAdd = handleValidation((data) => {
        const formattedEntry = {
            ...data,
            startDate: formatDisplayDate(data.startDate),
            endDate: data.current ? "" : formatDisplayDate(data.endDate)
        }
        onChange([...entries, formattedEntry]);
        reset;
        setIsAdding(false)
    })

    useEffect(() => {
        if (improvedContent && !isImproving) {
            setValue("description", improvedContent)
            toast.success("Description improved successfully!")
        }
        if (improveError) {
            const message = (improveError as any)?.message || String((improveError as any)) || "Failed to improve description"
            toast.error(message)
        }
    }, [improvedContent, improveError, isImproving])

    const handleImproveDescription = async () => {
        if (!description) { toast.error("Please enter a description first"); return }
        const organization = watch("organization");
        const title = watch("title");
        await improveWithAiFn({
            current: description,
            type: type.toLowerCase(),
            organization: organization.toLowerCase(),
            title: title.toLowerCase()
        })
    }

    return (
        <div className='space-y-4'>
            <div className='space-y-3'>
                {entries.map((item: any, index: any) => (
                    <div key={index} className="group relative bg-[#0a0a0a]/60 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-primary/20 transition-all">
                        <div className='flex items-start justify-between mb-3'>
                            <div>
                                <h4 className='text-sm font-bold text-white/90'>{item.title} <span className="text-white/40 font-medium">@ {item.organization}</span></h4>
                                <p className='text-xs text-white/40 mt-1'>
                                    {item.current ? `${item.startDate} - Present` : `${item.startDate} - ${item.endDate}`}
                                </p>
                            </div>
                            <Button variant="ghost" size="icon" type='button' onClick={() => handleDelete(index)} className="h-8 w-8 rounded-lg text-white/30 hover:text-red-400 hover:bg-red-500/10">
                                <X className='h-4 w-4' />
                            </Button>
                        </div>
                        <p className='text-sm text-white/60 whitespace-pre-wrap leading-relaxed'>{item.description}</p>
                    </div>
                ))}
            </div>

            {isAdding && (
                <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-primary/20 rounded-2xl overflow-hidden">
                    <div className="p-5 border-b border-white/5">
                        <h4 className="font-bold text-white/90">Add {type}</h4>
                        <p className="text-xs text-white/40 mt-1">Add your {type.toLowerCase()} information</p>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className='space-y-2'>
                                <Input placeholder='Title/Position' {...register("title")} aria-invalid={!!errors.title} />
                                {errors.title && (<p className="text-sm text-red-400">{errors.title.message}</p>)}
                            </div>
                            <div className='space-y-2'>
                                <Input placeholder='Organization/Company' {...register("organization")} aria-invalid={!!errors.organization} />
                                {errors.organization && (<p className="text-sm text-red-400">{errors.organization.message}</p>)}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className='space-y-2'>
                                <Input type='month' placeholder='Start Date' {...register("startDate")} aria-invalid={!!errors.startDate} />
                                {errors.startDate && (<p className="text-sm text-red-400">{errors.startDate.message}</p>)}
                            </div>
                            <div className='space-y-2'>
                                <Input type='month' placeholder='End Date' {...register("endDate")} disabled={current} aria-invalid={!!errors.endDate} />
                                {errors.endDate && (<p className="text-sm text-red-400">{errors.endDate.message}</p>)}
                            </div>
                        </div>
                        <div className='flex items-center space-x-2'>
                            <input type='checkbox' id='current' {...register("current")}
                                className="accent-primary"
                                onChange={(e) => {
                                    setValue("current", e.target.checked)
                                    if (e.target.checked) setValue('endDate', "")
                                }}
                            />
                            <label htmlFor='current' className="text-sm font-medium text-white/70">Current {type}</label>
                        </div>
                        <div className='space-y-2'>
                            <Textarea className='h-32' placeholder={`Description of your ${type.toLowerCase()}`}
                                {...register("description")} aria-invalid={!!errors.description}
                            />
                            {errors.description && (<p className="text-sm text-red-400">{errors.description.message}</p>)}
                            <Button type='button' variant="ghost" size="sm" onClick={handleImproveDescription}
                                disabled={isImproving || !description}
                                className="mt-2 text-primary hover:text-primary/80 hover:bg-primary/10 font-bold"
                            >
                                {isImproving ? (
                                    <><Loader2 className='h-4 w-4 mr-2 animate-spin' /> Improving...</>
                                ) : (
                                    <><Sparkles className='h-4 w-4 mr-2' /> Improve with AI</>
                                )}
                            </Button>
                        </div>
                    </div>
                    <div className="p-5 border-t border-white/5 flex justify-end gap-3">
                        <Button type='button' variant="ghost" onClick={() => { reset(); setIsAdding(false) }}
                            className="text-white/50 hover:text-white hover:bg-white/5">
                            Cancel
                        </Button>
                        <Button type='button' onClick={handleAdd}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-[0_0_15px_-5px_var(--color-primary)]">
                            <PlusCircle className='h-4 w-4' /> Add Entry
                        </Button>
                    </div>
                </div>
            )}

            {!isAdding && (
                <Button className='w-full bg-[#0a0a0a]/60 border border-dashed border-white/10 text-white/50 hover:text-primary hover:border-primary/30 hover:bg-primary/5 rounded-2xl h-12 font-bold'
                    variant="ghost" onClick={() => setIsAdding(true)}>
                    <PlusCircle className='h-4 w-4 mr-2' /> Add {type}
                </Button>
            )}
        </div>
    )
}

export default EntryForm