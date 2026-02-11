'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

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

export default function AddAdmVideoPage() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load Summernote dependencies in order
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

  // Init Summernote when scripts ready and editor ref exists
  useEffect(() => {
    if (!scriptsReady || !editorRef.current || typeof window === 'undefined' || !window.$) return;
    const $ = window.$;
    $(editorRef.current).summernote({
      height: 220,
      placeholder: '설명을 입력하세요',
      callbacks: {
        onChange: (contents) => setText(contents),
      },
    });
    return () => {
      try {
        $(editorRef.current).summernote('destroy');
      } catch (_) {}
    };
  }, [scriptsReady]);

  const getEditorContent = () => {
    if (typeof window !== 'undefined' && window.$ && editorRef.current) {
      try {
        return window.$(editorRef.current).summernote('code');
      } catch (_) {}
    }
    return text;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const description = getEditorContent();
      await http.post('/videos', {
        subject: subject.trim(),
        text: description || null,
        link: link.trim() || null,
      });
      router.push('/dashboard/adm-video');
      router.refresh();
    } catch (err) {
      const msg = err.response?.data?.message || '저장에 실패했습니다.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>동영상 올리기</h1>
          <Link href="/dashboard/adm-video" className={styles.backLink}>
            목록으로
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="subject" className={styles.label}>회원이름</label>
            <input
              id="subject"
              type="text"
              className={styles.input}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="회원이름"
              maxLength={128}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>설명</label>
            {!scriptsReady ? (
              <div className={styles.editorPlaceholder}>에디터 로딩 중...</div>
            ) : (
              <div ref={editorRef} id="summernote-description" />
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="link" className={styles.label}>영상링크</label>
            <input
              id="link"
              type="url"
              className={styles.input}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://www.youtube.com/..."
            />
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <Link href="/dashboard/adm-video" className={styles.cancelButton}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
