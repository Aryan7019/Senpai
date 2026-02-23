import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function GET(request: Request) {
    // Vercel secures cron routes using a secret if CRON_SECRET is configured in env variables
    const authHeader = request.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("CRON: Pinging Supabase to prevent inactivity pause...");

        // A simple query to wake up the database
        const result = await db.$queryRaw`SELECT 1 as ping`;
        console.log("CRON: Database ping successful:", result);

        return NextResponse.json({
            success: true,
            message: "Database pinged successfully to prevent pause.",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("CRON: Failed to ping database:", error);
        return NextResponse.json({
            success: false,
            error: "Database ping failed."
        }, { status: 500 });
    }
}
