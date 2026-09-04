"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function StudyPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [studies, setStudies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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

  // 유학정보 데이터 로드
  const loadStudies = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/studies', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newStudies = response.data.data;
        if (skip === 0) {
          setStudies(newStudies);
        } else {
          setStudies(prev => [...prev, ...newStudies]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newStudies.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading studies:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadStudies(0, 10);
    }
  }, [loadStudies]);

  // 무한스크롤 옵저버 설정 (검색 중이 아닐 때만)
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current || searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !searchTerm.trim()) {
          loadStudies(studies.length, 10);
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
  }, [studies.length, hasMore, loading, loadStudies, searchTerm]);

  // 검색 기능 - 검색 시에는 전체 데이터에서 필터링
  const filteredStudies = searchTerm.trim()
    ? studies.filter(study =>
        study.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : studies;

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

  // 상세 페이지로 이동
  const handleStudyClick = (study) => {
    router.push(`/about/study/${study.num}`);
  };

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색은 useEffect에서 자동으로 처리됨
  };

  // 첨부파일 다운로드 URL 생성
  const getFileUrl = (fileName) => {
    if (!fileName || fileName === 'none' || fileName === '1') return null;
    return `/assets/uploads/${fileName}`;
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
            <SubHeader title="유학정보" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>음악 유학정보</h1>
          <div className={styles.content}>
            <p>
              유학정보는 이탈리아에서 유학하는 정보를 제공하는 곳입니다.
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
              <table className={styles.studyTable}>
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>게시일</th>
                    <th>조회수</th>
                    <th>첨부파일</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && studies.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.loadingCell}>
                        로딩 중...
                      </td>
                    </tr>
                  ) : filteredStudies.length === 0 ? (
                    <tr>
                      <td colSpan="5" className={styles.emptyCell}>
                        {searchTerm.trim() ? '검색 결과가 없습니다.' : '게시물이 없습니다.'}
                      </td>
                    </tr>
                  ) : (
                    filteredStudies.map((study) => (
                      <tr key={study.num}>
                        <td>{study.num || '-'}</td>
                        <td>
                          <button
                            className={styles.subjectButton}
                            onClick={() => handleStudyClick(study)}
                          >
                            {study.subject || '-'}
                          </button>
                        </td>
                        <td>{formatDate(study.reg_date)}</td>
                        <td>{typeof study.visit === 'number' ? study.visit : (study.visit ? Number(study.visit) : 0)}</td>
                        <td>
                          {getFileUrl(study.file_name1) ? (
                            <a
                              href={getFileUrl(study.file_name1)}
                              download
                              className={styles.fileLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📎 {study.file_name1}
                            </a>
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              
              {/* 무한스크롤 로딩 인디케이터 */}
              {!searchTerm.trim() && (
                <div ref={loadingRef} className={styles.loadingIndicator}>
                  {loading && studies.length > 0 && <p>로딩 중...</p>}
                  {!hasMore && studies.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
                </div>
              )}
            </div>
          </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
