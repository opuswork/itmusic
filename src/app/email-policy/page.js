"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import MembershipSidebar from '@/components/layout/MembershipSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function EmailPolicyPage() {
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

  const handleEmailClick = (e) => {
    e.preventDefault();
    alert('tenorseonatgmaildotcom');
  };

  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <div className={styles.subHeaderWrapper}>
        <div className={styles.contentWrapper}>
          <div className={styles.sidebarPlaceholder}></div>
          {isSidebarCollapsed && (
            <MembershipSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} showExpandButton={true} />
          )}
        </div>
      </div>
      <div className={styles.contentWrapper}>
        {!isSidebarCollapsed && (
          <MembershipSidebar isCollapsed={isSidebarCollapsed} onToggle={handleSidebarToggle} />
        )}
        <div className={styles.rightSection}>
          <div className={styles.sidebarPlaceholder}>
            <SubHeader title="이메일 무단수집 거부" />
          </div>
          <main className={styles.mainContent}>
            <div className={styles.content}>
              <p>
                <strong>[사]이탈리아음악협회</strong>는 정보통신망 이용촉진 및 정보보호 등에 관한 법률 등 관련 법령에 따라,
                본 웹사이트에 게시된 이메일 주소가 <strong>전자우편 수집 프로그램</strong> 또는 그 밖의 기술적 장치를 이용하여
                &nbsp;<strong>무단으로 수집</strong>되는 것을 &nbsp;<strong>거부</strong>합니다.
              </p>

              <div className={styles.box}>
                <p style={{ margin: 0 }}>
                  본 웹사이트에 게시된 이메일 주소를 무단으로 수집·저장·사용하거나 이를 영리 목적의 광고성 정보 전송에 이용할 경우
                  관련 법령에 따라 <strong>형사처벌</strong> 등 불이익이 발생할 수 있습니다.
                </p>
              </div>

              <h2>무단 수집 및 이용 금지</h2>
              <ul>
                <li>이메일 주소의 자동 수집 프로그램(봇, 크롤러 등)을 이용한 수집 행위</li>
                <li>수집된 이메일 주소를 이용한 스팸 메일 발송 및 광고성 정보 전송 행위</li>
                <li>수집·가공·판매·제공 등 제3자에게 유통하는 행위</li>
              </ul>

              <h2>연락처</h2>
              <p className={styles.muted}>
                본 정책과 관련하여 문의사항이 있으시면 아래로 연락해 주세요.
              </p>
              <p>
                담당부서: 홈페이지관리팀<br />
                이메일: <a href="mailto:tenorseonatgmaildotcom" onClick={handleEmailClick}>담당자이메일</a><br />
              </p>

              <h2>시행일</h2>
              <p>본 정책은 <strong>2026-01-23</strong>부터 시행됩니다.</p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
