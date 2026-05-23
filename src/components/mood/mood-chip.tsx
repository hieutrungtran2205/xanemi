import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MoodDefinition } from "@/lib/moods/types";

interface Props {
  mood: MoodDefinition;
  variant?: "default" | "hero";
}

export function MoodChip({ mood, variant = "default" }: Props) {
  return (
    <Link
      href={`/discover/${mood.id}`}
      style={{ "--accent": mood.accent } as React.CSSProperties}
      className={cn(
        "flex flex-col gap-1.5 rounded-md border p-4 transition-colors duration-200",
        "hover:border-accent hover:bg-surface-2",
        variant === "hero" ? "border-white/10 bg-surface/80" : "border-border bg-surface"
      )}
    >
      <span className="text-2xl leading-none">{mood.emoji}</span>
      <span className="font-heading text-sm font-semibold leading-tight text-foreground">
        {mood.label}
      </span>
      <span className="text-xs leading-snug text-muted-foreground">
        {mood.description}
      </span>
    </Link>
  );
}
