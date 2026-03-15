import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import MIcon from '../../components/MIcon';
import styles from './CompanyList.module.css';
import { API_BASE } from '../../config/api';
import { formatSGK } from '../../utils/formatters';
import { useCompanies, useDeleteCompany, useSuspendCompany } from '../../hooks/useCompanies';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useScrollLock } from '../../hooks/useScrollLock';

const CompanyList: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { data: companies = [], isLoading } = useCompanies();
    const deleteMutation = useDeleteCompany();
    const suspendMutation = useSuspendCompany();

    const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [selectedIds, setSelectedIds] = useState<any[]>([]);
    const [hazardFilter, setHazardFilter] = useState<string | null>(null);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useScrollLock(isUploadModalOpen);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setOpenDropdownId(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleSuspend = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        suspendMutation.mutate(id);
        setOpenDropdownId(null);
    };

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if (window.confirm('Bu firmayı silmek istediğinize emin misiniz?')) {
            deleteMutation.mutate(id);
            setOpenDropdownId(null);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            const res = await fetch(`${API_BASE}/api/companies/bulk-upload`, {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`İçe Aktarma Tamamlandı!`, {
                    description: `Başarıyla yüklenen: ${data.success_count} | Hatalı: ${data.error_count}`
                });
                queryClient.invalidateQueries({ queryKey: ['companies'] });
                setIsUploadModalOpen(false);
            } else {
                toast.error(`Hata: ${data.error}`);
            }
        } catch (error) {
            toast.error('Yükleme sırasında bir hata oluştu.');
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(companies.map(co => co.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id: any) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Seçili ${selectedIds.length} firmayı silmek istediğinize emin misiniz?`)) return;

        try {
            const res = await fetch(`${API_BASE}/api/companies/bulk`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                toast.success('Seçili firmalar başarıyla silindi.');
                setSelectedIds([]);
                queryClient.invalidateQueries({ queryKey: ['companies'] });
            } else {
                toast.error('Silme işlemi başarısız.');
            }
        } catch (error) {
            toast.error('Toplu silme hatası oluştu.');
        }
    };

    const getHazardClassColor = (sirala: string) => {
        switch (sirala) {
            case 'Çok Tehlikeli': return styles.dangerRow;
            case 'Tehlikeli': return styles.warningRow;
            case 'Az Tehlikeli': return styles.successRow;
            default: return '';
        }
    };

    const getHazardBadgeClass = (sirala: string) => {
        switch (sirala) {
            case 'Çok Tehlikeli': return styles.badgeDanger;
            case 'Tehlikeli': return styles.badgeWarning;
            case 'Az Tehlikeli': return styles.badgeSuccess;
            default: return '';
        }
    };

    if (isLoading) return <div className={styles.loading}>Yükleniyor...</div>;

    const totalCount = companies.length;
    const cokTehlikeli = companies.filter((c: any) => c.tehlikeSinifi === 'Çok Tehlikeli').length;
    const tehlikeli = companies.filter((c: any) => c.tehlikeSinifi === 'Tehlikeli').length;
    const azTehlikeli = companies.filter((c: any) => c.tehlikeSinifi === 'Az Tehlikeli').length;
    const cokPct = totalCount ? Math.round((cokTehlikeli / totalCount) * 100) : 0;
    const tehPct = totalCount ? Math.round((tehlikeli / totalCount) * 100) : 0;
    const azPct = totalCount ? Math.round((azTehlikeli / totalCount) * 100) : 0;

    const filteredCompanies = hazardFilter
        ? companies.filter((c: any) => c.tehlikeSinifi === hazardFilter)
        : companies;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Firmalar</h1>
                    <p className={styles.subtitle}>Sistemde kayıtlı toplam {companies.length} firmanız bulunuyor.</p>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    {selectedIds.length > 0 && (
                        <button
                            className={styles.addBtn}
                            style={{ backgroundColor: 'var(--danger)', color: 'white', borderColor: 'var(--danger)' }}
                            onClick={handleBulkDelete}
                        >
                            <MIcon name="delete" size={18} />
                            <span>Seçilenleri Sil ({selectedIds.length})</span>
                        </button>
                    )}
                    <button
                        className={styles.uploadBtn}
                        onClick={() => setIsUploadModalOpen(true)}
                    >
                        <MIcon name="upload" size={18} />
                        <span>Excel'den Yükle</span>
                    </button>
                    <button
                        className={styles.addBtn}
                        onClick={() => navigate('/companies/new')}
                    >
                        <MIcon name="add" size={18} />
                        <span>Yeni Firma Ekle</span>
                    </button>
                </div>
            </div>

            {/* Tehlike Sınıfı İnfografik */}
            <div className={styles.statsRow}>
                <div
                    className={`${styles.statCard} ${styles.statTotal} ${hazardFilter === null ? styles.statActive : ''}`}
                    onClick={() => setHazardFilter(null)}
                >
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{totalCount}</span>
                        <span className={styles.statLabel}>Toplam Firma</span>
                    </div>
                </div>
                <div
                    className={`${styles.statCard} ${styles.statDanger} ${hazardFilter === 'Çok Tehlikeli' ? styles.statActive : ''}`}
                    onClick={() => setHazardFilter(hazardFilter === 'Çok Tehlikeli' ? null : 'Çok Tehlikeli')}
                >
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{cokTehlikeli}</span>
                        <span className={styles.statLabel}>Çok Tehlikeli</span>
                    </div>
                    <div className={styles.statBar}>
                        <div className={styles.statBarFill} style={{ width: `${cokPct}%` }}></div>
                    </div>
                    <span className={styles.statPct}>%{cokPct}</span>
                </div>
                <div
                    className={`${styles.statCard} ${styles.statWarning} ${hazardFilter === 'Tehlikeli' ? styles.statActive : ''}`}
                    onClick={() => setHazardFilter(hazardFilter === 'Tehlikeli' ? null : 'Tehlikeli')}
                >
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{tehlikeli}</span>
                        <span className={styles.statLabel}>Tehlikeli</span>
                    </div>
                    <div className={styles.statBar}>
                        <div className={styles.statBarFill} style={{ width: `${tehPct}%` }}></div>
                    </div>
                    <span className={styles.statPct}>%{tehPct}</span>
                </div>
                <div
                    className={`${styles.statCard} ${styles.statSafe} ${hazardFilter === 'Az Tehlikeli' ? styles.statActive : ''}`}
                    onClick={() => setHazardFilter(hazardFilter === 'Az Tehlikeli' ? null : 'Az Tehlikeli')}
                >
                    <div className={styles.statInfo}>
                        <span className={styles.statNumber}>{azTehlikeli}</span>
                        <span className={styles.statLabel}>Az Tehlikeli</span>
                    </div>
                    <div className={styles.statBar}>
                        <div className={styles.statBarFill} style={{ width: `${azPct}%` }}></div>
                    </div>
                    <span className={styles.statPct}>%{azPct}</span>
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.dataGrid}>
                    <thead>
                        <tr>
                            <th style={{ width: '40px', textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={companies.length > 0 && selectedIds.length === companies.length}
                                />
                            </th>
                            <th>Firma Unvanı</th>
                            <th>Tehlike Sınıfı</th>
                            <th>SGK Sicil No</th>
                            <th>Çalışan Sayısı</th>
                            <th>İşveren/Vekili</th>
                            <th>Yetkili Personel</th>
                            <th>Durum</th>
                            <th className={styles.actionCol}>İşlemler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...filteredCompanies].sort((a, b) => (a.unvan || '').trim().localeCompare((b.unvan || '').trim(), 'tr-TR')).map((co) => (
                            <tr
                                key={co.id}
                                className={`${getHazardClassColor(co.tehlikeSinifi)} ${styles.clickableRow}`}
                                onMouseDown={(e) => {
                                    (window as any).__rowDragOrigin = { x: e.clientX, y: e.clientY };
                                }}
                                onClick={(e) => {
                                    const origin = (window as any).__rowDragOrigin;
                                    if (origin) {
                                        const dx = Math.abs(e.clientX - origin.x);
                                        const dy = Math.abs(e.clientY - origin.y);
                                        if (dx > 4 || dy > 4) return; // Sürükleme → metin seçimi
                                    }
                                    const sel = window.getSelection();
                                    if (sel && sel.toString().length > 0) return;
                                    navigate(`/companies/${co.id}`);
                                }}
                            >
                                <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(co.id)}
                                        onChange={() => handleSelectItem(co.id)}
                                    />
                                </td>
                                <td className={styles.fwBold}>{co.unvan}</td>
                                <td>
                                    <span className={`${styles.badge} ${getHazardBadgeClass(co.tehlikeSinifi)}`}>
                                        {co.tehlikeSinifi}
                                    </span>
                                </td>
                                <td className={`sgk-mono ${styles.fontMono}`}>{formatSGK(co.sgkSicilNo)}</td>
                                <td>
                                    <span className={`${styles.employeeCount} ${co.calisanSayisi > 50 ? styles.employeeHigh : ''}`}>{co.calisanSayisi}</span>
                                </td>
                                <td>{co.isveren}</td>
                                <td>{co.isgUzmani}</td>
                                <td>
                                    <span className={`${styles.statusBadge} ${co.durum === 'Aktif' ? styles.statusActive : styles.statusInactive}`}>
                                        {co.durum}
                                    </span>
                                </td>
                                <td className={styles.actionCol} onClick={(e) => e.stopPropagation()}>
                                    <div
                                        className={styles.actionMenuContainer}
                                        ref={openDropdownId === co.id ? dropdownRef : null}
                                    >
                                        <button
                                            className={styles.actionMenuBtn}
                                            onClick={() => setOpenDropdownId(openDropdownId === co.id ? null : co.id)}
                                        >
                                            <MIcon name="more_horiz" size={20} />
                                        </button>

                                        {openDropdownId === co.id && (
                                            <div className={styles.dropdownMenu}>
                                                <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); navigate(`/companies/${co.id}`); }}>
                                                    <MIcon name="visibility" size={16} /> Görüntüle
                                                </button>
                                                <button className={styles.dropdownItem} onClick={(e) => { e.stopPropagation(); navigate(`/companies/${co.id}/edit`); }}>
                                                    <MIcon name="edit" size={16} /> Düzenle
                                                </button>
                                                <button className={styles.dropdownItem} onClick={(e) => handleSuspend(e, co.id)}>
                                                    <MIcon name="pause_circle" size={16} /> {co.durum === 'Aktif' ? 'Askıya Al' : 'Aktifleştir'}
                                                </button>
                                                <div className={styles.dropdownDivider}></div>
                                                <button className={`${styles.dropdownItem} ${styles.textDanger}`} onClick={(e) => handleDelete(e, co.id)}>
                                                    <MIcon name="delete" size={16} /> Sil
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {companies.length === 0 && (
                            <tr>
                                <td colSpan={8} className={styles.emptyState}>
                                    Henüz kayıtlı firma yok. "Yeni Firma Ekle" butonunu kullanın.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className={styles.modalOverlay} onClick={() => !uploading && setIsUploadModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Excel/CSV'den Toplu Firma Yükle</h3>
                            <button className={styles.closeBtn} onClick={() => !uploading && setIsUploadModalOpen(false)}>
                                <MIcon name="close" size={20} />
                            </button>
                        </div>
                        <div className={styles.modalBody}>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                Firma bilgilerinizi içeren Excel (.xlsx) veya CSV dosyanızı yükleyebilirsiniz. Sistem; Unvan, SGK Sicil No, Çalışan Sayısı, Tehlike Sınıfı ve atanan İSG Profesyonellerini otomatik tespit edip ilgili kartlara işleyecektir.
                            </p>

                            <button
                                onClick={() => window.location.href = `${API_BASE}/api/companies/download-template`}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    backgroundColor: 'var(--bg-main)',
                                    color: 'var(--primary)',
                                    border: '1px solid var(--border-light)',
                                    padding: '0.5rem 1rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    cursor: 'pointer',
                                    fontWeight: 500
                                }}
                            >
                                <MIcon name="download" size={16} /> Örnek Şablonu İndir (.xlsx)
                            </button>
                            <input
                                type="file"
                                accept=".xlsx, .xls, .csv"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />

                            <div
                                style={{
                                    border: '2px dashed var(--border-color)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '2rem',
                                    textAlign: 'center',
                                    cursor: uploading ? 'not-allowed' : 'pointer',
                                    backgroundColor: uploading ? 'var(--bg-main)' : 'var(--bg-surface)',
                                    opacity: uploading ? 0.7 : 1
                                }}
                                onClick={() => !uploading && fileInputRef.current?.click()}
                            >
                                <MIcon name="cloud_upload" size={32} style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                                <div>
                                    {uploading ? (
                                        <strong style={{ color: 'var(--primary)' }}>Dosya İşleniyor (Lütfen bekleyin...)</strong>
                                    ) : (
                                        <strong>Dosya Seçmek İçin Tıklayın</strong>
                                    )}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                                    Excel veya CSV dosyalarını destekler.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyList;
