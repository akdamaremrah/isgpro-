import React from 'react';
import { NavLink } from 'react-router-dom';
import MIcon from '../MIcon';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const menuItems = [
        { title: 'Ana Sayfa', icon: <MIcon name="dashboard" size={20} />, path: '/dashboard' },
        { title: 'Firmalar', icon: <MIcon name="business" size={20} />, path: '/companies' },
        { title: 'Raporlar & İstatistikler', icon: <MIcon name="analytics" size={20} />, path: '/reports' },
        { title: 'Doküman Arşivi', icon: <MIcon name="inventory_2" size={20} />, path: '/documents' },
        { title: 'Mevzuat Kütüphanesi', icon: <MIcon name="auto_stories" size={20} />, path: '/legislation' },
        { title: 'Kullanıcı İşlemleri', icon: <MIcon name="group" size={20} />, path: '/users' },
    ];

    return (
        <>
            <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.collapsed}`}>
                <div className={styles.logoSection}>
                    <div
                        className={styles.logoIcon}
                        onClick={!isOpen ? toggleSidebar : undefined}
                        style={!isOpen ? { cursor: 'pointer' } : undefined}
                        title={!isOpen ? 'Menüyü Genişlet' : undefined}
                    >
                        <svg width="28" height="28" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.logoSvg}>
                            <defs>
                                <linearGradient id="hex-grad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#00f0ff" />
                                    <stop offset="50%" stopColor="#818cf8" />
                                    <stop offset="100%" stopColor="#c084fc" />
                                </linearGradient>
                                <linearGradient id="inner-grad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.6" />
                                    <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
                                </linearGradient>
                                <filter id="neon-glow">
                                    <feGaussianBlur stdDeviation="3" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>
                            {/* Outer hexagon */}
                            <polygon points="50,2 93,27 93,73 50,98 7,73 7,27" fill="none" stroke="url(#hex-grad)" strokeWidth="3" filter="url(#neon-glow)" />
                            {/* Inner hexagon */}
                            <polygon points="50,18 78,35 78,65 50,82 22,65 22,35" fill="url(#inner-grad)" stroke="url(#hex-grad)" strokeWidth="1.5" opacity="0.7" />
                            {/* Center diamond */}
                            <polygon points="50,30 65,50 50,70 35,50" fill="url(#hex-grad)" opacity="0.9" filter="url(#neon-glow)" />
                            {/* Cross lines */}
                            <line x1="50" y1="2" x2="50" y2="98" stroke="url(#hex-grad)" strokeWidth="0.8" opacity="0.3" />
                            <line x1="7" y1="50" x2="93" y2="50" stroke="url(#hex-grad)" strokeWidth="0.8" opacity="0.3" />
                        </svg>
                        <div className={styles.logoFlash}></div>
                        <div className={styles.logoPulse}></div>
                    </div>
                    <div className={`${styles.logoTextWrap} ${!isOpen ? styles.hidden : ''}`}>
                        <span className={styles.logoText}>
                            <span className={styles.logoLetters}>İSG</span>
                            <span className={styles.logoGradient}>Pro</span><span className={styles.logoPlus}>+</span>
                        </span>
                    </div>
                    {isOpen && (
                        <button
                            className={styles.collapseBtn}
                            onClick={toggleSidebar}
                            title="Menüyü Daralt"
                        >
                            <MIcon name="chevron_left" size={22} />
                        </button>
                    )}
                    {!isOpen && (
                        <button
                            className={styles.collapseBtn}
                            onClick={toggleSidebar}
                            title="Menüyü Genişlet"
                        >
                            <MIcon name="chevron_right" size={22} />
                        </button>
                    )}
                </div>

                <div className={styles.menuContainer}>
                    <p className={`${styles.menuLabel} ${!isOpen ? styles.hidden : ''}`}>ANA MENÜ</p>
                    <nav className={styles.navMenu}>
                        {menuItems.map((item, index) => (
                            <NavLink
                                key={index}
                                to={item.path}
                                className={({ isActive }) =>
                                    `${styles.navItem} ${isActive && item.path !== '/' ? styles.active : ''}`
                                }
                                title={!isOpen ? item.title : ''}
                            >
                                <div className={styles.iconWrapper}>{item.icon}</div>
                                <span className={`${styles.navText} ${!isOpen ? styles.hidden : ''}`}>
                                    {item.title}
                                </span>
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className={styles.bottomSection}>
                    {/* Gelecekte eklenecek alt butonlar, çıkış yap vb. */}
                    <NavLink
                        to="/settings"
                        className={styles.navItem}
                        title={!isOpen ? "Ayarlar" : ''}
                    >
                        <div className={styles.iconWrapper}><MIcon name="settings" size={20} /></div>
                        <span className={`${styles.navText} ${!isOpen ? styles.hidden : ''}`}>
                            Ayarlar
                        </span>
                    </NavLink>
                </div>
            </div>

            {/* Mobil Görünüm için Overlay (Opsiyonel Geliştirme için şimdilik boş) */}
        </>
    );
};

export default Sidebar;
