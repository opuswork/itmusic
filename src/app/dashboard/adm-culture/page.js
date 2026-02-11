'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

function formatDate(val) {
  if (!val) return '-';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ko-KR');
}

export default function AdmCulturePage() {
  const [cultures, setCultures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCulture, setSelectedCulture] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadCultures = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/cultures', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newCultures = response.data.data;
        if (skip === 0) {
          setCultures(newCultures);
        } else {
          setCultures((prev) => [...prev, ...newCultures]);
        }
        const totalLoaded = skip + newCultures.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading cultures:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadCultures(0, 10);
  }, [loadCultures]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadCultures(cultures.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [cultures.length, hasMore, loading, loadCultures]);

  const handleRowClick = (culture) => {
    setSelectedCulture(culture);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCulture(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 게시물을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/cultures/${num}`);
      setCultures((prev) => prev.filter((c) => String(c.num) !== String(num)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setDeletingNum(null);
    }
  };

  const stripHtml = (html) => {
    if (!html) return '';
    return String(html).replace(/<[^>]*>/g, '').slice(0, 80);
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>이탈리아문화산책 관리</h1>
          <Link href="/dashboard/adm-culture/add-culture" className={styles.addButton}>
            게시물 추가
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <table className={styles.cultureTable}>
            <thead>
              <tr>
                <th className={styles.thNum}>번호</th>
                <th>제목</th>
                <th className={styles.thCategory}>카테고리</th>
                <th className={styles.thContent}>내용</th>
                <th className={styles.thDate}>등록일</th>
                <th className={styles.thVisit}>조회</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {cultures.map((culture) => (
                <tr key={culture.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{culture.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.subjectButton}
                      onClick={() => handleRowClick(culture)}
                    >
                      {culture.subject || '-'}
                    </button>
                  </td>
                  <td className={styles.tdCategory}>{culture.category || '-'}</td>
                  <td className={styles.tdContent}>
                    {stripHtml(culture.content)}
                    {culture.content && String(culture.content).length > 80 ? '…' : ''}
                  </td>
                  <td className={styles.tdDate}>{formatDate(culture.reg_date)}</td>
                  <td className={styles.tdVisit}>{culture.visit ?? 0}</td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-culture/edit-culture/${culture.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(culture.num)}
                      disabled={deletingNum === culture.num}
                      aria-label="삭제"
                    >
                      {deletingNum === culture.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && cultures.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedCulture && (
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
              <h3 className={styles.modalTitle}>{selectedCulture.subject}</h3>
              {selectedCulture.category && (
                <p className={styles.modalCategory}>카테고리: {selectedCulture.category}</p>
              )}
              {selectedCulture.content ? (
                <div
                  className={styles.modalHtml}
                  dangerouslySetInnerHTML={{ __html: selectedCulture.content }}
                />
              ) : (
                <p className={styles.modalEmpty}>내용 없음</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
