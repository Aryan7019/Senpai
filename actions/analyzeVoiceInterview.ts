"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prisma } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash"
});

export async function analyzeVoiceInterview(
    transcript: string,
    chatHistory: { role: string; text: string }[],
    targetRole: string,
    language: string
) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({ where: { clerkUserId: userId } });
    if (!user) throw new Error("User not found");

    if (!transcript || transcript.trim().length < 5) {
        // If the conversation was too short, mark it as failed or skipped
        const voiceInterview = await db.voiceInterview.create({
            data: {
                userId: user.id,
                targetRole,
                language,
                transcript: transcript || "No transcript collected.",
                chatHistory: chatHistory as unknown as Prisma.InputJsonValue[],
                status: "FAILED",
                detailedFeedback: "The interview was too short to generate meaningful feedback."
            }
        });
        return voiceInterview.id;
    }

    const prompt = `
  You are an expert technical hiring manager evaluating an interview transcript for the role of "${targetRole}" conducted in "${language}".
  
  Read the transcript below carefully. You MUST return ONLY a valid, raw JSON object. Do not include markdown formatting, backticks, or any conversational text.
  
  The JSON object MUST EXACTLY match this structure:
  {
    "technicalScore": <number between 0 and 100 representing technical knowledge demonstrated>,
    "communicationScore": <number between 0 and 100 representing clarity and professional communication>,
    "confidenceScore": <number between 0 and 100 representing confidence and assertiveness>,
    "strengths": ["<string: positives of the interviewee>", ... max 5],
    "improvements": ["<string: improvements to be made>", ... max 5],
    "keyPoints": ["<string: key points about what happened in the interview>", ... max 5]
  }

  IMPORTANT:
  - "strengths": Focus exclusively on the positives of the interviewee in the interview.
  - "improvements": Focus exclusively on the improvements to be made by the interviewee.
  - "keyPoints": Focus exclusively on key points summarizing what actually happened in the interview.
  - All three arrays must contain extremely concise strings (1 short sentence max each).
  - Provide exactly 3 to 5 bullet points for each array.

  Transcript:
  ${transcript}
  `;

    try {
        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        console.log("Raw Response from Gemini:", text);

        // Strip out any markdown code blocks or hidden characters that Gemini might occasionally inject
        text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
        console.log("Cleaned Text:", text);

        const metrics = JSON.parse(text);
        console.log("Parsed Metrics:", metrics);

        const voiceInterview = await db.voiceInterview.create({
            data: {
                userId: user.id,
                targetRole,
                language,
                transcript,
                chatHistory: chatHistory as unknown as Prisma.InputJsonValue[],
                status: "COMPLETED",
                technicalScore: parseFloat(metrics.technicalScore) || 0,
                communicationScore: parseFloat(metrics.communicationScore) || 0,
                confidenceScore: parseFloat(metrics.confidenceScore) || 0,
                strengths: Array.isArray(metrics.strengths) ? metrics.strengths : [],
                improvements: Array.isArray(metrics.improvements) ? metrics.improvements : [],
                keyPoints: Array.isArray(metrics.keyPoints) ? metrics.keyPoints : [],
                detailedFeedback: "See bullet points."
            }
        });

        return voiceInterview.id;
    } catch (error) {
        console.error("Failed to analyze transcript ERROR START =========");
        console.error(error);
        console.error("Failed to analyze transcript ERROR END ===========");

        // Graceful degradation: save the transcript anyway but mark as failed processing
        const voiceInterview = await db.voiceInterview.create({
            data: {
                userId: user.id,
                targetRole,
                language,
                transcript,
                chatHistory: chatHistory as unknown as Prisma.InputJsonValue[],
                status: "FAILED",
                detailedFeedback: "The AI failed to process the interview metrics, but your transcript was saved."
            }
        });
        return voiceInterview.id;
    }
}
