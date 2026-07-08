"use client";

import type { Icon } from "iconsax-react";
import {
  Apple,
  ArrowSwapHorizontal,
  BatteryCharging,
  Book,
  Box,
  Briefcase,
  Calendar,
  Camera,
  Clock,
  Danger,
  Edit2,
  Code,
  Flash,
  Forbidden2,
  Game,
  Heart,
  LikeShapes,
  Magicpen,
  MoneyTick,
  ShieldTick,
  ShoppingBag,
  Teacher,
  TimerStart,
  TrendUp,
  VideoPlay,
  Weight,
  Windows,
  Home,
} from "iconsax-react";
import styles from "@/components/conversation/conversation.module.css";

const OPTION_ICONS: Record<string, Icon> = {
  "3d": Magicpen,
  any: LikeShapes,
  basket: ShoppingBag,
  calendar: Calendar,
  camera: Camera,
  check: LikeShapes,
  dev: Code,
  edit: Edit2,
  family: Heart,
  game: Game,
  gym: Weight,
  home: Home,
  leaf: Box,
  longevity: TimerStart,
  mac: Apple,
  "no-apple": Forbidden2,
  office: Briefcase,
  portability: BatteryCharging,
  power: Flash,
  study: Book,
  uni: Teacher,
  value: MoneyTick,
  video: VideoPlay,
  windows: Windows,
  "horizon-short": Clock,
  "horizon-medium": Calendar,
  "horizon-long": TrendUp,
  "risk-low": ShieldTick,
  "risk-medium": ArrowSwapHorizontal,
  "risk-high": Danger,
};

type QuestionOptionIconProps = {
  icon: string;
};

export function QuestionOptionIcon({ icon }: QuestionOptionIconProps) {
  const OptionIcon = OPTION_ICONS[icon] ?? Magicpen;

  return (
    <span className={styles.qIcon} aria-hidden="true">
      <OptionIcon variant="Bold" size={21} color="currentColor" />
    </span>
  );
}
