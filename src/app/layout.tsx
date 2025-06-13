import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navigation from "./components/common/Navigation";
import "./globals.css";
import { SessionProvider } from "@/hooks/useSession";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Zealthy Onboarding',
  description: 'Multi-step onboarding application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F4EEE5]`}
      >
        <SessionProvider>
        <Navigation />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
