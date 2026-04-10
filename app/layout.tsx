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
  title: "OFF/BEAT",
  description: "A local vinyl marketplace for Chicago collectors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <footer className="w-full border-t border-gray-200 py-6 px-4 mt-auto">
          <div className="max-w-4xl mx-auto text-center text-xs text-gray-500 space-y-1">
            <p>
              This application uses Discogs&apos; API but is not affiliated
              with, sponsored or endorsed by Discogs. &apos;Discogs&apos; is a
              trademark of Zink Media, LLC.
            </p>
            <p>
              Data provided by{" "}
              <a
                href="https://www.discogs.com"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-gray-700"
              >
                Discogs
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
