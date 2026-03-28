import React, { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import MIcon from '../../components/MIcon';
import styles from './CompanyDetailLayout.module.css';
import { API_BASE } from '../../config/api';
import { apiFetch } from '../../api/client';
import ProfessionalsTab from './Tabs/ProfessionalsTab';
import EmployeesTab from './Tabs/EmployeesTab';
import AssignmentsTab from './Tabs/AssignmentsTab';
import PlansTab from './Tabs/PlansTab';
import TrainingTab from './Tabs/TrainingHealthTab';
import HealthSurveillanceTab from './Tabs/HealthSurveillanceTab';
import RiskAssessmentTab from './Tabs/RiskAssessmentTab';
import SahaDenetimleriTab from './Tabs/SahaDenetimleriTab';

interface CompanyInfo {
    official_title: string;
    sgk_no: string;
    employee_count: number;
    employer_name: string;
    is_active: boolean;
    tehlikeSinifi?: string;
    nace_code?: string;
    nace_description?: string;
}

const PlaceholderTab: React.FC<{ label: string; description?: string }> = ({ label, description }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '300px', color: 'var(--text-muted)', fontSize: '1.1rem', flexDirection: 'column', gap: '0.5rem' }}>
        <MIcon name="description" size={40} style={{opacity: 0.3}} />
        <span><strong>{label}</strong> modülü yakında eklenecek.</span>
        {description && <span style={{ fontSize: '0.85rem', maxWidth: '500px', textAlign: 'center' }}>{description}</span>}
    </div>
);

const CompanyDetailLayout: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTabState] = useState(() => searchParams.get('tab') || 'profesyoneller');
    const [company, setCompany] = useState<CompanyInfo | null>(null);
    const [hasKurulUyesi, setHasKurulUyesi] = useState(false);


    const setActiveTab = (tabId: string) => {
        setActiveTabState(tabId);
        setSearchParams({ tab: tabId }, { replace: true });
    };

    const fetchCompany = async () => {
        if (!id) return;
        try {
            const res = await apiFetch(`${API_BASE}/api/companies/${id}`);
            if (res.ok) {
                const data = await res.json();
                setCompany(data);
            }
        } catch (error) {
            console.error('Error fetching company', error);
        }
    };

    const fetchAssignments = async () => {
        if (!id) return;
        try {
            const res = await apiFetch(`${API_BASE}/api/companies/${id}/assignments`);
            if (res.ok) {
                const data = await res.json();
                setHasKurulUyesi(data.some((a: any) => a.assignment_type === 'ISG_Kurul_Uyesi'));
            }
        } catch (error) {
            console.error('Error fetching assignments', error);
        }
    };

    useEffect(() => {
        fetchCompany();
        fetchAssignments();
    }, [id]);

    // ISG iş akışına göre doğru sekme sırası
    const tabs = [
        { id: 'profesyoneller', label: 'İSG Profesyonelleri', icon: <MIcon name="engineering" size={18} /> },
        { id: 'personeller', label: 'Personel Listesi', icon: <MIcon name="group" size={18} /> },
        { id: 'egitim', label: 'İSG Eğitimleri', icon: <MIcon name="school" size={18} /> },
        { id: 'saglik', label: 'Sağlık Gözetimi', icon: <MIcon name="medical_services" size={18} /> },
        { id: 'risk', label: 'Risk Değerlendirmesi', icon: <MIcon name="fact_check" size={18} /> },
        { id: 'acildurum', label: 'Acil Durum Planı', icon: <MIcon name="local_fire_department" size={18} /> },
        { id: 'atamalar', label: 'Görevlendirmeler', icon: <MIcon name="business_center" size={18} /> },
        { id: 'denetim', label: 'Saha Denetimleri', icon: <MIcon name="verified_user" size={18} /> },
        { id: 'kaza', label: 'İş Kazaları & Ramak Kala', icon: <MIcon name="warning" size={18} /> },
        { id: 'periyodik', label: 'Periyodik Kontroller', icon: <MIcon name="speed" size={18} /> },
        { id: 'planlar', label: 'Yıllık Planlar & Dokümanlar', icon: <MIcon name="description" size={18} /> },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.breadcrumb}>
                    <Link to="/companies" className={styles.backLink}>
                        <MIcon name="arrow_back" size={16} /> Firmalara Dön
                    </Link>
                </div>

                <div className={styles.companyInfoCard}>
                    <div className={styles.companyMainDetails}>
                        <div className={styles.titleWrapper}>
                            <h1 className={styles.title}>
                                {company ? company.official_title : '...'}
                            </h1>
                            <span className={`${styles.badge} ${company?.is_active ? styles.badgeActive : styles.badgeDanger}`}>
                                {company ? (company.is_active ? 'Aktif' : 'Pasif') : ''}
                            </span>
                            {company?.tehlikeSinifi && (
                                <span className={`${styles.badge} ${company.tehlikeSinifi === 'Çok Tehlikeli' ? styles.badgeDanger :
                                    company.tehlikeSinifi === 'Tehlikeli' ? styles.badgeWarning :
                                        styles.badgeSuccess
                                    }`}>
                                    {company.tehlikeSinifi}
                                </span>
                            )}
                        </div>
                        <p className={styles.sgkText}>
                            {company?.nace_code ? `${company.nace_code} — ${company.nace_description}` : '—'}
                        </p>
                    </div>

                    <div className={styles.companyStats}>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>Çalışan Sayısı</span>
                            <span className={`${styles.statValue} ${(company?.employee_count ?? 0) > 50 ? styles.statValueHigh : ''}`}>{company?.employee_count ?? '—'}</span>
                        </div>
                        <div className={styles.statBox}>
                            <span className={styles.statLabel}>İşveren/Vekili</span>
                            <span className={styles.statValueText}>{company?.employer_name || '—'}</span>
                        </div>
                        <button
                            className={styles.exportWordBtn}
                            onClick={() => window.open(`${API_BASE}/api/companies/${id}/export/docx`, '_blank')}
                            title="Firma Bilgi Kartını Word olarak indir"
                        >
                            <MIcon name="download" size={15} /> Word İndir
                        </button>
                    </div>
                </div>
            </div>

            {(company?.employee_count ?? 0) >= 50 && !hasKurulUyesi && (
                <div className={styles.kurulWarning}>
                    <MIcon name="info" size={16} />
                    <span>50 ve üzeri çalışanı olan işyerlerinde İSG Kurulu oluşturulması zorunludur. Görevlendirmeler sekmesinden kurul üyesi atayın.</span>
                </div>
            )}

            <div className={styles.tabContainer}>
                <div className={styles.tabList}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className={styles.tabContentArea}>
                    {activeTab === 'profesyoneller' && <ProfessionalsTab companyId={id!} />}
                    {activeTab === 'personeller' && <EmployeesTab companyId={id!} onPersonnelChange={fetchCompany} />}
                    {activeTab === 'egitim' && <TrainingTab companyId={id!} />}
                    {activeTab === 'saglik' && <HealthSurveillanceTab companyId={id!} />}
                    {activeTab === 'risk' && <RiskAssessmentTab companyId={id!} />}
                    {activeTab === 'acildurum' && <PlaceholderTab label="Acil Durum Planı" description="Acil durum eylem planı, toplanma noktaları, tahliye krokisi ve senaryo bazlı tatbikat planları." />}
                    {activeTab === 'atamalar' && <AssignmentsTab companyId={id!} />}
                    {activeTab === 'denetim' && <SahaDenetimleriTab companyId={id!} />}
                    {activeTab === 'kaza' && <PlaceholderTab label="İş Kazaları & Ramak Kala" description="Kaza bildirimleri, ramak kala raporları, kök neden analizi ve istatistikler." />}
                    {activeTab === 'periyodik' && <PlaceholderTab label="Periyodik Kontroller & Ortam Ölçümleri" description="Makine/ekipman periyodik kontrolleri, gürültü-toz-kimyasal ortam ölçümleri." />}
                    {activeTab === 'planlar' && <PlansTab />}
                </div>
            </div>
        </div>
    );
};

export default CompanyDetailLayout;
