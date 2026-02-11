'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from '@/app/dashboard/adm-slider/add-slider/page.module.css';

export default function EditAdmSliderPage() {
  const router = useRouter();
  const params = useParams();
  const num = params?.num;
  const fileInputRef = useRef(null);
  const [subject, setSubject] = useState('');
  const [link, setLink] = useState('');
  const [file_name1, setFile_name1] = useState(null);
  const [originalFileName, setOriginalFileName] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!num) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await http.get(`/sliders/${num}`);
        if (cancelled) return;
        if (res.data?.success && res.data?.data) {
          const s = res.data.data;
          setSubject(s.subject ?? '');
          setLink(s.link ?? '');
          setFile_name1(s.file_name1 ?? null);
          setOriginalFileName(s.original_file_name ?? null);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || '슬라이더를 불러오지 못했습니다.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [num]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
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
      if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
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
      let finalFile_name1 = file_name1;
      let finalOriginalFileName = originalFileName;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('originalFileNameBase64', btoa(unescape(encodeURIComponent(selectedFile.name))));
        const uploadRes = await fetch('/api/upload/slider', { method: 'POST', body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok) throw new Error(uploadData.message || '이미지 업로드에 실패했습니다.');
        finalFile_name1 = uploadData.filename;
        finalOriginalFileName = uploadData.originalFileName ?? selectedFile.name;
      }

      await http.put(`/sliders/${num}`, {
        subject: subject.trim(),
        link: link.trim() || null,
        file_name1: finalFile_name1,
        originalFileName: finalOriginalFileName,
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

  const existingImageUrl = file_name1
    ? (file_name1.startsWith('http') ? file_name1 : `/assets/sliderImages/${file_name1}`)
    : null;

  const displayPreviewUrl = previewUrl || existingImageUrl;
  const displayLabel = selectedFile?.name || originalFileName || '기존 이미지';

  if (loading && !subject && !error) {
    return (
      <>
        <div className={styles.contentHeader}>
          <div className={styles.contentHeaderInner}>
            <h1 className={styles.pageTitle}>슬라이더 수정</h1>
            <Link href="/dashboard/adm-slider" className={styles.backLink}>목록으로</Link>
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
          <h1 className={styles.pageTitle}>슬라이더 수정</h1>
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
            <p className={styles.uploadHint}>
              {selectedFile
                ? '새 이미지를 선택했습니다. 저장 시 서버에 업로드됩니다.'
                : '새 이미지를 선택하면 기존 이미지가 대체됩니다. 저장 시 서버에 업로드됩니다.'}
            </p>
            {displayPreviewUrl && (
              <div className={styles.imagePreview}>
                <img
                  src={displayPreviewUrl}
                  alt="미리보기"
                  className={styles.previewImg}
                  style={{ maxWidth: '100%', maxHeight: '400px', objectFit: 'contain' }}
                />
                <span className={styles.previewName}>{displayLabel}</span>
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
