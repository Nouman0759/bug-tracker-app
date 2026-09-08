"use client";

import { useEffect, useRef, useState } from "react";

interface ScreenshotPickerProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export function ScreenshotPicker({ files, onChange }: ScreenshotPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function handleFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(e.target.files || []);
    onChange([...files, ...selected]);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    onChange(files.filter((_, i) => i !== index));
  }

  return (
    <div>
      <p className="mb-xs text-caption text-text-muted">Screenshots</p>
      <div className="flex flex-wrap gap-sm">
        {previews.map((src, i) => (
          <div key={src} className="relative h-16 w-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt="screenshot" className="h-16 w-16 rounded-sm object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-white text-small leading-none"
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-16 w-16 items-center justify-center rounded-sm border border-dashed border-border text-text-muted"
        >
          +
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="hidden"
        />
      </div>
    </div>
  );
}
