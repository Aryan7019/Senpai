"use client";

import { useEffect, useState, useRef } from "react";

export default function ResumePreview({ content }: { content: string }) {
  const [html, setHtml] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    (async () => {
      if (!content) { setHtml(""); return; }
      const { marked } = await import("marked");
      let rendered = await marked(content);
      rendered = rendered
        .replace(/<div align="center">/g, '<div style="text-align: center;">')
        .replace(/(📧|📱|🔗)/g, '<span style="font-size:13px;margin-right:4px;">$1</span>');
      setHtml(rendered);
    })();
  }, [content]);

  // Auto-scale the 794px-wide paper to fit the container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const parent = containerRef.current.parentElement;
        if (!parent) return;

        const style = window.getComputedStyle(parent);
        const paddingX = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);

        const containerWidth = parent.clientWidth - paddingX;

        const paperWidth = 794; // 210mm in px

        const scaleWidth = containerWidth / paperWidth;

        // Scale down ONLY by width so it fits the screen horizontally.
        // Let it overflow vertically so the user can scroll a larger, readable page.
        setScale(Math.min(1, scaleWidth));
      }
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const paperStyle = {
    width: '794px',
    minHeight: '1123px', // 297mm
    padding: '56px 48px',
    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
  };

  if (!content) {
    return (
      <div ref={containerRef} className="w-full overflow-hidden">
        <div className="bg-white shadow-2xl" style={{ ...paperStyle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p className="text-gray-300 text-sm">Fill in your details to see a live preview</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="w-full overflow-hidden" style={{ height: `${1123 * scale}px`, maxHeight: '100%' }}>
      <div className="bg-white text-gray-900 shadow-2xl" style={paperStyle}>
        <style>{`
          .rp h1 { font-size: 28px; font-weight: 800; text-align: center; margin: 0 0 2px; color: #111; letter-spacing: -0.3px; text-transform: uppercase; }
          .rp h2 { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; border-bottom: 1px solid #ccc; padding-bottom: 3px; margin: 18px 0 8px; color: #333; }
          .rp h3 { font-size: 12px; font-weight: 700; margin: 12px 0 1px; color: #111; }
          .rp p { font-size: 11px; line-height: 1.5; color: #444; margin: 2px 0; }
          .rp a { color: #444; text-decoration: none; font-weight: 500; }
          .rp strong { font-weight: 700; color: #111; }
          .rp em { font-style: italic; color: #666; font-size: 10.5px; }
          .rp ul, .rp ol { margin: 3px 0; padding-left: 16px; }
          .rp li { font-size: 11px; line-height: 1.5; color: #444; margin: 1px 0; }
          .rp div[style*="text-align: center"] p { font-size: 10.5px; color: #666; }
          .rp hr { border: none; border-top: 1px solid #e5e5e5; margin: 10px 0; }
        `}</style>
        <div className="rp" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </div>
  );
}
