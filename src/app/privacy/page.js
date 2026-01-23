"use client";

import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import MembershipSidebar from '@/components/layout/MembershipSidebar';
import SubHeader from '@/components/layout/SubHeader';
import Footer from '@/components/layout/Footer';
import { useState, useEffect } from 'react';
import styles from './page.module.css';

export default function PrivacyPage() {
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
            <SubHeader title="개인정보처리방침" />
          </div>
          <main className={styles.mainContent}>
            <div className={styles.content}>
              <div className={styles.headerSection}>
                <h1>개인정보처리방침</h1>
                <p className={styles.muted} style={{ margin: '8px 0 0' }}>
                  이탈리아음악협회(이하 &quot;협회&quot;)는 관련 법령을 준수하며 회원의 개인정보를 안전하게 처리합니다.
                </p>
              </div>

              <div className={styles.box}>
                <p style={{ margin: 0 }}>
                  <strong>시행일:</strong> 2026-01-23 &nbsp;|&nbsp;
                  <strong>최종 개정일:</strong> 2026-01-23
                </p>
              </div>

              <h2>1. 개인정보의 처리 목적</h2>
              <p>협회는 다음 목적을 위해 최소한의 개인정보를 처리합니다.</p>
              <ul>
                <li>회원 식별 및 소셜 로그인 기반 서비스 제공(자동가입 포함)</li>
                <li>연회비(멤버십 fee) 납부 확인, 회원 자격 관리 및 안내</li>
                <li>정기연주회/행사 운영(참여 안내, 공지 전달)</li>
                <li>문의/민원 처리 및 공지사항 전달</li>
                <li>서비스 보안 및 부정 이용 방지, 분쟁 대응</li>
              </ul>

              <h2>2. 처리하는 개인정보의 항목</h2>
              <div className={styles.box}>
                <p style={{ margin: 0 }}>
                  <strong>중요:</strong> 협회는 일반 회원가입(아이디/비밀번호 방식)을 제공하지 않으며,
                  <strong>소셜 미디어 로그인</strong>을 통해서만 회원 가입/로그인이 가능합니다.
                </p>
              </div>

              <h3>2-1) 소셜 로그인 시 회원 DB에 저장하는 항목(필수)</h3>
              <p>
                협회는 회원이 소셜 로그인 과정에서 <strong>사용자 동의(User Consent Agreement)</strong>로
                <strong>필수 동의</strong>한 항목에 한하여 아래 정보를 회원 데이터베이스에 저장합니다.
              </p>
              <ul>
                <li><strong>이름</strong></li>
                <li><strong>이메일</strong></li>
                <li><strong>전화번호</strong></li>
              </ul>

              <h3>2-2) 추가 정보의 수집/저장 제한(명시)</h3>
              <p>
                협회는 위 3개 항목(이름, 이메일, 전화번호) 외의 어떠한 개인정보도&nbsp;
                <strong>회원의 사전 동의 없이</strong> 회원 데이터베이스에 저장하지 않습니다.
                목적상 추가 정보가 필요한 경우, 협회는 <strong>사전에 수집 항목·목적·보유기간</strong>을 고지하고 동의를 받습니다.
              </p>
              <p className={styles.muted}>
                ※ 협회의 개인정보 처리에 위법 또는 약관/정책 위반 소지가 있는 행위(무단 수집·이용·유출 등)가 확인될 경우,
                협회는 관련 법령에 근거하여 서비스 이용 제한, 통지, 수사기관 신고 등 필요한 조치를 취할 수 있습니다.
              </p>

              <h3>2-3) 자동 수집 정보(로그/보안)</h3>
              <p>
                서비스 안정성과 보안, 부정 이용 방지를 위해 접속 기록이 자동 생성·수집될 수 있습니다.
              </p>
              <ul>
                <li>IP 주소, 접속 일시, 기기/브라우저 정보, 이용 기록, 오류 로그 등</li>
              </ul>

              <h3>2-4) 회원이 업로드하는 콘텐츠(연주 영상 등)</h3>
              <p>
                회원이 서비스에 업로드하는 연주 영상/이미지/글 등에는 <strong>개인정보(초상, 음성 등)가 포함될 수 있으며</strong>,
                협회는 회원이 설정한 공개 범위 및 서비스 정책에 따라 회원 전용으로 제공할 수 있습니다.
              </p>

              <h2>3. 개인정보의 처리 및 보유 기간</h2>
              <p>협회는 원칙적으로 개인정보 처리 목적이 달성되면 지체 없이 파기합니다. 다만 다음의 보유 기간을 적용합니다.</p>
              <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th style={{ width: '28%' }}>구분</th>
                    <th>보유 기간</th>
                    <th>보유 사유</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>회원 정보(이름/이메일/전화번호)</td>
                    <td>
                      회원 탈퇴 시점부터 <strong>90일</strong> 보관 후 파기
                    </td>
                    <td>재가입 편의 제공, 부정 이용 방지 및 분쟁 대응</td>
                  </tr>
                  <tr>
                    <td>문의/민원 처리 기록</td>
                    <td>1년 또는 목적 달성 시까지</td>
                    <td>고객 응대 및 분쟁 대응</td>
                  </tr>
                  <tr>
                    <td>연회비 결제/정산 관련 기록(해당 시)</td>
                    <td>관련 법령 또는 내부 정책에 따른 기간</td>
                    <td>회계 처리, 분쟁 대응, 법정 보관 의무 이행</td>
                  </tr>
                  <tr>
                    <td>접속 기록(보안 로그)</td>
                    <td>3개월~12개월</td>
                    <td>보안, 부정 이용 방지, 서비스 안정성 확보</td>
                  </tr>
                </tbody>
              </table>

              <h2>4. 개인정보의 제3자 제공</h2>
              <p>협회는 원칙적으로 회원의 개인정보를 제3자에게 제공하지 않습니다. 다만, 회원의 사전 동의가 있거나 관련 법령에 근거한 경우에 한하여 제공할 수 있습니다.</p>
              <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th>제공받는 자</th>
                    <th>제공 목적</th>
                    <th>제공 항목</th>
                    <th>보유/이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>해당 없음</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>

              <h2>5. 개인정보 처리의 위탁</h2>
              <p>
                협회는 원활한 서비스 제공을 위해 개인정보 처리 업무를 위탁할 수 있으며,
                위탁 시 관련 법령에 따라 수탁자를 관리·감독하고, 위탁 사실을 공개합니다.
              </p>
              <table className={styles.infoTable}>
                <thead>
                  <tr>
                    <th>수탁업체</th>
                    <th>위탁 업무</th>
                    <th>보유/이용 기간</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Render / 호스팅 제공사</td>
                    <td>서비스 인프라(서버 운영)</td>
                    <td>위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>데이터베이스/스토리지 제공사</td>
                    <td>데이터 저장 및 백업</td>
                    <td>위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>결제대행사(PG) - 연회비 결제 시</td>
                    <td>결제 처리</td>
                    <td>위탁 계약 종료 시까지</td>
                  </tr>
                  <tr>
                    <td>소셜 로그인 제공자(구글/카카오/네이버 등)</td>
                    <td>인증(로그인) 제공</td>
                    <td>각 제공자 정책에 따름</td>
                  </tr>
                </tbody>
              </table>

              <h2>6. 정보주체의 권리·의무 및 행사 방법</h2>
              <p>회원은 관련 법령에 따라 다음 권리를 행사할 수 있습니다.</p>
              <ul>
                <li>개인정보 열람 요구</li>
                <li>개인정보 정정·삭제 요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>동의 철회 및 회원 탈퇴</li>
              </ul>
              <p>
                권리 행사는 아래 &quot;개인정보 보호책임자&quot;에게 이메일로 요청할 수 있으며,
                협회는 지체 없이 조치하겠습니다.
              </p>

              <h2>7. 개인정보의 파기 절차 및 방법</h2>
              <ul>
                <li><strong>파기 절차:</strong> 보유기간 경과 또는 처리 목적 달성 시 내부 방침에 따라 파기</li>
                <li><strong>파기 방법:</strong> 전자적 파일은 복구 불가능한 방식으로 삭제, 출력물은 분쇄 또는 소각</li>
              </ul>

              <h2>8. 개인정보의 안전성 확보 조치</h2>
              <p>협회는 개인정보의 안전성 확보를 위해 다음 조치를 취합니다.</p>
              <ul>
                <li>접근 권한 최소화 및 관리자 계정 보호(강력한 비밀번호/2FA 등)</li>
                <li>SSL/TLS 적용 등 전송구간 암호화</li>
                <li>서버/DB 접근 통제, 로그 모니터링</li>
                <li>정기 백업 및 복구 절차 운영</li>
                <li>취약점 점검 및 보안 업데이트 적용</li>
              </ul>

              <h2>9. 쿠키(Cookie) 및 유사 기술의 사용</h2>
              <p>
                협회는 로그인 유지 및 보안 등을 위해 쿠키 또는 유사 기술을 사용할 수 있습니다.
                회원은 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.
                다만 쿠키 거부 시 로그인 유지 등 일부 기능이 제한될 수 있습니다.
              </p>

              <h2>10. 개인정보 보호책임자 및 문의처</h2>
              <table className={styles.infoTable}>
                <tbody>
                  <tr>
                    <th style={{ width: '28%' }}>개인정보 보호책임자</th>
                    <td>선태영[서비스개발,운영팀]</td>
                  </tr>
                  <tr>
                    <th>이메일</th>
                    <td><a href="mailto:newseoul21c@naver.com">newseoul21c@naver.com</a></td>
                  </tr>
                </tbody>
              </table>

              <h2>11. 고지 의무 및 처리방침 변경</h2>
              <p>
                본 개인정보처리방침의 내용 추가·삭제·수정이 있을 경우,
                협회는 변경 사항의 시행일 및 변경 내용을 웹사이트 공지사항(또는 별도 안내)으로 고지합니다.
              </p>

              <p className={styles.muted}>
                부칙) 본 방침은 2026년 1월 26일부터 시행합니다.
              </p>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
