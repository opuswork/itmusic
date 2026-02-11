'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

export default function AdmVideoPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getYouTubeEmbedUrl = (url) => {
    const videoId = getYouTubeVideoId(url);
    if (!videoId) return null;
    return `https://www.youtube.com/embed/${videoId}`;
  };

  const loadVideos = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/videos', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newVideos = response.data.data;
        if (skip === 0) {
          setVideos(newVideos);
        } else {
          setVideos((prev) => [...prev, ...newVideos]);
        }
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

  useEffect(() => {
    loadVideos(0, 10);
  }, [loadVideos]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadVideos(videos.length, 3);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [videos.length, hasMore, loading, loadVideos]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVideo(null);
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>관리자 영상</h1>
        </div>
      </div>

      <div className={styles.content}>
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
                <tr key={video.num?.toString() ?? video.link ?? Math.random()}>
                  <td>{video.subject || '-'}</td>
                  <td>{video.text || '-'}</td>
                  <td>
                    {video.link ? (
                      <button
                        type="button"
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

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && videos.length > 0 && <p>모든 영상을 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedVideo && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
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
    </>
  );
}
