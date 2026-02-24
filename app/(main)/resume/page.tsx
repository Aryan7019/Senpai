import { getResume } from '@/actions/resume'
import ResumeBuilder from './_components/resume-builder'

const ResumePage = async () => {
  const resume = await getResume()

  return (
    <div className="min-h-screen">
      <ResumeBuilder
        initialContent={resume?.content}
        initialFormData={resume?.formData}
      />
    </div>
  )
}

export default ResumePage