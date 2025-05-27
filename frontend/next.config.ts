import type { Configuration } from 'webpack';

const nextConfig = {
  // ...other config
  webpack(config: Configuration) {
    // Type assertion: config.module is always defined in Next.js context
    const webpackModule = config.module as NonNullable<Configuration['module']>;
    if (!webpackModule.rules) {
      webpackModule.rules = [];
    }
    webpackModule.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};
module.exports = nextConfig;
