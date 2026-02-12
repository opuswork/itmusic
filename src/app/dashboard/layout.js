'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/auth';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const isAdminLogin = pathname?.endsWith('/admin-login');

  useEffect(() => {
    if (isAdminLogin) {
      setAuthChecked(true);
      return;
    }
    let cancelled = false;
    getCurrentUser()
      .then((data) => {
        if (cancelled) return;
        const ok = data?.isAuthenticated === true && data?.user?.username === 'admin';
        setIsAdmin(ok);
        setAuthChecked(true);
        if (!ok) {
          router.replace('/dashboard/admin-login');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthChecked(true);
          setIsAdmin(false);
          router.replace('/dashboard/admin-login');
        }
      });
    return () => { cancelled = true; };
  }, [isAdminLogin, router]);

  if (isAdminLogin) {
    return <>{children}</>;
  }

  if (!authChecked || !isAdmin) {
    return (
      <div className={styles.authChecking}>
        <p>확인 중...</p>
      </div>
    );
  }

  return (
    <div className={`${styles.wrapper} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
      {sidebarOpen && (
        <div
          className={styles.sidebarBackdrop}
          onClick={() => setSidebarOpen(false)}
          onKeyDown={(e) => e.key === 'Escape' && setSidebarOpen(false)}
          role="button"
          tabIndex={-1}
          aria-label="사이드바 닫기"
        />
      )}
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <DashboardSidebar isOpen={sidebarOpen} />
      <div
        className={`${styles.contentWrapper} ${!sidebarOpen ? styles.contentWrapperSidebarCollapsed : ''}`}
      >
        {children}
      </div>
      <footer
        className={`${styles.mainFooter} ${!sidebarOpen ? styles.mainFooterSidebarCollapsed : ''}`}
      >
        <strong>Copyright &copy; 이탈리아음악협회.</strong> All rights reserved.
      </footer>
    </div>
  );
}
