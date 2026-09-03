"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { http } from '@/lib/http/client';
import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
// 상세 페이지용 CSS 파일이 필요하다면 별도 생성하거나 기존 파일을 재사용하세요
import styles from '../page.module.css'; 

export default function CultureDetailPage() {
  const { id } = useParams(); // URL에서 게시글 번호(id) 가져오기
  const router = useRouter();
  
  const [culture, setCulture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // 사이드바 상태 처리 로직 (기존과 동일)
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarCollapsed(window.innerWidth < 769);
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

  // 상세 데이터 로드
  useEffect(() => {
    const fetchCultureDetail = async () => {
      try {
        setLoading(true);
        // 백엔드 API 명세에 맞춰 엔드포인트를 수정해주세요
        const response = await http.get(`/cultures/${id}`);
        
        if (response.data.success) {
          setCulture(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching culture detail:', error);
        alert('데이터를 불러오는데 실패했습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCultureDetail();
    }
  }, [id, router]);

  const formatDate = (dateValue) => {
    if (!dateValue) return '-';
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return '-';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      return '-';
    }
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
            <SubHeader title="이탈리아문화산책 상세" />
          </div>
          <main className={styles.mainContent}>
            
            {loading ? (
              <div>로딩 중...</div>
            ) : culture ? (
              <div className={styles.detailContainer}>
                {/* 모달에 있던 UI를 페이지 UI로 변환 */}
                <h1 className={styles.pageTitle}>{culture.subject}</h1>
                <div style={{ marginBottom: '20px', color: '#666' }}>
                  <span>게시일: {formatDate(culture.reg_date)}</span>
                  <span style={{ marginLeft: '15px' }}>조회수: {culture.visit}</span>
                </div>
                
                <hr style={{ marginBottom: '20px' }} />
                
                <div
                  className={styles.detailContentText}
                  dangerouslySetInnerHTML={{
                    __html: culture.content || '내용이 없습니다.'
                  }}
                />

                <div style={{ marginTop: '40px', textAlign: 'center' }}>
                  <button 
                    onClick={() => router.back()} 
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                  >
                    목록으로 돌아가기
                  </button>
                </div>
              </div>
            ) : (
              <div>데이터를 찾을 수 없습니다.</div>
            )}

          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}