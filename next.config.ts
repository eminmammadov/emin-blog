import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // In Next.js 15.3.1, appDir is no longer experimental and is enabled by default
  // Remove the experimental.appDir option
};

export default nextConfig;
