import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "sm" }) {
  // leading-none keeps the play tittle's vertical anchor stable regardless of
  // the surrounding line-height (header nav, footer, etc.).
  const cls =
    size === "sm"
      ? "font-heading text-xl font-semibold leading-none tracking-[-0.02em]"
      : "font-heading text-2xl font-semibold leading-none tracking-[-0.02em]";

  // Dotless "ı" (U+0131) so the play triangle can stand in for the tittle.
  // aria-label carries the real name since the glyph reads oddly to a screen reader.
  return (
    <Link href="/" aria-label="Xanemi" className={cls}>
      <span className="text-foreground">
        Xanem
        <span className="relative inline-block">
          {"ı"}
          <svg
            viewBox="0 0 100 100"
            fill="currentColor"
            aria-hidden
            className="absolute left-1/2 top-[-0.06em] h-[0.3em] w-[0.3em] -translate-x-1/2"
          >
            <path d="M34 18 L82 50 L34 82 Z" />
          </svg>
        </span>
      </span>
    </Link>
  );
}
