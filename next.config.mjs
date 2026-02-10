/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Docker 빌드일 때만 standalone 사용 (Vercel에서는 사용하지 않음)
  ...(process.env.DOCKER_BUILD === 'true' && { output: 'standalone' }),
  // /dashboard/login, /dashboard/auth → /dashboard-admin (Vercel에서 네스팅 라우트 404 회피)
  async redirects() {
    return [
      { source: "/dashboard/login", destination: "/dashboard-admin", permanent: true },
      { source: "/dashboard/auth", destination: "/dashboard-admin", permanent: true },
    ];
  },
};

export default nextConfig;