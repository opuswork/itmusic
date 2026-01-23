"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function MembershipPage() {
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
            <SubHeader title="회원가입/연회비/후원" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>회원가입/연회비/후원</h1>
          <div className={styles.content}>

            <p style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px" }}>
              회비는 협회주관 음악회 소요비용과 협회 운영을 위한 비용으로 사용됩니다.
            </p>
            <p style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px" }}>
              많은 후원 바랍니다.
            </p>
            <p style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px", marginBottom: "8px" }}>
              <strong>연회비:</strong>
            </p>
            <ul style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px", marginBottom: "16px", listStyle: 'disc inside' }}>
              <li>정회원(비음악전공자): 12만원</li>
              <li>음악전공회원: 12만원</li>
              <li>프리미엄회원: 20만원</li>
            </ul>
            <p style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px" }}>
              <a
                href="http://itmusic.or.kr/account/Signup.php?sii=2"
                className={styles.signupBtn}
                style={{
                  marginTop: 0,
                  marginRight: 3,
                  marginLeft: 3,
                  padding: "9px 25px",
                  fontFamily: "S-CoreDream",
                  wordBreak: "break-all",
                  verticalAlign: "baseline",
                  background: "rgb(96, 16, 19)",
                  transition: "0.3s",
                  letterSpacing: "-0.05em",
                  boxShadow: "rgba(255,255,255,0) 0px 1px inset",
                  position: "relative",
                  borderColor: "rgb(15, 84, 162)",
                  color: "#fff",
                  textDecoration: "none",
                  display: "inline-block"
                }}
                target="_blank"
                rel="noopener noreferrer"
              >회원가입(온라인 무료회원)</a>
              으로 가입후 본인의 희망에 따라 연회비를 납부하고 등급을 조정받게 됩니다.
            </p>
            <p style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px" }}>
              <b style={{ color: "#FF6B33" }}>
                (참고, 후원이사가 되시면 연회원보다 더 많은 혜택을 받으실수 있습니다.: 웹사이트 하단의 협회로 문의 바랍니다.)
              </b>
            </p>
            <br />
            <div style={{ color: "#000", fontFamily: "S-CoreDream", fontSize: "16px", letterSpacing: "-0.4px", marginBottom: "4px" }}>
              <div>우리은행</div>
              <div>1005-103-169794</div>
              <div>(예금주 : 이탈리아 음악협회)</div>
            </div>
          </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
