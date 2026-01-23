"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function CulturePage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [cultures, setCultures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCulture, setSelectedCulture] = useState(null);
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

  // 문화 데이터 로드
  const loadCultures = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/cultures', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newCultures = response.data.data;
        // 디버깅: visit 값 확인
        if (newCultures.length > 0) {
          console.log('Sample culture visit:', newCultures[0].visit, 'type:', typeof newCultures[0].visit);
        }
        if (skip === 0) {
          setCultures(newCultures);
        } else {
          setCultures(prev => [...prev, ...newCultures]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newCultures.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading cultures:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadCultures(0, 10);
    }
  }, [loadCultures]);

  // 무한스크롤 옵저버 설정 (검색 중이 아닐 때만)
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current || searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !searchTerm.trim()) {
          loadCultures(cultures.length, 10);
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
  }, [cultures.length, hasMore, loading, loadCultures, searchTerm]);

  // 검색 기능 - 검색 시에는 전체 데이터에서 필터링
  const filteredCultures = searchTerm.trim()
    ? cultures.filter(culture =>
        culture.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cultures;

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
  const handleCultureClick = (culture) => {
    setSelectedCulture(culture);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCulture(null);
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
            <SubHeader title="이탈리아문화산책" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>이탈리아문화산책</h1>
          <div className={styles.content}>
            <p>
              이탈리아문화산책은 이탈리아의 문화와 사회를 소개하는 산책 프로그램입니다.
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
              <table className={styles.cultureTable}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>게시일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && cultures.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.loadingCell}>
                        로딩 중...
                      </td>
                    </tr>
                  ) : filteredCultures.length === 0 ? (
                    <tr>
                      <td colSpan="4" className={styles.emptyCell}>
                        {searchTerm.trim() ? '검색 결과가 없습니다.' : '게시물이 없습니다.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCultures.map((culture) => (
                      <tr key={culture.num}>
                        <td>{culture.num || '-'}</td>
                        <td>
                          <button
                            className={styles.subjectButton}
                            onClick={() => handleCultureClick(culture)}
                          >
                            {culture.subject || '-'}
                          </button>
                        </td>
                        <td>{formatDate(culture.reg_date)}</td>
                        <td>{typeof culture.visit === 'number' ? culture.visit : (culture.visit ? Number(culture.visit) : 0)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* 무한스크롤 로딩 인디케이터 */}
              {!searchTerm.trim() && (
                <div ref={loadingRef} className={styles.loadingIndicator}>
                  {loading && cultures.length > 0 && <p>로딩 중...</p>}
                  {!hasMore && cultures.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
                </div>
              )}
            </div>
          </div>

          {/* 모달 */}
          {isModalOpen && selectedCulture && (
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
                  <h2>{selectedCulture.subject}</h2>
                  {selectedCulture.reg_date && (
                    <p className={styles.modalDate}>
                      게시일: {formatDate(selectedCulture.reg_date)}
                    </p>
                  )}
                </div>
                <div className={styles.modalBody}>
                  <div
                    className={styles.modalContentText}
                    dangerouslySetInnerHTML={{
                      __html: selectedCulture.content || '내용이 없습니다.'
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
