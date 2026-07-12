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
  /* iOS Safari's default keyboard behavior pans the visual viewport instead of
     resizing the layout viewport, which shifts our position:fixed app shell
     off-screen out from under it (see useIOSViewportHeight.ts). This makes
     the keyboard actually shrink the layout viewport (iOS 17.4+, modern
     Chrome) so dvh/fixed sizing stays correct without JS compensation. */
  interactiveWidget: "resizes-content",
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
