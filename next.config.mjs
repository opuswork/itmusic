/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Docker 빌드일 때만 standalone 사용 (Vercel에서는 사용하지 않음)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  // Admin 로그인: 404 나는 경로 → 동작하는 /login?mode=admin 으로 리다이렉트
  async redirects() {
    return [
      { source: "/dashboard/login", destination: "/login?mode=admin", permanent: false },
      { source: "/dashboard/auth", destination: "/login?mode=admin", permanent: false },
      { source: "/dashboard-admin", destination: "/login?mode=admin", permanent: false },
    ];
  },
};

export default nextConfig;