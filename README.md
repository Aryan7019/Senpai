# SenpAI - AI-Powered Career Growth Platform

SenpAI is a modern, AI-powered career development platform that helps professionals accelerate their career growth through personalized guidance, interview preparation, and intelligent resume building.

## Features

- **AI Career Guidance**: Get personalized career advice powered by advanced AI
- **Interview Preparation**: Practice with role-specific questions and instant feedback
- **Smart Resume Builder**: Create ATS-optimized resumes with AI assistance
- **Cover Letter Generator**: Generate compelling, tailored cover letters
- **Industry Insights**: Access real-time industry trends and salary data
- **Performance Analytics**: Track your progress with detailed analytics

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Authentication**: Clerk
- **Database**: PostgreSQL with Prisma ORM
- **AI**: Google Generative AI
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI + shadcn/ui
- **Background Jobs**: Inngest

## Getting Started

First, install dependencies:

```bash
npm install
```

Set up your environment variables in `.env`:

```env
DATABASE_URL="your-database-url"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-key"
CLERK_SECRET_KEY="your-clerk-secret"
GEMINI_API_KEY="your-gemini-api-key"
```

Run database migrations:

```bash
npm run db:push
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:studio` - Open Prisma Studio
- `npm run db:push` - Push database schema
- `npm run db:migrate` - Run database migrations

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── (main)/            # Main application pages
│   └── api/               # API routes
├── components/            # Reusable components
│   └── ui/               # UI components (shadcn)
├── actions/              # Server actions
├── lib/                  # Utility functions
├── prisma/               # Database schema
└── public/               # Static assets
```

## License

This project is private and proprietary.
