"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/" || pathname.startsWith("/discover")) return null;

  return (
    <div className={`fixed left-4 top-16 z-40 transition-opacity duration-300 sm:left-8 ${scrolled ? "opacity-50 hover:opacity-100" : "opacity-100"}`}>
      <Button variant="ghost" size="icon" onClick={() => router.back()} aria-label="Go back" className="size-10 sm:size-8">
        <span aria-hidden className="text-xl leading-none sm:text-lg">←</span>
      </Button>
    </div>
  );
}