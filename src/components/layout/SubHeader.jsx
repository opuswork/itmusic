"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './SubHeader.module.css';

export default function SubHeader({ title }) {
  return (
    <div className={styles.subHeader}>
      <div className={styles.subHeaderContent}>
        <Link href="/" className={styles.homeLink}>
          <span className={styles.homeIcon}><Image src="/assets/icons/ic_home.png" alt="home" width={20} height={20} /></span>
        </Link>
        <span className={styles.breadcrumb}>{title}</span>
      </div>
    </div>
  );
}
