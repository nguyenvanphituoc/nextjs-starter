/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  transpilePackages: ["three"],
  images: {
    domains: ["www.google.com", "www.google.co.in", "www.gstatic.com"],
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/search",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
