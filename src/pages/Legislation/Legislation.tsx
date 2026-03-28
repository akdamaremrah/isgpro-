import React, { useState, useMemo, useCallback, useEffect } from 'react';
import * as XLSX from 'xlsx';
import MIcon from '../../components/MIcon';
import { motion, AnimatePresence } from 'framer-motion';
import { legislationData } from '../../data/legislationData';
import type { Regulation } from '../../data/legislationData';
import styles from './Legislation.module.css';
import { API_BASE } from '../../config/api';
import { apiFetch } from '../../api/client';

// ── Geçerli Material Icons listesi (section header ikonları için) ──────────────
const VALID_ICONS = new Set([
    'description','gavel','health_and_safety','engineering','warning','fire_extinguisher',
    'local_fire_department','medical_services','school','assignment','fact_check',
    'verified_user','security','policy','report','build','construction','electrical_services',
    'bolt','water','air','thermostat','speed','science','inventory_2','warehouse',
    'local_shipping','directions_car','business_center','badge','groups','monitor_heart',
    'emergency','accessible','visibility','lock','key','admin_panel_settings','folder',
    'article','checklist','task_alt','done_all','rule','list_alt','format_list_bulleted',
    'settings','tune','handyman','plumbing','architecture','foundation','domain','apartment',
    'eco','recycling','compost','public','grass','agriculture','landscape','wb_sunny',
    'electric_bolt','cable','power','battery_charging_full','sensors','router','devices',
    'calculate','straighten','scale','biotech','microscope','hub','lab_research',
]);
const safeIcon = (name?: string | null) => (name && VALID_ICONS.has(name) ? name : 'folder');

// ── Types ─────────────────────────────────────────────────────────────────────
type ModalTab   = 'content' | 'checklist';
type CheckResult = 'uygun' | 'uygunsuz' | 'na' | null;

interface ChecklistItem {
    madde: string;
    kontrol: string;
    referans: string;
    risk_seviyesi: 'yüksek' | 'orta' | 'düşük';
}
interface ChecklistSection { section: string; icon: string; items: ChecklistItem[]; }
type ChecklistData = ChecklistSection[];
type ResultsMap   = Record<string, CheckResult>;
interface Company  { id: number; unvan: string; short_name?: string; tehlikeSinifi?: string; sgkSicilNo?: string; }
interface Stats    { total: number; checked: number; uygun: number; uygunsuz: number; na: number; pct: number; }

const LS_CL    = 'isg_checklists_v3';   // v3: sayısal değerler + derinlemesine analiz
const LS_RES   = 'isg_checklist_results_v3';
const LS_TMPL  = 'isg_cl_templates_v1';

// ── Helpers ───────────────────────────────────────────────────────────────────
const riskClass = (l: string) => l === 'yüksek' ? styles.riskHigh : l === 'orta' ? styles.riskMid : styles.riskLow;
const riskLabel = (l: string) => l === 'yüksek' ? '⚠ Yüksek Risk' : l === 'orta' ? '● Orta Risk' : '○ Düşük Risk';
const resultLabel = (r: CheckResult) => r === 'uygun' ? 'Uygun' : r === 'uygunsuz' ? 'Uygun Değil' : r === 'na' ? 'Uygulama Yok' : 'Kontrol Edilmedi';

// ── Excel export ──────────────────────────────────────────────────────────────
function exportExcel(reg: Regulation, sections: ChecklistData, rm: ResultsMap) {
    const rows: (string | number)[][] = [];
    rows.push(['Yönetmelik:', reg.title]);
    rows.push(['Kategori:', reg.category]);
    rows.push(['Denetim Tarihi:', new Date().toLocaleDateString('tr-TR')]);
    rows.push([]);
    rows.push(['Bölüm', 'Madde No', 'Kontrol Maddesi', 'Referans / Standart', 'Risk Seviyesi', 'Sonuç']);
    sections.forEach((sec, si) => {
        sec.items.forEach((item, ii) => {
            const r = rm[`${si}-${ii}`] ?? null;
            rows.push([sec.section, item.madde, item.kontrol, item.referans, item.risk_seviyesi, resultLabel(r)]);
        });
    });
    const total    = sections.reduce((a, s) => a + s.items.length, 0);
    const uygun    = Object.values(rm).filter(v => v === 'uygun').length;
    const uygunsuz = Object.values(rm).filter(v => v === 'uygunsuz').length;
    const na       = Object.values(rm).filter(v => v === 'na').length;
    rows.push([]);
    rows.push(['ÖZET', '', `Toplam: ${total}`, `Uygun: ${uygun}`, `Uygun Değil: ${uygunsuz}`, `Uygulama Yok: ${na}`, `Kontrol Edilmedi: ${total - uygun - uygunsuz - na}`]);
    const ws = XLSX.utils.aoa_to_sheet(rows);
    ws['!cols'] = [{ wch: 40 }, { wch: 12 }, { wch: 80 }, { wch: 50 }, { wch: 14 }, { wch: 18 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Kontrol Listesi');
    XLSX.writeFile(wb, `${reg.title.slice(0, 50).replace(/[/\\?%*:|"<>]/g, '_')}_kontrol_listesi.xlsx`);
}

// ── DonutChart ────────────────────────────────────────────────────────────────
const DonutChart: React.FC<{ stats: Stats }> = ({ stats }) => {
    const { total, uygun, uygunsuz, na } = stats;
    if (total === 0 || stats.checked === 0) return null;
    const p1 = (uygun / total) * 100;
    const p2 = ((uygun + uygunsuz) / total) * 100;
    const p3 = ((uygun + uygunsuz + na) / total) * 100;
    const bg = `conic-gradient(#16a34a 0% ${p1}%, #dc2626 ${p1}% ${p2}%, #94a3b8 ${p2}% ${p3}%, #e2e8f0 ${p3}% 100%)`;
    const unchecked = total - uygun - uygunsuz - na;
    return (
        <div className={styles.donutWrap}>
            <div className={styles.donut} style={{ background: bg }}>
                <div className={styles.donutInner}>
                    <span className={styles.donutPct}>{Math.round(p1)}%</span>
                    <span className={styles.donutSub}>uygun</span>
                </div>
            </div>
            <div className={styles.donutLegend}>
                {uygun > 0 && (
                    <div className={styles.legendItem}>
                        <span className={styles.dot} style={{ background: '#16a34a' }} />
                        <span>{uygun} Uygun</span>
                    </div>
                )}
                {uygunsuz > 0 && (
                    <div className={styles.legendItem}>
                        <span className={styles.dot} style={{ background: '#dc2626' }} />
                        <span>{uygunsuz} Uygun Değil</span>
                    </div>
                )}
                {na > 0 && (
                    <div className={styles.legendItem}>
                        <span className={styles.dot} style={{ background: '#94a3b8' }} />
                        <span>{na} Uygulama Yok</span>
                    </div>
                )}
                {unchecked > 0 && (
                    <div className={styles.legendItem}>
                        <span className={styles.dot} style={{ background: '#e2e8f0' }} />
                        <span>{unchecked} Bekliyor</span>
                    </div>
                )}
            </div>
        </div>
    );
};

// ── ChecklistRow ──────────────────────────────────────────────────────────────
const ChecklistRow: React.FC<{
    item: ChecklistItem;
    rowKey: string;
    result: CheckResult;
    onResult: (key: string, val: CheckResult) => void;
    index: number;
    fillable: boolean;
}> = ({ item, rowKey, result, onResult, index, fillable }) => {
    // Sayısal değerleri (ölçü, süre, yüzde, limit) mavi highlight ile göster
    const highlightNumbers = (text: string): string => {
        // Sayı + birim grupları: "120 cm", "6 bar", "%40", "2 kez", "85 dB", "50 lüks" vb.
        return text.replace(
            /(\d+(?:[.,]\d+)?)\s*(cm|mm|m²|m³|m\b|km|kg|ton|bar|°C|°F|kPa|kW|kVA|V\b|A\b|Hz|dB|lüks|lux|lx|%|adet|kez|saat|dakika|saniye|gün|ay|yıl|lt|litre|L\b|mA|Ω|N\b|kN|MΩ)|(%\s*\d+(?:[.,]\d+)?)|(\d+(?:[.,]\d+)?\s*(?:ile|ve|ila|-)?\s*\d+(?:[.,]\d+)?\s*(?:cm|mm|m|kg|bar|°C|%|lüks|dB|V|A|kW))/g,
            (match) => `<span class="num-highlight">${match}</span>`
        );
    };

    return (
        <div className={`${styles.clRow} ${fillable && result ? styles[`clRow_${result}`] : ''}`}>
            <div className={styles.clRowLeft}>
                <span className={styles.clIndex}>{index}</span>
                <div className={styles.clContent}>
                    <div className={styles.clTop}>
                        {item.madde && item.madde !== '—' && (
                            <span className={styles.clMadde}>{item.madde}</span>
                        )}
                        <span className={`${styles.riskBadge} ${riskClass(item.risk_seviyesi)}`}>
                            {riskLabel(item.risk_seviyesi)}
                        </span>
                    </div>
                    <p
                        className={styles.clKontrol}
                        dangerouslySetInnerHTML={{ __html: highlightNumbers(item.kontrol) }}
                    />
                    {item.referans && (
                        <div className={styles.clRef}>
                            <MIcon name="menu_book" size={12} />
                            <span>{item.referans}</span>
                        </div>
                    )}
                </div>
            </div>
            {fillable && (
                <div className={styles.clOptions}>
                    <button
                        className={`${styles.clOpt} ${result === 'uygun' ? styles.optUygun : ''}`}
                        onClick={() => onResult(rowKey, result === 'uygun' ? null : 'uygun')}
                    >
                        <MIcon name="check" size={14} />Uygun
                    </button>
                    <button
                        className={`${styles.clOpt} ${result === 'uygunsuz' ? styles.optUygunsuz : ''}`}
                        onClick={() => onResult(rowKey, result === 'uygunsuz' ? null : 'uygunsuz')}
                    >
                        <MIcon name="close" size={14} />Uygun Değil
                    </button>
                    <button
                        className={`${styles.clOpt} ${result === 'na' ? styles.optNa : ''}`}
                        onClick={() => onResult(rowKey, result === 'na' ? null : 'na')}
                    >
                        <MIcon name="remove" size={14} />Uygulama Yok
                    </button>
                </div>
            )}
        </div>
    );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const Legislation: React.FC = () => {
    const [searchTerm,  setSearchTerm]  = useState('');
    const [viewingReg,  setViewingReg]  = useState<Regulation | null>(null);
    const [activeTab,   setActiveTab]   = useState<ModalTab>('content');

    const [checklists, setChecklists] = useState<Record<string, ChecklistData>>({});
    const [results,    setResults]    = useState<Record<string, ResultsMap>>({});
    const [clLoading,  setClLoading]  = useState(false);
    const [clError,    setClError]    = useState<string | null>(null);

    // Company seçimi & dolum
    const [companyModal,   setCompanyModal]   = useState(false);
    const [companies,      setCompanies]      = useState<Company[]>([]);
    const [compSearch,     setCompSearch]     = useState('');
    const [compLoading,    setCompLoading]    = useState(false);
    const [activeCompany,  setActiveCompany]  = useState<Company | null>(null); // dolum için seçili firma
    const [saveSuccess,    setSaveSuccess]    = useState<string | null>(null);
    const [tmplSuccess,    setTmplSuccess]    = useState(false);

    // Load from localStorage (eski key'lerden migration dahil)
    useEffect(() => {
        try {
            // v3: eski versiyon listeler kasıtlı olarak taşınmıyor (prompt güncellendi)
            const cl = localStorage.getItem(LS_CL);
            if (cl) { setChecklists(JSON.parse(cl)); }
            const res = localStorage.getItem(LS_RES);
            if (res) { setResults(JSON.parse(res)); }
        } catch {}
    }, []);

    useEffect(() => {
        if (Object.keys(checklists).length > 0)
            localStorage.setItem(LS_CL, JSON.stringify(checklists));
    }, [checklists]);

    useEffect(() => {
        if (Object.keys(results).length > 0)
            localStorage.setItem(LS_RES, JSON.stringify(results));
    }, [results]);

    const filteredLegislation = useMemo(() =>
        legislationData
            .filter(r => r.title.toLocaleLowerCase('tr-TR').includes(searchTerm.toLocaleLowerCase('tr-TR')))
            .sort((a, b) => a.title.localeCompare(b.title, 'tr-TR')),
        [searchTerm]
    );

    const openModal = (reg: Regulation) => {
        setViewingReg(reg);
        setActiveTab(reg.content ? 'content' : 'checklist');
        setClError(null);
    };

    const generateChecklist = useCallback(async (reg: Regulation, force = false) => {
        if (checklists[reg.id] && !force) return;
        setClLoading(true);
        setClError(null);

        try {
            // 1. İsteği başlat, hemen job_id al
            const res = await apiFetch(`${API_BASE}/api/generate-regulation-checklist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: reg.title, category: reg.category, content: reg.content ?? '' }),
            });
            const init = await res.json();
            if (!res.ok) throw new Error(init.error ?? `Sunucu hatası (${res.status})`);
            const jobId: string = init.job_id;

            // 2. Tamamlanana kadar poll et (2sn aralık, max 5dk)
            const deadline = Date.now() + 5 * 60 * 1000;
            while (Date.now() < deadline) {
                await new Promise(r => setTimeout(r, 2000));
                const poll = await apiFetch(`${API_BASE}/api/jobs/${jobId}`);
                const job = await poll.json();
                if (job.status === 'done') {
                    const sections = job.result?.sections ?? job.result;
                    if (!sections || sections.length === 0)
                        throw new Error('Sunucu boş kontrol listesi döndürdü. Tekrar deneyin.');
                    if (force)
                        setChecklists(prev => { const n = { ...prev }; delete n[reg.id]; return n; });
                    setChecklists(prev => ({ ...prev, [reg.id]: sections }));
                    return;
                }
                if (job.status === 'error')
                    throw new Error(job.error ?? 'Oluşturma başarısız');
            }
            throw new Error('Zaman aşımı — lütfen tekrar deneyin.');
        } catch (e: unknown) {
            setClError(e instanceof Error ? e.message : 'Bilinmeyen hata');
        } finally {
            setClLoading(false);
        }
    }, [checklists]);

    const handleTabChange = (tab: ModalTab) => {
        setActiveTab(tab);
        if (tab === 'checklist' && viewingReg && !checklists[viewingReg.id])
            generateChecklist(viewingReg);
    };

    // resultKey: firma seçiliyse firmaya özel, yoksa genel
    const resultKey = (regId: string) => activeCompany ? `${regId}_c${activeCompany.id}` : `${regId}_generic`;

    const setResult = (regId: string, key: string, val: CheckResult) => {
        const rk = resultKey(regId);
        setResults(prev => ({ ...prev, [rk]: { ...(prev[rk] ?? {}), [key]: val } }));
    };

    const getStats = (regId: string, sections: ChecklistData, company?: Company | null): Stats => {
        const rk = company ? `${regId}_c${company.id}` : resultKey(regId);
        const rm = results[rk] ?? {};
        let total = 0, uygun = 0, uygunsuz = 0, na = 0;
        sections.forEach((s, si) => s.items.forEach((_, ii) => {
            total++;
            const r = rm[`${si}-${ii}`];
            if (r === 'uygun')    uygun++;
            if (r === 'uygunsuz') uygunsuz++;
            if (r === 'na')       na++;
        }));
        const checked = uygun + uygunsuz + na;
        return { total, checked, uygun, uygunsuz, na, pct: total ? Math.round(checked / total * 100) : 0 };
    };

    const regenChecklist = (reg: Regulation) => {
        setChecklists(prev => { const n = { ...prev }; delete n[reg.id]; return n; });
        setResults(prev => {
            const n = { ...prev };
            Object.keys(n).filter(k => k.startsWith(reg.id)).forEach(k => delete n[k]);
            return n;
        });
        setActiveCompany(null);
        setTimeout(() => generateChecklist(reg), 50);
    };

    // ── Firma seçimi (dolum moduna geçiş) ────────────────────────────────────
    const openCompanyModal = async () => {
        setCompanyModal(true);
        setCompSearch('');
        setCompLoading(true);
        try {
            const res = await apiFetch(`${API_BASE}/api/companies`);
            const data = await res.json();
            setCompanies(Array.isArray(data) ? data : []);
        } catch {
            setCompanies([]);
        } finally {
            setCompLoading(false);
        }
    };

    // Firma seçilince → aktif company set et, dolum moduna gir
    const selectCompanyForFill = (company: Company) => {
        setActiveCompany(company);
        setCompanyModal(false);
    };

    // Dolumu kaydet
    const saveForCompany = () => {
        if (!viewingReg || !activeCompany) return;
        const sections = checklists[viewingReg.id];
        const rk       = resultKey(viewingReg.id);
        const rm       = results[rk] ?? {};
        const stats    = getStats(viewingReg.id, sections, activeCompany);
        const record   = {
            regId: viewingReg.id,
            title: viewingReg.title,
            category: viewingReg.category,
            savedAt: new Date().toISOString(),
            stats,
            results: rm,
            sections,
        };
        const key      = `company_cl_${activeCompany.id}`;
        const existing: any[] = JSON.parse(localStorage.getItem(key) ?? '[]');
        const idx      = existing.findIndex(r => r.regId === viewingReg.id);
        if (idx >= 0) existing[idx] = record;
        else existing.push(record);
        localStorage.setItem(key, JSON.stringify(existing));
        setSaveSuccess(activeCompany.short_name ?? activeCompany.unvan);
        setTimeout(() => setSaveSuccess(null), 4000);
    };

    // ── Şablon Kaydet ─────────────────────────────────────────────────────────
    const saveAsTemplate = () => {
        if (!viewingReg || !checklists[viewingReg.id]) return;
        const templates: any[] = JSON.parse(localStorage.getItem(LS_TMPL) ?? '[]');
        const tmpl = {
            id: viewingReg.id,
            title: viewingReg.title,
            category: viewingReg.category,
            sections: checklists[viewingReg.id],
            savedAt: new Date().toISOString(),
        };
        const idx = templates.findIndex(t => t.id === viewingReg.id);
        if (idx >= 0) templates[idx] = tmpl;
        else templates.push(tmpl);
        localStorage.setItem(LS_TMPL, JSON.stringify(templates));
        setTmplSuccess(true);
        setTimeout(() => setTmplSuccess(false), 3000);
    };

    const filteredCompanies = useMemo(() =>
        companies.filter(c => (c.unvan ?? '').toLocaleLowerCase('tr-TR').includes(compSearch.toLocaleLowerCase('tr-TR'))),
        [companies, compSearch]
    );

    const renderChecklist = (regId: string) => {
        const sections = checklists[regId];
        if (!sections || !Array.isArray(sections) || clLoading) return null;
        const fillable = !!activeCompany;
        const rk       = resultKey(regId);
        const rm       = fillable ? (results[rk] ?? {}) : {};
        const stats    = getStats(regId, sections, activeCompany);
        let rowCounter = 0;
        return (
            <div className={styles.clBody}>
                {/* Firma seçim / durum satırı */}
                {!fillable ? (
                    <div className={styles.clSelectCompanyBanner}>
                        <div className={styles.clSelectCompanyLeft}>
                            <MIcon name="info" size={18} />
                            <div>
                                <strong>Doldurmak için önce firma seçin</strong>
                                <span>Kontrol listesi bir firmaya bağlandıktan sonra doldurulabilir.</span>
                            </div>
                        </div>
                        <div className={styles.clBannerActions}>
                            <button className={styles.clRegenVisibleBtn} onClick={() => viewingReg && regenChecklist(viewingReg)}>
                                <MIcon name="refresh" size={15} />Yeniden Oluştur
                            </button>
                            <button className={styles.clApplyBtn} onClick={openCompanyModal}>
                                <MIcon name="business" size={15} />Firma Seç
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.clActiveFirmaBanner}>
                        <div className={styles.clActiveFirmaLeft}>
                            <div className={styles.clActiveFirmaIcon}><MIcon name="business" size={18} /></div>
                            <div>
                                <span className={styles.clActiveFirmaLabel}>Aktif Firma</span>
                                <strong className={styles.clActiveFirmaName}>{activeCompany.unvan}</strong>
                            </div>
                        </div>
                        <div className={styles.clActiveFirmaActions}>
                            <button className={styles.clChangeFirmaBtn} onClick={openCompanyModal}>
                                <MIcon name="swap_horiz" size={15} />Değiştir
                            </button>
                            <button className={styles.clRegenBtn} onClick={() => setActiveCompany(null)} title="Firmayı kaldır">
                                <MIcon name="close" size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Toolbar (sadece doldurulabilir modda) */}
                {fillable && (
                    <div className={styles.clToolbar}>
                        <div className={styles.clToolbarTop}>
                            <div className={styles.clProgress}>
                                <div className={styles.clProgressStats}>
                                    <span><strong>{stats.checked}</strong>/{stats.total} kontrol edildi</span>
                                    <span className={styles.uygunStat}><MIcon name="check_circle" size={13} />{stats.uygun} uygun</span>
                                    <span className={styles.uygunsuzStat}><MIcon name="cancel" size={13} />{stats.uygunsuz} uygun değil</span>
                                    <span className={styles.naStat}><MIcon name="remove_circle" size={13} />{stats.na} yok</span>
                                </div>
                                <div className={styles.clProgressBar}>
                                    <div className={styles.clProgressFill} style={{ width: `${stats.pct}%` }} />
                                </div>
                            </div>
                            <div className={styles.clToolbarActions}>
                                <button className={styles.clTmplBtn} onClick={saveAsTemplate}>
                                    <MIcon name="bookmark_add" size={15} />Şablon
                                </button>
                                <button className={styles.clExcelBtn} onClick={() => exportExcel(viewingReg!, sections, rm)}>
                                    <MIcon name="table_view" size={15} />Excel
                                </button>
                                <button className={styles.clRegenVisibleBtn} onClick={() => viewingReg && regenChecklist(viewingReg)} title="Listeyi yeniden oluştur">
                                    <MIcon name="refresh" size={15} />Yeniden Oluştur
                                </button>
                            </div>
                        </div>
                        {stats.checked > 0 && (
                            <div className={styles.clInfographic}>
                                <DonutChart stats={stats} />
                                <div className={styles.clComplianceScore}>
                                    <span className={styles.complianceLabel}>Uyumluluk Skoru</span>
                                    <span className={styles.complianceValue} style={{
                                        color: stats.uygun / stats.total > 0.7 ? '#16a34a' :
                                               stats.uygun / stats.total > 0.4 ? '#d97706' : '#dc2626'
                                    }}>
                                        {Math.round((stats.uygun / stats.total) * 100)}%
                                    </span>
                                    <span className={styles.complianceNote}>
                                        {stats.uygun / stats.total >= 0.85 ? '✓ İyi düzey uyum' :
                                         stats.uygun / stats.total >= 0.60 ? '⚠ Orta düzey uyum' :
                                         '✗ Düşük uyum — aksiyon gerekli'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Sections */}
                {sections.map((sec, si) => (
                    <div key={si} className={styles.clSection}>
                        <div className={styles.clSectionHeader}>
                            <span className={styles.clSectionIcon}>
                                <MIcon name={safeIcon(sec.icon)} size={18} />
                            </span>
                            <h4>{sec.section}</h4>
                            <span className={styles.clSectionCount}>{sec.items.length} madde</span>
                        </div>
                        <div className={styles.clRows}>
                            {sec.items.map((item, ii) => {
                                rowCounter++;
                                return (
                                    <ChecklistRow
                                        key={ii}
                                        item={item}
                                        rowKey={`${si}-${ii}`}
                                        result={rm[`${si}-${ii}`] ?? null}
                                        onResult={(key, val) => setResult(regId, key, val)}
                                        index={rowCounter}
                                        fillable={fillable}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Kaydet butonu — sayfanın en altında */}
                {fillable && (
                    <div className={styles.clSaveFooter}>
                        <div className={styles.clSaveFooterInfo}>
                            <MIcon name="info" size={15} />
                            <span><strong>{stats.checked}</strong>/{stats.total} madde kontrol edildi &nbsp;·&nbsp; Uygun: <strong>{stats.uygun}</strong> &nbsp;·&nbsp; Uygun Değil: <strong>{stats.uygunsuz}</strong></span>
                        </div>
                        <button className={styles.clSaveBtn} onClick={saveForCompany}>
                            <MIcon name="save" size={16} />
                            Kaydet — {activeCompany!.short_name ?? activeCompany!.unvan}
                        </button>
                    </div>
                )}
            </div>
        );
    };

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
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.grid}>
                <AnimatePresence mode="popLayout">
                    {filteredLegislation.length > 0 ? filteredLegislation.map(reg => (
                        <motion.div
                            key={reg.id}
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`${styles.card} ${checklists[reg.id] ? styles.cardReady : ''}`}
                        >
                            <div className={styles.cardHeader}>
                                <div className={styles.categoryTag}>{reg.category}</div>
                                <MIcon name="auto_stories" className={styles.cardIcon} size={20} />
                            </div>
                            <h3 className={styles.cardTitle}>{reg.title}</h3>
                            {checklists[reg.id] && (
                                <div className={styles.cardSavedBadge}>
                                    <MIcon name="fact_check" size={12} />
                                    <span>Kontrol listesi hazır</span>
                                </div>
                            )}
                            <div className={styles.cardActions}>
                                <button className={styles.readBtn} onClick={() => openModal(reg)}>
                                    <MIcon name="checklist" size={16} />
                                    <span>İncele</span>
                                </button>
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
                    )) : (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={styles.emptyState}>
                            <MIcon name="search_off" size={48} />
                            <p>Aradığınız kriterlere uygun yönetmelik bulunamadı.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Uygulama başarı toast ── */}
            <AnimatePresence>
                {saveSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className={styles.successToast}
                    >
                        <MIcon name="check_circle" size={18} />
                        <span><strong>{saveSuccess}</strong> firması için kaydedildi.</span>
                    </motion.div>
                )}
                {tmplSuccess && (
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 40 }}
                        className={styles.successToast}
                    >
                        <MIcon name="bookmark_added" size={18} />
                        <span>Şablon olarak kaydedildi.</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Firma seçim modalı ── */}
            <AnimatePresence>
                {companyModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className={styles.compModalOverlay}
                        onClick={() => setCompanyModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                            className={styles.compModalBox}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className={styles.compModalHeader}>
                                <div>
                                    <h3>Firmaya Uygula</h3>
                                    <p>Kontrol listesini hangi firmaya uygulamak istiyorsunuz?</p>
                                </div>
                                <button className={styles.closeBtn} onClick={() => setCompanyModal(false)}>&times;</button>
                            </div>
                            <div className={styles.compModalSearch}>
                                <MIcon name="search" size={16} />
                                <input
                                    type="text"
                                    placeholder="Firma ara…"
                                    value={compSearch}
                                    onChange={e => setCompSearch(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className={styles.compList}>
                                {compLoading && (
                                    <div className={styles.compLoading}>
                                        <div className={styles.clSpinner} />
                                        <span>Firmalar yükleniyor…</span>
                                    </div>
                                )}
                                {!compLoading && filteredCompanies.length === 0 && (
                                    <div className={styles.compEmpty}>
                                        <MIcon name="business_center" size={36} />
                                        <p>Firma bulunamadı.</p>
                                    </div>
                                )}
                                {!compLoading && filteredCompanies.map(c => (
                                    <button key={c.id} className={styles.compItem} onClick={() => selectCompanyForFill(c)}>
                                        <div className={styles.compItemIcon}>
                                            <MIcon name="business" size={18} />
                                        </div>
                                        <div className={styles.compItemInfo}>
                                            <span className={styles.compItemName}>{c.unvan}</span>
                                            <span className={styles.compItemSector}>
                                                {c.sgkSicilNo ? `SGK Sicil: ${c.sgkSicilNo}` : 'SGK Sicil No yok'}
                                            </span>
                                        </div>
                                        <MIcon name="arrow_forward" size={16} className={styles.compItemArrow} />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Ana Modal ── */}
            <AnimatePresence>
                {viewingReg && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className={styles.modalOverlay}
                        onClick={() => setViewingReg(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}
                            className={styles.modalContent}
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className={styles.modalHeader}>
                                <div className={styles.modalHeaderLeft}>
                                    <span className={styles.modalCatTag}>{viewingReg.category}</span>
                                    <h2>{viewingReg.title}</h2>
                                </div>
                                <div className={styles.modalHeaderRight}>
                                    {viewingReg.mbs_link && (
                                        <a href={viewingReg.mbs_link} target="_blank" rel="noreferrer" className={styles.linkBtn}>
                                            <MIcon name="open_in_new" size={15} />
                                            MBS'de Görüntüle
                                        </a>
                                    )}
                                    <button className={styles.closeBtn} onClick={() => setViewingReg(null)}>&times;</button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className={styles.modalTabs}>
                                {viewingReg.content && (
                                    <button
                                        className={`${styles.modalTab} ${activeTab === 'content' ? styles.activeTab : ''}`}
                                        onClick={() => handleTabChange('content')}
                                    >
                                        <MIcon name="description" size={16} /> Mevzuat Özeti
                                    </button>
                                )}
                                <button
                                    className={`${styles.modalTab} ${activeTab === 'checklist' ? styles.activeTab : ''}`}
                                    onClick={() => handleTabChange('checklist')}
                                >
                                    <MIcon name="fact_check" size={16} /> Denetim Kontrol Listesi
                                    {checklists[viewingReg.id] && (
                                        <span className={styles.tabBadge}>
                                            {checklists[viewingReg.id].reduce((a, s) => a + s.items.length, 0)}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Body */}
                            <div className={styles.modalBody}>
                                {activeTab === 'content' && viewingReg.content && (
                                    <pre className={styles.contentArea}>{viewingReg.content}</pre>
                                )}

                                {activeTab === 'checklist' && (
                                    <div className={styles.clContainer}>
                                        {clLoading && (
                                            <div className={styles.clLoading}>
                                                <div className={styles.clSpinner} />
                                                <p>YZ ile kapsamlı denetim kontrol listesi oluşturuluyor…</p>
                                                <span>Bu işlem 20-60 saniye sürebilir, lütfen bekleyin</span>
                                            </div>
                                        )}

                                        {clError && !clLoading && (
                                            <div className={styles.clError}>
                                                <MIcon name="error" size={32} />
                                                <p>{clError}</p>
                                                <button className={styles.clRetryBtn} onClick={() => { setClError(null); generateChecklist(viewingReg); }}>
                                                    Tekrar Dene
                                                </button>
                                            </div>
                                        )}

                                        {!checklists[viewingReg.id] && !clLoading && !clError && (
                                            <div className={styles.clEmpty}>
                                                <MIcon name="fact_check" size={48} />
                                                <h3>Denetim Kontrol Listesi</h3>
                                                <p>Bu yönetmelik için madde numaraları ve teknik standartlar içeren profesyonel denetim listesi oluşturun. Sonuçlar kaydedilir, bir daha üretmeniz gerekmez.</p>
                                                <button className={styles.clGenerateBtn} onClick={() => generateChecklist(viewingReg)}>
                                                    <MIcon name="auto_awesome" size={18} />
                                                    YZ ile Kontrol Listesi Oluştur
                                                </button>
                                            </div>
                                        )}

                                        {renderChecklist(viewingReg.id)}
                                    </div>
                                )}
                            </div>

                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Legislation;
