import type { LineIconProps } from "./types";

export function HeartOutline({ size = 24, strokeWidth = 2.25, className }: LineIconProps) {
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
        d="M12 20.2s-7.5-4.6-9.6-9.7C.9 6.9 2.7 3.4 6.3 3.1c2-.2 3.9.8 5.7 2.7 1.8-1.9 3.7-2.9 5.7-2.7 3.6.3 5.4 3.8 3.9 7.4-2.1 5.1-9.6 9.7-9.6 9.7Z"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
