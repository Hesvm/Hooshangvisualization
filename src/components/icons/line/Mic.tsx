import type { LineIconProps } from "./types";

export function Mic({ size = 24, strokeWidth = 2.25, className }: LineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M12 15.5c2.21 0 4-1.79 4-4V6c0-2.21-1.79-4-4-4S8 3.79 8 6v5.5c0 2.21 1.79 4 4 4Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.35 9.65v1.7C4.35 15.57 7.78 19 12 19c4.22 0 7.65-3.43 7.65-7.65v-1.7M12 19v3"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
