import { getResume } from '@/actions/resume'
import ResumeBuilder from './_components/resume-builder'

const ResumePage = async () => {
  const resume = await getResume()

  return (
    <div className="relative min-h-screen overflow-hidden w-full text-white">
      <div className="absolute inset-0 bg-[#020202] -z-20" />
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] pointer-events-none -z-10" />
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container mx-auto py-10 px-4 md:px-8 relative z-10 max-w-7xl">
        <ResumeBuilder
          initialContent={resume?.content}
          initialFormData={resume?.formData}
        />
      </div>
    </div>
  )
}

export default ResumePage