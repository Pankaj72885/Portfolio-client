import { ThemeProvider } from "@/components/theme-provider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pankajbepari.com"
  ),
  title: {
    default: "Pankaj Bepari | Full Stack Developer",
    template: "%s | Pankaj Bepari",
  },
  description:
    "Disciplined coder with military precision. Full Stack Developer specializing in React, Node.js, and modern web technologies. Building robust, scalable applications.",
  keywords: [
    "Full Stack Developer",
    "React Developer",
    "Node.js Developer",
    "MERN Stack",
    "Next.js",
    "TypeScript",
    "Bangladesh",
    "Web Developer",
    "Portfolio",
  ],
  authors: [{ name: "Pankaj Bepari" }],
  creator: "Pankaj Bepari",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Pankaj Bepari - Portfolio",
    title: "Pankaj Bepari | Full Stack Developer",
    description:
      "Disciplined coder with military precision. Full Stack Developer specializing in React, Node.js, and modern web technologies.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pankaj Bepari - Full Stack Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pankaj Bepari | Full Stack Developer",
    description:
      "Disciplined coder with military precision. Full Stack Developer specializing in React, Node.js, and modern web technologies.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

import { AuthProvider } from "@/lib/auth-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
