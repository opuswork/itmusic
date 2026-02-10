/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Docker 빌드일 때만 standalone 사용 (Vercel에서는 사용하지 않음)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  // /dashboard/auth 404 방지: 동일한 로그인 페이지로 내부 리라이트
  async rewrites() {
    return [
      { source: "/dashboard/auth", destination: "/dashboard/login" },
    ];
  },
};

export default nextConfig;