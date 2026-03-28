import React, { useState, useEffect, useRef } from 'react';
import MIcon from '../../../components/MIcon';
import styles from './ProfessionalsTab.module.css';
import { API_BASE } from '../../../config/api';

interface Professional {
    id: number;
    role: string;
    professional_name: string;
    contract_start_date: string;
    is_active: boolean;
    monthly_service_minutes: number | null;
    photoUrl?: string;
    tc_kimlik_no?: string;
    certificate_class?: string;
    certificate_number?: string;
    phone_number?: string;
    email?: string;
}

interface DirectoryEntry {
    id: number;
    professional_name: string;
    role: string;
    tc_kimlik_no?: string;
    certificate_class?: string;
    certificate_number?: string;
    phone_number?: string;
    email?: string;
    photoUrl?: string;
}

interface Props {
    companyId: string;
}

const ROLE_LABELS: Record<string, string> = {
    IGU: 'İş Güvenliği Uzmanı (İGU)',
    IYH: 'İşyeri Hekimi (İYH)',
    DSP: 'Diğer Sağlık Personeli (DSP)',
};

const ProfessionalsTab: React.FC<Props> = ({ companyId }) => {
    const [professionals, setProfessionals] = useState<Professional[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedProf, setSelectedProf] = useState<Professional | null>(null);
    const [saving, setSaving] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Inline edit state
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState<string>('');

    const [form, setForm] = useState({
        professional_name: '',
        role: 'IGU',
        contract_start_date: '',
        tc_kimlik_no: '',
        certificate_class: '',
        certificate_number: '',
        phone_number: '',
        email: '',
    });

    // Directory (existing professionals across all companies)
    const [directory, setDirectory] = useState<DirectoryEntry[]>([]);
    // Backend role'u 'IGU'/'IYH'/'DSP' döndürüyor — form.role ile direkt karşılaştır
    const sameRoleDirectory = directory.filter(d => d.role === form.role);

    const applyDirectoryEntry = (d: typeof directory[0]) => {
        // Backend zaten 'IGU'/'IYH'/'DSP' döndürüyor — doğrudan kullan
        const roleKey = (d.role in ROLE_LABELS) ? d.role : 'IGU';
        setForm({
            ...form,
            professional_name: d.professional_name,
            role: roleKey,
            tc_kimlik_no: d.tc_kimlik_no || '',
            certificate_class: d.certificate_class || '',
            certificate_number: d.certificate_number || '',
            phone_number: d.phone_number || '',
            email: d.email || '',
        });
    };

    const fetchDirectory = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/professionals/directory`);
            if (res.ok) setDirectory(await res.json());
        } catch (_) { }
    };

    const fetchProfessionals = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/companies/${companyId}/professionals`);
            if (res.ok) {
                const data = await res.json();
                setProfessionals(data);
                if (selectedProf) {
                    const updated = data.find((p: Professional) => p.id === selectedProf.id);
                    if (updated) setSelectedProf(updated);
                }
            }
        } catch (_) { }
    };

    useEffect(() => {
        if (companyId) fetchProfessionals();
        fetchDirectory();
    }, [companyId]);

    const handleAdd = async () => {
        if (!form.professional_name || !form.contract_start_date) {
            alert('Ad Soyad ve Sözleşme Başlangıç tarihi zorunludur.');
            return;
        }
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE}/api/companies/${companyId}/professionals`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                await fetchProfessionals();
                setIsAddModalOpen(false);
                setForm({ professional_name: '', role: 'IGU', contract_start_date: '', tc_kimlik_no: '', certificate_class: '', certificate_number: '', phone_number: '', email: '' });
            } else {
                const err = await res.json();
                alert('Hata: ' + (err.error || 'Bilinmeyen hata'));
            }
        } catch (_) {
            alert('Sunucu hatası.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveInline = async (field: string) => {
        if (!selectedProf) return;
        try {
            const res = await fetch(`${API_BASE}/api/professionals/${selectedProf.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: editValue }),
            });
            if (res.ok) {
                await fetchProfessionals();
                setEditingField(null);
            } else {
                const err = await res.json();
                alert('Hata: ' + (err.error || 'Güncellenemedi.'));
            }
        } catch (_) {
            alert('Sunucu hatası.');
        }
    };

    const handleDelete = async (e: React.MouseEvent, profId: number) => {
        e.stopPropagation();
        if (!window.confirm('Bu profesyoneli kalıcı olarak silmek istiyor musunuz?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/professionals/${profId}`, { method: 'DELETE' });
            if (res.ok) {
                await fetchProfessionals();
                if (selectedProf && selectedProf.id === profId) {
                    setIsDetailModalOpen(false);
                    setSelectedProf(null);
                }
            }
        } catch (_) { }
    };

    const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!selectedProf || !e.target.files || e.target.files.length === 0) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('photo', file);

        try {
            const res = await fetch(`${API_BASE}/api/professionals/${selectedProf.id}/photo`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const data = await res.json();
                setSelectedProf({ ...selectedProf, photoUrl: data.photoUrl });
                fetchProfessionals();
            } else {
                alert("Fotoğraf yüklenemedi.");
            }
        } catch (error) {
            console.error(error);
            alert("Fotoğraf yükleme hatası.");
        }
    };

    const openDetailModal = (prof: Professional) => {
        setSelectedProf(prof);
        setEditingField(null);
        setIsDetailModalOpen(true);
    };

    const renderInlineRow = (label: string, field: keyof Professional, type: string = 'text', options?: { label: string, value: string }[]) => {
        const isEditing = editingField === field;
        const val = selectedProf?.[field];

        return (
            <div className={styles.inlineRow}>
                <div className={styles.inlineLabel}>{label}</div>
                <div className={styles.inlineContentArea}>
                    {isEditing ? (
                        <div className={styles.inlineEditGroup}>
                            {type === 'select' && options ? (
                                <select
                                    className={styles.inlineInput}
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    autoFocus
                                >
                                    <option value="" disabled>Seçiniz</option>
                                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                                </select>
                            ) : (
                                <input
                                    type={type}
                                    className={styles.inlineInput}
                                    value={editValue}
                                    onChange={e => setEditValue(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') handleSaveInline(field as string) }}
                                    autoFocus
                                    maxLength={field === 'tc_kimlik_no' ? 11 : undefined}
                                />
                            )}
                            <button className={styles.inlineSaveBtn} onClick={() => handleSaveInline(field as string)}>
                                <MIcon name="check" size={16} />
                            </button>
                            <button className={styles.inlineCancelBtn} onClick={() => setEditingField(null)}>
                                <MIcon name="close" size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.inlineDisplayGroup}>
                            <span className={styles.inlineValue}>
                                {field === 'role' ? (ROLE_LABELS[val as string] || val) :
                                    field === 'contract_start_date' ? (val ? new Date(val as string).toLocaleDateString('tr-TR') : '—') :
                                        (val || '—')}
                            </span>
                            <button className={styles.inlineEditIcon} onClick={() => {
                                setEditingField(field as string);
                                setEditValue(val ? (field === 'contract_start_date' ? (val as string).split('T')[0] : val as string) : '');
                            }}>
                                <MIcon name="edit" size={14} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Atanan İSG Profesyonelleri</h2>
                <button className={styles.addBtn} onClick={() => setIsAddModalOpen(true)}>
                    + Yeni Atama Ekle
                </button>
            </div>

            {professionals.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', padding: '2rem 0' }}>
                    Bu firmaya henüz ISG profesyoneli atanmamış.
                </p>
            ) : (
                <div className={styles.cardGrid}>
                    {professionals.map((prof) => (
                        <div key={prof.id} className={styles.profCard} onClick={() => openDetailModal(prof)}>
                            <div className={styles.cardHeader}>
                                <div className={styles.avatarWrapper}>
                                    {prof.photoUrl ? (
                                        <img src={prof.photoUrl} alt={prof.professional_name} className={styles.avatarImgSmall} />
                                    ) : (
                                        <MIcon name="badge" size={24} className={styles.avatarIcon} />
                                    )}
                                </div>
                                <div className={styles.profInfo}>
                                    <h3 className={styles.profName}>{prof.professional_name}</h3>
                                    <span className={styles.profRole}>{ROLE_LABELS[prof.role] || prof.role}</span>
                                </div>
                            </div>

                            <div className={styles.cardDetails}>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Sözleşme Başlangıç:</span>
                                    <span className={styles.detailValue}>
                                        {prof.contract_start_date ? new Date(prof.contract_start_date).toLocaleDateString('tr-TR') : '—'}
                                    </span>
                                </div>
                                <div className={styles.detailRow}>
                                    <span className={styles.detailLabel}>Hizmet Süresi:</span>
                                    <span className={styles.detailValue}>
                                        <strong style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: 700 }}>{prof.monthly_service_minutes ?? '0'}</strong> Dk/Ay
                                    </span>
                                </div>
                            </div>

                            <div className={styles.cardActions}>
                                <button className={styles.actionBtn} style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleDelete(e, prof.id); }} title="Kaydı sil">
                                    <MIcon name="delete" size={14} style={{ marginRight: '4px' }} /> Sil
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add Modal */}
            {isAddModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsAddModalOpen(false)}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Yeni İSG Profesyoneli Ekle</h3>
                            <button className={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}><MIcon name="close" size={20} /></button>
                        </div>
                        <div className={styles.modalBody}>

                            {/* Daha önce atanmış — hızlı seçim chip'leri */}
                            {sameRoleDirectory.length > 0 && (
                                <div className={styles.prevAssignedSection}>
                                    <span className={styles.prevAssignedLabel}>
                                        <MIcon name="people" size={13} />
                                        Kayıtlı İSG Profesyonelleri
                                    </span>
                                    <div className={styles.prevAssignedChips}>
                                        {sameRoleDirectory.map(d => (
                                            <button
                                                key={d.id}
                                                type="button"
                                                className={`${styles.prevChip} ${form.professional_name === d.professional_name ? styles.prevChipActive : ''}`}
                                                onClick={() => applyDirectoryEntry(d)}
                                                title={d.tc_kimlik_no ? `TC: ${d.tc_kimlik_no}` : ''}
                                            >
                                                <MIcon name="person" size={13} />
                                                {d.professional_name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.25rem 0' }} />

                            <div className={styles.formGroup}>
                                <label>Unvan *</label>
                                <select className={styles.select} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                                    <option value="IGU">İş Güvenliği Uzmanı (İGU)</option>
                                    <option value="IYH">İşyeri Hekimi (İYH)</option>
                                    <option value="DSP">Diğer Sağlık Personeli (DSP)</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Ad Soyad *</label>
                                <input type="text" className={styles.input} placeholder="Uzman Adı Soyadı" value={form.professional_name} onChange={e => setForm({ ...form, professional_name: e.target.value })} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>TC Kimlik No</label>
                                <input type="text" className={styles.input} placeholder="TC Kimlik No" value={form.tc_kimlik_no} maxLength={11} onChange={e => setForm({ ...form, tc_kimlik_no: e.target.value })} />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Sertifika Sınıfı</label>
                                    <select className={styles.select} value={form.certificate_class} onChange={e => setForm({ ...form, certificate_class: e.target.value })}>
                                        <option value="">Seçiniz</option>
                                        <option value="A">A Sınıfı</option>
                                        <option value="B">B Sınıfı</option>
                                        <option value="C">C Sınıfı</option>
                                        <option value="Hekim">Hekim</option>
                                        <option value="Diğer">Diğer</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Sertifika No</label>
                                    <input type="text" className={styles.input} placeholder="Sertifika No" value={form.certificate_number} onChange={e => setForm({ ...form, certificate_number: e.target.value })} />
                                </div>
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Telefon</label>
                                    <input type="text" className={styles.input} placeholder="Telefon" value={form.phone_number} onChange={e => setForm({ ...form, phone_number: e.target.value })} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>E-posta</label>
                                    <input type="email" className={styles.input} placeholder="E-posta" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Sözleşme Başlangıç Tarihi *</label>
                                <input type="date" className={styles.input} value={form.contract_start_date} onChange={e => setForm({ ...form, contract_start_date: e.target.value })} />
                            </div>
                        </div>
                        <div className={styles.modalActions}>
                            <button className={styles.btnSecondary} onClick={() => setIsAddModalOpen(false)}>İptal</button>
                            <button className={styles.btnPrimary} onClick={handleAdd} disabled={saving}>Kaydet</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Detail / Inline Edit Modal */}
            {isDetailModalOpen && selectedProf && (
                <div className={styles.modalOverlay} onClick={() => setIsDetailModalOpen(false)}>
                    <div className={styles.detailModal} onClick={e => e.stopPropagation()}>

                        <div className={styles.detailHeader}>
                            <div className={styles.photoContainer} onClick={() => fileInputRef.current?.click()}>
                                <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept="image/*" onChange={handlePhotoUpload} />
                                {selectedProf.photoUrl ? (
                                    <img src={selectedProf.photoUrl} alt="Profil" className={styles.detailProfileImg} />
                                ) : (
                                    <div className={styles.detailProfilePlaceholder}><MIcon name="badge" size={36} /></div>
                                )}
                                <div className={styles.photoHoverOverlay}>
                                    <MIcon name="photo_camera" size={18} />
                                    <span>Değiştir</span>
                                </div>
                            </div>
                            <div className={styles.detailTitleArea}>
                                <h3>{selectedProf.professional_name}</h3>
                                <span>{ROLE_LABELS[selectedProf.role] || selectedProf.role}</span>
                            </div>
                            <button className={styles.closeDetailBtn} onClick={() => setIsDetailModalOpen(false)}><MIcon name="close" size={20} /></button>
                        </div>

                        <div className={styles.detailBody}>
                            <div className={styles.autoTimeBox}>
                                <span className={styles.autoTimeLabel}>Hizmet Süresi</span>
                                <span className={styles.autoTimeValue}>{selectedProf.monthly_service_minutes ?? 0} Dakika</span>
                            </div>

                            <div className={styles.inlineGrid}>
                                {renderInlineRow('Ad Soyad', 'professional_name')}
                                {renderInlineRow('Unvan', 'role', 'select', [
                                    { label: 'İş Güvenliği Uzmanı (İGU)', value: 'IGU' },
                                    { label: 'İşyeri Hekimi (İYH)', value: 'IYH' },
                                    { label: 'Diğer Sağlık Personeli (DSP)', value: 'DSP' }
                                ])}
                                {renderInlineRow('TC Kimlik No', 'tc_kimlik_no')}
                                {renderInlineRow('Sözleşme Başlangıç', 'contract_start_date', 'date')}
                                {renderInlineRow('Sertifika Sınıfı', 'certificate_class', 'select', [
                                    { label: 'A Sınıfı', value: 'A' },
                                    { label: 'B Sınıfı', value: 'B' },
                                    { label: 'C Sınıfı', value: 'C' },
                                    { label: 'Hekim', value: 'Hekim' },
                                    { label: 'Diğer', value: 'Diğer' }
                                ])}
                                {renderInlineRow('Sertifika No', 'certificate_number')}
                                {renderInlineRow('Telefon', 'phone_number')}
                                {renderInlineRow('E-posta', 'email', 'email')}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfessionalsTab;
