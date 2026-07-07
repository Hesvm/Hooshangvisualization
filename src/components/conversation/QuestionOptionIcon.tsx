"use client";

import type { Icon } from "iconsax-react";
import {
  Apple,
  BatteryCharging,
  Book,
  Briefcase,
  Code,
  Flash,
  Forbidden2,
  Game,
  LikeShapes,
  Magicpen,
  MoneyTick,
  Teacher,
  TimerStart,
  VideoPlay,
  Weight,
  Windows,
  Home,
} from "iconsax-react";
import styles from "@/components/conversation/conversation.module.css";

const OPTION_ICONS: Record<string, Icon> = {
  "3d": Magicpen,
  any: LikeShapes,
  dev: Code,
  game: Game,
  gym: Weight,
  home: Home,
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
