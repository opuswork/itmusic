'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const DASHBOARD_MENU_ITEMS = [
  { href: '/dashboard/adm-slider', label: '슬라이드', apiKey: 'sliders', titleKey: 'subject', editPath: (num) => `/dashboard/adm-slider/edit-slider/${num}` },
  { href: '/dashboard/adm-video', label: '협회원연주영상', apiKey: 'videos', titleKey: 'subject', editPath: (num) => `/dashboard/adm-video/edit-video/${num}` },
  { href: '/dashboard/adm-culture', label: '이탈리아문화산책', apiKey: 'cultures', titleKey: 'subject', editPath: (num) => `/dashboard/adm-culture/edit-culture/${num}` },
  { href: '/dashboard/adm-study', label: '유학정보', apiKey: 'studies', titleKey: 'subject', editPath: (num) => `/dashboard/adm-study/edit-study/${num}` },
  { href: '/dashboard/adm-executives', label: '상임이사', apiKey: 'executives', titleKey: 'name', editPath: (num) => `/dashboard/adm-executives/edit-executive/${num}` },
  { href: '/dashboard/adm-director', label: '음악감독', apiKey: 'directors', titleKey: 'name', editPath: (num) => `/dashboard/adm-director/edit-director/${num}` },
  { href: '/dashboard/adm-teachers', label: '지도위원', apiKey: 'teachers', titleKey: 'name', editPath: (num) => `/dashboard/adm-teachers/edit-teacher/${num}` },
  { href: '/dashboard/adm-consultants', label: '상임고문', apiKey: 'consultants', titleKey: 'name', editPath: (num) => `/dashboard/adm-consultants/edit-consultant/${num}` },
  { href: '/dashboard/adm-operators', label: '운영위원', apiKey: 'operators', titleKey: 'name', editPath: (num) => `/dashboard/adm-operators/edit-operator/${num}` },
  { href: '/dashboard/adm-notice', label: '공지사항', apiKey: 'notices', titleKey: 'subject', editPath: (num) => `/dashboard/adm-notice/edit-notice/${num}` },
  { href: '/dashboard/adm-news', label: '공연소식', apiKey: 'concerts', titleKey: 'subject', editPath: (num) => `/dashboard/adm-news/edit-news/${num}` },
  { href: '/dashboard/adm-competitions', label: '콩쿠르소식', apiKey: 'competitions', titleKey: 'subject', editPath: (num) => `/dashboard/adm-competitions/edit-competition/${num}` },
];

function ProductCard({ title, href, rows = [], editPath, titleKey, isLoading }) {
  const getTitle = (row) => {
    const val = row[titleKey];
    return (val != null && String(val).trim()) ? String(val).trim() : '(제목 없음)';
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>
          {href ? (
            <Link href={href} className={styles.cardTitleLink}>
              {title}
            </Link>
          ) : (
            title
          )}
        </h3>
        <div className={styles.cardTools}>
          {href && (
            <Link href={href} className={styles.cardToolBtn} aria-label="목록">
            ☰
            </Link>
          )}
        </div>
      </div>
      <div className={styles.cardBody}>
        {isLoading ? (
          <div className={styles.loadingWrap} aria-hidden>
            <span className={styles.spinner} />
          </div>
        ) : rows.length === 0 ? (
          <p className={styles.emptyState}>불러올 자료가 없습니다</p>
        ) : (
          <ul className={styles.recentList}>
            {rows.map((row) => (
              <li key={row.num ?? row.id ?? Math.random()}>
                {editPath && row.num != null ? (
                  <Link href={editPath(row.num)} className={styles.recentLink}>
                    {getTitle(row)}
                  </Link>
                ) : (
                  <span>{getTitle(row)}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [recentByHref, setRecentByHref] = useState({});

  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      const next = {};
      await Promise.all(
        DASHBOARD_MENU_ITEMS.filter((item) => item.apiKey).map(async (item) => {
          try {
            const res = await http.get(`/${item.apiKey}`, { params: { skip: 0, take: 3 } });
            if (cancelled) return;
            const list = res.data?.success && Array.isArray(res.data?.data) ? res.data.data : [];
            next[item.href] = list;
          } catch (_) {
            if (!cancelled) next[item.href] = [];
          }
        })
      );
      if (!cancelled) setRecentByHref((prev) => ({ ...prev, ...next }));
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>관리자메인</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.containerFluid}>
          <div className={styles.row}>
            {DASHBOARD_MENU_ITEMS.map((item) => (
              <div key={item.href} className={styles.colLg6}>
                <ProductCard
                  title={item.label}
                  href={item.href}
                  rows={recentByHref[item.href] ?? []}
                  editPath={item.editPath}
                  titleKey={item.titleKey}
                  isLoading={!(item.href in recentByHref)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
