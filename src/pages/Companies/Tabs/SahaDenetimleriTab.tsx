import React, { useState, useMemo, useCallback, useEffect } from 'react';
import MIcon from '../../../components/MIcon';
import styles from './SahaDenetimleriTab.module.css';

// ── Types ─────────────────────────────────────────────────────────────────────
interface DenetimStats {
    total: number; checked: number;
    uygun: number; uygunsuz: number; na: number; pct: number;
}
type CheckResult = 'uygun' | 'uygunsuz' | 'na' | null;
interface DenetimSection {
    section: string; icon: string;
    items: { madde: string; kontrol: string; referans: string; risk_seviyesi: string }[];
}
interface DenetimRecord {
    regId: string; title: string; category: string; savedAt: string;
    stats: DenetimStats;
    results: Record<string, CheckResult>;
    sections: DenetimSection[];
}

// ── Geçerli Material Icons (hizalama bozulmasın diye) ─────────────────────────
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const calcStats = (sections: DenetimSection[], results: Record<string, CheckResult>): DenetimStats => {
    let total = 0, uygun = 0, uygunsuz = 0, na = 0;
    sections.forEach((sec, si) => sec.items.forEach((_, ii) => {
        total++;
        const r = results[`${si}-${ii}`];
        if (r === 'uygun') uygun++;
        else if (r === 'uygunsuz') uygunsuz++;
        else if (r === 'na') na++;
    }));
    const checked = uygun + uygunsuz + na;
    return { total, checked, uygun, uygunsuz, na, pct: total ? Math.round(uygun / total * 100) : 0 };
};

const LS_KEY = (cid: string) => `company_cl_${cid}`;

const loadRecords = (companyId: string): DenetimRecord[] => {
    try {
        const raw = localStorage.getItem(LS_KEY(companyId));
        if (!raw) return [];
        const data = JSON.parse(raw);
        return Array.isArray(data)
            ? data.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime())
            : [];
    } catch { return []; }
};

const saveRecords = (companyId: string, records: DenetimRecord[]) => {
    localStorage.setItem(LS_KEY(companyId), JSON.stringify(records));
};

// ── Donut Chart ───────────────────────────────────────────────────────────────
const DonutChart: React.FC<{ stats: DenetimStats; size?: number; holeClass?: string }> = ({ stats, size = 96, holeClass }) => {
    const { uygun, uygunsuz, na, total } = stats;
    if (total === 0) return null;
    const p1 = (uygun / total) * 100;
    const p2 = ((uygun + uygunsuz) / total) * 100;
    const p3 = ((uygun + uygunsuz + na) / total) * 100;
    const bg = `conic-gradient(#16a34a 0% ${p1}%, #dc2626 ${p1}% ${p2}%, #94a3b8 ${p2}% ${p3}%, #e2e8f0 ${p3}% 100%)`;
    const hole = Math.round(size * 0.32);
    const pct  = Math.round((uygun / total) * 100);
    const scoreColor = pct >= 85 ? '#16a34a' : pct >= 60 ? '#d97706' : '#dc2626';
    return (
        <div className={styles.donut} style={{ width: size, height: size, background: bg }}>
            <div className={`${styles.donutHole} ${holeClass ?? ''}`} style={{ inset: hole }}>
                <span className={styles.donutPct} style={{ color: scoreColor, fontSize: size * 0.155 }}>{pct}%</span>
            </div>
        </div>
    );
};

// ── Score Badge ───────────────────────────────────────────────────────────────
const ScoreBadge: React.FC<{ pct: number }> = ({ pct }) =>
    pct >= 85 ? <span className={`${styles.scoreBadge} ${styles.scoreGood}`}>İyi Uyum</span> :
    pct >= 60 ? <span className={`${styles.scoreBadge} ${styles.scoreMid}`}>Orta Uyum</span> :
                <span className={`${styles.scoreBadge} ${styles.scoreLow}`}>Düşük Uyum</span>;

// ── Result Pill (view) ────────────────────────────────────────────────────────
const ResultPill: React.FC<{ result: CheckResult }> = ({ result }) =>
    result === 'uygun'    ? <span className={`${styles.pill} ${styles.pillUygun}`}>Uygun</span> :
    result === 'uygunsuz' ? <span className={`${styles.pill} ${styles.pillUygunsuz}`}>Uygun Değil</span> :
    result === 'na'       ? <span className={`${styles.pill} ${styles.pillNa}`}>Uyg. Yok</span> :
                            <span className={`${styles.pill} ${styles.pillPending}`}>—</span>;

// ── Result Buttons (edit) ─────────────────────────────────────────────────────
const ResultButtons: React.FC<{
    value: CheckResult;
    onChange: (v: CheckResult) => void;
}> = ({ value, onChange }) => (
    <div className={styles.resultBtns}>
        <button
            className={`${styles.resultBtn} ${styles.resultBtnUygun} ${value === 'uygun' ? styles.resultBtnActive : ''}`}
            onClick={() => onChange(value === 'uygun' ? null : 'uygun')}
            type="button"
        >✓ Uygun</button>
        <button
            className={`${styles.resultBtn} ${styles.resultBtnUygunsuz} ${value === 'uygunsuz' ? styles.resultBtnActive : ''}`}
            onClick={() => onChange(value === 'uygunsuz' ? null : 'uygunsuz')}
            type="button"
        >✗ Uygun Değil</button>
        <button
            className={`${styles.resultBtn} ${styles.resultBtnNa} ${value === 'na' ? styles.resultBtnActive : ''}`}
            onClick={() => onChange(value === 'na' ? null : 'na')}
            type="button"
        >— Uyg. Yok</button>
    </div>
);

// ── Main Component ─────────────────────────────────────────────────────────────
interface Props { companyId: string; }

const SahaDenetimleriTab: React.FC<Props> = ({ companyId }) => {
    const [records, setRecords]               = useState<DenetimRecord[]>(() => loadRecords(companyId));
    const [expanded, setExpanded]             = useState<string | null>(null);
    const [expandedSection, setExpandedSection] = useState<number | null>(null);

    // Düzenleme
    const [editingId, setEditingId]           = useState<string | null>(null);
    const [editResults, setEditResults]       = useState<Record<string, CheckResult>>({});
    const [editSections, setEditSections]     = useState<number[]>([]);   // açık bölümler

    // Silme onayı
    const [deleteConfirm, setDeleteConfirm]   = useState<string | null>(null);

    // companyId değişince yeniden yükle
    useEffect(() => {
        setRecords(loadRecords(companyId));
        setEditingId(null);
        setExpanded(null);
    }, [companyId]);

    // ── Silme ──────────────────────────────────────────────────────────────────
    const handleDelete = useCallback((regId: string) => {
        const updated = records.filter(r => r.regId !== regId);
        saveRecords(companyId, updated);
        setRecords(updated);
        setDeleteConfirm(null);
        if (expanded === regId) setExpanded(null);
    }, [companyId, records, expanded]);

    // ── Düzenleme Başlat ───────────────────────────────────────────────────────
    const startEdit = useCallback((rec: DenetimRecord) => {
        setEditingId(rec.regId);
        setEditResults({ ...rec.results });
        setEditSections([0]);  // ilk bölüm açık
        setExpanded(rec.regId);
    }, []);

    // ── Düzenleme Kaydet ───────────────────────────────────────────────────────
    const saveEdit = useCallback((rec: DenetimRecord) => {
        const newStats   = calcStats(rec.sections, editResults);
        const updated    = records.map(r =>
            r.regId === rec.regId
                ? { ...r, results: { ...editResults }, stats: newStats, savedAt: new Date().toISOString() }
                : r
        );
        saveRecords(companyId, updated);
        setRecords(updated.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()));
        setEditingId(null);
    }, [companyId, records, editResults]);

    // ── Genel Ortalama ─────────────────────────────────────────────────────────
    const overallScore = useMemo(() => {
        if (records.length === 0) return null;
        const valid = records.filter(r => r.stats.total > 0);
        if (valid.length === 0) return null;
        const avg           = valid.reduce((s, r) => s + (r.stats.uygun / r.stats.total) * 100, 0) / valid.length;
        const totalUygun    = valid.reduce((s, r) => s + r.stats.uygun, 0);
        const totalUygunsuz = valid.reduce((s, r) => s + r.stats.uygunsuz, 0);
        const totalNa       = valid.reduce((s, r) => s + r.stats.na, 0);
        const totalItems    = valid.reduce((s, r) => s + r.stats.total, 0);
        return {
            pct: Math.round(avg),
            stats: { total: totalItems, checked: totalUygun + totalUygunsuz + totalNa,
                     uygun: totalUygun, uygunsuz: totalUygunsuz, na: totalNa, pct: Math.round(avg) },
        };
    }, [records]);

    const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('tr-TR', {
        day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
    });

    // ── Boş durum ──────────────────────────────────────────────────────────────
    if (records.length === 0) {
        return (
            <div className={styles.empty}>
                <MIcon name="fact_check" size={52} />
                <h3>Henüz denetim kaydı yok</h3>
                <p>Mevzuat Kütüphanesi'nden bir kontrol listesi oluşturup bu firmaya uygulayın. Sonuçlar burada görünecek.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>

            {/* ── Silme Onayı Dialog ── */}
            {deleteConfirm && (
                <div className={styles.confirmOverlay} onClick={() => setDeleteConfirm(null)}>
                    <div className={styles.confirmBox} onClick={e => e.stopPropagation()}>
                        <div className={styles.confirmIcon}><MIcon name="delete_forever" size={32} /></div>
                        <h4>Kaydı Sil</h4>
                        <p>Bu denetim kaydı kalıcı olarak silinecek. Emin misiniz?</p>
                        <div className={styles.confirmActions}>
                            <button className={styles.confirmCancel} onClick={() => setDeleteConfirm(null)}>İptal</button>
                            <button className={styles.confirmDelete} onClick={() => handleDelete(deleteConfirm)}>
                                <MIcon name="delete" size={15} /> Sil
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Genel Uyumluluk Paneli ── */}
            {overallScore && (
                <div className={styles.overallCard}>
                    <div className={styles.overallLeft}>
                        <div className={styles.overallTitle}>
                            <MIcon name="verified" size={20} />
                            <span>Genel Uyumluluk Skoru</span>
                        </div>
                        <p className={styles.overallSub}>{records.length} kontrol listesi ortalaması</p>
                        <ScoreBadge pct={overallScore.pct} />
                    </div>
                    <div className={styles.overallCenter}>
                        <DonutChart stats={overallScore.stats} size={120} holeClass={styles.donutHoleDark} />
                    </div>
                    <div className={styles.overallStats}>
                        <div className={`${styles.overallStat} ${styles.statUygun}`}>
                            <MIcon name="check_circle" size={16} />
                            <span className={styles.statNum}>{overallScore.stats.uygun}</span>
                            <span className={styles.statLbl}>Uygun</span>
                        </div>
                        <div className={`${styles.overallStat} ${styles.statUygunsuz}`}>
                            <MIcon name="cancel" size={16} />
                            <span className={styles.statNum}>{overallScore.stats.uygunsuz}</span>
                            <span className={styles.statLbl}>Uygun Değil</span>
                        </div>
                        <div className={`${styles.overallStat} ${styles.statNa}`}>
                            <MIcon name="remove_circle" size={16} />
                            <span className={styles.statNum}>{overallScore.stats.na}</span>
                            <span className={styles.statLbl}>Uygulama Yok</span>
                        </div>
                        <div className={`${styles.overallStat} ${styles.statPending}`}>
                            <MIcon name="pending" size={16} />
                            <span className={styles.statNum}>{overallScore.stats.total - overallScore.stats.checked}</span>
                            <span className={styles.statLbl}>Bekliyor</span>
                        </div>
                    </div>
                    <div className={styles.overallBars}>
                        <div className={styles.barRow}>
                            <span>Uygun</span>
                            <div className={styles.barTrack}>
                                <div className={styles.barFillGreen} style={{ width: `${overallScore.stats.total ? overallScore.stats.uygun / overallScore.stats.total * 100 : 0}%` }} />
                            </div>
                            <span>{overallScore.stats.total ? Math.round(overallScore.stats.uygun / overallScore.stats.total * 100) : 0}%</span>
                        </div>
                        <div className={styles.barRow}>
                            <span>Uygun Değil</span>
                            <div className={styles.barTrack}>
                                <div className={styles.barFillRed} style={{ width: `${overallScore.stats.total ? overallScore.stats.uygunsuz / overallScore.stats.total * 100 : 0}%` }} />
                            </div>
                            <span>{overallScore.stats.total ? Math.round(overallScore.stats.uygunsuz / overallScore.stats.total * 100) : 0}%</span>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Denetim Listesi Başlığı ── */}
            <div className={styles.listHeader}>
                <h3><MIcon name="list_alt" size={18} /> Denetim Kayıtları <span>({records.length})</span></h3>
            </div>

            {/* ── Kayıt Kartları ── */}
            <div className={styles.recordList}>
                {records.map((rec) => {
                    const isOpen    = expanded === rec.regId;
                    const isEditing = editingId === rec.regId;
                    const dispStats = isEditing ? calcStats(rec.sections, editResults) : rec.stats;
                    const compPct   = dispStats.total > 0 ? Math.round(dispStats.uygun / dispStats.total * 100) : 0;
                    const scoreCol  = compPct >= 85 ? '#16a34a' : compPct >= 60 ? '#d97706' : '#dc2626';

                    return (
                        <div key={rec.regId} className={`${styles.record} ${isOpen ? styles.recordOpen : ''} ${isEditing ? styles.recordEditing : ''}`}>

                            {/* ── Kart Başlığı ── */}
                            <div className={styles.recordHeader}>
                                {/* Sol: donut + bilgi — tıklayınca aç/kapat */}
                                <button
                                    className={styles.recordHeaderBtn}
                                    onClick={() => {
                                        if (isEditing) return;
                                        setExpanded(isOpen ? null : rec.regId);
                                        setExpandedSection(null);
                                    }}
                                >
                                    <DonutChart stats={dispStats} size={56} />
                                    <div className={styles.recordInfo}>
                                        <div className={styles.recordMeta}>
                                            <span className={styles.recordCat}>{rec.category}</span>
                                            <ScoreBadge pct={compPct} />
                                            {isEditing && <span className={styles.editingBadge}><MIcon name="edit" size={11} />Düzenleniyor</span>}
                                        </div>
                                        <h4 className={styles.recordTitle}>{rec.title}</h4>
                                        <div className={styles.recordDate}>
                                            <MIcon name="calendar_today" size={12} />
                                            <span>{fmtDate(rec.savedAt)}</span>
                                        </div>
                                    </div>
                                </button>

                                {/* Sağ: skor + aksiyonlar */}
                                <div className={styles.recordRight}>
                                    <div className={styles.recordScore} style={{ color: scoreCol }}>{compPct}%</div>
                                    <div className={styles.recordMini}>
                                        <span className={styles.miniUygun}>{dispStats.uygun}✓</span>
                                        <span className={styles.miniUygunsuz}>{dispStats.uygunsuz}✗</span>
                                        <span className={styles.miniNa}>{dispStats.na}—</span>
                                    </div>

                                    {/* Aksiyon butonları */}
                                    {!isEditing ? (
                                        <div className={styles.recordActions}>
                                            <button
                                                className={styles.actionBtn}
                                                onClick={() => startEdit(rec)}
                                                title="Düzenle"
                                            >
                                                <MIcon name="edit" size={16} />
                                            </button>
                                            <button
                                                className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                                                onClick={() => setDeleteConfirm(rec.regId)}
                                                title="Sil"
                                            >
                                                <MIcon name="delete" size={16} />
                                            </button>
                                            <MIcon
                                                name={isOpen ? 'expand_less' : 'expand_more'}
                                                size={20}
                                                style={{ color: '#94a3b8', cursor: 'pointer' }}
                                                onClick={() => { setExpanded(isOpen ? null : rec.regId); setExpandedSection(null); }}
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.recordActions}>
                                            <button
                                                className={styles.editSaveBtn}
                                                onClick={() => saveEdit(rec)}
                                            >
                                                <MIcon name="save" size={15} /> Kaydet
                                            </button>
                                            <button
                                                className={styles.editCancelBtn}
                                                onClick={() => { setEditingId(null); }}
                                            >
                                                İptal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ── Detay / Düzenleme Paneli ── */}
                            {isOpen && (
                                <div className={styles.recordDetail}>
                                    {/* Özet istatistik */}
                                    <div className={styles.detailStats}>
                                        {[
                                            { num: dispStats.uygun,   lbl: 'Uygun',       col: '#16a34a' },
                                            { num: dispStats.uygunsuz,lbl: 'Uygun Değil', col: '#dc2626' },
                                            { num: dispStats.na,      lbl: 'Uyg. Yok',    col: '#94a3b8' },
                                            { num: dispStats.total - dispStats.checked, lbl: 'Bekliyor', col: '#cbd5e1' },
                                            { num: dispStats.total,   lbl: 'Toplam',      col: '#0f172a' },
                                        ].map((s, i, arr) => (
                                            <React.Fragment key={s.lbl}>
                                                <div className={styles.detailStat}>
                                                    <span className={styles.detailStatNum} style={{ color: s.col }}>{s.num}</span>
                                                    <span className={styles.detailStatLbl}>{s.lbl}</span>
                                                </div>
                                                {i < arr.length - 1 && <div className={styles.detailDivider} />}
                                            </React.Fragment>
                                        ))}
                                    </div>

                                    {/* Progress bar */}
                                    <div className={styles.detailBar}>
                                        <div className={styles.detailBarFill} style={{
                                            background: `linear-gradient(90deg,
                                                #16a34a 0% ${dispStats.total ? dispStats.uygun/dispStats.total*100 : 0}%,
                                                #dc2626 ${dispStats.total ? dispStats.uygun/dispStats.total*100 : 0}% ${dispStats.total ? (dispStats.uygun+dispStats.uygunsuz)/dispStats.total*100 : 0}%,
                                                #94a3b8 ${dispStats.total ? (dispStats.uygun+dispStats.uygunsuz)/dispStats.total*100 : 0}% ${dispStats.total ? dispStats.checked/dispStats.total*100 : 0}%,
                                                #e2e8f0 ${dispStats.total ? dispStats.checked/dispStats.total*100 : 0}% 100%)`,
                                            width: '100%',
                                        }} />
                                    </div>

                                    {/* Düzenleme modu banner */}
                                    {isEditing && (
                                        <div className={styles.editBanner}>
                                            <MIcon name="edit_note" size={18} />
                                            <span>Her madde için sonucu seçin. Bittiğinde <strong>Kaydet</strong>'e basın.</span>
                                            <div className={styles.editBannerActions}>
                                                <button className={styles.editSaveBtn} onClick={() => saveEdit(rec)}>
                                                    <MIcon name="save" size={15} /> Kaydet
                                                </button>
                                                <button className={styles.editCancelBtn} onClick={() => setEditingId(null)}>
                                                    İptal
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {/* Bölümler */}
                                    {rec.sections.map((sec, si) => {
                                        const isSecOpen   = isEditing
                                            ? editSections.includes(si)
                                            : expandedSection === si;
                                        const secResults  = isEditing ? editResults : rec.results;
                                        const secUygun    = sec.items.filter((_, ii) => secResults[`${si}-${ii}`] === 'uygun').length;
                                        const secUygunsuz = sec.items.filter((_, ii) => secResults[`${si}-${ii}`] === 'uygunsuz').length;
                                        const secPct      = sec.items.length > 0 ? Math.round(secUygun / sec.items.length * 100) : 0;

                                        const toggleSec = () => {
                                            if (isEditing) {
                                                setEditSections(prev =>
                                                    prev.includes(si) ? prev.filter(x => x !== si) : [...prev, si]
                                                );
                                            } else {
                                                setExpandedSection(isSecOpen ? null : si);
                                            }
                                        };

                                        return (
                                            <div key={si} className={styles.section}>
                                                <button className={styles.sectionHeader} onClick={toggleSec}>
                                                    <span className={styles.sectionIcon}>
                                                        <MIcon name={safeIcon(sec.icon)} size={16} />
                                                    </span>
                                                    <span className={styles.sectionTitle}>{sec.section}</span>
                                                    <div className={styles.sectionMini}>
                                                        <span className={styles.miniUygun}>{secUygun}✓</span>
                                                        {secUygunsuz > 0 && <span className={styles.miniUygunsuz}>{secUygunsuz}✗</span>}
                                                        <span className={styles.sectionPct}>{secPct}%</span>
                                                    </div>
                                                    <MIcon name={isSecOpen ? 'expand_less' : 'expand_more'} size={16} />
                                                </button>

                                                {isSecOpen && (
                                                    <div className={styles.sectionItems}>
                                                        {sec.items.map((item, ii) => {
                                                            const key    = `${si}-${ii}`;
                                                            const result = (isEditing ? editResults : rec.results)[key] ?? null;
                                                            return (
                                                                <div
                                                                    key={ii}
                                                                    className={`${styles.item} ${result ? styles[`item_${result}`] : ''} ${isEditing ? styles.itemEditable : ''}`}
                                                                >
                                                                    <div className={styles.itemLeft}>
                                                                        <span className={styles.itemNum}>{ii + 1}</span>
                                                                        <div className={styles.itemContent}>
                                                                            {item.madde && item.madde !== '—' && (
                                                                                <span className={styles.itemMadde}>{item.madde}</span>
                                                                            )}
                                                                            <p className={styles.itemKontrol}>{item.kontrol}</p>
                                                                            {item.referans && (
                                                                                <span className={styles.itemRef}>{item.referans}</span>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {isEditing ? (
                                                                        <ResultButtons
                                                                            value={result}
                                                                            onChange={v => setEditResults(prev => ({ ...prev, [key]: v }))}
                                                                        />
                                                                    ) : (
                                                                        <ResultPill result={result} />
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}

                                    {/* Edit: alt kaydet butonu */}
                                    {isEditing && (
                                        <div className={styles.editFooter}>
                                            <button className={styles.editSaveBtn} onClick={() => saveEdit(rec)}>
                                                <MIcon name="save" size={16} /> Değişiklikleri Kaydet
                                            </button>
                                            <button className={styles.editCancelBtn} onClick={() => setEditingId(null)}>
                                                İptal
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SahaDenetimleriTab;
