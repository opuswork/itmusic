"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import styles from './Nav.module.css';

const menuItems = [
  {
    label: '이탈리아음악협회소개',
    href: '/about/association',
    subMenu: [
      { label: '협회소개', href: '/about/association' },
      { label: '회장인사말', href: '/about/greeting' },
      { label: '연혁', href: '/about/history' },
      { label: '설립목적', href: '/about/purpose' },
      { label: '협회콩쿠르', href: '/about/competition' },
      { label: '연회비(후원금)', href: '/about/membership' },
      { label: '협회원 연주영상', href: '/about/videos' },
      { label: '이탈리아문화산책', href: '/about/culture' },
      { label: '유학정보', href: '/about/study' },
    ]
  },
  {
    label: '운영위원&지도위원',
    href: '/committee/operators',
    subMenu: [
      { label: '운영위원', href: '/committee/operators' },
      { label: '음악감독', href: '/committee/director' },
      { label: '지도위원', href: '/committee/teachers' },
      { label: '상임이사', href: '/committee/executives' },
      { label: '상임고문', href: '/committee/consultants' },
    ]
  },
  {
    label: '협회공지&소식',
    href: '/news/notice',
    subMenu: [
      { label: '공지사항', href: '/news/notice' },
      { label: '공연소식', href: '/news/concert' },
      { label: '콩쿠르소식', href: '/news/competition' },
    ]
  },
];

export default function Nav() {
  const [hoveredMenu, setHoveredMenu] = useState(null);

  return (
    <div className={styles.navContainer}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/assets/logos/logo-s.png"
              alt="이탈리아음악협회"
              width={200}
              height={60}
              priority
            />
          </Link>
          <div className={styles.menuWrapper}>
            <ul className={styles.menuList}>
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={styles.menuItem}
                  onMouseEnter={() => setHoveredMenu(index)}
                  onMouseLeave={() => setHoveredMenu(null)}
                >
                  {item.subMenu && item.subMenu.length > 0 ? (
                    <span className={styles.menuLink}>
                      {item.label}
                    </span>
                  ) : (
                    <Link href={item.href} className={styles.menuLink}>
                      {item.label}
                    </Link>
                  )}
                  {item.subMenu && item.subMenu.length > 0 && hoveredMenu === index && (
                    <div className={styles.subMenuWrapper}>
                      <ul className={styles.subMenu}>
                        {item.subMenu.map((subItem, subIndex) => (
                          <li key={subIndex} className={styles.subMenuItem}>
                            <Link href={subItem.href} className={styles.subMenuLink}>
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
