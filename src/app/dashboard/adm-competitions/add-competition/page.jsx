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

const DOC_ACCEPT = '.hwp,.pdf,.docx,.doc';

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

export default function AddAdmCompetitionPage() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [scriptsReady, setScriptsReady] = useState(false);
  const [order_num, setOrderNum] = useState(0);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState('성악콩쿠르');
  const [content, setContent] = useState('');
  const [event_start_date, setEventStartDate] = useState('');
  const [event_end_date, setEventEndDate] = useState('');
  const [location, setLocation] = useState('다큐홀');
  const [operator, setOperator] = useState('이탈리아음악협회');
  const [planner, setPlanner] = useState('이탈리아음악협회');
  const [supporter, setSupporter] = useState('이탈리아음악협회');
  const [imageFile, setImageFile] = useState(/** @type {File | null} */ (null));
  const [imagePreviewUrl, setImagePreviewUrl] = useState(/** @type {string | null} */ (null));
  const [doc2File, setDoc2File] = useState(/** @type {File | null} */ (null));
  const [doc3File, setDoc3File] = useState(/** @type {File | null} */ (null));
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
    if (!scriptsReady || !editorRef.current || typeof window === 'undefined' || !window.$) return;
    const $ = window.$;
    $(editorRef.current).summernote({
      height: 220,
      placeholder: '내용을 입력하세요',
      callbacks: {
        onChange: (contents) => setContent(contents),
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
    return content;
  };

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

  const onDoc2Change = (e) => {
    setDoc2File(e.target.files?.[0] || null);
    setError('');
  };

  const onDoc3Change = (e) => {
    setDoc3File(e.target.files?.[0] || null);
    setError('');
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const uploadDocument = async (file) => {
    const formData = new FormData();
    formData.append('document', file);
    const res = await fetch('/api/upload/document', { method: 'POST', body: formData });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || '문서 업로드에 실패했습니다.');
    return { filename: data.filename, originalFileName: data.originalFileName ?? file.name };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let file_name1 = null;
      let originalFileName1 = null;
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        const uploadRes = await fetch('/api/upload/executive', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || '이미지 업로드에 실패했습니다.');
        file_name1 = uploadData.filename;
        originalFileName1 = uploadData.originalFileName ?? imageFile.name;
      }

      let file_name2 = null;
      let originalFileName2 = null;
      if (doc2File) {
        const d = await uploadDocument(doc2File);
        file_name2 = d.filename;
        originalFileName2 = d.originalFileName;
      }

      let file_name3 = null;
      let originalFileName3 = null;
      if (doc3File) {
        const d = await uploadDocument(doc3File);
        file_name3 = d.filename;
        originalFileName3 = d.originalFileName;
      }

      await http.post('/competitions', {
        order_num: Number(order_num) || 0,
        subject: subject.trim() || '',
        category: category.trim() || null,
        content: getEditorContent()?.trim() || '',
        event_start_date: event_start_date || null,
        event_end_date: event_end_date || null,
        location: location.trim() || '다큐홀',
        operator: operator.trim() || '이탈리아음악협회',
        planner: planner.trim() || '이탈리아음악협회',
        supporter: supporter.trim() || '이탈리아음악협회',
        file_name1,
        originalFileName1,
        file_name2,
        originalFileName2,
        file_name3,
        originalFileName3,
      });
      router.push('/dashboard/adm-competitions');
      router.refresh();
    } catch (err) {
      const msg = err.message || err.response?.data?.message || '저장에 실패했습니다.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>콩쿠르 추가</h1>
          <Link href="/dashboard/adm-competitions" className={styles.backLink}>
            목록으로
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <form onSubmit={handleSubmit} className={styles.form}>
          {error && <div className={styles.errorMessage}>{error}</div>}
          <div className={styles.formGroup}>
            <label htmlFor="order_num" className={styles.label}>정렬순서</label>
            <input
              id="order_num"
              type="number"
              className={styles.input}
              value={order_num}
              onChange={(e) => setOrderNum(Number(e.target.value) || 0)}
              min={0}
            />
          </div>
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
              placeholder="예: 성악콩쿠르"
              maxLength={255}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>내용</label>
            {!scriptsReady ? (
              <div className={styles.editorPlaceholder}>에디터 로딩 중...</div>
            ) : (
              <div ref={editorRef} id="summernote-competition-content" />
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event_start_date" className={styles.label}>행사 시작일</label>
            <input
              id="event_start_date"
              type="date"
              className={styles.input}
              value={event_start_date}
              onChange={(e) => setEventStartDate(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="event_end_date" className={styles.label}>행사 종료일</label>
            <input
              id="event_end_date"
              type="date"
              className={styles.input}
              value={event_end_date}
              onChange={(e) => setEventEndDate(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="location" className={styles.label}>장소</label>
            <input
              id="location"
              type="text"
              className={styles.input}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={255}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="operator" className={styles.label}>주최</label>
            <input id="operator" type="text" className={styles.input} value={operator} onChange={(e) => setOperator(e.target.value)} maxLength={100} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="planner" className={styles.label}>기획</label>
            <input id="planner" type="text" className={styles.input} value={planner} onChange={(e) => setPlanner(e.target.value)} maxLength={100} />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="supporter" className={styles.label}>후원</label>
            <input id="supporter" type="text" className={styles.input} value={supporter} onChange={(e) => setSupporter(e.target.value)} maxLength={255} />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>대표 이미지</label>
            <input
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={onImageChange}
              disabled={saving}
            />
            <p className={styles.uploadHint}>이미지 파일만 업로드됩니다.</p>
            {imagePreviewUrl && (
              <div className={styles.imagePreview}>
                <img src={imagePreviewUrl} alt="미리보기" width={120} height={160} className={styles.previewImg} style={{ objectFit: 'cover' }} />
                <span className={styles.previewName}>{imageFile?.name ?? ''}</span>
              </div>
            )}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>첨부 문서 2 (HWP, PDF, DOCX)</label>
            <input
              type="file"
              accept={DOC_ACCEPT}
              className={styles.fileInput}
              onChange={onDoc2Change}
              disabled={saving}
            />
            <p className={styles.docHint}>한글, PDF, 워드 문서만 업로드할 수 있습니다.</p>
            {doc2File && <span className={styles.previewName}>{doc2File.name}</span>}
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>첨부 문서 3 (HWP, PDF, DOCX)</label>
            <input
              type="file"
              accept={DOC_ACCEPT}
              className={styles.fileInput}
              onChange={onDoc3Change}
              disabled={saving}
            />
            <p className={styles.docHint}>한글, PDF, 워드 문서만 업로드할 수 있습니다.</p>
            {doc3File && <span className={styles.previewName}>{doc3File.name}</span>}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <Link href="/dashboard/adm-competitions" className={styles.cancelButton}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
