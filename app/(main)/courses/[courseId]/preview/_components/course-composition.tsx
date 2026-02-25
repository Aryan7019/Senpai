import React from 'react';
import { Sequence, Audio, useCurrentFrame, useVideoConfig, interpolate, spring } from 'remotion';

export default function CourseComposition({ slideTimings }: { slideTimings: any[] }) {
    return (
        <div style={{ flex: 1, backgroundColor: '#030303' }}>
            {slideTimings.map((slide, index) => {
                return (
                    <Sequence
                        key={slide.id || index}
                        from={slide.startFrame}
                        durationInFrames={slide.durationFrames}
                    >
                        <SlideRenderer slide={slide} slideNumber={index + 1} totalSlides={slideTimings.length} />
                        {slide.audioUrl && <Audio src={slide.audioUrl} />}
                    </Sequence>
                );
            })}
        </div>
    );
}

function SlideRenderer({ slide, slideNumber, totalSlides }: { slide: any; slideNumber: number; totalSlides: number }) {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();
    const currentTimeSec = frame / fps;

    // --- Entrance animation for the whole slide ---
    const slideOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });
    const slideTranslateY = interpolate(frame, [0, 15], [40, 0], { extrapolateRight: 'clamp' });

    // --- Heading animation ---
    const headingOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' });
    const headingScale = spring({ frame: frame - 5, fps, config: { damping: 100, stiffness: 200, mass: 0.5 } });

    const hasCode = slide.slideData?.codeSnippet && slide.slideData.codeSnippet.trim() !== '';

    const hasCaptions = slide.captions && Array.isArray(slide.captions) && slide.captions.length > 0;

    // Dynamic positioning: center for short slides, top-align for dense ones
    const bulletCount = (slide.slideData?.bulletPoints || []).length;
    const isContentHeavy = hasCode || bulletCount > 3;
    const justify = isContentHeavy ? 'flex-start' : 'center';
    const topPad = isContentHeavy ? '80px' : '70px';
    const bottomPad = hasCaptions ? '130px' : '80px';
    const sidePad = hasCode ? '100px' : '140px';

    return (
        <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: justify,
            padding: `${topPad} ${sidePad} ${bottomPad}`,
            backgroundColor: '#050505',
            color: 'white',
            fontFamily: "'Inter', 'Segoe UI', sans-serif",
            position: 'relative',
            overflow: 'hidden',
            opacity: slideOpacity,
            transform: `translateY(${slideTranslateY}px)`,
        }}>
            {/* === Background Effects === */}
            {/* Top-left primary glow */}
            <div style={{
                position: 'absolute',
                top: '-15%',
                left: '-10%',
                width: '60%',
                height: '70%',
                background: 'radial-gradient(ellipse, rgba(200,162,110,0.12) 0%, transparent 65%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
            }} />
            {/* Bottom-right secondary glow */}
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-10%',
                width: '50%',
                height: '60%',
                background: 'radial-gradient(ellipse, rgba(120,80,200,0.08) 0%, transparent 65%)',
                filter: 'blur(80px)',
                pointerEvents: 'none',
            }} />
            {/* Faint grid pattern */}
            <div style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                maskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)',
                WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 30%, black 40%, transparent 100%)',
                pointerEvents: 'none',
            }} />

            {/* === Slide Number Indicator === */}
            <div style={{
                position: 'absolute',
                top: '50px',
                right: '60px',
                display: 'flex',
                alignItems: 'baseline',
                gap: '4px',
                opacity: 0.4,
            }}>
                <span style={{ fontSize: '48px', fontWeight: 900, letterSpacing: '-0.04em', color: 'rgba(200,162,110,0.6)' }}>
                    {String(slideNumber).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '24px', fontWeight: 500, color: 'rgba(255,255,255,0.3)' }}>
                    / {String(totalSlides).padStart(2, '0')}
                </span>
            </div>

            {/* === Slide Heading === */}
            <h1 style={{
                fontSize: hasCode ? '48px' : '60px',
                fontWeight: 900,
                letterSpacing: '-0.04em',
                lineHeight: 1.1,
                marginBottom: hasCode ? '28px' : '36px',
                background: 'linear-gradient(135deg, #ffffff 0%, rgba(200,162,110,0.9) 50%, rgba(255,255,255,0.6) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                opacity: headingOpacity,
                transform: `scale(${headingScale})`,
                position: 'relative',
                zIndex: 2,
                maxWidth: '85%',
            }}>
                {slide.slideData?.heading || "Chapter Overview"}
            </h1>

            {/* === Content Area (Bullets + Code side by side if code exists) === */}
            <div style={{
                display: 'flex',
                gap: '50px',
                flex: 1,
                position: 'relative',
                zIndex: 2,
            }}>
                {/* Bullet Points */}
                <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                    flex: hasCode ? '1 1 50%' : '1 1 100%',
                }}>
                    {(slide.slideData?.bulletPoints || []).map((point: string, i: number) => {
                        const bulletDelay = 12 + (i * 10);
                        const bulletOpacity = interpolate(frame, [bulletDelay, bulletDelay + 10], [0, 1], { extrapolateRight: 'clamp' });
                        const bulletX = interpolate(frame, [bulletDelay, bulletDelay + 8], [-20, 0], { extrapolateRight: 'clamp' });

                        return (
                            <li key={i} style={{
                                lineHeight: 1.4,
                                fontSize: hasCode ? '28px' : '32px',
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.88)',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '24px',
                                opacity: bulletOpacity,
                                transform: `translateX(${bulletX}px)`,
                            }}>
                                <div style={{
                                    width: '12px',
                                    height: '12px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(135deg, #C8A26E, #E8C88A)',
                                    marginTop: hasCode ? '14px' : '18px',
                                    flexShrink: 0,
                                    boxShadow: '0 0 16px rgba(200,162,110,0.6), 0 0 40px rgba(200,162,110,0.2)',
                                }} />
                                <span style={{ lineHeight: 1.5 }}>{point}</span>
                            </li>
                        );
                    })}
                </ul>

                {/* Code Snippet (if present) */}
                {hasCode && (
                    <div style={{
                        flex: '1 1 50%',
                        background: 'rgba(15,15,15,0.9)',
                        border: '1px solid rgba(200,162,110,0.15)',
                        borderRadius: '20px',
                        padding: '32px',
                        fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                        fontSize: '24px',
                        lineHeight: 1.7,
                        color: 'rgba(200,220,255,0.9)',
                        position: 'relative',
                        opacity: interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' }),
                        transform: `translateX(${interpolate(frame, [20, 35], [40, 0], { extrapolateRight: 'clamp' })}px)`,
                    }}>
                        {/* Code block header bar */}
                        <div style={{
                            display: 'flex',
                            gap: '8px',
                            marginBottom: '20px',
                            opacity: 0.5,
                        }}>
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ff5f57' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
                            <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#28c840' }} />
                        </div>
                        <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                            {slide.slideData.codeSnippet}
                        </pre>
                        {/* Subtle glow at top of code block */}
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(200,162,110,0.4), transparent)',
                        }} />
                    </div>
                )}
            </div>

            {/* === Captions — chunk-based, swaps whole line at a time === */}
            {hasCaptions && (() => {
                const chunkSize = 8;
                // Pre-split all words into fixed chunks
                const chunks: any[][] = [];
                for (let i = 0; i < slide.captions.length; i += chunkSize) {
                    chunks.push(slide.captions.slice(i, i + chunkSize));
                }

                // Find which chunk we're currently in
                let activeChunkIdx = 0;
                for (let c = 0; c < chunks.length; c++) {
                    const lastWordInChunk = chunks[c][chunks[c].length - 1];
                    if (currentTimeSec <= lastWordInChunk.end + 0.5) {
                        activeChunkIdx = c;
                        break;
                    }
                    if (c === chunks.length - 1) activeChunkIdx = c;
                }

                const currentChunk = chunks[activeChunkIdx];
                if (!currentChunk) return null;

                // Don't show before speech starts
                const firstWord = slide.captions[0];
                if (firstWord && currentTimeSec < firstWord.start - 0.3) return null;

                return (
                    <div style={{
                        position: 'absolute',
                        bottom: '36px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        textAlign: 'center',
                        display: 'flex',
                        gap: '8px',
                        padding: '14px 32px',
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '14px',
                        whiteSpace: 'nowrap',
                    }}>
                        {currentChunk.map((wordObj: any, idx: number) => {
                            const isActive = currentTimeSec >= wordObj.start && currentTimeSec <= wordObj.end + 0.3;
                            const hasPassed = currentTimeSec > wordObj.end;

                            let color = 'rgba(255,255,255,0.35)';
                            let fw = 600;
                            if (isActive) {
                                color = '#C8A26E';
                                fw = 800;
                            } else if (hasPassed) {
                                color = 'rgba(255,255,255,0.9)';
                            }

                            return (
                                <span key={idx} style={{
                                    fontSize: '28px',
                                    fontWeight: fw,
                                    color,
                                    textShadow: isActive ? '0 0 10px rgba(200,162,110,0.6)' : 'none',
                                    display: 'inline-block',
                                }}>
                                    {wordObj.word}
                                </span>
                            );
                        })}
                    </div>
                );
            })()}
        </div>
    );
}
