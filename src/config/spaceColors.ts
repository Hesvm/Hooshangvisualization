import { RENTAL_HOUSE_SPACE_ID } from "@/lib/mocks/rentalHouse";

/**
 * Single source of truth for each space's accent color (RGB channels, no
 * `rgb()` wrapper so callers can compose `rgba(${accent}, alpha)`).
 * `spacePages.tsx` and the dock config both read from here so the same
 * space never renders two different accents.
 */
export const SPACE_ACCENT_RGB: Record<string, string> = {
  badan: "232, 56, 79", // soft pink, from the heart icon
  kharid: "80, 130, 220", // soft blue, from the shopping icon
  "kharid-supermarketi": "245, 112, 34", // restrained grocery orange
  "modiriat-mali": "26, 158, 107", // finance green, from the success token
  [RENTAL_HOUSE_SPACE_ID]: "196, 130, 74", // warm terracotta
  baghie: "142, 146, 153", // neutral slate, catch-all space
  ravan: "154, 111, 224", // calm lavender, mind/mental space
  "gasht-o-gozar": "20, 165, 180", // teal, travel/exploration
  yadgiri: "214, 158, 46", // amber gold, learning
};

const FALLBACK_ACCENT_RGB = "142, 146, 153";

export function getSpaceAccentRgb(spaceId: string): string {
  return SPACE_ACCENT_RGB[spaceId] ?? FALLBACK_ACCENT_RGB;
}
