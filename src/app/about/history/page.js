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
            <SubHeader title="협회 연혁" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>협회 연혁</h1>
          <div className={styles.content}>
            <ul className={styles.historyList}>
              <li>
                <h3>■ 2025년</h3>
                <ul>
                  <li>2025 정기연주회 (2월 25일 - 세라믹팔레스 홀)</li>
                  <li>이탈리아음악협회 8회 콩쿠르 입상자 [이팔회] 창립</li>
                  <li>이팔회 제 1회 정기연주회 (5월 3일)</li>
                </ul>
              </li>
              <li>
                <h3>■ 2024년</h3>
                <ul>
                  <li>해설이 있는 토스티 가곡집(中國語 上, 下 출간)</li>
                  <li>제 8회 이탈리아음악협회 성악콩쿠르 개최</li>
                  <li>입상장 음악회 개최 (제이드 홀)</li>
                </ul>
              </li>
              <li>
                <h3>■ 2023년</h3>
                <ul>
                  <li>제 7회 이탈리아음악협회 성악콩쿠르 개최</li>
                  <li>제 6회 정기연주회</li>
                  <li>해설이 있는 토스티 가곡집(30선 단편가곡) 출간</li>
                </ul>
              </li>
              <li>
                <h3>■ 2022년</h3>
                <ul>
                  <li>지도위원 정기연주회(일신홀. 11.28)</li>
                  <li>해설이 있는 토스티 가곡집 2 출간(연가곡편)</li>
                  <li>해설이 있는 음악회 프로그램(이탈리아음악산책 편)</li>
                  <li>제 6회 이탈리아음악협회 성악콩쿠르 개최 (6월 6일)</li>
                  <li>제 5회 정기연주회 개최(꿈의숲 아트홀 콘서트홀- 8월25일)</li>
                  <li>지도위원 정기연주회(Tosti가곡집 출간기념)-난곡홀(9월 12일)</li>
                  <li>해설이 있는 Tosti 연가곡집 출간(10월 3일)</li>
                  <li>콘서트 <i>La nostra Italia</i> 개최 - 11월 28일</li>
                </ul>
              </li>
              <li>
                <h3>■ 2021년</h3>
                <ul>
                  <li>제 5회 이탈리아음악협회 성악콩쿠르 개최 (8월 5일)</li>
                  <li>
                    (코로나로 인해 예선 및 본선 비대면
                    &lt;중고등부 본선은 오프라인 진행예정&gt;, 영상 제출 및 평가, 시상 비대면으로 진행)
                  </li>
                  <li>해설이 있는 벨리니 가곡집 출간 (12월)</li>
                </ul>
              </li>
              <li>
                <h3>■ 2020년</h3>
                <ul>
                  <li>제 4회 이탈리아음악협회 성악콩쿠르 개최 (6월 6일)</li>
                  <li>제 3회 정기연주회 (예술의 전당) - (11월 21일)</li>
                </ul>
              </li>
              <li>
                <h3>■ 2019년</h3>
                <ul>
                  <li>3월 7일 - Primavera 봄맞이 음악회 (분당아름다운 교회)</li>
                  <li>제 3회 이탈리아음악협회 성악콩쿠르 개최 (심사위원장 조창배 교수, 부위원장 이선아 교수, 김진추 교수)</li>
                  <li>제 1회 Belle Donne 향상음악회 (5월)</li>
                  <li>우정음악회 (김기홍, 김종철, 박병대) - 분당아름다운 교회</li>
                  <li>테너 강신찬 독창회 (6.22)</li>
                  <li>분당서울대병원 로비음악회 (08.09)</li>
                  <li>제 2회 정기연주회 (10. 03)</li>
                  <li>2019년 12월 30일 송년회 및 총회</li>
                </ul>
              </li>
              <li>
                <h3>■ 2018년</h3>
                <ul>
                  <li>이탈리아음악협회 사무실 이전 (2018) : 신설동</li>
                  <li>김진추 교수 초청 마스터클래스 실시</li>
                  <li>제 2회 이탈리아음악협회 성악콩쿠르 (심사위원장 오미선 교수, 강형규 교수, 김진추 교수)</li>
                  <li>이탈리아음악협회 창립음악회 (9/4) - 세일아트홀</li>
                  <li>바리톤 천규승 독창회</li>
                  <li>성신여대 초청 방문 연주회 (10/5) - 성신여대</li>
                  <li>춘천풍물시장 버스킹공연 초청연주 (10/13) - 춘천시</li>
                </ul>
              </li>
              <li>
                <h3>■ 2017년</h3>
                <ul>
                  <li>이탈리아음악협회로 사업자명 변경 - 대치동 978번지</li>
                  <li>제 1회 이탈리아 음악협회 성악콩쿠르 - SCC홀(본선)</li>
                  <li>(심사위원장 황승경 교수, 성기훈 교수)</li>
                  <li>이탈리아음악협회 비전공 회원모집 개시 및 총회 (2017년 12월)</li>
                  <li>(회장 추대 : 김기홍)</li>
                </ul>
              </li>
              <li>
                <h3>■ 2010년</h3>
                <ul>
                  <li>GPS 음악협회 사업자 등록</li>
                  <li>제 1회 이탈리아 음악산책 개최(2010) - 산울림 소극장</li>
                  <li>제 2회 이탈리아 음악산책 개최(2010) - 문래예술공장</li>
                  <li>제 3회 이탈리아 음악산책 개최(2013) - 홀트회관</li>
                  <li>광신기계공업 주식회사 초청 공연 - 2011</li>
                  <li>정부청사 초청 주한미군(신병) 환영 연주회 - 2010</li>
                  <li>더 뮤즈 오페라단 초청 협주 - 2010~2015</li>
                </ul>
              </li>
            </ul>
            <div style={{ marginTop: '2rem', fontWeight: 600, textAlign: 'right' }}>이탈리아음악협회</div>
          </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
