"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import MembershipSidebar from '@/components/layout/MembershipSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function TermsPage() {
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
            <SubHeader title="서비스 이용약관" />
          </div>
          <main className={styles.mainContent}>
            <div className={styles.content}>
              <div className={styles.headerSection}>
                <h1>서비스 이용약관</h1>
                <p className={styles.muted} style={{ margin: '8px 0 0' }}>
                  이탈리아음악협회 (itmusic.or.kr) 서비스 이용약관
                </p>
              </div>

              <div className={styles.box}>
                <p style={{ margin: 0 }}>
                  <strong>시행일:</strong> 2026년 1월 23일 &nbsp;|&nbsp;
                  <strong>최종 개정일:</strong> 2026년 1월 23일
                </p>
              </div>

              <h2>제1조 (목적)</h2>
              <p>
                본 약관은 이탈리아음악협회(이하 &quot;협회&quot;)가 운영하는 웹사이트 및 관련 서비스(이하 &quot;서비스&quot;)의 이용과 관련하여
                협회와 이용자(회원)의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>

              <h2>제2조 (협회의 목적 및 서비스 개요)</h2>
              <p>
                협회는 성악의 본고장인 이탈리아 성악음악과 오페라를 즐기고 유지·발전시키기 위한 연구, 발표, 친목 도모를 목적으로 합니다.
              </p>
              <p>협회는 다음과 같은 서비스를 제공합니다.</p>
              <ul>
                <li>회원 전용 콘텐츠 열람(연주 영상/자료 등)</li>
                <li>협회 소속 지도위원 등과의 레슨 연계(할인/우대 등 혜택은 협회 정책에 따름)</li>
                <li>정기연주회 및 각종 공연/행사 참여 기회(선발/배정 기준은 공지 또는 별도 규정에 따름)</li>
                <li>회원의 연주 영상 업로드 및 보관(회원 전용 열람 제한 포함)</li>
              </ul>

              <h2>제3조 (용어의 정의)</h2>
              <ul>
                <li>&quot;이용자&quot;란 본 서비스를 이용하는 모든 자를 말합니다.</li>
                <li>&quot;회원&quot;이란 소셜 로그인(외부 계정 연동)을 통해 서비스에 가입(자동가입 포함)하여 이용하는 자를 말합니다.</li>
                <li>&quot;콘텐츠&quot;란 협회 또는 회원이 서비스 내에 게시/업로드한 영상, 음원, 이미지, 문서, 글 등 일체를 말합니다.</li>
                <li>&quot;멤버십&quot;이란 협회 운영을 위해 부과되는 연회비 납부를 포함한 회원 자격/혜택 체계를 말합니다.</li>
              </ul>

              <h2>제4조 (약관의 효력 및 변경)</h2>
              <p>
                ① 본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써 효력이 발생합니다. <br />
                ② 협회는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용일 및 개정사유를 명시하여 사전 공지합니다.
              </p>

              <h2>제5조 (회원가입 및 계정 연동)</h2>
              <p>
                ① 서비스는 일반 회원가입(아이디/비밀번호 방식) 없이, <strong>소셜 로그인</strong>을 통해 회원가입이 이루어질 수 있습니다(자동가입).
                회원은 소셜 로그인 시 제공되는 동의 화면(필수/선택 항목 포함)을 확인하고 동의하여야 합니다.
              </p>
              <p>
                ② 협회는 소셜 로그인 제공자(예: Google, Kakao, Naver 등)로부터 <strong>식별자, 이메일, 프로필 정보</strong> 등 필요한 범위의 정보를 제공받을 수 있으며,
                구체적인 수집 항목과 이용 목적은 개인정보처리방침에서 정합니다.
              </p>
              <p>
                ③ 회원은 언제든지 서비스 내 설정 또는 소셜 로그인 제공자의 설정을 통해 계정 연동을 해제할 수 있으며,
                연동 해제 시 일부 또는 전체 서비스 이용이 제한될 수 있습니다.
              </p>

              <h2>제6조 (회원의 의무 및 금지행위)</h2>
              <p>회원은 다음 각 호의 행위를 하여서는 안 됩니다.</p>
              <ul>
                <li>타인의 계정 또는 개인정보를 도용하거나 부정 사용</li>
                <li>서비스 운영을 방해하는 행위(해킹, 비정상 트래픽 유발, 크롤링 등)</li>
                <li>협회 또는 제3자의 저작권/초상권 등 권리를 침해하는 콘텐츠 게시</li>
                <li>음란·혐오·차별·폭력적 내용, 불법 정보 등 관계 법령 위반 콘텐츠 게시</li>
                <li>회원 전용 콘텐츠를 외부에 무단 공유/유출(녹화, 캡처, 재배포 포함)</li>
                <li>기타 선량한 풍속 및 사회질서에 반하는 행위</li>
              </ul>

              <h2>제7조 (멤버십(연회비) 및 결제)</h2>
              <p>
                ① 협회는 단체 운영을 위해 <strong>연회비(annual membership fee)</strong>를 부과할 수 있으며 금액, 납부 시기, 혜택 범위는 서비스 공지 또는 별도 안내에 따릅니다.
              </p>
              <p>
                ② 결제는 [결제수단: 카드/계좌이체/간편결제/정기결제]를 통해 이루어질 수 있습니다.
                정기결제를 제공하는 경우, 결제 주기·해지 방법·해지 시 효력 발생 시점은 결제 화면 및/또는 별도 안내에 따릅니다.
              </p>
              <div className={styles.box}>
                <p style={{ margin: 0 }}>
                  <strong>권장:</strong> 결제/환불 정책은 분쟁이 잦은 영역이라, &quot;연회비가 제공하는 서비스 범위(회원 전용 열람 권한, 행사 참여권, 영상 보관 등)&quot;와
                  &quot;환불 기준(일할/부분/불가 사유)&quot;를 구체적으로 적어두는 것이 좋습니다. 전자상거래 표준약관/법령 틀을 참고해 구성하세요.
                </p>
              </div>

              <h2>제8조 (환불 및 청약철회)</h2>
              <p className={styles.muted}>※ 아래는 예시입니다. 실제 운영 정책/법적 지위(통신판매 해당 여부 등)에 맞게 조정하세요.</p>
              <ul>
                <li>연회비 결제 후 <strong>[7일/14일]</strong> 이내이고, 회원 전용 콘텐츠 이용/영상 업로드/행사 신청 등 &quot;혜택 사용&quot;이 없는 경우: 전액 환불</li>
                <li>혜택을 일부 사용한 경우(예: 영상 업로드·보관 사용, 회원 전용 영상 열람, 레슨 혜택 적용, 행사 참여/신청 등): 사용분을 공제한 후 부분 환불 또는 환불 불가</li>
                <li>환불 신청 방법: [이메일/고객센터/마이페이지 경로]로 신청</li>
                <li>환불 처리 기간: 신청 접수 후 [영업일 기준 3~7일] 이내(결제수단에 따라 상이)</li>
              </ul>

              <h2>제9조 (회원 콘텐츠 업로드 및 권리)</h2>
              <p>
                ① 회원이 업로드한 콘텐츠(연주 영상 등)의 저작권은 원칙적으로 해당 회원에게 귀속됩니다.
              </p>
              <p>
                ② 다만, 회원은 서비스 운영(보관, 스트리밍, 회원 전용 공개, 품질 개선, 백업 등)을 위해
                협회에 대하여 <strong>서비스 제공에 필요한 범위</strong>에서 콘텐츠를 저장·복제·전송·공개할 수 있는 이용권한(비독점적, 무상, 전세계적)을 허락합니다.
                회원이 탈퇴하거나 콘텐츠를 삭제하면, 관련 법령 및 운영상 필요한 범위를 제외하고 지체 없이 삭제될 수 있습니다.
              </p>
              <p>
                ③ 회원은 업로드 콘텐츠에 포함된 음악·반주 음원·악보·영상·이미지·초상권 등 제3자 권리를 침해하지 않도록 필요한 권리처리를 완료해야 하며,
                분쟁 발생 시 책임은 회원에게 있습니다.
              </p>

              <h2>제10조 (회원 전용 콘텐츠 및 접근 제한)</h2>
              <p>
                ① 협회는 회원들의 소중한 경험과 노력으로 만들어진 결과물을 보호하기 위해, 일부 콘텐츠를 <strong>로그인 회원에게만 공개</strong>할 수 있습니다. <br />
                ② 회원은 회원 전용 콘텐츠를 협회의 사전 허락 없이 외부에 공유하거나 상업적으로 이용할 수 없습니다.
              </p>

              <h2>제11조 (서비스의 제공, 변경 및 중단)</h2>
              <p>
                ① 협회는 서비스의 일부 또는 전부를 운영상·기술상 필요에 따라 변경할 수 있습니다. <br />
                ② 시스템 점검, 서버 이전(Render 마이그레이션 등), SSL 적용, 장애 발생 등 부득이한 사유가 있는 경우 서비스 제공이 일시 중단될 수 있으며,
                협회는 가능한 범위에서 사전 또는 사후 공지합니다.
              </p>

              <h2>제12조 (회원 탈퇴 및 이용 제한)</h2>
              <p>
                ① 회원은 언제든지 서비스 내 기능 또는 협회에 대한 요청을 통해 탈퇴할 수 있습니다. <br />
                ② 협회는 회원이 본 약관을 위반하거나 서비스 질서를 해치는 경우 사전 통지 후 이용 제한, 콘텐츠 삭제, 회원 자격 정지/해지 등을 할 수 있습니다.
              </p>

              <h2>제13조 (개인정보 보호)</h2>
              <p>
                협회는 관련 법령에 따라 회원의 개인정보를 보호하며, 개인정보의 수집·이용·보관·파기 등은
                협회의 <Link href="/privacy">개인정보처리방침</Link>에 따릅니다.
              </p>

              <h2>제14조 (책임 제한)</h2>
              <p>
                ① 협회는 천재지변, 불가항력, 제3자 통신망 장애, 소셜 로그인 제공자 서비스 장애 등 협회의 합리적 통제 범위를 벗어난 사유로 인한 서비스 장애에 대해 책임을 지지 않습니다. <br />
                ② 협회는 회원이 서비스에 게시한 콘텐츠의 정확성·적법성에 대해 보증하지 않으며, 이에 대한 책임은 게시한 회원에게 있습니다.
              </p>

              <h2>제15조 (분쟁 해결 및 준거법)</h2>
              <p>
                ① 협회와 회원 간 분쟁이 발생한 경우 상호 성실히 협의하여 해결합니다. <br />
                ② 협의로 해결되지 않을 경우, 준거법은 대한민국 법으로 하며 관할 법원은 [협회 소재지 관할 법원]으로 합니다.
              </p>

              <h2>제16조 (운영자 정보 및 문의)</h2>
              <table className={styles.infoTable}>
                <tbody>
                  <tr>
                    <th style={{ width: '28%' }}>운영 주체</th>
                    <td>이탈리아음악협회</td>
                  </tr>
                  <tr>
                    <th>웹사이트</th>
                    <td>www.itmusic.or.kr</td>
                  </tr>
                  <tr>
                    <th>개인정보 보호책임자</th>
                    <td>선태영[서비스개발/운영팀]</td>
                  </tr>
                  <tr>
                    <th>문의</th>
                    <td>이메일: <a href="mailto:newseoul21c@naver.com">newseoul21c@naver.com</a></td>
                  </tr>
                </tbody>
              </table>

              <p className={styles.muted}>
                부칙) 본 약관은 2026년 1월 23일부터 시행합니다.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
