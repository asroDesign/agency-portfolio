import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Vazirmatn } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteConfigProvider } from "@/components/site-config";
import { getSiteConfig } from "@/lib/data";
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nexatech.ir";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "نکسا تک | طراحی وب‌سایت، اپلیکیشن و سئو",
    template: "%s | نکسا تک",
  },
  description:
    "تیم حرفه‌ای برنامه‌نویسان برای طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو. پروژه خود را به ما بسپارید.",
  keywords: [
    "طراحی سایت",
    "طراحی وب سایت",
    "سئو",
    "اپلیکیشن",
    "فروشگاه اینترنتی",
    "برنامه نویسی",
    "قالب وب سایت",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    siteName: "نکسا تک",
    title: "نکسا تک | طراحی وب‌سایت، اپلیکیشن و سئو",
    description: "تیم حرفه‌ای برنامه‌نویسان برای طراحی وب‌سایت، توسعه اپلیکیشن و ارتقای سئو.",
  },
  twitter: {
    card: "summary_large_image",
    title: "نکسا تک",
    description: "طراحی وب‌سایت، اپلیکیشن و سئو",
  },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const config = await getSiteConfig();

  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: config.logoText,
              url: SITE_URL,
              description: config.footerAbout,
              knowsAbout: ["طراحی وب‌سایت", "توسعه اپلیکیشن", "سئو"],
              ...(config.logoImageUrl ? { logo: config.logoImageUrl } : {}),
            }),
          }}
        />
        <ThemeProvider>
          <SiteConfigProvider
            value={{ logoText: config.logoText, logoImageUrl: config.logoImageUrl }}
          >
            {children}
          </SiteConfigProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
