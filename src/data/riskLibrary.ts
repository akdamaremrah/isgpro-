export interface RiskFactor {
    id: string;
    label: string;
}

export interface RiskCategory {
    id: string;
    label: string;
    icon: string;
    color: string;
    factors: RiskFactor[];
}

export const RISK_LIBRARY: RiskCategory[] = [
    {
        id: 'elektrik',
        label: 'Elektrik',
        icon: 'bolt',
        color: '#f59e0b',
        factors: [
            { id: 'e1', label: 'Açık / hasarlı elektrik kablosu' },
            { id: 'e2', label: 'Kaçak akım / topraklama yetersizliği' },
            { id: 'e3', label: 'Islak zeminde elektrikli alet kullanımı' },
            { id: 'e4', label: 'Elektrik panosuna yetkisiz erişim' },
            { id: 'e5', label: 'Yüksek gerilim hattı yakınında çalışma' },
            { id: 'e6', label: 'Statik elektrik birikimi' },
            { id: 'e7', label: 'Aşırı yüklenmiş priz / çoklu uzatma' },
            { id: 'e8', label: 'Kaçak akım rölesi (RCCB) eksikliği' },
            { id: 'e9', label: 'Elektrik ark ve kıvılcım tehlikesi' },
            { id: 'e10', label: 'Yıldırım çarpması riski (açık alan çalışması)' },
        ]
    },
    {
        id: 'yangin',
        label: 'Yangın & Patlama',
        icon: 'local_fire_department',
        color: '#ef4444',
        factors: [
            { id: 'y1', label: 'Yanıcı / parlayıcı madde depolama' },
            { id: 'y2', label: 'Gaz kaçağı (LPG, doğalgaz, asetilen)' },
            { id: 'y3', label: 'Patlayıcı toz birikimi (ATEX)' },
            { id: 'y4', label: 'Sıcak çalışma (kesme, kaynak, taşlama)' },
            { id: 'y5', label: 'Yangın söndürme ekipmanı yetersizliği' },
            { id: 'y6', label: 'Kaçış yollarının engellenmesi' },
            { id: 'y7', label: 'Sigara içme / açık ateş yasak alanda' },
            { id: 'y8', label: 'Kimyasal depo yangın riski' },
            { id: 'y9', label: 'Oksijen tüpü / kompresör patlaması' },
            { id: 'y10', label: 'Yangın alarm / sprinkler sistemi arızası' },
        ]
    },
    {
        id: 'yuksekte',
        label: 'Yüksekte Çalışma',
        icon: 'vertical_align_top',
        color: '#8b5cf6',
        factors: [
            { id: 'yk1', label: 'Merdiven kullanımı (sabit / seyyar)' },
            { id: 'yk2', label: 'İskele / platform üzerinde çalışma' },
            { id: 'yk3', label: 'Çatı / dam çalışması' },
            { id: 'yk4', label: 'Kuyu / hendek / çukur kenarında çalışma' },
            { id: 'yk5', label: 'Vinç / sepetli platform (personel sepeti)' },
            { id: 'yk6', label: 'Baret / emniyet kemeri kullanılmaması' },
            { id: 'yk7', label: 'Güvenlik halatı / yaşam hattı eksikliği' },
            { id: 'yk8', label: 'Kırılgan çatı / döşeme yüzeyi' },
            { id: 'yk9', label: 'Korumasız kenar / açıklık (boşluk düşmesi)' },
            { id: 'yk10', label: 'Nesne / malzeme düşmesi (aşağıya)' },
        ]
    },
    {
        id: 'mekanik',
        label: 'Mekanik Tehlikeler',
        icon: 'settings',
        color: '#64748b',
        factors: [
            { id: 'm1', label: 'Dönen makine parçaları (koruma kapaksız)' },
            { id: 'm2', label: 'Kesici / sivri alet yaralanması' },
            { id: 'm3', label: 'Pres / zımba / kalıp sıkışması' },
            { id: 'm4', label: 'Sıkışma / ezilme (iki hareketli parça arası)' },
            { id: 'm5', label: 'Taşlama diski kırılması / fırlaması' },
            { id: 'm6', label: 'Bant konveyör tehlikesi' },
            { id: 'm7', label: 'Vinç / kaldırma ekipmanı yük düşmesi' },
            { id: 'm8', label: 'Kompresör / basınçlı ekipman patlaması' },
            { id: 'm9', label: 'Enerji serbest kalması (LOTO eksikliği)' },
            { id: 'm10', label: 'İş makinesi / ekskavatör devrilmesi' },
        ]
    },
    {
        id: 'kimyasal',
        label: 'Kimyasal Tehlikeler',
        icon: 'science',
        color: '#10b981',
        factors: [
            { id: 'k1', label: 'Boya / vernik solvent buharı soluma' },
            { id: 'k2', label: 'Asit / baz (kostik) ile temas' },
            { id: 'k3', label: 'Yapıştırıcı / reçine kimyasal teması' },
            { id: 'k4', label: 'Pestisit / zirai ilaç maruziyeti' },
            { id: 'k5', label: 'Ağır metal maruziyeti (kurşun, cıva, krom)' },
            { id: 'k6', label: 'Yanıcı solvent ile çalışma' },
            { id: 'k7', label: 'Kimyasal sıçrama (gözler / cilt)' },
            { id: 'k8', label: 'MSDS / Güvenlik Bilgi Formu eksikliği' },
            { id: 'k9', label: 'Kimyasal etiketleme yetersizliği' },
            { id: 'k10', label: 'Kimyasal uyumsuzluk (birbirine karışma)' },
            { id: 'k11', label: 'Yağ / gres ile cildin uzun süreli teması' },
            { id: 'k12', label: 'Beton / çimento tozu dermatiti' },
        ]
    },
    {
        id: 'fiziksel',
        label: 'Fiziksel Etkenler',
        icon: 'graphic_eq',
        color: '#3b82f6',
        factors: [
            { id: 'f1', label: 'Gürültü maruziyeti (işitme kaybı)' },
            { id: 'f2', label: 'El-kol titreşimi (vibrasyon aleti)' },
            { id: 'f3', label: 'Tüm vücut titreşimi (iş makinesi)' },
            { id: 'f4', label: 'Termal stres / sıcak çalışma ortamı' },
            { id: 'f5', label: 'Soğuk ortamda çalışma (hipotermi)' },
            { id: 'f6', label: 'Yetersiz aydınlatma' },
            { id: 'f7', label: 'Parlama / kamaşma (direkt güneş, ark ışığı)' },
            { id: 'f8', label: 'Radyasyon maruziyeti (iyonlaştırıcı)' },
            { id: 'f9', label: 'UV radyasyon (kaynak, güneş)' },
            { id: 'f10', label: 'Lazer ışını tehlikesi' },
            { id: 'f11', label: 'İnfrazon / ultrason maruziyeti' },
        ]
    },
    {
        id: 'biyolojik',
        label: 'Biyolojik Tehlikeler',
        icon: 'coronavirus',
        color: '#06b6d4',
        factors: [
            { id: 'b1', label: 'Bakteri / virüs maruziyeti' },
            { id: 'b2', label: 'Kan ve vücut sıvılarıyla temas (kesici alet)' },
            { id: 'b3', label: 'Mantar / küf sporları soluma' },
            { id: 'b4', label: 'Böcek / haşere ısırması' },
            { id: 'b5', label: 'Hayvan teması (ısırma, tırmalama)' },
            { id: 'b6', label: 'Gıda kaynaklı enfeksiyon riski' },
            { id: 'b7', label: 'Atık su / pis su teması' },
            { id: 'b8', label: 'Tıbbi atık maruziyeti' },
        ]
    },
    {
        id: 'ergonomik',
        label: 'Ergonomik Tehlikeler',
        icon: 'accessibility_new',
        color: '#f97316',
        factors: [
            { id: 'er1', label: 'Ağır yük kaldırma / taşıma (25 kg üzeri)' },
            { id: 'er2', label: 'Tekrarlı el / bilek hareketi' },
            { id: 'er3', label: 'Zorlanmış / eğik çalışma postürü' },
            { id: 'er4', label: 'Uzun süreli ayakta durma' },
            { id: 'er5', label: 'Uzun süreli oturma / hareketsizlik' },
            { id: 'er6', label: 'Dar / kısıtlı çalışma alanı' },
            { id: 'er7', label: 'Yüksek iş temposu / stres' },
            { id: 'er8', label: 'Gece vardiyası / uzun vardiya' },
        ]
    },
    {
        id: 'ulasim',
        label: 'Ulaşım & Trafik',
        icon: 'local_shipping',
        color: '#ec4899',
        factors: [
            { id: 'u1', label: 'Forklift / istif aracı çarpması' },
            { id: 'u2', label: 'Araç - yaya çakışması (tesis içi)' },
            { id: 'u3', label: 'Trafik kazası (şantiye yolu)' },
            { id: 'u4', label: 'Araç devrilmesi / takla' },
            { id: 'u5', label: 'Geri manevra sırasında çarpma' },
            { id: 'u6', label: 'Yük kayması / devrilmesi' },
            { id: 'u7', label: 'Taşıt bakım / onarım sırasında ezilme' },
        ]
    },
    {
        id: 'dusme',
        label: 'Düşme & Kayma',
        icon: 'warning',
        color: '#84cc16',
        factors: [
            { id: 'd1', label: 'Kaygan zemin (yağ, su, talaş)' },
            { id: 'd2', label: 'Takılıp düşme (kablo, hortum, eşik)' },
            { id: 'd3', label: 'Düzensiz / hasarlı zemin yüzeyi' },
            { id: 'd4', label: 'Çukur / greyting açıklığı (kapaksız)' },
            { id: 'd5', label: 'Merdiven basamağı kayması' },
            { id: 'd6', label: 'Buzlu / ıslak dış zemin' },
            { id: 'd7', label: 'Korkuluk / trabzan eksikliği' },
        ]
    },
    {
        id: 'kapali_alan',
        label: 'Kapalı Alan',
        icon: 'door_back',
        color: '#6366f1',
        factors: [
            { id: 'ka1', label: 'Oksijen yetersizliği (boğulma)' },
            { id: 'ka2', label: 'Zehirli gaz birikimi (CO, H₂S, NH₃)' },
            { id: 'ka3', label: 'Yangın / patlama (tutuşabilir gaz)' },
            { id: 'ka4', label: 'Sıcak ortam / ısı birikimi' },
            { id: 'ka5', label: 'Sınırlı kurtarma / tahliye imkânı' },
            { id: 'ka6', label: 'Giriş izni / gözetim yetersizliği' },
            { id: 'ka7', label: 'Katı / sıvı boğulma (silo, tank)' },
        ]
    },
    {
        id: 'insaat',
        label: 'İnşaat & Kazı',
        icon: 'construction',
        color: '#ca8a04',
        factors: [
            { id: 'i1', label: 'Kazı / şev çökmesi' },
            { id: 'i2', label: 'Yeraltı hattına çarpma (elektrik, gaz, su)' },
            { id: 'i3', label: 'Beton dökümü (kalıp devrilmesi)' },
            { id: 'i4', label: 'Demir / çelik montajı (düşme, devirme)' },
            { id: 'i5', label: 'Toz (silika, çimento, alçı)' },
            { id: 'i6', label: 'Vinç / kren yük düşmesi' },
            { id: 'i7', label: 'Demonte yapı elemanı devrilmesi' },
        ]
    },
    {
        id: 'kkd',
        label: 'KKD & Mevzuat',
        icon: 'health_and_safety',
        color: '#0ea5e9',
        factors: [
            { id: 'kd1', label: 'Baret kullanılmaması' },
            { id: 'kd2', label: 'Emniyet kemeri / düşme engelleyici kullanılmaması' },
            { id: 'kd3', label: 'Koruyucu gözlük / yüz siperi kullanılmaması' },
            { id: 'kd4', label: 'Kulak koruyucu kullanılmaması' },
            { id: 'kd5', label: 'Koruyucu eldiven kullanılmaması' },
            { id: 'kd6', label: 'Çelik burunlu / anti-statik ayakkabı eksikliği' },
            { id: 'kd7', label: 'Solunum koruyucu (maske / respiratör) eksikliği' },
            { id: 'kd8', label: 'İSG eğitimi yetersizliği / eğitimsiz çalışan' },
            { id: 'kd9', label: 'Talimat / prosedür eksikliği' },
            { id: 'kd10', label: 'Acil durum planı / tatbikat eksikliği' },
            { id: 'kd11', label: 'İlk yardım malzeme / personel yetersizliği' },
        ]
    },
];
