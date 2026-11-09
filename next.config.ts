import type { NextConfig } from "next";

// The native (Capacitor) build is a fully static export. The web/Vercel build
// stays a normal Next build so route handlers can be added later.
const native = process.env.BUILD_TARGET === "native";

const nextConfig: NextConfig = native
  ? {
      output: "export",
      // /events/view/ -> events/view/index.html, which the app's local server resolves
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {};

export default nextConfig;
