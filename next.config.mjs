/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://13.209.72.246:9090/api/:path*",
      },
    ];
  },
};

export default nextConfig;

