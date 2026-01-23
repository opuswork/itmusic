"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './PosterSlider.module.css';

export default function PosterSlider({ data, slides = 3 }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideData = Array(slides).fill(data);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slideData.length]);

  return (
    <div className={styles.tabContent}>
      <div className={styles.concertContainer}>
        <div className={styles.concertImage}>
          <Image
            src={slideData[currentSlide].image}
            alt={slideData[currentSlide].title}
            width={300}
            height={400}
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.concertInfo}>
          <h3 className={styles.concertTitle}>{slideData[currentSlide].title}</h3>
          <div className={styles.concertDetails}>
            <p>일시: {slideData[currentSlide].date}</p>
            <p>장소: {slideData[currentSlide].venue}</p>
            {slideData[currentSlide].organizer && (
              <p>주관: {slideData[currentSlide].organizer}</p>
            )}
            <p>주최: {slideData[currentSlide].host}</p>
            <p>후원: {slideData[currentSlide].sponsor}</p>
          </div>
          <button className={styles.detailBtn}>자세히 보기</button>
          <div className={styles.slideDots}>
            {slideData.map((_, index) => (
              <button
                key={index}
                className={`${styles.dot} ${index === currentSlide ? styles.active : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
