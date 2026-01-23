"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import NoticeSidebar from '@/components/layout/NoticeSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function NoticePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [notices, setNotices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);
  const hasInitialLoadRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsSidebarCollapsed(false);
      } else {
        // 768px 이하에서는 사이드바를 접힌 상태로 유지
        setIsSidebarCollapsed(true);
      }
    };

    // 초기 로드 시 화면 크기에 따라 사이드바 상태 설정
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // 공지사항 데이터 로드
  const loadNotices = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/notices', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newNotices = response.data.data;
        // 디버깅: visit 값 확인
        if (newNotices.length > 0) {
          console.log('Sample notice visit:', newNotices[0].visit, 'type:', typeof newNotices[0].visit);
        }
        if (skip === 0) {
          setNotices(newNotices);
        } else {
          setNotices(prev => [...prev, ...newNotices]);
        }
        
        // 더 불러올 데이터가 있는지 확인
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

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadNotices(0, 10);
    }
  }, [loadNotices]);

  // 무한스크롤 옵저버 설정 (검색 중이 아닐 때만)
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current || searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !searchTerm.trim()) {
          loadNotices(notices.length, 10);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px'
      }
    );

    observer.observe(loadingRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [notices.length, hasMore, loading, loadNotices, searchTerm]);

  // 검색 기능 - 검색 시에는 전체 데이터에서 필터링
  const filteredNotices = searchTerm.trim()
    ? notices.filter(notice =>
        notice.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : notices;

  // 날짜 포맷팅
  const formatDate = (dateValue) => {
    // null, undefined, 빈 객체 체크
    if (!dateValue || (typeof dateValue === 'object' && Object.keys(dateValue).length === 0)) {
      return '-';
    }
    try {
      // 문자열이거나 Date 객체일 수 있음
      const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
      // 유효한 날짜인지 확인
      if (isNaN(date.getTime())) {
        return '-';
      }
      // YYYY-MM-DD 형식으로 반환
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date:', error, dateValue);
      return '-';
    }
  };

  // 모달 열기
  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNotice(null);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색은 useEffect에서 자동으로 처리됨
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
          <h1 className={styles.pageTitle}>공지사항</h1>
          <div className={styles.content}>
            <p>
              이탈리아음악협회의 공지사항을 확인하실 수 있습니다.
              <br />
              <br />
              이탈리아음악협회
            </p>
            
            {/* 검색바 */}
            <div className={styles.searchContainer}>
              <form onSubmit={handleSearch} className={styles.searchForm}>
                <input
                  type="text"
                  className={styles.searchInput}
                  placeholder="검색어를 입력하세요"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" className={styles.searchButton}>
                  검색
                </button>
              </form>
            </div>

            {/* 게시판 테이블 */}
            <div className={styles.boardContainer}>
              <table className={styles.noticeTable}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>게시일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && notices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.loadingCell}>
                        로딩 중...
                      </td>
                    </tr>
                  ) : filteredNotices.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyCell}>
                        {searchTerm.trim() ? '검색 결과가 없습니다.' : '게시물이 없습니다.'}
                      </td>
                    </tr>
                  ) : (
                    filteredNotices.map((notice) => (
                      <tr key={notice.num}>
                        <td>{notice.num || '-'}</td>
                        <td>
                          <button
                            className={styles.subjectButton}
                            onClick={() => handleNoticeClick(notice)}
                          >
                            {notice.subject || '-'}
                          </button>
                        </td>
                        <td>{formatDate(notice.reg_date)}</td>
                        <td>{typeof notice.visit === 'number' ? notice.visit : (notice.visit ? Number(notice.visit) : 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* 무한스크롤 로딩 인디케이터 */}
              {!searchTerm.trim() && (
                <div ref={loadingRef} className={styles.loadingIndicator}>
                  {loading && notices.length > 0 && <p>로딩 중...</p>}
                  {!hasMore && notices.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
                </div>
              )}
            </div>
          </div>

          {/* 모달 */}
          {isModalOpen && selectedNotice && (
            <div className={styles.modalOverlay} onClick={handleCloseModal}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.modalCloseButton}
                  onClick={handleCloseModal}
                  aria-label="닫기"
                >
                  [닫기]
                </button>
                <div className={styles.modalHeader}>
                  <h2>{selectedNotice.subject}</h2>
                  {selectedNotice.reg_date && (
                    <p className={styles.modalDate}>
                      게시일: {formatDate(selectedNotice.reg_date)}
                    </p>
                  )}
                </div>
                <div className={styles.modalBody}>
                  <div
                    className={styles.modalContentText}
                    dangerouslySetInnerHTML={{
                      __html: selectedNotice.content || '내용이 없습니다.'
                    }}
                  />
                </div>
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
