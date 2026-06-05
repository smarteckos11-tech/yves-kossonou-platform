import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yves Kossonou — Expert en Transformation Digitale",
  description:
    "Plateforme premium de Yves Kossonou : transformation digitale, marketing digital, intelligence artificielle et formations pour entrepreneurs africains.",
  keywords: [
    "Yves Kossonou",
    "Transformation Digitale",
    "Marketing Digital",
    "Intelligence Artificielle",
    "Formation",
    "Afrique",
    "Entrepreneurs",
  ],
  authors: [{ name: "Yves Kossonou" }],
  openGraph: {
    title: "Yves Kossonou — Expert en Transformation Digitale",
    description:
      "Découvrez les livres, formations et événements de Yves Kossonou pour accélérer votre transformation digitale.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#081120] text-white`}
      >
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
