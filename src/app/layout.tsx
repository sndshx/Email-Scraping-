import type { Metadata } from "next";
import { Raleway, Geist } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata: Metadata = {
  title: "LeadScraper",
  description: "Find business emails in seconds",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='20' fill='%232563eb'/><text y='.9em' font-size='70' x='15' fill='white' font-weight='bold'>L</text></svg>",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${raleway.variable} ${geist.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-raleway">{children}</body>
      </html>
    </ClerkProvider>
  );
}