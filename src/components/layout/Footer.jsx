"use client";

import Image from 'next/image';
import styles from './Footer.module.css';

const sponsors = [
  { name: 'sponsor_banner6-1', src: '/assets/bottomBanners/sponsor_banner6-1.jpg' },
  { name: 'themuseopera', src: '/assets/bottomBanners/themuseopera-banner-2.jpg' },
  { name: 'art-street', src: '/assets/bottomBanners/art-street_banner-3.jpg' },
  { name: 'won-international', src: '/assets/bottomBanners/20180904_113231-4.png' },
  { name: '이탈리아 음악협회', text: '이탈리아 음악협회' },
  { name: 'sponsor_banner6-6', src: '/assets/bottomBanners/sponsor_banner6-6.jpg' },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.sponsorSection}>
          {sponsors.map((sponsor, index) => (
            <div key={index} className={styles.sponsorItem}>
              {sponsor.src ? (
                <Image
                  src={sponsor.src}
                  alt={sponsor.name}
                  width={150}
                  height={34}
                  style={{ objectFit: 'contain' }}
                />
              ) : (
                <span className={styles.sponsorText}>{sponsor.text}</span>
              )}
            </div>
          ))}
        </div>
        <div className={styles.footerInfo}>
          <p className={styles.copyright}>
            Copyright© 2026, 이탈리아음악협회, Https://www.itmusic.or.kr, All rights reserved.
          </p>
          <p className={styles.address}>
            서울특별시 강북구 미아동 223-15, 개인정보보호관리 책임자: 선태영
          </p>
          <p className={styles.contact}>
            TEL: 02-555-3942 / E-MAIL: newseoul21c@naver.com
          </p>
        </div>
        {/* <div className={styles.familySite}>
          <button className={styles.familySiteBtn}>
            패밀리사이트 ↑
          </button>
        </div> */}
      </div>
    </footer>
  );
}
