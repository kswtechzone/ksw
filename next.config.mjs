/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [
      'kswtechzone.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      's.gravatar.com',
    ],
  },
};

export default nextConfig;
