"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function GreetingPage() {
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
            <SubHeader title="협회장 인사말" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>협회장 인사말</h1>
          <div className={styles.content}>
            <Image 
                src="/assets/people/profile-Kihong_Kim.jpg" 
                alt="회장 김기홍" 
                width={300}
                height={300}
                style={{ borderRadius: '50%', objectFit: 'cover', marginBottom: '20px', marginTop: '20px' }} 
            />
            <span className={styles.contentText}>
            <p>
              이탈리아 음악협회 홈페이지를 방문해 주셔서 감사합니다.
            </p>
            <p>
              [도레미파솔라시도]의 음계를 만들었고<br />
              오페라가 탄생한<br />
              모두가 서양음악의 뿌리로 보는 나라!<br />
              그 이름 그대로 이탈리아음악협회가 모였습니다.
            </p>
            <p>
              로마에서 7년간 성악을 공부하신 권우용 감독과<br />
              로마, 밀라노, 피렌체, 코모, 그리고 프랑스, 미국, 독일, 러시아 등지에서<br />
              성악을 공부하고 귀국하신 많은 탁월한 신진 성악가들,<br />
              국내 여러 대학에서 강의하시는 피아니스트들이 함께 활동 중입니다.<br />
              그 뿐 아니라<br />
              음악에 열정을 가진 실력 있는 아마추어들도 많이 계십니다.
            </p>
            <p>
              즉,<br />
              전공자들과 아마추어가 함께 연합하여 이탈리아음악협회가 시작된 것입니다.<br />
              여기 기초부터 시작해서 최고 수준의 음악이 모두 있습니다.<br />
              이탈리아음악협회의 문은 누구에게나 항상 열려 있습니다.<br />
              음악을 전공하지 않은 저 역시 경지에 들어가도록 인도되어 감동 속에 참여하고 있습니다.<br />
              문의나 방문하시면 너무도 자연스럽게 성악과 클래식 음악을 즐기고 공부할 수 있습니다.<br />
              환영합니다.
            </p>
            <p>
              회장 김기홍
            </p>
            </span>
          </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
