"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { http } from '@/lib/http/client';
import PosterSlider from '@/components/molecules/PosterSlider';
import styles from './TabSection.module.css';

// 날짜 포맷팅 함수 (0000년 00월 00일 형식)
const formatDate = (dateValue) => {
  if (!dateValue || (typeof dateValue === 'object' && Object.keys(dateValue).length === 0)) {
    return '';
  }
  try {
    const date = dateValue instanceof Date ? dateValue : new Date(dateValue);
    if (isNaN(date.getTime())) {
      return '';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}년 ${month}월 ${day}일`;
  } catch (error) {
    console.error('Error formatting date:', error, dateValue);
    return '';
  }
};

// 날짜 범위 포맷팅 함수
const formatDateRange = (startDate, endDate) => {
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (!start && !end) return '';
  if (start === end) return start;
  return `${start} - ${end}`;
};

// 모달 컴포넌트
function DetailModal({ isOpen, onClose, data, type }) {
  if (!isOpen || !data) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalCloseButton} onClick={onClose}>
          [닫기]
        </button>
        <div className={styles.modalHeader}>
          <h2>
            {type === 'notice' && '공지사항'}
            {type === 'masterclass' && '마스터클래스/협회원연주'}
            {type === 'concert' && '공연소식'}
            {type === 'competition' && '콩쿠르'}
          </h2>
        </div>
        <div className={styles.modalBody}>
          {type === 'notice' && (
            <>
              <h3>{data.subject || '-'}</h3>
              <p className={styles.modalDate}>작성일: {formatDate(data.reg_date)}</p>
              {data.content && (
                <div
                  className={styles.modalContentText}
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              )}
            </>
          )}
          {type === 'masterclass' && (
            <>
              <h3>{data.subject || '-'}</h3>
              {data.text && (
                <div
                  className={styles.modalContentText}
                  dangerouslySetInnerHTML={{ __html: data.text }}
                />
              )}
              {data.link && (
                <div className={styles.modalLink}>
                  <a href={data.link} target="_blank" rel="noopener noreferrer" className={styles.videoLink}>
                    영상 보기
                  </a>
                </div>
              )}
            </>
          )}
          {(type === 'concert' || type === 'competition') && (
            <>
              <h3>{data.subject || '-'}</h3>
              <div className={styles.modalInfoTable}>
                <table className={styles.detailTable}>
                  <tbody>
                    <tr>
                      <th>일시</th>
                      <td>{formatDateRange(data.event_start_date, data.event_end_date)}</td>
                    </tr>
                    <tr>
                      <th>장소</th>
                      <td>{data.location || '-'}</td>
                    </tr>
                    {type === 'concert' && (
                      <>
                        <tr>
                          <th>주관</th>
                          <td>{data.operator || '-'}</td>
                        </tr>
                        <tr>
                          <th>주최</th>
                          <td>{data.planner || '-'}</td>
                        </tr>
                      </>
                    )}
                    {type === 'competition' && (
                      <tr>
                        <th>주최</th>
                        <td>{data.planner || '-'}</td>
                      </tr>
                    )}
                    <tr>
                      <th>후원</th>
                      <td>{data.supporter || data.planner || '-'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              {data.content && (
                <div
                  className={styles.modalContentText}
                  dangerouslySetInnerHTML={{ __html: data.content }}
                />
              )}
              {data.file_name1 && (
                <div className={styles.modalImageContainer}>
                  <Image
                    src={`/assets/${type === 'concert' ? 'poster' : 'competition'}/${data.file_name1}`}
                    alt={data.subject || '이미지'}
                    width={800}
                    height={1200}
                    className={styles.modalFullImage}
                    unoptimized
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// 첫 번째 박스: 공지사항 + 마스터클래스/협회원연주
function NoticeMasterclassBox() {
  const [activeTab, setActiveTab] = useState('notice');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [notices, setNotices] = useState([]);
  const [masterclasses, setMasterclasses] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState({ notice: false, masterclass: false });

  useEffect(() => {
    if (activeTab === 'notice' && notices.length === 0) {
      setLoading(prev => ({ ...prev, notice: true }));
      http.get('/notices', { params: { skip: 0, take: 6 } })
        .then(response => {
          if (response.data.success) {
            setNotices(response.data.data);
          }
        })
        .catch(error => console.error('Error loading notices:', error))
        .finally(() => setLoading(prev => ({ ...prev, notice: false })));
    }
    if (activeTab === 'masterclass' && masterclasses.length === 0) {
      setLoading(prev => ({ ...prev, masterclass: true }));
      http.get('/videos', { params: { skip: 0, take: 6 } })
        .then(response => {
          if (response.data.success) {
            setMasterclasses(response.data.data);
          }
        })
        .catch(error => console.error('Error loading masterclasses:', error))
        .finally(() => setLoading(prev => ({ ...prev, masterclass: false })));
    }
  }, [activeTab, notices.length, masterclasses.length]);

  const handleItemClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setIsModalOpen(true);
  };

  const renderNoticeTab = () => (
    <div className={styles.tabContent}>
      {loading.notice ? (
        <div className={styles.loadingText}>로딩 중...</div>
      ) : notices.length === 0 ? (
        <div className={styles.emptyText}>공지사항이 없습니다.</div>
      ) : (
        notices.map((notice, index) => (
          <div
            key={notice.num}
            className={`${styles.listItem} ${hoveredItem === `notice-${index}` ? styles.hovered : ''}`}
            onMouseEnter={() => setHoveredItem(`notice-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleItemClick(notice, 'notice')}
          >
            {formatDate(notice.reg_date)} {notice.subject}
          </div>
        ))
      )}
    </div>
  );

  const renderMasterclassTab = () => (
    <div className={styles.tabContent}>
      {loading.masterclass ? (
        <div className={styles.loadingText}>로딩 중...</div>
      ) : masterclasses.length === 0 ? (
        <div className={styles.emptyText}>마스터클래스/협회원연주 정보가 없습니다.</div>
      ) : (
        masterclasses.map((masterclass, index) => (
          <div
            key={masterclass.num}
            className={`${styles.listItem} ${hoveredItem === `masterclass-${index}` ? styles.hovered : ''}`}
            onMouseEnter={() => setHoveredItem(`masterclass-${index}`)}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={() => handleItemClick(masterclass, 'masterclass')}
          >
            {masterclass.subject}
          </div>
        ))
      )}
    </div>
  );

  return (
    <>
      <div className={styles.tabBox}>
        <div className={`${styles.tabButtons} ${styles.redTabButtons}`}>
          <button
            className={`${styles.tabButton} ${activeTab === 'notice' ? styles.activeRed : ''}`}
            onClick={() => setActiveTab('notice')}
          >
            공지사항
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'masterclass' ? styles.activeRed : ''}`}
            onClick={() => setActiveTab('masterclass')}
          >
            마스터클래스/협회원연주
          </button>
        </div>
        <div className={styles.tabPanel}>
          {activeTab === 'notice' && renderNoticeTab()}
          {activeTab === 'masterclass' && renderMasterclassTab()}
        </div>
      </div>
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        type={selectedItem?.type}
      />
    </>
  );
}

// 두 번째 박스: 공연소식 + 콩쿠르
function ConcertCompetitionBox() {
  const [activeTab, setActiveTab] = useState('concert');
  const [concerts, setConcerts] = useState([]);
  const [competitions, setCompetitions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState({ concert: false, competition: false });
  const [currentConcertIndex, setCurrentConcertIndex] = useState(0);
  const [currentCompetitionIndex, setCurrentCompetitionIndex] = useState(0);

  useEffect(() => {
    if (activeTab === 'concert' && concerts.length === 0) {
      setLoading(prev => ({ ...prev, concert: true }));
      http.get('/concerts', { params: { skip: 0, take: 10 } })
        .then(response => {
          if (response.data.success) {
            setConcerts(response.data.data);
          }
        })
        .catch(error => console.error('Error loading concerts:', error))
        .finally(() => setLoading(prev => ({ ...prev, concert: false })));
    }
    if (activeTab === 'competition' && competitions.length === 0) {
      setLoading(prev => ({ ...prev, competition: true }));
      http.get('/competitions', { params: { skip: 0, take: 10 } })
        .then(response => {
          if (response.data.success) {
            setCompetitions(response.data.data);
          }
        })
        .catch(error => console.error('Error loading competitions:', error))
        .finally(() => setLoading(prev => ({ ...prev, competition: false })));
    }
  }, [activeTab, concerts.length, competitions.length]);

  // 탭 변경 시 인덱스 리셋
  useEffect(() => {
    setCurrentConcertIndex(0);
    setCurrentCompetitionIndex(0);
  }, [activeTab]);

  const handleDetailClick = (item, type) => {
    setSelectedItem({ ...item, type });
    setIsModalOpen(true);
  };

  const renderConcertTab = () => {
    if (loading.concert) {
      return <div className={styles.loadingText}>로딩 중...</div>;
    }
    if (concerts.length === 0) {
      return <div className={styles.emptyText}>공연소식이 없습니다.</div>;
    }
    
    const currentConcert = concerts[currentConcertIndex];
    const imageUrl = currentConcert.file_name1
      ? `/assets/poster/${currentConcert.file_name1}`
      : null;

    return (
      <div className={styles.tabContent}>
        <div className={styles.concertContainer}>
          <div className={styles.concertImage}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={currentConcert.subject || '공연소식'}
                width={300}
                height={400}
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            ) : (
              <div className={styles.imagePlaceholder}>이미지 없음</div>
            )}
          </div>
          <div className={styles.concertInfo}>
            <h3 className={styles.concertTitle}>{currentConcert.subject || '-'}</h3>
            <div className={styles.concertDetails}>
              <p>일시: {formatDateRange(currentConcert.event_start_date, currentConcert.event_end_date) || '-'}</p>
              <p>장소: {currentConcert.location || '-'}</p>
              <p>주관: {currentConcert.operator || '-'}</p>
              <p>주최: {currentConcert.planner || '-'}</p>
              <p>후원: {currentConcert.supporter || currentConcert.planner || '-'}</p>
            </div>
            <button
              className={styles.detailBtn}
              onClick={() => handleDetailClick(currentConcert, 'concert')}
            >
              자세히 보기
            </button>
            {concerts.length > 1 && (
              <div className={styles.slideDots}>
                {concerts.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentConcertIndex ? styles.active : ''}`}
                    onClick={() => setCurrentConcertIndex(index)}
                    aria-label={`슬라이드 ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderCompetitionTab = () => {
    if (loading.competition) {
      return <div className={styles.loadingText}>로딩 중...</div>;
    }
    if (competitions.length === 0) {
      return <div className={styles.emptyText}>콩쿠르 정보가 없습니다.</div>;
    }
    
    const currentCompetition = competitions[currentCompetitionIndex];
    const imageUrl = currentCompetition.file_name1
      ? `/assets/competition/${currentCompetition.file_name1}`
      : null;

    return (
      <div className={styles.tabContent}>
        <div className={styles.concertContainer}>
          <div className={styles.concertImage}>
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={currentCompetition.subject || '콩쿠르'}
                width={300}
                height={400}
                style={{ objectFit: 'cover' }}
                unoptimized
              />
            ) : (
              <div className={styles.imagePlaceholder}>이미지 없음</div>
            )}
          </div>
          <div className={styles.concertInfo}>
            <h3 className={styles.concertTitle}>{currentCompetition.subject || '-'}</h3>
            <div className={styles.concertDetails}>
              <p>일시: {formatDateRange(currentCompetition.event_start_date, currentCompetition.event_end_date) || '-'}</p>
              <p>장소: {currentCompetition.location || '-'}</p>
              <p>주최: {currentCompetition.planner || '-'}</p>
              <p>후원: {currentCompetition.supporter || currentCompetition.planner || '-'}</p>
            </div>
            <button
              className={styles.detailBtn}
              onClick={() => handleDetailClick(currentCompetition, 'competition')}
            >
              자세히 보기
            </button>
            {competitions.length > 1 && (
              <div className={styles.slideDots}>
                {competitions.map((_, index) => (
                  <button
                    key={index}
                    className={`${styles.dot} ${index === currentCompetitionIndex ? styles.active : ''}`}
                    onClick={() => setCurrentCompetitionIndex(index)}
                    aria-label={`슬라이드 ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={styles.tabBox}>
        <div className={`${styles.tabButtons} ${styles.blueTabButtons}`}>
          <button
            className={`${styles.tabButton} ${activeTab === 'concert' ? styles.activeBlue : ''}`}
            onClick={() => setActiveTab('concert')}
          >
            공연소식
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === 'competition' ? styles.activeBlue : ''}`}
            onClick={() => setActiveTab('competition')}
          >
            콩쿠르
          </button>
        </div>
        <div className={styles.tabPanel}>
          {activeTab === 'concert' && renderConcertTab()}
          {activeTab === 'competition' && renderCompetitionTab()}
        </div>
      </div>
      <DetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedItem(null);
        }}
        data={selectedItem}
        type={selectedItem?.type}
      />
    </>
  );
}

export default function TabSection() {
  return (
    <div className={styles.tabSection}>
      <NoticeMasterclassBox />
      <ConcertCompetitionBox />
    </div>
  );
}
