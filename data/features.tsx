import { Briefcase, ScrollText, LineChart, Video } from "lucide-react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: <ScrollText />,
    title: "Resume & Cover Letter Builder",
    description:
      "Build ATS-optimized resumes and generate tailored cover letters with AI. Edit in markdown, improve with AI, and export as PDF.",
  },
  {
    icon: <Briefcase />,
    title: "AI Mock Interviews",
    description:
      "Simulate real job interviews with AI-powered voice conversations. Receive detailed analysis on communication, confidence, and technical depth.",
  },
  {
    icon: <Video />,
    title: "AI Video Course Generator",
    description:
      "Generate full video courses on any topic with AI narration, auto-captions, and an interactive chapter-based player.",
  },
  {
    icon: <LineChart />,
    title: "Industry Insights Dashboard",
    description:
      "Stay ahead with real-time salary data, in-demand skills, market trends, and AI-generated weekly career insights tailored to your field.",
  },
];
