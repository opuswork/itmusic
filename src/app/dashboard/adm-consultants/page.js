'use client';

import styles from './page.module.css';

export default function AdmConsultantsPage() {
    return (
        <div className={styles.container}>
            <h1>관리자 상임고문</h1>
            <div className={styles.content}>
                <div className={styles.left}>
                    <h2>상임고문 목록</h2>
                </div>
                <div className={styles.right}>
                    <h2>상임고문 상세</h2>
                </div>
            </div>
        </div>
    );
}