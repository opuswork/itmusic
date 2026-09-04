"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { http } from '@/lib/http/client';
import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
// 상세 페이지용 CSS 파일이 필요하다면 별도 생성하거나 기존 파일을 재사용하세요
import styles from '../page.module.css'; 

export default function CultureDetailPage() {
  const { id } = useParams(); // URL에서 게시글 번호(id) 가져오기
  const router = useRouter();
  
  const [culture, setCulture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 사이드바 상태 처리 로직 (기존과 동일)
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 769);
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

  // 상세 데이터 로드
  useEffect(() => {
    if (!id) return;

    let cancelled = false;
    const fetchCultureDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await http.get(`/cultures/${id}`);
        if (cancelled) return;
        if (response.data.success) {
          setCulture(response.data.data);
        } else {
          setError('게시물을 찾을 수 없습니다.');
        }
      } catch (err) {
        if (cancelled) return;
        console.error('Error fetching culture detail:', err);
        setError(
          err.response?.status === 404
            ? '게시물을 찾을 수 없습니다.'
            : '게시물을 불러오는 중 오류가 발생했습니다.'
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchCultureDetail();
    return () => { cancelled = true; };
  }, [id]);

  const formatDate = (dateValue) => {
    if (!dateValue || (typeof dateValue === 'object' && Object.keys(dateValue).length === 0)) {
      return '-';
    }
    try {
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      if (isNaN(date.getTime())) return '-';
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
    router.push('/about/culture');
  };

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder}></div>
          {isSidebarCollapsed && (
            <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} showExpandButton={true} />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {!isSidebarCollapsed && (
          <Sidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        )}
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="이탈리아문화산책 상세" />
          </div>
          <main className={styles.mainContent}>
            {loading ? (
              <div className={styles.detailMessage}>로딩 중...</div>
            ) : error || !culture ? (
              <div className={styles.detailContainer}>
                <div className={styles.detailMessage}>{error || '게시물을 찾을 수 없습니다.'}</div>
                <div className={styles.detailActions}>
                  <button type="button" className={styles.backButton} onClick={handleBackToList}>
                    목록으로
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.detailContainer}>
                <h1 className={styles.pageTitle}>{culture.subject || '-'}</h1>
                <div className={styles.detailMeta}>
                  <span>게시일: {formatDate(culture.reg_date)}</span>
                  <span>
                    조회수: {typeof culture.visit === 'number' ? culture.visit : (culture.visit ? Number(culture.visit) : 0)}
                  </span>
                </div>
                <div
                  className={styles.detailContentText}
                  dangerouslySetInnerHTML={{
                    __html: culture.content || '내용이 없습니다.'
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