// ~/dev/custompro-landing/app/layout.tsx
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "CustomsPro — AI-Powered Bills of Entry for CHAs",
    template: "%s | CustomsPro",
  },
  description:
    "File Bills of Entry in minutes, not hours. AI-powered BE filing platform for Customs House Agents (CHAs) in India — from document upload to ICEGATE flat file.",
  metadataBase: new URL("https://customspro.putri-labs.com"),
  keywords: [
    "customs house agent",
    "bill of entry",
    "ICEGATE",
    "CHA software",
    "BE filing India",
    "customs software India",
  ],
  authors: [{ name: "Putri Labs Private Limited" }],
  creator: "Putri Labs Private Limited",
  openGraph: {
    title: "CustomsPro — AI-Powered Bills of Entry for CHAs",
    description:
      "File Bills of Entry in minutes, not hours. AI-powered BE filing for Customs House Agents in India.",
    url: "https://customspro.putri-labs.com",
    siteName: "CustomsPro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CustomsPro — AI-Powered Bills of Entry",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CustomsPro — AI-Powered Bills of Entry for CHAs",
    description:
      "File Bills of Entry in minutes, not hours. AI-powered BE filing for Customs House Agents in India.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "https://customspro.putri-labs.com",
  },
}

// Static hardcoded structured data — no user input, no XSS risk.
// JSON.stringify is called on a plain object literal, not any dynamic/user-provided value.
const jsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      name: "CustomsPro",
      url: "https://customspro.putri-labs.com",
      logo: "https://customspro.putri-labs.com/logo.svg",
      description:
        "AI-powered Bills of Entry filing platform for Customs House Agents in India.",
      parentOrganization: {
        "@type": "Organization",
        name: "Putri Labs Private Limited",
      },
    },
    {
      "@type": "WebSite",
      name: "CustomsPro",
      url: "https://customspro.putri-labs.com",
      description:
        "File Bills of Entry in minutes, not hours. AI-powered BE filing for CHAs.",
    },
  ],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* JSON-LD structured data — static content only, safe to inject */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
        />
      </head>
      <body className="font-sans antialiased bg-[#fafafa] text-gray-900 selection:bg-indigo-500/30">
        {children}
      </body>
    </html>
  )
}
