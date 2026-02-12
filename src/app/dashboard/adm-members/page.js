'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

const USERLEVEL_LABELS = {
  LEVEL_1: '일반회원',
  LEVEL_12: '정회원',
  LEVEL_20: '20',
  LEVEL_80: '80',
  '1': '일반회원',
  '12': '정회원',
};

const STATUS_LABELS = {
  pending: '가입대기',
  approved: '가입승인',
};

function formatDate(d) {
  if (!d) return '-';
  const date = typeof d === 'string' ? new Date(d) : d;
  if (isNaN(date.getTime())) return '-';
  return date.toISOString().slice(0, 10);
}

function getUserlevelLabel(userlevel) {
  if (userlevel == null) return '-';
  return USERLEVEL_LABELS[String(userlevel)] ?? String(userlevel);
}

function getStatusLabel(status) {
  if (status == null) return '-';
  return STATUS_LABELS[String(status)] ?? String(status);
}

export default function AdmMembersPage() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingUno, setDeletingUno] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadMembers = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/members', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newList = response.data.data;
        if (skip === 0) {
          setMembers(newList);
        } else {
          setMembers((prev) => [...prev, ...newList]);
        }
        const totalLoaded = skip + newList.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadMembers(0, 10);
  }, [loadMembers]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadMembers(members.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [members.length, hasMore, loading, loadMembers]);

  const handleRowClick = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  const handleDelete = async (uno) => {
    if (!confirm('이 회원을 삭제하시겠습니까?')) return;
    setDeletingUno(uno);
    try {
      await http.delete(`/members/${uno}`);
      setMembers((prev) => prev.filter((m) => Number(m.uno) !== Number(uno)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setDeletingUno(null);
    }
  };

  const fullName = (m) => [m?.firstname, m?.lastname].filter(Boolean).join(' ') || '-';
  const imageUrl = (m) => {
    if (!m?.file_name1) return null;
    return m.file_name1.startsWith('http') ? m.file_name1 : `/assets/people/${m.file_name1}`;
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>회원 관리</h1>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <table className={styles.execTable}>
            <thead>
              <tr>
                <th className={styles.thNum}>번호</th>
                <th className={styles.thUsername}>회원아이디</th>
                <th className={styles.thName}>이름</th>
                <th className={styles.thUserlevel}>회원등급</th>
                <th className={styles.thPhoto}>프로필사진</th>
                <th className={styles.thStatus}>승인상태</th>
                <th className={styles.thDate}>등록일</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.uno ?? Math.random()}>
                  <td className={styles.tdNum}>{m.uno ?? '-'}</td>
                  <td className={styles.tdUsername}>{m.username ?? '-'}</td>
                  <td className={styles.tdName}>
                    <button
                      type="button"
                      className={styles.nameButton}
                      onClick={() => handleRowClick(m)}
                    >
                      {fullName(m)}
                    </button>
                  </td>
                  <td className={styles.tdUserlevel}>{getUserlevelLabel(m.userlevel)}</td>
                  <td className={styles.tdPhoto}>
                    {m.file_name1 ? (
                      <img
                        src={imageUrl(m)}
                        alt=""
                        className={styles.thumbImg}
                        width={40}
                        height={40}
                        title={m.original_file_name1 || m.file_name1}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdStatus}>{getStatusLabel(m.status)}</td>
                  <td className={styles.tdDate}>{formatDate(m.signdate)}</td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-members/edit-member/${m.uno}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(m.uno)}
                      disabled={deletingUno === m.uno}
                      aria-label="삭제"
                    >
                      {deletingUno === m.uno ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && members.length > 0 && <p>모든 목록을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedMember && (
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
              <h3 className={styles.modalTitle}>{fullName(selectedMember)}</h3>
              <p className={styles.modalRow}>회원아이디: {selectedMember.username ?? '-'}</p>
              <p className={styles.modalRow}>회원등급: {getUserlevelLabel(selectedMember.userlevel)}</p>
              <p className={styles.modalRow}>승인상태: {getStatusLabel(selectedMember.status)}</p>
              <p className={styles.modalRow}>등록일: {formatDate(selectedMember.signdate)}</p>
              {selectedMember.file_name1 && (
                <div className={styles.modalFile}>
                  <p>프로필사진: {selectedMember.original_file_name1 || selectedMember.file_name1}</p>
                  <img
                    src={imageUrl(selectedMember)}
                    alt=""
                    style={{ maxWidth: '120px', height: 'auto', marginTop: '0.5rem' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
