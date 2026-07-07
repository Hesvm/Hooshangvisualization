import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // [THINK-INV] TEMPORARY diagnostic — isolate whether Strict Mode double-invoke
  // is stopping the morph animation. Revert after diagnosis.
  reactStrictMode: false,
};

export default nextConfig;
