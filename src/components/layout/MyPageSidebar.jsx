"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MyPageSidebar.module.css';

const myPageMenu = [
  { label: '나의 프로파일일', href: '#' },//, href: '/mypage/profile'
  { label: '나의 연주영상', href: '#' },//, href: '/mypage/videos'
  { label: '좋아하는 영상', href: '#' },//, href: '/mypage/liked-videos'
  { label: '나의 연주사진', href: '#' },//, href: '/mypage/photos'
];

export default function MyPageSidebar({ isCollapsed, onToggle, showExpandButton = false }) {
  const pathname = usePathname();

  if (isCollapsed && showExpandButton) {
    return (
      <button className={styles.expandButton} onClick={onToggle}>
        <span className={styles.toggleIcon}>▽</span>
        <span>서브메뉴펼치기</span>
      </button>
    );
  }

  if (isCollapsed) {
    return null;
  }

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.sidebarTitle}>DASHBOARD</h2>
      <ul className={styles.sidebarMenu}>
        {myPageMenu.map((item, index) => (
          <li key={index} className={styles.sidebarMenuItem}>
            <Link
              href={item.href}
              className={`${styles.sidebarLink} ${pathname === item.href ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <button className={styles.collapseButton} onClick={onToggle}>
        <span className={styles.toggleIcon}>▲</span>
        <span>서브메뉴접기</span>
      </button>
    </aside>
  );
}
