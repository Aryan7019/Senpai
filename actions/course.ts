"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const MODELS = ['gemma-3-27b-it'];

async function generateWithRetry(prompt: string, maxRetries = 3): Promise<string> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        for (const modelName of MODELS) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent(prompt);
                let text = result.response.text();
                text = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return text;
            } catch (err: any) {
                const isRateLimit = err?.message?.includes('429') || err?.message?.includes('quota');
                console.warn(`Model ${modelName} failed (attempt ${attempt + 1}): ${err?.message?.slice(0, 100)}`);

                if (isRateLimit) {
                    // Wait before retrying on rate limit
                    const waitTime = Math.min(5000 * (attempt + 1), 30000);
                    console.log(`Rate limited, waiting ${waitTime}ms before retry...`);
                    await new Promise(r => setTimeout(r, waitTime));
                } else {
                    await new Promise(r => setTimeout(r, 1000));
                }
            }
        }
    }
    throw new Error("All Gemini models failed after retries. You may have exceeded daily quota limits.");
}

export async function generateCourseLayout(topic: string, level: string = "Beginner") {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    });

    if (!user) {
        throw new Error("User not found");
    }

    const prompt = `
        You are an expert curriculum designer. The user wants to learn about: "${topic}" at a "${level}" level.
        Design a highly structured, comprehensive syllabus for a video course.

        You MUST output ONLY valid JSON using exactly this format:
        {
            "name": "Course Title",
            "description": "A 2-sentence description of the course.",
            "totalChapters": 3,
            "chapters": [
                {
                    "chapterId": "guid-style-string",
                    "chapterTitle": "Chapter 1 Title",
                    "chapterDescription": "Brief description of the chapter",
                    "subTopics": [
                        "Subtopic 1",
                        "Subtopic 2",
                        "Subtopic 3"
                    ]
                }
            ]
        }

        Important rules:
        1. Produce exactly between 2 and 5 chapters.
        2. Each chapter should have exactly 2-4 subTopics.
        3. Do NOT include markdown blocks like \`\`\`json, just pure JSON text.
        4. "chapterId" should be a unique string (you can generate random IDs).
    `;

    try {
        const text = await generateWithRetry(prompt);
        const layoutJson = JSON.parse(text);

        const courseId = uuidv4();

        const course = await db.course.create({
            data: {
                courseId: courseId,
                name: layoutJson.name,
                description: layoutJson.description,
                level: level,
                totalChapters: layoutJson.chapters.length,
                layout: layoutJson.chapters,
                createdBy: user.id
            }
        });

        return {
            success: true,
            courseId: course.courseId,
            course: course
        };

    } catch (error: any) {
        console.error("Failed to generate course layout:", error?.message || error);
        throw new Error(`Failed to generate course layout: ${error?.message || "Unknown error"}`);
    }
}
