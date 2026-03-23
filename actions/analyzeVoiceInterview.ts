"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Prisma } from "@prisma/client";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({
    model: "gemma-3-27b-it"
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

    const userMessages = chatHistory.filter(
        (msg) => msg.role === "user" && msg.text && msg.text.trim().length > 0
    );

    const substantiveUserMessages = userMessages.filter(
        (msg) => msg.text.trim().split(/\s+/).length >= 3 // At least 3 words
    );

    const totalUserWordCount = userMessages.reduce(
        (count, msg) => count + msg.text.trim().split(/\s+/).length, 0
    );

    if (
        !transcript ||
        transcript.trim().length < 5 ||
        substantiveUserMessages.length < 2 ||
        totalUserWordCount < 10
    ) {
        const voiceInterview = await db.voiceInterview.create({
            data: {
                userId: user.id,
                targetRole,
                language,
                transcript: transcript || "No transcript collected.",
                chatHistory: chatHistory as unknown as Prisma.InputJsonValue[],
                status: "FAILED",
                technicalScore: 0,
                communicationScore: 0,
                confidenceScore: 0,
                strengths: ["No substantive responses were provided by the candidate."],
                improvements: ["Engage with the interviewer and provide detailed answers to questions."],
                keyPoints: ["The candidate did not participate meaningfully in the interview."],
                detailedFeedback:
                    "The interview session ended without enough participation from the candidate. " +
                    "You need to answer the interviewer's questions with detailed, substantive responses to receive a meaningful score."
            }
        });
        return voiceInterview.id;
    }

    const formattedChatHistory = chatHistory
        .map((msg) => `[${msg.role === "assistant" ? "INTERVIEWER" : "CANDIDATE"}]: ${msg.text}`)
        .join("\n");

    const prompt = `
You are a ruthlessly honest, highly precise technical hiring manager. You are evaluating a voice interview for the role of "${targetRole}" conducted in "${language}".

Below is the FULL CONVERSATION between the AI INTERVIEWER and the CANDIDATE. Your job is to deeply analyze the CANDIDATE's performance and calculate their scores using a strict, mathematical point system.

═══════════════════════════════════════════
CONVERSATION (role-tagged):
═══════════════════════════════════════════
${formattedChatHistory}

═══════════════════════════════════════════
RAW TRANSCRIPT (for context):
═══════════════════════════════════════════
${transcript}

═══════════════════════════════════════════
PRECISE SCORING INSTRUCTIONS & MATHEMATICAL RUBRIC
═══════════════════════════════════════════

You must calculate scores by starting at a baseline and applying precise additions/deductions. Evaluate ONLY the candidate's words. Do NOT score the interviewer.

**1. TECHNICAL SCORE (Base: 0, Max: 100)**
Start at 0. For each technical question asked, add points based on the candidate's answer depth:
• +0 points: Candidate skips, stays silent, or says "I don't know".
• +5 points per question: Candidate mentions relevant buzzwords but provides no actual explanation.
• +10 points per question: Candidate provides a basic, surface-level textbook definition.
• +20 points per question: Candidate explains the concept clearly with practical context.
• +30 points per question: Candidate provides a masterful, highly detailed explanation, covering edge cases, trade-offs, or real-world architecture.
*Deductions:*
• -15 points: For every factually incorrect technical statement.
• -10 points: For rambling off-topic without answering the core technical question.
*(Cap final score to 100, minimum 0)*

**2. COMMUNICATION SCORE (Base: 100, Max: 100)**
Start at 100. Deduct points for poor communication:
• -10 points: For every response that is extremely brief (under 5 words) when a longer explanation was needed.
• -15 points: For responses that are highly fragmented, disorganized, or difficult to follow.
• -5 points: For excessive filler words or rambling.
• -40 points: If the candidate consistently fails to directly answer the question asked.
*(If total deductions exceed 100, score is 0)*

**3. CONFIDENCE SCORE (Base: 100, Max: 100)**
Start at 100. Deduct points for lack of confidence:
• -20 points: If the candidate explicitly expresses self-doubt ("I think maybe...", "I'm probably wrong but...").
• -10 points: For every long pause or extreme hesitation before answering.
• -10 points: For a constant seeking of validation from the interviewer.
• -50 points: If the candidate gives up completely on a question.
*(If total deductions exceed 100, score is 0)*

**CRITICAL RULE FOR SHORT/EMPTY INTERVIEWS:**
If the candidate spoke fewer than 2 substantive sentences overall, ALL THREE SCORES MUST EXACTLY EQUAL 0. No exceptions.

**OUTPUT FORMAT:**
Return ONLY a valid, raw JSON object. No markdown, no backticks, no explanation strings.

{
  "technicalScore": <calculated number 0-100>,
  "communicationScore": <calculated number 0-100>,
  "confidenceScore": <calculated number 0-100>,
  "strengths": ["<1 short sentence based ONLY on candidate's words>", "<1 short sentence>"],
  "improvements": ["<1 short, precise, actionable improvement>", "<1 short sentence>"],
  "keyPoints": ["<1 short sentence summarizing what candidate struggled/excelled at>"]
}
`;

    try {
        console.log("Sending prompt to Gemini...");
        const result = await model.generateContent(prompt);
        let text = result.response.text();
        console.log("Raw Response from Gemini:", text);

        // Strip out any markdown code blocks or hidden characters that Gemini might occasionally inject
        text = text.replace(/\`\`\`json/gi, "").replace(/\`\`\`/g, "").trim();
        console.log("Cleaned Text:", text);

        let metrics;
        try {
            metrics = JSON.parse(text);
            console.log("Parsed Metrics:", metrics);
        } catch (parseError) {
            console.error("Failed to parse Gemini JSON:", parseError);
            console.log("Falling back to default metrics due to JSON parse error.");
            metrics = {
                technicalScore: 0,
                communicationScore: 0,
                confidenceScore: 0,
                strengths: ["Failed to generate specific strengths."],
                improvements: ["Failed to generate specific improvements."],
                keyPoints: ["Could not parse the AI response."]
            };
        }

        const techScore = typeof metrics?.technicalScore === "number" ? metrics.technicalScore : 0;
        const commScore = typeof metrics?.communicationScore === "number" ? metrics.communicationScore : 0;
        const confScore = typeof metrics?.confidenceScore === "number" ? metrics.confidenceScore : 0;

        // Clamp scores to 0-100 range as a safety net
        const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));

        const voiceInterview = await db.voiceInterview.create({
            data: {
                userId: user.id,
                targetRole,
                language,
                transcript,
                chatHistory: chatHistory as unknown as Prisma.InputJsonValue[],
                status: "COMPLETED",
                technicalScore: clamp(techScore),
                communicationScore: clamp(commScore),
                confidenceScore: clamp(confScore),
                strengths: Array.isArray(metrics?.strengths) ? metrics.strengths : ["Failed to generate specific strengths."],
                improvements: Array.isArray(metrics?.improvements) ? metrics.improvements : ["Failed to generate specific improvements."],
                keyPoints: Array.isArray(metrics?.keyPoints) ? metrics.keyPoints : ["Could not parse the AI response."],
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
