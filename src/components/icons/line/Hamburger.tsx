import type { LineIconProps } from "./types";

/** Two-line menu mark (from the provided Menu.svg). Non-square (17×10), so
 *  `size` sets the width and height scales to keep the ratio. */
export function Hamburger({ size = 18, className }: LineIconProps) {
  const height = (size * 10) / 17;
  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 17 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1.11914 1.11938L15.5224 1.11939M1.11914 7.9602L15.5224 7.9602"
        stroke="currentColor"
        strokeWidth="2.23868"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
