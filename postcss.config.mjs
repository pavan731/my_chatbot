/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/my_chatbot',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
