'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './DashboardSidebar.module.css';

const menuItems = [
  { href: '/dashboard/adm-slide', label: '슬라이드' },
  { href: '/dashboard/adm-video', label: '협회원연주영상' },
  { href: '/dashboard/adm-culture', label: '이탈리아문화산책' },
  { href: '/dashboard/adm-study', label: '유학정보' },
  { href: '/dashboard/adm-executives', label: '운영위원' },
  { href: '/dashboard/adm-director', label: '음악감독' },
  { href: '/dashboard/adm-teachers', label: '지도위원' },
  { href: '/dashboard/adm-consultants', label: '상임이사' },
  { href: '/dashboard/adm-committee', label: '상임고문' },
  { href: '/dashboard/adm-notice', label: '공지사항' },
  { href: '/dashboard/adm-news', label: '공연소식' },
  { href: '/dashboard/adm-competitions', label: '콩쿠르소식' },
];

export default function DashboardSidebar({ isOpen = true, isCollapsed = false }) {
  const pathname = usePathname();
  const [menuExpanded, setMenuExpanded] = useState(true);

  const asideClass = [
    styles.aside,
    !isOpen && styles.asideCollapsed,
    isOpen && styles.asideOpen,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <aside className={asideClass}>
      <Link href="/dashboard" className={styles.brandLink}>
        <Image
          src="/assets/logos/logo-mobile.png"
          alt=""
          width={33}
          height={33}
          className={styles.brandImage}
        />
        <span className={styles.brandText}>관리자 메인</span>
      </Link>

      <div className={styles.sidebar}>
        <div className={styles.userPanel}>
          <div className={styles.userImage} />
          <div className={styles.userInfo}>
            <Link href="#">관리자1</Link>
          </div>
        </div>

        <nav>
          <ul className={styles.nav}>
            <li className={styles.navItem}>
              <button
                type="button"
                className={styles.navLink}
                onClick={() => setMenuExpanded((p) => !p)}
                style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left', font: 'inherit', color: 'inherit' }}
              >
                <span className={styles.navIcon} aria-hidden>▤</span>
                <span>관리자메뉴펼침</span>
                <span style={{ marginLeft: 'auto' }}>{menuExpanded ? '▲' : '▼'}</span>
              </button>
              {menuExpanded && (
                <ul className={styles.navTreeview}>
                  {menuItems.map((item) => (
                    <li key={item.href} className={styles.navItem}>
                      <Link
                        href={item.href}
                        className={`${styles.navLink} ${pathname === item.href ? styles.navLinkActive : ''}`}
                      >
                        <span className={styles.navIcon} />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}
