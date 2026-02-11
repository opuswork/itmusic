'use client';

import Link from 'next/link';
import styles from './page.module.css';

function ProductCard({ title = 'Products' }) {
  const rows = [
    { name: 'Some Product', price: '$13 USD', change: '12%', up: true, sold: '12,000 Sold' },
    { name: 'Another Product', price: '$29 USD', change: '0.5%', up: false, sold: '123,234 Sold' },
    { name: 'Amazing Product', price: '$1,230 USD', change: '3%', up: false, sold: '198 Sold' },
    { name: 'Perfect Item', price: '$199 USD', change: '63%', up: true, sold: '87 Sold', badge: 'NEW' },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h3 className={styles.cardTitle}>{title}</h3>
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
            <div className={styles.colLg6}>
              <ProductCard title="Products" />
              <ProductCard title="Products" />
            </div>
            <div className={styles.colLg6}>
              <ProductCard title="Products" />
              <ProductCard title="Products" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
