"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function AdminLoginPage() {
  const router = useRouter();
  const [userid, setUserid] = useState('');
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setError('');
    if (!userid.trim() || !pwd.trim()) {
      setError('아이디와 비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userid: userid.trim(), pwd }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data?.message || '로그인에 실패했습니다.');
        return;
      }
      router.push(data?.redirectTo || '/admin');
      router.refresh();
    } catch (err) {
      setError('로그인 요청 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder} />
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="관리자 로그인" />
          </div>
          <main className={styles.mainContent}>
            <div className={`${styles.ctt} ${styles.memWrap} ${styles.memIcon}`}>
              <form
                method="post"
                className={styles.regist}
                id="frmLogin"
                onSubmit={handleSubmit}
              >
                <fieldset className={styles.memBox}>
                  <legend>로그인</legend>
                  <ul className={styles.loginArea}>
                    <li>
                      <label htmlFor="uid">아이디</label>
                      <input
                        type="text"
                        id="uid"
                        name="userid"
                        placeholder="아이디를 입력해주세요"
                        value={userid}
                        onChange={(e) => setUserid(e.target.value)}
                        autoComplete="username"
                        disabled={loading}
                      />
                    </li>
                    <li>
                      <label htmlFor="upw">비밀번호</label>
                      <input
                        type="password"
                        id="upw"
                        name="pwd"
                        placeholder="비밀번호를 입력해주세요"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        autoComplete="current-password"
                        disabled={loading}
                      />
                    </li>
                  </ul>
                  {error && <p className={styles.errorMessage}>{error}</p>}
                  <button
                    className={styles.memBtn}
                    id="loginBtn"
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? '로그인 중...' : '로그인'}
                  </button>
                  <div className={styles.mBtn}>
                    <Link href="/account/id_search">
                      <span>아이디 찾기</span>
                    </Link>
                    <Link href="/account/pw_search">
                      <span>비밀번호 찾기</span>
                    </Link>
                    <Link href="/account/signup">
                      <span>회원가입</span>
                    </Link>
                  </div>
                  <input type="hidden" name="returnurl" value="" />
                </fieldset>
              </form>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
