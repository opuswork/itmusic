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

export default function ExecutivesPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [executives, setExecutives] = useState([]);
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

  // 상임이사 데이터 로드
  const loadExecutives = useCallback(async (skip = 0, take = 5) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/executives', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newExecutives = response.data.data;
        if (skip === 0) {
          setExecutives(newExecutives);
        } else {
          setExecutives(prev => [...prev, ...newExecutives]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newExecutives.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading executives:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadExecutives(0, 5);
    }
  }, [loadExecutives]);

  // 무한스크롤 옵저버 설정
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadExecutives(executives.length, 5);
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
  }, [executives.length, hasMore, loading, loadExecutives]);

  // 프로필 텍스트를 줄바꿈으로 분리
  const parseProfile = (profile) => {
    if (!profile) return [];
    return profile.split('\n').filter(line => line.trim());
  };

  // 이미지 URL 생성 (Vercel Blob 전체 URL이면 그대로, 아니면 /assets/people/ 경로)
  const getImageUrl = (fileName) => {
    if (!fileName || fileName === 'none' || fileName === '1') return null;
    if (fileName.startsWith('http')) return fileName;
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
            <SubHeader title="상임이사" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>상임이사</h1>
            <div className={styles.content}>
              {executives.length === 0 && !loading ? (
                <p>상임이사 정보가 없습니다.</p>
              ) : (
                <div className={styles.executivesList}>
                  {executives.map((executive) => {
                    const profileLines = parseProfile(executive.profile);
                    const imageUrl = getImageUrl(executive.file_name1);
                    
                    return (
                      <div key={executive.num} className={styles.executiveCard}>
                        <div className={styles.executiveImageSection}>
                          {imageUrl ? (
                            <div className={styles.imageWrapper}>
                              <Image
                                src={imageUrl}
                                alt={executive.name || '상임이사'}
                                width={300}
                                height={400}
                                className={styles.executiveImage}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className={styles.imagePlaceholder}>
                              <span>이미지 없음</span>
                            </div>
                          )}
                          {executive.name && (
                            <p className={styles.executiveName}>{executive.name}</p>
                          )}
                          {executive.position && (
                            <p className={styles.executivePosition}>{executive.position}</p>
                          )}
                        </div>
                        <div className={styles.executiveInfoSection}>
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
