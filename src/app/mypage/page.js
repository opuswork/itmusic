"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import MyPageSidebar from '@/components/layout/MyPageSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getCurrentUser } from '@/lib/auth/auth';
import styles from './page.module.css';

export default function MyPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const data = await getCurrentUser();
        const authenticated = data.isAuthenticated === true;
        setIsAuthenticated(authenticated);
        if (!authenticated) {
          router.replace('/login');
          return;
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.replace('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for focus events to re-check auth (e.g., after logout in another tab)
    const handleFocus = () => {
      checkAuth();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
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

  if (isLoading) {
    return (
      <div className={styles.container}>
        <Header />
        <Nav />
        <div className={styles.contentWrapper}>
          <div style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to /login
  }

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder}></div>
          {isSidebarCollapsed && (
            <MyPageSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} showExpandButton={true} />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {!isSidebarCollapsed && (
          <MyPageSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        )}
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="마이페이지" />
          </div>
          <main className={styles.mainContent}>
            <div className={styles.breadcrumb}>
              <Link href="/" className={styles.breadcrumbLink}>
                🏠 Dashboard
              </Link>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>마이페이지</span>
            </div>
            <h1 className={styles.pageTitle}>마이페이지</h1>
            <div className={styles.titleUnderline}></div>
            <p className={styles.description}>
              사용자님의 개인정보관리 및 연주영상, 사진등을 관리합니다.
            </p>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
