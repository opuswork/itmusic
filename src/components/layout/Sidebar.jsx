"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import styles from './Sidebar.module.css';

const aboutSubMenu = [
  { label: '협회소개', href: '/about/association' },
  { label: '회장인사말', href: '/about/greeting' },
  { label: '연혁', href: '/about/history' },
  { label: '설립목적', href: '/about/purpose' },
  { label: '협회콩쿠르', href: '/about/competition' },
  { label: '연회비(후원금)', href: '/about/membership' },
  { label: '협회원 연주영상', href: '/about/videos' },
  { label: '이탈리아문화산책', href: '/about/culture' },
  { label: '유학정보', href: '/about/study' },
];

export default function Sidebar({ isCollapsed, onToggle, showExpandButton = false }) {
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
      <h2 className={styles.sidebarTitle}>협회 소개</h2>
      <ul className={styles.sidebarMenu}>
        {aboutSubMenu.map((item, index) => (
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
