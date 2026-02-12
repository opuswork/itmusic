"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, logout } from '@/lib/auth/auth';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuthStatus = async () => {
      try {
        const data = await getCurrentUser();
        setIsAuthenticated(data.isAuthenticated === true);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
    
    // 페이지 포커스 시 인증 상태 다시 확인
    const handleFocus = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsAuthenticated(false);
      router.replace('/');
      router.refresh();
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // 모바일 메뉴 아이템 (로그인 상태에 따라 변경)
  const mobileMenuItems = isAuthenticated
    ? [
        { label: '마이페이지', href: '/mypage' },
        { label: '로그아웃', href: '#', onClick: handleLogout },
        { label: '이탈리아음악협회소개', href: '/about/association' },
        { label: '운영위원&지도위원', href: '/committee/operators' },
        { label: '협회공지&소식', href: '/news/notice' },
      ]
    : [
        { label: '로그인', href: '/login' },
        { label: '이탈리아음악협회소개', href: '/about/association' },
        { label: '운영위원&지도위원', href: '/committee/operators' },
        { label: '협회공지&소식', href: '/news/notice' },
      ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.hidden : ''}`}>
      {/* 데스크톱 버전 */}
      <div className={styles.desktopHeader}>
        <div className={styles.headerContent}>
          {isLoading ? (
            // 로딩 중일 때는 아무것도 표시하지 않음
            <></>
          ) : isAuthenticated ? (
            // 로그인 상태: 마이페이지, 로그아웃
            <>
              <Link href="/mypage" className={styles.loginSection}>
                마이페이지
              </Link>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                로그아웃
              </button>
            </>
          ) : (
            // 비로그인 상태: 로그인, 회원가입
            <>
              <Link href="/login" className={styles.loginSection}>
                로그인
              </Link>
              {/* <Link href="/signup" className={styles.signupSection}>
                회원가입
              </Link> */}
            </>
          )}
        </div>
      </div>

      {/* 모바일 버전 */}
      <div className={styles.mobileHeader}>
        <Link href="/" className={styles.mobileLogo}>
          <Image
            src="/assets/logos/logo-s.png"
            alt="이탈리아음악협회"
            width={120}
            height={20}
            priority
          />
        </Link>
        <button 
          className={styles.menuButton}
          onClick={toggleMobileMenu}
          aria-label="메뉴"
        >
          <Image
            src="/assets/icons/ic_menu.png"
            alt="메뉴"
            width={24}
            height={24}
          />
        </button>
        {isMobileMenuOpen && (
          <div className={styles.dropdownMenu}>
            {mobileMenuItems.map((item, index) => {
              if (item.onClick) {
                return (
                  <button
                    key={index}
                    onClick={() => {
                      item.onClick();
                      setIsMobileMenuOpen(false);
                    }}
                    className={styles.dropdownItem}
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={index}
                  href={item.href}
                  className={styles.dropdownItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
