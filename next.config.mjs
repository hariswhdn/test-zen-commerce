/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: `cdn.${process.env.API_URL}`,
        port: '',
      },
    ],
  },
};

export default nextConfig;
