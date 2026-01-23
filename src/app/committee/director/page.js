"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import CommitteeSidebar from '@/components/layout/CommitteeSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function DirectorPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [directors, setDirectors] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadDirectors = async () => {
      try {
        const response = await http.get('/directors');
        if (response.data.success) {
          setDirectors(response.data.data);
        }
      } catch (error) {
        console.error('Error loading directors:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDirectors();
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // 프로필 텍스트를 줄바꿈으로 분리
  const parseText = (text) => {
    if (!text) return [];
    return text.split('\n').filter(line => line.trim());
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
            <SubHeader title="음악감독" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>음악감독</h1>
            <div className={styles.content}>
              {loading ? (
                <p>로딩 중...</p>
              ) : directors.length === 0 ? (
                <p>이사진 정보가 없습니다.</p>
              ) : (
                <div className={styles.directorsList}>
                  {directors.map((director) => {
                    const textLines = parseText(director.text);
                    const imageUrl = getImageUrl(director.file_name1);
                    
                    return (
                      <div key={director.num} className={styles.directorCard}>
                        <div className={styles.directorImageSection}>
                          {imageUrl ? (
                            <div className={styles.imageWrapper}>
                              <Image
                                src={imageUrl}
                                alt={director.name || '이사진'}
                                width={300}
                                height={400}
                                className={styles.directorImage}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className={styles.imagePlaceholder}>
                              <span>이미지 없음</span>
                            </div>
                          )}
                          {director.name && (
                            <p className={styles.directorName}>{director.name}</p>
                          )}
                          {director.position && (
                            <p className={styles.directorPosition}>{director.position}</p>
                          )}
                        </div>
                        <div className={styles.directorInfoSection}>
                          {textLines.length > 0 && (
                            <div className={styles.textContent}>
                              {textLines.map((line, index) => (
                                <p key={index} className={styles.textLine}>
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
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
