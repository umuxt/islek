import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "İşlek Admin",
  description: "İşlek Platform Yönetim Paneli",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
