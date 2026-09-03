"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // next/navigation 추가
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function CulturePage() {
  const router = useRouter(); // 라우터 초기화
  
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [cultures, setCultures] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // 모달 관련 상태 제거 (selectedCulture, isModalOpen)
  
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
        if (skip === 0) {
          setCultures(newCultures);
        } else {
          setCultures(prev => [...prev, ...newCultures]);
        }
        
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

  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadCultures(0, 10);
    }
  }, [loadCultures]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current || searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !searchTerm.trim()) {
          loadCultures(cultures.length, 10);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(loadingRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [cultures.length, hasMore, loading, loadCultures, searchTerm]);

  const filteredCultures = searchTerm.trim()
    ? cultures.filter(culture =>
        culture.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : cultures;

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
    } catch (error) {
      return '-';
    }
  };

  // 💡 수정된 부분: 모달 대신 상세 페이지(자체 라우팅)로 이동
  const handleCultureClick = (culture) => {
    // '/culture/1' 처럼 해당 게시글 번호(num)를 포함한 URL로 이동합니다.
    router.push(`/about/culture/${culture.num}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
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
              <br /><br />
              이탈리아음악협회
            </p>
            
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
                      <td colSpan="4" className={styles.loadingCell}>로딩 중...</td>
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
              
              {!searchTerm.trim() && (
                <div ref={loadingRef} className={styles.loadingIndicator}>
                  {loading && cultures.length > 0 && <p>로딩 중...</p>}
                  {!hasMore && cultures.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
                </div>
              )}
            </div>
          </div>
          
          {/* 모달 관련 JSX 코드 삭제됨 */}
          
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}