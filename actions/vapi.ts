"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function getVapiAssistantOverrides(targetRole: string, language: string) {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
        include: {
            resume: true,
        }
    });

    if (!user) throw new Error("User not found");

    const resumeContext = user.resume?.content
        ? `The candidate's resume content: \n${user.resume.content}`
        : `The candidate has not provided a resume yet, but has ${user.experience || "some"} years of experience.`;

    const skillsContext = user.skills?.length
        ? `The candidate claims to have these skills: ${user.skills.join(", ")}`
        : "";

    return {
        assistantOverrides: {
            variableValues: {
                targetRole,
                language
            },
            name: "SenpAI Hiring Manager"
        }
    };
}
