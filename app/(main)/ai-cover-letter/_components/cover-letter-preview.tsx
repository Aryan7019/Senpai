"use client";

import React from "react";
import dynamic from "next/dynamic";

const MDEditor = dynamic(
  () => import("@uiw/react-md-editor"),
  {
    ssr: false,
    loading: () => <div className="h-[600px] flex items-center justify-center text-white/30 font-medium">Loading preview...</div>
  }
);

const CoverLetterPreview = ({ content }: any) => {
  return (
    <div className="p-1">
      <MDEditor
        value={content}
        preview="preview"
        height={600}
        hideToolbar={true}
      />
    </div>
  );
};

export default CoverLetterPreview;