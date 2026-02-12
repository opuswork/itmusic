'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const USERLEVEL_OPTIONS = [
  { value: '1', label: '일반회원' },
  { value: '12', label: '정회원' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: '가입대기' },
  { value: 'approved', label: '가입승인' },
];

function normalizeUserlevel(v) {
  if (v == null) return '1';
  const s = String(v).toUpperCase();
  if (s === 'LEVEL_1' || s === '1') return '1';
  if (s === 'LEVEL_12' || s === '12') return '12';
  return '1';
}

export default function EditAdmMemberPage() {
  const router = useRouter();
  const params = useParams();
  const uno = params?.uno;
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [userlevel, setUserlevel] = useState('1');
  const [status, setStatus] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uno) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await http.get(`/members/${uno}`);
        if (cancelled) return;
        if (res.data?.success && res.data?.data) {
          const m = res.data.data;
          setUsername(m.username ?? '');
          setFirstname(m.firstname ?? '');
          setLastname(m.lastname ?? '');
          setUserlevel(normalizeUserlevel(m.userlevel));
          setStatus(m.status === 'approved' ? 'approved' : 'pending');
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || '회원 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [uno]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await http.put(`/members/${uno}`, {
        userlevel,
        status,
      });
      router.push('/dashboard/adm-members');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && !username && !error) {
    return (
      <>
        <div className={styles.contentHeader}>
          <div className={styles.contentHeaderInner}>
            <h1 className={styles.pageTitle}>회원 수정</h1>
            <Link href="/dashboard/adm-members" className={styles.backLink}>목록으로</Link>
          </div>
        </div>
        <div className={styles.content}>
          <p>로딩 중...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>회원 수정</h1>
          <Link href="/dashboard/adm-members" className={styles.backLink}>목록으로</Link>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label className={styles.label}>회원아이디</label>
            <p className={styles.readOnly}>{username || '-'}</p>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>이름</label>
            <p className={styles.readOnly}>{[firstname, lastname].filter(Boolean).join(' ') || '-'}</p>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="userlevel" className={styles.label}>회원등급</label>
            <select
              id="userlevel"
              className={styles.input}
              value={userlevel}
              onChange={(e) => setUserlevel(e.target.value)}
            >
              {USERLEVEL_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="status" className={styles.label}>승인상태</label>
            <select
              id="status"
              className={styles.input}
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <Link href="/dashboard/adm-members" className={styles.cancelButton}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
