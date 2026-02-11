'use client';

import styles from './page.module.css';

export default function AdmCompetitionsPage() {
    return (
        <div className={styles.container}>
            <h1>관리자 콩쿠르</h1>
            <div className={styles.content}>
                <div className={styles.left}>
                    <h2>콩쿠르 목록</h2>
                </div>
                <div className={styles.right}>
                    <h2>콩쿠르 상세</h2>
                </div>
            </div>
        </div>
    );
}