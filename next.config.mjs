/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Docker 빌드일 때만 standalone 사용 (Vercel에서는 사용하지 않음)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
};

export default nextConfig;