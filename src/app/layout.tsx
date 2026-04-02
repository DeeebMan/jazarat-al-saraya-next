import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "@/components/ui/Toast";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-cairo",
  display: "swap",
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "جزارة السرايا - أفضل اللحوم الطازجة في الإسكندرية",
  description:
    "جزارة السرايا - نقدم لكم أجود أنواع اللحوم الطازجة والطواجن والمصنعات في الإسكندرية. اطلب الآن عبر واتساب.",
  keywords: "جزارة, لحوم, طازجة, إسكندرية, السرايا, طواجن, ضاني, شمبري",
  openGraph: {
    title: "جزارة السرايا - أفضل اللحوم الطازجة",
    description: "نقدم لكم أجود أنواع اللحوم الطازجة في الإسكندرية",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable}`}>
      <body
        className="min-h-screen flex flex-col antialiased"
        style={{ fontFamily: "var(--font-cairo), sans-serif" }}
      >
        <ToastContainer />
        {children}
      </body>
    </html>
  );
}
