'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmExecutivesPage() {
  const [executives, setExecutives] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedExecutive, setSelectedExecutive] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadExecutives = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/executives', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newExecutives = response.data.data;
        if (skip === 0) {
          setExecutives(newExecutives);
        } else {
          setExecutives((prev) => [...prev, ...newExecutives]);
        }
        const totalLoaded = skip + newExecutives.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading executives:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadExecutives(0, 10);
  }, [loadExecutives]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadExecutives(executives.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [executives.length, hasMore, loading, loadExecutives]);

  const handleRowClick = (executive) => {
    setSelectedExecutive(executive);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedExecutive(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 상임이사를 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/executives/${num}`);
      setExecutives((prev) => prev.filter((e) => String(e.num) !== String(num)));
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

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>운영위원 관리</h1>
          <Link href="/dashboard/adm-executives/add-executive" className={styles.addButton}>
            운영위원 추가
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
              {executives.map((exec) => (
                <tr key={exec.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{exec.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => handleRowClick(exec)}
                    >
                      {exec.name || '-'}
                    </button>
                  </td>
                  <td>{exec.position || '-'}</td>
                  <td className={styles.tdProfile}>{profilePreview(exec.profile)}</td>
                  <td className={styles.tdFile}>{exec.original_file_name || (exec.file_name1 ? (exec.file_name1.startsWith('http') ? 'Blob' : exec.file_name1) : '-')}</td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-executives/edit-executive/${exec.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(exec.num)}
                      disabled={deletingNum === exec.num}
                      aria-label="삭제"
                    >
                      {deletingNum === exec.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && executives.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedExecutive && (
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
              <h3 className={styles.modalTitle}>{selectedExecutive.name || '(이름 없음)'}</h3>
              {selectedExecutive.position && (
                <p className={styles.modalPosition}>{selectedExecutive.position}</p>
              )}
              {selectedExecutive.profile ? (
                <div className={styles.modalProfile}>
                  {isHtml(selectedExecutive.profile) ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedExecutive.profile }} />
                  ) : (
                    selectedExecutive.profile.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>프로필 없음</p>
              )}
              {selectedExecutive.file_name1 && (
                <>
                  <p className={styles.modalFile}>이미지: {selectedExecutive.original_file_name || selectedExecutive.file_name1}</p>
                  {selectedExecutive.file_name1.startsWith('http') && (
                    <img src={selectedExecutive.file_name1} alt="" style={{ maxWidth: '120px', height: 'auto', marginTop: '0.5rem' }} />
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
