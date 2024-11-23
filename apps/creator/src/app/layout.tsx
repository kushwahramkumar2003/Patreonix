import "@repo/ui/globals.css";
import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import { Providers } from "../components/Providers";
import "@solana/wallet-adapter-react-ui/styles.css";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Patreonix | Decentralized Creator Platform",
  description:
    "Empower your creativity with Patreonix, the decentralized platform for content creators and their supporters.",
  keywords: [
    "Patreonix",
    "creator",
    "decentralized",
    "content",
    "blockchain",
    "Solana",
  ],
  authors: [{ name: "Patreonix Team" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://patreonix.com",
    siteName: "Patreonix",
    title: "Patreonix | Decentralized Creator Platform",
    description:
      "Empower your creativity with Patreonix, the decentralized platform for content creators and their supporters.",
    images: [
      {
        url: "https://patreonix.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Patreonix - Decentralized Creator Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Patreonix | Decentralized Creator Platform",
    description:
      "Empower your creativity with Patreonix, the decentralized platform for content creators and their supporters.",
    images: ["https://patreonix.com/twitter-image.jpg"],
    creator: "@patreonix",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="font-sans bg-zinc-900 text-zinc-100">
        <Providers>
          {children}
          <Toaster position="top-center" richColors/>
        </Providers>
      </body>
    </html>
  );
}
