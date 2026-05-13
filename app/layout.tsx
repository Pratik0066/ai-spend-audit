import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// PRODUCTION FIX: Added proper SEO and mandatory Open Graph metadata
export const metadata: Metadata = {
  // Add this line right here at the top! Use your actual Vercel deployment URL.
  metadataBase: new URL('https://ai-spend-audit-pyg4nqvde-pratik0066s-projects.vercel.app'), 
  
  title: "AI Spend Auditor | Credex",
  description: "Most startups overpay for AI by 30%. Get an instant audit of your stack and cut the waste in 60 seconds.",
  openGraph:{
    title: "AI Spend Auditor | Cut Your AI Bill",
    description: "Most startups overpay for AI by 30%. Run a free audit on your stack.",
    url: 'https://your-deployment-url.vercel.app', // Update this when deploying!
    siteName: 'Credex AI Auditor',
    images: [
      {
        url: '/og-image.png', // Just ensure you have a basic image in public/og-image.png
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stop Overpaying for AI',
    description: 'Run a free audit to identify redundant subscriptions and find optimal tiers.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}