// ─────────────────────────────────────────────────────────────────────────────
// Guided Library V2  —  Sektör → Alt Sektör → Aşama → Alt Aşama → Öğe
// Her öğe: ItemType (is / faaliyet / ekipman / ortam) + bağlı tehlike kaynakları
// ─────────────────────────────────────────────────────────────────────────────

export type ItemType = 'is' | 'faaliyet' | 'ekipman' | 'ortam';

export const ITEM_TYPE_LABELS: Record<ItemType, string> = {
    is: 'Yapılan İş',
    faaliyet: 'Faaliyet',
    ekipman: 'Ekipman',
    ortam: 'Ortam',
};

export const ITEM_TYPE_COLORS: Record<ItemType, string> = {
    is: '#f59e0b',
    faaliyet: '#3b82f6',
    ekipman: '#8b5cf6',
    ortam: '#10b981',
};

export interface GuidedItem {
    id: string;
    label: string;
    itemType: ItemType;
    hazards: string[];
}

export interface GuidedSubPhase {
    id: string;
    label: string;
    items: GuidedItem[];
}

export interface GuidedPhase {
    id: string;
    label: string;
    icon: string;
    subPhases: GuidedSubPhase[];
}

export interface GuidedSubtype {
    id: string;
    label: string;
    icon: string;
    phases: GuidedPhase[];
}

export interface GuidedSector {
    id: string;
    label: string;
    icon: string;
    color: string;
    subtypeQuestion: string;
    subtypes: GuidedSubtype[];
}

// ─── Yardımcı: ID üretici ────────────────────────────────────────────────────
let _id = 0;
const id = () => `gi_${++_id}`;

// ─────────────────────────────────────────────────────────────────────────────
// ORTAK İNCELEME KONULARI — Tüm sektörlerde alt tür olarak eklenir (20 modül)
// ─────────────────────────────────────────────────────────────────────────────
const COMMON_SUBTYPE: GuidedSubtype = {
    id: 'ortak_inceleme',
    label: 'Ortak İnceleme Konuları',
    icon: 'playlist_add_check',
    phases: [
        // 1 — Organizasyon & Yönetimsel Riskler
        {
            id: 'oi_01', label: '1 — Organizasyon & Yönetimsel Riskler', icon: 'account_tree',
            subPhases: [{ id: 'oi_01_1', label: 'Yönetim Sistemi', items: [
                { id: id(), label: 'Görev, yetki ve sorumlulukların belirsizliği', itemType: 'faaliyet', hazards: ['Yetkisiz müdahale', 'Denetim açığı', 'Sorumluluk karmaşası'] },
                { id: id(), label: 'Eğitim yetersizliği', itemType: 'faaliyet', hazards: ['Bilinçsiz çalışma', 'Güvensiz davranış', 'Yasal uyumsuzluk'] },
                { id: id(), label: 'Talimat ve prosedür eksikliği', itemType: 'faaliyet', hazards: ['Güvensiz iş yöntemi', 'Tutarsız uygulama'] },
                { id: id(), label: 'Yetkisiz çalışma', itemType: 'faaliyet', hazards: ['Kazaya sürükleme', 'Denetim açığı'] },
                { id: id(), label: 'Denetim eksikliği', itemType: 'faaliyet', hazards: ['Uygunsuzlukların kaçırılması', 'Güvensiz davranışların sürmesi'] },
                { id: id(), label: 'İşe uygun personel görevlendirilmemesi', itemType: 'faaliyet', hazards: ['Beceri uyumsuzluğu', 'Kaza riski artışı'] },
                { id: id(), label: 'Alt işveren / taşeron koordinasyon eksikliği', itemType: 'faaliyet', hazards: ['Sorumluluk belirsizliği', 'Koordinasyon kazası'] },
                { id: id(), label: 'Kayıt ve dokümantasyon eksikliği', itemType: 'faaliyet', hazards: ['Yasal yaptırım', 'İzlenebilirlik kaybı'] },
                { id: id(), label: 'Uygunsuzlukların kapatılmaması', itemType: 'faaliyet', hazards: ['Tekrarlayan kaza', 'Kronik risk'] },
            ]}],
        },
        // 2 — Çalışma Alanı Düzeni & Saha Güvenliği
        {
            id: 'oi_02', label: '2 — Çalışma Alanı Düzeni & Saha Güvenliği', icon: 'cleaning_services',
            subPhases: [{ id: 'oi_02_1', label: 'Düzen & Housekeeping', items: [
                { id: id(), label: 'Düzensiz istifleme', itemType: 'ortam', hazards: ['Yük devrilmesi', 'Ezilme', 'Takılma'] },
                { id: id(), label: 'Dar geçiş yolları', itemType: 'ortam', hazards: ['Sıkışma', 'Tahliye engeli', 'Çarpma'] },
                { id: id(), label: 'Kayma, takılma, düşme tehlikesi', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Kırık/burkul'] },
                { id: id(), label: 'Yetersiz housekeeping (genel temizlik düzeni)', itemType: 'ortam', hazards: ['Yangın riski', 'Kayma', 'Solunum riski'] },
                { id: id(), label: 'Kaçış yollarının kapanması', itemType: 'ortam', hazards: ['Tahliye engeli', 'Yangında kapana kısılma'] },
                { id: id(), label: 'Yetersiz alan ayrımı', itemType: 'ortam', hazards: ['Yaya-araç çarpışması', 'Sınır karışıklığı'] },
                { id: id(), label: 'Yaya-araç yolu karışması', itemType: 'ortam', hazards: ['Araç-yaya çarpışması', 'Ezilme'] },
                { id: id(), label: 'Düşen cisim riski', itemType: 'ortam', hazards: ['Cisim çarpması', 'Kafa yaralanması'] },
                { id: id(), label: 'Uygun olmayan zemin yüzeyi', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Zemin çökmesi'] },
            ]}],
        },
        // 3 — Bina, Tesis & Yapısal Güvenlik
        {
            id: 'oi_03', label: '3 — Bina, Tesis & Yapısal Güvenlik', icon: 'foundation',
            subPhases: [{ id: 'oi_03_1', label: 'Yapı & Altyapı', items: [
                { id: id(), label: 'Yapısal bozukluklar (çatlak, çöküntü vb.)', itemType: 'ortam', hazards: ['Yapı çökmesi', 'Cisim düşmesi'] },
                { id: id(), label: 'Platform, korkuluk ve merdiven uygunsuzluğu', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Düşme'] },
                { id: id(), label: 'Zeminde çökme veya kırılma riski', itemType: 'ortam', hazards: ['Zemin çökmesi', 'Düşme'] },
                { id: id(), label: 'Tavan, raf ve askı sistemleri riski', itemType: 'ortam', hazards: ['Yük düşmesi', 'Cisim çarpması'] },
                { id: id(), label: 'Kapı, geçiş ve çıkışların uygunsuzluğu', itemType: 'ortam', hazards: ['Sıkışma', 'Tahliye engeli'] },
                { id: id(), label: 'Acil çıkışların yetersizliği', itemType: 'ortam', hazards: ['Tahliye engeli', 'Yangında kapana kısılma'] },
            ]}],
        },
        // 4 — Makine, Ekipman & Teknik Donanım Güvenliği
        {
            id: 'oi_04', label: '4 — Makine, Ekipman & Teknik Donanım Güvenliği', icon: 'settings',
            subPhases: [{ id: 'oi_04_1', label: 'Makine Güvenliği', items: [
                { id: id(), label: 'Koruyucu eksikliği (kapak, bariyer, kafes)', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Amputasyon', 'Kesilme'] },
                { id: id(), label: 'Hareketli aksam teması riski', itemType: 'ekipman', hazards: ['Amputasyon', 'Ezilme', 'Kesilme'] },
                { id: id(), label: 'Sıkışma, ezilme, kesilme riski', itemType: 'is', hazards: ['Ezilme/sıkışma', 'Amputasyon', 'Kırık'] },
                { id: id(), label: 'Beklenmedik çalıştırma riski', itemType: 'ekipman', hazards: ['Beklenmedik enerjilenme', 'Amputasyon'] },
                { id: id(), label: 'Bakım eksikliği', itemType: 'faaliyet', hazards: ['Mekanik arıza', 'Kontrol kaybı'] },
                { id: id(), label: 'Periyodik kontrol eksikliği', itemType: 'faaliyet', hazards: ['Yasal yaptırım', 'Gizli arıza'] },
                { id: id(), label: 'Uygunsuz ekipman kullanımı', itemType: 'is', hazards: ['Kaza', 'Ekipman hasarı'] },
                { id: id(), label: 'Arızalı ekipmanla çalışma', itemType: 'is', hazards: ['Kontrol kaybı', 'Mekanik arıza', 'Kaza'] },
                { id: id(), label: 'Acil stop yetersizliği', itemType: 'ekipman', hazards: ['Acil durdurma başarısızlığı', 'Kaza büyümesi'] },
            ]}],
        },
        // 5 — Elektrik Güvenliği
        {
            id: 'oi_05', label: '5 — Elektrik Güvenliği', icon: 'bolt',
            subPhases: [{ id: 'oi_05_1', label: 'Elektrik Tehlikeleri', items: [
                { id: id(), label: 'Elektrik çarpması riski', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Kalp durması', 'Yanık'] },
                { id: id(), label: 'Kaçak akım', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Yangın'] },
                { id: id(), label: 'Topraklama yetersizliği', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Kaçak akım'] },
                { id: id(), label: 'Hasarlı kablo veya priz', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Yangın', 'Ark'] },
                { id: id(), label: 'Pano uygunsuzluğu', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Ark flash', 'Yangın'] },
                { id: id(), label: 'Yetkisiz elektrik müdahalesi', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Kısa devre'] },
                { id: id(), label: 'Islak ortamda elektrik riski', itemType: 'ortam', hazards: ['Elektrik çarpması', 'Kaçak akım'] },
                { id: id(), label: 'Aşırı yüklenme', itemType: 'ekipman', hazards: ['Yangın', 'Kablo yanması'] },
                { id: id(), label: 'Ark ve kısa devre riski', itemType: 'ekipman', hazards: ['Ark flash', 'Yangın', 'Yanık'] },
            ]}],
        },
        // 6 — Yangın & Patlama Riskleri
        {
            id: 'oi_06', label: '6 — Yangın & Patlama Riskleri', icon: 'local_fire_department',
            subPhases: [{ id: 'oi_06_1', label: 'Yangın & Patlama', items: [
                { id: id(), label: 'Yanıcı malzeme varlığı', itemType: 'ortam', hazards: ['Yangın', 'Patlama'] },
                { id: id(), label: 'Ateşleyici kaynaklar (kıvılcım, ısı vb.)', itemType: 'ortam', hazards: ['Yangın', 'Patlama'] },
                { id: id(), label: 'Yanıcı malzemenin uygunsuz depolanması', itemType: 'faaliyet', hazards: ['Yangın', 'Patlama'] },
                { id: id(), label: 'Yangın söndürme ekipmanı eksikliği', itemType: 'ekipman', hazards: ['Yangın büyümesi', 'Kontrol kaybı'] },
                { id: id(), label: 'Yangın algılama ve alarm yetersizliği', itemType: 'ekipman', hazards: ['Geç tahliye', 'Yangın büyümesi'] },
                { id: id(), label: 'Acil tahliye planı yetersizliği', itemType: 'faaliyet', hazards: ['Yangında kapana kısılma', 'Duman zehirlenmesi'] },
                { id: id(), label: 'Statik elektrik riski', itemType: 'ortam', hazards: ['Yangın', 'Patlama', 'Elektrik şoku'] },
                { id: id(), label: 'Gaz, buhar veya toz kaynaklı patlama riski', itemType: 'ortam', hazards: ['Patlama', 'Yangın', 'Hasar'] },
                { id: id(), label: 'Sıcak çalışma (kaynak/taşlama) kontrol eksikliği', itemType: 'faaliyet', hazards: ['Yangın', 'Patlama', 'Yanık'] },
            ]}],
        },
        // 7 — Kimyasal Riskler
        {
            id: 'oi_07', label: '7 — Kimyasal Riskler', icon: 'science',
            subPhases: [{ id: 'oi_07_1', label: 'Kimyasal Tehlikeler', items: [
                { id: id(), label: 'Kimyasala maruziyet', itemType: 'faaliyet', hazards: ['Kimyasal zehirlenme', 'Akut maruziyet', 'Kronik etki'] },
                { id: id(), label: 'Solunum yolu etkileri', itemType: 'faaliyet', hazards: ['Solunum yolu hasarı', 'Zehirlenme'] },
                { id: id(), label: 'Göz ve deri teması', itemType: 'faaliyet', hazards: ['Kimyasal yanık', 'Göz hasarı', 'Deri tahrişi'] },
                { id: id(), label: 'Kimyasal yanık riski', itemType: 'is', hazards: ['Kimyasal yanık', 'Doku hasarı'] },
                { id: id(), label: 'Zehirlenme riski', itemType: 'faaliyet', hazards: ['Zehirlenme', 'Organ hasarı', 'Ölüm'] },
                { id: id(), label: 'Uygunsuz kimyasal etiketleme', itemType: 'ekipman', hazards: ['Yanlış kimyasal kullanımı', 'Karışım riski'] },
                { id: id(), label: 'SDS (güvenlik bilgi formu) erişim eksikliği', itemType: 'faaliyet', hazards: ['Bilinçsiz maruziyet', 'Yasal uyumsuzluk'] },
                { id: id(), label: 'Kimyasalların uyumsuz depolanması', itemType: 'ortam', hazards: ['Tehlikeli reaksiyon', 'Yangın', 'Patlama'] },
                { id: id(), label: 'Dökülme ve sızıntı riski', itemType: 'faaliyet', hazards: ['Cilt/göz teması', 'Kayma', 'Yangın'] },
                { id: id(), label: 'Atık kimyasal yönetimi eksikliği', itemType: 'faaliyet', hazards: ['Çevre kirliliği', 'Kronik maruziyet'] },
            ]}],
        },
        // 8 — Toz, Duman, Buhar, Gaz & Havalandırma
        {
            id: 'oi_08', label: '8 — Toz, Duman, Buhar, Gaz & Havalandırma', icon: 'air',
            subPhases: [{ id: 'oi_08_1', label: 'Hava Kalitesi', items: [
                { id: id(), label: 'Solunabilir toz maruziyeti', itemType: 'ortam', hazards: ['Pnömokonyoz', 'Silikoz', 'Solunum yolu hasarı'] },
                { id: id(), label: 'Proses tozu (metal/taş/odun/un vb.)', itemType: 'ortam', hazards: ['Mesleki solunum hastalığı', 'Toz patlaması'] },
                { id: id(), label: 'Kaynak dumanı maruziyeti', itemType: 'ortam', hazards: ['Metal duman ateşi', 'Akciğer hasarı'] },
                { id: id(), label: 'Solvent buharı maruziyeti', itemType: 'ortam', hazards: ['Nörotoksisite', 'Yangın', 'Patlama'] },
                { id: id(), label: 'Egzoz gazı (CO) maruziyeti', itemType: 'ortam', hazards: ['CO zehirlenmesi', 'Solunum yolu hasarı'] },
                { id: id(), label: 'Oksijen yetersizliği (kapalı alan)', itemType: 'ortam', hazards: ['Boğulma', 'Bilinç kaybı'] },
                { id: id(), label: 'Lokal emiş (LEV) eksikliği', itemType: 'ekipman', hazards: ['Toz/duman birikimi', 'Maruziyet artışı'] },
                { id: id(), label: 'Genel havalandırma yetersizliği', itemType: 'ortam', hazards: ['Hava kalitesi bozulması', 'Birikim'] },
                { id: id(), label: 'Kapalı ortam hava kalitesi sorunları', itemType: 'ortam', hazards: ['Solunum hastalıkları', 'CO₂ birikimi'] },
            ]}],
        },
        // 9 — Fiziksel Etmenler
        {
            id: 'oi_09', label: '9 — Fiziksel Etmenler', icon: 'thermostat',
            subPhases: [{ id: 'oi_09_1', label: 'Fiziksel Tehlikeler', items: [
                { id: id(), label: 'Gürültü maruziyeti', itemType: 'ortam', hazards: ['İşitme kaybı', 'Konsantrasyon bozukluğu'] },
                { id: id(), label: 'Titreşim maruziyeti (el-kol / tam vücut)', itemType: 'ortam', hazards: ['El-kol titreşim sendromu', 'Kas-iskelet hasarı'] },
                { id: id(), label: 'Aşırı sıcak ortam', itemType: 'ortam', hazards: ['Isı çarpması', 'Dehidrasyon', 'Yorgunluk'] },
                { id: id(), label: 'Aşırı soğuk ortam', itemType: 'ortam', hazards: ['Hipotermi', 'Donma', 'Performans düşüşü'] },
                { id: id(), label: 'Aşırı nem', itemType: 'ortam', hazards: ['Kayma', 'Termal konfor bozukluğu', 'Elektrik riski'] },
                { id: id(), label: 'Yetersiz aydınlatma', itemType: 'ortam', hazards: ['Göz yorgunluğu', 'Kaza riski artışı', 'Düşme'] },
                { id: id(), label: 'Parlama ve göz kamaşması', itemType: 'ortam', hazards: ['Göz yaralanması', 'Geçici körlük'] },
                { id: id(), label: 'Radyasyon, UV veya IR maruziyeti', itemType: 'ortam', hazards: ['Deri yanığı', 'Göz hasarı', 'Kanser riski'] },
                { id: id(), label: 'Basınç farkı riski', itemType: 'ortam', hazards: ['Basınçlı sıvı/gaz yaralanması', 'Barotravma'] },
            ]}],
        },
        // 10 — Ergonomi & Kas-İskelet Sistemi Riskleri
        {
            id: 'oi_10', label: '10 — Ergonomi & Kas-İskelet Sistemi Riskleri', icon: 'accessibility_new',
            subPhases: [{ id: 'oi_10_1', label: 'Ergonomik Tehlikeler', items: [
                { id: id(), label: 'Elle kaldırma ve taşıma', itemType: 'is', hazards: ['Bel yaralanması', 'Kas-iskelet zorlanması'] },
                { id: id(), label: 'Uygunsuz çalışma duruşu', itemType: 'is', hazards: ['Kronik ağrı', 'Kas-iskelet hastalığı'] },
                { id: id(), label: 'Tekrarlayan hareket', itemType: 'is', hazards: ['Kas-iskelet hastalığı', 'Tendinit', 'Karpal tünel'] },
                { id: id(), label: 'Uzun süre ayakta çalışma', itemType: 'faaliyet', hazards: ['Yorgunluk', 'Varis', 'Eklem ağrısı'] },
                { id: id(), label: 'Uzun süre oturarak çalışma', itemType: 'faaliyet', hazards: ['Bel ağrısı', 'Dolaşım bozukluğu'] },
                { id: id(), label: 'Zorlayıcı itme ve çekme', itemType: 'is', hazards: ['Kas yaralanması', 'Omuz hasarı'] },
                { id: id(), label: 'Omuz üstü çalışma', itemType: 'is', hazards: ['Omuz yaralanması', 'Boyun zorlanması'] },
                { id: id(), label: 'Diz çökerek çalışma', itemType: 'is', hazards: ['Diz hasarı', 'Kronik ağrı'] },
                { id: id(), label: 'İş istasyonu uygunsuzluğu', itemType: 'ortam', hazards: ['Ergonomik risk', 'Kas-iskelet hastalığı'] },
            ]}],
        },
        // 11 — Biyolojik Riskler
        {
            id: 'oi_11', label: '11 — Biyolojik Riskler', icon: 'biotech',
            subPhases: [{ id: 'oi_11_1', label: 'Biyolojik Tehlikeler', items: [
                { id: id(), label: 'Bakteri, virüs veya mantar maruziyeti', itemType: 'ortam', hazards: ['Enfeksiyon', 'Biyolojik zehirlenme'] },
                { id: id(), label: 'Atık ve kirli yüzey teması', itemType: 'faaliyet', hazards: ['Enfeksiyon', 'Deri hastalığı'] },
                { id: id(), label: 'Haşere ve vektör kaynaklı riskler', itemType: 'ortam', hazards: ['Vektör kaynaklı hastalık', 'Isırık/sokulma'] },
                { id: id(), label: 'Gıda hijyeni kaynaklı riskler', itemType: 'faaliyet', hazards: ['Gıda zehirlenmesi', 'Gastrointestinal hastalık'] },
                { id: id(), label: 'Kan ve vücut sıvısı teması', itemType: 'faaliyet', hazards: ['Kan yoluyla bulaşan hastalık', 'HIV/Hepatit'] },
                { id: id(), label: 'Küf ve nemli ortam etkileri', itemType: 'ortam', hazards: ['Solunum hastalığı', 'Alerjik reaksiyon'] },
            ]}],
        },
        // 12 — El Aletleri & Taşınabilir Ekipmanlar
        {
            id: 'oi_12', label: '12 — El Aletleri & Taşınabilir Ekipmanlar', icon: 'hardware',
            subPhases: [{ id: 'oi_12_1', label: 'El Aleti Güvenliği', items: [
                { id: id(), label: 'Uygunsuz el aleti kullanımı', itemType: 'is', hazards: ['Kesici-delici yaralanma', 'Ezilme', 'Kaza'] },
                { id: id(), label: 'Koruyucusuz el aleti kullanımı', itemType: 'is', hazards: ['Amputasyon', 'Kesilme', 'Göz yaralanması'] },
                { id: id(), label: 'Kesici-delici yaralanma riski', itemType: 'is', hazards: ['Kesilme', 'Delme', 'Enfeksiyon'] },
                { id: id(), label: 'Elektrikli el aleti riski', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Yangın'] },
                { id: id(), label: 'Disk ve uç kırılması', itemType: 'ekipman', hazards: ['Parça fırlaması', 'Göz yaralanması', 'Kesme'] },
                { id: id(), label: 'Kablo hasarı', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Kısa devre', 'Yangın'] },
                { id: id(), label: 'Titreşimli el aleti uzun süreli kullanımı', itemType: 'is', hazards: ['El-kol titreşim sendromu', 'Dolaşım bozukluğu'] },
            ]}],
        },
        // 13 — Kaldırma, Taşıma, İstifleme & Depolama
        {
            id: 'oi_13', label: '13 — Kaldırma, Taşıma, İstifleme & Depolama', icon: 'forklift',
            subPhases: [{ id: 'oi_13_1', label: 'Yük Güvenliği', items: [
                { id: id(), label: 'Yük düşmesi riski', itemType: 'faaliyet', hazards: ['Cisim çarpması', 'Ezilme', 'Kırık'] },
                { id: id(), label: 'Devrilme riski', itemType: 'faaliyet', hazards: ['Ezilme', 'Ezilme/sıkışma', 'Kaza'] },
                { id: id(), label: 'İstif çökmesi', itemType: 'ortam', hazards: ['Ezilme', 'Kırık', 'Ölüm'] },
                { id: id(), label: 'Forklift çarpması', itemType: 'ekipman', hazards: ['Araç-yaya çarpışması', 'Ezilme', 'Ölüm'] },
                { id: id(), label: 'Vinç ve caraskal hataları', itemType: 'ekipman', hazards: ['Yük düşmesi', 'Mekanik arıza'] },
                { id: id(), label: 'Askı ekipmanı uygunsuzluğu (sapan, kanca)', itemType: 'ekipman', hazards: ['Yük düşmesi', 'Kablo/zincir kopması'] },
                { id: id(), label: 'Dengesiz yük', itemType: 'is', hazards: ['Yük devrilmesi', 'Kontrol kaybı'] },
                { id: id(), label: 'Elle taşıma zorlanmaları', itemType: 'is', hazards: ['Kas-iskelet yaralanması', 'Bel hasarı'] },
            ]}],
        },
        // 14 — Araç Trafiği & Hareketli Ekipmanlar
        {
            id: 'oi_14', label: '14 — Araç Trafiği & Hareketli Ekipmanlar', icon: 'local_shipping',
            subPhases: [{ id: 'oi_14_1', label: 'Saha Trafiği', items: [
                { id: id(), label: 'Araç-yaya çarpışması', itemType: 'faaliyet', hazards: ['Ezilme', 'Ölüm', 'Ciddi yaralanma'] },
                { id: id(), label: 'Geri manevra kazaları', itemType: 'faaliyet', hazards: ['Araç-yaya çarpışması', 'Kör nokta kazası'] },
                { id: id(), label: 'Kör nokta riski', itemType: 'ortam', hazards: ['Araç-yaya çarpışması', 'Görüş engeli'] },
                { id: id(), label: 'Hız kontrol eksikliği', itemType: 'faaliyet', hazards: ['Yüksek hızlı çarpışma', 'Devrilme'] },
                { id: id(), label: 'İç saha trafik düzeni eksikliği', itemType: 'ortam', hazards: ['Araç-yaya çarpışması', 'Kargaşa'] },
                { id: id(), label: 'Park ve yükleme alanı uygunsuzluğu', itemType: 'ortam', hazards: ['Çarpışma', 'Devrilme', 'Ezilme'] },
            ]}],
        },
        // 15 — KKD Kullanımı
        {
            id: 'oi_15', label: '15 — KKD Kullanımı', icon: 'safety_check',
            subPhases: [{ id: 'oi_15_1', label: 'KKD Yönetimi', items: [
                { id: id(), label: 'Uygun KKD seçilmemesi', itemType: 'faaliyet', hazards: ['Koruma yetersizliği', 'Maruziyet'] },
                { id: id(), label: 'KKD kullanım eksikliği', itemType: 'faaliyet', hazards: ['Korumasız maruziyet', 'Yaralanma riski artışı'] },
                { id: id(), label: 'Uygun beden ve tip olmaması', itemType: 'ekipman', hazards: ['Fonksiyonel yetersizlik', 'Kullanım reddi'] },
                { id: id(), label: 'KKD bakım ve hijyen eksikliği', itemType: 'faaliyet', hazards: ['Etkinlik kaybı', 'Enfeksiyon'] },
                { id: id(), label: 'Periyodik değişim eksikliği', itemType: 'faaliyet', hazards: ['Yıpranmış KKD kullanımı', 'Koruma azalması'] },
                { id: id(), label: 'KKD kullanımında eğitim eksikliği', itemType: 'faaliyet', hazards: ['Yanlış kullanım', 'Etkinlik kaybı'] },
            ]}],
        },
        // 16 — Sağlık Gözetimi & Çalışan Uygunluğu
        {
            id: 'oi_16', label: '16 — Sağlık Gözetimi & Çalışan Uygunluğu', icon: 'health_and_safety',
            subPhases: [{ id: 'oi_16_1', label: 'Sağlık Yönetimi', items: [
                { id: id(), label: 'İşe giriş muayenesi eksikliği', itemType: 'faaliyet', hazards: ['Uygunsuz personel çalıştırma', 'Yasal uyumsuzluk'] },
                { id: id(), label: 'Periyodik muayene eksikliği', itemType: 'faaliyet', hazards: ['Meslek hastalığı geç teşhisi', 'Yasal yaptırım'] },
                { id: id(), label: 'Maruziyet takibi eksikliği', itemType: 'faaliyet', hazards: ['Kronik maruziyet', 'Meslek hastalığı'] },
                { id: id(), label: 'İşe uygun olmayan personel çalıştırılması', itemType: 'faaliyet', hazards: ['Kaza riski artışı', 'Sağlık kötüleşmesi'] },
                { id: id(), label: 'Özel hassas grupların korunmaması', itemType: 'faaliyet', hazards: ['Hamile/genç/engelli çalışan riski'] },
                { id: id(), label: 'Meslek hastalığı belirtilerinin izlenmemesi', itemType: 'faaliyet', hazards: ['Geç teşhis', 'Kronikleşme'] },
            ]}],
        },
        // 17 — Psikososyal Riskler
        {
            id: 'oi_17', label: '17 — Psikososyal Riskler', icon: 'psychology',
            subPhases: [{ id: 'oi_17_1', label: 'Psikososyal Tehlikeler', items: [
                { id: id(), label: 'İş stresi', itemType: 'faaliyet', hazards: ['Zihinsel yorgunluk', 'Performans düşüşü', 'Kaza riski artışı'] },
                { id: id(), label: 'Aşırı iş yükü', itemType: 'faaliyet', hazards: ['Tükenmişlik', 'Hata oranı artışı'] },
                { id: id(), label: 'Uzun çalışma saatleri', itemType: 'faaliyet', hazards: ['Yorgunluk', 'Konsantrasyon kaybı', 'Kaza'] },
                { id: id(), label: 'Vardiya düzensizliği', itemType: 'faaliyet', hazards: ['Uyku bozukluğu', 'Performans düşüşü'] },
                { id: id(), label: 'Mobbing ve çatışma ortamı', itemType: 'faaliyet', hazards: ['Psikolojik hasar', 'Davranış sorunları'] },
                { id: id(), label: 'Dikkat dağınıklığı riski', itemType: 'faaliyet', hazards: ['Kaza', 'Hata', 'Yaralanma'] },
                { id: id(), label: 'Yorgunluk', itemType: 'faaliyet', hazards: ['Konsantrasyon kaybı', 'Reaksiyon gecikmesi', 'Kaza'] },
                { id: id(), label: 'Yalnız çalışma riski', itemType: 'faaliyet', hazards: ['Yardım ulaşmaması', 'İzole kaza'] },
            ]}],
        },
        // 18 — Acil Durum Hazırlığı
        {
            id: 'oi_18', label: '18 — Acil Durum Hazırlığı', icon: 'emergency',
            subPhases: [{ id: 'oi_18_1', label: 'Acil Durum Yönetimi', items: [
                { id: id(), label: 'Yangın acil durumu hazırlığı', itemType: 'faaliyet', hazards: ['Tahliye gecikmesi', 'Yangın büyümesi'] },
                { id: id(), label: 'Patlama acil durumu hazırlığı', itemType: 'faaliyet', hazards: ['Tahliye gecikmesi', 'Patlama hasarı'] },
                { id: id(), label: 'Kimyasal dökülme acil durumu', itemType: 'faaliyet', hazards: ['Maruziyet', 'Kontaminasyon yayılması'] },
                { id: id(), label: 'Elektrik acil durumu hazırlığı', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Yangın'] },
                { id: id(), label: 'Doğal afet hazırlığı', itemType: 'faaliyet', hazards: ['Deprem/sel hasarı', 'Tahliye gecikmesi'] },
                { id: id(), label: 'Tıbbi acil durum müdahalesi', itemType: 'faaliyet', hazards: ['İlk yardım gecikmesi', 'Kötüleşme'] },
                { id: id(), label: 'Tahliye planı eksikliği', itemType: 'faaliyet', hazards: ['Kargaşa', 'Gecikme', 'Kayıp'] },
                { id: id(), label: 'Toplanma alanı yetersizliği', itemType: 'ortam', hazards: ['Sayım hatası', 'Kayıp personel tespiti gecikmesi'] },
                { id: id(), label: 'Acil ekip ve tatbikat yetersizliği', itemType: 'faaliyet', hazards: ['Etkisiz müdahale', 'Gecikme'] },
            ]}],
        },
        // 19 — Çevresel & Atık Yönetimi Kaynaklı İSG Riskleri
        {
            id: 'oi_19', label: '19 — Çevresel & Atık Yönetimi Kaynaklı İSG Riskleri', icon: 'eco',
            subPhases: [{ id: 'oi_19_1', label: 'Atık & Çevre Yönetimi', items: [
                { id: id(), label: 'Tehlikeli atık teması', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Enfeksiyon'] },
                { id: id(), label: 'Kesici atık riski', itemType: 'ortam', hazards: ['Kesilme-delme', 'Enfeksiyon'] },
                { id: id(), label: 'Kaygan atık birikimi', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Temas'] },
                { id: id(), label: 'Uygunsuz atık depolama', itemType: 'ortam', hazards: ['Yangın', 'Koku/gaz', 'Haşere'] },
                { id: id(), label: 'Sızıntı ve taşma riski', itemType: 'faaliyet', hazards: ['Kayma', 'Kimyasal temas', 'Çevre kirliliği'] },
                { id: id(), label: 'Çevre kirliliğinin çalışanı etkilemesi', itemType: 'ortam', hazards: ['Kronik maruziyet', 'Solunum hastalığı'] },
            ]}],
        },
        // 20 — Bakım, Onarım, Temizlik & Arıza Müdahalesi
        {
            id: 'oi_20', label: '20 — Bakım, Onarım, Temizlik & Arıza Müdahalesi', icon: 'build_circle',
            subPhases: [{ id: 'oi_20_1', label: 'Bakım & Arıza Müdahalesi', items: [
                { id: id(), label: 'Enerji izolasyonu yapılmadan müdahale (LOTO eksikliği)', itemType: 'is', hazards: ['Beklenmedik enerjilenme', 'Elektrik çarpması', 'Amputasyon'] },
                { id: id(), label: 'Koruyucu sökülmüş halde çalışma', itemType: 'is', hazards: ['Döner aksam teması', 'Amputasyon', 'Kesilme'] },
                { id: id(), label: 'Sıkışan parçaya elle müdahale', itemType: 'is', hazards: ['Sıkışma', 'Ezilme', 'Amputasyon'] },
                { id: id(), label: 'Beklenmedik çalıştırma riski (bakım sırasında)', itemType: 'ekipman', hazards: ['Beklenmedik enerjilenme', 'Kaza'] },
                { id: id(), label: 'Uygunsuz temizlik yöntemi', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Kayma', 'Elektrik riski'] },
                { id: id(), label: 'Dar alanda bakım çalışması', itemType: 'ortam', hazards: ['Sınırlı alan', 'Çıkış engeli', 'Oksijen yetersizliği'] },
                { id: id(), label: 'Sıcak yüzey, keskin kenar ve hareketli aksam teması', itemType: 'is', hazards: ['Yanık', 'Kesilme', 'Amputasyon'] },
            ]}],
        },
    ],
};

export const GUIDED_LIBRARY: GuidedSector[] = [

    // ══════════════════════════════════════════════════════════════════════════
    // 1. İNŞAAT & YAPI
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'insaat',
        label: 'İnşaat & Yapı',
        icon: 'construction',
        color: '#f59e0b',
        subtypeQuestion: 'İnşaat türünü seçiniz:',
        subtypes: [
            // ── Bina İnşaatı ─────────────────────────────────────────────────
            {
                id: 'bina',
                label: 'Bina İnşaatı (Konut / Ticari / Karma)',
                icon: 'apartment',
                phases: [
                    // ── 1. Şantiye Kuruluşu ──────────────────────────────────
                    {
                        id: 'santiye_kurulum',
                        label: 'Şantiye Kuruluşu',
                        icon: 'fence',
                        subPhases: [
                            {
                                id: 'saha_sinir',
                                label: 'Saha Sınırlama & Güvenlik',
                                items: [
                                    { id: id(), label: 'Çevre güvenlik çiti / bariyer kurulumu', itemType: 'is', hazards: ['Çalışan çarpması', 'Yetkisiz giriş', 'Araç çarpması', 'Zincir / tel yaralanması'] },
                                    { id: id(), label: 'İkaz / yönlendirme levhası yerleştirme', itemType: 'is', hazards: ['Levha düşmesi', 'Görünürlük yetersizliği'] },
                                    { id: id(), label: 'Şantiye giriş-çıkış kontrol noktası kurulumu', itemType: 'is', hazards: ['Araç çarpması', 'Kapı / bariyer sıkışması'] },
                                ]
                            },
                            {
                                id: 'gecici_tesisler',
                                label: 'Geçici Tesisler & Bağlantılar',
                                items: [
                                    { id: id(), label: 'Geçici şantiye ofisi / konteyner kurulumu', itemType: 'is', hazards: ['Konteyner devrilmesi', 'Zemin kayması', 'Yüksekten düşme (platform)'] },
                                    { id: id(), label: 'Geçici sosyal tesis (WC / duş / soyunma) kurulumu', itemType: 'is', hazards: ['Sanitasyon yetersizliği', 'Kaygan zemin', 'Elektrik tehlikesi'] },
                                    { id: id(), label: 'Geçici elektrik ve su bağlantısı tesisi', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Topraklama eksikliği', 'Su kaçağı', 'Kaçak akım'] },
                                    { id: id(), label: 'Malzeme depo alanı & ekipman park düzenleme', itemType: 'faaliyet', hazards: ['Yük devrilmesi', 'Araç çarpması', 'Düzensiz istif'] },
                                ]
                            },
                            {
                                id: 'santiye_genel',
                                label: 'Genel',
                                items: [
                                    { id: id(), label: 'Jeneratör', itemType: 'ekipman', hazards: ['Gürültü maruziyeti', 'CO gaz zehirlenmesi (kapalı alan)', 'Yakıt dökülmesi / yangın', 'Egzoz gazı soluma'] },
                                    { id: id(), label: 'Kompaktör / greyder', itemType: 'ekipman', hazards: ['Yaya çarpması', 'Devrilme', 'Titreşim', 'Gürültü'] },
                                    { id: id(), label: 'Şantiye geçiş yolları', itemType: 'ortam', hazards: ['Araç – yaya çarpışması', 'Kaygan / çamurlu zemin', 'Gece görünürlük eksikliği'] },
                                    { id: id(), label: 'Deponi / malzeme yığma alanı', itemType: 'ortam', hazards: ['İstif devrilmesi', 'Düzensiz yığma yaralanması', 'Yangın riski'] },
                                ]
                            }
                        ]
                    },

                    // ── 2. Saha Hazırlığı ─────────────────────────────────────
                    {
                        id: 'saha_hazirlik',
                        label: 'Saha Hazırlığı',
                        icon: 'landscape',
                        subPhases: [
                            {
                                id: 'temizlik_hazirlama',
                                label: 'Temizleme & Zemin Hazırlama',
                                items: [
                                    { id: id(), label: 'Ağaç / bitki kesme ve temizleme', itemType: 'is', hazards: ['Ağaç devrilmesi', 'Testere yaralanması', 'Düşen dal çarpması', 'Gürültü'] },
                                    { id: id(), label: 'Üst toprak sıyırma ve depolama', itemType: 'faaliyet', hazards: ['İş makinesi çarpması', 'Toz maruziyeti', 'Zemin kayması'] },
                                    { id: id(), label: 'Zemin etüdü ve sondaj çalışması', itemType: 'faaliyet', hazards: ['Matkap / sondaj kırılması', 'Zemin çökmesi', 'Yeraltı hattına isabet'] },
                                    { id: id(), label: 'Mini ekskavatör / buldozer', itemType: 'ekipman', hazards: ['Devrilme', 'Yaya çarpması', 'Görüş alanı kısıtı'] },
                                    { id: id(), label: 'Sondaj sahası', itemType: 'ortam', hazards: ['Çukur düşmesi', 'Zemin stabilitesi sorunları'] },
                                ]
                            }
                        ]
                    },

                    // ── 3. Kazı & Hafriyat ───────────────────────────────────
                    {
                        id: 'kazi_hafriyat',
                        label: 'Kazı & Hafriyat',
                        icon: 'terrain',
                        subPhases: [
                            {
                                id: 'kazi_isleri',
                                label: 'Kazı İşleri',
                                items: [
                                    { id: id(), label: 'Ekskavatör ile temel kazısı', itemType: 'is', hazards: ['Kazı / şev çökmesi', 'İş makinesi devrilmesi', 'Yeraltı hattına isabet (elektrik, gaz, su)', 'Personel çarpması', 'Geri manevra riski'] },
                                    { id: id(), label: 'Patlayıcı madde ile kaya kırma', itemType: 'is', hazards: ['Patlama dışı fırlama', 'Erken ateşleme', 'İkincil patlama', 'Gürültü / titreşim hasarı'] },
                                    { id: id(), label: 'Kazı alanı çevre güvenliği', itemType: 'faaliyet', hazards: ['Korumasız kenar – düşme', 'Araç çukura düşmesi', 'Yetersiz ikaz'] },
                                ]
                            },
                            {
                                id: 'iksa_sev',
                                label: 'İksa & Şev Stabilizasyonu',
                                items: [
                                    { id: id(), label: 'Şev iksa sistemi kurulumu (palplanş / forekazık)', itemType: 'is', hazards: ['Palplanş devrilmesi', 'Kırılma / kopma yaralanması', 'Zemin kayması', 'Gürültü'] },
                                    { id: id(), label: 'Şev stabilizasyonu ve izleme', itemType: 'faaliyet', hazards: ['Ani şev çökmesi', 'Yeraltı suyu basıncı', 'İzleme ihmali'] },
                                ]
                            },
                            {
                                id: 'hafriyat_nakli',
                                label: 'Hafriyat Nakliyesi',
                                items: [
                                    { id: id(), label: 'Kamyon ile hafriyat taşıma', itemType: 'faaliyet', hazards: ['Araç devrilmesi', 'Yük kayması / dökülmesi', 'Yaya çarpması', 'Trafik kazası'] },
                                    { id: id(), label: 'Su tahliyesi ve drenaj çalışması', itemType: 'faaliyet', hazards: ['Kaygan / çamurlu zemin', 'Elektrikli pompa riski', 'Boru kaçağı'] },
                                    { id: id(), label: 'Ekskavatör', itemType: 'ekipman', hazards: ['Devrilme', 'Kova çarpması', 'Elektrik hattına temas', 'Görüş kısıtı'] },
                                    { id: id(), label: 'Hafriyat kamyonu', itemType: 'ekipman', hazards: ['Yük kayması', 'Kapı ezilmesi', 'Geri manevra çarpması'] },
                                    { id: id(), label: 'Kazı çukuru kenarı', itemType: 'ortam', hazards: ['Yüksekten / çukura düşme', 'Şev çökmesi', 'Zemin kayması'] },
                                    { id: id(), label: 'Yeraltı su alanı', itemType: 'ortam', hazards: ['Boğulma riski', 'Zemin taşıma kapasitesi kaybı', 'Elektrik tehlikesi'] },
                                ]
                            }
                        ]
                    },

                    // ── 4. Temel İşleri ──────────────────────────────────────
                    {
                        id: 'temel',
                        label: 'Temel İşleri',
                        icon: 'foundation',
                        subPhases: [
                            {
                                id: 'temel_donati',
                                label: 'Temel Donatı İşleri',
                                items: [
                                    { id: id(), label: 'Temel demiri kesme ve bükme', itemType: 'is', hazards: ['Kesilme / batma', 'El-parmak sıkışması', 'Parça fırlaması', 'Gürültü', 'Elektrikli makine riski'] },
                                    { id: id(), label: 'Temel donatı montajı ve bağlama', itemType: 'is', hazards: ['Sivri uç batması', 'Bel / diz zorlanması', 'Aynı seviyede düşme', 'Nervürlü çelik yaralanması'] },
                                ]
                            },
                            {
                                id: 'temel_kalip',
                                label: 'Temel Kalıp İşleri',
                                items: [
                                    { id: id(), label: 'Temel kalıp montajı', itemType: 'is', hazards: ['Kalıp devrilmesi', 'Çivi / vidadan yaralanma', 'El aleti kazası', 'Yüksekten düşme (derin temel)'] },
                                    { id: id(), label: 'Grobeton ve temel betonu dökümü', itemType: 'faaliyet', hazards: ['Taze beton cilt / göz teması', 'Hortum savrulması', 'Kaygan zemin', 'Mikser araç çarpması'] },
                                    { id: id(), label: 'Beton mikseri / pompası', itemType: 'ekipman', hazards: ['Araç devrilmesi', 'Döner parça sıkışması', 'Gürültü', 'Beton sıçraması'] },
                                    { id: id(), label: 'Temel çukuru içi', itemType: 'ortam', hazards: ['Çukurdan düşme', 'Şev çökmesi', 'Dar alan kısıtı', 'Su birikmesi'] },
                                ]
                            }
                        ]
                    },

                    // ── 5. Kaba İnşaat ───────────────────────────────────────
                    {
                        id: 'kaba_insaat',
                        label: 'Kaba İnşaat (Yapı İskeleti)',
                        icon: 'domain',
                        subPhases: [
                            {
                                id: 'donati_isleri',
                                label: 'Donatı İşleri',
                                items: [
                                    { id: id(), label: 'Donatı kesme', itemType: 'is', hazards: ['Kesilme', 'Parça fırlaması', 'El-parmak sıkışması', 'Gürültü maruziyeti', 'Elektrikli ekipman riski'] },
                                    { id: id(), label: 'Donatı bükme', itemType: 'is', hazards: ['Kesilme', 'Parça fırlaması', 'El-parmak sıkışması', 'Gürültü maruziyeti', 'Elektrikli ekipman riski'] },
                                    { id: id(), label: 'Donatı bağlama', itemType: 'is', hazards: ['Sivri uç batması', 'Bel ve diz zorlanması', 'Düzensiz istifte takılma', 'Aynı seviyede düşme'] },
                                ]
                            },
                            {
                                id: 'kalip_isleri',
                                label: 'Kalıp İşleri',
                                items: [
                                    { id: id(), label: 'Kolon kalıbı kurulumu', itemType: 'is', hazards: ['Kalıp devrilmesi', 'Geçici taşıyıcı yetersizliği', 'Yüksekten düşme', 'Ezilme / sıkışma', 'Malzeme düşmesi'] },
                                    { id: id(), label: 'Kiriş kalıbı kurulumu', itemType: 'is', hazards: ['Kalıp devrilmesi', 'Geçici taşıyıcı yetersizliği', 'Yüksekten düşme', 'Ezilme / sıkışma', 'Malzeme düşmesi'] },
                                    { id: id(), label: 'Döşeme kalıbı kurulumu', itemType: 'is', hazards: ['Kalıp devrilmesi', 'Geçici taşıyıcı yetersizliği', 'Yüksekten düşme', 'Ezilme / sıkışma', 'Malzeme düşmesi'] },
                                ]
                            },
                            {
                                id: 'iskele_isleri',
                                label: 'İskele İşleri',
                                items: [
                                    { id: id(), label: 'Çalışma iskelesi kurulumu', itemType: 'faaliyet', hazards: ['Uygunsuz kurulum', 'Platform boşluğu', 'Korkuluk eksikliği', 'Düşen cisim', 'Taşıma kapasitesi aşımı'] },
                                ]
                            },
                            {
                                id: 'beton_doküm',
                                label: 'Beton Döküm İşleri',
                                items: [
                                    { id: id(), label: 'Beton pompası ile döküm', itemType: 'faaliyet', hazards: ['Hortum savrulması', 'Taze betonla cilt / göz teması', 'Kaygan zemin', 'Pompa ekipmanı arızası', 'Araç manevra riski'] },
                                    { id: id(), label: 'Vibratör ile sıkıştırma', itemType: 'faaliyet', hazards: ['Titreşim maruziyeti (el-kol)', 'Gürültü', 'Kaygan zemin'] },
                                ]
                            },
                            {
                                id: 'kalip_soküm',
                                label: 'Kalıp Söküm İşleri',
                                items: [
                                    { id: id(), label: 'Kalıp sökümü', itemType: 'faaliyet', hazards: ['Kontrolsüz parça düşmesi', 'Taşıyıcı stabilite kaybı', 'Yüksekten düşme', 'El aleti yaralanmaları'] },
                                ]
                            },
                            {
                                id: 'kat_transfer',
                                label: 'Kat İçi Malzeme Transferi',
                                items: [
                                    { id: id(), label: 'Katlar arası malzeme taşıma', itemType: 'faaliyet', hazards: ['Yük düşmesi', 'Sırt / bel zorlanması', 'Göçük riski', 'Dar geçiş tehlikesi'] },
                                ]
                            },
                            {
                                id: 'kaba_genel',
                                label: 'Genel',
                                items: [
                                    { id: id(), label: 'Kule vinç', itemType: 'ekipman', hazards: ['Yük düşmesi', 'Devrilme', 'Kanca / halat kopması', 'Elektrik hattına temas', 'Yetersiz operatör mesafesi'] },
                                    { id: id(), label: 'Beton pompası', itemType: 'ekipman', hazards: ['Hortum patlaması / savrulması', 'Aşırı basınç', 'Araç çarpması', 'Hidrolik sıvı sızıntısı'] },
                                    { id: id(), label: 'Donatı kesme makinesi', itemType: 'ekipman', hazards: ['Kesme yaralanması', 'Parça fırlaması', 'Elektrik çarpması', 'Gürültü'] },
                                    { id: id(), label: 'Seyyar iskele', itemType: 'ekipman', hazards: ['Devrilme', 'Platform çökmesi', 'Yüksekten düşme', 'Korkuluk eksikliği'] },
                                    { id: id(), label: 'Döşeme kenarı', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Cisim düşmesi', 'Yetersiz çevreleme', 'Geçici kapama eksikliği'] },
                                    { id: id(), label: 'Merdiven boşluğu', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Cisim düşmesi', 'Yetersiz çevreleme', 'Geçici kapama eksikliği'] },
                                    { id: id(), label: 'Asansör kuyusu çevresi', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Cisim düşmesi', 'Yetersiz çevreleme', 'Geçici kapama eksikliği'] },
                                    { id: id(), label: 'Bodrum kat çalışma alanı', itemType: 'ortam', hazards: ['Dar / kapalı alan', 'Yetersiz aydınlatma', 'Su / çamur birikmesi', 'Çıkış güçlüğü'] },
                                ]
                            }
                        ]
                    },

                    // ── 6. Çatı İşleri ──────────────────────────────────────
                    {
                        id: 'cati_isleri',
                        label: 'Çatı İşleri',
                        icon: 'roofing',
                        subPhases: [
                            {
                                id: 'cati_tasiyici',
                                label: 'Çatı Taşıyıcı Sistemi',
                                items: [
                                    { id: id(), label: 'Çelik çatı makası / kirişi montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Çelik eleman çarpması', 'Vinç yükü düşmesi', 'Rüzgar etkisi'] },
                                    { id: id(), label: 'Ahşap çatı taşıyıcısı imalatı ve montajı', itemType: 'is', hazards: ['Testere yaralanması', 'Toz maruziyeti', 'Yüksekten düşme', 'Malzeme devrilmesi'] },
                                ]
                            },
                            {
                                id: 'cati_yalitim',
                                label: 'Su & Isı Yalıtımı',
                                items: [
                                    { id: id(), label: 'Bitümlü membran uygulaması', itemType: 'is', hazards: ['Yanık (sıcak bitüm)', 'Solvent / duman soluma', 'Yangın riski (şaloma)', 'Yüksekten düşme'] },
                                    { id: id(), label: 'Çatı ısı yalıtımı / XPS levha montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Keskin kenar yaralanması', 'Rüzgar etkisi'] },
                                ]
                            },
                            {
                                id: 'cati_kaplama',
                                label: 'Çatı Kaplama',
                                items: [
                                    { id: id(), label: 'Kiremit / metal sac çatı kaplama', itemType: 'is', hazards: ['Yüksekten düşme', 'Keskin metal kenar', 'Kaygan yüzey', 'Rüzgar etkisi'] },
                                    { id: id(), label: 'Yağmurluk / dere / oluk montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Cephe kenarı güvensizliği', 'El aleti kazası'] },
                                    { id: id(), label: 'Çatı iskelesi / spor iskele', itemType: 'ekipman', hazards: ['Kurulum hatası', 'Platform çökmesi', 'Devrilme', 'Rüzgar etkisi'] },
                                    { id: id(), label: 'Saçak kenarı', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Cisim düşmesi (aşağıya)', 'Korkuluk / çevreleme eksikliği'] },
                                    { id: id(), label: 'Kırılgan / cam çatı yüzeyi', itemType: 'ortam', hazards: ['Yüzey kırılması ile düşme', 'Keskin cam yaralanması'] },
                                ]
                            }
                        ]
                    },

                    // ── 7. Cephe İşleri ─────────────────────────────────────
                    {
                        id: 'cephe_isleri',
                        label: 'Dış Cephe İşleri',
                        icon: 'window',
                        subPhases: [
                            {
                                id: 'cephe_yalitim',
                                label: 'Dış Sıva & ETICS / Mantolama',
                                items: [
                                    { id: id(), label: 'ETICS ısı yalıtım sistemi montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Yapıştırıcı / kimyasal temas', 'Toz / fıçı soluma', 'İskele devrilmesi'] },
                                    { id: id(), label: 'Dış cephe sıva uygulaması', itemType: 'is', hazards: ['Yüksekten düşme', 'Sıva sıçraması (göz)', 'Titreşimli alet rahatsızlığı'] },
                                ]
                            },
                            {
                                id: 'cephe_dograma',
                                label: 'Dış Doğrama & Cam',
                                items: [
                                    { id: id(), label: 'Dış kapı / pencere doğrama montajı', itemType: 'is', hazards: ['Cam kırılması / kesici', 'Yüksekten düşme', 'Ağır yük taşıma'] },
                                    { id: id(), label: 'Cam montajı (büyük yüzey)', itemType: 'is', hazards: ['Cam devrilmesi / kırılması', 'Kesici yara', 'Yüksekten düşme'] },
                                    { id: id(), label: 'Cephe iskelesi / konsol iskele', itemType: 'ekipman', hazards: ['İskele devrilmesi', 'Platform çökmesi', 'Ankraj yetersizliği'] },
                                    { id: id(), label: 'Bina kenarı / köşesi', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Rüzgar etkisi', 'Cisim düşmesi'] },
                                    { id: id(), label: 'Zemin katta yaya güzergahı', itemType: 'ortam', hazards: ['Üstten cisim düşmesi', 'Yaya çarpması', 'İskele devrilmesi'] },
                                ]
                            }
                        ]
                    },

                    // ── 8. Mekanik / Elektrik Tesisat ───────────────────────
                    {
                        id: 'mek_elek',
                        label: 'Mekanik / Elektrik Tesisat',
                        icon: 'electrical_services',
                        subPhases: [
                            {
                                id: 'elektrik_tesisat',
                                label: 'Elektrik Tesisatı',
                                items: [
                                    { id: id(), label: 'Elektrik panosu montajı', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark / kıvılcım', 'Topraklama eksikliği', 'Yangın riski'] },
                                    { id: id(), label: 'Kablo çekimi ve tespit', itemType: 'is', hazards: ['Elektrik çarpması', 'Düşme (tavan / döşeme)', 'Bel zorlanması (kablo ağırlığı)', 'Kesici alet yaralanması'] },
                                    { id: id(), label: 'Aydınlatma armatürü montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Elektrik çarpması', 'Cam kırılması'] },
                                ]
                            },
                            {
                                id: 'sihhi_tesisat',
                                label: 'Sıhhi Tesisat',
                                items: [
                                    { id: id(), label: 'Su tesisatı borusu döşeme', itemType: 'is', hazards: ['Boru düşmesi / çarpması', 'Kesici alet yaralanması', 'Bel zorlanması', 'Su kaçağı'] },
                                    { id: id(), label: 'Atıksu sistemi montajı', itemType: 'is', hazards: ['Kimyasal koku / gaz maruziyeti', 'Bel zorlanması', 'Kaygan zemin'] },
                                    { id: id(), label: 'Kaynak / lehim işlemi', itemType: 'faaliyet', hazards: ['UV radyasyon (göz)', 'Duman / gaz soluma', 'Yangın / patlama riski', 'Yanık'] },
                                ]
                            },
                            {
                                id: 'hvac_yangin',
                                label: 'HVAC & Yangın Tesisatı',
                                items: [
                                    { id: id(), label: 'Klima / VRV sistemi montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Ağır ekipman taşıma', 'Soğutucu gaz kaçağı'] },
                                    { id: id(), label: 'Sprinkler sistemi montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Basınç testi patlaması', 'Su hasarı'] },
                                    { id: id(), label: 'Elektrikli el aleti (matkap, taşlama)', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Taşlama diski kırılması', 'Gürültü', 'Toz / kıvılcım'] },
                                    { id: id(), label: 'Dar teknik hacim / tavan arası', itemType: 'ortam', hazards: ['Kapalı alan riski', 'Yetersiz aydınlatma', 'Düşük tavan çarpması'] },
                                    { id: id(), label: 'Elektrik panosu yakını', itemType: 'ortam', hazards: ['Elektrik çarpması', 'Ark / kıvılcım', 'Yetkisiz erişim'] },
                                ]
                            }
                        ]
                    },

                    // ── 9. İnce İşler ────────────────────────────────────────
                    {
                        id: 'ince_isler',
                        label: 'İnce İşler',
                        icon: 'format_paint',
                        subPhases: [
                            {
                                id: 'siva_alci',
                                label: 'Sıva & Alçı',
                                items: [
                                    { id: id(), label: 'İç mekan sıva uygulaması', itemType: 'is', hazards: ['Sıva sıçraması (göz)', 'Bel / omuz zorlanması', 'Uzun süreli ayakta durma', 'Toz soluma'] },
                                    { id: id(), label: 'Alçı levha (alçıpan) montajı', itemType: 'is', hazards: ['Kesici kenar yaralanması', 'Toz soluma', 'El aleti kazası', 'Bel zorlanması'] },
                                ]
                            },
                            {
                                id: 'karolama_zemin',
                                label: 'Karolama & Zemin Döşeme',
                                items: [
                                    { id: id(), label: 'Zemin fayans / seramik döşeme', itemType: 'is', hazards: ['Diz zorlanması', 'Kesici karo parçası', 'Yapıştırıcı / derz kimi temas', 'Gürültü (karo testeresi)'] },
                                    { id: id(), label: 'Parke / laminat zemin döşeme', itemType: 'is', hazards: ['Toz soluma', 'Diz zorlanması', 'Çekiç / pnömatik alet yaralanması'] },
                                ]
                            },
                            {
                                id: 'boya_badana',
                                label: 'Boya & Badana',
                                items: [
                                    { id: id(), label: 'İç mekan boya uygulaması', itemType: 'faaliyet', hazards: ['Solvent / boya buharı soluma', 'Göz tahrişi', 'Baş dönmesi (yetersiz havalandırma)', 'Yüksekten düşme (tavan)'] },
                                    { id: id(), label: 'Karo testeresi / taşlama makinesi', itemType: 'ekipman', hazards: ['Kesici disk kırılması', 'Silika tozu soluma', 'Gürültü', 'Su ve elektrik teması'] },
                                    { id: id(), label: 'Merdiven boşluğu (ince iş aşaması)', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Korkuluk eksikliği', 'Kaygan taze zemin'] },
                                ]
                            }
                        ]
                    },

                    // ── 10. Çevre Düzenleme ─────────────────────────────────
                    {
                        id: 'cevre_duzenleme',
                        label: 'Çevre Düzenleme & Peyzaj',
                        icon: 'park',
                        subPhases: [
                            {
                                id: 'zemin_kaplama',
                                label: 'Zemin Kaplama & Yollar',
                                items: [
                                    { id: id(), label: 'Parke taşı / kilit taşı döşeme', itemType: 'is', hazards: ['Diz / bel zorlanması', 'El ezilmesi', 'Titreşimli kompaktör yaralanması'] },
                                    { id: id(), label: 'Asfalt uygulama', itemType: 'faaliyet', hazards: ['Sıcak asfalt yanığı', 'Bitüm dumanı soluma', 'Araç çarpması', 'UV maruziyeti'] },
                                ]
                            },
                            {
                                id: 'peyzaj_cevre',
                                label: 'Peyzaj & Çevre Yapıları',
                                items: [
                                    { id: id(), label: 'Ağaç / bitki dikimi', itemType: 'faaliyet', hazards: ['El / bel zorlanması', 'Kesici bahçe aleti', 'Kimyasal gübre teması'] },
                                    { id: id(), label: 'Çit / parmaklık montajı', itemType: 'is', hazards: ['Kesici metal uç', 'Çekiç çarpması', 'Yüksekten düşme (platform)'] },
                                    { id: id(), label: 'Mini ekskavatör (peyzaj)', itemType: 'ekipman', hazards: ['Yaya çarpması', 'Devrilme', 'Yeraltı hattı hasarı'] },
                                    { id: id(), label: 'Açık çalışma alanı (UV / sıcak hava)', itemType: 'ortam', hazards: ['Isı stresi / güneş çarpması', 'UV radyasyon', 'Susuzluk'] },
                                ]
                            }
                        ]
                    },

                    // ── 11. Söküm & Kapanış ──────────────────────────────────
                    {
                        id: 'soküm_kapanis',
                        label: 'Söküm / Şantiye Kapanışı',
                        icon: 'delete_sweep',
                        subPhases: [
                            {
                                id: 'gecici_soküm',
                                label: 'Geçici Yapı & İskele Sökümü',
                                items: [
                                    { id: id(), label: 'İskele söküm çalışması', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'Parça düşmesi', 'İskele dengesizliği', 'Ekipman devrimi'] },
                                    { id: id(), label: 'Geçici çit / bariyer kaldırma', itemType: 'faaliyet', hazards: ['Kesici metal uç', 'Trafik güvenliği azalması'] },
                                ]
                            },
                            {
                                id: 'temizlik_atik',
                                label: 'Temizlik & Atık Yönetimi',
                                items: [
                                    { id: id(), label: 'İnşaat artığı / moloz taşıma', itemType: 'faaliyet', hazards: ['Ağır yük zorlanması', 'Kesici moloz yaralanması', 'Toz soluma', 'Araç çarpması'] },
                                    { id: id(), label: 'Kimyasal atık bertarafı', itemType: 'faaliyet', hazards: ['Kimyasal deri / göz teması', 'Soluma maruziyeti', 'Çevre kirliliği'] },
                                    { id: id(), label: 'Kamyon', itemType: 'ekipman', hazards: ['Yük devrilmesi', 'Geri manevra çarpması', 'Şantiye çıkışı trafik riski'] },
                                    { id: id(), label: 'Şantiye geneli (son durum)', itemType: 'ortam', hazards: ['Dağınık malzeme takılma düşmesi', 'Güvensiz zemin', 'Yetersiz aydınlatma'] },
                                ]
                            }
                        ]
                    }
                ]
            },

            // ── Endüstriyel İnşaat ───────────────────────────────────────────
            {
                id: 'endustriyel',
                label: 'Endüstriyel Tesis İnşaatı',
                icon: 'factory',
                phases: [
                    { id: 'ei_zemin', label: 'Zemin & Temel', icon: 'foundation', subPhases: [{ id: 's1', label: 'Genel', items: [
                        { id: id(), label: 'Ağır temel kazısı', itemType: 'is', hazards: ['Şev çökmesi', 'İş makinesi devrilmesi', 'Yeraltı hattı hasarı'] },
                        { id: id(), label: 'Vinç ile ağır yük indirme', itemType: 'faaliyet', hazards: ['Yük düşmesi', 'Halat kopması', 'Personel çarpması'] },
                        { id: id(), label: 'Endüstriyel temel', itemType: 'ortam', hazards: ['Derin kazı düşmesi', 'Gürültü', 'Titreşim'] },
                    ]}]},
                    { id: 'ei_celik', label: 'Çelik Strüktür Montajı', icon: 'view_quilt', subPhases: [{ id: 's2', label: 'Genel', items: [
                        { id: id(), label: 'Çelik kolon / kiriş montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Çelik eleman çarpması', 'Kaynak riski', 'Rüzgar etkisi'] },
                        { id: id(), label: 'Bulonlu bağlantı yapımı', itemType: 'is', hazards: ['El aleti kazası', 'Yüksekten düşme', 'Civata / somun fırlaması'] },
                        { id: id(), label: 'Mobil vinç', itemType: 'ekipman', hazards: ['Devrilme', 'Yük düşmesi', 'Elektrik hattına temas'] },
                    ]}]},
                    { id: 'ei_tesisat', label: 'Endüstriyel Tesisat', icon: 'plumbing', subPhases: [{ id: 's3', label: 'Genel', items: [
                        { id: id(), label: 'Boru hattı montajı (proses)', itemType: 'is', hazards: ['Basınç testi riski', 'Kaynak gazları', 'Ağır boru taşıma'] },
                        { id: id(), label: 'Tank / silo montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Vinç yükü', 'Kapalı alan girişi'] },
                        { id: id(), label: 'Endüstriyel proses alanı', itemType: 'ortam', hazards: ['Kimyasal sızıntı', 'Yüksek sıcaklık', 'Basınçlı sistem'] },
                    ]}]},
                ]
            },

            // ── Altyapı İnşaatı ──────────────────────────────────────────────
            {
                id: 'altyapi',
                label: 'Altyapı İnşaatı (Yol / Köprü / Kanal)',
                icon: 'alt_route',
                phases: [
                    { id: 'ai_kazi', label: 'Kazı & Hendek', icon: 'terrain', subPhases: [{ id: 's4', label: 'Genel', items: [
                        { id: id(), label: 'Kanal / hendek kazısı', itemType: 'is', hazards: ['Hendek çökmesi', 'Yeraltı hattı hasarı', 'Su baskını'] },
                        { id: id(), label: 'İksa kurulumu', itemType: 'is', hazards: ['Şev göçmesi', 'Personel düşmesi', 'Ezilme'] },
                        { id: id(), label: 'Hendek içi çalışma alanı', itemType: 'ortam', hazards: ['Kapalı alan riski', 'Su birikmesi', 'Çıkış güçlüğü'] },
                    ]}]},
                    { id: 'ai_boru', label: 'Boru / Altyapı Döşeme', icon: 'settings_input_component', subPhases: [{ id: 's5', label: 'Genel', items: [
                        { id: id(), label: 'Boru serimi ve indirilmesi', itemType: 'is', hazards: ['Yük düşmesi', 'Sıkışma', 'Ağır yük taşıma'] },
                        { id: id(), label: 'Vinç ile boru indirme', itemType: 'faaliyet', hazards: ['Yük sallanması', 'Halat kopması', 'Personel çarpması'] },
                        { id: id(), label: 'Kazı alanı trafik çevresi', itemType: 'ortam', hazards: ['Araç çarpması', 'Toz maruziyeti', 'Yaya güvenliği'] },
                    ]}]},
                ]
            },

            // ── Yıkım & Restorasyon ─────────────────────────────────────────
            {
                id: 'yikim',
                label: 'Yıkım & Restorasyon',
                icon: 'home_repair_service',
                phases: [
                    { id: 'yi_survey', label: 'Yapı Araştırması', icon: 'search', subPhases: [{ id: 's6', label: 'Genel', items: [
                        { id: id(), label: 'Asbestos / tehlikeli madde tespiti', itemType: 'faaliyet', hazards: ['Asbestos lifi soluma', 'Kimyasal temas', 'Örnekleme riski'] },
                        { id: id(), label: 'Yapı mukavemet etüdü', itemType: 'faaliyet', hazards: ['Ani çökme riski', 'Tatbikat zorlanması', 'Nesne düşmesi'] },
                    ]}]},
                    { id: 'yi_yikim', label: 'Yıkım Çalışması', icon: 'delete_sweep', subPhases: [{ id: 's7', label: 'Genel', items: [
                        { id: id(), label: 'Makinalı yıkım (yıkım ekskavatörü)', itemType: 'is', hazards: ['Yapı çökmesi', 'Parça fırlaması', 'Toz / silikoz', 'Gürültü'] },
                        { id: id(), label: 'Manuel yıkım / parça söküm', itemType: 'is', hazards: ['Kesici yüzey', 'Ani çökme', 'Ağır parça düşmesi', 'Toz soluma'] },
                        { id: id(), label: 'Yıkım alanı çevresi', itemType: 'ortam', hazards: ['Geniş moloz alanı', 'Zemin stabilitesi', 'Yaya / trafik riski'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 2. KİMYASALLARLA ÇALIŞMA
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'kimyasal',
        label: 'Kimyasal Çalışmalar',
        icon: 'science',
        color: '#10b981',
        subtypeQuestion: 'Kimyasal grubu seçiniz:',
        subtypes: [
            // ── Boya & Solventler ─────────────────────────────────────────────
            {
                id: 'boya_solvent',
                label: 'Boya & Solventler',
                icon: 'format_paint',
                phases: [
                    {
                        id: 'bs_depolama',
                        label: 'Depolama',
                        icon: 'inventory_2',
                        subPhases: [{
                            id: 'bs_dep_genel', label: 'Genel', items: [
                                { id: id(), label: 'Boya / vernik / solvent depolama', itemType: 'is', hazards: ['Patlayıcı / yanıcı buhar birikimi', 'Uyumsuz kimyasal depolama', 'Dökülme / sızıntı', 'Yetersiz havalandırma'] },
                                { id: id(), label: 'Kimyasal depo alanı', itemType: 'ortam', hazards: ['Tutuşabilir atmosfer', 'Statik elektrik', 'Yetersiz havalandırma', 'Etiketleme eksikliği'] },
                            ]
                        }]
                    },
                    {
                        id: 'bs_hazirlama',
                        label: 'Hazırlama / Karıştırma',
                        icon: 'blender',
                        subPhases: [{
                            id: 'bs_haz_genel', label: 'Genel', items: [
                                { id: id(), label: 'Tiner ile seyreltme', itemType: 'is', hazards: ['Solvent buharı soluma', 'Cilt / göz irritasyonu', 'Patlayıcı atmosfer oluşması', 'Statik elektrik kıvılcımı'] },
                                { id: id(), label: 'Renk / viskozite karıştırma', itemType: 'is', hazards: ['Sıçrama (göz)', 'Deri teması (tahrip edici)', 'Gürültü (mekanik karıştırıcı)'] },
                                { id: id(), label: 'Mekanik karıştırıcı', itemType: 'ekipman', hazards: ['Dönen parça sıkışması', 'Kimyasal sıçraması', 'Gürültü'] },
                            ]
                        }]
                    },
                    {
                        id: 'bs_uygulama',
                        label: 'Uygulama',
                        icon: 'brush',
                        subPhases: [
                            {
                                id: 'bs_uygulama_sprey', label: 'Sprey Uygulama', items: [
                                    { id: id(), label: 'Sprey boya uygulaması', itemType: 'is', hazards: ['Solvent buharı / aerosol soluma', 'Göz ve deri irritasyonu', 'Patlayıcı atmosfer', 'Statik elektrik', 'Yetersiz havalandırma'] },
                                    { id: id(), label: 'Sprey tabancası', itemType: 'ekipman', hazards: ['Basınçlı kap riski', 'Kimyasal enjeksiyonu (yüksek basınç)', 'Tıkanma / patlaması'] },
                                ]
                            },
                            {
                                id: 'bs_uygulama_firca', label: 'Fırça / Rulo Uygulama', items: [
                                    { id: id(), label: 'Fırça ile boya', itemType: 'is', hazards: ['Cilt teması', 'Göz sıçraması', 'Tekrarlı el / bilek hareketi'] },
                                    { id: id(), label: 'Kapalı alan uygulama', itemType: 'ortam', hazards: ['Solvent buharı birikmesi', 'Oksijen azalması', 'Patlayıcı atmosfer', 'Yetersiz havalandırma'] },
                                ]
                            }
                        ]
                    },
                    {
                        id: 'bs_temizlik',
                        label: 'Temizlik',
                        icon: 'cleaning_services',
                        subPhases: [{
                            id: 'bs_tem_genel', label: 'Genel', items: [
                                { id: id(), label: 'Ekipman tiner ile temizleme', itemType: 'faaliyet', hazards: ['Solvent soluma', 'Yanıcı sıvı riski', 'Cilt teması', 'Atık solvent bertarafı'] },
                                { id: id(), label: 'Boya atığı bertarafı', itemType: 'faaliyet', hazards: ['Çevre kirliliği', 'Kimyasal dökülme', 'Yangın riski'] },
                            ]
                        }]
                    }
                ]
            },

            // ── Yapıştırıcılar & Macun ────────────────────────────────────────
            {
                id: 'yapistirici',
                label: 'Yapıştırıcı & Macun / Dolgu',
                icon: 'water_drop',
                phases: [
                    {
                        id: 'yp_depolama', label: 'Depolama', icon: 'inventory_2', subPhases: [{
                            id: 'yp_dep', label: 'Genel', items: [
                                { id: id(), label: 'Yapıştırıcı / macun depolama', itemType: 'is', hazards: ['Yanıcı buhar birikimi', 'Ambalaj sızdırması', 'Uyumsuz depolama'] },
                                { id: id(), label: 'Kimyasal depo alanı', itemType: 'ortam', hazards: ['Patlayıcı atmosfer', 'Statik elektrik', 'Etiketleme eksikliği'] },
                            ]
                        }]
                    },
                    {
                        id: 'yp_uygulama', label: 'Uygulama', icon: 'brush', subPhases: [{
                            id: 'yp_uygulama_genel', label: 'Genel', items: [
                                { id: id(), label: 'Yapıştırıcı sürme', itemType: 'is', hazards: ['Cilt yapışması / tahrişi', 'Solvent buharı soluma', 'Göz tahrişi', 'Kronik deri teması'] },
                                { id: id(), label: 'Epoksi reçine hazırlama ve uygulama', itemType: 'is', hazards: ['Reçine / sertleştirici deri teması', 'Alerjik reaksiyon', 'Göz tahrişi', 'Buhar soluma'] },
                                { id: id(), label: 'Sıkacak tabanca', itemType: 'ekipman', hazards: ['Enjeksiyon yaralanması (yüksek basınç)', 'Kimyasal sıçrama'] },
                                { id: id(), label: 'Kapalı / az havalandırmalı alan', itemType: 'ortam', hazards: ['Solvent buharı birikmesi', 'Baş dönmesi / bilinç kaybı', 'Patlayıcı atmosfer'] },
                            ]
                        }]
                    }
                ]
            },

            // ── Temizlik Kimyasalları ─────────────────────────────────────────
            {
                id: 'temizlik_kim',
                label: 'Temizlik Kimyasalları',
                icon: 'cleaning_services',
                phases: [
                    {
                        id: 'tk_uygulama', label: 'Uygulama & Temizleme', icon: 'cleaning_services', subPhases: [
                            {
                                id: 'tk_uygulama_genel', label: 'Genel', items: [
                                    { id: id(), label: 'Kuvvetli deterjan / dezenfektan kullanımı', itemType: 'is', hazards: ['Cilt ve göz tahrişi', 'Solunum yolu irritasyonu', 'Alerjik reaksiyon'] },
                                    { id: id(), label: 'Yüksek basınçlı yıkama', itemType: 'faaliyet', hazards: ['Yüksek basınç yaralanması', 'Kimyasal sıçrama', 'Kaygan zemin', 'Elektrik – su teması'] },
                                    { id: id(), label: 'Yüksek basınçlı yıkama makinesi', itemType: 'ekipman', hazards: ['Hortum patlaması', 'Yüksek basınç yaralanması', 'Elektrik çarpması'] },
                                    { id: id(), label: 'Islak zemin (temizlik sonrası)', itemType: 'ortam', hazards: ['Kayarak düşme', 'Elektrik tehlikesi', 'Yaya uyarı eksikliği'] },
                                ]
                            }
                        ]
                    }
                ]
            },

            // ── Asit & Baz ────────────────────────────────────────────────────
            {
                id: 'asit_baz',
                label: 'Asit & Baz (Kostik) İşlemleri',
                icon: 'science',
                phases: [
                    {
                        id: 'ab_depolama', label: 'Depolama', icon: 'inventory_2', subPhases: [{
                            id: 'ab_dep', label: 'Genel', items: [
                                { id: id(), label: 'Asit depolama (HCl, H₂SO₄, HNO₃)', itemType: 'is', hazards: ['Kap sızdırması / dökülme', 'Asit buharı soluma', 'Uyumsuz kimyasal (asit-baz birleşimi)', 'Yangın / patlama (oksitleyici asit)'] },
                                { id: id(), label: 'Baz / kostik depolama (NaOH, KOH)', itemType: 'is', hazards: ['Cilt yanığı', 'Göz hasarı', 'Dökülme riski', 'Isı gelişimi (su ile teması)'] },
                                { id: id(), label: 'Kimyasal depo alanı', itemType: 'ortam', hazards: ['Asit buharı birikimi', 'Uyumsuz kimyasal birleşme', 'Yetersiz havalandırma'] },
                            ]
                        }]
                    },
                    {
                        id: 'ab_uygulama', label: 'Uygulama & İşlem', icon: 'science', subPhases: [
                            {
                                id: 'ab_uygulama_genel', label: 'Genel', items: [
                                    { id: id(), label: 'Asit / baz ile yüzey işlemi', itemType: 'is', hazards: ['Kimyasal yanık (cilt/göz)', 'Asit buharı soluma', 'Dökülme – zemin hasarı', 'Nötralizasyon sıcaklığı'] },
                                    { id: id(), label: 'Kimyasal seyreltme (asit su ekleme)', itemType: 'is', hazards: ['Isı açığa çıkması', 'Sıçrama riski', 'Hatalı sıra (su-asit yerine asit-su)'] },
                                    { id: id(), label: 'Kimyasal dayanımlı pompa / vana', itemType: 'ekipman', hazards: ['Arıza – sızıntı', 'Conta yetersizliği', 'Basınç patlama riski'] },
                                ]
                            }
                        ]
                    }
                ]
            },

            // ── Pestisit & Tarım İlacı ────────────────────────────────────────
            {
                id: 'pestisit',
                label: 'Pestisit & Tarımsal Kimyasal',
                icon: 'eco',
                phases: [
                    {
                        id: 'ps_hazirlama', label: 'Hazırlama & Uygulama', icon: 'blender', subPhases: [{
                            id: 'ps_haz', label: 'Genel', items: [
                                { id: id(), label: 'Pestisit / fungisit seyreltme', itemType: 'is', hazards: ['Konsantre kimyasal teması', 'Cilt / göz tahrişi', 'Soluma maruziyeti'] },
                                { id: id(), label: 'Pülverizatör ile ilaçlama', itemType: 'faaliyet', hazards: ['Kimyasal aerosol soluma', 'Göz tahrişi', 'Cilt maruziyeti', 'Rüzgar yönü riski'] },
                                { id: id(), label: 'Sırt pülverizatörü / traktörlü pülverizatör', itemType: 'ekipman', hazards: ['Sızdırma – cilt teması', 'Ağırlık (sırt yorgunluğu)', 'Traktör devrilmesi'] },
                                { id: id(), label: 'Açık / rüzgarlı tarla alanı', itemType: 'ortam', hazards: ['Rüzgarla kimyasal yayılımı', 'UV / ısı stresi', 'İzole konum'] },
                            ]
                        }]
                    }
                ]
            },

            // ── Gaz & Basınçlı Sistem ────────────────────────────────────────
            {
                id: 'gaz_sistem',
                label: 'Gaz & Basınçlı Sistemler',
                icon: 'local_gas_station',
                phases: [
                    {
                        id: 'gs_depolama', label: 'Depolama', icon: 'inventory_2', subPhases: [{
                            id: 'gs_dep', label: 'Genel', items: [
                                { id: id(), label: 'LPG / propan tüpü depolama', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlama riski', 'Düşme – tüp hasarı', 'Uygun olmayan vana'] },
                                { id: id(), label: 'Sıkıştırılmış gaz tüpü alanı', itemType: 'ortam', hazards: ['Tüp devrilmesi', 'Regülatör hasarı', 'Tutuşabilir atmosfer'] },
                            ]
                        }]
                    },
                    {
                        id: 'gs_kullanim', label: 'Kullanım & Uygulama', icon: 'local_fire_department', subPhases: [{
                            id: 'gs_kul', label: 'Genel', items: [
                                { id: id(), label: 'Oksijen – asetilen kaynak işlemi', itemType: 'is', hazards: ['Gaz patlaması', 'Hortum sızıntısı', 'Yanık', 'UV radyasyon', 'Duman soluma'] },
                                { id: id(), label: 'Gaz dedektörü ile ortam kontrolü', itemType: 'faaliyet', hazards: ['Dedektör arızası', 'Gecikmeli alarm', 'Gaz birikimi tespiti eksikliği'] },
                                { id: id(), label: 'Kaynak / gaz tüpleri', itemType: 'ekipman', hazards: ['Regülatör arızası', 'Hortum patlaması', 'Alevleri geri tepme', 'Tüp devrilmesi'] },
                            ]
                        }]
                    }
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 3. ELEKTRİK İŞLERİ
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'elektrik',
        label: 'Elektrik İşleri',
        icon: 'bolt',
        color: '#f59e0b',
        subtypeQuestion: 'Elektrik iş türünü seçin:',
        subtypes: [
            {
                id: 'ag_pano', label: 'AG Tesisat & Pano', icon: 'electrical_services', phases: [
                    { id: 'ag_montaj', label: 'Pano Montajı', icon: 'developer_board', subPhases: [{ id: 's_ag1', label: 'Genel', items: [
                        { id: id(), label: 'Elektrik panosu kurulumu', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark / kıvılcım', 'Topraklama yetersizliği'] },
                        { id: id(), label: 'Kablo çekimi', itemType: 'is', hazards: ['Elektrik çarpması', 'Ağır kablo zorlanması', 'Kesici alet yaralanması'] },
                        { id: id(), label: 'Elektrik panosu', itemType: 'ekipman', hazards: ['Ark patlaması', 'Yangın', 'Kısa devre'] },
                        { id: id(), label: 'Elektrik panosu yakını', itemType: 'ortam', hazards: ['Yetkisiz erişim', 'Islak ortam', 'Enerji iletkenine temas'] },
                    ]}]},
                ]
            },
            {
                id: 'yg_hat', label: 'YG/OG Hat & Trafo', icon: 'transform', phases: [
                    { id: 'yg_bakim', label: 'Hat Bakım & Test', icon: 'settings', subPhases: [{ id: 's_yg1', label: 'Genel', items: [
                        { id: id(), label: 'Yüksek gerilim hat bakımı', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark flaşı (arc flash)', 'Yüksekten düşme', 'İzole ekipman yetersizliği'] },
                        { id: id(), label: 'LOTO (kilit-etiket) uygulaması', itemType: 'faaliyet', hazards: ['Enerji serbest kalması', 'Yetersiz izolasyon', 'İletken temas'] },
                        { id: id(), label: 'İzole araç / dielektrik eldiven', itemType: 'ekipman', hazards: ['Yalıtım bütünlüğü kaybı', 'Hatalı kullanım', 'Bakımsız ekipman'] },
                        { id: id(), label: 'Yüksek gerilim hattı yakını', itemType: 'ortam', hazards: ['İndükleme / ark atlaması', 'Güvenlik mesafesi yetersizliği'] },
                    ]}]},
                ]
            },
            {
                id: 'aydinlatma', label: 'Aydınlatma Tesisatı', icon: 'light_mode', phases: [
                    { id: 'ay_montaj', label: 'Armatür Montajı', icon: 'light', subPhases: [{ id: 's_ay1', label: 'Genel', items: [
                        { id: id(), label: 'Aydınlatma armatürü montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Elektrik çarpması', 'Cam kırılması'] },
                        { id: id(), label: 'Sokak lambası / direk montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Ağır ekipman taşıma', 'Trafik riski'] },
                        { id: id(), label: 'Platform / teleskopik merdiven', itemType: 'ekipman', hazards: ['Devrilme', 'Aşırı yük', 'Zemin stabilitesi'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 4. MAKİNE & İMALAT
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'makine',
        label: 'Makine & İmalat',
        icon: 'settings',
        color: '#64748b',
        subtypeQuestion: 'İmalat türünü seçin:',
        subtypes: [
            {
                id: 'metal_isleme', label: 'Metal İşleme', icon: 'hardware', phases: [
                    { id: 'mi_kesme', label: 'Kesme & Şekillendirme', icon: 'cut', subPhases: [{ id: 's_mi1', label: 'Genel', items: [
                        { id: id(), label: 'Torna / freze / CNC tezgah kullanımı', itemType: 'is', hazards: ['Dönen parça sıkışması', 'Talaş fırlaması', 'Gürültü', 'Titreşim'] },
                        { id: id(), label: 'Taşlama / bileme işlemi', itemType: 'is', hazards: ['Disk kırılması / fırlaması', 'Göz tahrişi (kıvılcım)', 'Gürültü'] },
                        { id: id(), label: 'CNC tezgah', itemType: 'ekipman', hazards: ['Hareket sensörü arızası', 'Programlama hatası', 'Dönen aks sıkışma'] },
                        { id: id(), label: 'Metal işleme atölyesi', itemType: 'ortam', hazards: ['Kesici talaş zemininde kayma', 'Gürültü', 'Yağ / soğutucu sıvı kayması'] },
                    ]}]},
                    { id: 'mi_kaynak', label: 'Kaynak & Kesme', icon: 'local_fire_department', subPhases: [{ id: 's_mi2', label: 'Genel', items: [
                        { id: id(), label: 'MIG / TIG / elektrik kaynağı', itemType: 'is', hazards: ['UV / kızılötesi radyasyon', 'Kaynak dumanı soluma', 'Yangın / yanık', 'Elektrik çarpması'] },
                        { id: id(), label: 'Plazma / oksi-yakıt kesme', itemType: 'is', hazards: ['UV radyasyon', 'Kızgın parça fırlaması', 'Gürültü', 'Gaz sızıntısı'] },
                        { id: id(), label: 'Kaynak makinesi', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Aşırı ısınma', 'Topraklama eksikliği'] },
                    ]}]},
                ]
            },
            {
                id: 'pres_stampa', label: 'Pres & Damgalama', icon: 'compress', phases: [
                    { id: 'pr_calisme', label: 'Pres Operasyonu', icon: 'compress', subPhases: [{ id: 's_pr1', label: 'Genel', items: [
                        { id: id(), label: 'Pres / zımba makinesi operasyonu', itemType: 'is', hazards: ['El-parmak sıkışması', 'Kalıp çarpması', 'Parça fırlaması', 'İki el kontrol eksikliği'] },
                        { id: id(), label: 'Kalıp değişimi', itemType: 'faaliyet', hazards: ['Ağır kalıp düşmesi', 'Sıkışma', 'LOTO uygulaması eksikliği'] },
                        { id: id(), label: 'Pres / zımba tezgahı', itemType: 'ekipman', hazards: ['Hareket sensörü arızası', 'Frenleme sistemi yetersizliği', 'Koruma kapağı eksikliği'] },
                    ]}]},
                ]
            },
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 5. LOJİSTİK & DEPO
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'lojistik',
        label: 'Lojistik & Depo',
        icon: 'local_shipping',
        color: '#ec4899',
        subtypeQuestion: 'Lojistik alanı seçin:',
        subtypes: [
            {
                id: 'depo_ici', label: 'Depo İçi Operasyonlar', icon: 'warehouse', phases: [
                    { id: 'di_istifleme', label: 'Yükleme & İstifleme', icon: 'stacked_bar_chart', subPhases: [{ id: 's_di1', label: 'Genel', items: [
                        { id: id(), label: 'Forklift ile yükleme / boşaltma', itemType: 'faaliyet', hazards: ['Forklift – yaya çarpması', 'Yük düşmesi', 'Devrilme', 'Görüş kısıtı'] },
                        { id: id(), label: 'Raf sistemine istif', itemType: 'is', hazards: ['Raf devrilmesi', 'Düşen ürün / palet', 'Yüksekten düşme (pick platformu)'] },
                        { id: id(), label: 'Forklift', itemType: 'ekipman', hazards: ['Devrilme', 'Geri manevra çarpması', 'LPG gaz kaçağı', 'Şarj istasyonu riski'] },
                        { id: id(), label: 'Depo koridoru', itemType: 'ortam', hazards: ['Forklift – yaya koridoru çakışması', 'Dar geçiş', 'Görüş engeli'] },
                    ]}]},
                    { id: 'di_tasima', label: 'Manuel Taşıma', icon: 'pan_tool', subPhases: [{ id: 's_di2', label: 'Genel', items: [
                        { id: id(), label: 'Ağır yük kaldırma (25 kg+)', itemType: 'is', hazards: ['Bel / omurga yaralanması', 'Kas zorlanması', 'Yük düşmesi'] },
                        { id: id(), label: 'El arabası / transpalet kullanımı', itemType: 'faaliyet', hazards: ['Rampa devrilmesi', 'Yük kayması', 'El / ayak ezilmesi'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 6. DOĞALGAZ & ENERJİ
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'dogalgaz',
        label: 'Doğalgaz & Enerji',
        icon: 'gas_meter',
        color: '#f97316',
        subtypeQuestion: 'Enerji sektörü seçin:',
        subtypes: [
            {
                id: 'dogalgaz_hat', label: 'Doğalgaz Hat & Bağlantı', icon: 'gas_meter', phases: [
                    { id: 'dh_montaj', label: 'Hat Montajı', icon: 'plumbing', subPhases: [{ id: 's_dh1', label: 'Genel', items: [
                        { id: id(), label: 'Doğalgaz borusu döşeme / kaynak', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlama / yangın', 'Kaynak sıçraması', 'Yetersiz havalandırma'] },
                        { id: id(), label: 'Gaz kaçak testi', itemType: 'faaliyet', hazards: ['Basınç testi patlaması', 'Gaz birikimi', 'Alev geri tepme'] },
                        { id: id(), label: 'Gaz dedektörü', itemType: 'ekipman', hazards: ['Arıza – yanlış negatif', 'Kalibrasyon eksikliği'] },
                        { id: id(), label: 'Gaz hattı güzergahı', itemType: 'ortam', hazards: ['Patlayıcı atmosfer', 'Zemin altı hat hasarı', 'Yetersiz işaretleme'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 7. TEMİZLİK & HİJYEN
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'temizlik',
        label: 'Temizlik & Hijyen',
        icon: 'cleaning_services',
        color: '#06b6d4',
        subtypeQuestion: 'Temizlik türünü seçin:',
        subtypes: [
            {
                id: 'genel_temizlik', label: 'Genel Tesis Temizliği', icon: 'mop', phases: [
                    { id: 'gt_islak', label: 'Islak Zemin & Kimyasal Temizlik', icon: 'water_drop', subPhases: [{ id: 's_gt1', label: 'Genel', items: [
                        { id: id(), label: 'Kimyasal deterjan ile zemin yıkama', itemType: 'faaliyet', hazards: ['Kaygan zemin', 'Kimyasal cilt / göz tahrişi', 'Elektrik – su teması'] },
                        { id: id(), label: 'Yüksekte cam / yüzey temizliği', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'İskele / merdiven devrilmesi', 'Kimyasal soluma'] },
                        { id: id(), label: 'Endüstriyel süpürge / makineli temizlik', itemType: 'ekipman', hazards: ['Gürültü', 'Toz soluma', 'Elektrik çarpması'] },
                        { id: id(), label: 'Islak taze yıkanmış zemin', itemType: 'ortam', hazards: ['Kayarak düşme', 'Uyarı levhası eksikliği'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 8. SAĞLIK HİZMETLERİ
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'saglik',
        label: 'Sağlık Hizmetleri',
        icon: 'local_hospital',
        color: '#ef4444',
        subtypeQuestion: 'Sağlık hizmet alanını seçin:',
        subtypes: [
            {
                id: 'hasta_bakimi', label: 'Hasta Bakımı & Klinik', icon: 'medical_services', phases: [
                    { id: 'hb_biyolojik', label: 'Biyolojik Risk & Hijyen', icon: 'coronavirus', subPhases: [{ id: 's_hb1', label: 'Genel', items: [
                        { id: id(), label: 'Kan / vücut sıvısıyla temas gerektiren işlem', itemType: 'is', hazards: ['Kan yoluyla bulaşan enfeksiyon (HIV, HBV, HCV)', 'Kesici-delici alet batması', 'Deri / mukoza teması'] },
                        { id: id(), label: 'Tıbbi atık yönetimi', itemType: 'faaliyet', hazards: ['Tıbbi atık batması / yaralanması', 'Enfeksiyon riski', 'Uygunsuz ambalajlama'] },
                        { id: id(), label: 'Enjektör / neşter', itemType: 'ekipman', hazards: ['İğne batması', 'Kan yoluyla enfeksiyon', 'Uygunsuz bertaraf'] },
                        { id: id(), label: 'Hasta odası / klinik', itemType: 'ortam', hazards: ['Biyolojik aerosol', 'Çoklu ilaç dirençli patojen', 'Yetersiz havalandırma'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 9. MADENCİLİK
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'maden',
        label: 'Madencilik',
        icon: 'diamond',
        color: '#84cc16',
        subtypeQuestion: 'Madencilik türünü seçin:',
        subtypes: [
            {
                id: 'yeralti_maden', label: 'Yeraltı Madenciliği', icon: 'dark_mode', phases: [
                    { id: 'ym_galeri', label: 'Galeri & Kazı', icon: 'terrain', subPhases: [{ id: 's_ym1', label: 'Genel', items: [
                        { id: id(), label: 'Patlatma ile kaya kazısı', itemType: 'is', hazards: ['Patlama dışı fırlama', 'Tavan göçmesi', 'Gürültü', 'Toz (silikoz)'] },
                        { id: id(), label: 'Galeri tahkimatı', itemType: 'is', hazards: ['Tahkimat yetersizliği', 'Ani tavan çökmesi', 'Metalik tahkimat yaralanması'] },
                        { id: id(), label: 'Yeraltı galeri', itemType: 'ortam', hazards: ['Metan / CO gaz birikimi', 'Oksijen yetersizliği', 'Dar alan riski', 'Su baskını'] },
                    ]}]},
                ]
            },
            {
                id: 'acik_ocak', label: 'Açık Ocak Madenciliği', icon: 'landscape', phases: [
                    { id: 'ao_delme', label: 'Delme & Patlatma', icon: 'construction', subPhases: [{ id: 's_ao1', label: 'Genel', items: [
                        { id: id(), label: 'Sondaj / delme işlemi', itemType: 'is', hazards: ['Gürültü', 'Toz (silika)', 'Vibrasyon', 'Sondaj aletinin sapması'] },
                        { id: id(), label: 'Patlatma işlemi', itemType: 'faaliyet', hazards: ['Erken ateşleme', 'Geri atış', 'Parça fırlaması', 'Seismik titreşim'] },
                        { id: id(), label: 'Açık ocak şev kenarı', itemType: 'ortam', hazards: ['Şev çökmesi', 'Araç devrilmesi', 'Yüksekten düşme'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 10. TARIM & HAYVANCILIK
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'tarim',
        label: 'Tarım & Hayvancılık',
        icon: 'agriculture',
        color: '#22c55e',
        subtypeQuestion: 'Tarımsal faaliyet türünü seçin:',
        subtypes: [
            {
                id: 'tarla_tarimi', label: 'Tarla Tarımı', icon: 'grass', phases: [
                    { id: 'tt_ekim', label: 'Ekim & Hasat', icon: 'grass', subPhases: [{ id: 's_tt1', label: 'Genel', items: [
                        { id: id(), label: 'Traktör / biçerdöver operasyonu', itemType: 'faaliyet', hazards: ['Devrilme', 'Dönen parça sıkışması (pto)', 'Gürültü', 'Titreşim'] },
                        { id: id(), label: 'Pestisit / gübre uygulaması', itemType: 'faaliyet', hazards: ['Kimyasal soluma', 'Cilt teması', 'Rüzgar yönü riski'] },
                        { id: id(), label: 'Açık tarla', itemType: 'ortam', hazards: ['UV / ısı stresi', 'Böcek / haşere ısırması', 'İzole konum'] },
                    ]}]},
                ]
            },
            {
                id: 'hayvancilik', label: 'Hayvancılık & Ahır', icon: 'pets', phases: [
                    { id: 'ha_bakim', label: 'Hayvan Bakımı', icon: 'pets', subPhases: [{ id: 's_ha1', label: 'Genel', items: [
                        { id: id(), label: 'Büyükbaş / küçükbaş hayvan bakımı', itemType: 'faaliyet', hazards: ['Hayvan saldırısı / tekme', 'Zoonoz hastalık', 'Kaygan zemin (gübre)'] },
                        { id: id(), label: 'Ahır temizliği', itemType: 'faaliyet', hazards: ['Amonyak / metan gaz birikimi', 'Kaygan gübre zemininde kayma', 'Biyolojik temas'] },
                        { id: id(), label: 'Ahır / kapalı bölme', itemType: 'ortam', hazards: ['Gaz birikimi', 'Kötü aydınlatma', 'Dar / kapalı alan'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 11. GIDA & İÇECEK ÜRETİMİ
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'gida',
        label: 'Gıda & İçecek Üretimi',
        icon: 'restaurant',
        color: '#a855f7',
        subtypeQuestion: 'Gıda üretim alanını seçin:',
        subtypes: [
            {
                id: 'gida_uretim', label: 'Gıda Üretim Hattı', icon: 'factory', phases: [
                    { id: 'gu_kesme', label: 'Hazırlama & Kesme', icon: 'cut', subPhases: [{ id: 's_gu1', label: 'Genel', items: [
                        { id: id(), label: 'Et / sebze kesme makinesi operasyonu', itemType: 'is', hazards: ['Kesici bıçak yaralanması', 'El sıkışması', 'Dönen parça kontağı'] },
                        { id: id(), label: 'Soğuk zincir / dondurucu çalışma', itemType: 'faaliyet', hazards: ['Hipotermi / soğuk zararı', 'Soğutucu gaz kaçağı', 'Kaygan buz zemininde düşme'] },
                        { id: id(), label: 'Gıda işleme alanı', itemType: 'ortam', hazards: ['Islak / kaygan zemin', 'Gürültü', 'Mikrobiyolojik kontaminasyon'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 12. OFİS & İDARİ
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'ofis',
        label: 'Ofis & İdari',
        icon: 'business',
        color: '#6366f1',
        subtypeQuestion: 'Ofis alanı türünü seçin:',
        subtypes: [
            {
                id: 'ofis_genel', label: 'Genel Ofis Çalışması', icon: 'desk', phases: [
                    { id: 'og_ekran', label: 'Ekranlı Araç Kullanımı', icon: 'monitor', subPhases: [{ id: 's_og1', label: 'Genel', items: [
                        { id: id(), label: 'Uzun süreli bilgisayar kullanımı', itemType: 'faaliyet', hazards: ['Göz yorgunluğu (VDU sendromu)', 'Boyun / bel kas zorlanması', 'Karpal tünel sendromu'] },
                        { id: id(), label: 'Yazıcı / fotokopi makinesi kullanımı', itemType: 'faaliyet', hazards: ['Ozon / toner tozu soluma', 'Isıl yanık (fuser)', 'Elektrik çarpması'] },
                        { id: id(), label: 'Ofis çalışma alanı', itemType: 'ortam', hazards: ['Ergonomik yetersizlik', 'Yetersiz aydınlatma', 'Kablo takılma düşmesi'] },
                    ]}]},
                ]
            }
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // 13. MERMER İŞLEME TESİSİ (İMALAT SANAYİ / DOĞAL TAŞ İŞLEME)
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'mermer',
        label: 'Mermer İşleme Tesisi',
        icon: 'diamond',
        color: '#64748b',
        subtypeQuestion: 'Tesisteki çalışma alanını / üretim hattını seçin:',
        subtypes: [
            // ── Genel Hat (Tüm 12 Aşama) ─────────────────────────────────────
            {
                id: 'mermer_genel', label: 'Genel Mermer İşleme (Tam Hat)', icon: 'factory',
                phases: [
                    // A — Mal Kabul & Stok
                    {
                        id: 'mer_a', label: 'A — Mal Kabul & Stok Alanı', icon: 'inventory',
                        subPhases: [
                            { id: 'mer_a1', label: 'Blok/Levha Boşaltma & İstif', items: [
                                { id: id(), label: 'Araç altında blok/levha boşaltma', itemType: 'is', hazards: ['Ezilme/sıkışma', 'Levha devrilmesi', 'Forklift çarpması'] },
                                { id: id(), label: 'Blok/levha istifleme operasyonu', itemType: 'is', hazards: ['Levha devrilmesi', 'Yetersiz istifleme devrilme', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Stok takibi ve hareket planlaması', itemType: 'faaliyet', hazards: ['Forklift çarpması', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Forklift / istif makinesi', itemType: 'ekipman', hazards: ['Forklift çarpması', 'Ezilme/sıkışma', 'Yük düşmesi'] },
                                { id: id(), label: 'İstif rafları / bloklama aparatları', itemType: 'ekipman', hazards: ['Yetersiz istifleme devrilme', 'Levha devrilmesi'] },
                                { id: id(), label: 'Açık hava / kapalı depolama alanı', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Zemin taşıma kapasitesi aşımı', 'Forklift çarpması'] },
                            ]},
                        ]
                    },
                    // B — İç Taşıma & Besleme
                    {
                        id: 'mer_b', label: 'B — İç Taşıma & Besleme Hattı', icon: 'move_down',
                        subPhases: [
                            { id: 'mer_b1', label: 'Vinç & Konveyör ile Transfer', items: [
                                { id: id(), label: 'Levha transferi (köprü vinç ile)', itemType: 'is', hazards: ['Yük düşmesi', 'Ezilme/sıkışma', 'Levha devrilmesi'] },
                                { id: id(), label: 'Blok besleme hattına yükleme', itemType: 'is', hazards: ['Ezilme/sıkışma', 'Levha devrilmesi', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Vinç / overhead crane operasyonu', itemType: 'faaliyet', hazards: ['Yük düşmesi', 'Elektrik çarpması', 'Halat/kanca arızası'] },
                                { id: id(), label: 'Manuel taşıma ve yönlendirme', itemType: 'faaliyet', hazards: ['Elle taşıma kas-iskelet', 'Ezilme/sıkışma', 'Kayma/takılma/düşme'] },
                                { id: id(), label: 'Köprü vinç / overhead crane', itemType: 'ekipman', hazards: ['Yük düşmesi', 'Elektrik çarpması', 'Mekanik arıza'] },
                                { id: id(), label: 'Taşıma konveyörü / rulo tabla', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Sıkışma', 'Gürültü'] },
                                { id: id(), label: 'Fabrika içi koridor & besleme alanı', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Forklift çarpması', 'Toz/solunabilir mineral tozu'] },
                            ]},
                        ]
                    },
                    // C — CNC Köprü Kesim
                    {
                        id: 'mer_c', label: 'C — CNC Köprü Kesim (Ana Testereler)', icon: 'content_cut',
                        subPhases: [
                            { id: 'mer_c1', label: 'Kesim Operasyonu', items: [
                                { id: id(), label: 'Levha/blok CNC köprü kesimi', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Döner aksam teması', 'Amputasyon', 'Gürültü'] },
                                { id: id(), label: 'Kesim parametresi ayarı (hız/derinlik/su)', itemType: 'is', hazards: ['Beklenmedik enerjilenme', 'Döner aksam teması', 'Kesilme'] },
                                { id: id(), label: 'Kesim suyu ve soğutma sistemi kontrolü', itemType: 'faaliyet', hazards: ['Su/çamur sıçraması', 'Islak zeminde düşme', 'Elektrik çarpması'] },
                                { id: id(), label: 'Makine operasyonu ve CNC programlama', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Yazılım/kontrol hatası', 'Göz yaralanması'] },
                                { id: id(), label: 'CNC köprü testere makinesi', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Döner aksam teması', 'Gürültü', 'Elektrik çarpması'] },
                                { id: id(), label: 'Elmas kesim diski', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Göz yaralanması'] },
                                { id: id(), label: 'CNC kesim hücresi (ıslak/çamurlu zemin)', itemType: 'ortam', hazards: ['Islak zeminde düşme', 'Toz/solunabilir mineral tozu', 'Gürültü', 'Su/çamur sıçraması'] },
                            ]},
                        ]
                    },
                    // D — Yan Kesme
                    {
                        id: 'mer_d', label: 'D — Yan Kesme & Kenar Kesme', icon: 'straighten',
                        subPhases: [
                            { id: 'mer_d1', label: 'Yan Kesme Operasyonu', items: [
                                { id: id(), label: 'Kenar kesme / boyut kesme operasyonu', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Kesilme', 'Gürültü'] },
                                { id: id(), label: 'Köşe ve profil kesimi', itemType: 'is', hazards: ['Kesilme', 'Göz yaralanması', 'Döner aksam teması'] },
                                { id: id(), label: 'Makine ayarı ve kesim kalıbı değişimi', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Kesilme', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Yan kesme makinesi / kesim merkezi', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Döner aksam teması', 'Gürültü', 'Elektrik çarpması'] },
                                { id: id(), label: 'Yan kesim diski / profil bıçağı', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Kesilme'] },
                                { id: id(), label: 'Yan kesme istasyonu (ıslak zemin)', itemType: 'ortam', hazards: ['Islak zeminde düşme', 'Gürültü', 'Toz/solunabilir mineral tozu'] },
                            ]},
                        ]
                    },
                    // E — Pah Makinesi & Kenar İşleme
                    {
                        id: 'mer_e', label: 'E — Pah Makinesi & Kenar İşleme', icon: 'crop',
                        subPhases: [
                            { id: 'mer_e1', label: 'Kenar Profil İşleme', items: [
                                { id: id(), label: 'Kenar pah/radyüs/profil işleme', itemType: 'is', hazards: ['Döner aksam teması', 'Kesilme', 'Titreşim', 'Gürültü'] },
                                { id: id(), label: 'Pah açısı ayarı ve kalibrasyonu', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Kesilme'] },
                                { id: id(), label: 'Parça yerleştirme ve çıkarma', itemType: 'faaliyet', hazards: ['Elle taşıma kas-iskelet', 'Ezilme/sıkışma', 'Kesilme'] },
                                { id: id(), label: 'Pah makinesi / kenar profil makinesi', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Titreşim', 'Gürültü', 'Elektrik çarpması'] },
                                { id: id(), label: 'Taşlama taşları / elmas profil bitleri', itemType: 'ekipman', hazards: ['Taş kırılması/parça fırlaması', 'Aşınma tozu soluma', 'Göz yaralanması'] },
                                { id: id(), label: 'Pah işleme istasyonu (toz/çamur bölgesi)', itemType: 'ortam', hazards: ['Toz/solunabilir mineral tozu', 'Su/çamur sıçraması', 'Islak zeminde düşme'] },
                            ]},
                        ]
                    },
                    // F — Yazı CNC & Şekillendirme
                    {
                        id: 'mer_f', label: 'F — Yazı CNC & Şekillendirme', icon: 'edit',
                        subPhases: [
                            { id: 'mer_f1', label: 'CNC Frezeleme & Oyma', items: [
                                { id: id(), label: 'CNC freze ile yazı / şekil / oyma işleme', itemType: 'is', hazards: ['Döner aksam teması', 'Göz yaralanması', 'Toz/solunabilir mineral tozu', 'Gürültü'] },
                                { id: id(), label: 'CNC program yükleme ve parametre ayarı', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Yazılım/kontrol hatası'] },
                                { id: id(), label: 'Freze biti ve oyma takımı değişimi', itemType: 'faaliyet', hazards: ['Kesilme', 'Beklenmedik enerjilenme', 'Elle sıkışma'] },
                                { id: id(), label: 'CNC router / şekillendirme makinesi', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Gürültü', 'Elektrik çarpması', 'Titreşim'] },
                                { id: id(), label: 'Freze bitleri / oyma takımları', itemType: 'ekipman', hazards: ['Takım kırılması/parça fırlaması', 'Kesilme', 'Göz yaralanması'] },
                                { id: id(), label: 'CNC şekillendirme hücresi', itemType: 'ortam', hazards: ['Toz/solunabilir mineral tozu', 'Gürültü', 'Aydınlatma yetersizliği'] },
                            ]},
                        ]
                    },
                    // G — El Aletleri & Rötuş
                    {
                        id: 'mer_g', label: 'G — El Aletleri & Rötuş', icon: 'hardware',
                        subPhases: [
                            { id: 'mer_g1', label: 'El Aleti ile İşleme', items: [
                                { id: id(), label: 'Açılı taşlama (flex) ile kenar/yüzey rötuşu', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Kesilme', 'Titreşim'] },
                                { id: id(), label: 'El tipi kesici ve rötuş aleti kullanımı', itemType: 'is', hazards: ['Kesilme', 'Göz yaralanması', 'Döner aksam teması'] },
                                { id: id(), label: 'Parça kalite kontrolü ve ince rötuş', itemType: 'faaliyet', hazards: ['Keskin kenar yaralanması', 'Toz/solunabilir mineral tozu'] },
                                { id: id(), label: 'Açılı taşlama makinesi (flex)', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Titreşim', 'Gürültü'] },
                                { id: id(), label: 'El kesicileri / el tipi taşlama taşları', itemType: 'ekipman', hazards: ['Kesilme', 'Taş kırılması', 'Göz yaralanması'] },
                                { id: id(), label: 'Rötuş istasyonu / el işleme alanı', itemType: 'ortam', hazards: ['Toz/solunabilir mineral tozu', 'Gürültü', 'Kişisel koruyucu ekipman eksikliği'] },
                            ]},
                        ]
                    },
                    // H — Temizlik & Çamur-Su Yönetimi
                    {
                        id: 'mer_h', label: 'H — Temizlik & Çamur-Su Yönetimi', icon: 'water_drop',
                        subPhases: [
                            { id: 'mer_h1', label: 'Yıkama & Atık Yönetimi', items: [
                                { id: id(), label: 'Levha ve zemin yıkama', itemType: 'is', hazards: ['Islak zeminde düşme', 'Su/çamur sıçraması', 'Elektrik çarpması'] },
                                { id: id(), label: 'Çamur (slurry) temizleme ve tahliyesi', itemType: 'is', hazards: ['Islak zeminde düşme', 'Kimyasal maruziyet', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Atık su ve çamur toplama-pompalama', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Kayma/takılma/düşme', 'Elektrik çarpması'] },
                                { id: id(), label: 'Yüksek basınçlı yıkama (jet wash)', itemType: 'faaliyet', hazards: ['Su basınç yaralanması', 'Islak zeminde düşme', 'Göz yaralanması'] },
                                { id: id(), label: 'Yüksek basınçlı yıkayıcı (jet wash)', itemType: 'ekipman', hazards: ['Su basınç yaralanması', 'Elektrik çarpması', 'Gürültü'] },
                                { id: id(), label: 'Çamur toplama pompası ve havuzu', itemType: 'ekipman', hazards: ['Mekanik arıza', 'Kimyasal maruziyet', 'Boğulma tehlikesi'] },
                                { id: id(), label: 'Yıkama alanı (sürekli ıslak zemin)', itemType: 'ortam', hazards: ['Islak zeminde düşme', 'Elektrik çarpması', 'Kimyasal maruziyet'] },
                            ]},
                        ]
                    },
                    // İ — Paketleme & Sevkiyat
                    {
                        id: 'mer_i', label: 'İ — Paketleme & Sevkiyat', icon: 'local_shipping',
                        subPhases: [
                            { id: 'mer_i1', label: 'Paketleme ve Yükleme', items: [
                                { id: id(), label: 'Levha/kasa paketleme operasyonu', itemType: 'is', hazards: ['Levha devrilmesi', 'Kesilme', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Araç yükleme operasyonu', itemType: 'is', hazards: ['Ezilme/sıkışma', 'Yük düşmesi', 'Forklift çarpması'] },
                                { id: id(), label: 'Etiketleme, tartım ve sevkiyat evrakları', itemType: 'faaliyet', hazards: ['Elle taşıma kas-iskelet', 'Kayma/takılma/düşme'] },
                                { id: id(), label: 'Forklift ile araç yükleme', itemType: 'faaliyet', hazards: ['Forklift çarpması', 'Ezilme/sıkışma', 'Devrilme'] },
                                { id: id(), label: 'Paketleme makinesi / germe filmi sargısı', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Sıkışma', 'Devrilme'] },
                                { id: id(), label: 'Forklift / yük taşıyıcı araç', itemType: 'ekipman', hazards: ['Forklift çarpması', 'Devrilme', 'Yük düşmesi'] },
                                { id: id(), label: 'Paketleme alanı ve yükleme rampası', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Forklift çarpması', 'Levha devrilmesi'] },
                            ]},
                        ]
                    },
                    // J — Bakım, Ayar & Disk Değişimi
                    {
                        id: 'mer_j', label: 'J — Bakım, Ayar & Disk Değişimi', icon: 'build',
                        subPhases: [
                            { id: 'mer_j1', label: 'LOTO & Planlı Bakım', items: [
                                { id: id(), label: 'Elmas disk değişimi (LOTO zorunlu)', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Kesilme', 'Beklenmedik enerjilenme', 'Elle taşıma kas-iskelet'] },
                                { id: id(), label: 'Makine bakım ve onarım', itemType: 'is', hazards: ['Beklenmedik enerjilenme', 'Elektrik çarpması', 'Ezilme/sıkışma', 'Kimyasal maruziyet'] },
                                { id: id(), label: 'Enerji kilitleme (Lockout/Tagout — LOTO)', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Elektrik çarpması', 'Basınçlı enerji açığa çıkması'] },
                                { id: id(), label: 'Yağlama, temizleme ve makine ayarı', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Kayma/takılma/düşme', 'Yangın'] },
                                { id: id(), label: 'Bakım el aletleri (anahtar, tornavida vb.)', itemType: 'ekipman', hazards: ['Kesilme', 'Elektrik çarpması', 'Ezilme/sıkışma'] },
                                { id: id(), label: 'LOTO kiti (kilit, etiket, blok aparatı)', itemType: 'ekipman', hazards: ['Prosedür uyumsuzluğunda beklenmedik enerjilenme'] },
                                { id: id(), label: 'Bakım istasyonu ve makine çevresi', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Aydınlatma yetersizliği', 'Kimyasal maruziyet'] },
                            ]},
                        ]
                    },
                    // K — Yardımcı Tesisler
                    {
                        id: 'mer_k', label: 'K — Yardımcı Tesisler', icon: 'settings',
                        subPhases: [
                            { id: 'mer_k1', label: 'Altyapı & Enerji Sistemleri', items: [
                                { id: id(), label: 'Kompresör ve pompa operasyonu', itemType: 'is', hazards: ['Basınçlı hava/sıvı patlama', 'Gürültü', 'Mekanik arıza'] },
                                { id: id(), label: 'Elektrik pano bakımı ve kontrolü', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark flash', 'Beklenmedik enerjilenme'] },
                                { id: id(), label: 'Jeneratör ve UPS kontrolü', itemType: 'faaliyet', hazards: ['Egzoz gazı/CO zehirlenmesi', 'Yangın', 'Elektrik çarpması'] },
                                { id: id(), label: 'Su arıtma ve atık su sistemi kontrolü', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Elektrik çarpması', 'Kayma/takılma/düşme'] },
                                { id: id(), label: 'Hava kompresörü', itemType: 'ekipman', hazards: ['Basınçlı hava patlama', 'Gürültü', 'Yangın'] },
                                { id: id(), label: 'Ana elektrik panoları / transformatör', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Ark flash', 'Yangın'] },
                                { id: id(), label: 'Teknik oda ve tesisat koridoru', itemType: 'ortam', hazards: ['Sınırlı alan', 'Yetersiz aydınlatma', 'Elektrik çarpması', 'Kimyasal maruziyet'] },
                            ]},
                        ]
                    },
                    // L — Sosyal Alanlar
                    {
                        id: 'mer_l', label: 'L — Sosyal Alanlar', icon: 'groups',
                        subPhases: [
                            { id: 'mer_l1', label: 'Dinlenme, Yemekhane & Soyunma', items: [
                                { id: id(), label: 'Kirli alet/ekipman temizliği (vardiya sonu)', itemType: 'is', hazards: ['Kimyasal maruziyet', 'Kesilme', 'Su/çamur sıçraması'] },
                                { id: id(), label: 'İş kıyafeti değişimi ve kişisel hijyen', itemType: 'faaliyet', hazards: ['Toz transfer (ikincil maruziyet)', 'Cilt tahrişi'] },
                                { id: id(), label: 'Yemek molası ve dinlenme', itemType: 'faaliyet', hazards: ['Toz transfer (yemek sırasında maruziyet)', 'Ergonomik yük'] },
                                { id: id(), label: 'Duş ve soyunma tesisleri', itemType: 'ekipman', hazards: ['Islak zeminde düşme', 'Sıcak su yanığı', 'Elektrik çarpması'] },
                                { id: id(), label: 'Merdiven, koridor ve geçitler', itemType: 'ekipman', hazards: ['Düşme (merdiven)', 'Kayma/takılma/düşme', 'Engel/çarpma'] },
                                { id: id(), label: 'Yemekhane', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Toz transfer/ikincil maruziyet'] },
                                { id: id(), label: 'Soyunma odası ve tuvalet', itemType: 'ortam', hazards: ['Islak zeminde düşme', 'Hijyen yetersizliği', 'Yetersiz havalandırma'] },
                            ]},
                        ]
                    },
                ]
            },

            // ── Ebatlama & Kesim Hattı ────────────────────────────────────────
            {
                id: 'mermer_kesim', label: 'Ebatlama ve Kesim Hattı', icon: 'content_cut',
                phases: [
                    { id: 'merk_cnc', label: 'CNC Köprü Kesim', icon: 'content_cut', subPhases: [{ id: 's_merk1', label: 'Kesim', items: [
                        { id: id(), label: 'CNC köprü kesim operasyonu', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Gürültü', 'Döner aksam teması'] },
                        { id: id(), label: 'Kesim diski takip ve kontrol', itemType: 'faaliyet', hazards: ['Disk kırılması/parça fırlaması', 'Beklenmedik enerjilenme'] },
                        { id: id(), label: 'CNC köprü testere', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Elektrik çarpması', 'Gürültü'] },
                        { id: id(), label: 'Kesim hücresi (ıslak/çamurlu zemin)', itemType: 'ortam', hazards: ['Islak zeminde düşme', 'Toz/solunabilir mineral tozu', 'Gürültü'] },
                    ]}]},
                    { id: 'merk_yan', label: 'Yan Kesme', icon: 'straighten', subPhases: [{ id: 's_merk2', label: 'Yan Kesme', items: [
                        { id: id(), label: 'Kenar/boyut kesim operasyonu', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Kesilme'] },
                        { id: id(), label: 'Yan kesme makinesi', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Döner aksam teması', 'Gürültü'] },
                        { id: id(), label: 'Yan kesme istasyonu', itemType: 'ortam', hazards: ['Islak zeminde düşme', 'Gürültü', 'Toz/solunabilir mineral tozu'] },
                    ]}]},
                    { id: 'merk_bak', label: 'Bakım & Disk Değişimi', icon: 'build', subPhases: [{ id: 's_merk3', label: 'LOTO & Bakım', items: [
                        { id: id(), label: 'Elmas disk değişimi (LOTO zorunlu)', itemType: 'is', hazards: ['Beklenmedik enerjilenme', 'Kesilme', 'Disk kırılması/parça fırlaması'] },
                        { id: id(), label: 'LOTO kiti', itemType: 'ekipman', hazards: ['Prosedür uyumsuzluğunda beklenmedik enerjilenme'] },
                    ]}]},
                ]
            },

            // ── Kenar İşleme & Pah ────────────────────────────────────────────
            {
                id: 'mermer_pah', label: 'Kenar İşleme & Pah', icon: 'crop',
                phases: [
                    { id: 'merp_pah', label: 'Pah & Kenar Profil', icon: 'crop', subPhases: [{ id: 's_merp1', label: 'Kenar İşleme', items: [
                        { id: id(), label: 'Kenar pah/radyüs işleme', itemType: 'is', hazards: ['Döner aksam teması', 'Kesilme', 'Titreşim', 'Gürültü'] },
                        { id: id(), label: 'Pah makinesi operasyonu', itemType: 'faaliyet', hazards: ['Döner aksam teması', 'Titreşim', 'Beklenmedik enerjilenme'] },
                        { id: id(), label: 'Pah makinesi / kenar profil makinesi', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Gürültü', 'Titreşim', 'Elektrik çarpması'] },
                        { id: id(), label: 'Pah istasyonu (toz/çamur)', itemType: 'ortam', hazards: ['Toz/solunabilir mineral tozu', 'Islak zeminde düşme', 'Gürültü'] },
                    ]}]},
                    { id: 'merp_flex', label: 'El Aletleri & Rötuş', icon: 'hardware', subPhases: [{ id: 's_merp2', label: 'El Aleti Kullanımı', items: [
                        { id: id(), label: 'Flex (açılı taşlama) ile rötuş', itemType: 'is', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Titreşim'] },
                        { id: id(), label: 'Açılı taşlama (flex)', itemType: 'ekipman', hazards: ['Disk kırılması/parça fırlaması', 'Amputasyon', 'Titreşim', 'Gürültü'] },
                    ]}]},
                ]
            },

            // ── CNC Yazı & Şekillendirme ──────────────────────────────────────
            {
                id: 'mermer_cnc', label: 'CNC Yazı & Şekillendirme', icon: 'edit',
                phases: [
                    { id: 'merc_freze', label: 'CNC Frezeleme & Oyma', icon: 'edit', subPhases: [{ id: 's_merc1', label: 'Frezeleme', items: [
                        { id: id(), label: 'CNC router ile yazı/şekil/oyma', itemType: 'is', hazards: ['Döner aksam teması', 'Göz yaralanması', 'Toz/solunabilir mineral tozu', 'Gürültü'] },
                        { id: id(), label: 'CNC program ve takım değişimi', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Kesilme'] },
                        { id: id(), label: 'CNC router / şekillendirme makinesi', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Gürültü', 'Elektrik çarpması'] },
                        { id: id(), label: 'CNC hücresi', itemType: 'ortam', hazards: ['Toz/solunabilir mineral tozu', 'Gürültü', 'Aydınlatma yetersizliği'] },
                    ]}]},
                ]
            },

            // ── Yüzey Düzeltme & Finisaj ──────────────────────────────────────
            {
                id: 'mermer_finisaj', label: 'Yüzey Düzeltme & Finisaj', icon: 'auto_fix_high',
                phases: [
                    { id: 'merf_taslama', label: 'Taşlama & Cilalama', icon: 'auto_fix_high', subPhases: [{ id: 's_merf1', label: 'Yüzey İşleme', items: [
                        { id: id(), label: 'Yüzey taşlama ve cilalama', itemType: 'is', hazards: ['Toz/solunabilir mineral tozu', 'Titreşim', 'Gürültü', 'Kimyasal maruziyet'] },
                        { id: id(), label: 'Cila ve kimyasal uygulama', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Yangın', 'Cilt/göz tahrişi'] },
                        { id: id(), label: 'Taşlama/cilalama makinesi', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Titreşim', 'Gürültü'] },
                        { id: id(), label: 'Finisaj istasyonu', itemType: 'ortam', hazards: ['Toz/solunabilir mineral tozu', 'Kimyasal buhar', 'Islak zeminde düşme'] },
                    ]}]},
                ]
            },

            // ── Paketleme & Sevkiyat ──────────────────────────────────────────
            {
                id: 'mermer_paket', label: 'Paketleme & Sevkiyat', icon: 'local_shipping',
                phases: [
                    { id: 'merpa_paket', label: 'Paketleme & Yükleme', icon: 'local_shipping', subPhases: [{ id: 's_merpa1', label: 'Paketleme', items: [
                        { id: id(), label: 'Levha paketleme operasyonu', itemType: 'is', hazards: ['Levha devrilmesi', 'Kesilme', 'Elle taşıma kas-iskelet'] },
                        { id: id(), label: 'Forklift ile araç yükleme', itemType: 'faaliyet', hazards: ['Forklift çarpması', 'Ezilme/sıkışma', 'Yük düşmesi'] },
                        { id: id(), label: 'Paketleme makinesi / germe filmi', itemType: 'ekipman', hazards: ['Döner aksam teması', 'Devrilme'] },
                        { id: id(), label: 'Paketleme alanı ve yükleme rampası', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Forklift çarpması', 'Levha devrilmesi'] },
                    ]}]},
                ]
            },

            // ── Bakım-Onarım & Yardımcı Tesisler ─────────────────────────────
            {
                id: 'mermer_bakim', label: 'Bakım-Onarım & Yardımcı Tesisler', icon: 'build',
                phases: [
                    { id: 'merb_loto', label: 'LOTO & Planlı Bakım', icon: 'build', subPhases: [{ id: 's_merb1', label: 'LOTO & Bakım', items: [
                        { id: id(), label: 'Makine bakım ve onarım', itemType: 'is', hazards: ['Beklenmedik enerjilenme', 'Elektrik çarpması', 'Ezilme/sıkışma'] },
                        { id: id(), label: 'Elmas disk değişimi (LOTO zorunlu)', itemType: 'is', hazards: ['Kesilme', 'Beklenmedik enerjilenme', 'Disk kırılması/parça fırlaması'] },
                        { id: id(), label: 'Enerji kilitleme / LOTO uygulaması', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Elektrik çarpması'] },
                        { id: id(), label: 'LOTO kiti', itemType: 'ekipman', hazards: ['Prosedür uyumsuzluğunda beklenmedik enerjilenme'] },
                        { id: id(), label: 'Bakım alanı', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Kimyasal maruziyet', 'Aydınlatma yetersizliği'] },
                    ]}]},
                    { id: 'merb_yardimci', label: 'Yardımcı Tesisler', icon: 'settings', subPhases: [{ id: 's_merb2', label: 'Altyapı', items: [
                        { id: id(), label: 'Kompresör operasyonu', itemType: 'is', hazards: ['Basınçlı hava patlama', 'Gürültü'] },
                        { id: id(), label: 'Elektrik pano bakımı', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark flash'] },
                        { id: id(), label: 'Hava kompresörü', itemType: 'ekipman', hazards: ['Basınçlı hava patlama', 'Gürültü', 'Yangın'] },
                        { id: id(), label: 'Teknik oda', itemType: 'ortam', hazards: ['Sınırlı alan', 'Elektrik çarpması', 'Yetersiz aydınlatma'] },
                    ]}]},
                ]
            },

            // ── Depolama & Stok Alanı ─────────────────────────────────────────
            {
                id: 'mermer_depo', label: 'Depolama & Stok Alanı', icon: 'warehouse',
                phases: [
                    { id: 'merd_istifleme', label: 'İstifleme & Stok Hareketleri', icon: 'inventory', subPhases: [{ id: 's_merd1', label: 'Depolama', items: [
                        { id: id(), label: 'Blok/levha istifleme', itemType: 'is', hazards: ['Levha devrilmesi', 'Yetersiz istifleme devrilme', 'Elle taşıma kas-iskelet'] },
                        { id: id(), label: 'Forklift ile stok hareketi', itemType: 'faaliyet', hazards: ['Forklift çarpması', 'Ezilme/sıkışma', 'Yük düşmesi'] },
                        { id: id(), label: 'Forklift / istif makinesi', itemType: 'ekipman', hazards: ['Forklift çarpması', 'Devrilme', 'Yük düşmesi'] },
                        { id: id(), label: 'Kapalı/açık depo alanı', itemType: 'ortam', hazards: ['Kayma/takılma/düşme', 'Forklift çarpması', 'Levha devrilmesi'] },
                    ]}]},
                ]
            },
        ]
    }
];

// Tüm sektörlere Ortak İnceleme Konuları modülü eklenir
GUIDED_LIBRARY.forEach(sector => sector.subtypes.push(COMMON_SUBTYPE));
