import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MIcon from '../../components/MIcon';
import styles from './PersonnelDetail.module.css';
import mykCertificates from '../../data/mykCertificates.json';
import { API_BASE } from '../../config/api';
import { apiFetch } from '../../api/client';

const roleIcon = (type: string): string => {
    const map: Record<string, string> = {
        'Çalışan Temsilcisi': 'record_voice_over',
        'Arama Ekibi': 'person_search',
        'Kurtarma Ekibi': 'health_and_safety',
        'Söndürme Ekibi': 'local_fire_department',
        'Koruma Ekibi': 'shield',
        'İlkyardım Ekibi': 'medical_services',
        'İSG Kurul Üyesi': 'groups',
        'Destek Elemanı': 'support_agent',
        'Risk Değerlendirme Ekibi': 'assessment',
        'Acil Durum Koordinatörü': 'emergency',
    };
    return map[type] || 'assignment_ind';
};

const roleStyle = (type: string): string => {
    const map: Record<string, string> = {
        'Çalışan Temsilcisi': 'rep',
        'Arama Ekibi': 'search',
        'Kurtarma Ekibi': 'rescue',
        'Söndürme Ekibi': 'fire',
        'Koruma Ekibi': 'guard',
        'İlkyardım Ekibi': 'firstaid',
        'İSG Kurul Üyesi': 'council',
        'Destek Elemanı': 'support',
        'Risk Değerlendirme Ekibi': 'risk',
        'Acil Durum Koordinatörü': 'emergency',
    };
    return map[type] || 'default';
};

interface PersonnelData {
    id: number;
    tc: string;
    adSoyad: string;
    firstName: string;
    lastName: string;
    unvan: string;
    cinsiyet: string;
    dogumTarihi: string;
    iseGiris: string;
    gsm: string;
    bloodType: string;
    educationLevel: string;
    maritalStatus: string;
    disabilityStatus: string;
    trainingDate1: string;
    trainingDate2: string;
    healthExamDate: string;
    trainingValidityDate: string;
    healthValidityDate: string;
    competencies: MykEntry[];
    photoUrl: string | null;
    is_active: boolean;
    companyId: number;
    assignments: string[];
}

interface MykEntry {
    code: string;
    name: string;
    level: string;
    sector: string;
    certDate?: string;
}

const PersonnelDetail: React.FC = () => {
    const { companyId, personnelId } = useParams<{ companyId: string, personnelId: string }>();
    const navigate = useNavigate();
    const [personnel, setPersonnel] = useState<PersonnelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<any>(null);
    const [uploading, setUploading] = useState(false);
    const [mykSearch, setMykSearch] = useState('');
    const [showMykDropdown, setShowMykDropdown] = useState(false);
    const [mykEditMode, setMykEditMode] = useState(false);

    const filteredMyk = mykSearch.trim().length >= 2
        ? mykCertificates.filter(m =>
            m.name.toLowerCase().includes(mykSearch.toLowerCase()) ||
            m.code.toLowerCase().includes(mykSearch.toLowerCase()) ||
            m.sector.toLowerCase().includes(mykSearch.toLowerCase())
        ).slice(0, 30)
        : [];

    const saveMykCompetencies = async (competencies: MykEntry[]) => {
        try {
            await apiFetch(`${API_BASE}/api/personnel/${personnelId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ competencies })
            });
            // Update personnel state with saved data
            setPersonnel(prev => prev ? { ...prev, competencies } : null);
            setMykEditMode(false);
            setMykSearch('');
            setShowMykDropdown(false);
        } catch (error) {
            console.error('MYK kaydetme hatası', error);
            alert('Kaydetme sırasında hata oluştu.');
        }
    };

    const cancelMykEdit = () => {
        // Revert formData competencies back to saved personnel data
        if (personnel) {
            setFormData((prev: any) => ({ ...prev, competencies: personnel.competencies || [] }));
        }
        setMykEditMode(false);
        setMykSearch('');
        setShowMykDropdown(false);
    };

    // Close MYK dropdown on outside click
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest(`.${styles.mykSearchWrapper}`)) {
                setShowMykDropdown(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res = await apiFetch(`${API_BASE}/api/personnel/${personnelId}`);
            if (res.ok) {
                const data = await res.json();
                // Migrate old string[] competencies to MykEntry[]
                if (data.competencies && data.competencies.length > 0 && typeof data.competencies[0] === 'string') {
                    data.competencies = data.competencies.map((s: string) => ({
                        code: '', name: s, level: '', sector: '', certDate: ''
                    }));
                }
                setPersonnel(data);
                setFormData(data);
            }
        } catch (error) {
            console.error('Error fetching personnel detail', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [personnelId]);

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        setUploading(true);
        const file = e.target.files[0];
        const fData = new FormData();
        fData.append('file', file);

        try {
            const res = await apiFetch(`${API_BASE}/api/personnel/${personnelId}/photo`, {
                method: 'POST',
                body: fData
            });
            if (res.ok) {
                const data = await res.json();
                setPersonnel(prev => prev ? { ...prev, photoUrl: data.photoUrl } : null);
            }
        } catch (error) {
            alert('Fotoğraf yükleme hatası.');
        } finally {
            setUploading(false);
        }
    };

    const handleFieldChange = (field: string, val: string) => {
        setFormData((prev: any) => ({ ...prev, [field]: val }));
    };

    const handleSave = async () => {
        try {
            const res = await apiFetch(`${API_BASE}/api/personnel/${personnelId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setEditMode(false);
                fetchDetail();
            } else {
                alert('Güncelleme sırasında hata oluştu.');
            }
        } catch (error) {
            alert('Sunucu hatası.');
        }
    };

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
    if (!personnel) return <div className={styles.error}>Personel bulunamadı.</div>;

    const isTrainingExpired = personnel.trainingValidityDate && new Date(personnel.trainingValidityDate) < new Date();
    const isHealthExpired = personnel.healthValidityDate && new Date(personnel.healthValidityDate) < new Date();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <button onClick={() => navigate(`/companies/${companyId}?tab=personeller`)} className={styles.backBtn}>
                    <MIcon name="arrow_back" size={18} /> Personel Listesine Dön
                </button>
                <div className={styles.actions}>
                    {editMode ? (
                        <>
                            <button onClick={handleSave} className={styles.saveBtn}><MIcon name="save" size={18} /> Kaydet</button>
                            <button onClick={() => setEditMode(false)} className={styles.cancelBtn}><MIcon name="close" size={18} /> İptal</button>
                        </>
                    ) : (
                        <button onClick={() => setEditMode(true)} className={styles.editBtn}><MIcon name="edit" size={18} /> Bilgileri Düzenle</button>
                    )}
                </div>
            </div>

            <div className={styles.profileSection}>
                <div className={styles.profileContent}>
                    <div className={styles.avatarWrapper}>
                        <div className={styles.avatar}>
                            {personnel.photoUrl ? (
                                <img src={personnel.photoUrl} alt={personnel.adSoyad} />
                            ) : (
                                <MIcon name="person" size={64} />
                            )}
                            <label className={styles.photoLabel}>
                                <MIcon name="photo_camera" size={20} />
                                <input type="file" hidden onChange={handlePhotoUpload} accept="image/*" />
                            </label>
                            {uploading && <div className={styles.uploadOverlay}>...</div>}
                        </div>
                        <div className={styles.mainInfo}>
                            <h1 className={styles.name}>{personnel.adSoyad.toLocaleUpperCase('tr-TR')}</h1>
                            <p className={styles.title}><MIcon name="work" size={16} /> {personnel.unvan}</p>
                            <div className={styles.quickTags}>
                                <span className={styles.tagTc}><MIcon name="badge" size={14} /> {personnel.tc}</span>
                                <span className={`${styles.tagStatus} ${personnel.is_active ? styles.tagActive : styles.tagInactive}`}>
                                    <MIcon name={personnel.is_active ? 'check_circle' : 'cancel'} size={14} />
                                    {personnel.is_active ? 'Aktif' : 'Pasif'}
                                </span>
                            </div>
                        </div>
                    </div>
                    {(personnel.assignments && personnel.assignments.length > 0) && (
                        <div className={styles.roleBadges}>
                            {personnel.assignments.map((a, i) => (
                                <span key={i} className={`${styles.roleBadge} ${styles[`role_${roleStyle(a)}`] || ''}`}>
                                    <MIcon name={roleIcon(a)} size={15} />
                                    {a}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.grid}>
                {/* Kişisel Bilgiler */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <MIcon name="person" size={20} />
                        <h2>Kişisel Bilgiler</h2>
                    </div>
                    <div className={styles.cardContent}>
                        <InfoItem label="Ad" value={formData.firstName} field="firstName" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="Soyad" value={formData.lastName} field="lastName" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="Doğum Tarihi" value={formData.dogumTarihi} field="dogumTarihi" type="date" edit={editMode} onChange={handleFieldChange}
                            suffix={personnel.dogumTarihi ? (() => { const b = new Date(personnel.dogumTarihi); const now = new Date(); let age = now.getFullYear() - b.getFullYear(); if (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate())) age--; return <span className={styles.ageBadge}>{age}</span>; })() : undefined}
                        />
                        <InfoItem label="Cinsiyet" value={formData.cinsiyet === 'E' ? 'Erkek' : 'Kadın'} edit={false} />
                        <InfoItem label="Medeni Hal" value={formData.maritalStatus} field="maritalStatus" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="Kan Grubu" value={formData.bloodType} color={formData.bloodType?.includes('+') ? 'red' : 'blue'} field="bloodType" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="İletişim" value={formData.gsm} field="gsm" edit={editMode} onChange={handleFieldChange} />
                    </div>
                </div>

                {/* İstihdam Bilgileri */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <MIcon name="work" size={20} />
                        <h2>İstihdam Bilgileri</h2>
                    </div>
                    <div className={styles.cardContent}>
                        <InfoItem label="Ünvan/Pozisyon" value={formData.unvan} field="unvan" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="İşe Giriş Tarihi" value={formData.iseGiris} field="iseGiris" type="date" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="Öğrenim Durumu" value={formData.educationLevel} field="educationLevel" edit={editMode} onChange={handleFieldChange} />
                        <InfoItem label="Engel Durumu" value={formData.disabilityStatus} field="disabilityStatus" edit={editMode} onChange={handleFieldChange} />
                    </div>
                </div>

                {/* İSG Geçerlilikleri */}
                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <MIcon name="verified_user" size={20} />
                        <h2>İSG Eğitim Durumu</h2>
                    </div>
                    <div className={styles.cardContent}>
                        <div className={`${styles.validityItem} ${isTrainingExpired ? styles.expired : styles.valid}`}>
                            <div className={styles.validityInfo}>
                                <span>Temel İSG Eğitimi Geçerlilik</span>
                                <strong>{personnel.trainingValidityDate || '-'}</strong>
                            </div>
                            {isTrainingExpired ? <MIcon name="warning" size={20} /> : <MIcon name="verified_user" size={20} />}
                        </div>
                        <div className={`${styles.validityItem} ${isHealthExpired ? styles.expired : styles.valid}`}>
                            <div className={styles.validityInfo}>
                                <span>Periyodik Sağlık Muayenesi Geçerlilik</span>
                                <strong>{personnel.healthValidityDate || '-'}</strong>
                            </div>
                            {isHealthExpired ? <MIcon name="warning" size={20} /> : <MIcon name="verified_user" size={20} />}
                        </div>

                        {editMode && (
                            <div className={styles.dateEdits}>
                                <InfoItem label="Temel İSG Eğitimi 1" value={formData.trainingDate1} field="trainingDate1" type="date" edit={true} onChange={handleFieldChange} />
                                <InfoItem label="Temel İSG Eğitimi 2" value={formData.trainingDate2} field="trainingDate2" type="date" edit={true} onChange={handleFieldChange} />
                                <InfoItem label="Son Sağlık Muayenesi" value={formData.healthExamDate} field="healthExamDate" type="date" edit={true} onChange={handleFieldChange} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Mesleki Yeterlilikler */}
                <div className={`${styles.card} ${styles.cardFullWidth}`}>
                    <div className={styles.cardHeader}>
                        <MIcon name="school" size={20} />
                        <h2>Mesleki Yeterlilikler (MYK)</h2>
                        <div className={styles.mykActions}>
                            {mykEditMode ? (
                                <>
                                    <button className={styles.mykSaveBtn} onClick={() => saveMykCompetencies(formData.competencies || [])}>
                                        <MIcon name="save" size={16} /> Kaydet
                                    </button>
                                    <button className={styles.mykCancelBtn} onClick={cancelMykEdit}>
                                        <MIcon name="close" size={16} /> İptal
                                    </button>
                                </>
                            ) : (
                                <button className={styles.mykEditBtn} onClick={() => setMykEditMode(true)}>
                                    <MIcon name="edit" size={16} /> Düzenle
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Arama kutusu - sadece edit modda */}
                    {mykEditMode && (
                        <div className={styles.mykSearchWrapper}>
                            <MIcon name="search" size={18} />
                            <input
                                type="text"
                                placeholder="MYK yeterlilik ara (isim, kod veya sektör yazın)..."
                                value={mykSearch}
                                onChange={(e) => { setMykSearch(e.target.value); setShowMykDropdown(true); }}
                                onFocus={() => setShowMykDropdown(true)}
                                className={styles.mykSearchInput}
                            />
                            {showMykDropdown && filteredMyk.length > 0 && (
                                <div className={styles.mykDropdown}>
                                    {filteredMyk.map(m => {
                                        const alreadyAdded = (formData.competencies || []).some((c: MykEntry) => c.code === m.code);
                                        return (
                                            <div
                                                key={m.id}
                                                className={`${styles.mykItem} ${alreadyAdded ? styles.mykItemDisabled : ''}`}
                                                onMouseDown={(e) => {
                                                    e.preventDefault();
                                                    if (!alreadyAdded) {
                                                        const entry: MykEntry = { code: m.code, name: m.name, level: m.level, sector: m.sector, certDate: '' };
                                                        setFormData((prev: any) => ({ ...prev, competencies: [...(prev.competencies || []), entry] }));
                                                    }
                                                    setMykSearch('');
                                                    setShowMykDropdown(false);
                                                }}
                                            >
                                                <div className={styles.mykItemName}>
                                                    <strong>{m.code}</strong> — {m.name}
                                                </div>
                                                <div className={styles.mykItemMeta}>
                                                    {m.level} • {m.sector}
                                                    {alreadyAdded && <span className={styles.mykAlready}> (Eklendi)</span>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Yeterlilikler listesi */}
                    <div className={styles.mykList}>
                        {(formData.competencies || []).length === 0 ? (
                            <p className={styles.emptyText}>
                                {mykEditMode ? 'Yukarıdan arayarak yeterlilik ekleyin.' : 'Henüz tanımlı yeterlilik yok.'}
                            </p>
                        ) : (
                            (formData.competencies || []).map((c: MykEntry, i: number) => (
                                <div key={i} className={styles.mykCard}>
                                    <div className={styles.mykCardTop}>
                                        <div className={styles.mykCardInfo}>
                                            <span className={styles.mykCode}>{c.code}</span>
                                            <span className={styles.mykName}>{c.name}</span>
                                            <span className={styles.mykMeta}>{c.level} • {c.sector}</span>
                                        </div>
                                        {mykEditMode && (
                                            <button
                                                className={styles.mykDeleteBtn}
                                                title="Sil"
                                                onClick={() => {
                                                    const updated = formData.competencies.filter((_: MykEntry, idx: number) => idx !== i);
                                                    setFormData({ ...formData, competencies: updated });
                                                }}
                                            >
                                                <MIcon name="delete" size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className={styles.mykCardBottom}>
                                        <label className={styles.mykDateLabel}>Sertifika Tarihi:</label>
                                        {mykEditMode ? (
                                            <input
                                                type="date"
                                                className={styles.mykDateInput}
                                                value={c.certDate || ''}
                                                onChange={(e) => {
                                                    const updated = [...formData.competencies];
                                                    updated[i] = { ...updated[i], certDate: e.target.value };
                                                    setFormData({ ...formData, competencies: updated });
                                                }}
                                            />
                                        ) : (
                                            <span className={styles.mykDateDisplay}>
                                                {c.certDate ? new Date(c.certDate).toLocaleDateString('tr-TR') : '—'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface InfoItemProps {
    label: string;
    value: string;
    field?: string;
    color?: string;
    edit?: boolean;
    onChange?: (field: string, val: string) => void;
    type?: string;
    suffix?: React.ReactNode;
}

const InfoItem: React.FC<InfoItemProps> = ({ label, value, field, color, edit, onChange, type = 'text', suffix }) => (
    <div className={styles.infoItem}>
        <span className={styles.infoLabel}>{label}</span>
        {edit && field && onChange ? (
            <input
                type={type}
                className={styles.infoInput}
                value={value || ''}
                onChange={(e) => onChange(field, e.target.value)}
            />
        ) : (
            <span className={styles.infoValue} style={{ color: color }}>
                {value || '-'}
                {suffix}
            </span>
        )}
    </div>
);

export default PersonnelDetail;
