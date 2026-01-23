"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import CommitteeSidebar from '@/components/layout/CommitteeSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function ConsultantsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [consultants, setConsultants] = useState([]);
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

  // 상임고문 데이터 로드
  const loadConsultants = useCallback(async (skip = 0, take = 5) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/consultants', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newConsultants = response.data.data;
        if (skip === 0) {
          setConsultants(newConsultants);
        } else {
          setConsultants(prev => [...prev, ...newConsultants]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newConsultants.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading consultants:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadConsultants(0, 5);
    }
  }, [loadConsultants]);

  // 무한스크롤 옵저버 설정
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadConsultants(consultants.length, 5);
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
  }, [consultants.length, hasMore, loading, loadConsultants]);

  // 프로필 텍스트를 줄바꿈으로 분리
  const parseProfile = (profile) => {
    if (!profile) return [];
    return profile.split('\n').filter(line => line.trim());
  };

  // 이미지 URL 생성
  const getImageUrl = (fileName) => {
    if (!fileName || fileName === 'none' || fileName === '1') return null;
    return `/assets/people/${fileName}`;
  };

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder}></div>
          {isSidebarCollapsed && (
            <CommitteeSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} showExpandButton={true} />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {!isSidebarCollapsed && (
          <CommitteeSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        )}
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="상임고문" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>상임고문</h1>
            <div className={styles.content}>
              {consultants.length === 0 && !loading ? (
                <p>상임고문 정보가 없습니다.</p>
              ) : (
                <div className={styles.consultantsList}>
                  {consultants.map((consultant) => {
                    const profileLines = parseProfile(consultant.profile);
                    const imageUrl = getImageUrl(consultant.file_name1);
                    
                    return (
                      <div key={consultant.num} className={styles.consultantCard}>
                        <div className={styles.consultantImageSection}>
                          {imageUrl ? (
                            <div className={styles.imageWrapper}>
                              <Image
                                src={imageUrl}
                                alt={consultant.name || '상임고문'}
                                width={300}
                                height={400}
                                className={styles.consultantImage}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className={styles.imagePlaceholder}>
                              <span>이미지 없음</span>
                            </div>
                          )}
                          {consultant.name && (
                            <p className={styles.consultantName}>{consultant.name}</p>
                          )}
                          {consultant.position && (
                            <p className={styles.consultantPosition}>{consultant.position}</p>
                          )}
                        </div>
                        <div className={styles.consultantInfoSection}>
                          {profileLines.length > 0 && (
                            <div className={styles.profileContent}>
                              {profileLines.map((line, index) => (
                                <p key={index} className={styles.profileLine}>
                                  {line}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {/* 무한스크롤 로딩 인디케이터 */}
              {hasMore && (
                <div ref={loadingRef} className={styles.loadingIndicator}>
                  {loading && <p>로딩 중...</p>}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
