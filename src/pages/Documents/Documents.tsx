import ComingSoon from '../../components/ComingSoon/ComingSoon';

const Documents: React.FC = () => (
    <ComingSoon
        icon="inventory_2"
        title="Doküman Arşivi"
        subtitle="Merkezi Belge Yönetimi · Bulut Depolama"
        description="Tüm İSG belgelerinizi tek bir güvenli arşivde saklayın. İş sözleşmeleri, eğitim sertifikaları, risk değerlendirme raporları ve yasal bildirimlere anında erişin."
        features={[
            { icon: 'cloud_upload', text: 'Sürükle-bırak ile toplu belge yükleme' },
            { icon: 'folder_special', text: 'Firma ve kategori bazlı akıllı klasörleme' },
            { icon: 'search', text: 'İçerik tabanlı tam metin arama (OCR)' },
            { icon: 'verified', text: 'Belge geçerlilik tarihi takibi ve otomatik uyarı' },
            { icon: 'share', text: 'Güvenli link ile dış paydaş erişim yönetimi' },
        ]}
        accentColor="#10b981"
        gradientFrom="#10b981"
        gradientTo="#0ea5e9"
    />
);

export default Documents;
