"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './CommitteeSidebar.module.css';

const committeeSubMenu = [
  { label: '운영위원', href: '/committee/operators' },
  { label: '음악감독', href: '/committee/director' },
  { label: '지도위원', href: '/committee/teachers' },
  { label: '상임이사', href: '/committee/executives' },
  { label: '상임고문', href: '/committee/consultants' },
];

export default function CommitteeSidebar({ isCollapsed, onToggle, showExpandButton = false }) {
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
      <h2 className={styles.sidebarTitle}>운영/지도위원</h2>
      <ul className={styles.sidebarMenu}>
        {committeeSubMenu.map((item, index) => (
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
