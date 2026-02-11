'use client';

//import styles from './page.module.css';

export default function AdmCommitteePage() {
    return (
        <div className={styles.container}>
            <h1>관리자 위원회</h1>
            <div className={styles.content}>
                <div className={styles.left}>
                    <h2>위원회 목록</h2>
                </div>
                <div className={styles.right}>
                    <h2>위원회 상세</h2>
                </div>
            </div>
        </div>
    );
}