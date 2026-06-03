import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BottomNav } from "@/components/layout/bottom-nav";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Xanemi",
  description: "Your go-to place to discover and explore films.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} dark h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col bg-background text-foreground">
        <NuqsAdapter>
          <ScrollToTop />
          <Header />
          {children}
          <Footer />
          {/* spacer so footer content clears the fixed bottom nav on mobile */}
          <div className="h-16 sm:hidden" aria-hidden />
          <BottomNav />
        </NuqsAdapter>
      </body>
    </html>
  );
}
