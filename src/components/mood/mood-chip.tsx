import Link from "next/link";
import type { MoodDefinition } from "@/lib/moods/types";

interface Props {
  mood: MoodDefinition;
}

export function MoodChip({ mood }: Props) {
  return (
    <Link
      href={`/discover/${mood.id}`}
      style={{ "--accent": mood.accent } as React.CSSProperties}
      className="flex flex-col gap-1.5 rounded-md border border-border bg-surface p-4 transition-colors duration-200 hover:border-[var(--accent)] hover:bg-surface-2"
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
