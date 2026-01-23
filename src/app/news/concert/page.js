"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import NoticeSidebar from '@/components/layout/NoticeSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function ConcertPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [concerts, setConcerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConcert, setSelectedConcert] = useState(null);
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

  // 공연소식 데이터 로드
  const loadConcerts = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/concerts', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newConcerts = response.data.data;
        if (skip === 0) {
          setConcerts(newConcerts);
        } else {
          setConcerts(prev => [...prev, ...newConcerts]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newConcerts.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading concerts:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadConcerts(0, 10);
    }
  }, [loadConcerts]);

  // 무한스크롤 옵저버 설정 (검색 중이 아닐 때만)
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current || searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !searchTerm.trim()) {
          loadConcerts(concerts.length, 10);
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
  }, [concerts.length, hasMore, loading, loadConcerts, searchTerm]);

  // 검색 기능 - 검색 시에는 전체 데이터에서 필터링
  const filteredConcerts = searchTerm.trim()
    ? concerts.filter(concert =>
        concert.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : concerts;

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
    } catch (error) {
      console.error('Error formatting date:', error, dateValue);
      return '-';
    }
  };

  // 날짜 범위 포맷팅
  const formatDateRange = (startDate, endDate) => {
    const start = formatDate(startDate);
    const end = formatDate(endDate);
    if (start === '-' && end === '-') return '-';
    if (start === end) return start;
    return `${start} ~ ${end}`;
  };

  // 이미지 URL 생성
  const getImageUrl = (fileName) => {
    if (!fileName || fileName === 'none' || fileName === '1') return null;
    return `/assets/poster/${fileName}`;
  };

  // 모달 열기
  const handleConcertClick = (concert) => {
    setSelectedConcert(concert);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConcert(null);
  };

  // 검색 핸들러
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
            <SubHeader title="공연소식" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>공연소식</h1>
            <div className={styles.content}>
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

              {/* 게시판 리스트 */}
              <div className={styles.boardContainer}>
                {loading && concerts.length === 0 ? (
                  <div className={styles.loadingMessage}>로딩 중...</div>
                ) : filteredConcerts.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    {searchTerm.trim() ? '검색 결과가 없습니다.' : '게시물이 없습니다.'}
                  </div>
                ) : (
                  <div className={styles.concertList}>
                    {filteredConcerts.map((concert) => {
                      const imageUrl = getImageUrl(concert.file_name1);
                      return (
                        <div key={concert.num} className={styles.concertItem}>
                          <div 
                            className={styles.concertImageWrapper}
                            onClick={() => handleConcertClick(concert)}
                          >
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={concert.subject || '공연소식'}
                                width={200}
                                height={280}
                                className={styles.concertThumbnail}
                                unoptimized
                              />
                            ) : (
                              <div className={styles.imagePlaceholder}>
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <div className={styles.concertInfo}>
                            <h3 
                              className={styles.concertTitle}
                              onClick={() => handleConcertClick(concert)}
                            >
                              {concert.subject || '-'}
                            </h3>
                            <p className={styles.concertMeta}>
                              작성자: {concert.operator || '이탈리아음악협회'} | 작성일: {formatDate(concert.reg_date)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                
                {/* 무한스크롤 로딩 인디케이터 */}
                {!searchTerm.trim() && (
                  <div ref={loadingRef} className={styles.loadingIndicator}>
                    {loading && concerts.length > 0 && <p>로딩 중...</p>}
                    {!hasMore && concerts.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
                  </div>
                )}
              </div>
            </div>

            {/* 모달 */}
            {isModalOpen && selectedConcert && (
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
                    <h2>공연소식</h2>
                  </div>

                  <div className={styles.modalBody}>
                    {/* 상세 정보 테이블 */}
                    <div className={styles.modalInfoTable}>
                      <table className={styles.detailTable}>
                        <tbody>
                          <tr>
                            <th>제목</th>
                            <td>{selectedConcert.subject || '-'}</td>
                          </tr>
                          <tr>
                            <th>일시</th>
                            <td>{formatDateRange(selectedConcert.event_start_date, selectedConcert.event_end_date)}</td>
                          </tr>
                          <tr>
                            <th>장소</th>
                            <td>{selectedConcert.location || '-'}</td>
                          </tr>
                          <tr>
                            <th>주관</th>
                            <td>{selectedConcert.planner || '-'}</td>
                          </tr>
                          <tr>
                            <th>주최</th>
                            <td>{selectedConcert.operator || '-'}</td>
                          </tr>
                          <tr>
                            <th>조회수</th>
                            <td>{typeof selectedConcert.visit === 'number' ? selectedConcert.visit : (selectedConcert.visit ? Number(selectedConcert.visit) : 0)}</td>
                          </tr>
                          <tr>
                            <th>첨부파일</th>
                            <td>{selectedConcert.file_name1 ? '있음' : '없음'}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* 아래: 원본 이미지 (스크롤 가능) */}
                    {getImageUrl(selectedConcert.file_name1) && (
                      <div className={styles.modalImageContainer}>
                        <Image
                          src={getImageUrl(selectedConcert.file_name1)}
                          alt={selectedConcert.subject || '공연소식'}
                          width={800}
                          height={1200}
                          className={styles.modalFullImage}
                          unoptimized
                        />
                      </div>
                    )}

                    {/* 콘텐츠 */}
                    {selectedConcert.content && (
                      <div className={styles.modalContentText}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedConcert.content
                          }}
                        />
                      </div>
                    )}
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
