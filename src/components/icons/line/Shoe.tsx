import type { LineIconProps } from "./types";

export function Shoe({ size = 24, strokeWidth = 2.25, className }: LineIconProps) {
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
        d="M3 18.5v-4c1.6 0 2.4-.7 3.4-1.9 1-1.2 1.7-1.8 3-1.6.8.1 1.2.8 1.2 1.7 0 1.3 1.1 2.3 2.6 2.3H21v3.5c0 .8-.6 1.4-1.4 1.4H4.4c-.8 0-1.4-.6-1.4-1.4Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.4 11v-4.8"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
