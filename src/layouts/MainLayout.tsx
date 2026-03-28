import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
    const isMobile = () => window.innerWidth < 768;
    const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile());

    const toggleSidebar = () => setIsSidebarOpen(prev => !prev);
    const closeSidebar = () => { if (isMobile()) setIsSidebarOpen(false); };

    return (
        <div className={styles.layoutContainer}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} onNavClick={closeSidebar} />

            <div className={`${styles.mainWrapper} ${!isSidebarOpen ? styles.mainWrapperCollapsed : ''}`}>
                <Topbar toggleSidebar={toggleSidebar} />

                <main className={styles.contentArea}>
                    <div className={styles.contentContainer}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
