'use client';

import { useState } from 'react';
import styles from './page.module.css';

const EnvelopeIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
  </svg>
);

const FacebookIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const GoogleIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden>
    <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginBox}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
              <span className={styles.titleBold}>이탈리아음악협회 관리자 로그인</span>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.loginBoxMsg}>로그인을 시작하세요</p>

            <form method="post" className={styles.form}>
              <div className={styles.inputGroup}>
                <input
                  type="email"
                  className={styles.formControl}
                  placeholder="Email"
                  name="email"
                  autoComplete="email"
                />
                <div className={styles.inputGroupAppend}>
                  <div className={styles.inputGroupText}>
                    <EnvelopeIcon />
                  </div>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.formControl}
                  placeholder="Password"
                  name="password"
                  autoComplete="current-password"
                />
                <div className={styles.inputGroupAppend}>
                  <button
                    type="button"
                    className={styles.inputGroupText}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    <img
                      src={showPassword ? '/assets/icons/ic_eye_on.svg' : '/assets/icons/ic_eye_off.svg'}
                      alt=""
                      className={styles.passwordToggleIcon}
                    />
                  </button>
                </div>
              </div>
              <div className={styles.rowCenter}>
                <button
                  type="submit"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                >
                  로그인
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
