import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // The teen line was "coaching" before the brochure renamed it. Links to the
  // old address still land on the right page.
  async redirects() {
    return [
      {
        source: "/services/coaching",
        destination: "/services/adolescents",
        permanent: true,
      },
      {
        source: "/en/services/coaching",
        destination: "/en/services/adolescents",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
