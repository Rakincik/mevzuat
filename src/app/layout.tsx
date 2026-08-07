import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { AppProvider } from "@/context/AppContext";
import ClientOverlays from "@/components/ClientOverlays";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MEVZUAT ADAM - Görevde Yükselme ve Mevzuat Platformu",
  description: "Kurumsal eğitim çözümleri ve sınav hazırlık platformu",
  icons: {
    icon: [
      { url: "/favicon.png" },
      { url: "/favicon.ico" },
    ],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>
        <AppProvider>
          <Navbar />
          <ClientOverlays />
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
          <Footer />
          <WhatsAppButton />
        </AppProvider>
      </body>
    </html>
  );
}

