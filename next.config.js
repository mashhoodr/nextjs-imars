/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Book covers come from Goodreads. Routing them through next/image means the
    // browser only ever talks to karachiwala.dev: the file is fetched
    // server-side, resized, converted to AVIF/WebP and cached at the edge. A
    // plain <img> pointing at i.gr-assets.com would add a third-party origin to
    // a site that currently loads 68 bytes of third-party code.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.gr-assets.com",
        pathname: "/images/**",
      },
      // Podcast episode artwork, served by Anchor's CDN.
      {
        protocol: "https",
        hostname: "d3t3ozftmdmh3i.cloudfront.net",
        pathname: "/**",
      },
    ],
  },

  // The repo sits inside a parent directory that has its own package-lock.json,
  // which Turbopack warns about on every build. This pins the workspace root.
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
