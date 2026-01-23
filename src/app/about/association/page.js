"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function AssociationPage() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

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

  const handleSidebarToggle = () => {
    if (window.innerWidth <= 768) {
      setIsSidebarCollapsed(!isSidebarCollapsed);
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
            <SubHeader title="협회 소개" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>협회 소개</h1>
          <div className={styles.content}>
            <p>
              예술의 나라 이탈리아는 우리 인류에게 음악도 선물해 주었습니다.<br />
              물론 민족마다 나라마다 저마다의 음악을 갖고는 있었지만 오늘날 우리가 사용하는 음계와 오선지,<br />
              그리고 다양한 오케스트라 악기, 오페라, 성악곡들의 체계는 이탈리아음악을 기초하여 정립되었습니다.<br />
              그래서 서양음악사에서는 이탈리아를 음악이 탄생되었고,<br />
              가장 발전한 서양음악의 본고장으로 인정하고 있습니다.<br /><br />
              
              이탈리아음악협회는 다양한 형태로 발전한 오페라, 예술가곡, 칸초네, 한국가곡, 종교음악 등의<br />
              서양음악들을 공부하고 감상하는 곳입니다.<br /><br />

              2010년 GPS음악협회란 이름으로 시작된 이탈리아음악협회는<br />
              이제 많은 음악가들과 후원인들을 통해 성장을 거듭하고 있습니다.<br />
              우리 협회엔 이탈리아, 독일, 프랑스, 미국, 러시아 등지에서 공부하시고 오신<br />
              훌륭한 지도위원 선생님들이 입시지도, 마스터클래스 등으로<br />
              좋은 음악적 지식을 전달하여 주십니다.<br /><br />
              이탈리아음악협회
            </p>
          </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
