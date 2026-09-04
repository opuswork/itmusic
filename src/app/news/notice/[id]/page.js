"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import NoticeSidebar from '@/components/layout/NoticeSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from '../page.module.css';

export default function NoticeDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsSidebarCollapsed(false);
      } else {
        setIsSidebarCollapsed(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // 공지사항 상세 데이터 로드
  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const loadNotice = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await http.get(`/notices/${id}`, { params: { view: 1 } });
        if (cancelled) return;
        if (response.data.success) {
          setNotice(response.data.data);
        } else {
          setError('공지사항을 찾을 수 없습니다.');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error loading notice:', err);
        setError(
          err.response?.status === 404
            ? '공지사항을 찾을 수 없습니다.'
            : '공지사항을 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadNotice();
    return () => { cancelled = true; };
  }, [id]);

  // 날짜 포맷팅
  const formatDate = (dateValue) => {
    if (!dateValue || (typeof dateValue === 'object' && Object.keys(dateValue).length === 0)) {
      return '-';
    }
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) {
        return '-';
      }
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (err) {
      console.error('Error formatting date:', err, dateValue);
      return '-';
    }
  };

  const handleBackToList = () => {
    router.push('/news/notice');
  };

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder}></div>
          {isSidebarCollapsed && (
            <NoticeSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} showExpandButton={true} />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {!isSidebarCollapsed && (
          <NoticeSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        )}
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="공지사항" />
          </div>
          <main className={styles.mainContent}>
            {loading ? (
              <div className={styles.detailMessage}>로딩 중...</div>
            ) : error || !notice ? (
              <div className={styles.detailContainer}>
                <div className={styles.detailMessage}>{error || '공지사항을 찾을 수 없습니다.'}</div>
                <div className={styles.detailActions}>
                  <button type="button" className={styles.backButton} onClick={handleBackToList}>
                    목록으로
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.detailContainer}>
                <h1 className={styles.pageTitle}>{notice.subject || '-'}</h1>
                <div className={styles.detailMeta}>
                  <span>게시일: {formatDate(notice.reg_date)}</span>
                  <span>
                    조회수: {typeof notice.visit === 'number' ? notice.visit : (notice.visit ? Number(notice.visit) : 0)}
                  </span>
                </div>
                <div
                  className={styles.detailContentText}
                  dangerouslySetInnerHTML={{
                    __html: notice.content || '내용이 없습니다.'
                  }}
                />
                <div className={styles.detailActions}>
                  <button type="button" className={styles.backButton} onClick={handleBackToList}>
                    목록으로
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
