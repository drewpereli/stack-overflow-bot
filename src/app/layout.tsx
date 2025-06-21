import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stack Overflow Bot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <header className="h-14 border-b border-so-black-25 w-full max-w-content-width mx-auto"></header>
        {children}
      </body>
    </html>
  );
}
