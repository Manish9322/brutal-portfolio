/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Lets a second Next process (e.g. a verification run) use its own build
  // directory instead of clobbering the .next cache of a running dev server.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
    ],
  },
};

export default nextConfig;
