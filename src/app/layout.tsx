import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Advogasus",
  description: "sistema de processamento do sus",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
