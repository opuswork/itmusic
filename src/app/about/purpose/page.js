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
            <SubHeader title="협회 설림 목적" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>협회 설립 목적</h1>
          <div className={styles.content}>
            <p className={styles.purposeText}>
              - 음악의 뿌리라 일컬을 수 있는 이탈리아 음악에 대한 연구와 연주활동을 통하여
              <br />
              <br />
              각박한 현대사회에 여유와 아름다움을 제공하고
              <br />
              <br />
              더욱 고상한 문화예술 기반을 조성하는 것을 목적으로 한다.
              <br />
              <br />
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
