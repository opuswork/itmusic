'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import styles from './layout.module.css';

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isAdminLogin = pathname?.endsWith('/admin-login');

  if (isAdminLogin) {
    return <>{children}</>;
  }

  return (
    <div className={styles.wrapper}>
      <DashboardNavbar
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />
      <DashboardSidebar isOpen={sidebarOpen} />
      <div
        className={`${styles.contentWrapper} ${!sidebarOpen ? styles.contentWrapperSidebarCollapsed : ''}`}
      >
        {children}
      </div>
      <footer
        className={`${styles.mainFooter} ${!sidebarOpen ? styles.mainFooterSidebarCollapsed : ''}`}
      >
        <strong>Copyright &copy; 이탈리아음악협회.</strong> All rights reserved.
      </footer>
    </div>
  );
}
