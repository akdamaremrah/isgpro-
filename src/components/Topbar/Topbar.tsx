import React, { useState, useEffect, useRef } from 'react';
import MIcon from '../MIcon';
import { useNavigate } from 'react-router-dom';
import styles from './Topbar.module.css';
import { API_BASE } from '../../config/api';

interface TopbarProps {
    toggleSidebar: () => void;
}

interface SearchResult {
    id: string;
    type: string;
    title: string;
    sub: string;
    path: string;
}

interface Notification {
    icon: string;
    type: string;
    text: string;
    time: string;
}

const Topbar: React.FC<TopbarProps> = ({ toggleSidebar }) => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [allRead, setAllRead] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [searchData, setSearchData] = useState<SearchResult[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchForSearch = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/companies`);
                if (res.ok) {
                    const data = await res.json();
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const mapped: SearchResult[] = (data as any[]).map((c) => ({
                        id: String(c.id),
                        type: 'Firma',
                        title: c.unvan || '',
                        sub: c.sgkSicilNo || '',
                        path: `/companies/${c.id}`
                    }));
                    setSearchData(mapped);
                }
            } catch (_) { /* ignore */ }
        };
        fetchForSearch();
    }, []);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const res = await fetch(`${API_BASE}/api/notifications`);
                if (res.ok) {
                    const data = await res.json();
                    setNotifications(data);
                }
            } catch (_) { /* ignore */ }
        };
        fetchNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
                setIsNotifOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        }
        document.addEventListener("click", handleClickOutside, true);
        return () => document.removeEventListener("click", handleClickOutside, true);
    }, []);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setIsDropdownOpen(e.target.value.trim().length > 0);
    };

    const filteredResults = searchQuery.trim()
        ? searchData.filter(item =>
            item.title.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR')) ||
            item.sub.toLocaleLowerCase('tr-TR').includes(searchQuery.toLocaleLowerCase('tr-TR'))
        )
        : [];

    const handleResultClick = (path: string) => {
        navigate(path);
        setSearchQuery('');
        setIsDropdownOpen(false);
    };


    return (
        <header className={styles.topbar}>
            <button className={styles.hamburgerBtn} onClick={toggleSidebar} aria-label="Menü">
                <MIcon name="menu" size={22} />
            </button>
            <div className={styles.leftSection}>
                <div className={styles.searchContainer} ref={dropdownRef}>
                    <MIcon name="search" size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Firma, personel veya doküman ara..."
                        className={styles.searchInput}
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => searchQuery.trim().length > 0 && setIsDropdownOpen(true)}
                    />

                    {isDropdownOpen && (
                        <div className={styles.searchDropdown}>
                            {filteredResults.length > 0 ? (
                                <ul className={styles.resultList}>
                                    {filteredResults.map(res => (
                                        <li key={res.id} className={styles.resultItem} onClick={() => handleResultClick(res.path)}>
                                            <div className={styles.resultIcon}>
                                                {res.type === 'Firma' ? <MIcon name="business" size={16} /> : <MIcon name="group" size={16} />}
                                            </div>
                                            <div className={styles.resultInfo}>
                                                <span className={styles.resultTitle}>{res.title}</span>
                                                <span className={styles.resultSub}>{res.sub} ({res.type})</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className={styles.noResult}>Arama sonucu bulunamadı.</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.rightSection}>
                <div className={styles.notifWrapper} ref={notifRef}>
                    <button
                        className={`${styles.iconBtn} ${styles.notificationBtn}`}
                        aria-label="Bildirimler"
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                    >
                        <MIcon name="notifications" size={20} />
                        {!allRead && notifications.length > 0 && <span className={styles.badge}>{notifications.length > 9 ? '9+' : notifications.length}</span>}
                    </button>

                    {isNotifOpen && (
                        <div className={styles.notifDropdown}>
                            <div className={styles.notifHeader}>
                                <span className={styles.notifTitle}>Bildirimler ({notifications.length})</span>
                                <button className={styles.notifMarkAll} onClick={() => setAllRead(true)}>Tümünü Okundu İşaretle</button>
                            </div>
                            <ul className={styles.notifList}>
                                {notifications.length === 0 ? (
                                    <li className={styles.notifItem} style={{ justifyContent: 'center', color: 'var(--text-muted)' }}>
                                        Bildirim bulunmuyor
                                    </li>
                                ) : notifications.map((n, i) => (
                                    <li key={i} className={`${styles.notifItem} ${!allRead ? styles.notifUnread : ''}`}>
                                        <MIcon name={n.icon} size={18} className={
                                            n.type === 'danger' ? styles.notifIconWarn :
                                            n.type === 'warning' ? styles.notifIconWarning :
                                            styles.notifIconInfo
                                        } />
                                        <div className={styles.notifContent}>
                                            <span className={styles.notifText}>{n.text}</span>
                                            <span className={styles.notifTime}>{n.time}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className={styles.divider}></div>

                <div className={styles.userMenuWrapper} ref={userMenuRef}>
                    <button className={styles.profileBtn} onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                        <div className={styles.avatar}>
                            EA
                        </div>
                        <div className={styles.userInfo}>
                            <span className={styles.userName}>Emrah AKDAMAR</span>
                            <span className={styles.userRole}>İş Güvenliği Uzmanı (A)</span>
                        </div>
                        <MIcon name="expand_more" size={18} className={styles.chevron} />
                    </button>

                    {isUserMenuOpen && (
                        <div className={styles.userDropdown}>
                            <button className={styles.userMenuItem} onClick={() => { navigate('/settings'); setIsUserMenuOpen(false); }}>
                                <MIcon name="settings" size={18} />
                                <span>Ayarlar</span>
                            </button>
                            <div className={styles.userMenuDivider}></div>
                            <button className={styles.userMenuItem} onClick={() => setIsUserMenuOpen(false)}>
                                <MIcon name="logout" size={18} />
                                <span>Çıkış Yap</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
