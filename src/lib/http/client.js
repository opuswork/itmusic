import axios from 'axios';

// Next.js API Routes를 사용하므로 상대 경로 사용
export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '/api',
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    // TODO: 공통 에러 처리 (401, 403, 500)
    return Promise.reject(error);
  },
);