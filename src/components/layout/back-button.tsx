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

  if (pathname === "/") return null;

  return (
    <div className={`fixed right-4 top-16 z-40 transition-opacity duration-300 sm:right-8 ${scrolled ? "opacity-50 hover:opacity-100" : "opacity-100"}`}>
      <Button variant="ghost" onClick={() => router.back()}>
        <span aria-hidden>←</span>
        Back
      </Button>
    </div>
  );
}