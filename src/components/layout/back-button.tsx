"use client";

import { useRouter } from "next/navigation";

export function BackButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1.5 rounded-md bg-black/30 px-3 py-1.5 text-sm text-white/70 transition-all hover:bg-black/50 hover:text-white"
    >
      <span aria-hidden>←</span>
      Back
    </button>
  );
}