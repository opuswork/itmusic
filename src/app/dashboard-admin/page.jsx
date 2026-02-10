"use client";

import Link from "next/link";
import styles from "./page.module.css";

export default function DashboardAdminLoginPage() {
  return (
    <>
      <div className={styles.loginBox}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Link href="/dashboard" className={styles.h1}>
              <b>Admin Login</b>
            </Link>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.loginBoxMsg}>Please login to start your session</p>

            <form action="/api/auth/login" method="post">
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  name="id"
                  className={styles.formControl}
                  placeholder="Username"
                  required
                  autoComplete="username"
                />
                <div className={styles.inputGroupAppend}>
                  <div className={styles.inputGroupText}>
                    <span className={styles.fasFaEnvelope}></span>
                  </div>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  name="password"
                  className={styles.formControl}
                  placeholder="Password"
                  required
                  autoComplete="current-password"
                />
                <div className={styles.inputGroupAppend}>
                  <div className={styles.inputGroupText}>
                    <span className={styles.fasFaLock}></span>
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.col4}>
                  <button type="submit" className={styles.btnPrimaryBtnBlock}>
                    Sign In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
