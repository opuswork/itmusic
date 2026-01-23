"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Sidebar from '@/components/layout/Sidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function CompetitionPage() {
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
            <SubHeader title="협회 성악콩쿠르" />
          </div>
          <main className={styles.mainContent}>
          <h1 className={styles.pageTitle}>협회 성악콩쿠르</h1>
          <div className={styles.content}>
            <p>
              모든 성악을 전공하는 분들은 아실 겁니다.<br />
              성악을 전공하는 학도에게 있어 한 선생을 믿고 그에게 레슨을 받는다는 것은 자신의 미래를 그분께 의탁한다는 의미가 있습니다.<br />
              성악가의 노래 인생은 발성과 노래가 전부이고, 그것을 위해 유명한 선생을 찾아 유학까지 떠납니다.<br />
              2017년 봄<br />
              저에게 레슨받는 분이 다섯 분 계셨습니다.<br />
              모두 아마추어였는데 저를 믿고 저에게 레슨을 받으신다는 자체가 참으로 기쁘고 감사했습니다.<br />
              그래서 뭔가로 그분들께 보답해 드리고 싶었습니다.<br />
              생각 끝에 결심한 것이 아마추어 성악콩쿠르였습니다.<br />
              제가 이태리에서 살며 가장 기뻤을 때를 회상해 보니 단연 콩쿠르에 입상해서 상금 받을 때였습니다.<br />
              그래서 입상할 때의 그 감격과 기쁨을 저에게 레슨 받는 분들께 선사해 드리고 싶었습니다.<br />
              저 스스로 &lt;나는 정말 잘 가르친다. 모두 입상시킬 수 있다.&gt;는 자신감도 강하게 들었습니다.<br />
              그렇게 제 1회 콩쿠르를 만들고 보니 도저히 저는 심사를 할 수가 없더군요.<br />
              제가 만든 콩쿠르에서 제가 심사를 하게 되면 불공정한 콩쿠르가 될 것이 뻔한데<br />
              그것은 입상을 기대하고 참가하신 모든 아마추어 참가자들에게 큰 실망을 안겨드리는 것이 되기 때문이었습니다.<br />
              저 역시 이태리에서 유학하며 그런 일들로 억울했을 때가 많았거든요.<br />
              게다가 만약 저에게 배우시는 분들이 저의 도움으로 입상한들 그 분들도 결코 기쁘지 않을 것은 뻔한 일입니다.<br />
              그러나 정작 제 개인 주머니를 털어 콩쿠르를 만들었건만 저에게 노래 배우시는 분들의 탈락만을 지켜 보아야 했습니다.<br />
              다행히 한 분이 입상하시긴 했지만 나머지 네 분은 제가 만든 콩쿠르로 인해 마음 깊이 실망만 하시는 꼴이 되었던 것이지요.<br />
              이것은 저에게 있어 아마추어에게도 얼마나 책임있게 레슨해야 하는가를 고민하게 하는 사건이 되었습니다.<br />
              배우시는 분들이 아마추어라 해도 당연히 최선을 다해서 가르쳐야 하고,<br />
              그것을 저 스스로 평가 받는 시험대가 바로 제가 만든 이탈리아 성악콩쿠르가 된 셈이지요.<br />
              이듬해에 제 2회 콩쿠르를 개최했습니다.<br />
              제가 처음 사비를 털어 시작하게 된 이탈리아 음악협회 성악콩쿠르는 매년 저에게 큰 시험대가 됩니다.<br />
              아울러 성악을 공부하시는 모든 아마추어들에게 용기와 자극이 되시기를 진심으로 바랍니다.<br />
              (제 1회 콩쿠르를 시행할 때까지는 저 혼자 세운 협회에서 저 혼자 진행한 콩쿠르였으나<br />
              2017년 12월 처음으로 음악전공자들과 비전공자들을 협회원으로 모집하여<br />
              회비와 기금을 갖게 되었고, 제 2회 콩쿠르부터는 협회비로 시행하였습니다.)<br /><br />
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
