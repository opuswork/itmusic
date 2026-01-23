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

export default function OperatorsPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [operators, setOperators] = useState([]);
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
    const loadOperators = async () => {
      try {
        const response = await http.get('/operators');
        if (response.data.success) {
          setOperators(response.data.data);
        }
      } catch (error) {
        console.error('Error loading operators:', error);
      } finally {
        setLoading(false);
      }
    };

    loadOperators();
  }, []);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

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
            <SubHeader title="운영/지도위원" />
          </div>
          <main className={styles.mainContent}>
            <h1 className={styles.pageTitle}>운영위원</h1>
            <div className={styles.content}>
              {loading ? (
                <p>로딩 중...</p>
              ) : operators.length === 0 ? (
                <p>운영위원 정보가 없습니다.</p>
              ) : (
                <div className={styles.operatorsList}>
                  {operators.map((operator) => {
                    const profileLines = parseProfile(operator.profile);
                    const imageUrl = getImageUrl(operator.file_name1);
                    
                    return (
                      <div key={operator.num} className={styles.operatorCard}>
                        <div className={styles.operatorImageSection}>
                          {imageUrl ? (
                            <div className={styles.imageWrapper}>
                              <Image
                                src={imageUrl}
                                alt={operator.name || '운영위원'}
                                width={300}
                                height={400}
                                className={styles.operatorImage}
                                unoptimized
                              />
                            </div>
                          ) : (
                            <div className={styles.imagePlaceholder}>
                              <span>이미지 없음</span>
                            </div>
                          )}
                          {operator.name && (
                            <p className={styles.operatorName}>{operator.name}</p>
                          )}
                        </div>
                        <div className={styles.operatorInfoSection}>
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
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
