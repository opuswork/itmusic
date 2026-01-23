import Header from '@/components/layout/Header';
import Nav from '@/components/layout/Nav';
import Slider from '@/components/layout/Slider';
import TabSection from '@/components/organisms/TabSection';
import Footer from '@/components/layout/Footer';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <Header />
      <Nav />
      <Slider />
      <TabSection />
      <div className={styles.spacer}></div>
      <Footer />
    </div>
  );
}
