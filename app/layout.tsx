import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Taskly — Modern Task Manager",
  description:
    "Taskly is a modern task manager built with Next.js, Prisma, and shadcn/ui to organize tasks, track progress, and stay focused.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
        <script
          src="https://solvochat.com/widget.js"
          data-title="Taskly Support"
          data-color="#00b483"
          data-site-id="d20LIFOt8Q"
          data-offset-bottom="60"
          data-offset-side="20"
          data-logo="https://taskly-pmmm.vercel.app/favicon.ico"
          async
        ></script>
      </body>
    </html>
  );
}
