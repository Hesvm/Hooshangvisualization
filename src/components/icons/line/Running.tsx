import type { LineIconProps } from "./types";

export function Running({ size = 24, strokeWidth = 2.25, className }: LineIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="15" cy="4.5" r="1.8" stroke="currentColor" strokeWidth={strokeWidth} />
      <path
        d="M9 21l2.2-4.5 2-2-1-4-3.2 1.5L7 14M11.2 14.5 13 12l3 1.5 2.5 1M13 12l-1.5-4.5 3-2.5"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
