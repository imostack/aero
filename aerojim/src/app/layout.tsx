import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AeroJim | Oil & Gas Wholesale Supply",
  description:
    "AeroJim is a wholesale supplier of oil and gas accessories, parts, and ancillaries for upstream and downstream equipment. Valves, flanges, wellhead, instrumentation and more.",
  keywords:
    "oil gas wholesale, valves, flanges, wellhead, pipes, instrumentation, oil field equipment, upstream downstream",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8f9fa] text-gray-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
