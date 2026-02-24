"use client"
import { Button } from '@/components/ui/button'
import { Download, Loader2, Save, ChevronDown, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { resumeSchema } from '@/app/lib/schema'
import useFetch from '@/hooks/use-fetch'
import { saveResume } from '@/actions/resume'
import EntryForm from './entry-form'
import { entriesToMarkdown, certificationsToMarkdown } from '@/app/lib/helper'
import { useUser } from '@clerk/nextjs'
import { toast } from 'sonner'
import ResumePreview from './resume-preview'
import ATSScore from './ats-score'

const ResumeBuilder = ({ initialContent, initialFormData }: any) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [isMounted, setIsMounted] = useState(false)
    const [previewContent, setPreviewContent] = useState(initialContent || "")
    const { user } = useUser();

    const [openSections, setOpenSections] = useState<Record<string, boolean>>({
        contact: true, summary: true, skills: false, experience: true,
        education: false, projects: false, certifications: false,
        achievements: false, languages: false,
    });
    const toggleSection = (key: string) => setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));

    const parsedFormData = initialFormData ? JSON.parse(initialFormData) : null;
    useEffect(() => { setIsMounted(true) }, [])

    const { control, register, watch } = useForm({
        resolver: zodResolver(resumeSchema),
        defaultValues: parsedFormData || {
            contactInfo: { email: "", mobile: "", linkedin: "", github: "", twitter: "", leetcode: "" },
            summary: "", skills: "", experience: [], projects: [], education: [],
            certifications: [], achievements: "", languages: "",
        }
    })

    const { loading: isSaving, fn: saveResumeFn } = useFetch(saveResume)
    const formValues = watch()

    const getContactMarkdown = () => {
        const { contactInfo } = formValues || {};
        if (!contactInfo) return "";
        const parts = [];
        if (contactInfo.email) parts.push(`📧 ${contactInfo.email}`);
        if (contactInfo.mobile) parts.push(`📱 ${contactInfo.mobile}`);
        if (contactInfo.linkedin) parts.push(`[LinkedIn](${contactInfo.linkedin})`);
        if (contactInfo.github) parts.push(`[GitHub](${contactInfo.github})`);
        if (contactInfo.twitter) parts.push(`[Twitter](${contactInfo.twitter})`);
        if (contactInfo.leetcode) parts.push(`[LeetCode](${contactInfo.leetcode})`);
        return parts.length > 0
            ? `<div align="center">\n\n# ${user?.fullName || 'Your Name'}\n\n${parts.join(" | ")}\n\n</div>`
            : `<div align="center">\n\n# ${user?.fullName || 'Your Name'}\n\n</div>`;
    }

    const getCombinedContent = () => {
        const { summary, skills, experience, education, projects, certifications, achievements, languages } = formValues || {}
        return [
            getContactMarkdown(),
            summary && `## Professional Summary\n\n${summary}`,
            skills && `## Skills\n\n${skills}`,
            experience?.length > 0 && entriesToMarkdown({ entries: experience, type: "Work Experience" }),
            education?.length > 0 && entriesToMarkdown({ entries: education, type: "Education" }),
            projects?.length > 0 && entriesToMarkdown({ entries: projects, type: "Projects" }),
            certifications?.length > 0 && certificationsToMarkdown(certifications),
            achievements && `## Achievements & Awards\n\n${achievements}`,
            languages && `## Languages\n\n${languages}`,
        ].filter(Boolean).join("\n\n")
    }

    useEffect(() => {
        setPreviewContent(getCombinedContent() || initialContent || "")
    }, [formValues])

    const onSubmit = async () => {
        try { await saveResumeFn(getCombinedContent(), formValues); }
        catch (error: any) { toast.error(error?.message || "Failed to save resume"); }
    };

    const generatePDF = async () => {
        if (typeof window === 'undefined') return;
        setIsGenerating(true);
        try {
            // @ts-ignore
            const html2canvas = (await import("html2canvas")).default;
            // @ts-ignore
            const jsPDF = (await import("jspdf")).jsPDF;
            const iframe = document.createElement('iframe');
            iframe.style.cssText = 'position:absolute;left:-9999px;top:-9999px;width:794px;height:1123px;';
            document.body.appendChild(iframe);
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (!iframeDoc) throw new Error("Could not access iframe");
            iframeDoc.open();
            iframeDoc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
                *{margin:0;padding:0;box-sizing:border-box}
                body{font-family:'Inter',sans-serif;line-height:1.5;color:#000;background:#fff;padding:50px 40px;font-size:14px}
                h1{font-size:36px;font-weight:bold;margin:0 0 8px;text-align:center;letter-spacing:-0.5px}
                h2{font-size:20px;font-weight:bold;margin:24px 0 12px;text-transform:uppercase;letter-spacing:0.5px;border-bottom:2px solid #000;padding-bottom:4px}
                h3{font-size:16px;font-weight:bold;margin:16px 0 6px}
                p{margin:6px 0;line-height:1.6;font-size:14px}
                a{color:#000;text-decoration:none;font-weight:500}
                ul,ol{margin:8px 0;padding-left:20px}li{margin:3px 0;line-height:1.5;font-size:14px}
                div[align="center"]{text-align:center}
            </style></head><body><div id="resume-content"></div></body></html>`);
            iframeDoc.close();
            await new Promise(r => { iframe.onload = r; if (iframe.contentDocument?.readyState === 'complete') r(null); });
            const { marked } = await import('marked');
            let html = await marked(previewContent);
            html = html.replace(/<div align="center">/g, '<div style="text-align:center;">').replace(/(📧|📱|🔗)/g, '<span style="font-size:14px;margin-right:4px;">$1</span>');
            const el = iframeDoc.getElementById('resume-content');
            if (el) el.innerHTML = html;
            await new Promise(r => setTimeout(r, 500));
            //@ts-ignore
            const canvas = await html2canvas(iframeDoc.body, { useCORS: true, allowTaint: true, backgroundColor: '#fff', width: 794, height: 1123 });
            document.body.removeChild(iframe);
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('portrait', 'mm', 'a4');
            const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
            const ratio = Math.min(pw / canvas.width, ph / canvas.height);
            pdf.addImage(imgData, 'PNG', (pw - canvas.width * ratio) / 2, 10, canvas.width * ratio, canvas.height * ratio);
            pdf.save('resume.pdf');
            toast.success("PDF generated successfully!");
        } catch { toast.error("Failed to generate PDF."); } finally { setIsGenerating(false); }
    };

    if (!isMounted) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
    }

    let sectionCounter = 0;
    const nextNum = () => ++sectionCounter;

    const SectionHead = ({ id, title, count }: { id: string; title: string; count?: number }) => {
        const num = nextNum();
        return (
            <div className="flex items-center justify-between cursor-pointer group" onClick={() => toggleSection(id)}>
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${openSections[id]
                        ? 'bg-primary/20 text-primary'
                        : 'bg-secondary border border-border text-muted-foreground'
                        }`}>
                        {num}
                    </span>
                    {title}
                    {count !== undefined && count > 0 && (
                        <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">{count}</span>
                    )}
                </h2>
                {openSections[id]
                    ? <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    : <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                }
            </div>
        );
    };

    const inputCls = "w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground";

    return (
        <div className="flex flex-1">
            {/* ═══════════════════════════════════════════════════ */}
            {/* LEFT PANEL: Editor — scrollable                     */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="w-full lg:w-5/12 flex flex-col border-r border-border bg-background">
                <div className="p-6 md:p-8 space-y-8 pb-32">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Resume Content</h1>
                            <p className="text-sm text-muted-foreground mt-1">Fill in your details. Our AI will polish the rest.</p>
                        </div>
                    </div>

                    {/* 1 — Contact Info */}
                    <div className="space-y-4">
                        <SectionHead id="contact" title="Contact Information" />
                        {openSections.contact && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">Email</label>
                                    <input {...register("contactInfo.email")} type="email" placeholder="your@email.com" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">Phone</label>
                                    <input {...register("contactInfo.mobile")} type="tel" placeholder="+1 234 567 8900" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">LinkedIn</label>
                                    <input {...register("contactInfo.linkedin")} type="url" placeholder="linkedin.com/in/profile" className={inputCls} />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">GitHub</label>
                                    <input {...register("contactInfo.github")} type="url" placeholder="github.com/profile" className={inputCls} />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-medium text-muted-foreground uppercase mb-1">Professional Summary</label>
                                    <Controller name='summary' control={control}
                                        render={({ field }) => <textarea {...field} rows={4} placeholder='Write a compelling professional summary...' className={`${inputCls} resize-none`} />}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 2 — Experience */}
                    <div className="space-y-4">
                        <SectionHead id="experience" title="Experience" count={formValues.experience?.length} />
                        {openSections.experience && (
                            <Controller name='experience' control={control}
                                render={({ field }) => <EntryForm type="experience" entries={field.value} onChange={field.onChange} />}
                            />
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 3 — Education */}
                    <div className="space-y-4">
                        <SectionHead id="education" title="Education" count={formValues.education?.length} />
                        {openSections.education && (
                            <Controller name='education' control={control}
                                render={({ field }) => <EntryForm type="education" entries={field.value} onChange={field.onChange} />}
                            />
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 4 — Skills */}
                    <div className="space-y-4">
                        <SectionHead id="skills" title="Skills" />
                        {openSections.skills && (
                            <Controller name='skills' control={control}
                                render={({ field }) => <textarea {...field} rows={3} placeholder='List your key skills...' className={`${inputCls} resize-none`} />}
                            />
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 5 — Projects */}
                    <div className="space-y-4">
                        <SectionHead id="projects" title="Projects" count={formValues.projects?.length} />
                        {openSections.projects && (
                            <Controller name='projects' control={control}
                                render={({ field }) => <EntryForm type="projects" entries={field.value} onChange={field.onChange} />}
                            />
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 6 — Certifications */}
                    <div className="space-y-4">
                        <SectionHead id="certifications" title="Certifications" count={formValues.certifications?.length} />
                        {openSections.certifications && (
                            <Controller name='certifications' control={control}
                                render={({ field }) => <CertificationForm entries={field.value || []} onChange={field.onChange} />}
                            />
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 7 — Achievements */}
                    <div className="space-y-4">
                        <SectionHead id="achievements" title="Achievements & Awards" />
                        {openSections.achievements && (
                            <Controller name='achievements' control={control}
                                render={({ field }) => <textarea {...field} rows={3} placeholder="Dean's List, Hackathon Winner..." className={`${inputCls} resize-none`} />}
                            />
                        )}
                    </div>

                    <hr className="border-border" />

                    {/* 8 — Languages */}
                    <div className="space-y-4">
                        <SectionHead id="languages" title="Languages" />
                        {openSections.languages && (
                            <Controller name='languages' control={control}
                                render={({ field }) => <textarea {...field} rows={2} placeholder="English (Native), Hindi (Fluent)..." className={`${inputCls} resize-none`} />}
                            />
                        )}
                    </div>
                </div>

                {/* Mobile bottom bar */}
                <div className="sticky bottom-0 left-0 right-0 p-4 bg-background border-t border-border lg:hidden z-10">
                    <Button onClick={generatePDF} disabled={isGenerating} className="w-full gradient text-primary-foreground font-bold">
                        {isGenerating ? <><Loader2 className='h-4 w-4 animate-spin' /> Generating...</> : <><Download className='h-4 w-4' /> Download Resume</>}
                    </Button>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════ */}
            {/* RIGHT PANEL: Preview — fixed with dark bg           */}
            {/* ═══════════════════════════════════════════════════ */}
            <section className="hidden lg:block flex-1 bg-secondary">
                <div className="sticky top-0 h-screen flex flex-col items-center p-8 relative">
                    {/* Floating ATS Widget */}
                    <div className="absolute top-6 right-8 z-10">
                        <ATSScore content={previewContent} />
                    </div>

                    {/* Paper area */}
                    <div className="flex-1 w-full flex justify-center pt-4 pb-24">
                        <div className="origin-top" style={{ transform: 'scale(0.9)' }}>
                            <ResumePreview content={previewContent} />
                        </div>
                    </div>

                    {/* Bottom Floating Action Bar */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 gold-border-gradient p-2 rounded-xl shadow-2xl shadow-black/50 z-20">
                        <button onClick={onSubmit} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-lg transition-colors disabled:opacity-50">
                            {isSaving ? 'Saving...' : 'Save Draft'}
                        </button>
                        <div className="w-px h-6 bg-border" />
                        <Button onClick={generatePDF} disabled={isGenerating} className="gradient text-primary-foreground font-bold px-6 text-sm shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                            {isGenerating ? <><Loader2 className='h-4 w-4 animate-spin' /> Generating...</> : <><Download className='h-4 w-4' /> Download PDF</>}
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}

// ━━━ Certification Sub-form ━━━
function CertificationForm({ entries, onChange }: { entries: any[]; onChange: (v: any[]) => void }) {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState(""); const [organization, setOrganization] = useState("");
    const [date, setDate] = useState(""); const [credentialId, setCredentialId] = useState("");
    const inputCls = "w-full bg-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground";

    const handleAdd = () => {
        if (!name.trim() || !organization.trim()) return;
        onChange([...entries, { name, organization, date, credentialId }]);
        setName(""); setOrganization(""); setDate(""); setCredentialId(""); setIsAdding(false);
    };

    return (
        <div className="space-y-2">
            {entries.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-secondary border border-border group">
                    <div>
                        <p className="text-sm font-bold text-foreground">{cert.name}</p>
                        <p className="text-xs text-muted-foreground">{cert.organization}{cert.date ? ` • ${cert.date}` : ''}</p>
                    </div>
                    <button type="button" onClick={() => onChange(entries.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all">✕</button>
                </div>
            ))}
            {isAdding ? (
                <div className="space-y-3 p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <div className="grid grid-cols-2 gap-2">
                        <input value={name} onChange={e => setName(e.target.value)} placeholder="Certification name" className={inputCls} />
                        <input value={organization} onChange={e => setOrganization(e.target.value)} placeholder="Issuing organization" className={inputCls} />
                        <input value={date} onChange={e => setDate(e.target.value)} placeholder="Date (e.g. Jan 2024)" className={inputCls} />
                        <input value={credentialId} onChange={e => setCredentialId(e.target.value)} placeholder="Credential ID (optional)" className={inputCls} />
                    </div>
                    <div className="flex gap-2 justify-end">
                        <button type="button" onClick={() => setIsAdding(false)} className="text-xs text-muted-foreground hover:text-foreground px-3 py-1.5">Cancel</button>
                        <button type="button" onClick={handleAdd} className="text-xs gradient text-primary-foreground font-bold px-4 py-1.5 rounded-lg">Add</button>
                    </div>
                </div>
            ) : (
                <button type="button" onClick={() => setIsAdding(true)} className="w-full text-xs border border-dashed border-border text-muted-foreground hover:text-primary hover:border-primary/30 rounded-xl py-2.5 transition-colors">
                    + Add Certification
                </button>
            )}
        </div>
    );
}

export default ResumeBuilder