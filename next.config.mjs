/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  // Vercel에서는 standalone 미사용 (배포 실패 방지). Docker/로컬에서만 사용
  ...(process.env.VERCEL ? {} : { output: 'standalone' }),
};

export default nextConfig;