import { NextResponse } from 'next/server';
import { db } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import { createClient as createDeepgramClient } from '@deepgram/sdk';
import { v4 as uuidv4 } from 'uuid';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const MODELS = ['gemini-2.5-flash', 'gemma-3-27b-it'];

async function generateWithRetry(prompt: string): Promise<string> {
    for (const modelName of MODELS) {
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            let text = result.response.text();
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            console.log(`Successfully generated with model: ${modelName}`);
            return text;
        } catch (err: any) {
            console.warn(`Model ${modelName} failed: ${err?.message}. Trying next...`);
            if (modelName === MODELS[MODELS.length - 1]) throw err;
            await new Promise(r => setTimeout(r, 2000));
        }
    }
    throw new Error("All Gemini models failed");
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const deepgram = createDeepgramClient(process.env.DEEPGRAM_API_KEY || '');

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { courseId, chapterId, subTopics } = await req.json();

        // 1. Generate Slide Structured JSON with Gemini (with retry + fallback)
        const prompt = `
            You are a curriculum expert creating a video course chapter.
            The chapter has the following subtopics: ${subTopics.join(", ")}.

            Please create exactly 5 detailed, engaging slides covering these subtopics.
            You must output an array of exactly 5 JSON objects without any markdown wrappers.

            Each JSON object represents a single slide and must match this structure exactly:
            {
                "slideIndex": number,
                "heading": "Clear slide heading",
                "bulletPoints": ["point 1", "point 2", "point 3"],
                "codeSnippet": "optional relevant code or short example if applicable, otherwise empty string",
                "narrationText": "A natural, engaging voiceover script reading the points playfully to keep the viewer engaged. Minimum 5 sentences."
            }
            
            Important: You MUST return exactly 5 slides (slideIndex 0 through 4).
            Return ONLY the valid JSON array (e.g. [{...}, {...}]). Do not include \`\`\`json.
        `;

        const text = await generateWithRetry(prompt);
        const slidesJson: any[] = JSON.parse(text);

        // 2. Ensure bucket exists ONCE (not per slide)
        const { data: buckets } = await supabase.storage.listBuckets();
        const bucketExists = buckets?.some((b: any) => b.name === 'course-assets');
        if (!bucketExists) {
            const { error: createBucketError } = await supabase.storage.createBucket('course-assets', {
                public: true,
                fileSizeLimit: 52428800
            });
            if (createBucketError) {
                console.error("Bucket creation error:", createBucketError);
            }
        }

        // 3. Process all slides IN PARALLEL (TTS → Upload → Caption → Save)
        const generatedSlides = await Promise.all(
            slidesJson.map(async (slide) => {
                const { slideIndex, narrationText, heading, bulletPoints, codeSnippet } = slide;

                // 3a. TTS with Deepgram
                let audioBuffer: ArrayBuffer;
                const ttsResponse = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`
                    },
                    body: JSON.stringify({ text: narrationText })
                });

                if (!ttsResponse.ok) {
                    const errText = await ttsResponse.text();
                    console.error(`TTS failed for slide ${slideIndex}:`, ttsResponse.status, errText);
                    throw new Error(`TTS failed for slide ${slideIndex}: ${ttsResponse.status}`);
                }
                audioBuffer = await ttsResponse.arrayBuffer();

                // 3b. Upload to Supabase Storage
                const audioFileName = `course-${courseId}-ch-${chapterId}-s${slideIndex}-${Date.now()}.mp3`;
                const { error: uploadError } = await supabase.storage
                    .from('course-assets')
                    .upload(audioFileName, audioBuffer, {
                        contentType: 'audio/mpeg',
                        cacheControl: '3600',
                        upsert: true
                    });

                if (uploadError) {
                    console.error(`Upload failed for slide ${slideIndex}:`, JSON.stringify(uploadError));
                    throw new Error(`Audio upload failed for slide ${slideIndex}: ${uploadError.message}`);
                }

                const { data: publicUrlData } = supabase.storage
                    .from('course-assets')
                    .getPublicUrl(audioFileName);
                const audioUrl = publicUrlData.publicUrl;

                // 3c. Captions (non-blocking)
                let words: any[] = [];
                try {
                    await new Promise(r => setTimeout(r, 500));
                    const { result: deepgramResult, error: deepgramError } = await deepgram.listen.prerecorded.transcribeUrl(
                        { url: audioUrl },
                        { model: 'nova-2', smart_format: true, words: true }
                    );
                    if (!deepgramError) {
                        words = deepgramResult?.results?.channels[0]?.alternatives[0]?.words || [];
                    }
                } catch (captionErr: any) {
                    console.warn(`Caption skipped for slide ${slideIndex}:`, captionErr?.message);
                }

                // 3d. Save to DB
                const slideData = { heading, bulletPoints, codeSnippet };
                const savedSlide = await db.courseSlide.create({
                    data: {
                        id: uuidv4(),
                        courseId,
                        chapterId,
                        slideIndex,
                        slideData,
                        narrationText,
                        audioUrl,
                        captions: words as any,
                        revealData: {}
                    }
                });

                return savedSlide;
            })
        );

        return NextResponse.json({ success: true, slides: generatedSlides });

    } catch (e: any) {
        console.error("API /generate-video-content Error:", e);
        return NextResponse.json({ success: false, error: e.message }, { status: 500 });
    }
}
