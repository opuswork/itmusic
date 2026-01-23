/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Docker를 위한 standalone 빌드 출력
  output: 'standalone',
};

export default nextConfig;