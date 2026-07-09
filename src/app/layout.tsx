import type { Metadata } from "next";
import { AppViewport } from "@/components/AppViewport";
import "../styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "هوشنگ",
  description: "دستیار هوشمند فضاهای شخصی",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <AppViewport>{children}</AppViewport>
      </body>
    </html>
  );
}
