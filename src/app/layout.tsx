import type { Metadata } from "next";
import "./globals.css";
import Image from "next/image";
import Link from "next/link";

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
        <Header />
        {children}
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="h-14 border-b border-so-black-25 w-full max-w-content-width mx-auto flex items-center py-2.5">
      <Link href="/" className="flex items-center gap-0.5 text-lg">
        <Image
          src="/so-logo.webp"
          alt="Stack overflow logo"
          width={30}
          height={30}
        />

        <span className="font-light">stank</span>
        <span className="font-bold">overfart</span>
      </Link>

      <span className="ml-8 flex items-center gap-8 text-sm text-gray-500">
        <span>Products</span>
        <span>OverflowAI</span>
      </span>

      <input
        className="ml-6 basis-0 grow rounded-md border border-[rgb(186,191,197)] h-full placeholder:text-sm px-2 flex items-center"
        placeholder="Search..."
      />

      <span className="ml-4 flex items-center gap-1 text-xs">
        <Image src="/avatar.png" alt="Avatar" width={24} height={24} />
        <span className="font-bold text-[rgb(99,107,116)]">0</span>

        <span className="text-[rgb(100,102,104)]">● 0</span>

        <span className="text-[rgb(142,97,57)]">● 0</span>
      </span>

      <span className="ml-4 flex items-center gap-4">
        <svg
          aria-hidden="true"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          className="fill-[rgb(99,107,116)]"
        >
          <path d="M4.63 1h10.56a2 2 0 0 1 1.94 1.35L20 10.79V15a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-4.21l2.78-8.44c.25-.8 1-1.36 1.85-1.35m8.28 12 2-2h2.95l-2.44-7.32a1 1 0 0 0-.95-.68H5.35a1 1 0 0 0-.95.68L1.96 11h2.95l2 2z"></path>
        </svg>

        <svg
          aria-hidden="true"
          className="fill-[rgb(24,134,75)]"
          width="18"
          height="18"
          viewBox="0 0 18 18"
        >
          <path d="M15 2V1H3v1H0v4c0 1.6 1.4 3 3 3v1c.4 1.5 3 2.6 5 3v2H5s-1 1.5-1 2h10c0-.4-1-2-1-2h-3v-2c2-.4 4.6-1.5 5-3V9c1.6-.2 3-1.4 3-3V2zM3 7c-.5 0-1-.5-1-1V4h1zm8.4 2.5L9 8 6.6 9.4l1-2.7L5 5h3l1-2.7L10 5h2.8l-2.3 1.8 1 2.7zM16 6c0 .5-.5 1-1 1V4h1z"></path>
        </svg>

        <svg
          aria-hidden="true"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          className="fill-[rgb(99,107,116)]"
        >
          <path d="M9 1C4.64 1 1 4.64 1 9s3.64 8 8 8 8-3.64 8-8-3.64-8-8-8m.81 12.13c-.02.71-.55 1.15-1.24 1.13-.66-.02-1.17-.49-1.15-1.2.02-.72.56-1.18 1.22-1.16.7.03 1.2.51 1.17 1.23M11.77 8c-.59.66-1.78 1.09-2.05 1.97a4 4 0 0 0-.09.75c0 .05-.03.16-.18.16H7.88c-.16 0-.18-.1-.18-.15.06-1.35.66-2.2 1.83-2.88.39-.29.7-.75.7-1.24.01-1.24-1.64-1.82-2.35-.72-.21.33-.18.73-.18 1.1H5.75c0-1.97 1.03-3.26 3.03-3.26 1.75 0 3.47.87 3.47 2.83 0 .57-.2 1.05-.48 1.44"></path>
        </svg>

        <svg
          aria-hidden="true"
          width="20"
          height="18"
          viewBox="0 0 20 18"
          className="fill-[rgb(99,107,116)]"
        >
          <path d="M15 1H3a2 2 0 0 0-2 2v2h16V3a2 2 0 0 0-2-2M1 13c0 1.1.9 2 2 2h8v3l3-3h1a2 2 0 0 0 2-2v-2H1zm16-7H1v4h16z"></path>
        </svg>
      </span>
    </header>
  );
}
