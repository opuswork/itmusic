'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmCompetitionsPage() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadCompetitions = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/competitions', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newList = response.data.data;
        if (skip === 0) {
          setCompetitions(newList);
        } else {
          setCompetitions((prev) => [...prev, ...newList]);
        }
        const totalLoaded = skip + newList.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading competitions:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadCompetitions(0, 10);
  }, [loadCompetitions]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadCompetitions(competitions.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [competitions.length, hasMore, loading, loadCompetitions]);

  const handleRowClick = (row) => {
    setSelected(row);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 콩쿠르를 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/competitions/${num}`);
      setCompetitions((prev) => prev.filter((c) => String(c.num) !== String(num)));
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
    return (text || '-').slice(0, 50) + (text.length > 50 ? '…' : '');
  };
  const isHtml = (s) => /<[a-z][\s\S]*>/i.test(String(s));
  const splitLines = (s) => (s || '').split(/\r\n|\r|\n/);

  const imageUrl = (c) => {
    if (!c?.file_name1) return null;
    return c.file_name1.startsWith('http') ? c.file_name1 : `/assets/people/${c.file_name1}`;
  };

  const docLabel = (c, n) => {
    const name = n === 2 ? c?.original_file_name2 : c?.original_file_name3;
    const url = n === 2 ? c?.file_name2 : c?.file_name3;
    if (!url) return null;
    return { url, label: name || `첨부${n}` };
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>콩쿠르 관리</h1>
          <Link href="/dashboard/adm-competitions/add-competition" className={styles.addButton}>
            콩쿠르 추가
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
                <th className={styles.thImage}>이미지</th>
                <th className={styles.thDoc2}>첨부2</th>
                <th className={styles.thDoc3}>첨부3</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map((c) => (
                <tr key={c.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{c.num ?? '-'}</td>
                  <td className={styles.tdSubject}>
                    <button
                      type="button"
                      className={styles.subjectButton}
                      onClick={() => handleRowClick(c)}
                    >
                      {c.subject || '-'}
                    </button>
                  </td>
                  <td className={styles.tdCategory}>{c.category || '-'}</td>
                  <td className={styles.tdContent}>{contentPreview(c.content)}</td>
                  <td className={styles.tdImage}>
                    {c.file_name1 ? (
                      <img
                        src={imageUrl(c)}
                        alt=""
                        className={styles.thumbImg}
                        width={40}
                        height={40}
                        title={c.original_file_name1 || c.file_name1}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdDoc2}>
                    {docLabel(c, 2) ? (
                      <a
                        href={docLabel(c, 2).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.docLink}
                        title={docLabel(c, 2).url}
                      >
                        {docLabel(c, 2).label}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdDoc3}>
                    {docLabel(c, 3) ? (
                      <a
                        href={docLabel(c, 3).url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.docLink}
                        title={docLabel(c, 3).url}
                      >
                        {docLabel(c, 3).label}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-competitions/edit-competition/${c.num}`}
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
            {!hasMore && competitions.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selected && (
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
              <h3 className={styles.modalTitle}>{selected.subject || '(제목 없음)'}</h3>
              {selected.category && (
                <p className={styles.modalCategory}>카테고리: {selected.category}</p>
              )}
              {selected.content ? (
                <div className={styles.modalContentBody}>
                  {isHtml(selected.content) ? (
                    <div dangerouslySetInnerHTML={{ __html: selected.content }} />
                  ) : (
                    splitLines(selected.content).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>내용 없음</p>
              )}
              {selected.file_name1 && (
                <div className={styles.modalFile}>
                  <p>이미지: {selected.original_file_name1 || selected.file_name1}</p>
                  <img
                    src={imageUrl(selected)}
                    alt=""
                    style={{ maxWidth: '120px', height: 'auto', marginTop: '0.5rem' }}
                  />
                </div>
              )}
              {docLabel(selected, 2) && (
                <p className={styles.modalDoc}>
                  첨부2:{' '}
                  <a href={docLabel(selected, 2).url} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                    {docLabel(selected, 2).label}
                  </a>
                </p>
              )}
              {docLabel(selected, 3) && (
                <p className={styles.modalDoc}>
                  첨부3:{' '}
                  <a href={docLabel(selected, 3).url} target="_blank" rel="noopener noreferrer" className={styles.docLink}>
                    {docLabel(selected, 3).label}
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
