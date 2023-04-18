// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require("@sentry/nextjs");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["echarts"],
  webpack: (config) => {
    config.optimization.splitChunks.cacheGroups = {
      uikit: {
        test: /[\\/]node_modules[\\/](@mantine)[\\/]/,
        name: "uikit",
        chunks: "all",
      },
      charts: {
        test: /[\\/]node_modules[\\/](echarts|echarts-for-react)[\\/]/,
        //    /[\\/]node_modules[\\/](react|react-dom)[\\/]/
        name: "charts",
        chunks: "all",
      },
    };
    return config;
  },
};

module.exports = withSentryConfig(
  withBundleAnalyzer(nextConfig),
  { silent: true },
  { hideSourceMaps: false }
);
