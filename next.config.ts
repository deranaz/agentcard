import type { NextConfig } from "next";

const isPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // Static export so we can deploy to GitHub Pages or any static host.
  output: "export",
  // GitHub Pages serves from /<repo>/ subpath.
  basePath: isPagesBuild ? "/agentcard" : undefined,
  assetPrefix: isPagesBuild ? "/agentcard/" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
