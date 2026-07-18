/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: '.',
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
