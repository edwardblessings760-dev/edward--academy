import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Past paper PDFs are uploaded through a Server Action.
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
};

export default nextConfig;
