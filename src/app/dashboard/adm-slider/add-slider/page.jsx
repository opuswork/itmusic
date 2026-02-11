'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AddAdmSliderPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [subject, setSubject] = useState('');
  const [link, setLink] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setSelectedFile(null);
    setError('');
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('이미지 파일만 선택할 수 있습니다.');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!subject.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }

    setSaving(true);
    try {
      let file_name1 = null;
      let originalFileName = null;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        // Send original file name as base64 to prevent filename injection / encoding issues
        formData.append('originalFileNameBase64', btoa(unescape(encodeURIComponent(selectedFile.name))));
        const uploadRes = await fetch('/api/upload/slider', {
          method: 'POST',
          body: formData,
        });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || '이미지 업로드에 실패했습니다.');
        file_name1 = uploadData.filename;
        originalFileName = uploadData.originalFileName ?? selectedFile.name;
      }

      await http.post('/sliders', {
        subject: subject.trim(),
        link: link.trim() || null,
        file_name1,
        originalFileName,
      });
      
      router.push('/dashboard/adm-slider');
      router.refresh();
    } catch (err) {
      const msg = err.message || err.response?.data?.message || '저장에 실패했습니다.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const displayPreviewUrl = previewUrl || null;

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>슬라이더 추가</h1>
          <Link href="/dashboard/adm-slider" className={styles.backLink}>
            목록으로
          </Link>
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
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="link" className={styles.label}>링크주소</label>
            <input
              id="link"
              type="url"
              className={styles.input}
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="https://example.com"
              maxLength={255}
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>첨부파일: 이미지파일</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.fileInput}
              onChange={handleFileChange}
              disabled={saving}
            />
            <p className={styles.uploadHint}>이미지를 선택하면 미리보기가 표시됩니다. 저장 시 서버에 업로드됩니다.</p>
            {displayPreviewUrl && (
              <div className={styles.imagePreview}>
                <img
                  src={displayPreviewUrl}
                  alt="미리보기"
                  className={styles.previewImg}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
                <span className={styles.previewName}>{selectedFile?.name ?? ''}</span>
              </div>
            )}
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.submitButton} disabled={saving}>
              {saving ? '저장 중...' : '저장'}
            </button>
            <Link href="/dashboard/adm-slider" className={styles.cancelButton}>
              취소
            </Link>
          </div>
        </form>
      </div>
    </>
  );
}
