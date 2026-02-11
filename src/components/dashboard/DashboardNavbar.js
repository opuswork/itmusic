'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './DashboardNavbar.module.css';

export default function DashboardNavbar({ sidebarOpen, onToggleSidebar }) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <nav
      className={`${styles.navbar} ${sidebarOpen ? styles.navbarSidebarExpanded : styles.navbarSidebarCollapsed}`}
    >
      <div className={styles.navLeft}>
        <button
          type="button"
          className={styles.toggleBtn}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? '사이드바 접기' : '사이드바 펼치기'}
        >
          ☰
        </button>
        <Link href="/dashboard" className={styles.navLink}>
          관리자메인
        </Link>
        <Link href="#" className={`${styles.navLink} ${styles.dNone}`} style={{ display: 'none' }}>
          Contact
        </Link>
      </div>

      <div className={styles.navRight}>
        <button
          type="button"
          className={styles.searchBtn}
          onClick={() => setSearchOpen((p) => !p)}
          aria-label="검색"
        >
          🔍
        </button>
      </div>
    </nav>
  );
}
