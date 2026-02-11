'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from '@/app/dashboard/adm-executives/add-executive/page.module.css';

const SUMMERNOTE_CDN = {
  jQuery: 'https://code.jquery.com/jquery-3.6.0.min.js',
  BootstrapCss: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css',
  SummernoteCss: 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs4.min.css',
  BootstrapJs: 'https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js',
  SummernoteJs: 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-bs4.min.js',
};

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('no document'));
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.body.appendChild(script);
  });
}

function loadStyle(href) {
  return new Promise((resolve, reject) => {
    if (typeof document === 'undefined') return reject(new Error('no document'));
    const existing = document.querySelector(`link[href="${href}"]`);
    if (existing) {
      resolve();
      return;
    }
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load ${href}`));
    document.head.appendChild(link);
  });
}

export default function EditAdmExecutivePage() {
  const router = useRouter();
  const params = useParams();
  const num = params?.num;
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const initialProfileSet = useRef(false);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [order_num, setOrderNum] = useState(0);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [profile, setProfile] = useState('');
  const [file_name1, setFileName1] = useState('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await loadStyle(SUMMERNOTE_CDN.BootstrapCss);
        await loadStyle(SUMMERNOTE_CDN.SummernoteCss);
        await loadScript(SUMMERNOTE_CDN.jQuery);
        await loadScript(SUMMERNOTE_CDN.BootstrapJs);
        await loadScript(SUMMERNOTE_CDN.SummernoteJs);
        if (!cancelled) setScriptsReady(true);
      } catch (e) {
        if (!cancelled) setError('에디터를 불러오는 중 오류가 발생했습니다.');
        console.error(e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    initialProfileSet.current = false;
  }, [num]);

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

  useEffect(() => {
    if (!scriptsReady || !editorRef.current || typeof window === 'undefined' || !window.$) return;
    const $ = window.$;
    $(editorRef.current).summernote({
      height: 220,
      placeholder: '프로필을 입력하세요',
      callbacks: {
        onChange: (contents) => setProfile(contents),
      },
    });
    return () => {
      try {
        $(editorRef.current).summernote('destroy');
      } catch (_) {}
    };
  }, [scriptsReady]);

  useEffect(() => {
    if (!scriptsReady || !editorRef.current || loading || typeof window === 'undefined' || !window.$) return;
    if (initialProfileSet.current) return;
    try {
      window.$(editorRef.current).summernote('code', profile ?? '');
      initialProfileSet.current = true;
    } catch (_) {}
  }, [scriptsReady, loading, profile]);

  const getEditorContent = () => {
    if (typeof window !== 'undefined' && window.$ && editorRef.current) {
      try {
        return window.$(editorRef.current).summernote('code');
      } catch (_) {}
    }
    return profile;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 업로드할 수 있습니다.');
      return;
    }
    setError('');
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await fetch('/api/upload/executive', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || '업로드 실패');
      setFileName1(data.filename);
    } catch (err) {
      setError(err.message || '이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await http.put(`/executives/${num}`, {
        order_num: Number(order_num) || 0,
        name: name.trim() || null,
        position: position.trim() || '',
        profile: getEditorContent()?.trim() || '',
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

  const imageUrl = file_name1 ? `/assets/people/${file_name1}` : null;

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
            <label className={styles.label}>프로필</label>
            {!scriptsReady ? (
              <div className={styles.editorPlaceholder}>에디터 로딩 중...</div>
            ) : (
              <div ref={editorRef} id="summernote-profile-edit" />
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>프로필 이미지</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
              disabled={uploading}
            />
            {uploading && <p className={styles.uploadStatus}>업로드 중...</p>}
            {imageUrl && (
              <div className={styles.imagePreview}>
                <Image
                  src={imageUrl}
                  alt="미리보기"
                  width={120}
                  height={160}
                  unoptimized
                  className={styles.previewImg}
                />
                <span className={styles.previewName}>{file_name1}</span>
              </div>
            )}
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
