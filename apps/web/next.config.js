/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-dev-tools"],
  experimental: {
    dynamicIO: true,
  },
};

export default nextConfig;
