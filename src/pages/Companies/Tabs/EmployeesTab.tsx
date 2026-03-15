import React, { useState, useRef } from 'react';
import MIcon from '../../../components/MIcon';
import { useNavigate } from 'react-router-dom';
import styles from './EmployeesTab.module.css';
import { API_BASE } from '../../../config/api';


import { usePersonnelList, useDeletePersonnel, useBulkDeletePersonnel, useBulkUploadPersonnel } from '../../../hooks/usePersonnel';
import { toast } from 'sonner';
import { useScrollLock } from '../../../hooks/useScrollLock';

interface EmployeesTabProps {
    companyId: string;
    onPersonnelChange?: () => void;
}

const EmployeesTab: React.FC<EmployeesTabProps> = ({ companyId, onPersonnelChange }) => {
    const navigate = useNavigate();
    const { data: personnel = [], isLoading: loading } = usePersonnelList(companyId);
    const deleteMutation = useDeletePersonnel(companyId);
    const bulkDeleteMutation = useBulkDeletePersonnel(companyId);
    const uploadMutation = useBulkUploadPersonnel(companyId);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useScrollLock(isModalOpen);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        tc: '',
        firstName: '',
        lastName: '',
        unvan: '',
        cinsiyet: 'E',
        dogumTarihi: '',
        iseGiris: '',
        gsm: '',
        bloodType: '',
        educationLevel: '',
        maritalStatus: '',
        disabilityStatus: 'Yok',
        trainingDate1: '',
        trainingDate2: '',
        healthExamDate: '',
        competencies: [] as string[]
    });

    const handleOpenAdd = () => {
        setModalMode('add');
        setFormData({
            tc: '',
            firstName: '',
            lastName: '',
            unvan: '',
            cinsiyet: 'E',
            dogumTarihi: '',
            iseGiris: '',
            gsm: '',
            bloodType: 'A+',
            educationLevel: 'Lise',
            maritalStatus: 'Bekar',
            disabilityStatus: 'Yok',
            trainingDate1: '',
            trainingDate2: '',
            healthExamDate: '',
            competencies: []
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (emp: any) => {
        setModalMode('edit');
        setSelectedId(emp.id);
        setFormData({
            tc: emp.tc_no || emp.tc,
            firstName: emp.first_name || emp.firstName,
            lastName: emp.last_name || emp.lastName,
            unvan: emp.job_title || emp.unvan,
            cinsiyet: emp.gender || emp.cinsiyet,
            dogumTarihi: emp.birth_date || emp.dogumTarihi || '',
            iseGiris: emp.hire_date || emp.iseGiris || '',
            gsm: emp.phone_number || emp.gsm || '',
            bloodType: emp.blood_type || emp.bloodType || 'A+',
            educationLevel: emp.education_level || emp.educationLevel || 'Lise',
            maritalStatus: emp.marital_status || emp.maritalStatus || 'Bekar',
            disabilityStatus: emp.disability_status || emp.disabilityStatus || 'Yok',
            trainingDate1: emp.training_date_1 || emp.trainingDate1 || '',
            trainingDate2: emp.training_date_2 || emp.trainingDate2 || '',
            healthExamDate: emp.health_exam_date || emp.healthExamDate || '',
            competencies: emp.professional_competencies || emp.competencies || []
        });
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = modalMode === 'add'
            ? `${API_BASE}/api/companies/${companyId}/personnel`
            : `${API_BASE}/api/personnel/${selectedId}`;
        const method = modalMode === 'add' ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (res.ok) {
                setIsModalOpen(false);
                toast.success(modalMode === 'add' ? 'Personel eklendi' : 'Personel güncellendi');
                if (onPersonnelChange) onPersonnelChange();
                // We should really use a mutation here for automatic invalidation
                // But for now, let's trigger a refresh if we had a queryClient here
            } else {
                const data = await res.json();
                toast.error(`Hata: ${data.error}`);
            }
        } catch (error) {
            toast.error('Kayıt sırasında bir hata oluştu.');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu personeli silmek istediğinize emin misiniz?')) return;
        deleteMutation.mutate(id, {
            onSuccess: () => {
                if (onPersonnelChange) onPersonnelChange();
            }
        });
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedIds(filteredEmployees.map(emp => emp.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectItem = (id: number) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (!window.confirm(`Seçili ${selectedIds.length} personeli silmek istediğinize emin misiniz?`)) return;
        bulkDeleteMutation.mutate(selectedIds, {
            onSuccess: () => {
                setSelectedIds([]);
                if (onPersonnelChange) onPersonnelChange();
            }
        });
    };

    const handleDownloadTemplate = () => {
        window.location.href = `${API_BASE}/api/personnel/download-template`;
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const fData = new FormData();
        fData.append('file', file);

        uploadMutation.mutate(fData, {
            onSettled: () => {
                if (fileInputRef.current) fileInputRef.current.value = '';
                if (onPersonnelChange) onPersonnelChange();
            }
        });
    };

    const addCompetency = () => {
        if (formData.competencies.length < 10) {
            setFormData({ ...formData, competencies: [...formData.competencies, ''] });
        }
    };

    const removeCompetency = (index: number) => {
        const list = [...formData.competencies];
        list.splice(index, 1);
        setFormData({ ...formData, competencies: list });
    };

    const updateCompetency = (index: number, val: string) => {
        const list = [...formData.competencies];
        list[index] = val;
        setFormData({ ...formData, competencies: list });
    };

    const filteredEmployees = personnel
        .filter(emp => {
            const searchLower = searchTerm.toLocaleLowerCase('tr-TR');
            return emp.adSoyad.toLocaleLowerCase('tr-TR').includes(searchLower) ||
                emp.tc.includes(searchTerm) ||
                emp.unvan.toLocaleLowerCase('tr-TR').includes(searchLower);
        })
        .sort((a, b) => a.adSoyad.localeCompare(b.adSoyad, 'tr-TR'));

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.toolbar}>
                <div className={styles.searchBox}>
                    <MIcon name="search" size={18} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="İsim, TC veya Unvan ile ara..."
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className={styles.actionButtons}>
                    {selectedIds.length > 0 && (
                        <button
                            className={styles.btnDanger}
                            onClick={handleBulkDelete}
                            disabled={bulkDeleteMutation.isPending}
                        >
                            <MIcon name="delete" size={16} /> {bulkDeleteMutation.isPending ? 'Siliniyor...' : `Seçilenleri Sil (${selectedIds.length})`}
                        </button>
                    )}
                    <button className={styles.btnSecondary} onClick={handleDownloadTemplate}>
                        <MIcon name="download" size={16} /> Şablon
                    </button>

                    <button className={styles.btnPrimary} onClick={() => fileInputRef.current?.click()} disabled={uploadMutation.isPending}>
                        <MIcon name="upload" size={16} /> {uploadMutation.isPending ? 'Yükleniyor...' : 'Excel Yükle'}
                    </button>
                    <input type="file" ref={fileInputRef} hidden onChange={handleFileUpload} accept=".xlsx,.xls,.csv" />

                    <button className={styles.btnSuccess} onClick={handleOpenAdd}>
                        <MIcon name="person_add" size={16} /> Personel Ekle
                    </button>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr>
                                <th style={{ width: '40px', textAlign: 'center' }}>
                                    <input
                                        type="checkbox"
                                        checked={filteredEmployees.length > 0 && selectedIds.length === filteredEmployees.length}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th className={styles.thCenter}>Ad Soyad</th>
                                <th className={styles.thCenter}>TC Kimlik No</th>
                                <th className={styles.thCenter}>Unvan</th>
                                <th className={styles.thCenter}>İşe Giriş Tarihi</th>
                                <th className={styles.thCenter}>Eğitim Geçerliliği</th>
                                <th className={styles.thCenter}>Sağlık Muayenesi Geçerliliği</th>
                                <th className={`${styles.actionCol} ${styles.thCenter}`}>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((emp) => {
                                return (
                                    <tr
                                        key={emp.id}
                                        className={styles.clickableRow}
                                        onMouseDown={(e) => {
                                            (window as any).__rowDragOrigin = { x: e.clientX, y: e.clientY };
                                        }}
                                        onClick={(e) => {
                                            const origin = (window as any).__rowDragOrigin;
                                            if (origin) {
                                                const dx = Math.abs(e.clientX - origin.x);
                                                const dy = Math.abs(e.clientY - origin.y);
                                                if (dx > 4 || dy > 4) return;
                                            }
                                            const sel = window.getSelection();
                                            if (sel && sel.toString().length > 0) return;
                                            navigate(`/companies/${companyId}/personnel/${emp.id}`);
                                        }}
                                    >
                                        <td style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedIds.includes(emp.id)}
                                                onChange={() => handleSelectItem(emp.id)}
                                            />
                                        </td>
                                        <td>
                                            <div className={styles.empInfoCol}>
                                                <div className={styles.empAvatar}>
                                                    {emp.adSoyad ? emp.adSoyad.split(' ').map((n: string) => n[0]).join('') : '?'}
                                                </div>
                                                <div className={styles.empNameDetails}>
                                                    <span className={styles.empName}>{emp.adSoyad}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={styles.fontMono}>{emp.tc}</td>
                                        <td>{emp.unvan}</td>
                                        <td>
                                            {emp.iseGiris ? new Date(emp.iseGiris).toLocaleDateString() : '-'}
                                            {emp.iseGiris && (() => {
                                                const start = new Date(emp.iseGiris);
                                                const now = new Date();
                                                let years = now.getFullYear() - start.getFullYear();
                                                let months = now.getMonth() - start.getMonth();
                                                if (months < 0) { years--; months += 12; }
                                                if (now.getDate() < start.getDate()) { months--; if (months < 0) { years--; months += 12; } }
                                                const label = years > 0 ? `${years} Yıl ${months} Ay` : `${months} Ay`;
                                                return (
                                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                                        <div className={styles.tenureBar}>
                                                            <span className={styles.tenureText}>{label}</span>
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </td>
                                        <td>
                                            {emp.trainingValidityDate ? (() => {
                                                const end = new Date(emp.trainingValidityDate);
                                                const start = new Date(emp.trainingDate2 || emp.training_date_2 || emp.trainingDate1 || emp.training_date_1 || emp.trainingValidityDate);
                                                const now = new Date();
                                                const total = end.getTime() - start.getTime();
                                                const remaining = end.getTime() - now.getTime();
                                                const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
                                                const expired = remaining <= 0;
                                                return (
                                                    <div className={styles.validityBarWrap}>
                                                        <span className={expired ? styles.textDanger : styles.textSuccess}>
                                                            {end.toLocaleDateString()}
                                                        </span>
                                                        <div className={styles.validityTrack}>
                                                            <div
                                                                className={styles.validityFill}
                                                                style={{
                                                                    width: `${expired ? 100 : 100 - pct}%`,
                                                                    background: expired
                                                                        ? '#ef4444'
                                                                        : pct > 50
                                                                            ? `linear-gradient(90deg, #22c55e, #84cc16)`
                                                                            : pct > 20
                                                                                ? `linear-gradient(90deg, #eab308, #f97316)`
                                                                                : `linear-gradient(90deg, #f97316, #ef4444)`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })() : '-'}
                                        </td>
                                        <td>
                                            {emp.healthValidityDate ? (() => {
                                                const end = new Date(emp.healthValidityDate);
                                                const start = new Date(emp.healthExamDate || emp.health_exam_date || emp.healthValidityDate);
                                                const now = new Date();
                                                const total = end.getTime() - start.getTime();
                                                const remaining = end.getTime() - now.getTime();
                                                const pct = total > 0 ? Math.max(0, Math.min(100, (remaining / total) * 100)) : 0;
                                                const expired = remaining <= 0;
                                                return (
                                                    <div className={styles.validityBarWrap}>
                                                        <span className={expired ? styles.textDanger : styles.textSuccess}>
                                                            {end.toLocaleDateString()}
                                                        </span>
                                                        <div className={styles.validityTrack}>
                                                            <div
                                                                className={styles.validityFill}
                                                                style={{
                                                                    width: `${expired ? 100 : 100 - pct}%`,
                                                                    background: expired
                                                                        ? '#ef4444'
                                                                        : pct > 50
                                                                            ? `linear-gradient(90deg, #22c55e, #84cc16)`
                                                                            : pct > 20
                                                                                ? `linear-gradient(90deg, #eab308, #f97316)`
                                                                                : `linear-gradient(90deg, #f97316, #ef4444)`,
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                );
                                            })() : '-'}
                                        </td>
                                        <td className={styles.actionCol}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button className={styles.iconBtn} onClick={(e) => { e.stopPropagation(); handleOpenEdit(emp); }} title="Düzenle">
                                                    <MIcon name="edit" size={16} />
                                                </button>
                                                <button className={`${styles.iconBtn} ${styles.btnDelete}`} onClick={(e) => { e.stopPropagation(); handleDelete(emp.id); }} title="Sil">
                                                    <MIcon name="delete" size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}

                            {filteredEmployees.length === 0 && (
                                <tr>
                                    <td colSpan={8} className={styles.emptyState}>
                                        Kriterlere uygun personel bulunamadı.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Toplam {filteredEmployees.length} personel listeleniyor (A-Z).</span>
                </div>
            </div>

            {/* Personel Modal */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} style={{ maxWidth: '800px' }} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>{modalMode === 'add' ? 'Yeni Personel Ekle (Özlük Dosyası)' : 'Personeli Düzenle (Özlük Dosyası)'}</h3>
                            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
                                <MIcon name="close" size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className={styles.modalBody}>
                            <div className={styles.formSection}>
                                <h4 className={styles.sectionTitle}>Temel Bilgiler</h4>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Ad *</label>
                                        <input type="text" required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Soyad *</label>
                                        <input type="text" required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>TC Kimlik No *</label>
                                        <input type="text" required maxLength={11} value={formData.tc} onChange={e => setFormData({ ...formData, tc: e.target.value })} />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Unvan *</label>
                                        <input type="text" required value={formData.unvan} onChange={e => setFormData({ ...formData, unvan: e.target.value })} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Cinsiyet *</label>
                                        <select value={formData.cinsiyet} onChange={e => setFormData({ ...formData, cinsiyet: e.target.value as 'E' | 'K' })}>
                                            <option value="E">Erkek</option>
                                            <option value="K">Kadın</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>GSM No</label>
                                        <input type="text" value={formData.gsm} onChange={e => setFormData({ ...formData, gsm: e.target.value })} />
                                    </div>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Doğum Tarihi *</label>
                                        <input type="date" required value={formData.dogumTarihi} onChange={e => setFormData({ ...formData, dogumTarihi: e.target.value })} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>İşe Giriş Tarihi *</label>
                                        <input type="date" required value={formData.iseGiris} onChange={e => setFormData({ ...formData, iseGiris: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <h4 className={styles.sectionTitle}>Detaylı Bilgiler</h4>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Öğrenim Durumu</label>
                                        <select value={formData.educationLevel} onChange={e => setFormData({ ...formData, educationLevel: e.target.value })}>
                                            <option value="İlkokul">İlkokul</option>
                                            <option value="Ortaokul">Ortaokul</option>
                                            <option value="Lise">Lise</option>
                                            <option value="Ön Lisans">Ön Lisans</option>
                                            <option value="Lisans">Lisans</option>
                                            <option value="Yüksek Lisans">Yüksek Lisans</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Medeni Hali</label>
                                        <select value={formData.maritalStatus} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                                            <option value="Bekar">Bekar</option>
                                            <option value="Evli">Evli</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Kan Grubu</label>
                                        <select value={formData.bloodType} onChange={e => setFormData({ ...formData, bloodType: e.target.value })}>
                                            <option value="A+">A+</option>
                                            <option value="A-">A-</option>
                                            <option value="B+">B+</option>
                                            <option value="B-">B-</option>
                                            <option value="AB+">AB+</option>
                                            <option value="AB-">AB-</option>
                                            <option value="O+">O+</option>
                                            <option value="O-">O-</option>
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Engel Durumu</label>
                                        <select value={formData.disabilityStatus} onChange={e => setFormData({ ...formData, disabilityStatus: e.target.value })}>
                                            <option value="Yok">Yok</option>
                                            <option value="Var">Var</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 className={styles.sectionTitle} style={{ margin: 0 }}>İSG Eğitim Bilgileri</h4>
                                    <span className={styles.infoText}>* Geçerlilik süresi tehlike sınıfına göre otomatik hesaplanır (6331/17)</span>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Temel İSG Eğitimi Tarihi 1</label>
                                        <input type="date" value={formData.trainingDate1} onChange={e => setFormData({ ...formData, trainingDate1: e.target.value })} />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Temel İSG Eğitimi Tarihi 2</label>
                                        <input type="date" value={formData.trainingDate2} onChange={e => setFormData({ ...formData, trainingDate2: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <h4 className={styles.sectionTitle} style={{ margin: 0 }}>Sağlık Gözetimi</h4>
                                    <span className={styles.infoText}>* Periyodik muayene süresi tehlike sınıfına göre hesaplanır (6331/15)</span>
                                </div>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Son Sağlık Muayenesi Tarihi</label>
                                        <input type="date" value={formData.healthExamDate} onChange={e => setFormData({ ...formData, healthExamDate: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formSection}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                    <h4 className={styles.sectionTitle} style={{ margin: 0 }}>Mesleki Yeterlilikler (Maks 10)</h4>
                                    <button type="button" className={styles.addSmallBtn} onClick={addCompetency} disabled={formData.competencies.length >= 10}>
                                        <MIcon name="add" size={14} /> Ekle
                                    </button>
                                </div>
                                <div className={styles.competencyList}>
                                    {formData.competencies.map((comp, idx) => (
                                        <div key={idx} className={styles.competencyItem}>
                                            <input
                                                type="text"
                                                placeholder="Sertifika, Belge veya Yetkinlik adı..."
                                                value={comp}
                                                onChange={e => updateCompetency(idx, e.target.value)}
                                            />
                                            <button type="button" className={styles.removeSmallBtn} onClick={() => removeCompetency(idx)}>
                                                <MIcon name="close" size={14} />
                                            </button>
                                        </div>
                                    ))}
                                    {formData.competencies.length === 0 && <span className={styles.emptyText}>Henüz yeterlilik eklenmedi.</span>}
                                </div>
                            </div>

                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnSecondary} onClick={() => setIsModalOpen(false)}>İptal</button>
                                <button type="submit" className={styles.btnSuccess}>Kaydet</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployeesTab;


