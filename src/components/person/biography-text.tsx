"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  text: string;
  // Character threshold above which the read-more toggle is shown
  threshold?: number;
}

export function BiographyText({ text, threshold = 480 }: Props) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > threshold;

  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0);

  return (
    <div>
      <div
        className={cn(
          "space-y-3 text-base leading-relaxed text-muted-foreground",
          isLong && !expanded && "line-clamp-6"
        )}
      >
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 text-sm font-medium text-foreground underline-offset-4 transition-colors hover:underline"
        >
          {expanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}
