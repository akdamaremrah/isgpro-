import React, { useState, useMemo } from 'react';
import MIcon from '../../components/MIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { legislationData } from '../../data/legislationData';
import type { Regulation } from '../../data/legislationData';
import styles from './Legislation.module.css';

const Legislation: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Hepsi');
    const [viewingRegulation, setViewingRegulation] = useState<Regulation | null>(null);

    const categories = useMemo(() => {
        const cats = new Set(legislationData.map(reg => reg.category));
        return ['Hepsi', ...Array.from(cats)].sort((a, b) => a.localeCompare(b, 'tr-TR'));
    }, []);

    const filteredLegislation = useMemo(() => {
        return legislationData
            .filter(reg => {
                const matchesSearch = reg.title.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR'));
                const matchesCategory = selectedCategory === 'Hepsi' || reg.category === selectedCategory;
                return matchesSearch && matchesCategory;
            })
            .sort((a, b) => a.title.localeCompare(b.title, 'tr-TR'));
    }, [searchTerm, selectedCategory]);

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerTitle}>
                    <h1>Mevzuat Kütüphanesi</h1>
                    <p>Güncel İSG Kanun, Yönetmelik ve Tebliğ Arşivi</p>
                </div>
                <div className={styles.libraryBadge}>
                    <MIcon name="local_library" size={20} />
                    <span>{legislationData.length} Doküman</span>
                </div>
            </header>

            <div className={styles.controlsBar}>
                <div className={styles.searchWrapper}>
                    <MIcon name="search" className={styles.searchIcon} size={20} />
                    <input 
                        type="text" 
                        placeholder="Yönetmelik ismi ile ara..." 
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className={styles.categories}>
                    {categories.map(cat => (
                        <button 
                            key={cat}
                            className={`${styles.categoryBtn} ${selectedCategory === cat ? styles.activeCategory : ''}`}
                            onClick={() => setSelectedCategory(cat)}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.grid}>
                <AnimatePresence mode='popLayout'>
                    {filteredLegislation.length > 0 ? (
                        filteredLegislation.map((reg) => (
                            <motion.div 
                                key={reg.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className={styles.card}
                            >
                                <div className={styles.cardHeader}>
                                    <div className={styles.categoryTag}>{reg.category}</div>
                                    <MIcon name="auto_stories" className={styles.cardIcon} size={20} />
                                </div>
                                <h3 className={styles.cardTitle}>{reg.title}</h3>
                                <div className={styles.cardActions}>
                                    {reg.content && (
                                        <button 
                                            className={styles.readBtn}
                                            onClick={() => setViewingRegulation(reg)}
                                        >
                                            <MIcon name="description" size={16} />
                                            <span>İçeriği Oku</span>
                                        </button>
                                    )}
                                    <div className={styles.linksGroup}>
                                        {reg.mbs_link && (
                                            <a href={reg.mbs_link} target="_blank" rel="noreferrer" title="Resmi Gazete (MBS)">
                                                <MIcon name="open_in_new" size={18} />
                                            </a>
                                        )}
                                        {reg.local_link && (
                                            <a href={reg.local_link} target="_blank" rel="noreferrer" title="Bilgit Yerel Arşiv">
                                                <MIcon name="download" size={18} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.emptyState}
                        >
                            <MIcon name="search_off" size={48} />
                            <p>Aradığınız kriterlere uygun yönetmelik bulunamadı.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Content Viewer Modal */}
            <AnimatePresence>
                {viewingRegulation && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setViewingRegulation(null)}
                    >
                        <motion.div 
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.modalHeader}>
                                <h2>{viewingRegulation.title}</h2>
                                <button className={styles.closeBtn} onClick={() => setViewingRegulation(null)}>&times;</button>
                            </div>
                            <div className={styles.modalBody}>
                                <pre className={styles.contentArea}>
                                    {viewingRegulation.content}
                                </pre>
                            </div>
                            <div className={styles.modalFooter}>
                                <p className="text-muted text-sm">Not: Yukarıdaki metin özet/kritik maddeleri içermektedir. Tam metin için MBS linkini kullanın.</p>
                                <div className={styles.modalActions}>
                                    <a href={viewingRegulation.mbs_link} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                        <MIcon name="open_in_new" size={16} />
                                        MBS'de Görüntüle
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Legislation;
