import Link from "next/link";

export function Logo({ size = "default" }: { size?: "default" | "sm" }) {
  const cls =
    size === "sm"
      ? "font-heading text-base tracking-[-0.02em]"
      : "font-heading text-lg tracking-[-0.02em]";

  return (
    <Link href="/" className={cls}>
      <span className="font-bold text-foreground">mood</span>
      <span className="font-light text-muted-foreground">flix</span>
    </Link>
  );
}
