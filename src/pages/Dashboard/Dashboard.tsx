import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
    RadialBarChart, RadialBar, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
    PieChart, Pie, Legend,
    CartesianGrid,
} from 'recharts';
import MIcon from '../../components/MIcon';
import styles from './Dashboard.module.css';
import { API_BASE } from '../../config/api';
import { apiFetch } from '../../api/client';

// ── Types ────────────────────────────────────────────────────────
interface Overview {
    totalCompanies: number; totalPersonnel: number;
    activeProfessionals: number; avgCompliance: number;
    expiringNext30: number; overdueCount: number;
}
interface CompanyScore {
    id: number; name: string; compliance: number;
    trainingPct: number; healthPct: number;
    profPct: number; riskPct: number;
    totalPersonnel: number; dangerClass: string; isActive: boolean;
}
interface StatItem { name: string; value: number; color?: string; }
interface AlertItem { id: number; name: string; company: string; type: string; daysLeft: number; date: string; }
interface DashboardData {
    overview: Overview;
    companyScores: CompanyScore[];
    dangerDistribution: StatItem[];
    trainingStats: StatItem[];
    healthStats: StatItem[];
    riskDistribution: StatItem[];
    expiringTraining: AlertItem[];
    expiringHealth: AlertItem[];
    overdueTraining: AlertItem[];
    overdueHealth: AlertItem[];
}

// ── Fetch ─────────────────────────────────────────────────────────
const fetchStats = async (): Promise<DashboardData> => {
    const res = await apiFetch(`${API_BASE}/api/dashboard/stats`);
    if (!res.ok) throw new Error('Veri alınamadı');
    return res.json();
};

// ── Helpers ───────────────────────────────────────────────────────
const complianceColor = (v: number) =>
    v >= 80 ? '#10b981' : v >= 60 ? '#f59e0b' : v >= 40 ? '#f97316' : '#e11d48';

const DANGER_COLORS: Record<string, string> = {
    'Çok Tehlikeli': '#e11d48',
    'Tehlikeli':     '#f97316',
    'Az Tehlikeli':  '#10b981',
};

const FADE_UP = { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

// ── KPI Card ──────────────────────────────────────────────────────
function KpiCard({ icon, label, value, sub, color, delay }: {
    icon: string; label: string; value: string | number;
    sub?: string; color: string; delay: number;
}) {
    return (
        <motion.div className={styles.kpiCard} {...FADE_UP} transition={{ delay, duration: 0.45 }}>
            <div className={styles.kpiIcon} style={{ background: `${color}18`, color }}>
                <MIcon name={icon} size={22} />
            </div>
            <div className={styles.kpiBody}>
                <span className={styles.kpiLabel}>{label}</span>
                <span className={styles.kpiValue}>{value}</span>
                {sub && <span className={styles.kpiSub}>{sub}</span>}
            </div>
            <div className={styles.kpiGlow} style={{ background: `radial-gradient(circle at 80% 50%, ${color}18 0%, transparent 70%)` }} />
        </motion.div>
    );
}

// ── Custom tooltip ────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div className={styles.tooltip}>
            {label && <p className={styles.tooltipLabel}>{label}</p>}
            {payload.map((p: any, i: number) => (
                <p key={i} style={{ color: p.color ?? p.fill }}>{p.name}: <strong>{p.value}</strong></p>
            ))}
        </div>
    );
};

// ── Section wrapper ────────────────────────────────────────────────
function Section({ title, icon, children, delay = 0, className = '' }: {
    title: string; icon: string; children: React.ReactNode; delay?: number; className?: string;
}) {
    return (
        <motion.div className={`${styles.section} ${className}`} {...FADE_UP} transition={{ delay, duration: 0.45 }}>
            <div className={styles.sectionHeader}>
                <MIcon name={icon} size={18} className={styles.sectionIcon} />
                <h3 className={styles.sectionTitle}>{title}</h3>
            </div>
            {children}
        </motion.div>
    );
}

// ── Compliance bar per company ────────────────────────────────────
function ComplianceRow({ c }: { c: CompanyScore }) {
    const color = complianceColor(c.compliance);
    return (
        <div className={styles.compRow}>
            <div className={styles.compName} title={c.name}>
                <span className={styles.compBadge} style={{ background: DANGER_COLORS[c.dangerClass] ?? '#64748b' }} />
                {c.name}
            </div>
            <div className={styles.compBarWrap}>
                <div className={styles.compBarBg}>
                    <motion.div
                        className={styles.compBarFill}
                        style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
                        initial={{ width: 0 }}
                        animate={{ width: `${c.compliance}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>
                <span className={styles.compScore} style={{ color }}>{c.compliance}%</span>
            </div>
            <div className={styles.compMeta}>
                <span title="Personel"><MIcon name="group" size={13} />{c.totalPersonnel}</span>
                <span title="Eğitim" style={{ color: complianceColor(c.trainingPct) }}>
                    <MIcon name="school" size={13} />{c.trainingPct}%
                </span>
                <span title="Sağlık" style={{ color: complianceColor(c.healthPct) }}>
                    <MIcon name="health_and_safety" size={13} />{c.healthPct}%
                </span>
            </div>
        </div>
    );
}

// ── Alert row ─────────────────────────────────────────────────────
function AlertRow({ item, overdue }: { item: AlertItem; overdue?: boolean }) {
    const isTraining = item.type === 'training';
    const daysText = overdue
        ? `${Math.abs(item.daysLeft)} gün geçti`
        : item.daysLeft === 0 ? 'Bugün!' : `${item.daysLeft} gün kaldı`;
    const urgency = overdue || item.daysLeft <= 7 ? '#e11d48' : item.daysLeft <= 14 ? '#f97316' : '#f59e0b';
    return (
        <div className={styles.alertRow}>
            <div className={styles.alertIcon} style={{ background: `${urgency}15`, color: urgency }}>
                <MIcon name={isTraining ? 'school' : 'monitor_heart'} size={15} />
            </div>
            <div className={styles.alertBody}>
                <span className={styles.alertName}>{item.name}</span>
                <span className={styles.alertCompany}>{item.company}</span>
            </div>
            <div className={styles.alertBadge} style={{ background: `${urgency}18`, color: urgency }}>
                {daysText}
            </div>
        </div>
    );
}

// ── Radial score gauge ────────────────────────────────────────────
function ComplianceGauge({ value }: { value: number }) {
    const color = complianceColor(value);
    const data = [{ name: 'score', value, fill: color }, { name: 'rest', value: 100 - value, fill: '#f1f5f9' }];
    return (
        <div className={styles.gaugeWrap}>
            <ResponsiveContainer width={140} height={140}>
                <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="95%" data={data} startAngle={90} endAngle={-270} barSize={12}>
                    <RadialBar dataKey="value" cornerRadius={6} />
                </RadialBarChart>
            </ResponsiveContainer>
            <div className={styles.gaugeCenter}>
                <span className={styles.gaugeValue} style={{ color }}>{value}%</span>
                <span className={styles.gaugeLabel}>Ort. Uyum</span>
            </div>
        </div>
    );
}

// ── Main Dashboard ────────────────────────────────────────────────
export default function Dashboard() {
    const { data, isLoading, isError, refetch } = useQuery<DashboardData>({
        queryKey: ['dashboard-stats'],
        queryFn: fetchStats,
        refetchInterval: 60_000,       // auto-refresh every 60s
        staleTime: 30_000,
    });

    if (isLoading) return (
        <div className={styles.loading}>
            <div className={styles.spinner} />
            <p>Veriler yükleniyor…</p>
        </div>
    );

    if (isError || !data) return (
        <div className={styles.loading}>
            <MIcon name="error_outline" size={40} style={{ color: '#e11d48' }} />
            <p>Veri alınamadı</p>
            <button className={styles.retryBtn} onClick={() => refetch()}>Tekrar Dene</button>
        </div>
    );

    const { overview, companyScores, dangerDistribution, trainingStats, healthStats,
            riskDistribution, expiringTraining, expiringHealth, overdueTraining, overdueHealth } = data;

    const allAlerts = [
        ...overdueTraining.map(a => ({ ...a, overdue: true })),
        ...overdueHealth.map(a => ({ ...a, overdue: true })),
        ...expiringTraining.map(a => ({ ...a, overdue: false })),
        ...expiringHealth.map(a => ({ ...a, overdue: false })),
    ].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 15);

    const dangerColored = dangerDistribution.map(d => ({ ...d, fill: DANGER_COLORS[d.name] ?? '#64748b' }));

    return (
        <div className={styles.page}>
            {/* Header */}
            <motion.div className={styles.header} {...FADE_UP} transition={{ duration: 0.4 }}>
                <div>
                    <h1 className={styles.pageTitle}>Genel Bakış</h1>
                    <p className={styles.pageSub}>Firmalarınızın anlık İSG durumu</p>
                </div>
                <button className={styles.refreshBtn} onClick={() => refetch()}>
                    <MIcon name="refresh" size={16} /> Yenile
                </button>
            </motion.div>

            {/* KPI row */}
            <div className={styles.kpiGrid}>
                <KpiCard icon="business"           label="Toplam Firma"         value={overview.totalCompanies}    color="#6366f1" delay={0.05} />
                <KpiCard icon="group"              label="Toplam Personel"      value={overview.totalPersonnel}    color="#0ea5e9" delay={0.10} />
                <KpiCard icon="verified_user"      label="Ortalama Uyum Skoru"  value={`${overview.avgCompliance}%`} sub="Tüm firmalar" color={complianceColor(overview.avgCompliance)} delay={0.15} />
                <KpiCard icon="warning_amber"      label="30 Günde Sona Eren"   value={overview.expiringNext30}    sub={`${overview.overdueCount} süresi dolmuş`} color="#f59e0b" delay={0.20} />
            </div>

            {/* Compliance + Gauge */}
            <div className={styles.row2}>
                <Section title="Firma Bazlı İSG Uyum Skoru" icon="leaderboard" delay={0.25} className={styles.complianceSection}>
                    <div className={styles.complianceSplit}>
                        <ComplianceGauge value={overview.avgCompliance} />
                        <div className={styles.complianceLegend}>
                            <div className={styles.legendItem}><span style={{ background: '#10b981' }} />80–100% Mükemmel</div>
                            <div className={styles.legendItem}><span style={{ background: '#f59e0b' }} />60–79% İyi</div>
                            <div className={styles.legendItem}><span style={{ background: '#f97316' }} />40–59% Orta</div>
                            <div className={styles.legendItem}><span style={{ background: '#e11d48' }} />0–39% Kritik</div>
                        </div>
                    </div>
                    <div className={styles.compList}>
                        {companyScores.length === 0
                            ? <p className={styles.empty}>Henüz firma eklenmemiş.</p>
                            : companyScores.map(c => <ComplianceRow key={c.id} c={c} />)
                        }
                    </div>
                </Section>

                <div className={styles.rightCol}>
                    {/* Danger dist donut */}
                    <Section title="Tehlike Sınıfı Dağılımı" icon="warning" delay={0.30}>
                        {dangerColored.length === 0
                            ? <p className={styles.empty}>Veri yok</p>
                            : <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie data={dangerColored} dataKey="value" nameKey="name"
                                         cx="50%" cy="50%" innerRadius={52} outerRadius={80}
                                         paddingAngle={3} cornerRadius={4}>
                                        {dangerColored.map((d, i) => <Cell key={i} fill={d.fill} />)}
                                    </Pie>
                                    <Tooltip content={<ChartTooltip />} />
                                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: '0.78rem' }} />
                                </PieChart>
                              </ResponsiveContainer>
                        }
                    </Section>

                    {/* Risk distribution */}
                    <Section title="Risk Seviyesi Dağılımı" icon="assessment" delay={0.35}>
                        {riskDistribution.length === 0
                            ? <p className={styles.empty}>Henüz risk değerlendirmesi yok</p>
                            : <ResponsiveContainer width="100%" height={160}>
                                <BarChart data={riskDistribution} barSize={28} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                    <YAxis tick={{ fontSize: 11 }} />
                                    <Tooltip content={<ChartTooltip />} />
                                    <Bar dataKey="value" name="Adet" radius={[4, 4, 0, 0]}>
                                        {riskDistribution.map((_, i) => (
                                            <Cell key={i} fill={['#e11d48','#f97316','#f59e0b','#10b981'][i % 4]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                              </ResponsiveContainer>
                        }
                    </Section>
                </div>
            </div>

            {/* Training & Health status */}
            <div className={styles.row3}>
                <Section title="Personel Eğitim Durumu" icon="school" delay={0.40}>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={trainingStats} barSize={40} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="value" name="Kişi" radius={[6, 6, 0, 0]}>
                                {trainingStats.map((d, i) => <Cell key={i} fill={d.color ?? '#6366f1'} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Section>

                <Section title="Sağlık Muayenesi Durumu" icon="monitor_heart" delay={0.45}>
                    <ResponsiveContainer width="100%" height={180}>
                        <BarChart data={healthStats} barSize={40} margin={{ top: 4, right: 8, bottom: 0, left: -20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<ChartTooltip />} />
                            <Bar dataKey="value" name="Kişi" radius={[6, 6, 0, 0]}>
                                {healthStats.map((d, i) => <Cell key={i} fill={d.color ?? '#0ea5e9'} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </Section>
            </div>

            {/* Alerts */}
            <Section title="Sona Eren Belge & Eğitim Uyarıları" icon="notifications_active" delay={0.50} className={styles.alertSection}>
                {allAlerts.length === 0
                    ? <div className={styles.allGood}>
                        <MIcon name="check_circle" size={32} style={{ color: '#10b981' }} />
                        <p>Önümüzdeki 30 günde sona eren belge veya eğitim yok 🎉</p>
                      </div>
                    : <div className={styles.alertGrid}>
                        {allAlerts.map((a, i) => <AlertRow key={`${a.type}-${a.id}-${i}`} item={a} overdue={a.overdue} />)}
                      </div>
                }
            </Section>
        </div>
    );
}
