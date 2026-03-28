import React, { useState, useMemo } from 'react';
import MIcon from '../../../components/MIcon';
import styles from './RiskWizard.module.css';
import { RISK_LIBRARY } from '../../../data/riskLibrary';
import { GUIDED_LIBRARY, ITEM_TYPE_LABELS, ITEM_TYPE_COLORS, type ItemType } from '../../../data/guidedLibrary';
import { API_BASE } from '../../../config/api';
import { apiFetch } from '../../../api/client';

interface GeneratedRisk {
    id: string;
    activity: string;
    hazard: string;
    riskEffect: string;
    existingMeasures: string;
    correctiveMeasures: string;
    initialProbability: number;
    initialSeverity: number;
    initialFrequency: number;
    finalProbability: number;
    finalSeverity: number;
    finalFrequency: number;
}

interface ChecklistCategory {
    bolum_adi: string;
    bakilacak_tehlikeler: string[];
    tipik_tedbir_mantigi: string;
}

interface RiskWizardProps {
    companyId: string;
    onComplete: () => void;
    onCancel: () => void;
}

const PROBABILITY_OPTIONS = [0.2, 0.5, 1, 3, 6, 10];
const FREQUENCY_OPTIONS = [0.5, 1, 2, 3, 6, 10];
const SEVERITY_OPTIONS = [1, 3, 7, 15, 40, 100];

function getRiskColor(score: number): string {
    if (score < 1) return 'none';
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

type InputMode = 'free' | 'guided';
type GuidedStage = 'sector' | 'subtype' | 'phases' | 'items';

const RiskWizard: React.FC<RiskWizardProps> = ({ companyId, onComplete, onCancel }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [promptText, setPromptText] = useState('');
    const [scope, _setScope] = useState<'general' | 'specific' | 'machine'>('general');
    const [generating, setGenerating] = useState(false);
    const [saving, setSaving] = useState(false);

    // Mode
    const [inputMode, _setInputMode] = useState<InputMode>('guided');

    // Guided mode state
    const [guidedStage, setGuidedStage] = useState<GuidedStage>('sector');
    const [guidedSectorId, setGuidedSectorId] = useState('');
    const [guidedSubtypeId, setGuidedSubtypeId] = useState('');
    const [guidedPhases, setGuidedPhases] = useState<Set<string>>(new Set());
    const [guidedItems, setGuidedItems] = useState<Set<string>>(new Set());
    const [itemTypeFilter, setItemTypeFilter] = useState<ItemType | 'all'>('all');

    // Library state
    const [libOpen, setLibOpen] = useState(false);
    const [libCategory, setLibCategory] = useState<string>('all');
    const [libSearch, setLibSearch] = useState('');
    const [libSelected, setLibSelected] = useState<Set<string>>(new Set());

    // Step 2 States
    const [checklistData, setChecklistData] = useState<ChecklistCategory[]>([]);
    const [selectedHazards, setSelectedHazards] = useState<Set<string>>(new Set());

    // Step 3 States
    const [generatedRisks, setGeneratedRisks] = useState<GeneratedRisk[]>([]);
    const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

    const [aiError, setAiError] = useState('');

    // ── Guided helpers ──────────────────────────────
    const guidedSector = GUIDED_LIBRARY.find(s => s.id === guidedSectorId);
    const guidedSubtype = guidedSector?.subtypes.find(s => s.id === guidedSubtypeId);

    const guidedSelectedPhaseObjs = useMemo(
        () => guidedSubtype?.phases.filter(p => guidedPhases.has(p.id)) ?? [],
        [guidedSubtype, guidedPhases]
    );

    const handleGuidedSectorSelect = (sId: string) => {
        setGuidedSectorId(sId);
        setGuidedSubtypeId('');
        setGuidedPhases(new Set());
        setGuidedItems(new Set());
        const sector = GUIDED_LIBRARY.find(s => s.id === sId);
        if (sector && sector.subtypes.length === 1) {
            setGuidedSubtypeId(sector.subtypes[0].id);
            setGuidedStage('phases');
        } else {
            setGuidedStage('subtype');
        }
    };

    const handleGuidedSubtypeSelect = (sId: string) => {
        setGuidedSubtypeId(sId);
        setGuidedPhases(new Set());
        setGuidedItems(new Set());
        setGuidedStage('phases');
    };

    const handleGuidedPhaseToggle = (phaseId: string) => {
        const isChecked = guidedPhases.has(phaseId);
        const phase = guidedSubtype?.phases.find(p => p.id === phaseId);
        if (!phase) return;
        const allItemIds = phase.subPhases.flatMap(sp => sp.items.map(i => i.id));
        setGuidedPhases(prev => {
            const next = new Set(prev);
            if (isChecked) next.delete(phaseId); else next.add(phaseId);
            return next;
        });
        setGuidedItems(prev => {
            const next = new Set(prev);
            if (isChecked) allItemIds.forEach(iid => next.delete(iid));
            else allItemIds.forEach(iid => next.add(iid));
            return next;
        });
    };

    const handleGuidedItemToggle = (itemId: string) => {
        setGuidedItems(prev => {
            const next = new Set(prev);
            if (next.has(itemId)) next.delete(itemId); else next.add(itemId);
            return next;
        });
    };

    const handleGuidedProceed = () => {
        if (guidedStage === 'phases' && guidedPhases.size > 0) {
            setGuidedStage('items');
        }
    };

    const buildGuidedPrompt = (): string => {
        const sectorLabel = guidedSector?.label ?? '';
        const subtypeLabel = guidedSubtype?.label ?? '';
        const phaseLabels = guidedSelectedPhaseObjs.map(p => p.label).join(', ');

        const typeGroups: Record<ItemType, string[]> = { is: [], faaliyet: [], ekipman: [], ortam: [] };
        guidedSelectedPhaseObjs.forEach(phase =>
            phase.subPhases.forEach(sp =>
                sp.items.forEach(item => {
                    if (guidedItems.has(item.id)) typeGroups[item.itemType].push(item.label);
                })
            )
        );

        let prompt = `${sectorLabel}${subtypeLabel ? ' – ' + subtypeLabel : ''}`;
        if (phaseLabels) prompt += ` | Aşamalar: ${phaseLabels}`;
        if (typeGroups.is.length) prompt += `\nYapılan İşler: ${typeGroups.is.join(', ')}`;
        if (typeGroups.faaliyet.length) prompt += `\nFaaliyetler: ${typeGroups.faaliyet.join(', ')}`;
        if (typeGroups.ekipman.length) prompt += `\nEkipmanlar: ${typeGroups.ekipman.join(', ')}`;
        if (typeGroups.ortam.length) prompt += `\nOrtamlar: ${typeGroups.ortam.join(', ')}`;
        return prompt;
    };

    const handleGuidedStart = () => {
        const generatedPrompt = buildGuidedPrompt();
        setPromptText(generatedPrompt);

        // Her item için "aktivite: tehlike" formatında ayrı birim oluştur (global dedup yok)
        const preCategories: ChecklistCategory[] = [];
        guidedSelectedPhaseObjs.forEach(phase => {
            phase.subPhases.forEach(sp => {
                const hazardUnits: string[] = [];
                sp.items.forEach(item => {
                    if (guidedItems.has(item.id)) {
                        item.hazards.forEach(h => {
                            hazardUnits.push(`${item.label}: ${h}`);
                        });
                    }
                });
                if (hazardUnits.length > 0) {
                    preCategories.push({
                        bolum_adi: `${phase.label} — ${sp.label}`,
                        bakilacak_tehlikeler: hazardUnits,
                        tipik_tedbir_mantigi: `${sp.label} kapsamında öngörülen tehlike kaynakları`
                    });
                }
            });
        });

        handleGenerateChecklist(generatedPrompt, libSelected, preCategories);
    };

    // ── Library helpers ─────────────────────────────
    const filteredFactors = useMemo(() => {
        const cats = libCategory === 'all' ? RISK_LIBRARY : RISK_LIBRARY.filter(c => c.id === libCategory);
        const query = libSearch.toLowerCase().trim();
        return cats.map(cat => ({
            ...cat,
            factors: cat.factors.filter(f => !query || f.label.toLowerCase().includes(query))
        })).filter(cat => cat.factors.length > 0);
    }, [libCategory, libSearch]);

    const handleLibToggle = (label: string) => {
        const next = new Set(libSelected);
        if (next.has(label)) next.delete(label); else next.add(label);
        setLibSelected(next);
    };

    const handleLibSelectAll = () => {
        const all = new Set(libSelected);
        filteredFactors.forEach(cat => cat.factors.forEach(f => all.add(f.label)));
        setLibSelected(all);
    };

    const handleLibClearAll = () => setLibSelected(new Set());

    // ── Checklist generation ────────────────────────
    const handleGenerateChecklist = async (overridePrompt?: string, overrideLibSelected?: Set<string>, preCategories?: ChecklistCategory[]) => {
        const prompt = overridePrompt ?? promptText;
        const selected = overrideLibSelected ?? libSelected;
        if (!prompt.trim()) return;
        setGenerating(true);
        setAiError('');
        try {
            const res = await apiFetch(`${API_BASE}/api/generate-checklist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, scope })
            });
            const data = await res.json();
            if (res.ok) {
                let finalChecklist: ChecklistCategory[] = data;
                // Prepend pre-mapped hazard categories (from guided mode item selections)
                if (preCategories && preCategories.length > 0) {
                    finalChecklist = [...preCategories, ...finalChecklist];
                }
                if (selected.size > 0) {
                    finalChecklist = [
                        {
                            bolum_adi: '📚 Kütüphaneden Seçilen Risk Faktörleri',
                            bakilacak_tehlikeler: Array.from(selected),
                            tipik_tedbir_mantigi: 'Manuel olarak seçilen ISG mevzuat risk faktörleri'
                        },
                        ...finalChecklist
                    ];
                }
                setChecklistData(finalChecklist);
                const allHazards = new Set<string>();
                finalChecklist.forEach((cat: ChecklistCategory) => {
                    cat.bakilacak_tehlikeler.forEach((h: string) => allHazards.add(h));
                });
                setSelectedHazards(allHazards);
                setStep(2);
            } else {
                setAiError(data.error || 'Checklist oluşturulurken hata oluştu.');
            }
        } catch {
            setAiError('Sunucuya bağlanılamadı.');
        } finally {
            setGenerating(false);
        }
    };

    const handleGenerateRisks = async () => {
        if (selectedHazards.size === 0) { alert("Lütfen en az bir tehlike seçin."); return; }
        setGenerating(true);
        setAiError('');
        try {
            const res = await apiFetch(`${API_BASE}/api/generate-risks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ context: promptText, hazards: Array.from(selectedHazards), scope })
            });
            const data = await res.json();
            if (res.ok) {
                const withIds = data.map((d: any, i: number) => ({ ...d, id: `temp_${Date.now()}_${i}` }));
                setGeneratedRisks(withIds);
                setSelectedRows(new Set(withIds.map((r: GeneratedRisk) => r.id)));
                setStep(3);
            } else {
                setAiError(data.error || 'Risk analizi oluşturulurken hata oluştu');
            }
        } catch { setAiError('Sunucuya bağlanılamadı.'); }
        finally { setGenerating(false); }
    };

    const handleToggleHazard = (hazard: string) => {
        const next = new Set(selectedHazards);
        if (next.has(hazard)) next.delete(hazard); else next.add(hazard);
        setSelectedHazards(next);
    };

    const handleCellChange = (id: string, field: keyof GeneratedRisk, value: any) => {
        setGeneratedRisks(prev => prev.map(item => {
            if (item.id !== id) return item;
            const updated = { ...item, [field]: value };
            if (field === 'initialSeverity') updated.finalSeverity = Number(value);
            if (field === 'finalProbability' && Number(value) > updated.initialProbability) { alert('Son Olasılık, İlk Olasılıktan büyük olamaz!'); updated.finalProbability = updated.initialProbability; }
            if (field === 'finalFrequency' && Number(value) > updated.initialFrequency) { alert('Son Frekans, İlk Frekanstan büyük olamaz!'); updated.finalFrequency = updated.initialFrequency; }
            if (field === 'initialProbability' && updated.finalProbability > Number(value)) updated.finalProbability = Number(value);
            if (field === 'initialFrequency' && updated.finalFrequency > Number(value)) updated.finalFrequency = Number(value);
            return updated;
        }));
    };

    const handleSaveDatabase = async () => {
        setSaving(true);
        const risksToSave = generatedRisks.filter(r => selectedRows.has(r.id));
        if (risksToSave.length === 0) { alert('Lütfen kaydedilecek en az bir risk seçin.'); setSaving(false); return; }
        try {
            let count = 0;
            for (const risk of risksToSave) {
                await apiFetch(`${API_BASE}/api/companies/${companyId}/risks`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...risk,
                        initialRiskScore: risk.initialProbability * risk.initialSeverity * risk.initialFrequency,
                        initialRiskLevel: getRiskLevel(risk.initialProbability * risk.initialSeverity * risk.initialFrequency),
                        finalRiskScore: risk.finalProbability * risk.finalSeverity * risk.finalFrequency,
                        finalRiskLevel: getRiskLevel(risk.finalProbability * risk.finalSeverity * risk.finalFrequency),
                        responsiblePerson: '', deadline: ''
                    })
                });
                count++;
            }
            alert(`${count} risk kaydı başarıyla eklendi!`);
            onComplete();
        } catch { alert('Kaydetme sırasında hata oluştu.'); }
        finally { setSaving(false); }
    };

    const handleToggleRow = (id: string) => {
        const next = new Set(selectedRows);
        if (next.has(id)) next.delete(id); else next.add(id);
        setSelectedRows(next);
    };

    const handleSelectAll = (checked: boolean) => {
        if (checked) setSelectedRows(new Set(generatedRisks.map(r => r.id)));
        else setSelectedRows(new Set());
    };

    const handleDeleteSelected = () => {
        if (!window.confirm(`Seçili ${selectedRows.size} riski silmek istiyor musunuz?`)) return;
        setGeneratedRisks(prev => prev.filter(r => !selectedRows.has(r.id)));
        setSelectedRows(new Set());
    };

    // ── Guided stage back ───────────────────────────
    const handleGuidedBack = () => {
        if (guidedStage === 'items') setGuidedStage('phases');
        else if (guidedStage === 'phases') setGuidedStage(guidedSector && guidedSector.subtypes.length === 1 ? 'sector' : 'subtype');
        else if (guidedStage === 'subtype') setGuidedStage('sector');
    };

    // ── Guided helpers V2 ───────────────────────────
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getPhaseItemCount = (phase: any) =>
        (phase.subPhases as Array<{ items: unknown[] }>).reduce((sum, sp) => sum + sp.items.length, 0);

    return (
        <div className={styles.wizard}>
            {step === 1 && (
                <div className={styles.stepContent}>
                    <div className={styles.stepHeaderCenter}>
                        <div className={styles.aiIconWrapper}>
                            <MIcon name="auto_awesome" size={32} className={styles.aiIcon} />
                        </div>
                        <h2 className={styles.stepTitleMain}>Risk Değerlendirme Otomasyonu</h2>
                        <p className={styles.stepDescMain}>
                            Sektör ve modül seçerek adım adım risk değerlendirmesi oluşturun.
                        </p>
                    </div>


                    {/* ── SERBEST METİN MODU ── */}
                    {inputMode === 'free' && (
                        <>
                            <div className={styles.aiInputBox}>
                                <label>Yapılan İş / Faaliyet / Ekipman / Ortam Giriniz</label>
                                <textarea
                                    className={styles.aiTextarea}
                                    placeholder="Örn: RMS İstasyonu Bakımı, Kapalı Alanda Argon Kaynak İşi, Yüksek Gerilim Hatlarında Çalışma..."
                                    value={promptText}
                                    onChange={e => setPromptText(e.target.value)}
                                    rows={4}
                                    autoFocus
                                />
                            </div>

                            {/* Risk Faktörü Kütüphanesi */}
                            <div className={styles.libSection}>
                                <button className={styles.libToggleBtn} onClick={() => setLibOpen(v => !v)} type="button">
                                    <MIcon name="library_books" size={18} />
                                    <span>ISG Risk Faktörü Kütüphanesi</span>
                                    {libSelected.size > 0 && <span className={styles.libBadge}>{libSelected.size} seçili</span>}
                                    <MIcon name={libOpen ? 'expand_less' : 'expand_more'} size={18} className={styles.libChevron} />
                                </button>
                                {libOpen && <LibraryPanel
                                    filteredFactors={filteredFactors}
                                    libCategory={libCategory}
                                    setLibCategory={setLibCategory}
                                    libSearch={libSearch}
                                    setLibSearch={setLibSearch}
                                    libSelected={libSelected}
                                    onToggle={handleLibToggle}
                                    onSelectAll={handleLibSelectAll}
                                    onClearAll={handleLibClearAll}
                                    styles={styles}
                                />}
                            </div>

                            {aiError && <div className={styles.aiErrorBox}><MIcon name="warning" size={18} /><span>{aiError}</span></div>}

                            <div className={styles.stepFooterCenter}>
                                <button className={styles.btnCancelAi} onClick={onCancel} disabled={generating}>İptal</button>
                                <button className={styles.btnGenerateAi} onClick={() => handleGenerateChecklist()} disabled={generating || !promptText.trim()}>
                                    {generating ? <><MIcon name="hourglass_empty" size={18} className={styles.spinner} /> Saha Rehberi Hazırlanıyor...</> : <><MIcon name="auto_fix_high" size={18} /> Rehberi YZ ile Planla</>}
                                </button>
                            </div>
                        </>
                    )}

                    {/* ── REHBERLİ MOD ── */}
                    {inputMode === 'guided' && (
                        <div className={styles.guidedWrapper}>
                            {/* Breadcrumb */}
                            <div className={styles.guidedBreadcrumb}>
                                <span className={`${styles.crumb} ${guidedStage === 'sector' ? styles.crumbActive : ''}`}>1. Sektör</span>
                                <MIcon name="chevron_right" size={14} className={styles.crumbSep} />
                                <span className={`${styles.crumb} ${guidedStage === 'subtype' ? styles.crumbActive : ''} ${!guidedSectorId ? styles.crumbDisabled : ''}`}>2. Alt Tür</span>
                                <MIcon name="chevron_right" size={14} className={styles.crumbSep} />
                                <span className={`${styles.crumb} ${guidedStage === 'phases' ? styles.crumbActive : ''} ${!guidedSubtypeId ? styles.crumbDisabled : ''}`}>3. Aşamalar</span>
                                <MIcon name="chevron_right" size={14} className={styles.crumbSep} />
                                <span className={`${styles.crumb} ${guidedStage === 'items' ? styles.crumbActive : ''} ${guidedPhases.size === 0 ? styles.crumbDisabled : ''}`}>4. Öğeler</span>
                            </div>

                            {/* Stage 1: Sektör */}
                            {guidedStage === 'sector' && (
                                <div className={styles.guidedStage}>
                                    <h3 className={styles.guidedStageTitle}>Sektörü seçiniz</h3>
                                    <div className={styles.sectorGrid}>
                                        {GUIDED_LIBRARY.map(sector => (
                                            <button
                                                key={sector.id}
                                                className={`${styles.sectorCard} ${guidedSectorId === sector.id ? styles.sectorCardActive : ''}`}
                                                style={guidedSectorId === sector.id ? { borderColor: sector.color, backgroundColor: sector.color + '15' } : {}}
                                                onClick={() => handleGuidedSectorSelect(sector.id)}
                                            >
                                                <span className={styles.sectorIcon} style={{ color: guidedSectorId === sector.id ? sector.color : undefined }}>
                                                    <MIcon name={sector.icon} size={28} />
                                                </span>
                                                <span className={styles.sectorLabel}>{sector.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stage 2: Alt Tür */}
                            {guidedStage === 'subtype' && guidedSector && (
                                <div className={styles.guidedStage}>
                                    <h3 className={styles.guidedStageTitle}>{guidedSector.subtypeQuestion}</h3>
                                    <div className={styles.subtypeGrid}>
                                        {guidedSector.subtypes.map(sub => (
                                            <button
                                                key={sub.id}
                                                className={`${styles.subtypeCard} ${guidedSubtypeId === sub.id ? styles.subtypeCardActive : ''}`}
                                                style={guidedSubtypeId === sub.id ? { borderColor: guidedSector.color, backgroundColor: guidedSector.color + '15' } : {}}
                                                onClick={() => handleGuidedSubtypeSelect(sub.id)}
                                            >
                                                <MIcon name={sub.icon} size={22} style={{ color: guidedSector.color }} />
                                                <span>{sub.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <button className={styles.btnGuidedBack} onClick={handleGuidedBack}><MIcon name="chevron_left" size={16} /> Geri</button>
                                </div>
                            )}

                            {/* Stage 3: Aşamalar */}
                            {guidedStage === 'phases' && guidedSubtype && (
                                <div className={styles.guidedStage}>
                                    <h3 className={styles.guidedStageTitle}>
                                        <span style={{ color: guidedSector?.color }}>{guidedSubtype.label}</span> — Hangi aşamalar kapsama dahil?
                                    </h3>
                                    <div className={styles.guidedSelectAllRow}>
                                        <button
                                            className={styles.btnSelectAll}
                                            type="button"
                                            onClick={() => {
                                                const allIds = guidedSubtype.phases.map(p => p.id);
                                                const allSelected = allIds.every(id => guidedPhases.has(id));
                                                if (allSelected) {
                                                    setGuidedPhases(new Set());
                                                } else {
                                                    setGuidedPhases(new Set(allIds));
                                                }
                                            }}
                                        >
                                            <MIcon name={guidedSubtype.phases.every(p => guidedPhases.has(p.id)) ? 'deselect' : 'select_all'} size={16} />
                                            {guidedSubtype.phases.every(p => guidedPhases.has(p.id)) ? 'Tümünü Kaldır' : 'Tümünü Seç'}
                                        </button>
                                        <p className={styles.guidedStageHint}>Birden fazla aşama seçebilirsiniz.</p>
                                    </div>
                                    <div className={styles.phaseList}>
                                        {guidedSubtype.phases.map(phase => {
                                            const checked = guidedPhases.has(phase.id);
                                            return (
                                                <label key={phase.id} className={`${styles.phaseItem} ${checked ? styles.phaseItemChecked : ''}`}
                                                    style={checked ? { borderColor: guidedSector?.color, backgroundColor: (guidedSector?.color ?? '#6366f1') + '10' } : {}}>
                                                    <input type="checkbox" checked={checked} onChange={() => handleGuidedPhaseToggle(phase.id)} className={styles.phaseCheckbox} />
                                                    <MIcon name={phase.icon} size={18} style={{ color: checked ? guidedSector?.color : undefined }} />
                                                    <span className={styles.phaseLabel}>{phase.label}</span>
                                                    <span className={styles.phaseActivityCount}>{getPhaseItemCount(phase)} öğe</span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    <div className={styles.guidedFooter}>
                                        <button className={styles.btnGuidedBack} onClick={handleGuidedBack}><MIcon name="chevron_left" size={16} /> Geri</button>
                                        <button className={styles.btnGenerateAi} onClick={handleGuidedProceed} disabled={guidedPhases.size === 0}>
                                            <MIcon name="chevron_right" size={16} /> Faaliyetleri Seç ({guidedPhases.size} aşama)
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Stage 4: Öğeler */}
                            {guidedStage === 'items' && guidedSubtype && (
                                <div className={styles.guidedStage}>
                                    <h3 className={styles.guidedStageTitle}>Kapsama alınacak öğeleri seçin</h3>
                                    <p className={styles.guidedStageHint}>Seçilen öğelere bağlı tehlikeler otomatik hazırlanır ve risk analizine eklenir.</p>

                                    {/* Item type filter */}
                                    <div className={styles.itemTypeFilter}>
                                        {(['all', 'is', 'faaliyet', 'ekipman', 'ortam'] as const).map(type => (
                                            <button
                                                key={type}
                                                className={`${styles.itemTypeBtn} ${itemTypeFilter === type ? styles.itemTypeBtnActive : ''}`}
                                                style={itemTypeFilter === type && type !== 'all' ? { borderColor: ITEM_TYPE_COLORS[type], backgroundColor: ITEM_TYPE_COLORS[type] + '20', color: ITEM_TYPE_COLORS[type] } : {}}
                                                onClick={() => setItemTypeFilter(type)}
                                            >
                                                {type === 'all' ? 'Tümü' : ITEM_TYPE_LABELS[type]}
                                            </button>
                                        ))}
                                    </div>

                                    <div className={styles.activityPhaseList}>
                                        {guidedSelectedPhaseObjs.map(phase => (
                                            <div key={phase.id} className={styles.activityPhaseGroup}>
                                                <div className={styles.activityPhaseHeader} style={{ color: guidedSector?.color }}>
                                                    <MIcon name={phase.icon} size={15} />
                                                    <span>{phase.label}</span>
                                                </div>
                                                {phase.subPhases.map(sp => {
                                                    const filtered = sp.items.filter(item =>
                                                        itemTypeFilter === 'all' || item.itemType === itemTypeFilter
                                                    );
                                                    if (filtered.length === 0) return null;
                                                    const allSel = filtered.every(i => guidedItems.has(i.id));
                                                    return (
                                                        <div key={sp.id} className={styles.subPhaseGroup}>
                                                            <div className={styles.subPhaseHeader}>
                                                                <span>{sp.label}</span>
                                                                <button className={styles.actPhaseSelAll} onClick={() => {
                                                                    setGuidedItems(prev => {
                                                                        const next = new Set(prev);
                                                                        if (allSel) filtered.forEach(i => next.delete(i.id));
                                                                        else filtered.forEach(i => next.add(i.id));
                                                                        return next;
                                                                    });
                                                                }}>
                                                                    {allSel ? 'Kaldır' : 'Tümü'}
                                                                </button>
                                                            </div>
                                                            <div className={styles.activityChipGrid}>
                                                                {filtered.map(item => {
                                                                    const sel = guidedItems.has(item.id);
                                                                    const typeColor = ITEM_TYPE_COLORS[item.itemType];
                                                                    return (
                                                                        <button
                                                                            key={item.id}
                                                                            type="button"
                                                                            className={`${styles.activityChip} ${sel ? styles.activityChipSelected : ''}`}
                                                                            style={sel ? { borderColor: guidedSector?.color, backgroundColor: (guidedSector?.color ?? '#6366f1') + '15', color: guidedSector?.color } : {}}
                                                                            onClick={() => handleGuidedItemToggle(item.id)}
                                                                        >
                                                                            <span className={styles.itemTypeBadge} style={{ backgroundColor: typeColor + '25', color: typeColor }}>
                                                                                {item.itemType === 'is' ? 'İŞ' : item.itemType === 'faaliyet' ? 'FAA' : item.itemType === 'ekipman' ? 'EKP' : 'ORT'}
                                                                            </span>
                                                                            {sel && <MIcon name="check" size={12} />}
                                                                            {item.label}
                                                                            {item.hazards.length > 0 && (
                                                                                <span className={styles.hazardCount} title={item.hazards.join(', ')}>
                                                                                    {item.hazards.length}⚠
                                                                                </span>
                                                                            )}
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ))}
                                    </div>

                                    {guidedItems.size > 0 && (
                                        <div className={styles.libSelectedSummary}>
                                            <MIcon name="check_circle" size={16} />
                                            <span><strong>{guidedItems.size}</strong> öğe seçildi — analiz başlatılıyor.</span>
                                        </div>
                                    )}

                                    {aiError && <div className={styles.aiErrorBox}><MIcon name="warning" size={18} /><span>{aiError}</span></div>}

                                    <div className={styles.guidedFooter}>
                                        <button className={styles.btnGuidedBack} onClick={handleGuidedBack}><MIcon name="chevron_left" size={16} /> Geri</button>
                                        <button className={styles.btnGenerateAi} onClick={handleGuidedStart} disabled={generating || guidedItems.size === 0}>
                                            {generating
                                                ? <><MIcon name="hourglass_empty" size={18} className={styles.spinner} /> Saha Rehberi Hazırlanıyor...</>
                                                : <><MIcon name="auto_fix_high" size={18} /> Rehberi YZ ile Planla ({guidedItems.size} öğe)</>}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className={styles.stepContentFull}>
                    <div className={styles.stepHeaderBar}>
                        <h2 className={styles.stepTitle}><MIcon name="auto_awesome" size={24} /> Saha Denetim Rehberi</h2>
                        <div className={styles.stepActions}>
                            <button className={styles.btnBack} onClick={() => setStep(1)} disabled={generating}><MIcon name="chevron_left" size={16} /> Geri Dön</button>
                            <button className={styles.btnGenerateAi} onClick={handleGenerateRisks} disabled={generating || selectedHazards.size === 0}>
                                {generating ? <><MIcon name="hourglass_empty" size={16} className={styles.spinner} /> Matris Üretiliyor...</> : <><MIcon name="check" size={16} /> Seçilenlerden Risk Matrisi Üret</>}
                            </button>
                        </div>
                    </div>
                    {aiError && <div className={styles.aiErrorBox} style={{ margin: '1rem 2rem' }}><MIcon name="warning" size={18} /><span>{aiError}</span></div>}
                    <div className={styles.checklistGrid}>
                        {checklistData.map((category, idx) => (
                            <div key={idx} className={styles.checkCard}>
                                <div className={styles.checkCardHeader}>
                                    <h3>{category.bolum_adi}</h3>
                                    <p>{category.tipik_tedbir_mantigi}</p>
                                </div>
                                <div className={styles.checkCardBody}>
                                    {category.bakilacak_tehlikeler.map((h, i) => (
                                        <label key={i} className={styles.checkboxLabel}>
                                            <input type="checkbox" checked={selectedHazards.has(h)} onChange={() => handleToggleHazard(h)} />
                                            <span className={styles.checkmark}></span>
                                            {h}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className={styles.stepContentFull}>
                    <div className={styles.stepHeaderBar}>
                        <h2 className={styles.stepTitle}><MIcon name="check" size={24} /> Yapay Zeka Matris Önizlemesi ({generatedRisks.length} Madde)</h2>
                        <div className={styles.stepActions}>
                            <button className={styles.btnBack} onClick={() => setStep(2)} disabled={saving}><MIcon name="chevron_left" size={16} /> Checklist'e Dön</button>
                            {selectedRows.size > 0 && <button className={styles.btnDanger} onClick={handleDeleteSelected} disabled={saving}>Seçili Olanları Sil ({selectedRows.size})</button>}
                            <button className={styles.btnGenerateAi} onClick={handleSaveDatabase} disabled={saving || selectedRows.size === 0}>
                                {saving ? <><MIcon name="hourglass_empty" size={16} className={styles.spinner} /> Kaydediliyor...</> : <><MIcon name="check" size={16} /> Seçilileri Veritabanına Kaydet</>}
                            </button>
                        </div>
                    </div>
                    <div className={styles.previewTableWrapper}>
                        <table className={styles.previewTable}>
                            <thead>
                                <tr>
                                    <th className={styles.centerSel}>
                                        <input type="checkbox" className={styles.rowCheckbox} checked={selectedRows.size === generatedRisks.length && generatedRisks.length > 0} onChange={e => handleSelectAll(e.target.checked)} />
                                    </th>
                                    <th>Faaliyet / Ortam</th><th>Tehlike</th><th>Risk / Olası Etki</th><th>Mevcut Önlemler</th>
                                    <th>İlk O</th><th>İlk Ş</th><th>İlk F</th><th>İlk R</th>
                                    <th>Açıklama / Düzeltici Tedbirler</th>
                                    <th>Son O</th><th>Son Ş</th><th>Son F</th><th>Son R</th>
                                </tr>
                            </thead>
                            <tbody>
                                {generatedRisks.map(item => {
                                    const initialR = item.initialProbability * item.initialSeverity * item.initialFrequency;
                                    const finalR = item.finalProbability * item.finalSeverity * item.finalFrequency;
                                    const isSelected = selectedRows.has(item.id);
                                    return (
                                        <tr key={item.id} className={isSelected ? styles.selectedRow : ''}>
                                            <td className={styles.centerSel}><input type="checkbox" className={styles.rowCheckbox} checked={isSelected} onChange={() => handleToggleRow(item.id)} /></td>
                                            <td><textarea value={item.activity} onChange={e => handleCellChange(item.id, 'activity', e.target.value)} /></td>
                                            <td><textarea value={item.hazard} onChange={e => handleCellChange(item.id, 'hazard', e.target.value)} /></td>
                                            <td><textarea value={item.riskEffect} onChange={e => handleCellChange(item.id, 'riskEffect', e.target.value)} /></td>
                                            <td><textarea value={item.existingMeasures} onChange={e => handleCellChange(item.id, 'existingMeasures', e.target.value)} /></td>
                                            <td className={styles.centerSel}><select value={item.initialProbability} onChange={e => handleCellChange(item.id, 'initialProbability', Number(e.target.value))}>{PROBABILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}</select></td>
                                            <td className={styles.centerSel}><select value={item.initialSeverity} onChange={e => handleCellChange(item.id, 'initialSeverity', Number(e.target.value))}>{SEVERITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}</select></td>
                                            <td className={styles.centerSel}><select value={item.initialFrequency} onChange={e => handleCellChange(item.id, 'initialFrequency', Number(e.target.value))}>{FREQUENCY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}</select></td>
                                            <td className={`${styles.centerScore} ${styles[`bg_${getRiskColor(initialR)}`]}`}><strong>{initialR || '—'}</strong></td>
                                            <td><textarea value={item.correctiveMeasures} onChange={e => handleCellChange(item.id, 'correctiveMeasures', e.target.value)} /></td>
                                            <td className={styles.centerSel}><select value={item.finalProbability} onChange={e => handleCellChange(item.id, 'finalProbability', Number(e.target.value))}>{PROBABILITY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}</select></td>
                                            <td className={`${styles.centerScore} ${styles.disabledSel}`}>{item.finalSeverity || '—'}</td>
                                            <td className={styles.centerSel}><select value={item.finalFrequency} onChange={e => handleCellChange(item.id, 'finalFrequency', Number(e.target.value))}>{FREQUENCY_OPTIONS.map(v => <option key={v} value={v}>{v}</option>)}</select></td>
                                            <td className={`${styles.centerScore} ${styles[`bg_${getRiskColor(finalR)}`]}`}><strong>{finalR || '—'}</strong></td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Library Panel bileşeni (ayrı) ──────────────────
interface LibraryPanelProps {
    filteredFactors: any[];
    libCategory: string;
    setLibCategory: (v: string) => void;
    libSearch: string;
    setLibSearch: (v: string) => void;
    libSelected: Set<string>;
    onToggle: (label: string) => void;
    onSelectAll: () => void;
    onClearAll: () => void;
    styles: any;
}

const LibraryPanel: React.FC<LibraryPanelProps> = ({
    filteredFactors, libCategory, setLibCategory, libSearch, setLibSearch,
    libSelected, onToggle, onSelectAll, onClearAll, styles
}) => (
    <div className={styles.libPanel}>
        <div className={styles.libPanelHeader}>
            <p className={styles.libPanelDesc}>İSG mevzuatında tanımlanan risk faktörlerini seçin. Seçtiğiniz faktörler yapay zeka analizine otomatik eklenir.</p>
            <div className={styles.libControls}>
                <div className={styles.libSearchBox}>
                    <MIcon name="search" size={16} className={styles.libSearchIcon} />
                    <input type="text" placeholder="Risk faktörü ara..." value={libSearch} onChange={e => setLibSearch(e.target.value)} className={styles.libSearchInput} />
                    {libSearch && <button className={styles.libSearchClear} onClick={() => setLibSearch('')}><MIcon name="close" size={14} /></button>}
                </div>
                <button className={styles.libActionBtn} onClick={onSelectAll}>Tümünü Seç</button>
                <button className={styles.libActionBtnGhost} onClick={onClearAll}>Temizle</button>
            </div>
        </div>
        <div className={styles.libCatTabs}>
            <button className={`${styles.libCatTab} ${libCategory === 'all' ? styles.libCatActive : ''}`} onClick={() => setLibCategory('all')}>Tümü</button>
            {RISK_LIBRARY.map(cat => (
                <button key={cat.id} className={`${styles.libCatTab} ${libCategory === cat.id ? styles.libCatActive : ''}`} onClick={() => setLibCategory(cat.id)}
                    style={libCategory === cat.id ? { borderColor: cat.color, color: cat.color, background: 'white' } : {}}>
                    <MIcon name={cat.icon} size={14} />{cat.label}
                </button>
            ))}
        </div>
        <div className={styles.libFactorsArea}>
            {filteredFactors.length === 0 ? <p className={styles.libEmpty}>Arama sonucu bulunamadı.</p> :
                filteredFactors.map(cat => (
                    <div key={cat.id} className={styles.libCatGroup}>
                        {libCategory === 'all' && <div className={styles.libCatGroupHeader} style={{ color: cat.color }}><MIcon name={cat.icon} size={15} /><span>{cat.label}</span></div>}
                        <div className={styles.libChipGrid}>
                            {cat.factors.map((factor: any) => {
                                const selected = libSelected.has(factor.label);
                                return (
                                    <button key={factor.id} type="button"
                                        className={`${styles.libChip} ${selected ? styles.libChipSelected : ''}`}
                                        style={selected ? { borderColor: cat.color, backgroundColor: cat.color + '18', color: cat.color } : {}}
                                        onClick={() => onToggle(factor.label)}>
                                        {selected && <MIcon name="check" size={12} />}{factor.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                ))
            }
        </div>
        {libSelected.size > 0 && (
            <div className={styles.libSelectedSummary}>
                <MIcon name="check_circle" size={16} />
                <span><strong>{libSelected.size}</strong> risk faktörü seçildi — analiz başlatıldığında otomatik eklenir.</span>
            </div>
        )}
    </div>
);

export default RiskWizard;
