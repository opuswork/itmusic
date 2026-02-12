'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmTeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadTeachers = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/teachers', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newTeachers = response.data.data;
        if (skip === 0) {
          setTeachers(newTeachers);
        } else {
          setTeachers((prev) => [...prev, ...newTeachers]);
        }
        const totalLoaded = skip + newTeachers.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadTeachers(0, 10);
  }, [loadTeachers]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadTeachers(teachers.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [teachers.length, hasMore, loading, loadTeachers]);

  const handleRowClick = (teacher) => {
    setSelectedTeacher(teacher);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTeacher(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 지도위원을 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/teachers/${num}`);
      setTeachers((prev) => prev.filter((t) => String(t.num) !== String(num)));
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
          <h1 className={styles.pageTitle}>지도위원 관리</h1>
          <Link href="/dashboard/adm-teachers/add-teacher" className={styles.addButton}>
            지도위원 추가
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
              {teachers.map((t) => (
                <tr key={t.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{t.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => handleRowClick(t)}
                    >
                      {t.name || '-'}
                    </button>
                  </td>
                  <td>{t.position || '-'}</td>
                  <td className={styles.tdProfile}>{profilePreview(t.profile)}</td>
                  <td className={styles.tdFile}>
                    {t.file_name1 ? (
                      <img
                        src={t.file_name1.startsWith('http') ? t.file_name1 : `/assets/people/${t.file_name1}`}
                        alt=""
                        className={styles.thumbImg}
                        width={40}
                        height={40}
                        title={t.original_file_name || t.file_name1}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-teachers/edit-teacher/${t.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(t.num)}
                      disabled={deletingNum === t.num}
                      aria-label="삭제"
                    >
                      {deletingNum === t.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && teachers.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedTeacher && (
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
              <h3 className={styles.modalTitle}>{selectedTeacher.name || '(이름 없음)'}</h3>
              {selectedTeacher.position && (
                <p className={styles.modalPosition}>{selectedTeacher.position}</p>
              )}
              {selectedTeacher.profile ? (
                <div className={styles.modalProfile}>
                  {isHtml(selectedTeacher.profile) ? (
                    <div dangerouslySetInnerHTML={{ __html: selectedTeacher.profile }} />
                  ) : (
                    splitLines(selectedTeacher.profile).map((line, i) => (
                      <p key={i}>{line}</p>
                    ))
                  )}
                </div>
              ) : (
                <p className={styles.modalEmpty}>프로필 없음</p>
              )}
              {selectedTeacher.file_name1 && (
                <>
                  <p className={styles.modalFile}>이미지: {selectedTeacher.original_file_name || selectedTeacher.file_name1}</p>
                  {selectedTeacher.file_name1.startsWith('http') && (
                    <img src={selectedTeacher.file_name1} alt="" style={{ maxWidth: '120px', height: 'auto', marginTop: '0.5rem' }} />
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
