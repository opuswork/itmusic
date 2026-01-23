"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './NoticeSidebar.module.css';

const noticeSubMenu = [
  { label: '공지사항', href: '/news/notice' },
  { label: '공연소식', href: '/news/concert' },
  { label: '콩쿠르소식', href: '/news/competition' },
];

export default function NoticeSidebar({ isCollapsed, onToggle, showExpandButton = false }) {
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
      <h2 className={styles.sidebarTitle}>협회 소식/공지</h2>
      <ul className={styles.sidebarMenu}>
        {noticeSubMenu.map((item, index) => (
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
