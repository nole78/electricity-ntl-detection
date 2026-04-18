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

export const metadata: Metadata = {
  title: "Hack2on Elctric",
  description: "Electro energy system managing app by Hack2on Electric",
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
      <body className="min-h-full flex flex-col">
        {/*BACKGROUND IMAGE */}
        <div className="fixed inset-0 -z-20">
          <img
            src="/bg.jpg"
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>
        {/*COLOR OVERLAY */}
        <div className="fixed inset-0 -z-10 bg-background/70" />

        {children}
      </body>
    </html>
  );
}
