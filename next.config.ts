import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/((?!coming-soon|api|_next|favicon.ico|.*\\.png|.*\\.svg|.*\\.ico).*)",
        destination: "/coming-soon",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
