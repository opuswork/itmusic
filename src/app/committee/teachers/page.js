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

export default function TeachersPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [teachers, setTeachers] = useState([]);
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

  // 교수진 데이터 로드
  const loadTeachers = useCallback(async (skip = 0, take = 5) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/teachers', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newTeachers = response.data.data;
        if (skip === 0) {
          setTeachers(newTeachers);
        } else {
          setTeachers(prev => [...prev, ...newTeachers]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newTeachers.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      hasInitialLoadRef.current = true;
      loadTeachers(0, 5);
    }
  }, [loadTeachers]);

  // 무한스크롤 옵저버 설정
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadTeachers(teachers.length, 5);
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
  }, [teachers.length, hasMore, loading, loadTeachers]);

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
            <SubHeader title="지도위원" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>지도위원</h1>
            <div className={styles.content}>
              {teachers.length === 0 && !loading ? (
                <p>교수진 정보가 없습니다.</p>
              ) : (
                <div className={styles.teachersList}>
                  {teachers.map((teacher) => {
                    const profileLines = parseProfile(teacher.profile);
                    const imageUrl = getImageUrl(teacher.file_name1);
                    
                    return (
                      <div key={teacher.num} className={styles.teacherCard}>
                        <div className={styles.teacherImageSection}>
                          {imageUrl ? (
                            <div className={styles.imageWrapper}>
                              <Image
                                src={imageUrl}
                                alt={teacher.name || '교수진'}
                                width={300}
                                height={400}
                                className={styles.teacherImage}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className={styles.imagePlaceholder}>
                              <span>이미지 없음</span>
                            </div>
                          )}
                          {teacher.name && (
                            <p className={styles.teacherName}>{teacher.name}</p>
                          )}
                          {teacher.position && (
                            <p className={styles.teacherPosition}>{teacher.position}</p>
                          )}
                        </div>
                        <div className={styles.teacherInfoSection}>
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
