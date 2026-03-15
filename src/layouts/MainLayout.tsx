import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar/Sidebar';
import Topbar from '../components/Topbar/Topbar';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className={styles.layoutContainer}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

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
