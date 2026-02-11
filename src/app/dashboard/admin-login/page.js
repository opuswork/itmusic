'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/auth/auth';
import styles from './page.module.css';

const UserIcon = () => (
  <svg className={styles.socialIcon} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      await login(username.trim(), password, true);
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message = err?.message || '로그인에 실패했습니다.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.loginBox}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.titleBold}>이탈리아음악협회 관리자 로그인</span>
          </div>
          <div className={styles.cardBody}>
            <p className={styles.loginBoxMsg}>로그인을 시작하세요 (username: admin)</p>

            <form onSubmit={handleSubmit} className={styles.form}>
              {error && <p className={styles.errorMsg}>{error}</p>}
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  className={styles.formControl}
                  placeholder="아이디 (admin)"
                  name="id"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                <div className={styles.inputGroupAppend}>
                  <div className={styles.inputGroupText}>
                    <UserIcon />
                  </div>
                </div>
              </div>
              <div className={styles.inputGroup}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={styles.formControl}
                  placeholder="비밀번호"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
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
                  disabled={loading}
                >
                  {loading ? '로그인 중...' : '로그인'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
