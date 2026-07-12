import { ImageResponse } from "next/og";
import { AppIconMark } from "@/lib/appIconMark";

export function GET() {
  return new ImageResponse(<AppIconMark size={192} />, { width: 192, height: 192 });
}
