'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { http } from '@/lib/http/client';
import styles from './page.module.css';

function formatDate(val) {
  if (!val) return '-';
  const d = new Date(val);
  return isNaN(d.getTime()) ? '-' : d.toLocaleDateString('ko-KR');
}

export default function AdmSliderPage() {
  const [sliders, setSliders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedSlider, setSelectedSlider] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingNum, setDeletingNum] = useState(null);
  const observerRef = useRef(null);
  const loadingRef = useRef(null);
  const isLoadingRef = useRef(false);

  const loadSliders = useCallback(async (skip = 0, take = 10) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;
    setLoading(true);
    try {
      const response = await http.get('/sliders', {
        params: { skip, take },
      });
      if (response.data.success) {
        const newSliders = response.data.data;
        if (skip === 0) {
          setSliders(newSliders);
        } else {
          setSliders((prev) => [...prev, ...newSliders]);
        }
        const totalLoaded = skip + newSliders.length;
        setHasMore(totalLoaded < response.data.total);
      }
    } catch (error) {
      console.error('Error loading sliders:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, []);

  useEffect(() => {
    loadSliders(0, 10);
  }, [loadSliders]);

  useEffect(() => {
    if (!hasMore || loading || !loadingRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingRef.current) {
          loadSliders(sliders.length, 5);
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );
    observer.observe(loadingRef.current);
    observerRef.current = observer;
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [sliders.length, hasMore, loading, loadSliders]);

  const handleRowClick = (slider) => {
    setSelectedSlider(slider);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSlider(null);
  };

  const handleDelete = async (num) => {
    if (!confirm('이 슬라이더를 삭제하시겠습니까?')) return;
    setDeletingNum(num);
    try {
      await http.delete(`/sliders/${num}`);
      setSliders((prev) => prev.filter((s) => String(s.num) !== String(num)));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || '삭제에 실패했습니다.');
    } finally {
      setDeletingNum(null);
    }
  };

  const getImageUrl = (file_name1) => {
    if (!file_name1) return null;
    if (file_name1.startsWith('http') || file_name1.startsWith('data:')) {
      return file_name1;
    }
    return `/assets/slider/${file_name1}`;
  };

  return (
    <>
      <div className={styles.contentHeader}>
        <div className={styles.contentHeaderInner}>
          <h1 className={styles.pageTitle}>슬라이더 관리</h1>
          <Link href="/dashboard/adm-slider/add-slider" className={styles.addButton}>
            슬라이더 추가
          </Link>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.boardContainer}>
          <table className={styles.sliderTable}>
            <thead>
              <tr>
                <th className={styles.thNum}>번호</th>
                <th>제목</th>
                <th className={styles.thImage}>이미지파일</th>
                <th className={styles.thDate}>게시일</th>
                <th className={styles.thActions}>관리</th>
              </tr>
            </thead>
            <tbody>
              {sliders.map((slider) => (
                <tr key={slider.num?.toString() ?? Math.random()}>
                  <td className={styles.tdNum}>{slider.num ?? '-'}</td>
                  <td>
                    <button
                      type="button"
                      className={styles.subjectButton}
                      onClick={() => handleRowClick(slider)}
                    >
                      {slider.subject || '-'}
                    </button>
                  </td>
                  <td className={styles.tdImage}>
                    {getImageUrl(slider.file_name1) ? (
                      <img
                        src={getImageUrl(slider.file_name1)}
                        alt={slider.subject || '슬라이더 이미지'}
                        className={styles.imageThumbnail}
                      />
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className={styles.tdDate}>{formatDate(slider.reg_date)}</td>
                  <td className={styles.tdActions}>
                    <Link
                      href={`/dashboard/adm-slider/edit-slider/${slider.num}`}
                      className={styles.editButton}
                    >
                      수정
                    </Link>
                    <button
                      type="button"
                      className={styles.deleteButton}
                      onClick={() => handleDelete(slider.num)}
                      disabled={deletingNum === slider.num}
                      aria-label="삭제"
                    >
                      {deletingNum === slider.num ? '삭제 중...' : '삭제'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div ref={loadingRef} className={styles.loadingIndicator}>
            {loading && <p>로딩 중...</p>}
            {!hasMore && sliders.length > 0 && <p>모든 슬라이더를 불러왔습니다.</p>}
          </div>
        </div>
      </div>

      {isModalOpen && selectedSlider && (
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
            <div className={styles.modalBody}>
              <h3 className={styles.modalTitle}>{selectedSlider.subject}</h3>
              {selectedSlider.link && (
                <p className={styles.modalLink}>
                  링크: <a href={selectedSlider.link} target="_blank" rel="noopener noreferrer">{selectedSlider.link}</a>
                </p>
              )}
              {getImageUrl(selectedSlider.file_name1) && (
                <div className={styles.modalImage}>
                  <img
                    src={getImageUrl(selectedSlider.file_name1)}
                    alt={selectedSlider.subject || '슬라이더 이미지'}
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
