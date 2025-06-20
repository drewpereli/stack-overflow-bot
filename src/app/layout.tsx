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
      <body>
        <header className="h-14 border-b border-so-black-25"></header>
        {children}
      </body>
    </html>
  );
}
