"use client";

import { useEffect, useState } from "react";

export default function ResumePreview({ content }: { content: string }) {
  const [html, setHtml] = useState("");

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

  if (!content) {
    return (
      <div className="w-[210mm] min-h-[297mm] bg-white flex items-center justify-center shadow-2xl">
        <p className="text-gray-300 text-sm">Fill in your details to see a live preview</p>
      </div>
    );
  }

  return (
    <div
      className="w-[210mm] min-h-[297mm] bg-white text-gray-900 shadow-2xl"
      style={{ padding: '15mm', fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif" }}
    >
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
  );
}
