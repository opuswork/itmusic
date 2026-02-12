"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { http } from '@/lib/http/client';
import styles from './Slider.module.css';

export default function Slider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [sliderImages, setSliderImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSliders = async () => {
      try {
        const response = await http.get('/sliders');
        if (response.data.success) {
          const images = response.data.data.map((slider, idx) => {
            const src = slider.file_name1?.startsWith('http')
              ? slider.file_name1
              : `/assets/sliderImages/${slider.file_name1 || ''}`;
            const imageData = {
              src,
              link: slider.link || null,
              num: slider.num,
            };
            // 디버깅: 각 슬라이더의 링크 확인
            console.log(`Slider ${idx + 1} (num: ${slider.num}): link =`, imageData.link);
            return imageData;
          });
          setSliderImages(images);
        }
      } catch (error) {
        console.error('Error loading sliders:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          url: error.config?.url,
        });
      } finally {
        setLoading(false);
      }
    };

    loadSliders();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || sliderImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, sliderImages.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % sliderImages.length);
  };

  if (loading) {
    return (
      <div className={styles.slider}>
        <div className={styles.loadingWrap} aria-hidden>
          <span className={styles.spinner} />
        </div>
      </div>
    );
  }

  if (sliderImages.length === 0) {
    return null;
  }

  return (
    <div className={styles.slider}>
      <div className={styles.sliderContainer}>
        {sliderImages.map((slider, index) => {
          const isActive = index === currentIndex;
          const hasLink = slider.link && slider.link.trim() !== '';
          
          return (
            <div
              key={slider.num}
              className={`${styles.slide} ${isActive ? styles.active : ''}`}
            >
              {hasLink ? (
                <a 
                  href={slider.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  style={{ display: 'block', width: '100%', height: '100%' }}
                  onClick={(e) => {
                    // 디버깅: 클릭된 링크 확인
                    console.log(`Clicked slider ${index + 1} (num: ${slider.num}), link:`, slider.link);
                  }}
                >
                  <Image
                    src={slider.src}
                    alt={`Slider image ${index + 1}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    priority={index === 0}
                    unoptimized
                  />
                </a>
              ) : (
                <Image
                  src={slider.src}
                  alt={`Slider image ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority={index === 0}
                  unoptimized
                />
              )}
            </div>
          );
        })}
      </div>
      <button className={styles.prevBtn} onClick={goToPrevious}>
        ‹
      </button>
      <button className={styles.nextBtn} onClick={goToNext}>
        ›
      </button>
      <div className={styles.counter}>
        {currentIndex + 1} / {sliderImages.length}
      </div>
    </div>
  );
}
