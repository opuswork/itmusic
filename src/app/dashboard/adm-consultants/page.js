'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmConsultantsPage() {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadConsultants = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/consultants', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newConsultants = response.data.data;
        if (skip === 0) {
          setConsultants(newConsultants);
        } else {
          setConsultants((prev) => [...prev, ...newConsultants]);
        }
        const totalLoaded = skip + newConsultants.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadConsultants(0, 10);
  }, [loadConsultants]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadConsultants(consultants.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [consultants.length, hasMore, loading, loadConsultants]);

  const handleRowClick = (consultant) => {
    setSelectedConsultant(consultant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultant(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 상임고문을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/consultants/${num}`);
      setConsultants((prev) => prev.filter((c) => String(c.num) !== String(num)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setDeletingNum(null);
    }
  };

  const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').trim();
  const profilePreview = (profile) => {
    if (!profile) return '-';
    const text = stripHtml(String(profile));
    return (text || '-').slice(0, 60) + (text.length > 60 ? '…' : '');
  };
  const isHtml = (s) => /<[a-z][\s\S]*>/i.test(String(s));
  const splitLines = (s) => (s || '').split(/\r\n|\r|\n/);

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>상임고문 관리</h1>
          <Link href="/dashboard/adm-consultants/add-consultant" className={styles.addButton}>
            상임고문 추가
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
                <th className={styles.thProfile}>프로필</th>
                <th className={styles.thFile}>이미지</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {consultants.map((c) => (
                <tr key={c.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{c.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => handleRowClick(c)}
                    >
                      {c.name || '-'}
                    </button>
                  </td>
                  <td>{c.position || '-'}</td>
                  <td className={styles.tdProfile}>{profilePreview(c.profile)}</td>
                  <td className={styles.tdFile}>
                    {c.file_name1 ? (
                      <img
                        src={c.file_name1.startsWith('http') ? c.file_name1 : `/assets/people/${c.file_name1}`}
                        alt=""
                        className={styles.thumbImg}
                        width={40}
                        height={40}
                        title={c.original_file_name || c.file_name1}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-consultants/edit-consultant/${c.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(c.num)}
                      disabled={deletingNum === c.num}
                      aria-label="삭제"
                    >
                      {deletingNum === c.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && consultants.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedConsultant && (
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
              <h3 className={styles.modalTitle}>{selectedConsultant.name || '(이름 없음)'}</h3>
              {selectedConsultant.position && (
                <p className={styles.modalPosition}>{selectedConsultant.position}</p>
              )}
              {selectedConsultant.profile ? (
                <div className={styles.modalProfile}>
                  {isHtml(selectedConsultant.profile) ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedConsultant.profile }} />
                  ) : (
                    splitLines(selectedConsultant.profile).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>프로필 없음</p>
              )}
              {selectedConsultant.file_name1 && (
                <>
                  <p className={styles.modalFile}>이미지: {selectedConsultant.original_file_name || selectedConsultant.file_name1}</p>
                  <img
                    src={selectedConsultant.file_name1.startsWith('http') ? selectedConsultant.file_name1 : `/assets/people/${selectedConsultant.file_name1}`}
                    alt=""
                    style={{ maxWidth: '120px', height: 'auto', marginTop: '0.5rem' }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
