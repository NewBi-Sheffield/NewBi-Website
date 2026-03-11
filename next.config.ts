import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/((?!coming-soon|api|_next|favicon.ico|logo.svg).*)",
        destination: "/coming-soon",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
