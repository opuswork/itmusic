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

export default function AdmStudyPage() {
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedStudy, setSelectedStudy] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadStudies = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/studies', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newStudies = response.data.data;
        if (skip === 0) {
          setStudies(newStudies);
        } else {
          setStudies((prev) => [...prev, ...newStudies]);
        }
        const totalLoaded = skip + newStudies.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading studies:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadStudies(0, 10);
  }, [loadStudies]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadStudies(studies.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [studies.length, hasMore, loading, loadStudies]);

  const handleRowClick = (study) => {
    setSelectedStudy(study);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStudy(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 게시물을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/studies/${num}`);
      setStudies((prev) => prev.filter((s) => String(s.num) !== String(num)));
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
          <h1 className={styles.pageTitle}>유학정보 관리</h1>
          <Link href="/dashboard/adm-study/add-study" className={styles.addButton}>
            게시물 추가
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <table className={styles.studyTable}>
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
              {studies.map((study) => (
                <tr key={study.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{study.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.subjectButton}
                      onClick={() => handleRowClick(study)}
                    >
                      {study.subject || '-'}
                    </button>
                  </td>
                  <td className={styles.tdCategory}>{study.category || '-'}</td>
                  <td className={styles.tdContent}>
                    {stripHtml(study.content)}
                    {study.content && String(study.content).length > 80 ? '…' : ''}
                  </td>
                  <td className={styles.tdDate}>{formatDate(study.reg_date)}</td>
                  <td className={styles.tdVisit}>{study.visit ?? 0}</td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-study/edit-study/${study.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(study.num)}
                      disabled={deletingNum === study.num}
                      aria-label="삭제"
                    >
                      {deletingNum === study.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && studies.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedStudy && (
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
              <h3 className={styles.modalTitle}>{selectedStudy.subject}</h3>
              {selectedStudy.category && (
                <p className={styles.modalCategory}>카테고리: {selectedStudy.category}</p>
              )}
              {selectedStudy.content ? (
                <div
                  className={styles.modalHtml}
                  dangerouslySetInnerHTML={{ __html: selectedStudy.content }}
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
