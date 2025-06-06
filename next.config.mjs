// next.config.mjs
import crypto from 'crypto-browserify';
import stream from 'stream-browserify';

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: 'crypto-browserify',  // Usar la ruta como string
        stream: 'stream-browserify',  // Usar la ruta como string
        fs: false,
        path: false,
        os: false,
      };
    }
    return config;
  },
};

export default nextConfig;