'use client';

import { useState, useEffect, useRef } from 'react';
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
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState('');
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [userlevel, setUserlevel] = useState('1');
  const [status, setStatus] = useState('pending');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [contents, setContents] = useState('');
  const [file_name1, setFileName1] = useState('');
  const [original_file_name1, setOriginalFileName1] = useState('');
  const [imageFile, setImageFile] = useState(/** @type {File | null} */ (null));
  const [imagePreviewUrl, setImagePreviewUrl] = useState(/** @type {string | null} */ (null));
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
          setMobile(m.mobile ?? '');
          setEmail(m.email ?? '');
          setContents(m.contents ?? '');
          setFileName1(m.file_name1 ?? '');
          setOriginalFileName1(m.original_file_name1 ?? '');
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || '회원 정보를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [uno]);

  const onImageChange = (e) => {
    const file = e.target.files?.[0];
    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    setImagePreviewUrl(null);
    setImageFile(null);
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 선택할 수 있습니다.');
      return;
    }
    setImageFile(file);
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let final_file_name1 = file_name1?.trim() || null;
      let final_original_file_name1 = original_file_name1?.trim() || null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/upload/executive', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || '이미지 업로드에 실패했습니다.');
        final_file_name1 = uploadData.filename;
        final_original_file_name1 = uploadData.originalFileName ?? imageFile.name;
      }
      await http.put(`/members/${uno}`, {
        userlevel,
        status,
        mobile: mobile.trim().slice(0, 14),
        email: email.trim() || null,
        contents: contents.trim() || null,
        file_name1: final_file_name1,
        originalFileName1: final_original_file_name1,
      });
      router.push('/dashboard/adm-members');
      router.refresh();
    } catch (err) {
      setError(err.response?.data?.message || err.message || '저장에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  const existingImageUrl = file_name1
    ? (file_name1.startsWith('http') ? file_name1 : `/assets/accounts/${file_name1}`)
    : null;
  const displayImageUrl = imagePreviewUrl || existingImageUrl;

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
            <label htmlFor="mobile" className={styles.label}>휴대폰</label>
            <input
              id="mobile"
              type="text"
              className={styles.input}
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={14}
              placeholder="010-0000-0000"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>이메일</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              maxLength={255}
              placeholder="email@example.com"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contents" className={styles.label}>내용</label>
            <textarea
              id="contents"
              className={styles.textarea}
              value={contents}
              onChange={(e) => setContents(e.target.value)}
              rows={5}
              placeholder="회원 메모 등"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>프로필사진</label>
            {displayImageUrl && (
              <div className={styles.imagePreviewWrap}>
                <img src={displayImageUrl} alt="프로필 미리보기" className={styles.imagePreview} />
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className={styles.fileInput}
            />
            {original_file_name1 && !imageFile && (
              <p className={styles.fileNameHint}>{original_file_name1}</p>
            )}
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
