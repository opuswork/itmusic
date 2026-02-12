'use client';

import Link from 'next/link';
import styles from './page.module.css';

const DASHBOARD_MENU_ITEMS = [
  { href: '/dashboard/adm-slider', label: '슬라이드' },
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

function ProductCard({ title = 'Products', href }) {
  const rows = [];

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
          <a href="#" className={styles.cardToolBtn} aria-label="다운로드">
            ↓
          </a>
          <a href="#" className={styles.cardToolBtn} aria-label="메뉴">
            ☰
          </a>
        </div>
      </div>
      <div className={styles.cardBody}>
        {rows.length === 0 ? (
          <p className={styles.emptyState}>불러올 자료가 없습니다</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Sales</th>
                <th>More</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i}>
                  <td>
                    <div className={styles.tableProduct}>
                      <div className={styles.tableProductImg} />
                      <span>
                        {row.name}
                        {row.badge && (
                          <span className={`${styles.badge} ${styles.badgeDanger}`}>{row.badge}</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>{row.price}</td>
                  <td>
                    <small
                      className={`${styles.mr1} ${row.up ? styles.textSuccess : row.change === '0.5%' ? styles.textWarning : styles.textDanger}`}
                    >
                      {row.up ? '↑' : '↓'}
                      {row.change}
                    </small>
                    {row.sold}
                  </td>
                  <td>
                    <Link href="#" className={styles.textMuted} aria-label="검색">
                      🔍
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
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
                <ProductCard title={item.label} href={item.href} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
