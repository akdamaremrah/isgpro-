import React from 'react';
import MIcon from '../../../components/MIcon';
import styles from './PlansTab.module.css';

interface DocumentPlan {
    id: string;
    name: string;
    category: 'Yıllık Çalışma Planı' | 'Yıllık Eğitim Planı' | 'Yıllık Değerlendirme Raporu';
    uploadDate: string;
    revizyonNo: string;
    sonrakiRevizyonTarihi: string;
    durum: 'Gecerli' | 'Yaklasiyor' | 'Gecikmis';
}

const MOCK_DOCS: DocumentPlan[] = [
    { id: '1', name: 'Yıllık_Calisma_Plani_2024.pdf', category: 'Yıllık Çalışma Planı', uploadDate: '2024-01-10', revizyonNo: 'Rev-00', sonrakiRevizyonTarihi: '2025-01-10', durum: 'Gecerli' },
    { id: '2', name: 'Yıllık_Egitim_Plani_2024.pdf', category: 'Yıllık Eğitim Planı', uploadDate: '2024-01-15', revizyonNo: 'Rev-00', sonrakiRevizyonTarihi: '2025-01-15', durum: 'Gecerli' },
    { id: '3', name: 'Yıllık_Degerlendirme_Raporu_2023.pdf', category: 'Yıllık Değerlendirme Raporu', uploadDate: '2024-01-05', revizyonNo: 'Rev-00', sonrakiRevizyonTarihi: '2025-01-05', durum: 'Gecerli' },
];

const PlansTab: React.FC = () => {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h2 className={styles.title}>Yıllık Planlar ve Raporlar</h2>
                    <p className={styles.subtitle}>Firmanın temel İSG doküman arşivini ve revizyon durumlarını takip edin.</p>
                </div>
                <button className={styles.uploadBtn}>
                    <MIcon name="cloud_upload" size={18} /> Yeni Doküman Yükle
                </button>
            </div>

            {MOCK_DOCS.some(d => d.durum === 'Gecikmis' || d.durum === 'Yaklasiyor') && (
                <div className={styles.alertBanner}>
                    <strong>Dikkat:</strong> Revizyon tarihi gelen veya yaklaşan dokümanlar bulunmaktadır. Lütfen güncelleyiniz.
                </div>
            )}

            <div className={styles.grid}>
                {MOCK_DOCS.map(doc => (
                    <div key={doc.id} className={styles.docCard}>
                        <div className={styles.cardTop}>
                            <div className={styles.iconWrapper}>
                                <MIcon name="description" size={24} className={styles.fileIcon} />
                            </div>
                            <div className={styles.actions}>
                                <span className={`${styles.statusBadge} ${doc.durum === 'Gecerli' ? styles.badgeSuccess :
                                    doc.durum === 'Yaklasiyor' ? styles.badgeWarning : styles.badgeDanger
                                    }`}>
                                    {doc.durum === 'Gecerli' ? 'Geçerli' :
                                        doc.durum === 'Yaklasiyor' ? 'Revizyon Yaklaştı' : 'Revizyon Gerekli'}
                                </span>
                                <button className={styles.menuBtn}><MIcon name="more_vert" size={16} /></button>
                            </div>
                        </div>

                        <div className={styles.cardMid}>
                            <h3 className={styles.docName}>{doc.name}</h3>
                            <p className={styles.categoryName}>{doc.category}</p>
                        </div>

                        <div className={styles.cardBottom}>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Yüklenme:</span>
                                <span className={styles.infoValue}>{new Date(doc.uploadDate).toLocaleDateString()}</span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Geçerlilik/Sonrakı Rev:</span>
                                <span className={`${styles.infoValue} ${doc.durum !== 'Gecerli' ? styles.textDanger : ''}`}>
                                    {new Date(doc.sonrakiRevizyonTarihi).toLocaleDateString()}
                                </span>
                            </div>
                            <div className={styles.infoRow}>
                                <span className={styles.infoLabel}>Revizyon:</span>
                                <span className={styles.infoValue}>{doc.revizyonNo}</span>
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <button className={styles.btnIconText}><MIcon name="download" size={14} /> İndir</button>
                            <button className={styles.btnIconText}><MIcon name="history" size={14} /> Geçmiş</button>
                            <button className={styles.btnIconTextPrimary}><MIcon name="add" size={14} /> Yeni Revizyon</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PlansTab;
