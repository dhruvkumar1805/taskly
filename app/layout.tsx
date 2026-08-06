import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { ServiceWorkerRegister } from "@/components/service-worker-register";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const title = "Taskly — One list for everything that matters today";
const description =
  "Taskly is where your day lives: capture fast, see what's actually due, close the loop. No boards to configure, no busywork to maintain.";

export const metadata: Metadata = {
  metadataBase: new URL("https://taskly-pmmm.vercel.app"),
  title: {
    default: title,
    template: "%s · Taskly",
  },
  description,
  openGraph: {
    title,
    description,
    siteName: "Taskly",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Taskly",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#141414" },
    { media: "(prefers-color-scheme: light)", color: "#f6f6f6" },
  ],
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
        <ServiceWorkerRegister />
        <script
          src="https://solvochat.com/widget.js"
          data-title="Taskly Support"
          data-color="#d9622f"
          data-site-id="d20LIFOt8Q"
          data-offset-bottom="10"
          data-offset-side="10"
          data-logo="https://taskly-pmmm.vercel.app/favicon.ico"
          async
        ></script>
      </body>
    </html>
  );
}
