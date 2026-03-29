import ComingSoon from '../../components/ComingSoon/ComingSoon';

const Dashboard: React.FC = () => (
    <ComingSoon
        icon="dashboard"
        title="Genel Bakış Paneli"
        subtitle="Ana Sayfa · Canlı Veriler"
        description="Tüm firmaların İSG durumunu tek ekranda takip edin. Sona eren belgeler, yaklaşan muayeneler, risk seviyeleri ve aylık performans verilerini gerçek zamanlı olarak izleyin."
        features={[
            { icon: 'bar_chart', text: 'Firma bazlı İSG uyum skoru ve trend grafikleri' },
            { icon: 'notifications_active', text: 'Sona eren belge ve eğitim uyarıları' },
            { icon: 'health_and_safety', text: 'Personel sağlık muayenesi takip panosu' },
            { icon: 'assignment_late', text: 'Açık aksiyon ve görev yönetimi' },
            { icon: 'calendar_month', text: 'Aylık hizmet planı ve zaman çizelgesi' },
        ]}
        accentColor="#6366f1"
        gradientFrom="#6366f1"
        gradientTo="#8b5cf6"
    />
);

export default Dashboard;
