import type { DockAppEntry } from "@/types/home";
import { spaces } from "@/config/spaces";
import { spacePages } from "@/config/spacePages";
import { getSpaceAccentRgb } from "@/config/spaceColors";

/** Collapsed dock shows this many app slots (+ 1 "more" chrome arrow). */
export const DOCK_COLLAPSED_COUNT = 4;

export const DOCK_APPS: DockAppEntry[] = spaces.map((space) => ({
  id: space.id,
  label: space.label,
  iconSrc: space.iconSrc,
  accentRgb: getSpaceAccentRgb(space.id),
  href: spacePages[space.id] ? `/spaces/${space.id}` : undefined,
  hasNotification: space.hasNotification,
}));
