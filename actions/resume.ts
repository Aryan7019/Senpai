"use server"
import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
const model = genAI.getGenerativeModel({
  model: "gemma-3-27b-it"
})
export async function saveResume(content: any, formData?: any) {
  try {
    const { userId } = await auth();
    if (!userId) {
      console.error("No userId from auth");
      throw new Error("User not authenticated");
    }

    console.log("Authenticated user:", userId);

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId
      }
    });

    if (!user) {
      console.error("User not found in database for clerkUserId:", userId);
      throw new Error("User not found");
    }

    console.log("Found user in DB:", user.id);

    const updateData: any = {
      userId: user.id,
      content: content || ""
    };

    // Save form data as JSON string if provided
    if (formData) {
      try {
        updateData.formData = JSON.stringify(formData);
        console.log("FormData stringified, length:", updateData.formData.length);
      } catch (jsonError: any) {
        console.error("Error stringifying formData:", jsonError);
        throw new Error("Invalid form data format");
      }
    }

    console.log("Attempting upsert for userId:", user.id);
    console.log("Content length:", content?.length || 0);

    const resume = await db.resume.upsert({
      where: {
        userId: user.id
      },
      update: updateData,
      create: updateData
    })

    console.log("Resume saved successfully:", resume.id);
    revalidatePath("/resume")
    return { success: true, resume };
  } catch (error: any) {
    console.error("=== SAVE RESUME ERROR ===");
    console.error("Error type:", error.constructor.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("========================");
    throw error;
  }
}

export async function getResume() {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId
    }
  });

  if (!user) throw new Error("User not found");
  return await db.resume.findUnique({
    where: {
      userId: user.id
    }
  })
}

export async function improveWithAi({ current, type, organization, title }: any) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  const user = await db.user.findUnique({
    where: {
      clerkUserId: userId
    }
  });

  if (!user) throw new Error("User not found");

  const prompt = `
    As an expert resume writer and career coach, improve the following ${type} description${title ? ` for "${title}"` : ''}${organization ? ` at ${organization}` : ''}.
    
    Current content: "${current}"
    
    Please enhance this description by making it more impactful and professional. Focus on:
    
    **For ALL ${type} entries:**
    1. Use powerful, appropriate action verbs
    2. Include quantifiable achievements and results where possible
    3. Highlight relevant skills and competencies
    4. Focus on impact and accomplishments
    5. Use industry-appropriate language
    6. Maintain clear, professional tone
    7. Structure for readability and scannability
    
    **${type === 'experience' ? 'EXPERIENCE-SPECIFIC:' : ''}**
    ${type === 'experience' ? `
    - Emphasize professional achievements and responsibilities
    - Show business impact and value delivered
    - Highlight leadership, collaboration, and technical skills
    - Demonstrate progression and career growth
    - Include metrics (revenue, efficiency, team size, etc.)
    ` : ''}
    
    **${type === 'education' ? 'EDUCATION-SPECIFIC:' : ''}**
    ${type === 'education' ? `
    - Focus on academic achievements and relevant coursework
    - Highlight projects, research, or thesis work
    - Emphasize skills gained and knowledge applied
    - Include honors, awards, or special recognition
    - Show relevance to career goals and ${user.industry} industry
    ` : ''}
    
    **${type === 'projects' ? 'PROJECTS-SPECIFIC:' : ''}**
    ${type === 'projects' ? `
    - Detail technical implementation and challenges solved
    - Highlight technologies, frameworks, and tools used
    - Showcase problem-solving and innovation
    - Include project scope, impact, and outcomes
    - Demonstrate collaboration and project management skills
    ` : ''}
    
    ${organization ? `**Organization Context:** Consider ${organization}'s relevance and reputation in the ${user.industry} industry.` : ''}
    
    **Format Requirements:**
    - Return only the improved description text
    - Use professional, concise language
    - Maintain the original meaning while enhancing impact
    - Structure appropriately for ${type} entries
    - Avoid markdown formatting or bullet points if not in original
    
    **Important:** Only return the improved description text without any additional explanations or headers.
  `;

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const improvedContent = response.text().trim()
    return improvedContent
  } catch (err: any) {
    console.log("Error improving content:", err.message);
    throw new Error("Failed to improve content");
  }
}

export async function calculateATSScore(content: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("User not authenticated");

  if (!content || content.trim().length < 50) {
    return { score: 0, label: "Incomplete", suggestions: ["Add more content to your resume to get an ATS score."] };
  }

  const prompt = `You are a senior ATS (Applicant Tracking System) analyst who has reviewed 10,000+ resumes. Score this resume using the EXACT rubric below. Be strict and precise — most resumes score between 45-75.

Resume:
"""
${content}
"""

SCORING RUBRIC (total 100 points):

1. CONTACT INFORMATION (10 points)
   - Full name present: 3 pts
   - Email present: 3 pts  
   - Phone present: 2 pts
   - LinkedIn/portfolio link: 2 pts

2. PROFESSIONAL SUMMARY (15 points)
   - Has a summary section: 5 pts
   - Contains industry keywords: 5 pts
   - Concise (2-4 sentences): 3 pts
   - Mentions years of experience or key expertise: 2 pts

3. SKILLS SECTION (10 points)
   - Has a skills section: 4 pts
   - Lists 5+ relevant skills: 3 pts
   - Mix of hard and soft skills: 3 pts

4. WORK EXPERIENCE (25 points)
   - Has experience entries with dates: 8 pts
   - Uses action verbs (Led, Built, Designed, etc.): 5 pts
   - Includes quantified results (%, $, numbers): 7 pts
   - Shows career progression: 5 pts

5. EDUCATION (10 points)
   - Has education section: 5 pts
   - Includes degree, institution, dates: 5 pts

6. FORMATTING & STRUCTURE (15 points)
   - Clear section headings: 5 pts
   - Consistent formatting: 5 pts
   - Appropriate length (not too short/long): 5 pts

7. KEYWORD OPTIMIZATION (15 points)
   - Industry-relevant terminology: 5 pts
   - Role-specific keywords: 5 pts
   - Technical tools/technologies mentioned: 5 pts

Score each category, sum the total. Return ONLY this JSON (no markdown):
{"score": <total 0-100>, "label": "<label>", "suggestions": ["<tip1>", "<tip2>", "<tip3>"]}

Labels: 80-100 = "Excellent", 60-79 = "Good", 40-59 = "Needs Work", 0-39 = "Poor"
Give exactly 3 specific, actionable tips targeting the weakest categories. Return ONLY the JSON.`;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    text = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(text);
    return {
      score: Math.min(100, Math.max(0, Math.round(parsed.score || 0))),
      label: parsed.label || "Unknown",
      suggestions: parsed.suggestions || []
    };
  } catch (err: any) {
    console.error("ATS score error:", err.message);
    return { score: 0, label: "Error", suggestions: ["Could not calculate ATS score. Please try again."] };
  }
}