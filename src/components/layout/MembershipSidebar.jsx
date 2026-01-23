"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MembershipSidebar.module.css';

const membershipMenu = [
  { label: 'Login', href: '/login' },
  // { label: 'Sign-Up', href: '/signup' },
  // { label: '아이디 찾기', href: '/find-id' },
  // { label: '비밀번호 찾기', href: '/find-password' },
  { label: '서비스이용약관', href: '/terms' },
  { label: '개인정보처리방침', href: '/privacy' },
  { label: '이메일무단수집거부', href: '/email-policy' },
];

export default function MembershipSidebar({ isCollapsed, onToggle, showExpandButton = false }) {
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
      <h2 className={styles.sidebarTitle}>멤버쉽</h2>
      <ul className={styles.sidebarMenu}>
        {membershipMenu.map((item, index) => (
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
