"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuth } from '@/lib/auth/auth';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function VideosPage() {
  const router = useRouter();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 769) {
        setIsSidebarCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // YouTube URL에서 video ID 추출
  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // YouTube embed URL 생성
  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  // 영상 데이터 로드
  const loadVideos = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/videos', {
        params: { skip, take }
      });
      
      if (response.data.success) {
        const newVideos = response.data.data;
        if (skip === 0) {
          setVideos(newVideos);
        } else {
          setVideos(prev => [...prev, ...newVideos]);
        }
        
        // 더 불러올 데이터가 있는지 확인
        const totalLoaded = skip + newVideos.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (!isChecking) {
      loadVideos(0, 10);
    }
  }, [isChecking, loadVideos]);

  // 무한스크롤 옵저버 설정
  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadVideos(videos.length, 3);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // 뷰포트 하단 100px 전에 미리 트리거
      }
    );

    observer.observe(loadingRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos.length, hasMore, loading, loadVideos]);

  // 모달 열기
  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  if (isChecking) {
    return (
      <div className={styles.container}>
        <Header />
        <Nav />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '50vh',
          fontFamily: 'S-CoreDream'
        }}>
          로딩 중...
        </div>
        <Footer />
      </div>
    );
  }

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
            <SubHeader title="마스터클래스/협회원 연주영상" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>마스터클래스/협회원 연주영상</h1>
          <div className={styles.content}>
            <p>
              협회 회원 연주영상은 협회 회원 중 연주 영상을 제출한 회원들의 연주 영상을 공유하는 곳입니다.
              <br />
              <br />
              이탈리아음악협회
            </p>
            
            {/* 게시판 테이블 */}
            <div className={styles.boardContainer}>
              <table className={styles.videoTable}>
                <thead>
                  <tr>
                    <th>회원이름</th>
                    <th>설명</th>
                    <th>영상링크</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video.num.toString()}>
                      <td>{video.subject || '-'}</td>
                      <td>{video.text || '-'}</td>
                      <td>
                        {video.link ? (
                          <button
                            className={styles.videoLinkButton}
                            onClick={() => handleVideoClick(video)}
                            aria-label="영상 보기"
                          >
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M10 16.5L16 12L10 7.5V16.5ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"
                                fill="#FF0000"
                              />
                            </svg>
                          </button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* 무한스크롤 로딩 인디케이터 */}
              <div ref={loadingRef} className={styles.loadingIndicator}>
                {loading && <p>로딩 중...</p>}
                {!hasMore && videos.length > 0 && <p>모든 영상을 불러왔습니다.</p>}
              </div>
            </div>
          </div>

          {/* 모달 */}
          {isModalOpen && selectedVideo && (
            <div className={styles.modalOverlay} onClick={handleCloseModal}>
              <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <button
                  className={styles.modalCloseButton}
                  onClick={handleCloseModal}
                  aria-label="닫기"
                >
                  [닫기]
                </button>
                <div className={styles.modalVideoContainer}>
                  {getYouTubeEmbedUrl(selectedVideo.link) ? (
                    <iframe
                      src={getYouTubeEmbedUrl(selectedVideo.link)}
                      title={selectedVideo.subject}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className={styles.modalVideo}
                    />
                  ) : (
                    <div className={styles.modalError}>
                      <p>영상을 불러올 수 없습니다.</p>
                      <p className={styles.modalLink}>
                        <a href={selectedVideo.link} target="_blank" rel="noopener noreferrer">
                          링크로 이동
                        </a>
                      </p>
                    </div>
                  )}
                </div>
                <div className={styles.modalInfo}>
                  <h3>{selectedVideo.subject}</h3>
                  {selectedVideo.text && <p>{selectedVideo.text}</p>}
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
