import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Inventari del Cau · AE Albada",
  description: "Inventari compartit de material, farmaciola i insígnies del Cau.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ca">
      <body className="antialiased">{children}</body>
    </html>
  );
}
