import type { Metadata, Viewport } from "next";
import { AppViewport } from "@/components/AppViewport";
import { VirtualNotificationProvider } from "@/components/notifications/VirtualNotificationProvider";
import "../styles/tokens.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "هوشنگ",
  description: "دستیار هوشمند فضاهای شخصی",
  appleWebApp: {
    title: "هوشنگ",
    statusBarStyle: "black-translucent",
  },
};

export const viewport: Viewport = {
  themeColor: "#4B54E8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <VirtualNotificationProvider>
          <AppViewport>{children}</AppViewport>
        </VirtualNotificationProvider>
      </body>
    </html>
  );
}
