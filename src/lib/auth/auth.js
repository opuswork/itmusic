"use client";

import { http } from "@/lib/http/client";

/**
 * 로그인 API 호출
 * @param {string} id - username (members 테이블의 username)
 * @param {string} password - 비밀번호
 * @param {boolean} [admin] - true이면 관리자 로그인 (username 'admin'만 허용)
 */
export async function login(id, password, admin = false) {
  try {
    const response = await http.post("/auth/login", {
      id,
      password,
      ...(admin ? { admin: true } : {}),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "로그인에 실패했습니다." };
  }
}

/**
 * 로그아웃 API 호출
 */
export async function logout() {
  try {
    const response = await http.post("/auth/logout");
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: "로그아웃에 실패했습니다." };
  }
}

/**
 * 현재 사용자 정보 조회
 */
export async function getCurrentUser() {
  try {
    const response = await http.get("/auth/me");
    return response.data;
  } catch (error) {
    return { success: false, isAuthenticated: false };
  }
}

/**
 * 인증 상태 확인 (클라이언트 컴포넌트용)
 */
export async function checkAuth() {
  try {
    const data = await getCurrentUser();
    return data.isAuthenticated === true;
  } catch (error) {
    return false;
  }
}
