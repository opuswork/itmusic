'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmNoticePage() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadNotices = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/notices', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newNotices = response.data.data;
        if (skip === 0) {
          setNotices(newNotices);
        } else {
          setNotices((prev) => [...prev, ...newNotices]);
        }
        const totalLoaded = skip + newNotices.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading notices:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadNotices(0, 10);
  }, [loadNotices]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadNotices(notices.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [notices.length, hasMore, loading, loadNotices]);

  const handleRowClick = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 공지사항을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/notices/${num}`);
      setNotices((prev) => prev.filter((n) => String(n.num) !== String(num)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setDeletingNum(null);
    }
  };

  const stripHtml = (html) => (html || '').replace(/<[^>]+>/g, '').trim();
  const contentPreview = (content) => {
    if (!content) return '-';
    const text = stripHtml(String(content));
    return (text || '-').slice(0, 60) + (text.length > 60 ? '…' : '');
  };
  const isHtml = (s) => /<[a-z][\s\S]*>/i.test(String(s));
  const splitLines = (s) => (s || '').split(/\r\n|\r|\n/);

  const imageUrl = (n) => {
    if (!n?.file_name1) return null;
    return n.file_name1.startsWith('http') ? n.file_name1 : `/assets/people/${n.file_name1}`;
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>공지사항 관리</h1>
          <Link href="/dashboard/adm-notice/add-notice" className={styles.addButton}>
            공지사항 추가
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <table className={styles.execTable}>
            <thead>
              <tr>
                <th className={styles.thNum}>번호</th>
                <th className={styles.thSubject}>제목</th>
                <th className={styles.thCategory}>카테고리</th>
                <th className={styles.thContent}>내용</th>
                <th className={styles.thFile}>이미지</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.map((n) => (
                <tr key={n.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{n.num ?? '-'}</td>
                  <td className={styles.tdSubject}>
                    <button
                      type="button"
                      className={styles.subjectButton}
                      onClick={() => handleRowClick(n)}
                    >
                      {n.subject || '-'}
                    </button>
                  </td>
                  <td className={styles.tdCategory}>{n.category || '-'}</td>
                  <td className={styles.tdContent}>{contentPreview(n.content)}</td>
                  <td className={styles.tdFile}>
                    {n.file_name1 ? (
                      <img
                        src={imageUrl(n)}
                        alt=""
                        className={styles.thumbImg}
                        width={40}
                        height={40}
                        title={n.original_file_name || n.file_name1}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-notice/edit-notice/${n.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(n.num)}
                      disabled={deletingNum === n.num}
                      aria-label="삭제"
                    >
                      {deletingNum === n.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && notices.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedNotice && (
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
              <h3 className={styles.modalTitle}>{selectedNotice.subject || '(제목 없음)'}</h3>
              {selectedNotice.category && (
                <p className={styles.modalCategory}>카테고리: {selectedNotice.category}</p>
              )}
              {selectedNotice.content ? (
                <div className={styles.modalContentBody}>
                  {isHtml(selectedNotice.content) ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedNotice.content }} />
                  ) : (
                    splitLines(selectedNotice.content).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>내용 없음</p>
              )}
              {selectedNotice.file_name1 && (
                <>
                  <p className={styles.modalFile}>이미지: {selectedNotice.original_file_name || selectedNotice.file_name1}</p>
                  <img
                    src={imageUrl(selectedNotice)}
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
