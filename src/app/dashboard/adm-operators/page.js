'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmOperatorsPage() {
  const [operators, setOperators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedOperator, setSelectedOperator] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadOperators = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/operators', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newOperators = response.data.data;
        if (skip === 0) {
          setOperators(newOperators);
        } else {
          setOperators((prev) => [...prev, ...newOperators]);
        }
        const totalLoaded = skip + newOperators.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading operators:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadOperators(0, 10);
  }, [loadOperators]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadOperators(operators.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [operators.length, hasMore, loading, loadOperators]);

  const handleRowClick = (operator) => {
    setSelectedOperator(operator);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOperator(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 운영위원을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/operators/${num}`);
      setOperators((prev) => prev.filter((o) => String(o.num) !== String(num)));
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
          <h1 className={styles.pageTitle}>운영위원 관리</h1>
          <Link href="/dashboard/adm-operators/add-operator" className={styles.addButton}>
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
              {operators.map((o) => (
                <tr key={o.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{o.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => handleRowClick(o)}
                    >
                      {o.name || '-'}
                    </button>
                  </td>
                  <td>{o.position || '-'}</td>
                  <td className={styles.tdProfile}>{profilePreview(o.profile)}</td>
                  <td className={styles.tdFile}>
                    {o.file_name1 ? (
                      <img
                        src={o.file_name1.startsWith('http') ? o.file_name1 : `/assets/people/${o.file_name1}`}
                        alt=""
                        className={styles.thumbImg}
                        width={40}
                        height={40}
                        title={o.original_file_name || o.file_name1}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-operators/edit-operator/${o.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(o.num)}
                      disabled={deletingNum === o.num}
                      aria-label="삭제"
                    >
                      {deletingNum === o.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && operators.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedOperator && (
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
              <h3 className={styles.modalTitle}>{selectedOperator.name || '(이름 없음)'}</h3>
              {selectedOperator.position && (
                <p className={styles.modalPosition}>{selectedOperator.position}</p>
              )}
              {selectedOperator.profile ? (
                <div className={styles.modalProfile}>
                  {isHtml(selectedOperator.profile) ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedOperator.profile }} />
                  ) : (
                    splitLines(selectedOperator.profile).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>프로필 없음</p>
              )}
              {selectedOperator.file_name1 && (
                <>
                  <p className={styles.modalFile}>이미지: {selectedOperator.original_file_name || selectedOperator.file_name1}</p>
                  <img
                    src={selectedOperator.file_name1.startsWith('http') ? selectedOperator.file_name1 : `/assets/people/${selectedOperator.file_name1}`}
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
