'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from '@/app/dashboard/adm-executives/add-executive/page.module.css';

export default function EditAdmExecutivePage() {
  const router = useRouter();
  const params = useParams();
  const num = params?.num;
  const [order_num, setOrderNum] = useState(0);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [profile, setProfile] = useState('');
  const [file_name1, setFileName1] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!num) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await http.get(`/executives/${num}`);
        if (cancelled) return;
        if (res.data?.success && res.data?.data) {
          const e = res.data.data;
          setOrderNum(e.order_num != null ? Number(e.order_num) : 0);
          setName(e.name ?? '');
          setPosition(e.position ?? '');
          setProfile(e.profile ?? '');
          setFileName1(e.file_name1 ?? '');
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || '상임이사 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [num]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await http.put(`/executives/${num}`, {
        order_num: Number(order_num) || 0,
        name: name.trim() || null,
        position: position.trim() || '',
        profile: profile.trim() || '',
        file_name1: file_name1.trim() || null,
      });
      router.push('/dashboard/adm-executives');
      router.refresh();
    } catch (err) {
      const msg = err.response?.data?.message || '저장에 실패했습니다.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !name && !error) {
    return (
      <>
        <div className={styles.contentHeader}>
          <div className={styles.contentHeaderInner}>
            <h1 className={styles.pageTitle}>상임이사 수정</h1>
            <Link href="/dashboard/adm-executives" className={styles.backLink}>목록으로</Link>
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
          <h1 className={styles.pageTitle}>상임이사 수정</h1>
          <Link href="/dashboard/adm-executives" className={styles.backLink}>목록으로</Link>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="order_num" className={styles.label}>표시 순서</label>
            <input
              id="order_num"
              type="number"
              className={styles.input}
              value={order_num}
              onChange={(e) => setOrderNum(e.target.value)}
              min={0}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>이름</label>
            <input
              id="name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름"
              maxLength={255}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="position" className={styles.label}>직위</label>
            <input
              id="position"
              type="text"
              className={styles.input}
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="직위"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="profile" className={styles.label}>프로필</label>
            <textarea
              id="profile"
              className={styles.textarea}
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              placeholder="프로필 (여러 줄 입력 가능)"
              rows={6}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="file_name1" className={styles.label}>이미지 파일명</label>
            <input
              id="file_name1"
              type="text"
              className={styles.input}
              value={file_name1}
              onChange={(e) => setFileName1(e.target.value)}
              placeholder="예: executive01.jpg (선택)"
              maxLength={100}
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <Link href="/dashboard/adm-executives" className={styles.cancelButton}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
