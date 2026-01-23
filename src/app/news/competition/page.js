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

export default function CompetitionPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [competitions, setCompetitions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompetition, setSelectedCompetition] = useState(null);
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

  // 콩쿠르소식 데이터 로드
  const loadCompetitions = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/competitions', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newCompetitions = response.data.data;
        if (skip === 0) {
          setCompetitions(newCompetitions);
        } else {
          setCompetitions(prev => [...prev, ...newCompetitions]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newCompetitions.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading competitions:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadCompetitions(0, 10);
    }
  }, [loadCompetitions]);

  // 무한스크롤 옵저버 설정 (검색 중이 아닐 때만)
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current || searchTerm.trim()) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current && !searchTerm.trim()) {
          loadCompetitions(competitions.length, 10);
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
  }, [competitions.length, hasMore, loading, loadCompetitions, searchTerm]);

  // 검색 기능 - 검색 시에는 전체 데이터에서 필터링
  const filteredCompetitions = searchTerm.trim()
    ? competitions.filter(competition =>
        competition.subject?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : competitions;

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
    return `/assets/competition/${fileName}`;
  };

  // 파일 다운로드 URL 생성
  const getFileDownloadUrl = (fileName) => {
    if (!fileName || fileName === 'none' || fileName === '1') return null;
    return `/assets/competition/${fileName}`;
  };

  // 파일 확장자 확인
  const getFileExtension = (fileName) => {
    if (!fileName) return '';
    const parts = fileName.split('.');
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
  };

  // 모달 열기
  const handleCompetitionClick = (competition) => {
    setSelectedCompetition(competition);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCompetition(null);
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
            <SubHeader title="콩쿠르소식" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>콩쿠르</h1>
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
                {loading && competitions.length === 0 ? (
                  <div className={styles.loadingMessage}>로딩 중...</div>
                ) : filteredCompetitions.length === 0 ? (
                  <div className={styles.emptyMessage}>
                    {searchTerm.trim() ? '검색 결과가 없습니다.' : '게시물이 없습니다.'}
                  </div>
                ) : (
                  <div className={styles.competitionList}>
                    {filteredCompetitions.map((competition) => {
                      const imageUrl = getImageUrl(competition.file_name1);
                      return (
                        <div key={competition.num} className={styles.competitionItem}>
                          <div 
                            className={styles.competitionImageWrapper}
                            onClick={() => handleCompetitionClick(competition)}
                          >
                            {imageUrl ? (
                              <Image
                                src={imageUrl}
                                alt={competition.subject || '콩쿠르소식'}
                                width={200}
                                height={280}
                                className={styles.competitionThumbnail}
                                unoptimized
                              />
                            ) : (
                              <div className={styles.imagePlaceholder}>
                                이미지 없음
                              </div>
                            )}
                          </div>
                          <div className={styles.competitionInfo}>
                            <h3 
                              className={styles.competitionTitle}
                              onClick={() => handleCompetitionClick(competition)}
                            >
                              {competition.subject || '-'}
                            </h3>
                            <p className={styles.competitionMeta}>
                              작성자: {competition.operator || '이탈리아음악협회'} | 작성일: {formatDate(competition.reg_date)}
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
                    {loading && competitions.length > 0 && <p>로딩 중...</p>}
                    {!hasMore && competitions.length > 0 && <p>모든 게시물을 불러왔습니다.</p>}
                  </div>
                )}
              </div>
            </div>

            {/* 모달 */}
            {isModalOpen && selectedCompetition && (
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
                    <h2>콩쿠르소식</h2>
                  </div>

                  <div className={styles.modalBody}>
                    {/* 상세 정보 테이블 */}
                    <div className={styles.modalInfoTable}>
                      <table className={styles.detailTable}>
                        <tbody>
                          <tr>
                            <th>제목</th>
                            <td>{selectedCompetition.subject || '-'}</td>
                          </tr>
                          <tr>
                            <th>일시</th>
                            <td>{formatDateRange(selectedCompetition.event_start_date, selectedCompetition.event_end_date)}</td>
                          </tr>
                          <tr>
                            <th>장소</th>
                            <td>{selectedCompetition.location || '-'}</td>
                          </tr>
                          <tr>
                            <th>주관</th>
                            <td>{selectedCompetition.planner || '-'}</td>
                          </tr>
                          <tr>
                            <th>주최</th>
                            <td>{selectedCompetition.operator || '-'}</td>
                          </tr>
                          <tr>
                            <th>조회수</th>
                            <td>{typeof selectedCompetition.visit === 'number' ? selectedCompetition.visit : (selectedCompetition.visit ? Number(selectedCompetition.visit) : 0)}</td>
                          </tr>
                          <tr>
                            <th>이미지파일</th>
                            <td>{selectedCompetition.file_name1 || '-'}</td>
                          </tr>
                          {selectedCompetition.file_name2 && (
                            <tr>
                              <th>콩쿨신청서 ({getFileExtension(selectedCompetition.file_name2)})</th>
                              <td>
                                <a 
                                  href={getFileDownloadUrl(selectedCompetition.file_name2)} 
                                  download
                                  className={styles.downloadLink}
                                >
                                  신청서다운로드
                                </a>
                              </td>
                            </tr>
                          )}
                          {selectedCompetition.file_name3 && (
                            <tr>
                              <th>콩쿨신청서 ({getFileExtension(selectedCompetition.file_name3)})</th>
                              <td>
                                <a 
                                  href={getFileDownloadUrl(selectedCompetition.file_name3)} 
                                  download
                                  className={styles.downloadLink}
                                >
                                  신청서다운로드
                                </a>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* 아래: 원본 이미지 (스크롤 가능) */}
                    {getImageUrl(selectedCompetition.file_name1) && (
                      <div className={styles.modalImageContainer}>
                        <Image
                          src={getImageUrl(selectedCompetition.file_name1)}
                          alt={selectedCompetition.subject || '콩쿠르소식'}
                          width={800}
                          height={1200}
                          className={styles.modalFullImage}
                          unoptimized
                        />
                      </div>
                    )}

                    {/* 콘텐츠 */}
                    {selectedCompetition.content && (
                      <div className={styles.modalContentText}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedCompetition.content
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
