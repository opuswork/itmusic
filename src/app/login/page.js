"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import MembershipSidebar from '@/components/layout/MembershipSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './page.module.css';
import adminStyles from '../dashboard-admin/page.module.css';

export default function LoginPage() {
  const searchParams = useSearchParams();
  const isAdminMode = useMemo(() => searchParams.get('mode') === 'admin', [searchParams]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  const handleKakaoLogin = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // 카카오 로그인: 서버의 카카오 인증 엔드포인트로 리다이렉트
    const kakaoLoginUrl = '/api/auth/kakao';
    
    console.log('카카오 로그인 시작:', kakaoLoginUrl);
    window.location.href = kakaoLoginUrl;
  };

  // Admin 로그인 (대시보드) – /login?mode=admin 으로 접근 (Vercel 404 회피용)
  if (isAdminMode) {
    return (
      <div className={adminStyles.loginBox}>
        <div className={adminStyles.card}>
          <div className={adminStyles.cardHeader}>
            <Link href="/dashboard" className={adminStyles.h1}>
              <b>Admin Login</b>
            </Link>
          </div>
          <div className={adminStyles.cardBody}>
            <p className={adminStyles.loginBoxMsg}>Please login to start your session</p>
            <form action="/api/auth/login" method="post">
              <div className={adminStyles.inputGroup}>
                <input
                  type="text"
                  name="id"
                  className={adminStyles.formControl}
                  placeholder="Username"
                  required
                  autoComplete="username"
                />
                <div className={adminStyles.inputGroupAppend}>
                  <div className={adminStyles.inputGroupText}>
                    <span className={adminStyles.fasFaEnvelope} />
                  </div>
                </div>
              </div>
              <div className={adminStyles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  className={adminStyles.formControl}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                />
                <div className={adminStyles.inputGroupAppend}>
                  <div className={adminStyles.inputGroupText}>
                    <span className={adminStyles.fasFaLock} />
                  </div>
                </div>
              </div>
              <div className={adminStyles.row}>
                <div className={adminStyles.col4}>
                  <button type="submit" className={adminStyles.btnPrimaryBtnBlock}>
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder}></div>
          {isSidebarCollapsed && (
            <MembershipSidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={handleSidebarToggle} 
              showExpandButton={true} 
            />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {!isSidebarCollapsed && (
          <MembershipSidebar 
            isCollapsed={isSidebarCollapsed} 
            onToggle={handleSidebarToggle} 
          />
        )}
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="멤버쉽 Login" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>Login</h1>
            <div className={styles.loginFormContainer}>
              <div className={styles.loginForm}>
                <div className={styles.snsLoginButtons}>
                  <button 
                    type="button" 
                    className={`${styles.snsButton} ${styles.facebookButton}`}
                    onClick={() => {
                      // TODO: Facebook 로그인 구현
                      console.log('Facebook 로그인');
                    }}
                  >
                    <span className={styles.snsIcon}>f</span>
                    <span className={styles.snsButtonText}>Facebook 로그인</span>
                  </button>
                  
                  <button 
                    type="button" 
                    className={`${styles.snsButton} ${styles.kakaoButton}`}
                    onClick={handleKakaoLogin}
                  >
                    <span className={styles.snsIcon}>💬</span>
                    <span className={styles.snsButtonText}>카카오 로그인</span>
                  </button>
                  
                  <button 
                    type="button" 
                    className={`${styles.snsButton} ${styles.naverButton}`}
                    onClick={() => {
                      // TODO: 네이버 로그인 구현
                      console.log('네이버 로그인');
                    }}
                  >
                    <span className={styles.snsIcon}>N</span>
                    <span className={styles.snsButtonText}>네이버 로그인</span>
                  </button>
                  
                  <button 
                    type="button" 
                    className={`${styles.snsButton} ${styles.googleButton}`}
                    onClick={() => {
                      // TODO: Google 로그인 구현
                      console.log('Google 로그인');
                    }}
                  >
                    <span className={styles.snsIcon}>G+</span>
                    <span className={styles.snsButtonText}>Google 로그인</span>
                  </button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
