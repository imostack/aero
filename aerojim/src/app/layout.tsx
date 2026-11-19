import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "AeroJim | Oil & Gas Equipment Leasing",
  description:
    "Lease well testing equipment, barges and more. Tell AeroJim what you need and we source availability and day rates from trusted owners. Also wholesale oil and gas parts.",
  keywords:
    "oil gas equipment leasing, well testing equipment, barges for lease, Nigeria, oil gas wholesale, valves, flanges, wellhead, pipes, instrumentation, oil field equipment, upstream downstream",
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
