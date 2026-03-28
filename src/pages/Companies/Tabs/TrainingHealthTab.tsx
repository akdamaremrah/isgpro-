import React, { useState, useMemo, useEffect, useRef } from 'react';
import MIcon from '../../../components/MIcon';
import { motion } from 'framer-motion';
import { API_BASE } from '../../../config/api';
import { apiFetch } from '../../../api/client';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import styles from './TrainingHealthTab.module.css';
import { usePersonnelList } from '../../../hooks/usePersonnel';
import { useScrollLock } from '../../../hooks/useScrollLock';
import { useQueryClient } from '@tanstack/react-query';

interface TrainingTabProps {
    companyId: string;
}

type FilterMode = 'all' | 'missing' | 'expired' | 'nearExpiry' | 'valid';

interface TrainingDoc {
    id: number;
    docType: string;
    docTypeKey: string;
    originalFilename: string;
    uploadedAt: string | null;
    year: number;
}

interface DocFileListProps {
    docs: TrainingDoc[];
    onDelete: (id: number) => void;
    getFileIcon: (filename: string) => string;
    isViewable: (filename: string) => boolean;
    styles: Record<string, string>;
}

const DocFileList: React.FC<DocFileListProps> = ({ docs, onDelete, getFileIcon, isViewable, styles }) => {
    if (docs.length === 0) return <p className={styles.docEmpty}>Henüz belge yüklenmedi.</p>;
    const years = [...new Set(docs.map(d => d.year))].sort((a, b) => b - a);
    return (
        <div className={styles.docFileList}>
            {years.map(year => (
                <div key={year} className={styles.docYearGroup}>
                    <div className={styles.docYearLabel}>
                        <MIcon name="folder" size={14} />
                        <span>{year}</span>
                    </div>
                    {docs.filter(d => d.year === year).map(doc => (
                        <div key={doc.id} className={styles.docFileItem}>
                            <MIcon name={getFileIcon(doc.originalFilename)} size={16} className={styles.docFileIcon} />
                            <span className={styles.docFileName} title={doc.originalFilename}>{doc.originalFilename}</span>
                            <span className={styles.docFileDate}>
                                {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('tr-TR') : ''}
                            </span>
                            <div className={styles.docFileActions}>
                                {isViewable(doc.originalFilename) && (
                                    <a href={`${API_BASE}/api/training-documents/${doc.id}/view`}
                                        className={styles.docActionBtn} title="Görüntüle" target="_blank" rel="noreferrer">
                                        <MIcon name="visibility" size={14} />
                                    </a>
                                )}
                                <a href={`${API_BASE}/api/training-documents/${doc.id}/download`}
                                    className={styles.docActionBtn} title="İndir">
                                    <MIcon name="download" size={14} />
                                </a>
                                <button className={`${styles.docActionBtn} ${styles.docDeleteBtn}`}
                                    title="Sil" onClick={() => onDelete(doc.id)}>
                                    <MIcon name="delete" size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const DOC_CATEGORIES = [
    { key: 'Katilim_Formu', label: 'Eğitim Katılım Formu', icon: 'description' },
    { key: 'Sorular', label: 'Eğitim Soruları', icon: 'menu_book' },
    { key: 'Sertifika', label: 'Eğitim Katılım Sertifikası', icon: 'school' },
] as const;

const TrainingTab: React.FC<TrainingTabProps> = ({ companyId }) => {
    const { data: personnel = [], isLoading } = usePersonnelList(companyId);
    const queryClient = useQueryClient();

    const [showModal, setShowModal] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [trainingDate1, setTrainingDate1] = useState('');
    const [trainingDate2, setTrainingDate2] = useState('');
    const [saving, setSaving] = useState(false);
    const [filterMode, setFilterMode] = useState<FilterMode>('all');
    useScrollLock(showModal);

    // Document upload state
    const [documents, setDocuments] = useState<TrainingDoc[]>([]);
    const [uploading, setUploading] = useState<string | null>(null);
    const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    // Fetch documents
    const fetchDocuments = async () => {
        try {
            const res = await apiFetch(`${API_BASE}/api/companies/${companyId}/training-documents`);
            if (res.ok) {
                const data = await res.json();
                setDocuments(data);
            }
        } catch { /* ignore */ }
    };

    useEffect(() => {
        fetchDocuments();
    }, [companyId]);

    const handleFileUpload = async (docTypeKey: string, files: FileList) => {
        if (files.length === 0) return;
        setUploading(docTypeKey);
        let successCount = 0;
        let failCount = 0;
        for (const file of Array.from(files)) {
            try {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('docType', docTypeKey);
                const res = await apiFetch(`${API_BASE}/api/companies/${companyId}/training-documents`, {
                    method: 'POST',
                    body: formData,
                });
                if (res.ok) {
                    successCount++;
                } else {
                    failCount++;
                }
            } catch {
                failCount++;
            }
        }
        if (successCount > 0) toast.success(`${successCount} belge yüklendi`);
        if (failCount > 0) toast.error(`${failCount} belge yüklenemedi`);
        if (successCount > 0) fetchDocuments();
        setUploading(null);
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return 'picture_as_pdf';
        if (['png', 'jpg', 'jpeg'].includes(ext || '')) return 'image';
        if (['doc', 'docx'].includes(ext || '')) return 'article';
        return 'description';
    };

    const isViewable = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        return ['pdf', 'png', 'jpg', 'jpeg'].includes(ext || '');
    };

    const handleDeleteDoc = async (docId: number) => {
        try {
            const res = await apiFetch(`${API_BASE}/api/training-documents/${docId}`, { method: 'DELETE' });
            if (res.ok) {
                toast.success('Belge silindi');
                setDocuments(prev => prev.filter(d => d.id !== docId));
            } else {
                toast.error('Silme başarısız');
            }
        } catch {
            toast.error('Sunucu hatası');
        }
    };

    const now = new Date();

    const getStatus = (p: any): { label: string; type: 'valid' | 'expired' | 'nearExpiry' | 'missing' } => {
        if (!p.trainingValidityDate) return { label: 'Eğitim Yok', type: 'missing' };
        const validDate = new Date(p.trainingValidityDate);
        if (validDate <= now) return { label: 'Süresi Dolmuş', type: 'expired' };
        const diffDays = Math.ceil((validDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays <= 30) return { label: `${diffDays} gün kaldı`, type: 'nearExpiry' };
        return { label: 'Geçerli', type: 'valid' };
    };

    const totalEmployees = personnel.length;
    const trainedEmployees = personnel.filter(p => getStatus(p).type === 'valid').length;
    const missingTraining = personnel.filter(p => getStatus(p).type === 'missing').length;
    const expiredCount = personnel.filter(p => getStatus(p).type === 'expired').length;
    const nearExpiryCount = personnel.filter(p => getStatus(p).type === 'nearExpiry').length;
    const progressPercent = totalEmployees > 0 ? Math.round((trainedEmployees / totalEmployees) * 100) : 0;

    const filteredPersonnel = useMemo(() => {
        return personnel
            .filter(p => {
                const s = searchTerm.toLocaleLowerCase('tr-TR');
                const name = (p.adSoyad || `${p.first_name || ''} ${p.last_name || ''}`).toLocaleLowerCase('tr-TR');
                const tc = p.tc || p.tc_no || '';
                if (s && !name.includes(s) && !tc.includes(searchTerm)) return false;

                if (filterMode === 'missing') return getStatus(p).type === 'missing';
                if (filterMode === 'expired') return getStatus(p).type === 'expired';
                if (filterMode === 'nearExpiry') return getStatus(p).type === 'nearExpiry';
                if (filterMode === 'valid') return getStatus(p).type === 'valid';
                return true;
            })
            .sort((a, b) => {
                const nameA = a.adSoyad || `${a.first_name || ''} ${a.last_name || ''}`;
                const nameB = b.adSoyad || `${b.first_name || ''} ${b.last_name || ''}`;
                return nameA.localeCompare(nameB, 'tr-TR');
            });
    }, [personnel, searchTerm, filterMode]);

    const handleSelectAll = () => {
        const ids = filteredPersonnel.map(p => p.id);
        const allSelected = ids.every(id => selectedIds.includes(id));
        if (allSelected) {
            setSelectedIds(prev => prev.filter(id => !ids.includes(id)));
        } else {
            setSelectedIds(prev => [...new Set([...prev, ...ids])]);
        }
    };

    const handleSave = async () => {
        if (selectedIds.length === 0) return;
        if (!trainingDate1 && !trainingDate2) {
            toast.error('En az bir eğitim tarihi giriniz');
            return;
        }
        setSaving(true);
        try {
            const res = await apiFetch(`${API_BASE}/api/companies/${companyId}/personnel/training-dates`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    personnelIds: selectedIds,
                    trainingDate1: trainingDate1 || null,
                    trainingDate2: trainingDate2 || null,
                })
            });
            if (!res.ok) {
                const err = await res.json();
                toast.error(err.error || 'Kayıt başarısız');
                setSaving(false);
                return;
            }
            const result = await res.json();
            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: ['personnel', companyId] });
            setSelectedIds([]);
            setShowModal(false);
        } catch {
            toast.error('Sunucu hatası');
        }
        setSaving(false);
    };

    const openModal = (mode: FilterMode = 'all') => {
        setFilterMode(mode);
        setSelectedIds([]);
        setTrainingDate1('');
        setTrainingDate2('');
        setSearchTerm('');
        setShowModal(true);
    };

    if (isLoading) return <div className={styles.loading}>Yükleniyor...</div>;

    const chartData = [
        { name: 'Eğitimi Tam', value: trainedEmployees, color: '#10b981' },
        { name: 'Eksik/Dolan', value: totalEmployees - trainedEmployees, color: '#ef4444' }
    ];

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Üst Uyarılar */}
            <div className={styles.alertsSection}>
                {expiredCount > 0 && (
                    <div className={`${styles.alertCard} ${styles.alertDanger}`}>
                        <div className={styles.alertIcon}><MIcon name="warning" size={24} /></div>
                        <div className={styles.alertContent}>
                            <h3>Eğitim Süresi Dolanlar</h3>
                            <p><strong>{expiredCount} personelin</strong> Temel İSG eğitimi geçerlilik süresi dolmuştur.</p>
                            <button className={styles.alertActionBtn} onClick={() => openModal('expired')}>Listele ve Tarih Gir</button>
                        </div>
                    </div>
                )}

                {nearExpiryCount > 0 && (
                    <div className={`${styles.alertCard} ${styles.alertWarning}`}>
                        <div className={styles.alertIcon}><MIcon name="schedule" size={24} /></div>
                        <div className={styles.alertContent}>
                            <h3>Eğitim Geçerliliği Yaklaşanlar</h3>
                            <p><strong>{nearExpiryCount} personelin</strong> eğitim süresine 30 günden az kalmıştır.</p>
                            <button className={styles.alertActionBtn} onClick={() => openModal('nearExpiry')}>Listele ve Tarih Gir</button>
                        </div>
                    </div>
                )}

                {missingTraining > 0 && !(expiredCount > 0) && (
                    <div className={`${styles.alertCard} ${styles.alertDanger}`}>
                        <div className={styles.alertIcon}><MIcon name="warning" size={24} /></div>
                        <div className={styles.alertContent}>
                            <h3>Eğitimi Olmayan Personel</h3>
                            <p><strong>{missingTraining} personelin</strong> hiç eğitim kaydı bulunmamaktadır.</p>
                            <button className={styles.alertActionBtn} onClick={() => openModal('missing')}>Listele ve Tarih Gir</button>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.grid}>
                {/* Temel İSG Eğitimleri Paneli */}
                <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitleWrapper}>
                            <MIcon name="school" className={styles.titleIcon} size={24} />
                            <h2 className={styles.panelTitle}>Temel İSG Eğitimleri</h2>
                        </div>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width={60} height={60}>
                                <PieChart>
                                    <Pie data={chartData} innerRadius={20} outerRadius={28} paddingAngle={2} dataKey="value">
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <span className={styles.progressText}>%{progressPercent}</span>
                        </div>
                    </div>

                    <div className={styles.panelBody}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            Geçerlilik: Çok Tehlikeli 1 yıl, Tehlikeli 2 yıl, Az Tehlikeli 3 yıl.
                        </p>
                        <div className={styles.statsRow}>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Toplam</span>
                                <span className={styles.statValue}>{totalEmployees}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Eğitimi Tam</span>
                                <span className={`${styles.statValue} ${styles.textSuccess}`}>{trainedEmployees}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Süresi Dolan</span>
                                <span className={`${styles.statValue} ${styles.textDanger}`}>{expiredCount}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Yaklaşan</span>
                                <span className={`${styles.statValue} ${styles.textWarning}`}>{nearExpiryCount}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Eğitimsiz</span>
                                <span className={`${styles.statValue} ${styles.textDanger}`}>{missingTraining}</span>
                            </div>
                        </div>

                        <div className={styles.actionList}>
                            <button className={styles.listItemBtn} onClick={() => openModal('all')}>
                                <MIcon name="calendar_today" size={18} /> Eğitim Tarihi Gir / Güncelle
                            </button>
                        </div>
                    </div>
                </div>

                {/* İşe Başlama Eğitimleri */}
                <div className={styles.panelCard}>
                    <div className={styles.panelHeader}>
                        <div className={styles.panelTitleWrapper}>
                            <MIcon name="menu_book" className={styles.titleIcon} size={24} />
                            <h2 className={styles.panelTitle}>İşe Başlama Eğitimleri</h2>
                        </div>
                    </div>
                    <div className={styles.panelBody}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            Yeni işe başlayan çalışanlara verilen oryantasyon eğitimleri.
                        </p>
                        <div className={styles.actionList}>
                            <button className={styles.listItemBtn}>
                                <MIcon name="check_circle" size={18} /> Oryantasyon Formu Oluştur
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Eğitim Belgeleri */}
            <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                    <div className={styles.panelTitleWrapper}>
                        <MIcon name="folder_open" className={styles.titleIcon} size={24} />
                        <h2 className={styles.panelTitle}>Eğitim Belgeleri</h2>
                    </div>
                </div>
                <div className={styles.docGrid}>
                    {DOC_CATEGORIES.map(cat => {
                        const catDocs = documents.filter(d => d.docTypeKey === cat.key);
                        return (
                            <div key={cat.key} className={styles.docCategory}>
                                <div className={styles.docCategoryHeader}>
                                    <MIcon name={cat.icon} size={18} />
                                    <h3>{cat.label}</h3>
                                    <span className={styles.docCount}>{catDocs.length}</span>
                                </div>

                                <DocFileList
                                    docs={catDocs}
                                    onDelete={handleDeleteDoc}
                                    getFileIcon={getFileIcon}
                                    isViewable={isViewable}
                                    styles={styles}
                                />

                                <button
                                    className={styles.docUploadBtn}
                                    disabled={uploading === cat.key}
                                    onClick={() => fileInputRefs.current[cat.key]?.click()}
                                >
                                    <MIcon name="upload" size={16} />
                                    {uploading === cat.key ? 'Yükleniyor...' : 'Belge Yükle'}
                                </button>
                                <input
                                    ref={el => { fileInputRefs.current[cat.key] = el; }}
                                    type="file"
                                    accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                                    multiple
                                    style={{ display: 'none' }}
                                    onChange={e => {
                                        if (e.target.files && e.target.files.length > 0)
                                            handleFileUpload(cat.key, e.target.files);
                                        e.target.value = '';
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Personel Eğitim Durumu Tablosu */}
            <div className={styles.panelCard}>
                <div className={styles.panelHeader}>
                    <div className={styles.panelTitleWrapper}>
                        <MIcon name="group" className={styles.titleIcon} size={24} />
                        <h2 className={styles.panelTitle}>Personel Eğitim Durumu</h2>
                    </div>
                    <div className={styles.tableFilters}>
                        {(['all', 'missing', 'expired', 'nearExpiry', 'valid'] as FilterMode[]).map(mode => {
                            const labels: Record<FilterMode, string> = {
                                all: 'Tümü', missing: 'Eğitimsiz', expired: 'Süresi Dolan',
                                nearExpiry: 'Yaklaşan', valid: 'Geçerli'
                            };
                            const counts: Record<FilterMode, number> = {
                                all: totalEmployees, missing: missingTraining, expired: expiredCount,
                                nearExpiry: nearExpiryCount, valid: trainedEmployees
                            };
                            return (
                                <button
                                    key={mode}
                                    className={`${styles.filterBtn} ${filterMode === mode ? styles.filterActive : ''}`}
                                    onClick={() => setFilterMode(mode)}
                                >
                                    {labels[mode]} ({counts[mode]})
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className={styles.tableSearchRow}>
                    <div className={styles.tableSearch}>
                        <MIcon name="search" size={16} />
                        <input
                            type="text"
                            placeholder="İsim veya TC ara..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.trainingTable}>
                        <thead>
                            <tr>
                                <th>Adı Soyadı</th>
                                <th>TC Kimlik No</th>
                                <th>Görevi</th>
                                <th>1. Eğitim Tarihi</th>
                                <th>2. Eğitim Tarihi</th>
                                <th>Geçerlilik Tarihi</th>
                                <th>Durum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPersonnel.map(p => {
                                const name = p.adSoyad || `${p.first_name || ''} ${p.last_name || ''}`;
                                const tc = p.tc || p.tc_no || '';
                                const job = p.unvan || p.job_title || '';
                                const status = getStatus(p);
                                const d1 = p.trainingDate1 || p.training_date_1;
                                const d2 = p.trainingDate2 || p.training_date_2;
                                const validity = p.trainingValidityDate || p.training_validity_date;
                                return (
                                    <tr key={p.id} className={styles[`row_${status.type}`]}>
                                        <td className={styles.nameCell}>{name}</td>
                                        <td className={styles.tcCell}>{tc}</td>
                                        <td>{job}</td>
                                        <td>{d1 ? new Date(d1).toLocaleDateString('tr-TR') : '-'}</td>
                                        <td>{d2 ? new Date(d2).toLocaleDateString('tr-TR') : '-'}</td>
                                        <td>{validity ? new Date(validity).toLocaleDateString('tr-TR') : '-'}</td>
                                        <td>
                                            <span className={`${styles.statusBadge} ${styles[`status_${status.type}`]}`}>
                                                {status.label}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredPersonnel.length === 0 && (
                                <tr><td colSpan={7} className={styles.emptyRow}>Personel bulunamadı.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Eğitim Tarihi Girme Modalı */}
            {showModal && (
                <div className={styles.tfOverlay} onClick={() => setShowModal(false)}>
                    <div className={styles.tfModal} onClick={e => e.stopPropagation()}>
                        <div className={styles.tfHeader}>
                            <h2><MIcon name="calendar_today" size={22} /> Eğitim Tarihi Gir</h2>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    className={styles.tfSaveBtn}
                                    onClick={handleSave}
                                    disabled={saving || selectedIds.length === 0 || (!trainingDate1 && !trainingDate2)}
                                >
                                    <MIcon name="save" size={16} /> {saving ? 'Kaydediliyor...' : `Kaydet (${selectedIds.length} kişi)`}
                                </button>
                                <button className={styles.tfCloseBtn} onClick={() => setShowModal(false)}>
                                    <MIcon name="close" size={20} />
                                </button>
                            </div>
                        </div>

                        <div className={styles.tfBody}>
                            {/* Sol: Personel Seçimi */}
                            <div className={styles.tfSidebar}>
                                <div className={styles.tfSidebarHeader}>
                                    <h3><MIcon name="group" size={18} /> Personel Seç</h3>
                                    <span className={styles.tfBadge}>{selectedIds.length} seçili</span>
                                </div>

                                <div className={styles.tfSearchBox}>
                                    <MIcon name="search" size={16} />
                                    <input
                                        type="text"
                                        placeholder="İsim veya TC ara..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                <div className={styles.tfSelectAll}>
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={filteredPersonnel.length > 0 && filteredPersonnel.every(p => selectedIds.includes(p.id))}
                                            onChange={handleSelectAll}
                                        />
                                        <span>Tümünü Seç ({filteredPersonnel.length})</span>
                                    </label>
                                </div>

                                <div className={styles.tfPersonnelList}>
                                    {filteredPersonnel.map(p => {
                                        const name = p.adSoyad || `${p.first_name || ''} ${p.last_name || ''}`;
                                        const tc = p.tc || p.tc_no || '';
                                        const status = getStatus(p);
                                        return (
                                            <label key={p.id} className={`${styles.tfPersonItem} ${status.type !== 'valid' ? styles.tfPersonExpired : ''}`}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(p.id)}
                                                    onChange={() => {
                                                        setSelectedIds(prev =>
                                                            prev.includes(p.id) ? prev.filter(x => x !== p.id) : [...prev, p.id]
                                                        );
                                                    }}
                                                />
                                                <div className={styles.tfPersonInfo}>
                                                    <span className={styles.tfPersonName}>{name}</span>
                                                    <span className={styles.tfPersonTC}>{tc}</span>
                                                </div>
                                                <span className={`${styles.statusBadge} ${styles[`status_${status.type}`]}`}>
                                                    {status.label}
                                                </span>
                                            </label>
                                        );
                                    })}
                                    {filteredPersonnel.length === 0 && (
                                        <p className={styles.tfEmpty}>Personel bulunamadı.</p>
                                    )}
                                </div>
                            </div>

                            {/* Sağ: Tarih Girişi */}
                            <div className={styles.tfDatePanel}>
                                <div className={styles.tfDateCard}>
                                    <h3>Eğitim Tarihlerini Girin</h3>
                                    <p className={styles.tfDateHint}>
                                        Soldaki listeden personel seçin, tarih girin ve kaydedin.
                                        Geçerlilik tarihi otomatik hesaplanır.
                                    </p>

                                    <div className={styles.tfDateFields}>
                                        <div className={styles.tfDateField}>
                                            <label>1. Eğitim Tarihi</label>
                                            <input type="date" value={trainingDate1} onChange={e => setTrainingDate1(e.target.value)} />
                                        </div>
                                        <div className={styles.tfDateField}>
                                            <label>2. Eğitim Tarihi</label>
                                            <input type="date" value={trainingDate2} onChange={e => setTrainingDate2(e.target.value)} />
                                        </div>
                                    </div>

                                    <div className={styles.tfSelectedSummary}>
                                        <h4>Seçili Personel ({selectedIds.length})</h4>
                                        {selectedIds.length > 0 ? (
                                            <div className={styles.tfSelectedList}>
                                                {personnel.filter(p => selectedIds.includes(p.id)).map(p => {
                                                    const name = p.adSoyad || `${p.first_name || ''} ${p.last_name || ''}`;
                                                    return (
                                                        <div key={p.id} className={styles.tfSelectedItem}>
                                                            <span>{name}</span>
                                                            <button onClick={() => setSelectedIds(prev => prev.filter(x => x !== p.id))}>
                                                                <MIcon name="close" size={14} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className={styles.tfEmpty}>Henüz personel seçilmedi.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
};

export default TrainingTab;
