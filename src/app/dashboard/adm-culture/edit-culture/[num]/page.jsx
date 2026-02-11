'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from '@/app/dashboard/adm-culture/add-culture/page.module.css';

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

export default function EditAdmCulturePage() {
  const router = useRouter();
  const params = useParams();
  const num = params?.num;
  const editorRef = useRef(null);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
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
    if (!num) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await http.get(`/cultures/${num}`);
        if (cancelled) return;
        if (res.data?.success && res.data?.data) {
          const c = res.data.data;
          setSubject(c.subject ?? '');
          setCategory(c.category ?? '');
          setContent(c.content ?? '');
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || '게시물을 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [num]);

  useEffect(() => {
    if (!scriptsReady || !editorRef.current || typeof window === 'undefined' || !window.$ || loading) return;
    const $ = window.$;
    $(editorRef.current).summernote({
      height: 280,
      placeholder: '내용을 입력하세요',
      callbacks: {
        onChange: (contents) => setContent(contents),
      },
    });
    $(editorRef.current).summernote('code', content);
    return () => {
      try {
        $(editorRef.current).summernote('destroy');
      } catch (_) {}
    };
  }, [scriptsReady, loading]);

  const getEditorContent = () => {
    if (typeof window !== 'undefined' && window.$ && editorRef.current) {
      try {
        return window.$(editorRef.current).summernote('code');
      } catch (_) {}
    }
    return content;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      await http.put(`/cultures/${num}`, {
        subject: subject.trim(),
        category: category.trim() || null,
        content: getEditorContent() || null,
      });
      router.push('/dashboard/adm-culture');
      router.refresh();
    } catch (err) {
      const msg = err.response?.data?.message || '저장에 실패했습니다.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading && !subject && !error) {
    return (
      <>
        <div className={styles.contentHeader}>
          <div className={styles.contentHeaderInner}>
            <h1 className={styles.pageTitle}>문화 게시물 수정</h1>
            <Link href="/dashboard/adm-culture" className={styles.backLink}>목록으로</Link>
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
          <h1 className={styles.pageTitle}>문화 게시물 수정</h1>
          <Link href="/dashboard/adm-culture" className={styles.backLink}>목록으로</Link>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>제목</label>
            <input
              id="subject"
              type="text"
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="제목"
              maxLength={128}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="category" className={styles.label}>카테고리</label>
            <input
              id="category"
              type="text"
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="카테고리 (선택)"
              maxLength={255}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>내용</label>
            {!scriptsReady ? (
              <div className={styles.editorPlaceholder}>에디터 로딩 중...</div>
            ) : (
              <div ref={editorRef} id="summernote-edit-content" />
            )}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <Link href="/dashboard/adm-culture" className={styles.cancelButton}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
