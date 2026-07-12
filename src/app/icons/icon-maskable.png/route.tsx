import { ImageResponse } from "next/og";
import { AppIconMark } from "@/lib/appIconMark";

export function GET() {
  // Maskable icons are cropped by the OS into arbitrary shapes, so the
  // background stays full-bleed (no corner radius) and the ghost is
  // scaled down to stay inside the ~80% safe zone.
  return new ImageResponse(<AppIconMark size={512} cornerRadius={0} ghostScale={0.42} />, {
    width: 512,
    height: 512,
  });
}
