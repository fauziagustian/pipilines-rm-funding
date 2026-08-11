import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "Pipeline RM Funding | BRI Jatinegara",
    description:
      "Demo mobile-first untuk kunjungan harian, foto bukti, pipeline, dan monitoring kinerja RM Funding BRI Jatinegara.",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Pipeline RM Funding | BRI Jatinegara",
      description: "Kunjungan mobile, bukti foto, pipeline, dan monitoring kinerja dalam satu aplikasi.",
      images: [{ url: new URL("/og-public.jpg", origin).toString(), width: 1672, height: 941 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Pipeline RM Funding | BRI Jatinegara",
      description: "Demo mobile-first RM Funding Jatinegara.",
      images: [new URL("/og-public.jpg", origin).toString()],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
