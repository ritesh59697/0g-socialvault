import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: false,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  turbopack: {
    resolveAlias: {
      crypto: 'crypto-browserify',
      stream: 'stream-browserify',
      buffer: 'buffer',
    },
  },
};

export default nextConfig;