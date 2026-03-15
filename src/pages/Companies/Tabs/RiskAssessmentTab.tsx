import React, { useState, useEffect } from 'react';
import MIcon from '../../../components/MIcon';
import styles from './RiskAssessmentTab.module.css';
import RiskWizard from './RiskWizard';
import { API_BASE } from '../../../config/api';

interface RiskItem {
    id: number;
    activity: string;
    hazard: string;
    riskEffect: string;
    initialProbability: number;
    initialSeverity: number;
    initialFrequency: number;
    initialRiskScore: number;
    initialRiskLevel: string;
    correctiveMeasures: string;
    existingMeasures: string;
    finalProbability: number;
    finalSeverity: number;
    finalFrequency: number;
    finalRiskScore: number;
    finalRiskLevel: string;
    responsiblePerson: string;
    deadline: string;
}

interface CompanyInfo {
    official_title: string;
    address: string;
    sgk_no: string;
    tehlikeSinifi: string;
    city_name?: string;
    district_name?: string;
}

interface RiskTabProps {
    companyId: string;
}

const PROBABILITY_OPTIONS = [0, 0.2, 0.5, 1, 3, 6, 10];
const FREQUENCY_OPTIONS = [0, 0.5, 1, 2, 3, 6, 10];
const SEVERITY_OPTIONS = [0, 1, 3, 7, 15, 40, 100];

function getRiskColor(score: number): string {
    if (score <= 0) return 'none';
    if (score <= 20) return 'white';
    if (score <= 70) return 'green';
    if (score <= 200) return 'blue';
    if (score <= 400) return 'yellow';
    return 'red';
}

function getRiskLevel(score: number): string {
    if (score <= 0) return '—';
    if (score <= 20) return 'Önemsiz Risk';
    if (score <= 70) return 'Olası Risk';
    if (score <= 200) return 'Önemli Risk';
    if (score <= 400) return 'Esaslı Risk';
    return 'Tolerans Gösterilemez Risk';
}

function getValidityYears(tehlikeSinifi: string): number {
    if (tehlikeSinifi === 'Çok Tehlikeli') return 2;
    if (tehlikeSinifi === 'Tehlikeli') return 4;
    return 6;
}

function addYears(dateStr: string, years: number): string {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    d.setFullYear(d.getFullYear() + years);
    return d.toISOString().split('T')[0];
}

function formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
}

const emptyForm = {
    activity: '',
    hazard: '',
    riskEffect: '',
    initialProbability: 0,
    initialSeverity: 0,
    initialFrequency: 0,
    initialRiskScore: 0,
    initialRiskLevel: 'Önemsiz Risk',
    correctiveMeasures: '',
    existingMeasures: '',
    finalProbability: 0,
    finalSeverity: 0,
    finalFrequency: 0,
    finalRiskScore: 0,
    finalRiskLevel: 'Önemsiz Risk',
    responsiblePerson: '',
    deadline: '',
};

const RiskAssessmentTab: React.FC<RiskTabProps> = ({ companyId }) => {
    const [risks, setRisks] = useState<RiskItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [showWizard, setShowWizard] = useState(false);
    const [selectedRisks, setSelectedRisks] = useState<Set<number>>(new Set());
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
    const [reportDate, setReportDate] = useState<string>(() => {
        return localStorage.getItem(`risk_report_date_${companyId}`) || '';
    });

    const validityDate = reportDate && companyInfo
        ? addYears(reportDate, getValidityYears(companyInfo.tehlikeSinifi))
        : '';

    const handleReportDateChange = (val: string) => {
        setReportDate(val);
        localStorage.setItem(`risk_report_date_${companyId}`, val);
    };

    const fetchCompanyInfo = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/companies/${companyId}`);
            if (res.ok) setCompanyInfo(await res.json());
        } catch { /* ignore */ }
    };

    const fetchRisks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/companies/${companyId}/risks`);
            if (res.ok) {
                setRisks(await res.json());
                setSelectedRisks(new Set());
            }
        } catch (e) {
            console.error('Error fetching risks', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanyInfo();
        fetchRisks();
    }, [companyId]);

    const handleAddEmptyRow = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/companies/${companyId}/risks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(emptyForm)
            });
            if (res.ok) { fetchRisks(); }
        } catch { alert('Satır eklenirken hata oluştu.'); }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu risk kaydını silmek istediğinize emin misiniz?')) return;
        try {
            const res = await fetch(`${API_BASE}/api/risks/${id}`, { method: 'DELETE' });
            if (res.ok) fetchRisks();
        } catch { alert('Silme hatası.'); }
    };

    const handleDeleteSelected = async () => {
        if (selectedRisks.size === 0) return;
        if (!window.confirm(`Seçili ${selectedRisks.size} kaydı silmek istediğinize emin misiniz?`)) return;
        try {
            setLoading(true);
            for (const id of selectedRisks) {
                await fetch(`${API_BASE}/api/risks/${id}`, { method: 'DELETE' });
            }
            setSelectedRisks(new Set());
            fetchRisks();
        } catch {
            alert('Toplu silme işlemi sırasında bir hata oluştu.');
            setLoading(false);
        }
    };

    const handleToggleRisk = (id: number) => {
        setSelectedRisks(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
    };

    const handleSelectAllRisks = (checked: boolean) => {
        if (checked) setSelectedRisks(new Set(risks.map(r => r.id)));
        else setSelectedRisks(new Set());
    };

    const handleExport = () => {
        const params = new URLSearchParams();
        if (reportDate) params.set('report_date', reportDate);
        if (validityDate) params.set('validity_date', validityDate);
        const query = params.toString() ? `?${params.toString()}` : '';
        window.open(`${API_BASE}/api/companies/${companyId}/risks/export${query}`, '_blank');
    };

    const handleCellChange = (id: number, field: keyof RiskItem, value: any) => {
        setRisks(prev => prev.map(item => {
            if (item.id !== id) return item;
            const updated = { ...item, [field]: value };

            if (field === 'initialSeverity') updated.finalSeverity = Number(value);

            if (field === 'finalProbability' && Number(value) > updated.initialProbability) {
                alert('Son Olasılık, İlk Olasılık değerinden büyük olamaz!');
                updated.finalProbability = updated.initialProbability;
            }
            if (field === 'finalFrequency' && Number(value) > updated.initialFrequency) {
                alert('Son Frekans, İlk Frekans değerinden büyük olamaz!');
                updated.finalFrequency = updated.initialFrequency;
            }
            if (field === 'initialProbability') {
                if (updated.finalProbability === 0 || updated.finalProbability > Number(value))
                    updated.finalProbability = Number(value);
            }
            if (field === 'initialFrequency') {
                if (updated.finalFrequency === 0 || updated.finalFrequency > Number(value))
                    updated.finalFrequency = Number(value);
            }

            updated.initialRiskScore = updated.initialProbability * updated.initialSeverity * updated.initialFrequency;
            updated.initialRiskLevel = getRiskLevel(updated.initialRiskScore);
            updated.finalRiskScore = updated.finalProbability * updated.finalSeverity * updated.finalFrequency;
            updated.finalRiskLevel = getRiskLevel(updated.finalRiskScore);

            return updated;
        }));
    };

    const handleCellBlur = async (id: number) => {
        const item = risks.find(r => r.id === id);
        if (!item) return;
        try {
            await fetch(`${API_BASE}/api/risks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        } catch {
            console.error('Update failed');
        }
    };

    if (showWizard) {
        return <RiskWizard companyId={companyId} onComplete={() => { setShowWizard(false); fetchRisks(); }} onCancel={() => setShowWizard(false)} />;
    }

    if (loading) return <div className={styles.loading}>Yükleniyor...</div>;

    const isValidityExpired = validityDate ? new Date(validityDate) < new Date() : false;

    return (
        <div className={styles.container}>
            {/* Firma Bilgileri Kartı */}
            <div className={styles.firmaBilgileri}>
                <div className={styles.firmaBilgileriHeader}>
                    <MIcon name="fact_check" size={20} className={styles.firmaBilgileriIcon} />
                    <span>Risk Değerlendirme Raporu Bilgileri</span>
                </div>
                <div className={styles.firmaBilgileriGrid}>
                    <div className={styles.firmaBilgileriField}>
                        <span className={styles.firmaBilgileriLabel}>Firma Unvanı</span>
                        <span className={styles.firmaBilgileriValue}>{companyInfo?.official_title || '—'}</span>
                    </div>
                    <div className={styles.firmaBilgileriField}>
                        <span className={styles.firmaBilgileriLabel}>SGK Sicil No</span>
                        <span className={`${styles.firmaBilgileriValue} ${styles.firmaBilgileriMono}`}>{companyInfo?.sgk_no || '—'}</span>
                    </div>
                    <div className={`${styles.firmaBilgileriField} ${styles.firmaBilgileriFieldWide}`}>
                        <span className={styles.firmaBilgileriLabel}>Firma Adresi</span>
                        <span className={styles.firmaBilgileriValue}>{companyInfo?.address || '—'}</span>
                    </div>
                    <div className={styles.firmaBilgileriField}>
                        <span className={styles.firmaBilgileriLabel}>Rapor Tarihi</span>
                        <input
                            type="date"
                            className={styles.firmaBilgileriDateInput}
                            value={reportDate}
                            onChange={e => handleReportDateChange(e.target.value)}
                        />
                    </div>
                    <div className={styles.firmaBilgileriField}>
                        <span className={styles.firmaBilgileriLabel}>Geçerlilik Tarihi</span>
                        <span className={`${styles.firmaBilgileriValue} ${validityDate ? (isValidityExpired ? styles.firmaBilgileriExpired : styles.firmaBilgileriValid) : ''}`}>
                            {validityDate ? formatDate(validityDate) : (reportDate ? '—' : 'Rapor tarihi giriniz')}
                            {validityDate && isValidityExpired && <span className={styles.firmaBilgileriExpiredBadge}> • Süresi Dolmuş</span>}
                        </span>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.filterGroup}>
                    <h3 className={styles.tabTitle}>Mevcut Risk Envanteri ({risks.length})</h3>
                </div>
                <div className={styles.actionButtons}>
                    {selectedRisks.size > 0 && (
                        <button className={styles.btnDanger} onClick={handleDeleteSelected}>
                            <MIcon name="delete" size={16} /> Seçili Olanları Sil ({selectedRisks.size})
                        </button>
                    )}
                    <button className={styles.wizardBtn} onClick={() => setShowWizard(true)}>
                        <MIcon name="auto_fix_high" size={16} /> Sihirbaz ile Başlat
                    </button>
                    <button className={styles.exportBtn} onClick={handleExport}>
                        <MIcon name="download" size={16} /> Excel Olarak İndir
                    </button>
                    <button className={styles.addBtn} onClick={handleAddEmptyRow}>
                        <MIcon name="add" size={16} /> Yeni Boş Satır Ekle
                    </button>
                </div>
            </div>

            {/* DataGrid — Inline Editable */}
            <div className={styles.tableCard}>
                <div className={styles.tableWrapper}>
                    <table className={styles.dataTable}>
                        <thead>
                            <tr className={styles.headerGroup}>
                                <th rowSpan={3} className={styles.actionCol}>
                                    <input
                                        type="checkbox"
                                        className={styles.rowCheckbox}
                                        checked={selectedRisks.size === risks.length && risks.length > 0}
                                        onChange={(e) => handleSelectAllRisks(e.target.checked)}
                                    />
                                </th>
                                <th rowSpan={3} className={styles.thSticky}>#</th>
                                <th rowSpan={3} className={styles.colWide}>Yapılan İş / Faaliyet / Ekipman</th>
                                <th rowSpan={3} className={styles.colWide}>Tehlike</th>
                                <th rowSpan={3} className={styles.colWide}>Risk / Olası Etki</th>
                                <th rowSpan={3} className={styles.colWide}>Mevcutta Alınan Önlemler</th>
                                <th colSpan={4} className={styles.groupHeaderInitial}>İlk Risk Değerleri</th>
                                <th rowSpan={3} className={styles.colWide}>Açıklama / Düzeltici ve Önleyici Tedbirler</th>
                                <th colSpan={4} className={styles.groupHeaderFinal}>Son Risk Değerleri</th>
                                <th rowSpan={3} className={styles.colMed}>Sorumlu</th>
                                <th rowSpan={3} className={styles.colMed}>Termin Süresi</th>
                                <th rowSpan={3} className={styles.actionCol}>İşlem</th>
                            </tr>
                            <tr className={styles.headerSub}>
                                <th colSpan={3} className={styles.subGroupInitial}>Risk Puanı = O × Ş × F</th>
                                <th rowSpan={2} className={`${styles.subGroupInitial} ${styles.colRiskLevel}`}>Risk Düzeyi</th>
                                <th colSpan={3} className={styles.subGroupFinal}>Risk Puanı = O × Ş × F</th>
                                <th rowSpan={2} className={`${styles.subGroupFinal} ${styles.colRiskLevel}`}>Risk Düzeyi</th>
                            </tr>
                            <tr className={styles.headerDetail}>
                                <th className={styles.colNarrow}>O</th>
                                <th className={styles.colNarrow}>Ş</th>
                                <th className={styles.colNarrow}>F</th>
                                <th className={styles.colNarrow}>O</th>
                                <th className={styles.colNarrow}>Ş</th>
                                <th className={styles.colNarrow}>F</th>
                            </tr>
                        </thead>
                        <tbody>
                            {risks.length === 0 ? (
                                <tr><td colSpan={18} className={styles.emptyState}>
                                    Henüz risk kaydı yok. "Sihirbaz ile Başlat" veya "Yeni Boş Satır Ekle" butonuna tıklayarak başlayabilirsiniz.
                                </td></tr>
                            ) : risks.map((item, idx) => {
                                const isSelected = selectedRisks.has(item.id);
                                return (
                                    <tr key={item.id} className={isSelected ? styles.selectedRow : ''}>
                                        <td className={styles.cellCenter}>
                                            <input
                                                type="checkbox"
                                                className={styles.rowCheckbox}
                                                checked={isSelected}
                                                onChange={() => handleToggleRisk(item.id)}
                                            />
                                        </td>
                                        <td className={styles.cellCenter}>{idx + 1}</td>

                                        <td className={styles.cellInput}>
                                            <textarea value={item.activity} onChange={e => handleCellChange(item.id, 'activity', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>
                                        <td className={styles.cellInput}>
                                            <textarea value={item.hazard} onChange={e => handleCellChange(item.id, 'hazard', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>
                                        <td className={styles.cellInput}>
                                            <textarea value={item.riskEffect} onChange={e => handleCellChange(item.id, 'riskEffect', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>
                                        <td className={styles.cellInput}>
                                            <textarea value={item.existingMeasures} onChange={e => handleCellChange(item.id, 'existingMeasures', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>

                                        {/* İlk Risk */}
                                        <td className={styles.cellInputCenter}>
                                            <select value={item.initialProbability} onChange={e => handleCellChange(item.id, 'initialProbability', Number(e.target.value))} onBlur={() => handleCellBlur(item.id)}>
                                                {PROBABILITY_OPTIONS.map(v => <option key={v} value={v}>{v || '—'}</option>)}
                                            </select>
                                        </td>
                                        <td className={styles.cellInputCenter}>
                                            <select value={item.initialSeverity} onChange={e => handleCellChange(item.id, 'initialSeverity', Number(e.target.value))} onBlur={() => handleCellBlur(item.id)}>
                                                {SEVERITY_OPTIONS.map(v => <option key={v} value={v}>{v || '—'}</option>)}
                                            </select>
                                        </td>
                                        <td className={styles.cellInputCenter}>
                                            <select value={item.initialFrequency} onChange={e => handleCellChange(item.id, 'initialFrequency', Number(e.target.value))} onBlur={() => handleCellBlur(item.id)}>
                                                {FREQUENCY_OPTIONS.map(v => <option key={v} value={v}>{v || '—'}</option>)}
                                            </select>
                                        </td>
                                        <td className={`${styles.cellRiskLevel} ${styles[`bg_${getRiskColor(item.initialRiskScore)}`]}`}>
                                            <strong className={styles.riskScore}>{item.initialRiskScore || '—'}</strong>
                                            <span className={styles.riskLevelText}>{item.initialRiskLevel}</span>
                                        </td>

                                        {/* Önlemler */}
                                        <td className={styles.cellInput}>
                                            <textarea value={item.correctiveMeasures} onChange={e => handleCellChange(item.id, 'correctiveMeasures', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>

                                        {/* Son Risk */}
                                        <td className={styles.cellInputCenter}>
                                            <select value={item.finalProbability} onChange={e => handleCellChange(item.id, 'finalProbability', Number(e.target.value))} onBlur={() => handleCellBlur(item.id)}>
                                                {PROBABILITY_OPTIONS.map(v => <option key={v} value={v}>{v || '—'}</option>)}
                                            </select>
                                        </td>
                                        <td className={`${styles.cellCenter} ${styles.cellDisabled}`} title="İlk Şiddet ile aynı olmak zorundadır">
                                            {item.finalSeverity || '—'}
                                        </td>
                                        <td className={styles.cellInputCenter}>
                                            <select value={item.finalFrequency} onChange={e => handleCellChange(item.id, 'finalFrequency', Number(e.target.value))} onBlur={() => handleCellBlur(item.id)}>
                                                {FREQUENCY_OPTIONS.map(v => <option key={v} value={v}>{v || '—'}</option>)}
                                            </select>
                                        </td>
                                        <td className={`${styles.cellRiskLevel} ${styles[`bg_${getRiskColor(item.finalRiskScore)}`]}`}>
                                            <strong className={styles.riskScore}>{item.finalRiskScore || '—'}</strong>
                                            <span className={styles.riskLevelText}>{item.finalRiskLevel}</span>
                                        </td>

                                        {/* Sorumlu ve Termin */}
                                        <td className={styles.cellInput}>
                                            <input value={item.responsiblePerson} onChange={e => handleCellChange(item.id, 'responsiblePerson', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>
                                        <td className={styles.cellInput}>
                                            <input value={item.deadline} onChange={e => handleCellChange(item.id, 'deadline', e.target.value)} onBlur={() => handleCellBlur(item.id)} />
                                        </td>

                                        <td className={styles.actionCol}>
                                            <button className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => handleDelete(item.id)} title="Sil"><MIcon name="delete" size={15} /></button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <div className={styles.pagination}>
                    <span className={styles.pageInfo}>Toplam {risks.length} risk kaydı. (Hücrelere tıklayarak doğrudan düzenleyebilirsiniz)</span>
                </div>
            </div>
        </div>
    );
};

export default RiskAssessmentTab;
