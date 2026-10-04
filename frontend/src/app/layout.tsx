import type { Metadata } from "next";
import "./globals.css";
import { Header } from "../components/layout/Header/Header";
import { Footer } from "../components/layout/Footer/Footer";

export const metadata: Metadata = {
  title: "GarMer | Africa's Digital Garment Marketplace",
  description: "Source Quality Garments From Trusted Suppliers. GarMer connects garment buyers with verified suppliers across China and Africa.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Header />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
