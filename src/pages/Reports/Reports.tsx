import ComingSoon from '../../components/ComingSoon/ComingSoon';

const Reports: React.FC = () => (
    <ComingSoon
        icon="analytics"
        title="Raporlar & İstatistikler"
        subtitle="Gelişmiş Analitik · Veri Odaklı Kararlar"
        description="Firma ve personel verilerinizi anlamlı raporlara dönüştürün. Periyodik denetim sonuçlarını, kaza istatistiklerini ve İSG performans metriklerini PDF veya Excel formatında dışa aktarın."
        features={[
            { icon: 'picture_as_pdf', text: 'Tek tıkla profesyonel PDF rapor üretimi' },
            { icon: 'table_chart', text: 'Excel tabanlı personel ve sağlık raporu ihracı' },
            { icon: 'show_chart', text: 'Aylık / yıllık kaza ve ramak kala istatistikleri' },
            { icon: 'compare_arrows', text: 'Firma karşılaştırmalı İSG uyum analizi' },
            { icon: 'schedule_send', text: 'Otomatik periyodik rapor e-posta gönderimi' },
        ]}
        accentColor="#0ea5e9"
        gradientFrom="#0ea5e9"
        gradientTo="#6366f1"
    />
);

export default Reports;
