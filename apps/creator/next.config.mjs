/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui"],
  images: {
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
