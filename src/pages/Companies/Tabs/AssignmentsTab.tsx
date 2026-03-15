import React, { useState, useEffect } from 'react';
import MIcon from '../../../components/MIcon';
import styles from './AssignmentsTab.module.css';
import { API_BASE } from '../../../config/api';

interface Personnel {
    id: number;
    adSoyad: string;
    unvan: string;
    is_active: boolean;
}

interface Assignment {
    id: number;
    personnel_id?: number | null;
    professional_id?: number | null;
    employer_id?: number | null;
    assignment_type: string;
    assignment_date?: string;
    training_date?: string;
    training_validity_date?: string;
    personnel_name: string;
    is_personnel_active: boolean;
    role_in_team?: string;
}

interface Company {
    id: number;
    employee_count: number;
    tehlikeSinifi: string;
}

interface AssignmentsTabProps {
    companyId: string;
}

const AUTOMATED_TYPES = ['Risk_Degerlendirme_Ekibi'];

const AssignmentsTab: React.FC<AssignmentsTabProps> = ({ companyId }) => {
    const [company, setCompany] = useState<Company | null>(null);
    const [personnelList, setPersonnelList] = useState<Personnel[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);

    // UI State for dropdowns
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [dropdownDirection, setDropdownDirection] = useState<'up' | 'down'>('down');
    const [savingType, setSavingType] = useState<string | null>(null);

    // Date editing state
    const [editingDate, setEditingDate] = useState<{ assignmentId: number; field: string } | null>(null);

    // Geçerlilik süresi olan görev tipleri (ay cinsinden)
    const VALIDITY_MONTHS: Record<string, number> = {
        'Ilkyardim_Ekibi': 36,       // İlkyardım sertifikası 3 yıl
        'Kurtarma_Ekibi': 12,        // Yıllık eğitim
        'Koruma_Ekibi': 12,          // Yıllık eğitim
        'Sondurme_Ekibi': 12,        // Yıllık eğitim
        'Acil_Durum_Koordinaturu': 12 // Yıllık eğitim
    };

    const hasTrainingField = (type: string) => !['Risk_Degerlendirme_Ekibi'].includes(type);
    const hasValidityField = (type: string) => type in VALIDITY_MONTHS;

    const handleDateSave = async (assignmentId: number, field: string, value: string) => {
        try {
            const res = await fetch(`${API_BASE}/api/assignments/${assignmentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: value || null })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (_) { }
        setEditingDate(null);
    };

    const formatDate = (d?: string) => d ? new Date(d).toLocaleDateString('tr-TR') : '—';

    const isExpired = (d?: string) => {
        if (!d) return false;
        return new Date(d) < new Date();
    };

    // Click outside to close dropdown
    useEffect(() => {
        if (!openDropdown) return;

        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isBtn = target.closest(`[id="btn-assign-${openDropdown}"]`);
            const isMenu = target.closest(`.${styles.dropdownMenu}`);

            if (!isBtn && !isMenu) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [openDropdown]);

    const toggleDropdown = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
        if (openDropdown === type) {
            setOpenDropdown(null);
        } else {
            // Check if there's enough space below
            const rect = e.currentTarget.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            // If less than 320px (menu height approx), flip to top
            setDropdownDirection(spaceBelow < 320 ? 'up' : 'down');
            setOpenDropdown(type);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            const [compRes, persRes, assignRes] = await Promise.all([
                fetch(`${API_BASE}/api/companies/${companyId}`),
                fetch(`${API_BASE}/api/companies/${companyId}/personnel`),
                fetch(`${API_BASE}/api/companies/${companyId}/assignments`)
            ]);

            if (compRes.ok) setCompany(await compRes.json());
            if (persRes.ok) setPersonnelList(await persRes.json());
            if (assignRes.ok) setAssignments(await assignRes.json());
        } catch (error) {
            console.error('Error fetching data', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [companyId]);

    // --- Statutory Calculations ---
    const getRequiredCount = (type: string): number => {
        if (!company) return 0;
        const count = company.employee_count;
        const hazard = company.tehlikeSinifi;

        switch (type) {
            case 'Calisan_Temsilcisi':
                if (count <= 50) return 1;
                if (count <= 100) return 2;
                if (count <= 500) return 3;
                if (count <= 1000) return 4;
                if (count <= 2000) return 5;
                return 6;
            case 'Ilkyardim_Ekibi':
                if (hazard === 'Çok Tehlikeli') return Math.ceil(count / 10);
                if (hazard === 'Tehlikeli') return Math.ceil(count / 15);
                return Math.ceil(count / 20);
            case 'Kurtarma_Ekibi':
            case 'Koruma_Ekibi':
            case 'Sondurme_Ekibi':
                if (hazard === 'Çok Tehlikeli') return Math.ceil(count / 30);
                if (hazard === 'Tehlikeli') return Math.ceil(count / 40);
                return Math.ceil(count / 50);
            case 'Destek_Elemani':
                return 1;
            default:
                return 0; // For types without explicit formulas
        }
    };

    const handleAssign = async (type: string, personnelId: number) => {
        const currentOfType = assignments.filter(a => a.assignment_type === type);

        // Prevent duplicate assignment in the same category
        if (currentOfType.some(a => a.personnel_id === personnelId)) {
            setOpenDropdown(null);
            return;
        }

        const newAssignment = {
            personnel_id: personnelId,
            type: type
        };

        const updatedAssignments = [
            ...assignments.filter(a => a.assignment_type !== type).map(a => ({ personnel_id: a.personnel_id, type: a.assignment_type, role: a.role_in_team })),
            ...currentOfType.map(a => ({ personnel_id: a.personnel_id, type: a.assignment_type, role: a.role_in_team })),
            newAssignment
        ];

        try {
            setSavingType(type);
            const res = await fetch(`${API_BASE}/api/companies/${companyId}/assignments/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignments: updatedAssignments })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            alert('Hata oluştu');
        } finally {
            setSavingType(null);
            setOpenDropdown(null);
        }
    };

    const handleRemove = async (id: number, type: string) => {
        const remainingOfType = assignments.filter(a => a.assignment_type === type && a.id !== id);
        const otherAssignments = assignments.filter(a => a.assignment_type !== type);

        const newPayload = [
            ...otherAssignments.map(a => ({ personnel_id: a.personnel_id, type: a.assignment_type, role: a.role_in_team })),
            ...remainingOfType.map(a => ({ personnel_id: a.personnel_id, type: a.assignment_type, role: a.role_in_team }))
        ];

        try {
            setSavingType(type);
            const res = await fetch(`${API_BASE}/api/companies/${companyId}/assignments/bulk`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ assignments: newPayload })
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            alert('Hata oluştu');
        } finally {
            setSavingType(null);
        }
    };

    const renderAssignmentCard = (title: string, type: string, icon: React.ReactNode, ruleTxt: string) => {
        let currentOfType = assignments.filter(a => a.assignment_type === type);

        // --- ISG Hierarchy Sorting for Risk Assessment Team ---
        if (type === 'Risk_Degerlendirme_Ekibi') {
            const roleOrder: Record<string, number> = {
                'İşveren / İşveren Vekili': 1,
                'İş Güvenliği Uzmanı': 2,
                'İşyeri Hekimi': 3,
                'Çalışan Temsilcisi': 4,
                'Destek Elemanı': 5
            };
            currentOfType = [...currentOfType].sort((a, b) => {
                const orderA = roleOrder[a.role_in_team || ''] || 99;
                const orderB = roleOrder[b.role_in_team || ''] || 99;
                return orderA - orderB;
            });
        }

        const required = getRequiredCount(type);
        const activeCount = currentOfType.filter(a => a.is_personnel_active).length;
        const isAutomated = AUTOMATED_TYPES.includes(type);
        const isDeficient = !isAutomated && activeCount < required;
        const hasInactive = currentOfType.some(a => !a.is_personnel_active);
        const isKurulType = type === 'ISG_Kurul_Uyesi';
        const isKurulDisabled = isKurulType && company && company.employee_count < 50;

        const isOpen = openDropdown === type;

        return (
            <div className={`${styles.card} ${isDeficient ? styles.cardDeficient : ''} ${isKurulDisabled ? styles.cardDisabled : ''} ${isAutomated ? styles.cardAutomated : ''} ${isOpen ? styles.cardOpen : ''}`}>
                <div className={styles.cardHeader}>
                    <div className={styles.cardTitleWrap}>
                        {icon}
                        <h3 className={styles.cardTitle}>{title}</h3>
                    </div>
                    {!isAutomated && !isKurulDisabled && required > 0 && (
                        <span className={`${styles.countBadge} ${isDeficient ? styles.badgeDanger : styles.badgeSuccess}`}>
                            {isDeficient ? (
                                <>{required - activeCount}</>
                            ) : (
                                <MIcon name="check" size={16} />
                            )}
                        </span>
                    )}
                </div>
                <div className={styles.cardBody}>
                    <p className={styles.ruleText}>
                        {isKurulDisabled ? '50 çalışandan az olduğu için zorunlu değildir.' : ruleTxt}
                    </p>

                    {isKurulDisabled ? (
                        <div className={styles.disabledOverlay}>
                            <MIcon name="verified_user" size={32} />
                            <span>Zorunlu Değil</span>
                        </div>
                    ) : (
                        <>
                            {isDeficient && (
                                <div className={`${styles.alertMini} ${styles.alertDangerMini}`}>
                                    <MIcon name="warning" size={14} /> Eksik Personel! Lütfen yeni atama yapın.
                                </div>
                            )}

                            {hasInactive && (
                                <div className={`${styles.alertMini} ${styles.alertWarningMini}`}>
                                    <MIcon name="warning" size={14} /> Ayrılan personel var! Revize ediniz.
                                </div>
                            )}

                            <ul className={styles.memberList}>
                                {currentOfType.map(a => (
                                    <li key={a.id} className={`${styles.memberItem} ${!a.is_personnel_active ? styles.inactiveMember : ''}`}>
                                        <div className={styles.memberAvatar}>
                                            {a.personnel_name ? a.personnel_name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
                                        </div>
                                        <div className={styles.memberDetails}>
                                            <span className={styles.memberName}>{a.personnel_name}</span>
                                            <span className={styles.memberRole}>
                                                {a.role_in_team || (!a.is_personnel_active ? '(Ayrıldı)' : 'Atandı')}
                                            </span>
                                            <div className={styles.memberDates}>
                                                {/* Atama Tarihi */}
                                                <div className={styles.dateField}>
                                                    <span className={styles.dateLabel}>Atama:</span>
                                                    {editingDate?.assignmentId === a.id && editingDate.field === 'assignment_date' ? (
                                                        <input type="date" className={styles.dateInput} defaultValue={a.assignment_date?.split('T')[0] || ''} autoFocus onBlur={e => handleDateSave(a.id, 'assignment_date', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
                                                    ) : (
                                                        <span className={styles.dateValue} onClick={() => !isAutomated && setEditingDate({ assignmentId: a.id, field: 'assignment_date' })}>
                                                            {formatDate(a.assignment_date)}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Eğitim Tarihi */}
                                                {hasTrainingField(type) && (
                                                    <div className={styles.dateField}>
                                                        <span className={styles.dateLabel}>Eğitim:</span>
                                                        {editingDate?.assignmentId === a.id && editingDate.field === 'training_date' ? (
                                                            <input type="date" className={styles.dateInput} defaultValue={a.training_date?.split('T')[0] || ''} autoFocus onBlur={e => handleDateSave(a.id, 'training_date', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
                                                        ) : (
                                                            <span className={styles.dateValue} onClick={() => !isAutomated && setEditingDate({ assignmentId: a.id, field: 'training_date' })}>
                                                                {formatDate(a.training_date)}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                                {/* Geçerlilik Tarihi */}
                                                {hasValidityField(type) && (
                                                    <div className={styles.dateField}>
                                                        <span className={styles.dateLabel}>Geçerlilik:</span>
                                                        {editingDate?.assignmentId === a.id && editingDate.field === 'training_validity_date' ? (
                                                            <input type="date" className={styles.dateInput} defaultValue={a.training_validity_date?.split('T')[0] || ''} autoFocus onBlur={e => handleDateSave(a.id, 'training_validity_date', e.target.value)} onKeyDown={e => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }} />
                                                        ) : (
                                                            <span className={`${styles.dateValue} ${isExpired(a.training_validity_date) ? styles.dateExpired : ''}`} onClick={() => !isAutomated && setEditingDate({ assignmentId: a.id, field: 'training_validity_date' })}>
                                                                {formatDate(a.training_validity_date)}
                                                                {isExpired(a.training_validity_date) && <MIcon name="error" size={12} />}
                                                            </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {!isAutomated && (
                                            <button className={styles.removeBtn} onClick={() => handleRemove(a.id!, type)}>
                                                <MIcon name="delete" size={14} />
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>

                            {!isAutomated && (
                                <div className={styles.dropdownWrap}>
                                    <button
                                        className={styles.addMemberBtn}
                                        onClick={(e) => toggleDropdown(e, type)}
                                        disabled={savingType === type}
                                        id={`btn-assign-${type}`}
                                    >
                                        <MIcon name="person_add" size={16} /> {savingType === type ? 'Kaydediliyor...' : 'Atama Yap'}
                                    </button>

                                    {openDropdown === type && (
                                        <div className={`${styles.dropdownMenu} ${dropdownDirection === 'up' ? styles.dropdownMenuTop : ''}`}>
                                            <div className={styles.dropdownHeader}>
                                                <span>Personel Seçiniz</span>
                                                <MIcon name="close" size={14} onClick={() => setOpenDropdown(null)} />
                                            </div>
                                            <div className={styles.dropdownList}>
                                                {personnelList.filter(p => p.is_active).map(p => (
                                                    <div
                                                        key={p.id}
                                                        className={styles.dropdownItem}
                                                        onClick={() => handleAssign(type, p.id)}
                                                    >
                                                        {p.adSoyad} <span className={styles.itemUnvan}>{p.unvan}</span>
                                                    </div>
                                                ))}
                                                {personnelList.filter(p => p.is_active).length === 0 && (
                                                    <div className={styles.emptyItem}>Aktif personel bulunamadı.</div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;
    if (!company) return <div>Firma bulunamadı.</div>;

    const isKurulZorunlu = company.employee_count >= 50;

    return (
        <div className={styles.container}>
            {/* İSG Kurulu Section */}
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>İSG Kurulu Durumu</h2>
            </div>

            {!isKurulZorunlu ? (
                <div className={`${styles.infoCard} ${styles.infoDisabled}`}>
                    <div className={styles.infoIcon}>
                        <MIcon name="verified_user" size={28} />
                    </div>
                    <div className={styles.infoContent}>
                        <h3>İSG Kurulu Zorunlu Değildir</h3>
                        <p>
                            Firmanın çalışan sayısı (<strong>{company.employee_count}</strong>) 50'den az olduğu için 6331 sayılı kanun gereği kurul oluşturulması zorunlu değildir.
                        </p>
                    </div>
                </div>
            ) : (
                <div className={`${styles.infoCard} ${styles.infoSuccess}`}>
                    {/* Simplified for now, can be expanded to full multi-role Kurulu grid */}
                    <div className={styles.infoIcon}>
                        <MIcon name="verified_user" size={28} />
                    </div>
                    <div className={styles.infoContent}>
                        <h3>İSG Kurulu Aktif</h3>
                        <p>
                            50 ve daha fazla çalışanı bulunduğu için İSG Kurulu oluşturulması zorunludur. Lütfen 'İSG Kurul Üyesi' atamalarını aşağıdan kontrol edin.
                        </p>
                    </div>
                    <button className={styles.printBtn}>
                        <MIcon name="print" size={16} /> Kurul Kararı Çıktısı Al
                    </button>
                </div>
            )}

            <div className={styles.grid}>
                {renderAssignmentCard("Çalışan Temsilcileri", "Calisan_Temsilcisi", <MIcon name="military_tech" className={styles.titleIcon} size={20} />, "6331/20 gereği çalışan sayısına göre zorunlu temsilci sayısı.")}
                {renderAssignmentCard("İlkyardım Ekibi", "Ilkyardim_Ekibi", <MIcon name="favorite" className={styles.titleIcon} size={20} />, "İlkyardım Yönetmeliği gereği tehlike sınıfına göre ilkyardımcı sayısı.")}
                {renderAssignmentCard("Kurtarma Ekibi", "Kurtarma_Ekibi", <MIcon name="health_and_safety" className={styles.titleIcon} size={20} />, "Tahliye, arama ve kurtarma sorumluları.")}
                {renderAssignmentCard("Koruma Ekibi", "Koruma_Ekibi", <MIcon name="shield" className={styles.titleIcon} size={20} />, "Yangın önleme, ikaz ve alarm sorumluları.")}
                {renderAssignmentCard("Söndürme Ekibi", "Sondurme_Ekibi", <MIcon name="local_fire_department" className={styles.titleIcon} size={20} />, "Yangınla mücadele ve söndürme.")}

                {/* Fixed titles for the new ones */}
                {renderAssignmentCard("İSG Kurul Üyeleri", "ISG_Kurul_Uyesi", <MIcon name="emoji_events" className={styles.titleIcon} size={20} />, "6331/22 gereği 50+ çalışanda zorunlu kurul asil ve yedek üyeleri.")}
                {renderAssignmentCard("Destek Elemanı", "Destek_Elemani", <MIcon name="person_add" className={styles.titleIcon} size={20} />, "Risk değerlendirme çalışmalarında teknik destek sağlamak, saha gözlemleri ve veri toplama süreçlerinde ekibe yardımcı olmak üzere görevlendirilen personeldir.")}
                {renderAssignmentCard("Risk Değerlendirme Ekibi", "Risk_Degerlendirme_Ekibi", <MIcon name="fact_check" className={styles.titleIcon} size={20} />, "Risk Değerlendirmesi Yönetmeliği gereği oluşturulan analiz ekibi.")}
                {renderAssignmentCard("Acil Durum Koordinatörü", "Acil_Durum_Koordinaturu", <MIcon name="gpp_maybe" className={styles.titleIcon} size={20} />, "Acil durumlarda kriz yönetimi sorumlusu.")}
            </div>
        </div>
    );
};

export default AssignmentsTab;
