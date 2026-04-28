import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "wolvrene-os",
  description: "wolvrene-os trading workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#0a0a0b] text-[#fafafa]">{children}</body>
    </html>
  );
}
