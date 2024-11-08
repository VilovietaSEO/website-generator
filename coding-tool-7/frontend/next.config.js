module.exports = {
  reactStrictMode: true,
  images: {
    domains: ['your-s3-bucket.s3.amazonaws.com'],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_CLAUDE_API_KEY: process.env.NEXT_PUBLIC_CLAUDE_API_KEY,
  },
  async redirects() {
    return [
      {
        source: '/dashboard',
        destination: '/dashboard/projects',
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
};