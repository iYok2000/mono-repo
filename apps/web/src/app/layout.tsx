import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google";
import { Anuphan } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Header from "@/components/layout/Header";
import { BodyLayout } from "@/components/layout/BodyLayout";
import { MobileNotSupported } from "@/components/layout/MobileNotSupported";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { HeaderVisibilityController } from "@/components/layout/HeaderVisibilityController";

// Plus Jakarta Sans - Primary font for English (Friendly + Modern Geometric)
const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  display: "swap",
});

// Anuphan - Thai font (Modern Sans-serif with Human Touch)
const anuphan = Anuphan({
  variable: "--font-anuphan",
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  display: "swap",
});

// Keep Geist Mono for code blocks
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const siteTitle = "GyByte — การ์ดดิจิทัล NFC & ของขวัญวิดีโอความทรงจำ";
const siteDescription =
  "GyByte แพลตฟอร์มการ์ดดิจิทัล NFC และของขวัญวิดีโอ แตะการ์ดครั้งเดียวเปิดคลิปความทรงจำได้ทันที พร้อม QR สำรองและระบบคุมสิทธิ์ไฟล์ของคุณเอง";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s | GyByte",
  },
  description: siteDescription,
  applicationName: "GyByte",
  keywords: [
    "GyByte",
    "NFC",
    "การ์ดดิจิทัล",
    "นามบัตรดิจิทัล",
    "ของขวัญวิดีโอ",
    "digital business card",
    "video gift",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "th_TH",
    url: "/",
    siteName: "GyByte",
    title: siteTitle,
    description: siteDescription,
    // TODO: add og image asset (e.g. /public/og-image.png) then set `images` here
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} ${anuphan.variable} ${geistMono.variable} font-sans antialiased min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ErrorBoundary>
            <div className="flex min-h-screen flex-col">
              <HeaderVisibilityController />
              <Header />
              <BodyLayout variant="default">
                {children}
              </BodyLayout>
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
