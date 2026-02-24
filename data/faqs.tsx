export interface FAQ {
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    question: "What makes SenpAI different from other career platforms?",
    answer:
      "SenpAI is an all-in-one AI career companion that goes far beyond basic tools. It includes a smart resume builder, AI cover letter generator, MCQ-based interview prep, voice mock interviews with real-time AI analysis, and a full AI video course generator. Every feature is personalized to your industry and experience level.",
  },
  {
    question: "How does the AI Video Course Generator work?",
    answer:
      "Simply enter a topic and SenpAI generates a complete multi-chapter video course with AI-written slides, professional voice narration, auto-synced captions, and an interactive player with chapter navigation. Each course is generated in under 2 minutes.",
  },
  {
    question: "What are Voice Mock Interviews?",
    answer:
      "SenpAI simulates realistic job interviews using AI-powered voice conversations. After the interview, you receive a detailed analysis covering communication skills, technical depth, confidence level, and areas for improvement — just like feedback from a real interviewer.",
  },
  {
    question: "How does SenpAI personalize content for me?",
    answer:
      "During onboarding, SenpAI learns about your industry, experience, and skills. It then tailors everything — resume suggestions, interview questions, cover letters, course topics, and dashboard insights — specifically to your career path and goals.",
  },
  {
    question: "Is my data secure with SenpAI?",
    answer:
      "Absolutely. We prioritize the security of your professional information. All data is encrypted and securely stored using industry-standard practices. We use Clerk for authentication and never share your personal information with third parties.",
  },
  {
    question: "Can I edit AI-generated content?",
    answer:
      "Yes! While SenpAI generates high-quality content, you have full control to edit and customize everything. Resumes have a built-in markdown editor, cover letters can be refined, and all generated content is yours to personalize.",
  },
  {
    question: "How can I track my interview preparation progress?",
    answer:
      "SenpAI tracks your performance across multiple practice sessions — both written MCQ quizzes and voice interviews. Your dashboard shows detailed analytics, score trends, and AI-generated tips to help you improve over time.",
  },
  {
    question: "Is SenpAI free to use?",
    answer:
      "SenpAI offers a comprehensive free tier with access to all core features including the resume builder, cover letter generator, interview prep, voice interviews, and course generator. Some advanced features may require a premium plan in the future.",
  },
];
