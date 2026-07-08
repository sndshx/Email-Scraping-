import type { Metadata } from "next";
import { Raleway, Geist, Syne } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import WhatsAppWidget from "./component/WhatsAppWidget";

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

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "ScrapeEngine",
  description: "Find business emails in seconds",
  icons: {
    icon: "/logo.png",
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
        className={`${raleway.variable} ${geist.variable} ${syne.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col font-raleway">
          {children}
          <WhatsAppWidget />
        </body>
      </html>
    </ClerkProvider>
  );
}