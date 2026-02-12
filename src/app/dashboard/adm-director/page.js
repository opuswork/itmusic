'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmDirectorPage() {
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedDirector, setSelectedDirector] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadDirectors = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/directors', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newDirectors = response.data.data;
        if (skip === 0) {
          setDirectors(newDirectors);
        } else {
          setDirectors((prev) => [...prev, ...newDirectors]);
        }
        const totalLoaded = skip + newDirectors.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading directors:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadDirectors(0, 10);
  }, [loadDirectors]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadDirectors(directors.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [directors.length, hasMore, loading, loadDirectors]);

  const handleRowClick = (director) => {
    setSelectedDirector(director);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDirector(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 음악감독을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/directors/${num}`);
      setDirectors((prev) => prev.filter((d) => String(d.num) !== String(num)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setDeletingNum(null);
    }
  };

  const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').trim();
  const textPreview = (text) => {
    if (!text) return '-';
    const t = stripHtml(String(text));
    return (t || '-').slice(0, 60) + (t.length > 60 ? '…' : '');
  };
  const isHtml = (s) => /<[a-z][\s\S]*>/i.test(String(s));

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>음악감독 관리</h1>
          <Link href="/dashboard/adm-director/add-director" className={styles.addButton}>
            음악감독 추가
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <table className={styles.execTable}>
            <thead>
              <tr>
                <th className={styles.thNum}>번호</th>
                <th>이름</th>
                <th>직위</th>
                <th className={styles.thProfile}>소개</th>
                <th className={styles.thFile}>이미지</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {directors.map((dir) => (
                <tr key={dir.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{dir.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => handleRowClick(dir)}
                    >
                      {dir.name || '-'}
                    </button>
                  </td>
                  <td>{dir.position || '-'}</td>
                  <td className={styles.tdProfile}>{textPreview(dir.text)}</td>
                  <td className={styles.tdFile}>{dir.original_file_name || (dir.file_name1 ? (dir.file_name1.startsWith('http') ? 'Blob' : dir.file_name1) : '-')}</td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-director/edit-director/${dir.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(dir.num)}
                      disabled={deletingNum === dir.num}
                      aria-label="삭제"
                    >
                      {deletingNum === dir.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && directors.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedDirector && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className={styles.modalCloseButton}
              onClick={handleCloseModal}
              aria-label="닫기"
            >
              [닫기]
            </button>
            <div className={styles.modalBody}>
              <h3 className={styles.modalTitle}>{selectedDirector.name || '(이름 없음)'}</h3>
              {selectedDirector.position && (
                <p className={styles.modalPosition}>{selectedDirector.position}</p>
              )}
              {selectedDirector.text ? (
                <div className={styles.modalProfile}>
                  {isHtml(selectedDirector.text) ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedDirector.text }} />
                  ) : (
                    selectedDirector.text.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>소개 없음</p>
              )}
              {selectedDirector.file_name1 && (
                <>
                  <p className={styles.modalFile}>이미지: {selectedDirector.original_file_name || selectedDirector.file_name1}</p>
                  {selectedDirector.file_name1.startsWith('http') && (
                    <img src={selectedDirector.file_name1} alt="" style={{ maxWidth: '120px', height: 'auto', marginTop: '0.5rem' }} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
