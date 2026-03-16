import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/shared/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const outfit = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "PerfectWave Services — Data Bundles & Picture Frames in Ghana",
    template: "%s | PerfectWave Services",
  },
  description:
    "Buy affordable MTN, Telecel & AirtelTigo data bundles and premium custom picture frames in Ghana. Fast delivery, great prices.",
  keywords: ["data bundles Ghana", "MTN bundles", "Telecel bundles", "picture frames Ghana", "custom frames"],
  openGraph: {
    title: "PerfectWave Services — Data Bundles & Picture Frames",
    description: "Shop data bundles and custom picture frames in Ghana",
    type: "website",
    locale: "en_GH",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Outfit:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${plusJakartaSans.variable} ${outfit.variable} antialiased`}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
