"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

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
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();

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
        console.error("Full error details:", JSON.stringify(error, null, 2));
        throw new Error(`Failed to generate course layout: ${error?.message || "Unknown error"}`);
    }
}
