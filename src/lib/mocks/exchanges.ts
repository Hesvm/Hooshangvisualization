/**
 * Exchange directory for the crypto-connect step. Every exchange listed here
 * has a real provided logo asset in public/images/exchanges.
 */

import type { ExchangeDef } from "@/types/finance";

export const EXCHANGES: ExchangeDef[] = [
  {
    id: "bitpin",
    name: "بیت‌پین",
    initial: "ب",
    color: "#0FB88A",
    logoSrc: "/images/exchanges/bitpin.webp",
    status: "not_connected",
  },
  {
    id: "wallex",
    name: "والکس",
    initial: "و",
    color: "#3B93EB",
    logoSrc: "/images/exchanges/wallex.webp",
    status: "not_connected",
  },
  {
    id: "nobitex",
    name: "نوبیتکس",
    initial: "ن",
    color: "#F2A93B",
    logoSrc: "/images/exchanges/nobitex.webp",
    status: "not_connected",
  },
  {
    id: "dpex",
    name: "صرافی دیپکس",
    initial: "د",
    color: "#1C2B39",
    logoSrc: "/images/exchanges/dpex.png",
    status: "not_connected",
  },
];

export const MULTI_EXCHANGE_OPTION_ID = "multi-exchange";
export const PERSONAL_WALLET_OPTION_ID = "personal-wallet";
