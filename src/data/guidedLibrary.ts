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
                    { id: 'ag_montaj', label: 'Pano Montajı & Kablo Çekimi', icon: 'developer_board', subPhases: [
                        { id: 's_ag1', label: 'Pano Kurulum', items: [
                            { id: id(), label: 'Elektrik panosu kurulumu ve montajı', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark / kıvılcım', 'Topraklama yetersizliği', 'Düşen pano ezilmesi'] },
                            { id: id(), label: 'Kablo çekimi (boru / kanal içi)', itemType: 'is', hazards: ['Elektrik çarpması', 'Ağır kablo zorlanması', 'Kesici alet yaralanması', 'Kas-iskelet zorlanması'] },
                            { id: id(), label: 'Kablo bağlantısı ve sıkıştırma', itemType: 'is', hazards: ['Elektrik çarpması', 'Kısa devre', 'Ark flash', 'Gevşek bağlantı yangını'] },
                            { id: id(), label: 'Sigorta, şalter ve koruma elemanları montajı', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark patlaması', 'Yanlış değer seçimi'] },
                            { id: id(), label: 'Bara sistemi kurulumu', itemType: 'is', hazards: ['Ark flash', 'Kısa devre', 'Elektrik çarpması', 'Yanık'] },
                            { id: id(), label: 'Kablo etiketleme ve numaralama', itemType: 'faaliyet', hazards: ['Etiket hatası – yanlış devre anahtarlama', 'Ergonomik zorlanma'] },
                            { id: id(), label: 'Elektrik panosu (AG/TDA pano)', itemType: 'ekipman', hazards: ['Ark patlaması', 'Yangın', 'Kısa devre', 'Yetkisiz erişim'] },
                            { id: id(), label: 'Kablo kanalı / boru tesisatı', itemType: 'ekipman', hazards: ['Kablo hasarı', 'Keskin kenar yaralanması', 'Isınma – yangın'] },
                            { id: id(), label: 'Elektrik panosu yakını ve teknik alan', itemType: 'ortam', hazards: ['Yetkisiz erişim', 'Islak ortam', 'Enerji iletkenine temas', 'Sınırlı çalışma alanı'] },
                        ]},
                    ]},
                    { id: 'ag_topraklama', label: 'Topraklama & Paratoner', icon: 'electric_bolt', subPhases: [
                        { id: 's_ag2', label: 'Topraklama Sistemi', items: [
                            { id: id(), label: 'Topraklama elektrodu çakımı ve bağlantısı', itemType: 'is', hazards: ['Elektrik çarpması', 'Darbe yaralanması (tokmak)', 'Gürültü', 'Zemin hasar riski'] },
                            { id: id(), label: 'Topraklama hattı tespiti ve bağlantısı', itemType: 'is', hazards: ['Elektrik çarpması', 'Gevşek bağlantı – koruma kaybı'] },
                            { id: id(), label: 'Topraklama direnci ölçümü', itemType: 'faaliyet', hazards: ['Ölçüm hatası – yanlış değer', 'Elektrik çarpması (aktif sistemlerde)'] },
                            { id: id(), label: 'Paratoner ve indirici iletken montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Elektrik çarpması (yıldırım)', 'Ağır ekipman taşıma'] },
                            { id: id(), label: 'OBO / gerilim sınırlayıcı (SPD) montajı', itemType: 'is', hazards: ['Ark / kısa devre', 'Yanlış montaj – koruma yetersizliği'] },
                            { id: id(), label: 'Eşpotansiyel bara bağlantıları', itemType: 'is', hazards: ['Elektrik çarpması', 'Gevşek bağlantı yangını'] },
                            { id: id(), label: 'Topraklama ölçüm cihazı', itemType: 'ekipman', hazards: ['Kalibrasyon hatası', 'Cihaz arızası'] },
                            { id: id(), label: 'Açık alan topraklama çalışma yeri', itemType: 'ortam', hazards: ['Islak zemin – elektrik çarpması', 'Kör nokta kazısı', 'Yıldırım düşmesi (fırtınada çalışma)'] },
                        ]},
                    ]},
                    { id: 'ag_test', label: 'Test, Ölçüm & Devreye Alma', icon: 'electrical_services', subPhases: [
                        { id: 's_ag3', label: 'Devreye Alma', items: [
                            { id: id(), label: 'İzolasyon direnci ölçümü (Megohm testi)', itemType: 'faaliyet', hazards: ['Yüksek test voltajından elektrik çarpması', 'Cihaza bağlı kişinin şok yemesi'] },
                            { id: id(), label: 'Gerilim kontrolü ve faz sırası testi', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Yanlış faz sırası – motor hasarı'] },
                            { id: id(), label: 'Kaçak akım rölesi (RCCB/RCD) testi', itemType: 'faaliyet', hazards: ['Koruma eksikliğinin fark edilmemesi', 'Test hatası'] },
                            { id: id(), label: 'Kısa devre ve aşırı akım koruma ayarı', itemType: 'faaliyet', hazards: ['Yanlış ayar – koruma yetersizliği', 'Yangın / ark riski'] },
                            { id: id(), label: 'Yük dengesi ölçümü ve harmonik analizi', itemType: 'faaliyet', hazards: ['Aşırı yük – yangın', 'Harmonik kaynaklı ısınma'] },
                            { id: id(), label: 'İlk gerilim verme (enerji tatbiki)', itemType: 'faaliyet', hazards: ['Ark flash', 'Kısa devre', 'Yangın', 'Beklenmedik enerjilenme'] },
                            { id: id(), label: 'Dijital multimetre / klempe ampermetre', itemType: 'ekipman', hazards: ['Aşırı gerilimde cihaz patlaması', 'Probe teması – ark flash'] },
                            { id: id(), label: 'Enerjili pano önü çalışma alanı', itemType: 'ortam', hazards: ['Ark flash tehlike mesafesi', 'Islak zemin', 'Parlama – yanıcı yüzey'] },
                        ]},
                    ]},
                ]
            },
            {
                id: 'yg_hat', label: 'YG/OG Hat & Trafo', icon: 'transform', phases: [
                    { id: 'yg_bakim', label: 'Hat Bakım & LOTO', icon: 'settings', subPhases: [
                        { id: 's_yg1', label: 'Hat Bakım', items: [
                            { id: id(), label: 'Yüksek gerilim hat bakımı (hat üstü)', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark flaşı (arc flash)', 'Yüksekten düşme', 'İzole ekipman yetersizliği'] },
                            { id: id(), label: 'OG kablo muayenesi ve test', itemType: 'is', hazards: ['Elektrik çarpması', 'Yüksek test gerilimi', 'Kalıntı yük boşaltılmaması'] },
                            { id: id(), label: 'LOTO (kilit-etiket) uygulaması', itemType: 'faaliyet', hazards: ['Enerji serbest kalması', 'Yetersiz izolasyon', 'İletken temas', 'Birden fazla kilit yönetimi'] },
                            { id: id(), label: 'Topraklama ve kısa devre aparatı takılması', itemType: 'faaliyet', hazards: ['Kalıntı yük şoku', 'Hatalı sıralama', 'Düşen aparat'] },
                            { id: id(), label: 'Ark flash risk değerlendirmesi', itemType: 'faaliyet', hazards: ['Ark enerjisi hesaplama hatası', 'Yetersiz KKD seçimi'] },
                            { id: id(), label: 'İzole araç seti / dielektrik eldiven', itemType: 'ekipman', hazards: ['Yalıtım bütünlüğü kaybı', 'Hatalı kullanım', 'Bakımsız / süresi dolmuş ekipman'] },
                            { id: id(), label: 'Voltaj dedektörü / teması yoklama aleti', itemType: 'ekipman', hazards: ['Pil bitmesi – yanlış negatif', 'Kalibrasyon eksikliği'] },
                            { id: id(), label: 'Yüksek gerilim hattı yakını (gerilim altında)', itemType: 'ortam', hazards: ['İndükleme / ark atlaması', 'Güvenlik mesafesi ihlali', 'İletken sarkması'] },
                        ]},
                    ]},
                    { id: 'yg_trafo', label: 'Trafo & OG Hücre', icon: 'transform', subPhases: [
                        { id: 's_yg2', label: 'Trafo Bakımı', items: [
                            { id: id(), label: 'Trafo yağ numunesi alma ve analizi', itemType: 'is', hazards: ['Yağ yanığı', 'Elektrik çarpması (enerjili)', 'Yağ dökülmesi – kayma'] },
                            { id: id(), label: 'Trafo soğutma sistemi bakımı', itemType: 'is', hazards: ['Sıcak yüzey yanığı', 'Yoğun gürültü', 'Yüksek basınçlı yağ sıçraması'] },
                            { id: id(), label: 'OG hücre anahtarlaması (el ile)', itemType: 'faaliyet', hazards: ['Ark flash', 'Elektrik çarpması', 'Hatalı hücre anahtarlama'] },
                            { id: id(), label: 'Trafo yağ değişimi ve filtrasyonu', itemType: 'faaliyet', hazards: ['Yağ dökülmesi / yangın', 'Kimyasal (PCB ihtimali)', 'Sıcak yağ yanığı'] },
                            { id: id(), label: 'Güç kalite ölçümü ve analizi', itemType: 'faaliyet', hazards: ['Enerjili terminallere temas', 'Yanlış bağlantı – cihaz hasarı'] },
                            { id: id(), label: 'Kuru tip / yağlı trafo', itemType: 'ekipman', hazards: ['Aşırı ısınma – yangın', 'Yüksek gerilim yüzeyleri', 'Sızıntı / çevre kirlilik'] },
                            { id: id(), label: 'OG ring-main unit (RMU) / kesici hücre', itemType: 'ekipman', hazards: ['Ark flash', 'Hatalı kilit müdahalesi', 'SF6 gaz sızıntısı'] },
                            { id: id(), label: 'Trafo odası / elektrik binası', itemType: 'ortam', hazards: ['Dar alan', 'Yetersiz havalandırma (ısı)', 'Yüksek gerilim yüzeyleri', 'Yetkisiz erişim'] },
                        ]},
                    ]},
                    { id: 'yg_direk', label: 'Direk & Hat Montajı', icon: 'settings_input_antenna', subPhases: [
                        { id: 's_yg3', label: 'Hat Yapımı', items: [
                            { id: id(), label: 'Beton direk / çelik direk dikimi', itemType: 'is', hazards: ['Direk devrilmesi', 'Ezilme', 'Ağır yük taşıma yaralanması', 'İş makinesi çarpması'] },
                            { id: id(), label: 'İletken germe ve sabitme (hatçekme)', itemType: 'is', hazards: ['İletken kopması / geri tepmesi', 'Yüksekten düşme', 'Gerilim altındaki hatta temas'] },
                            { id: id(), label: 'Yüksekte çalışma (direk üstü)', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'Korkuluksuz platform', 'Emniyet kemeri eksikliği'] },
                            { id: id(), label: 'Travers ve izolatör montajı', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'Düşen ekipman çarpması'] },
                            { id: id(), label: 'Montaj sepeti / platform araç (MEWP)', itemType: 'ekipman', hazards: ['Devrilme', 'Trafik çarpması', 'Zemin stabilitesi', 'Yüksekte asılı kalma'] },
                            { id: id(), label: 'Taşıma vinci / iletken makarası', itemType: 'ekipman', hazards: ['Yük düşmesi', 'Kanca/halat arızası', 'Makara kopması'] },
                            { id: id(), label: 'Hat güzergahı açık alan / tarla / kent içi', itemType: 'ortam', hazards: ['Trafik / araç riski', 'Mevcut enerji hatları yakınlığı', 'Rüzgar – yüksekte çalışma', 'Halk erişimi'] },
                        ]},
                    ]},
                ]
            },
            {
                id: 'aydinlatma', label: 'Aydınlatma Tesisatı', icon: 'light_mode', phases: [
                    { id: 'ay_montaj', label: 'Armatür Montajı', icon: 'light', subPhases: [
                        { id: 's_ay1', label: 'Armatür & Direk', items: [
                            { id: id(), label: 'İç mekan aydınlatma armatürü montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Elektrik çarpması', 'Cam kırılması', 'Ağır armatür düşmesi'] },
                            { id: id(), label: 'Endüstriyel yüksek tavan armatür montajı', itemType: 'is', hazards: ['Yüksekten düşme (7m+ tavan)', 'Ağır armatür düşmesi', 'Kafa yaralanması'] },
                            { id: id(), label: 'Sokak / park lambası direk montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Ağır ekipman taşıma', 'Trafik riski', 'Direk devrilmesi'] },
                            { id: id(), label: 'LED panel / spot değişimi', itemType: 'is', hazards: ['Elektrik çarpması', 'Yüksekten düşme (merdiven)', 'Cam / parça fırlaması'] },
                            { id: id(), label: 'Aydınlatma kontrol ve dimmer montajı', itemType: 'is', hazards: ['Elektrik çarpması', 'Yanlış bağlantı – kısa devre'] },
                            { id: id(), label: 'Platform merdiven / teleskopik merdiven', itemType: 'ekipman', hazards: ['Devrilme', 'Aşırı yük', 'Zemin stabilitesi', 'Düşme'] },
                            { id: id(), label: 'Makaslı platform (scissor lift)', itemType: 'ekipman', hazards: ['Platform devrilmesi', 'Zemin yükü aşımı', 'Sıkışma'] },
                        ]},
                    ]},
                    { id: 'ay_acil', label: 'Acil & Güvenlik Aydınlatması', icon: 'emergency', subPhases: [
                        { id: 's_ay2', label: 'Acil Aydınlatma', items: [
                            { id: id(), label: 'Acil aydınlatma armatürü montajı', itemType: 'is', hazards: ['Elektrik çarpması', 'Yüksekten düşme', 'Bağlantı hatası – acil durumda arıza'] },
                            { id: id(), label: 'Yönlendirme levhası (EXIT) montajı', itemType: 'is', hazards: ['Yüksekten düşme', 'Elektrik çarpması', 'Hatalı yerleşim – tahliye engeli'] },
                            { id: id(), label: 'Acil aydınlatma test ve bakımı', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Arıza tespit edilmemesi – yasal yaptırım'] },
                            { id: id(), label: 'UPS / akü sistemi test ve değişimi', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Asit sıçraması (kurşun akü)', 'Termal kaçma – yangın'] },
                            { id: id(), label: 'Patlama korumalı (Ex) armatür montajı', itemType: 'is', hazards: ['Tehlikeli alan kuralı ihlali', 'Elektrik çarpması', 'Kıvılcım – patlama'] },
                            { id: id(), label: 'Akü / UPS paketi', itemType: 'ekipman', hazards: ['Asit sıçraması', 'Termal kaçma', 'Ağır yük taşıma'] },
                            { id: id(), label: 'Acil çıkış koridoru ve tahliye yolu', itemType: 'ortam', hazards: ['Geçici engel', 'Yetersiz aydınlatma seviyesi', 'Kaçış yolu tıkanıklığı'] },
                        ]},
                    ]},
                    { id: 'ay_dis', label: 'Dış Mekan & Endüstriyel Aydınlatma', icon: 'outdoor_grill', subPhases: [
                        { id: 's_ay3', label: 'Dış Mekan', items: [
                            { id: id(), label: 'Trafik ışığı / sinyalizasyon kurulumu', itemType: 'is', hazards: ['Trafik riski', 'Elektrik çarpması', 'Yüksekten düşme'] },
                            { id: id(), label: 'Otopak / stadyum aydınlatma direkleri', itemType: 'is', hazards: ['Yüksek direk çalışması', 'Devrilme', 'Ağır yük taşıma'] },
                            { id: id(), label: 'Solar panel aydınlatma sistemi kurulumu', itemType: 'is', hazards: ['Elektrik çarpması (DC yüksek akım)', 'Yüksekten düşme', 'UV maruziyeti'] },
                            { id: id(), label: 'Aydınlatma kablo yeraltı döşemesi', itemType: 'is', hazards: ['Kazı – yeraltı hattına çarpma', 'Elektrik çarpması', 'Trafik riski'] },
                            { id: id(), label: 'Çalışma sahası aydınlatma (şantiye spot)', itemType: 'ekipman', hazards: ['Elektrik çarpması (geçici tesisat)', 'Devrilme', 'Hava koşullarına maruz kalma'] },
                            { id: id(), label: 'Taşımalı jeneratör ve geçici besleme', itemType: 'ekipman', hazards: ['CO gazı zehirlenmesi', 'Yakıt dökülmesi – yangın', 'Elektrik çarpması'] },
                            { id: id(), label: 'Dış mekan – hava koşulları ve ıslak zemin', itemType: 'ortam', hazards: ['Islak/buzlu zeminde düşme', 'Yıldırım riski', 'Rüzgar – yüksekte çalışma'] },
                        ]},
                    ]},
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
                    { id: 'mi_kesme', label: 'Tezgah Kesme & Şekillendirme', icon: 'cut', subPhases: [
                        { id: 's_mi1', label: 'Tezgah İşlemleri', items: [
                            { id: id(), label: 'Torna tezgahı operasyonu', itemType: 'is', hazards: ['Dönen parça sıkışması', 'Talaş fırlaması', 'Gürültü', 'Titreşim', 'Soğutucu sıvı sıçraması'] },
                            { id: id(), label: 'Freze tezgahı operasyonu', itemType: 'is', hazards: ['Dönen freze çarpması', 'Talaş fırlaması', 'Ekipman gürültüsü', 'Vibrasyon'] },
                            { id: id(), label: 'CNC işleme merkezi operasyonu', itemType: 'is', hazards: ['Programlama hatası – beklenmedik hareket', 'Talaş fırlaması', 'Kapı açık çalışma riski'] },
                            { id: id(), label: 'Matkap tezgahı ile delme', itemType: 'is', hazards: ['El/parmak dönen aksama teması', 'Talaş fırlaması', 'Parça fırlama (kötü tutturma)'] },
                            { id: id(), label: 'Metal şerit testere kullanımı', itemType: 'is', hazards: ['Kesici bıçak yaralanması', 'Gürültü', 'Parça fırlaması'] },
                            { id: id(), label: 'Taşlama / bileme işlemi', itemType: 'is', hazards: ['Disk kırılması / fırlaması', 'Kıvılcım yangını', 'Göz tahrişi', 'Gürültü', 'Vibrasyon'] },
                            { id: id(), label: 'Metal levha bükme (abkant pres)', itemType: 'is', hazards: ['El/parmak sıkışması', 'Keskin kenar yaralanması', 'Ağır malzeme tutma zorlanması'] },
                            { id: id(), label: 'CNC tezgah / işleme merkezi', itemType: 'ekipman', hazards: ['Hareket sensörü arızası', 'Programlama hatası', 'Dönen aks sıkışma', 'Koruyucu kapı bypass'] },
                            { id: id(), label: 'Metal işleme atölyesi zemini', itemType: 'ortam', hazards: ['Kesici talaş zemininde kayma', 'Gürültü maruziyeti', 'Yağ/soğutucu sıvı kayması'] },
                        ]},
                    ]},
                    { id: 'mi_kaynak', label: 'Kaynak & Termal Kesme', icon: 'local_fire_department', subPhases: [
                        { id: 's_mi2', label: 'Kaynak İşlemleri', items: [
                            { id: id(), label: 'MIG (GMAW) kaynağı', itemType: 'is', hazards: ['UV/kızılötesi radyasyon', 'Kaynak dumanı soluma', 'Yangın/yanık', 'Elektrik çarpması', 'Gürültü'] },
                            { id: id(), label: 'TIG (GTAW) kaynağı', itemType: 'is', hazards: ['UV/kızılötesi radyasyon', 'Tungsten tozu soluma', 'Elektrik çarpması', 'Yanık'] },
                            { id: id(), label: 'Örtülü elektrot kaynağı (elektrik ark)', itemType: 'is', hazards: ['Elektrik çarpması', 'UV/kızılötesi radyasyon', 'Kaynak dumanı soluma', 'Yangın'] },
                            { id: id(), label: 'Oksi-asetilen kaynağı ve kesimi', itemType: 'is', hazards: ['Tüp patlaması', 'Gaz sızıntısı', 'Yangın', 'Geri tepmeli alev', 'Kızgın metal yanığı'] },
                            { id: id(), label: 'Plazma kesme', itemType: 'is', hazards: ['UV radyasyon', 'Kızgın metal fırlaması', 'Duman soluma', 'Gürültü', 'Elektrik çarpması'] },
                            { id: id(), label: 'Kaynak dumanı ve havalandırma yönetimi', itemType: 'faaliyet', hazards: ['Kronik kaynak dumanı hastalığı', 'Mangan/krom maruziyeti', 'LEV eksikliği'] },
                            { id: id(), label: 'Kaynak makinesi (inverter/transformatör)', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Aşırı ısınma', 'Topraklama eksikliği'] },
                            { id: id(), label: 'Basınçlı gaz tüpleri (Ar, CO2, O2, C2H2)', itemType: 'ekipman', hazards: ['Tüp devrilmesi', 'Gaz sızıntısı', 'Patlama'] },
                            { id: id(), label: 'Kaynak atölyesi ve çalışma bölgesi', itemType: 'ortam', hazards: ['Yanıcı materyal yakınlığı', 'Yetersiz havalandırma', 'UV radyasyon – ikincil maruziyet'] },
                        ]},
                    ]},
                    { id: 'mi_yuzey', label: 'Yüzey İşleme & Kaplama', icon: 'format_paint', subPhases: [
                        { id: 's_mi3', label: 'Boya & Kaplama', items: [
                            { id: id(), label: 'Kum / shot blasting (yüzey temizleme)', itemType: 'is', hazards: ['Toz/solunabilir partiküller', 'Gürültü', 'Göz yaralanması', 'Sıçrayan partiküller'] },
                            { id: id(), label: 'Solvent bazlı boya uygulaması (airless / tabanca)', itemType: 'is', hazards: ['Solvent buharı soluma', 'Yangın/patlama', 'Cilt/göz teması', 'Yüksek basınç yaralanması'] },
                            { id: id(), label: 'Toz boya & fırın kaplama', itemType: 'is', hazards: ['Toz patlaması', 'Toz soluma', 'Fırın yanığı (sıcak yüzey)', 'Elektrostatik risk'] },
                            { id: id(), label: 'Asit/alkali yüzey işleme (dağlama/temizleme)', itemType: 'is', hazards: ['Kimyasal yanık (cilt/göz)', 'Asit buharı soluma', 'Döküntü yaralanması'] },
                            { id: id(), label: 'Galvaniz (sıcak daldırma)', itemType: 'is', hazards: ['Sıcak çinko sıçraması', 'Asit/alkali buhar soluma', 'Yüksek ısı ortamı'] },
                            { id: id(), label: 'Boyahane / boya kabini', itemType: 'ortam', hazards: ['Patlayıcı atmosfer', 'Yetersiz havalandırma', 'Yangın – statik kıvılcım'] },
                        ]},
                    ]},
                    { id: 'mi_loto', label: 'Makine Bakımı & LOTO', icon: 'build', subPhases: [
                        { id: 's_mi4', label: 'Bakım & Enerji İzolasyonu', items: [
                            { id: id(), label: 'CNC / tezgah planlı bakımı', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Elektrik çarpması', 'Yağ kayması'] },
                            { id: id(), label: 'LOTO (kilit-etiket) uygulaması', itemType: 'faaliyet', hazards: ['Prosedür atlanması', 'Beklenmedik çalıştırma', 'Çoklu enerji kaynağı gözden kaçırması'] },
                            { id: id(), label: 'Hidrolik sistem bakımı', itemType: 'faaliyet', hazards: ['Yüksek basınçlı yağ enjeksiyonu', 'Basınç altı arıza', 'Yangın'] },
                            { id: id(), label: 'Pnömatik sistem bakımı', itemType: 'faaliyet', hazards: ['Ani hareket (basınç altında)', 'Gürültü', 'Parça fırlaması'] },
                            { id: id(), label: 'Kesici takım (bıçak/freze biti) değişimi', itemType: 'faaliyet', hazards: ['Kesici alet yaralanması', 'Beklenmedik enerjilenme', 'Elle sıkışma'] },
                            { id: id(), label: 'Bakım alanı ve tezgah arası', itemType: 'ortam', hazards: ['Yağ/soğutucu kayması', 'Kesici talaş zemini', 'Aydınlatma yetersizliği'] },
                        ]},
                    ]},
                ]
            },
            {
                id: 'pres_stampa', label: 'Pres & Damgalama', icon: 'compress', phases: [
                    { id: 'pr_calisme', label: 'Pres Operasyonu', icon: 'compress', subPhases: [
                        { id: 's_pr1', label: 'Pres İşlemleri', items: [
                            { id: id(), label: 'Mekanik pres operasyonu', itemType: 'is', hazards: ['El-parmak sıkışması', 'Kalıp çarpması', 'Parça fırlaması', 'İki el kontrol eksikliği'] },
                            { id: id(), label: 'Hidrolik pres operasyonu', itemType: 'is', hazards: ['El-parmak ezilmesi', 'Yüksek basınçlı yağ enjeksiyonu', 'Kalıp düşmesi'] },
                            { id: id(), label: 'Pnömatik zımba / delme makinesi', itemType: 'is', hazards: ['Ani delik açılması', 'Parça fırlaması', 'El/parmak sıkışması'] },
                            { id: id(), label: 'Derin çekme (deep drawing) operasyonu', itemType: 'is', hazards: ['Kalıp kenar keskin köşesi', 'Parça fırlaması', 'Yüksek kuvvet – ekipman arızası'] },
                            { id: id(), label: 'Levha besleme ve yerleştirme', itemType: 'faaliyet', hazards: ['Keskin kenar yaralanması', 'Elle taşıma zorlanması', 'Pres çevrim süresi güvenlik hatası'] },
                            { id: id(), label: 'Kalıp değişimi', itemType: 'faaliyet', hazards: ['Ağır kalıp düşmesi', 'Sıkışma', 'LOTO uygulaması eksikliği', 'Vinç/caraskal arızası'] },
                            { id: id(), label: 'Hurda parça boşaltma', itemType: 'faaliyet', hazards: ['Keskin kenar kesme yaralanması', 'Fırlayan parça', 'Ergonomik zorlanma'] },
                            { id: id(), label: 'Mekanik / hidrolik pres', itemType: 'ekipman', hazards: ['Çift vuruş (double stroke)', 'Frenleme sistemi yetersizliği', 'Koruma kapağı / sensor bypass'] },
                            { id: id(), label: 'Pres hücresi çalışma alanı', itemType: 'ortam', hazards: ['Gürültü', 'Yağ/soğutucu sıvı kayması', 'Metal talaş ve keskin parça zemininde kayma'] },
                        ]},
                    ]},
                    { id: 'pr_otomasyon', label: 'Otomasyonlu Hat & Robot', icon: 'smart_toy', subPhases: [
                        { id: 's_pr2', label: 'Robot & Otomasyon', items: [
                            { id: id(), label: 'Damgalama robotu ile çalışma', itemType: 'faaliyet', hazards: ['Beklenmedik robot hareketi', 'Hücre sınırı ihlali', 'Programlama hatası'] },
                            { id: id(), label: 'Transfer bandı ve konveyör ile malzeme besleme', itemType: 'faaliyet', hazards: ['Sıkışma/ezilme', 'Dönen band teması', 'Takılma düşmesi'] },
                            { id: id(), label: 'Güvenlik hücresi (ışık perdesi / bariyer)', itemType: 'ekipman', hazards: ['Güvenlik sensörü bypass', 'Sensör arızası', 'Hücreye yetkisiz giriş'] },
                            { id: id(), label: 'Endüstriyel robot (kaynak/besleme/taşıma)', itemType: 'ekipman', hazards: ['Beklenmedik hareket', 'Programlama hatası', 'Aşırı yük'] },
                            { id: id(), label: 'Robot hücresi çalışma alanı', itemType: 'ortam', hazards: ['Kör nokta', 'Sıkışma', 'Yetersiz güvenlik uzaklığı'] },
                        ]},
                    ]},
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
                    { id: 'di_istifleme', label: 'Yükleme, Boşaltma & İstifleme', icon: 'stacked_bar_chart', subPhases: [
                        { id: 's_di1', label: 'Forklift & Raf', items: [
                            { id: id(), label: 'Forklift ile palet yükleme / boşaltma', itemType: 'faaliyet', hazards: ['Forklift–yaya çarpması', 'Yük düşmesi', 'Devrilme', 'Görüş kısıtı', 'LPG kaçağı'] },
                            { id: id(), label: 'Elektrikli istif makinesi (reach truck)', itemType: 'faaliyet', hazards: ['Yüksek rafta istif devrilmesi', 'Kör nokta çarpması', 'Batarya kayması'] },
                            { id: id(), label: 'Raf sistemine yüksek istif (4m+)', itemType: 'is', hazards: ['Raf devrilmesi', 'Düşen ürün/palet', 'Yüksekten düşme (pick platformu)', 'Dengesiz yük'] },
                            { id: id(), label: 'Palet sarma ve ambalajlama', itemType: 'faaliyet', hazards: ['Tekrarlayan hareket kas-iskelet', 'Streç film takılması', 'Palet devrilmesi'] },
                            { id: id(), label: 'Forklift (LPG/elektrik)', itemType: 'ekipman', hazards: ['Devrilme', 'Geri manevra çarpması', 'LPG gaz kaçağı', 'Şarj istasyonu akü riski'] },
                            { id: id(), label: 'Yüksek raf / kantilevr raf sistemi', itemType: 'ekipman', hazards: ['Raf çökmesi', 'Düşen yük', 'Raf koruyucu eksikliği'] },
                            { id: id(), label: 'Depo koridoru (yaya–araç karışık)', itemType: 'ortam', hazards: ['Forklift–yaya koridoru çakışması', 'Dar geçiş', 'Görüş engeli', 'Zemin hasarı'] },
                        ]},
                    ]},
                    { id: 'di_tasima', label: 'Manuel Taşıma & Ergonomi', icon: 'pan_tool', subPhases: [
                        { id: 's_di2', label: 'Elle Taşıma', items: [
                            { id: id(), label: 'Ağır yük kaldırma (25 kg+)', itemType: 'is', hazards: ['Bel/omurga yaralanması', 'Kas zorlanması', 'Yük düşmesi', 'Yanlış kaldırma tekniği'] },
                            { id: id(), label: 'El arabası / transpalet kullanımı', itemType: 'faaliyet', hazards: ['Rampa devrilmesi', 'Yük kayması', 'El/ayak ezilmesi', 'Eğimde kontrol kaybı'] },
                            { id: id(), label: 'Konveyör bant ile malzeme taşıma', itemType: 'faaliyet', hazards: ['Sıkışma/ezilme (döner kısımlar)', 'Düşen yük', 'Gürültü'] },
                            { id: id(), label: 'Sırt çantası / raf pick operasyonu', itemType: 'faaliyet', hazards: ['Ergonomik zorlanma', 'Tekrarlayan eğilme', 'Dengesiz zemin düşmesi'] },
                            { id: id(), label: 'Çekme-itme hareketleri (trolley, kasa)', itemType: 'is', hazards: ['Omuz/bel yorgunluğu', 'Parmak/el sıkışması', 'Zemin engeline çarpmak'] },
                        ]},
                    ]},
                    { id: 'di_yukleme', label: 'Yükleme Rampası & Araç', icon: 'local_shipping', subPhases: [
                        { id: 's_di3', label: 'Araç Yükleme', items: [
                            { id: id(), label: 'TIR / kamyon rampasından araç yüklemesi', itemType: 'faaliyet', hazards: ['Araç hareketi – forklift düşmesi', 'Rampa kaymesi', 'Yük devrilmesi'] },
                            { id: id(), label: 'Dock leveller (köprü plaka) kullanımı', itemType: 'faaliyet', hazards: ['Köprü plaka devrilmesi', 'El/ayak sıkışması', 'Araç hareketi – plaka düşmesi'] },
                            { id: id(), label: 'Araç içi paket istifi', itemType: 'is', hazards: ['Düşen yük', 'Sınırlı alan kas-iskelet zorlanması', 'Araç hareketi riski'] },
                            { id: id(), label: 'Soğuk zincir (dondurucu araç) yükleme', itemType: 'faaliyet', hazards: ['Hipotermi / soğuk ortam', 'Buzlu zemin', 'Soğutucu gaz kaçağı'] },
                            { id: id(), label: 'Yükleme rampası ve açık platform', itemType: 'ortam', hazards: ['Yüksekten düşme (rampa kenarı)', 'Islak/buzlu zemin', 'Araç çarpması'] },
                        ]},
                    ]},
                    { id: 'di_tehlikeli', label: 'Tehlikeli Madde Depolama', icon: 'warning', subPhases: [
                        { id: 's_di4', label: 'ADR & Kimyasal Depo', items: [
                            { id: id(), label: 'Kimyasal madde depolama ve segregasyon', itemType: 'faaliyet', hazards: ['Reaktif kimyasal karışımı', 'Yangın/patlama', 'Dökülme – maruziyet'] },
                            { id: id(), label: 'ADR ürün yükleme/boşaltma', itemType: 'faaliyet', hazards: ['Tehlikeli madde dökülmesi', 'Yangın/patlama', 'Yetersiz etiketleme'] },
                            { id: id(), label: 'LPG tüp / gaz tüpü depolama', itemType: 'ortam', hazards: ['Gaz sızıntısı – patlama', 'Yangın', 'Tüp devrilmesi', 'Basınç farkı'] },
                            { id: id(), label: 'Kimyasal depo alanı (kapalı)', itemType: 'ortam', hazards: ['Duman birikimi', 'Yangın', 'Kimyasal maruziyet', 'Statik elektrik'] },
                        ]},
                    ]},
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
                    { id: 'dh_montaj', label: 'Hat Montajı & Kaynak', icon: 'plumbing', subPhases: [
                        { id: 's_dh1', label: 'Boru Montajı', items: [
                            { id: id(), label: 'Çelik doğalgaz borusu döşeme ve kaynağı', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlama/yangın', 'Kaynak sıçraması (yangın)', 'Elektrik çarpması', 'Yetersiz havalandırma'] },
                            { id: id(), label: 'PE boru füzyon kaynağı (alın/elektrofüzyon)', itemType: 'is', hazards: ['Sıcak plaka yanığı', 'Hatalı kaynak – gaz sızıntısı', 'Kaynak kusuru gerilimine boru patlaması'] },
                            { id: id(), label: 'Hat hendek kazısı ve boru indirme', itemType: 'is', hazards: ['Hendek çökmesi', 'Boru düşmesi/ezilme', 'Zemin altı hat hasarı', 'Personel düşmesi'] },
                            { id: id(), label: 'Flanş bağlantısı ve fitings montajı', itemType: 'is', hazards: ['Basınç altı bağlantı açılması', 'Gaz kaçağı', 'Sıkışma/ezilme'] },
                            { id: id(), label: 'Vana montajı ve ayarı', itemType: 'is', hazards: ['Gaz sızıntısı', 'Basınç farkı yaralanması', 'Yanlış vana yönü'] },
                            { id: id(), label: 'Gaz kaçak testi (basınç testi)', itemType: 'faaliyet', hazards: ['Basınç testi patlaması', 'Gaz birikimi/tutuşma', 'Alev geri tepme'] },
                            { id: id(), label: 'Hat işaretleme ve markalama', itemType: 'faaliyet', hazards: ['Üçüncü taraf kazısında hat hasarı', 'İşaret eksikliği yasal uyumsuzluk'] },
                            { id: id(), label: 'Portatif gaz dedektörü', itemType: 'ekipman', hazards: ['Arıza – yanlış negatif', 'Kalibrasyon eksikliği', 'Pil bitmesi'] },
                            { id: id(), label: 'Doğalgaz hattı güzergahı (kazı alanı)', itemType: 'ortam', hazards: ['Patlayıcı atmosfer', 'Yeraltı hat hasarı', 'Hava akımı gaz biriktirme', 'Yetersiz işaretleme'] },
                        ]},
                    ]},
                    { id: 'dh_regulator', label: 'Regülatör & İstasyon', icon: 'water_pump', subPhases: [
                        { id: 's_dh2', label: 'Basınç Düşürme', items: [
                            { id: id(), label: 'Bölge regülatörü bakımı ve ayarı', itemType: 'faaliyet', hazards: ['Gaz kaçağı', 'Basınç aşımı', 'Yanlış ayar – müşteri basınç hasarı'] },
                            { id: id(), label: 'Güvenlik valfi (emniyet valfi) testi', itemType: 'faaliyet', hazards: ['Valf açılamama – aşırı basınç', 'Gaz salınımı'] },
                            { id: id(), label: 'Filtre temizleme ve değişimi', itemType: 'faaliyet', hazards: ['Gaz çıkışı – maruziyet/tutuşma', 'Basınç altı müdahale'] },
                            { id: id(), label: 'Sayaç okuma ve değişimi', itemType: 'faaliyet', hazards: ['Gaz sızıntısı', 'Statik elektrik kıvılcımı'] },
                            { id: id(), label: 'İstasyon kapalı alan (kuyu/kabin)', itemType: 'ortam', hazards: ['Kapalı alan gaz birikimi', 'Oksijen yetersizliği', 'Alev geçirmez ekipman gerekliliği'] },
                        ]},
                    ]},
                    { id: 'dh_acil', label: 'Gaz Kaçağı & Acil Müdahale', icon: 'emergency', subPhases: [
                        { id: 's_dh3', label: 'Acil Müdahale', items: [
                            { id: id(), label: 'Gaz ihbar değerlendirmesi ve saha teyidi', itemType: 'faaliyet', hazards: ['Gaz ortamına yetersiz hazırlıkla giriş', 'Patlama/yangın riski', 'Ateşleme kaynakları'] },
                            { id: id(), label: 'Gaz kaçağı tespiti (elektronik/köpük)', itemType: 'faaliyet', hazards: ['Elektrostatik kıvılcım', 'Açık alev kullanımı', 'Maruziyet'] },
                            { id: id(), label: 'Acil hat kapatma (vana)', itemType: 'faaliyet', hazards: ['Vana açılmama / sıkışma', 'Gaz basınç darbesi', 'Yanlış vana anahtarlama'] },
                            { id: id(), label: 'Bölge tahliyesi ve koordinasyonu', itemType: 'faaliyet', hazards: ['Yetersiz tahliye radius', 'Koordinasyon eksikliği', 'İgnition source kontrolsüzlüğü'] },
                            { id: id(), label: 'Acil müdahale ekipmanı (SCBA, gaz dedektörü)', itemType: 'ekipman', hazards: ['SCBA tüp boşalması', 'Maske uyumsuzluğu', 'Dedektör arızası'] },
                            { id: id(), label: 'Gaz kaçağı alanı (şehir içi)', itemType: 'ortam', hazards: ['Gaz birikimi / patlama', 'Trafik tehlikesi', 'Kamuoyuna maruziyet', 'Lağım sistemine gaz göçü'] },
                        ]},
                    ]},
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
                    { id: 'gt_islak', label: 'Zemin & Kimyasal Temizlik', icon: 'water_drop', subPhases: [
                        { id: 's_gt1', label: 'Zemin Temizliği', items: [
                            { id: id(), label: 'Kimyasal deterjan ile zemin yıkama', itemType: 'faaliyet', hazards: ['Kaygan zemin', 'Kimyasal cilt/göz tahrişi', 'Elektrik–su teması', 'Kayma düşmesi'] },
                            { id: id(), label: 'Yüksek basınçlı su ile zemin yıkama (jet wash)', itemType: 'faaliyet', hazards: ['Su basınç yaralanması', 'Elektrik çarpması', 'Islak zemin düşmesi'] },
                            { id: id(), label: 'Endüstriyel zemin temizleme makinesi', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Gürültü', 'Elektrostatik şarj'] },
                            { id: id(), label: 'Toz emici / süpürge (HEPA filtreli)', itemType: 'ekipman', hazards: ['Toz soluma (filtre bypass)', 'Elektrik çarpması', 'Gürültü'] },
                            { id: id(), label: 'Islak/ıslak temizlenmiş zemin', itemType: 'ortam', hazards: ['Kayarak düşme', 'Uyarı levhası eksikliği', 'Elektrik tehlikesi'] },
                        ]},
                    ]},
                    { id: 'gt_yuksek', label: 'Yüksek Nokta Temizliği', icon: 'cleaning_services', subPhases: [
                        { id: 's_gt2', label: 'Yüksekte Temizlik', items: [
                            { id: id(), label: 'Cam / pencere yüksek nokta temizliği', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'İskele/merdiven devrilmesi', 'Kimyasal soluma'] },
                            { id: id(), label: 'Tavan ve alışveriş merkezi atrium temizliği', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'Aşağıya düşen ıslak bez/ekipman', 'Kalabalık alan tehlikesi'] },
                            { id: id(), label: 'Yüksek raf ve dolap üstü temizliği', itemType: 'is', hazards: ['Dengesiz merdiven', 'Raf devrilmesi', 'Düşen yük çarpması'] },
                            { id: id(), label: 'Havalandırma kanalı ve klima iç temizliği', itemType: 'is', hazards: ['Kapalı alan tehlikesi', 'Biyolojik (küf/bakteri)', 'Toz soluma'] },
                            { id: id(), label: 'Aluminyum teleskopik merdiven', itemType: 'ekipman', hazards: ['Devrilme', 'Aşırı yük', 'Kaygan ayak'] },
                            { id: id(), label: 'Makaslı yükseltici (scissor lift)', itemType: 'ekipman', hazards: ['Devrilme', 'Platform kenara çarpma', 'Zemin yükü aşımı'] },
                        ]},
                    ]},
                    { id: 'gt_kimyasal', label: 'Kimyasal & Dezenfeksiyon', icon: 'science', subPhases: [
                        { id: 's_gt3', label: 'Dezenfektan & Sanitasyon', items: [
                            { id: id(), label: 'Kuvvetli asit/alkali temizleyici kullanımı', itemType: 'faaliyet', hazards: ['Kimyasal yanık (cilt/göz)', 'Duman soluma', 'Reaktif karışım'] },
                            { id: id(), label: 'Klor bazlı dezenfektan ile yüzey dezenfeksiyonu', itemType: 'faaliyet', hazards: ['Klorin gazı soluma', 'Göz tahrişi', 'Uyumsuz kimyasal karışımı'] },
                            { id: id(), label: 'Endüstriyel buhar jeti dezenfeksiyon', itemType: 'faaliyet', hazards: ['Yüksek basınçlı buhar yanığı', 'Elektrik çarpması', 'Neme bağlı kayma'] },
                            { id: id(), label: 'Gıda işletmesi CIP (temizleme yerinde) prosesi', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Basınçlı sıvı yaralanması', 'Sıcak sıvı yanığı'] },
                            { id: id(), label: 'Kimyasal dozaj ve karıştırma', itemType: 'faaliyet', hazards: ['Kimyasal sıçraması', 'Hatalı konsantrasyon', 'Reaktif karışım'] },
                            { id: id(), label: 'Kimyasal depolama ve dispensing alanı', itemType: 'ortam', hazards: ['Duman birikimi', 'Dökülme', 'Yangın riski', 'Yetersiz SDS bilgisi'] },
                        ]},
                    ]},
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
                    { id: 'hb_biyolojik', label: 'Biyolojik Risk & Hijyen', icon: 'coronavirus', subPhases: [
                        { id: 's_hb1', label: 'Biyolojik Tehlikeler', items: [
                            { id: id(), label: 'Kan/vücut sıvısıyla temas gerektiren işlem', itemType: 'is', hazards: ['Kan yoluyla bulaşan enfeksiyon (HIV, HBV, HCV)', 'Kesici-delici alet batması', 'Deri/mukoza teması'] },
                            { id: id(), label: 'Tıbbi atık toplama ve taşıma', itemType: 'faaliyet', hazards: ['Tıbbi atık batması/yaralanması', 'Enfeksiyon riski', 'Uygunsuz ambalajlama', 'Sızıntı'] },
                            { id: id(), label: 'Steril alan hazırlama ve sterilizasyon', itemType: 'faaliyet', hazards: ['Kimyasal dezenfektan maruziyeti', 'Otoklavdan yüksek sıcaklık yanığı', 'Yanlış sterilizasyon protokolü'] },
                            { id: id(), label: 'İzolasyon odası (MRSA/TB) bakımı', itemType: 'faaliyet', hazards: ['Hava yoluyla patojen bulaşması', 'Yetersiz KKD', 'Havalandırma açığı'] },
                            { id: id(), label: 'Enjektör / iğne / neşter kullanımı', itemType: 'ekipman', hazards: ['İğne batması', 'Kan yoluyla enfeksiyon', 'Güvenli bertaraf eksikliği'] },
                            { id: id(), label: 'Hasta odası / klinik ortam', itemType: 'ortam', hazards: ['Biyolojik aerosol', 'Çoklu ilaç dirençli patojen (MDRO)', 'Yetersiz havalandırma'] },
                        ]},
                    ]},
                    { id: 'hb_radyoloji', label: 'Radyoloji & Görüntüleme', icon: 'radiology', subPhases: [
                        { id: 's_hb2', label: 'Radyasyon Güvenliği', items: [
                            { id: id(), label: 'Röntgen / BT çekimi', itemType: 'faaliyet', hazards: ['İyonize radyasyon maruziyeti', 'Kümülatif doz aşımı', 'Gebe çalışan riski'] },
                            { id: id(), label: 'MRI çalışma ortamı', itemType: 'ortam', hazards: ['Ferromanyetik cisim çekimi (ölümcül)', 'Gürültü', 'Manyetik alan implant hasarı'] },
                            { id: id(), label: 'Radyonüklid (nükleer tıp) kullanımı', itemType: 'faaliyet', hazards: ['İyonize radyasyon maruziyeti', 'Kontaminasyon yayılması', 'Atık yönetimi riski'] },
                            { id: id(), label: 'Dozimetre takibi ve radyasyon izleme', itemType: 'faaliyet', hazards: ['Doz limit aşımı tespit gecikmesi', 'Dozimetre kaybolması'] },
                            { id: id(), label: 'Kurşun koruyucu (apron/cam)', itemType: 'ekipman', hazards: ['Yıpranmış kurşun apron – koruma kaybı', 'Ağır apron kas-iskelet zorlanması'] },
                            { id: id(), label: 'Radyoloji odası (kurşun duvar)', itemType: 'ortam', hazards: ['Yetersiz kurşun kalınlığı', 'Ikincil saçılım', 'Kapı açık çekim'] },
                        ]},
                    ]},
                    { id: 'hb_tibbi_gaz', label: 'Tıbbi Gaz & İlaç', icon: 'medical_services', subPhases: [
                        { id: 's_hb3', label: 'Tıbbi Gaz Sistemleri', items: [
                            { id: id(), label: 'Tıbbi oksijen hattı bakımı', itemType: 'faaliyet', hazards: ['Aşırı oksijen ortamı – yangın', 'Basınçlı gaz bağlantı açılması'] },
                            { id: id(), label: 'N2O (nitrös oksit) kullanımı', itemType: 'faaliyet', hazards: ['Bilinç kaybı', 'Baş ağrısı/çeşitli nörolojik etki', 'Kronik maruziyet'] },
                            { id: id(), label: 'Tıbbi tüp (O2/N2) boşaltma ve değişimi', itemType: 'is', hazards: ['Basınçlı tüp devrilmesi', 'Gaz sızıntısı', 'Bağlantı teması yaralanması'] },
                            { id: id(), label: 'İlaç hazırlama (sitotoksik)', itemType: 'faaliyet', hazards: ['Kanserojenik kimyasal maruziyeti', 'Cilt/göz teması', 'Aerosol soluma'] },
                            { id: id(), label: 'Tıbbi tüp dolap/depo alanı', itemType: 'ortam', hazards: ['Tüp devrilmesi', 'Oksijence zenginleşme', 'Yangın riski artışı'] },
                        ]},
                    ]},
                    { id: 'hb_fiziksel', label: 'Hasta Taşıma & Fiziksel Risk', icon: 'accessibility_new', subPhases: [
                        { id: 's_hb4', label: 'Fiziksel Tehlikeler', items: [
                            { id: id(), label: 'Hasta kaldırma ve transfer (yataktan sedyeye)', itemType: 'is', hazards: ['Bel/omurga yaralanması', 'Hasta düşmesi', 'Eklem zorlanması'] },
                            { id: id(), label: 'Dirençli hasta ile çalışma', itemType: 'faaliyet', hazards: ['Fiziksel saldırı', 'Stres', 'Kemik kırığı riski'] },
                            { id: id(), label: 'Gece vardiyası & yorgunluk', itemType: 'faaliyet', hazards: ['Yorgunluk kaynaklı tıbbi hata', 'Kazaya açıklık', 'Uyku bozukluğu'] },
                            { id: id(), label: 'Islak/kaygan hastane zemin', itemType: 'ortam', hazards: ['Kayarak düşme', 'Sağlıkçı ve hasta yaralanması'] },
                        ]},
                    ]},
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
                    { id: 'ym_galeri', label: 'Galeri & Kazı', icon: 'terrain', subPhases: [
                        { id: 's_ym1', label: 'Galeri Kazısı', items: [
                            { id: id(), label: 'Patlatma ile kaya kazısı', itemType: 'is', hazards: ['Patlama dışı fırlama', 'Tavan göçmesi', 'Gürültü', 'Silikoz tozu', 'Erken ateşleme'] },
                            { id: id(), label: 'Galeri tahkimatı (çelik kemer/beton)', itemType: 'is', hazards: ['Tahkimat yetersizliği', 'Ani tavan çökmesi', 'Metalik tahkimat yaralanması', 'Gürültü'] },
                            { id: id(), label: 'Delici / sondaj makinesi operasyonu', itemType: 'is', hazards: ['Vibrasyon hasarı', 'Toz (silikoz)', 'Gürültü', 'Makine çarpması'] },
                            { id: id(), label: 'Patlayıcı madde hazırlama ve yerleştirme', itemType: 'faaliyet', hazards: ['Erken ateşleme', 'Yanlış delik yerleşimi', 'Stray current riski', 'Patlama fragmanı'] },
                            { id: id(), label: 'Yükleme (loader) ve nakliye operasyonu', itemType: 'faaliyet', hazards: ['Çarpışma', 'Devrilme (yokuş)', 'Gürültü', 'Görüş kısıtı'] },
                            { id: id(), label: 'Yeraltı galeri ve taş damar', itemType: 'ortam', hazards: ['Metan/CO gaz birikimi', 'Oksijen yetersizliği', 'Su baskını', 'Dar alan riskleri'] },
                        ]},
                    ]},
                    { id: 'ym_havalandirma', label: 'Havalandırma & Gaz İzleme', icon: 'air', subPhases: [
                        { id: 's_ym2', label: 'Yeraltı Havası', items: [
                            { id: id(), label: 'Havalandırma fanı bakımı ve ayarı', itemType: 'faaliyet', hazards: ['Fan arızası – yetersiz havalandırma', 'Elektrik çarpması', 'Toz birikimi'] },
                            { id: id(), label: 'Gaz ölçümü (CH4, CO, O2, H2S)', itemType: 'faaliyet', hazards: ['Kalibrasyon hatası – yanlış negatif', 'Patlayıcı atmosfere girme'] },
                            { id: id(), label: 'Yanıcı gaz birikimi müdahalesi', itemType: 'faaliyet', hazards: ['Tutuşma kaynakları', 'Patlama', 'Tahliye gecikmesi'] },
                            { id: id(), label: 'Havalandırma boru / kanal sistemi bakımı', itemType: 'faaliyet', hazards: ['Kanalın yırtılması', 'Sıkışma/ezilme (ağır kanal)'] },
                            { id: id(), label: 'Sabit gaz izleme sistemi (sensörler)', itemType: 'ekipman', hazards: ['Sensör arızası', 'İletişim kesilmesi', 'Sinyali gözden kaçırma'] },
                            { id: id(), label: 'Yeraltı gaz ortamı (metan/kok gazı)', itemType: 'ortam', hazards: ['Patlayıcı atmosfer', 'Oksijen yetersizliği', 'Kronik CO maruziyeti'] },
                        ]},
                    ]},
                    { id: 'ym_tahlisiye', label: 'Tahlisiye & Acil Durum', icon: 'emergency', subPhases: [
                        { id: 's_ym3', label: 'Acil Durum', items: [
                            { id: id(), label: 'Yangın müdahalesi (yeraltı)', itemType: 'faaliyet', hazards: ['Hızlı duman yayılımı', 'Tahliye karmaşası', 'Oksijen tükenmesi'] },
                            { id: id(), label: 'Tahliye tatbikatı ve sığınak kullanımı', itemType: 'faaliyet', hazards: ['Tahliye yolu karanlığı', 'Personel sayım hatası', 'Panik'] },
                            { id: id(), label: 'Su baskını / sellere müdahale', itemType: 'faaliyet', hazards: ['Boğulma', 'Elektrik çarpması', 'Hızlı su yükselmesi'] },
                            { id: id(), label: 'SCBA / oksijenli kaçış cihazı kullanımı', itemType: 'ekipman', hazards: ['Tüp tükenmesi', 'Maske uyumsuzluğu', 'Cihaz arızası'] },
                        ]},
                    ]},
                ]
            },
            {
                id: 'acik_ocak', label: 'Açık Ocak Madenciliği', icon: 'landscape', phases: [
                    { id: 'ao_delme', label: 'Delme & Patlatma', icon: 'construction', subPhases: [
                        { id: 's_ao1', label: 'Sondaj & Patlatma', items: [
                            { id: id(), label: 'Sondaj makinesi ile delme', itemType: 'is', hazards: ['Gürültü', 'Toz (silika)', 'Vibrasyon', 'Sondaj aletinin sapması', 'Parça fırlaması'] },
                            { id: id(), label: 'Patlayıcı madde depolama ve nakliyesi', itemType: 'faaliyet', hazards: ['Patlama', 'Stray current', 'Hırsızlık/sabotaj', 'Sıcak ortamda instabilite'] },
                            { id: id(), label: 'Patlatma operasyonu', itemType: 'faaliyet', hazards: ['Erken ateşleme', 'Geri atış', 'Parça fırlaması', 'Seismik titreşim', 'Toz bulutu'] },
                            { id: id(), label: 'Ateşleme hattı kontrol ve güvenlik alanı', itemType: 'faaliyet', hazards: ['Personelin güvenli mesafeye alınmaması', 'İletişim hatası'] },
                            { id: id(), label: 'Sondaj makinesi (crawler drill)', itemType: 'ekipman', hazards: ['Devrilme', 'Titreşim hasarı', 'Gürültü', 'Sondaj çubuğu kırılması'] },
                            { id: id(), label: 'Açık ocak şev kenarı', itemType: 'ortam', hazards: ['Şev çökmesi', 'Araç devrilmesi', 'Yüksekten düşme', 'Toz/gürültü maruziyeti'] },
                        ]},
                    ]},
                    { id: 'ao_yukleme', label: 'Yükleme & Nakliye', icon: 'local_shipping', subPhases: [
                        { id: 's_ao2', label: 'Yükleme Nakliye', items: [
                            { id: id(), label: 'Ekskavatör ile yükleme', itemType: 'is', hazards: ['Araç devrilmesi', 'Kova çarpması', 'Görüş kısıtı', 'Personel çarpması'] },
                            { id: id(), label: 'Dump truck ile nakliye (yokuş)', itemType: 'faaliyet', hazards: ['Araç devrilmesi', 'Fren arızası', 'Kaza – yaya çarpması', 'Yük kayması'] },
                            { id: id(), label: 'Bant konveyör sistemleri', itemType: 'ekipman', hazards: ['Sıkışma/ezilme', 'Toz maruziyeti', 'Gürültü', 'Döner kısım teması'] },
                            { id: id(), label: 'Yükleme/boşaltma alanı (pit tabanı)', itemType: 'ortam', hazards: ['Şev çökmesi', 'Araç–araç çarpışması', 'Toz', 'Su birikimi kayması'] },
                        ]},
                    ]},
                    { id: 'ao_sev', label: 'Şev Yönetimi & Stabilitesi', icon: 'terrain', subPhases: [
                        { id: 's_ao3', label: 'Şev Güvenliği', items: [
                            { id: id(), label: 'Şev stabilitesi izleme (inklinometre/GPS)', itemType: 'faaliyet', hazards: ['Erken uyarı sisteminin gecikmesi', 'Veri yorumlama hatası'] },
                            { id: id(), label: 'Şev berme / kademe hazırlama', itemType: 'is', hazards: ['Şev çökmesi', 'İş makinesi devrilmesi', 'Personel düşmesi'] },
                            { id: id(), label: 'Taş düşmesi ve kaymaya karşı bariyer', itemType: 'faaliyet', hazards: ['Bariyer yetersizliği', 'Taş – araç/personel çarpması'] },
                            { id: id(), label: 'Yağmur sonrası şev kontrol ve geçici kapama', itemType: 'faaliyet', hazards: ['Su doygunluğu – ani çökme', 'Tehlikeli alana girme'] },
                        ]},
                    ]},
                ]
            },

            // ── Mineral İşleme & Mikronizasyon Tesisi ───────────────────────
            {
                id: 'mineral_isleme',
                label: 'Mineral İşleme & Mikronizasyon Tesisi',
                icon: 'settings',
                phases: [
                    // 1. Kurumsal İSG ve Mevzuat Uyum
                    {
                        id: 'mi_isg', label: 'Kurumsal İSG ve Mevzuat Uyum', icon: 'security',
                        subPhases: [
                            { id: 'mi_isg_1', label: 'Görev-Yetki-Sorumluluk & Eğitim', items: [
                                { id: id(), label: 'İSG uzmanı / hekim atama ve görev belgesi', itemType: 'faaliyet', hazards: ['Yasal uyumsuzluk', 'Görev boşluğu'] },
                                { id: id(), label: 'İşe giriş ve tozlu ortam özel ISG eğitimi', itemType: 'faaliyet', hazards: ['Eğitimsiz personel', 'Silikoz riski'] },
                                { id: id(), label: 'Yüklenici güvenlik oryantasyonu ve belge kontrolü', itemType: 'faaliyet', hazards: ['Yüklenici kaza', 'Koordinasyon eksikliği'] },
                                { id: id(), label: 'İş izin sistemi (sıcak çalışma, kapalı alan, LOTO)', itemType: 'faaliyet', hazards: ['İzinsiz tehlikeli çalışma', 'Patlama', 'Elektrik çarpması'] },
                                { id: id(), label: 'Ramak kala / kaza bildirim ve DÖF prosedürü', itemType: 'faaliyet', hazards: ['Tekrar eden kaza', 'Kök neden analizi eksikliği'] },
                            ]},
                            { id: 'mi_isg_2', label: 'KKD ve Sağlık Gözetimi', items: [
                                { id: id(), label: 'Toz maskesi (P3/FFP3) seçimi ve uyum testi', itemType: 'ekipman', hazards: ['Silikoz', 'Pnömokonyoz', 'Kronik akciğer hastalığı'] },
                                { id: id(), label: 'Kulak koruyucu (SNR ≥25 dB) kullanım denetimi', itemType: 'ekipman', hazards: ['Gürültüye bağlı işitme kaybı'] },
                                { id: id(), label: 'Toz maruziyeti periyodik solunum fonksiyon testi', itemType: 'faaliyet', hazards: ['Geç tespit edilen meslek hastalığı'] },
                                { id: id(), label: 'İşyeri toz ölçümü (kuvars – solunan fraksiyon)', itemType: 'faaliyet', hazards: ['Mevzuat ihlali', 'Silikoz'] },
                            ]},
                        ],
                    },

                    // 2. Hammadde Kabul, Stok ve Saha Lojistiği
                    {
                        id: 'mi_hammadde', label: 'Hammadde Kabul, Stok ve Saha Lojistiği', icon: 'inventory',
                        subPhases: [
                            { id: 'mi_hm_1', label: 'Tüvenan / Cevher Kabulü', items: [
                                { id: id(), label: 'Kamyon ile ham madde boşaltımı (yük devirme)', itemType: 'faaliyet', hazards: ['Araç devrilmesi', 'Geri manevra kazası', 'Toz bulutu'] },
                                { id: id(), label: 'Yükleyici / wheel loader ile hammadde istifi', itemType: 'faaliyet', hazards: ['Araç devrilmesi (istif yamacı)', 'Görüş kısıtı', 'Personel çarpması'] },
                                { id: id(), label: 'Stok sahası zemin stabilitesi ve drenaj', itemType: 'ortam', hazards: ['Istif göçmesi', 'Kaygan zemin', 'Su birikintisi'] },
                            ]},
                            { id: 'mi_hm_2', label: 'Forklift, Bunker Besleme ve Trafik', items: [
                                { id: id(), label: 'Forklift ile hammadde taşıma ve istif', itemType: 'faaliyet', hazards: ['Devrilme (yük/eğim)', 'Yaya çarpması', 'Yük düşmesi'] },
                                { id: id(), label: 'Araç-yaya ayrım planı ve trafik akışı', itemType: 'faaliyet', hazards: ['Çarpışma', 'Ezilme'] },
                                { id: id(), label: 'Bunker üstü ızgara ve güvenli besleme pozisyonu', itemType: 'ortam', hazards: ['Bunkere düşme', 'Kapak arızası', 'Toz inhalasyonu'] },
                                { id: id(), label: 'Gece saha aydınlatması ve yansıtıcı işaretleme', itemType: 'ortam', hazards: ['Görünürlük eksikliği', 'Araç-yaya kazası'] },
                            ]},
                        ],
                    },

                    // 3. Besleme, Dozajlama ve Bunker/Silo
                    {
                        id: 'mi_besleme', label: 'Besleme, Dozajlama ve Bunker/Silo', icon: 'valve',
                        subPhases: [
                            { id: 'mi_bes_1', label: 'Bunker / Silo Güvenliği', items: [
                                { id: id(), label: 'Bunker/silo iç seviye takibi (köprüleşme/tıkanma)', itemType: 'ekipman', hazards: ['Ani malzeme çökmesi', 'Personel gömülmesi'] },
                                { id: id(), label: 'Köprüleşme / tıkanma açma prosedürü', itemType: 'faaliyet', hazards: ['Bunkere düşme', 'Malzeme patlaması', 'El/kol sıkışması'] },
                                { id: id(), label: 'Bunker/silo girişi – kapalı alan izni', itemType: 'faaliyet', hazards: ['Oksijen yetersizliği', 'Toz inhalasyonu', 'Gömülme'] },
                                { id: id(), label: 'Bunker ızgara/kapak yapısal kontrol', itemType: 'ekipman', hazards: ['Kapak kırılması', 'Düşme'] },
                            ]},
                            { id: 'mi_bes_2', label: 'Besleyici ve Dozajlama Ekipmanları', items: [
                                { id: id(), label: 'Vibrasyonlu besleyici titreşim ve gürültü kontrolü', itemType: 'ekipman', hazards: ['Gürültü (≥85 dB)', 'El-kol titreşimi', 'Bağlantı gevşemesi'] },
                                { id: id(), label: 'Bant besleyici döner aksam korumaları', itemType: 'ekipman', hazards: ['El/kol sıkışması', 'Giysi kapılması'] },
                                { id: id(), label: 'Tartım sistemi kalibrasyon ve kayıt', itemType: 'ekipman', hazards: ['Hatalı dozaj', 'Ürün kalite kaybı'] },
                            ]},
                        ],
                    },

                    // 4. Kırma ve Ön Boyutlandırma
                    {
                        id: 'mi_kirma', label: 'Kırma ve Ön Boyutlandırma', icon: 'construction',
                        subPhases: [
                            { id: 'mi_kir_1', label: 'Kırıcı Ekipmanlar', items: [
                                { id: id(), label: 'Çeneli kırıcı çene açıklığı ve korumaları', itemType: 'ekipman', hazards: ['Parça fırlaması', 'El/kol sıkışması', 'Gürültü (≥100 dB)', 'Toz'] },
                                { id: id(), label: 'Darbeli kırıcı (impact crusher) rotor muhafazası', itemType: 'ekipman', hazards: ['Parça fırlaması', 'Titreşim', 'Gürültü'] },
                                { id: id(), label: 'Valsli kırıcı (roller crusher) nip noktası koruması', itemType: 'ekipman', hazards: ['El/kol yakalanması', 'Gürültü', 'Toz'] },
                                { id: id(), label: 'Sekonder kırıcı besleme ve deşarj alanı', itemType: 'ortam', hazards: ['Toz bulutu', 'Gürültü', 'Parça fırlaması'] },
                            ]},
                            { id: 'mi_kir_2', label: 'Manyetik Ayırıcı ve Tıkanma Açma', items: [
                                { id: id(), label: 'Manyetik ayırıcı metal toplama ve boşaltma', itemType: 'faaliyet', hazards: ['Mıknatıs ezme hasar', 'El yaralanması', 'Metal fırlaması'] },
                                { id: id(), label: 'Kırıcı tıkanıklığı açma prosedürü', itemType: 'faaliyet', hazards: ['Ani malzeme boşalması', 'El/kol sıkışması', 'LOTO ihlali'] },
                                { id: id(), label: 'Kırıcı kapak açık – erişim LOTO zorunluluğu', itemType: 'faaliyet', hazards: ['Beklenmedik çalışma', 'Ezilme', 'Kırıcı içine düşme'] },
                            ]},
                        ],
                    },

                    // 5. Eleme ve Sınıflandırma
                    {
                        id: 'mi_eleme', label: 'Eleme ve Sınıflandırma', icon: 'filter_alt',
                        subPhases: [
                            { id: 'mi_ele_1', label: 'Titreşimli Elekler', items: [
                                { id: id(), label: 'Titreşimli elek yapısal bağlantı ve titreşim kontrolü', itemType: 'ekipman', hazards: ['Gevşek bağlantı – çarpma', 'El-kol titreşimi', 'Gürültü'] },
                                { id: id(), label: 'Elek gerimi bölgesi – erişim sınırlaması', itemType: 'ortam', hazards: ['El/kol yakalanması', 'Yüksekten düşme (platform)'] },
                                { id: id(), label: 'Elek değişimi (LOTO + takım çalışması)', itemType: 'faaliyet', hazards: ['Ağır elek düşmesi', 'El/parmak ezilmesi', 'LOTO ihlali'] },
                                { id: id(), label: 'Elek altı fraksiyon saçılma ve toz kontrolü', itemType: 'ortam', hazards: ['Toz inhalasyonu', 'Zemin kayması'] },
                            ]},
                            { id: 'mi_ele_2', label: 'Hava Klasifikatörü ve Siklonlar', items: [
                                { id: id(), label: 'Hava klasifikatörü emiş fanı – ters basınç', itemType: 'ekipman', hazards: ['Fan içine çekilme', 'Toz kaçağı'] },
                                { id: id(), label: 'Siklon bağlantı flanşları ve toz sızdırmazlığı', itemType: 'ekipman', hazards: ['Toz kaçağı', 'İnce partikül soluma'] },
                                { id: id(), label: 'Siklon altı toplama ve boşaltma', itemType: 'faaliyet', hazards: ['Toz püskürmesi', 'Cilt/göz irritasyonu'] },
                            ]},
                        ],
                    },

                    // 6. Öğütme ve Mikronizasyon
                    {
                        id: 'mi_ogutme', label: 'Öğütme ve Mikronizasyon', icon: 'blur_on',
                        subPhases: [
                            { id: 'mi_ogu_1', label: 'Bilyalı / Pendüler Değirmen', items: [
                                { id: id(), label: 'Bilyalı değirmen kapak açma ve iç bakım', itemType: 'faaliyet', hazards: ['Ağır kapak ezme', 'Bilya düşmesi', 'Dar alan – kapalı alan izni'] },
                                { id: id(), label: 'Değirmen yatağı / rulman yağlama kontrolü', itemType: 'ekipman', hazards: ['Rulman arızası', 'Yangın (yağ sızıntısı)', 'Titreşim artışı'] },
                                { id: id(), label: 'Pendüler değirmen (ring mill) kol denge ağırlıkları', itemType: 'ekipman', hazards: ['Dengesizlik – kırılma', 'Parça fırlaması', 'Titreşim'] },
                                { id: id(), label: 'Öğütme medyası (bilya) doldurma operasyonu', itemType: 'faaliyet', hazards: ['Bilya düşmesi', 'El-ayak ezilmesi', 'Göz yaralanması'] },
                            ]},
                            { id: 'mi_ogu_2', label: 'Jet Mill ve Ayırıcı Değirmen', items: [
                                { id: id(), label: 'Jet mill basınçlı hava sistemi ve emniyet valfi', itemType: 'ekipman', hazards: ['Basınç altı patlama', 'Gürültü', 'Toz baskısı'] },
                                { id: id(), label: 'Ayırıcı (classifier) temizlik ve kör nokta', itemType: 'faaliyet', hazards: ['Toz birikimi – patlama (yanıcı tozlar)', 'LOTO ihlali'] },
                                { id: id(), label: 'İnce toz hattı contalama ve bağlantı kontrolü', itemType: 'ekipman', hazards: ['İnce toz kaçağı', 'Solunum maruziyeti'] },
                                { id: id(), label: 'Değirmen çalışır haldeyken besleme müdahalesi yasağı', itemType: 'faaliyet', hazards: ['Dönen aksa temas', 'Ezilme', 'Toz patlaması'] },
                            ]},
                        ],
                    },

                    // 7. Kurutma
                    {
                        id: 'mi_kurutma', label: 'Kurutma', icon: 'local_fire_department',
                        subPhases: [
                            { id: 'mi_kur_1', label: 'Döner Kurutucu & Brülör', items: [
                                { id: id(), label: 'Döner kurutucu tahrik sistemi koruması', itemType: 'ekipman', hazards: ['Döner aksa kapılma/giysi yakalanması', 'Ezilme'] },
                                { id: id(), label: 'Brülör ateşleme ve alev izleme (flame scanner)', itemType: 'ekipman', hazards: ['Yanmamış yakıt birikimi – patlama', 'CO oluşumu'] },
                                { id: id(), label: 'Sıcak hava jeneratörü yüzey sıcaklığı ve izolasyon', itemType: 'ekipman', hazards: ['Yanma (temas)', 'Yangın (yüzey + dökülen ürün)'] },
                                { id: id(), label: 'Kurutucu çıkış sıcaklığı ve ürün yanması riski', itemType: 'faaliyet', hazards: ['Aşırı ısınma – ürün yangını', 'Toz patlaması'] },
                            ]},
                            { id: 'mi_kur_2', label: 'Yakıt Sistemi ve Sıcak Ortam', items: [
                                { id: id(), label: 'Doğalgaz / fuel-oil besleme hattı sızdırmazlık', itemType: 'ekipman', hazards: ['Gaz/yakıt kaçağı', 'Patlama', 'Yangın'] },
                                { id: id(), label: 'Yakıt deposu (tank) ve emniyet mesafesi', itemType: 'ortam', hazards: ['Döküntü yangını', 'Toprak kirliliği', 'Patlama'] },
                                { id: id(), label: 'Sıcak toz maruziyeti (yanma – cilt/solunum yolu)', itemType: 'faaliyet', hazards: ['Yanma', 'İnhalasyon hasarı (sıcak partiküller)'] },
                                { id: id(), label: 'Yüksek sıcaklık alanı ısı stresi yönetimi', itemType: 'ortam', hazards: ['Isı stresi / ısı çarpması', 'Kardiyovasküler yük'] },
                            ]},
                        ],
                    },

                    // 8. Toz Toplama, Aspirasyon ve Filtre
                    {
                        id: 'mi_toz_toplama', label: 'Toz Toplama, Aspirasyon ve Filtre', icon: 'air',
                        subPhases: [
                            { id: 'mi_toz_1', label: 'Torbalı Filtre ve Diferansiyel Basınç', items: [
                                { id: id(), label: 'Torbalı filtre diferansiyel basınç takibi (ΔP)', itemType: 'ekipman', hazards: ['Tıkalı filtre – toz kaçağı', 'Fan aşırı yükü'] },
                                { id: id(), label: 'Filtre torbası değişimi (LOTO + toz KKD)', itemType: 'faaliyet', hazards: ['Yoğun toz maruziyeti', 'LOTO ihlali', 'Düşme (yüksekte torba değişimi)'] },
                                { id: id(), label: 'Filtreye pulsejet temizleme basıncı ve nozul', itemType: 'ekipman', hazards: ['Nozul arızası – filtre tıkanması', 'Basınç altı yaralanma'] },
                                { id: id(), label: 'Filtre altı toplama helezon / vana sızdırmazlığı', itemType: 'ekipman', hazards: ['Toz kaçağı', 'Solunum maruziyeti'] },
                            ]},
                            { id: 'mi_toz_2', label: 'Fan, Duct ve Lokal Emiş', items: [
                                { id: id(), label: 'Aspirasyon fanı – kıvılcım tutucu (yanıcı tozlar)', itemType: 'ekipman', hazards: ['Kıvılcım – toz yangını/patlaması'] },
                                { id: id(), label: 'Duct (kanal) bağlantı flanşları – toz kaçağı tespiti', itemType: 'faaliyet', hazards: ['Toz inhalasyonu', 'Yangın (birikmiş toz)'] },
                                { id: id(), label: 'Lokal emiş (LEV) verimliliği ve yıllık testi', itemType: 'faaliyet', hazards: ['Yetersiz emiş – toz sınır aşımı', 'Mevzuat ihlali'] },
                                { id: id(), label: 'Kanal içi toz birikimi – temizlik periyodu', itemType: 'faaliyet', hazards: ['Birikim yangını/patlaması', 'Kanalda blokaj'] },
                            ]},
                        ],
                    },

                    // 9. Konveyörler, Elevatörler ve Transfer Noktaları
                    {
                        id: 'mi_konveyor', label: 'Konveyörler, Elevatörler ve Transfer Noktaları', icon: 'linear_scale',
                        subPhases: [
                            { id: 'mi_kon_1', label: 'Bant Konveyör ve Döner Aksam', items: [
                                { id: id(), label: 'Konveyör döner makara ve tahrik silindiri koruyucu', itemType: 'ekipman', hazards: ['El/kol/giysi yakalanması', 'Ezilme', 'Kemik kırığı'] },
                                { id: id(), label: 'Konveyör bant sıyırıcı (scraper) ve temizlik', itemType: 'faaliyet', hazards: ['Sıyırıcıda el sıkışması', 'Toz saçılması', 'Kayma-düşme'] },
                                { id: id(), label: 'Konveyör acil durdurma (e-stop / pull-cord)', itemType: 'ekipman', hazards: ['Pull-cord erişimsizliği', 'Gecikmeli durdurma', 'Kaza'] },
                                { id: id(), label: 'Konveyör üstü yürüme platformu ve korkuluk', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Bant üstünde yürüme yaralanması'] },
                            ]},
                            { id: 'mi_kon_2', label: 'Kovalı Elevatör ve Transfer Şutu', items: [
                                { id: id(), label: 'Kovalı elevatör gerdirme tamburu – sıkışma noktası', itemType: 'ekipman', hazards: ['El/kol yakalanması', 'Parmak kopması'] },
                                { id: id(), label: 'Elevatör gövde contası ve toz sızdırmazlığı', itemType: 'ekipman', hazards: ['İnce toz kaçağı', 'Toz birikimi – yangın/patlama (yanıcı tozlar)'] },
                                { id: id(), label: 'Transfer şutu tıkanma açma prosedürü', itemType: 'faaliyet', hazards: ['Ani malzeme boşalması', 'El/kol sıkışması', 'LOTO ihlali'] },
                                { id: id(), label: 'Helezon konveyör giriş/çıkış kapak koruyucuları', itemType: 'ekipman', hazards: ['El/kol sıkışması', 'Dönen vida temas'] },
                            ]},
                        ],
                    },

                    // 10. Paketleme, Big-Bag, Paletleme ve Sevkiyat
                    {
                        id: 'mi_paketleme', label: 'Paketleme, Big-Bag, Paletleme ve Sevkiyat', icon: 'inventory_2',
                        subPhases: [
                            { id: 'mi_pak_1', label: 'Torba Dolum ve Tartım', items: [
                                { id: id(), label: 'Valfli torba dolum makinesi – toz kaçağı', itemType: 'ekipman', hazards: ['Toz maruziyeti (paketleme operatörü)', 'Silikoz'] },
                                { id: id(), label: 'Açık ağız torba dikiş makinesi – el yaralanması', itemType: 'ekipman', hazards: ['El / parmak iğnesi yaralanması', 'Toz inhalasyonu'] },
                                { id: id(), label: 'Tartım sistemi kalibrasyon ve doğruluk', itemType: 'ekipman', hazards: ['Eksik/fazla dolum', 'Müşteri şikayeti', 'Çanta patlama'] },
                            ]},
                            { id: 'mi_pak_2', label: 'Big-Bag, Paletleme ve Forklift', items: [
                                { id: id(), label: 'Big-bag dolum istasyonu çekme noktası ve askı', itemType: 'ekipman', hazards: ['Askı kopmesi – big-bag düşmesi', 'Ezilme', 'Toz bulutu'] },
                                { id: id(), label: 'Otomatik / yarı otomatik paletleyici güvenlik bariyeri', itemType: 'ekipman', hazards: ['Hareketli kol çarpması', 'Palet devrilmesi'] },
                                { id: id(), label: 'Streç / shrink ambalaj makinesi – sıcak yüzey', itemType: 'ekipman', hazards: ['Yanma (ısıtma elemanı teması)', 'Elektrik çarpması'] },
                                { id: id(), label: 'Forklift ile palet yükleme ve kamyon rampa', itemType: 'faaliyet', hazards: ['Forklift devrilme (yük/eğim)', 'Yaya çarpması', 'Rampa kayması'] },
                                { id: id(), label: 'Kamyon yükleme – yük güvence ve örtü', itemType: 'faaliyet', hazards: ['Yük kayması (kamyon freni)', 'Toz saçılması (örtüsüz)'] },
                            ]},
                        ],
                    },

                    // 11. Laboratuvar ve Kalite Kontrol
                    {
                        id: 'mi_laboratuvar', label: 'Laboratuvar ve Kalite Kontrol', icon: 'science',
                        subPhases: [
                            { id: 'mi_lab_1', label: 'Numune Alma ve Hazırlama', items: [
                                { id: id(), label: 'Çevrimiçi numune alıcı (automatic sampler) bakımı', itemType: 'ekipman', hazards: ['Toz maruziyeti', 'Döner aksam teması'] },
                                { id: id(), label: 'El ile numune alma – konveyör üstü', itemType: 'faaliyet', hazards: ['Döner bant teması', 'Toz inhalasyonu', 'Yüksekten düşme'] },
                                { id: id(), label: 'Lab kırıcı / öğütücü (disk mill, jaw crusher)', itemType: 'ekipman', hazards: ['El/parmak sıkışması', 'Toz bulutu', 'Gürültü'] },
                                { id: id(), label: 'Numune tartımı ve nem fırını güvenliği', itemType: 'ekipman', hazards: ['Yanma (fırın yüzeyi)', 'Cam kap kırılması', 'Kimyasal reaksiyon'] },
                            ]},
                            { id: 'mi_lab_2', label: 'Kimyasal ve Fiziksel Analizler', items: [
                                { id: id(), label: 'Elek analizi (tozlu ortam) ve KKD kullanımı', itemType: 'faaliyet', hazards: ['Toz inhalasyonu (lab ortamı)', 'Göz irritasyonu'] },
                                { id: id(), label: 'Kimyasal analiz reaktif ve asit depolama', itemType: 'faaliyet', hazards: ['Korozif temas', 'Reaksiyon ısısı', 'Gaz çıkışı'] },
                                { id: id(), label: 'XRF / XRD cihazı radyasyon güvenliği', itemType: 'ekipman', hazards: ['X-ışını maruziyeti', 'Radyasyon ihlali'] },
                            ]},
                        ],
                    },

                    // 12. Bakım, Onarım, Temizlik ve LOTO
                    {
                        id: 'mi_bakim_loto', label: 'Bakım, Onarım, Temizlik ve LOTO', icon: 'build',
                        subPhases: [
                            { id: 'mi_bak_1', label: 'Planlı Bakım ve LOTO', items: [
                                { id: id(), label: 'Değirmen, elek ve kırıcı planlı bakım prosedürü', itemType: 'faaliyet', hazards: ['Beklenmedik çalışma', 'Döner aksam teması', 'LOTO ihlali'] },
                                { id: id(), label: 'Enerji izolasyonu (LOTO) kiti ve kayıt sistemi', itemType: 'ekipman', hazards: ['Eksik kilit', 'Birden fazla enerji kaynağı gözden kaçırma'] },
                                { id: id(), label: 'Filtre torbası değişimi – toz KKD ve LOTO', itemType: 'faaliyet', hazards: ['Toz inhalasyonu', 'Yüksekte düşme', 'LOTO ihlali'] },
                                { id: id(), label: 'Yüksekte çalışma (platform/merdiven) izni', itemType: 'faaliyet', hazards: ['Düşme', 'Nesne düşmesi', 'Dengesiz yüzey'] },
                            ]},
                            { id: 'mi_bak_2', label: 'Arıza Bakımı ve Devreye Alma', items: [
                                { id: id(), label: 'Elektrik arıza müdahalesi – yetkili elektrikçi', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Ark flaşı', 'Gerilim altı çalışma'] },
                                { id: id(), label: 'Mekanik arıza – tahrik sistemi müdahalesi', itemType: 'faaliyet', hazards: ['Döner aksam', 'Ezilme', 'LOTO ihlali'] },
                                { id: id(), label: 'Bakım sonrası test ve devreye alma güvenliği', itemType: 'faaliyet', hazards: ['Yanlış bağlantı', 'Yabancı madde unutulması', 'Testde personel çevrede kalması'] },
                                { id: id(), label: 'Temizlik (süpürme/vakumlama) toz kontrolü', itemType: 'faaliyet', hazards: ['Basınçlı hava ile temizlik – toz dağıtma', 'Solunum maruziyeti'] },
                            ]},
                        ],
                    },

                    // 13. Yardımcı Tesisler
                    {
                        id: 'mi_yardimci', label: 'Yardımcı Tesisler', icon: 'apartment',
                        subPhases: [
                            { id: 'mi_yrd_1', label: 'Kompresör, Blower ve Fanlar', items: [
                                { id: id(), label: 'Hava kompresörü basınç kabı ve emniyet valfi testi', itemType: 'ekipman', hazards: ['Basınç kabı patlaması', 'Aşırı basınç'] },
                                { id: id(), label: 'Blower / yüksek basınç fanı gürültü ve titreşim', itemType: 'ekipman', hazards: ['Gürültü (≥95 dB)', 'El-kol titreşimi'] },
                                { id: id(), label: 'Fan emme ağzı koruması (ızgara)', itemType: 'ekipman', hazards: ['El/kol çekilmesi', 'Yabancı cisim girişi'] },
                            ]},
                            { id: 'mi_yrd_2', label: 'Trafo, Pano, Jeneratör ve Atölye', items: [
                                { id: id(), label: 'Trafo / YG pano erişim ve kilitli alan', itemType: 'ortam', hazards: ['Elektrik çarpması', 'Ark flaşı'] },
                                { id: id(), label: 'Jeneratör CO çıkışı ve havalandırma', itemType: 'ekipman', hazards: ['CO zehirlenmesi', 'Yakıt yangını'] },
                                { id: id(), label: 'Hava tankı (receiver) periyodik muayene', itemType: 'ekipman', hazards: ['Tank patlaması', 'Korozyon'] },
                                { id: id(), label: 'Atölye yağlama ve yağ depolama güvenliği', itemType: 'ortam', hazards: ['Kaygan zemin (yağ dökülmesi)', 'Yangın (yanıcı yağ)'] },
                                { id: id(), label: 'Yedek parça deposu – raf stabilitesi ve tehlikeli madde ayrımı', itemType: 'ortam', hazards: ['Raf devrilmesi', 'Kimyasal temas'] },
                            ]},
                        ],
                    },

                    // 14. Çevre, Atık ve Housekeeping
                    {
                        id: 'mi_cevre_atik', label: 'Çevre, Atık ve Housekeeping', icon: 'eco',
                        subPhases: [
                            { id: 'mi_cav_1', label: 'Toz Yayılımı ve Temizlik', items: [
                                { id: id(), label: 'Endüstriyel vakumlama ile toz temizliği (basınçlı hava yasağı)', itemType: 'faaliyet', hazards: ['Basınçlı hava ile toz havaya kaldırma – solunum/patlama'] },
                                { id: id(), label: 'Dökülen ürün anlık toplama prosedürü', itemType: 'faaliyet', hazards: ['Kaygan zemin', 'Toz maruziyeti', 'Yangın/patlama (yanıcı tozlar)'] },
                                { id: id(), label: 'Konveyör altı ve makine çevresi temizlik planı', itemType: 'faaliyet', hazards: ['Birikim yangını', 'Çalışır halde temizlik – ezilme'] },
                            ]},
                            { id: 'mi_cav_2', label: 'Atık Yönetimi', items: [
                                { id: id(), label: 'Filtre atığı (toz) bertaraf – sınıflandırma', itemType: 'faaliyet', hazards: ['Toz inhalasyonu', 'Çevre ihlali', 'Yasadışı bertaraf'] },
                                { id: id(), label: 'Elek artığı (oversiz) geri dönüşüm veya depolama', itemType: 'faaliyet', hazards: ['Toz saçılması', 'İstif göçmesi'] },
                                { id: id(), label: 'Yağlı bez, hurda metal ve atık yağ bertarafı', itemType: 'faaliyet', hazards: ['Yangın (yağlı bez)', 'Çevre kirliliği', 'Yasadışı atık'] },
                                { id: id(), label: 'Çamurun (varsa) kurutma ve bertaraf prosedürü', itemType: 'faaliyet', hazards: ['Toz patlaması (çamur toz halinde)', 'Koku / çevre şikayeti'] },
                            ]},
                        ],
                    },

                    // 15. Acil Durum, Yangın ve Tahliye
                    {
                        id: 'mi_acil_yangin', label: 'Acil Durum, Yangın ve Tahliye', icon: 'emergency',
                        subPhases: [
                            { id: 'mi_acil_1', label: 'Yangın Algılama ve Söndürme', items: [
                                { id: id(), label: 'Yangın algılama sistemi (duman/ısı dedektörü)', itemType: 'ekipman', hazards: ['Gecikmeli algılama', 'Yanlış alarm', 'Toz ortamında optik dedektör kirlenmesi'] },
                                { id: id(), label: 'ABC kuru toz / CO2 söndürücü bakımı ve tarihi', itemType: 'ekipman', hazards: ['Boş söndürücü', 'Yangına ilk müdahale yapılamaması'] },
                                { id: id(), label: 'Toz birikimi yangın riski – kurutucu / filtre çevresi', itemType: 'ortam', hazards: ['Toz tutuşması – hızlı yayılma', 'Patlama zinciri'] },
                            ]},
                            { id: 'mi_acil_2', label: 'Acil Stop ve Tahliye', items: [
                                { id: id(), label: 'Tesis geneli acil stop sistemi (ana kontrol)', itemType: 'ekipman', hazards: ['Butona erişilememesi', 'Sistemin devre dışı kalması'] },
                                { id: id(), label: 'Tahliye planı, toplanma noktası ve tatbikat', itemType: 'faaliyet', hazards: ['Tahliye karmaşası', 'Personel eksik sayımı'] },
                                { id: id(), label: 'Toz kaçağı müdahalesi – bölge izolasyonu ve KKD', itemType: 'faaliyet', hazards: ['Toz inhalasyonu', 'Patlama riski'] },
                                { id: id(), label: 'Kurtarma planı (kurutucu içi / elevatör arızası)', itemType: 'faaliyet', hazards: ['Mahsur kalma', 'Kurtarma ekibi yokluğu'] },
                            ]},
                        ],
                    },

                    // Şartlı: Ocak ve Delme-Patlatma
                    {
                        id: 'mi_ocak', label: 'Şartlı – Ocak & Delme-Patlatma (Tesis Aynı Zamanda Ocak İşletiyorsa)', icon: 'terrain',
                        subPhases: [
                            { id: 'mi_ocak_1', label: 'Delme & Patlatma', items: [
                                { id: id(), label: 'Sondaj makinesi ile delme (toz/gürültü/titreşim)', itemType: 'faaliyet', hazards: ['Silikoz tozu', 'Gürültü', 'Vibrasyon hasarı', 'Parça fırlaması'] },
                                { id: id(), label: 'Patlayıcı madde hazırlama ve ateşleme', itemType: 'faaliyet', hazards: ['Erken ateşleme', 'Geri atış', 'Güvenli mesafe yetersizliği'] },
                                { id: id(), label: 'Patlatma toz bulutu ve parça fırlaması', itemType: 'faaliyet', hazards: ['Toz (silikoz)', 'Parça çarpması', 'Sismik titreşim'] },
                                { id: id(), label: 'Ekskavatör, kamyon ve kademe güvenliği', itemType: 'faaliyet', hazards: ['Şev çökmesi', 'Araç devrilmesi', 'Personel çarpması'] },
                            ]},
                        ],
                    },

                    // Şartlı: Kimyasal Katkı / Yüzey Kaplama
                    {
                        id: 'mi_kimyasal', label: 'Şartlı – Kimyasal Katkı / Yüzey Kaplama', icon: 'science',
                        subPhases: [
                            { id: 'mi_kim_1', label: 'Kimyasal Katkı Yönetimi', items: [
                                { id: id(), label: 'Stearat / dispersan depolama ve MSDS', itemType: 'faaliyet', hazards: ['Kimyasal temas', 'İnhalasyon', 'Yangın (yanıcı katkı)'] },
                                { id: id(), label: 'Kaplama kimyasalı dozaj ve karıştırma', itemType: 'faaliyet', hazards: ['Cilt/göz yanığı', 'Yanlış dozaj – ürün hatası'] },
                                { id: id(), label: 'Kimyasal katkı ekipman temizliği ve atık bertarafı', itemType: 'faaliyet', hazards: ['Kimyasal kalıntı', 'Çevre kirliliği'] },
                                { id: id(), label: 'KKD – kimyasal dirençli eldiven, gözlük, önlük', itemType: 'ekipman', hazards: ['Kimyasal yanık', 'Göz hasarı'] },
                            ]},
                        ],
                    },

                    // Şartlı: Patlayıcı Ortam (ATEX)
                    {
                        id: 'mi_atex', label: 'Şartlı – Patlayıcı Ortam / ATEX (Yanıcı Toz Varsa)', icon: 'warning',
                        subPhases: [
                            { id: 'mi_atex_1', label: 'Patlamadan Korunma Dokümanı (PKD)', items: [
                                { id: id(), label: 'Ürün tozunun patlayıcı özellik analizi (Kst, MIE)', itemType: 'faaliyet', hazards: ['Patlayıcı olduğu bilinmeden çalışma', 'ATEX ihlali'] },
                                { id: id(), label: 'PKD (ATEX patlamadan korunma dokümanı) hazırlığı', itemType: 'faaliyet', hazards: ['Yasal uyumsuzluk', 'Denetim cezası'] },
                                { id: id(), label: 'Zone sınıflandırması (Zone 20/21/22) ve harita', itemType: 'faaliyet', hazards: ['Yanlış sınıflandırma', 'Ateşleyici kaynak izin hataları'] },
                                { id: id(), label: 'Patlama tahliye kapakları (explosion vent) konumu', itemType: 'ekipman', hazards: ['Vent yönü – personel alanına yönelim', 'Vent yetersizliği'] },
                            ]},
                        ],
                    },

                    // Şartlı: Kapalı Alan
                    {
                        id: 'mi_kapali_alan', label: 'Şartlı – Kapalı Alan (Silo, Bunker, Filtre Gövdesi İçi)', icon: 'door_back',
                        subPhases: [
                            { id: 'mi_ka_1', label: 'Kapalı Alan Giriş Yönetimi', items: [
                                { id: id(), label: 'Kapalı alan tespiti ve izin listesi', itemType: 'faaliyet', hazards: ['İzinsiz giriş', 'Oksijen yetersizliği', 'Gömülme'] },
                                { id: id(), label: 'Atmosfer ölçümü (O2, CO, LEL) giriş öncesi', itemType: 'faaliyet', hazards: ['Ölçümsüz giriş – ölümcül atmosfer'] },
                                { id: id(), label: 'Kapalı alan kurtarma ekipmanı (harness, halatlar)', itemType: 'ekipman', hazards: ['Kurtarma yapılamaması', 'Kurtarıcı da tehlikeye girmesi'] },
                                { id: id(), label: 'Sürekli havalandırma ve gaz izleme (giriş süresince)', itemType: 'faaliyet', hazards: ['Havalandırma kesintisi', 'CO/O2 değişimi'] },
                            ]},
                        ],
                    },

                    // Şartlı: Yakıt ve Doğal Gaz Sistemi
                    {
                        id: 'mi_yakit_gaz', label: 'Şartlı – Yakıt ve Doğal Gaz Sistemi (Kurutucu / Brülör Varsa)', icon: 'local_fire_department',
                        subPhases: [
                            { id: 'mi_yak_1', label: 'Yakıt Hattı ve Brülör Güvenliği', items: [
                                { id: id(), label: 'Doğalgaz hat basınç regülatörü ve emniyet valfi', itemType: 'ekipman', hazards: ['Aşırı basınç', 'Gaz kaçağı', 'Patlama'] },
                                { id: id(), label: 'Gaz kaçak dedektörü (sabit) – brülör alanı', itemType: 'ekipman', hazards: ['Kaçak tespitsiz – birikim', 'Patlama'] },
                                { id: id(), label: 'Brülör acil kesme valfi ve prosedürü', itemType: 'ekipman', hazards: ['Yangında hızlı gaz kesilememesi'] },
                                { id: id(), label: 'Fuel-oil tank doldurma ve sızıntı önleme havuzu', itemType: 'ortam', hazards: ['Döküntü yangını', 'Toprak kirliliği'] },
                            ]},
                        ],
                    },

                    // Şartlı: Mobil Ekipman
                    {
                        id: 'mi_mobil', label: 'Şartlı – Mobil Ekipman (Forklift, Loder, Kamyon Yoğunsa)', icon: 'forklift',
                        subPhases: [
                            { id: 'mi_mob_1', label: 'Mobil Ekipman Güvenliği', items: [
                                { id: id(), label: 'Forklift operatörü yetki belgesi ve periyodik eğitim', itemType: 'faaliyet', hazards: ['Yetkisiz operasyon', 'Devrilme', 'Yaya çarpması'] },
                                { id: id(), label: 'Wheel loader (loder) günlük kontrol ve devrilme koruması', itemType: 'ekipman', hazards: ['ROPS/FOPS eksikliği', 'Devrilme', 'Görüş kısıtı'] },
                                { id: id(), label: 'Telehandler yük kapasitesi ve uzatma kolu stabilitesi', itemType: 'ekipman', hazards: ['Yük kapasitesi aşımı – devrilme'] },
                                { id: id(), label: 'Mobil ekipman – yaya ayrım planı ve bariyer', itemType: 'faaliyet', hazards: ['Araç-yaya çarpışması', 'Ezilme'] },
                                { id: id(), label: 'Araç park alanı ve gece aydınlatması', itemType: 'ortam', hazards: ['Görünmez araç hareketi', 'Kayma-düşme'] },
                            ]},
                        ],
                    },
                ],
            },
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
                    { id: 'tt_ekim', label: 'Ekim, Bakım & Hasat', icon: 'grass', subPhases: [
                        { id: 's_tt1', label: 'Tarla Faaliyetleri', items: [
                            { id: id(), label: 'Traktör ile sürme / diskaro çekimi', itemType: 'faaliyet', hazards: ['Devrilme (eğimli arazi)', 'PTO sıkışması', 'Gürültü', 'Titreşim', 'Görüş kısıtı'] },
                            { id: id(), label: 'Biçerdöver ile hasat', itemType: 'faaliyet', hazards: ['Döner kesici sıkışması', 'Toz/saman maruziyeti', 'Gürültü', 'Yangın (kuru ürün)'] },
                            { id: id(), label: 'Ekim makinesi operasyonu', itemType: 'faaliyet', hazards: ['PTO sıkışması', 'Elle müdahale riski (tıkanma)', 'Titreşim'] },
                            { id: id(), label: 'Sulama borusu/hortum döşeme', itemType: 'faaliyet', hazards: ['Hortum patlama', 'Elektrikli pompa riski', 'Elle taşıma zorlanması'] },
                            { id: id(), label: 'Gübre/kireç serpme', itemType: 'faaliyet', hazards: ['Kimyasal toz soluma', 'Göz tahrişi', 'Cilt teması'] },
                            { id: id(), label: 'Traktör (ROPS takılı/takısız)', itemType: 'ekipman', hazards: ['Devrilme (ROPS eksikliği)', 'PTO muhafaza eksikliği', 'Fren yetersizliği'] },
                            { id: id(), label: 'Açık tarla – hava koşulları', itemType: 'ortam', hazards: ['UV/ısı stresi', 'Yıldırım çarpması', 'Böcek/haşere ısırması', 'İzole konum'] },
                        ]},
                    ]},
                    { id: 'tt_ilac', label: 'İlaçlama & Gübreleme', icon: 'science', subPhases: [
                        { id: 's_tt2', label: 'Kimyasal Uygulama', items: [
                            { id: id(), label: 'Sırt pompası ile ilaçlama', itemType: 'faaliyet', hazards: ['Kimyasal soluma', 'Cilt/göz teması', 'Rüzgar yönü maruziyeti', 'Kas-iskelet zorlanması'] },
                            { id: id(), label: 'Traktörlü ilaçlama (atomizör/pülverizatör)', itemType: 'faaliyet', hazards: ['Kimyasal sürücü maruziyeti', 'Rüzgar yayılımı', 'Çevresel kontaminasyon'] },
                            { id: id(), label: 'Gübre tankeri ile sıvı gübre uygulaması', itemType: 'faaliyet', hazards: ['Gübre sıçraması (cilt/göz)', 'Araç devrilmesi', 'Hortum patlaması'] },
                            { id: id(), label: 'İlaç karıştırma ve dozaj hazırlama', itemType: 'faaliyet', hazards: ['Konsantre kimyasal teması', 'Yanlış dozaj', 'İçme suyu kontaminasyonu'] },
                            { id: id(), label: 'Boş ilaç kaplarının bertarafı', itemType: 'faaliyet', hazards: ['Kimyasal kalıntı teması', 'Çevre kirliliği', 'Yanlış bertaraf – yasal uyumsuzluk'] },
                            { id: id(), label: 'İlaçlama ekipmanı (pompa/hortum/nozul)', itemType: 'ekipman', hazards: ['Hortum patlaması – baskı altı teması', 'Nozul tıkanması', 'Kimyasal sızdırma'] },
                        ]},
                    ]},
                ]
            },
            {
                id: 'hayvancilik', label: 'Hayvancılık & Ahır', icon: 'pets', phases: [
                    { id: 'ha_bakim', label: 'Hayvan Bakımı & Besleme', icon: 'pets', subPhases: [
                        { id: 's_ha1', label: 'Hayvan Bakımı', items: [
                            { id: id(), label: 'Büyükbaş hayvan (sığır/manda) bakımı', itemType: 'faaliyet', hazards: ['Hayvan tekme/çarpma yaralanması', 'Zoonoz hastalık', 'Kaygan gübre zemininde kayma'] },
                            { id: id(), label: 'Küçükbaş hayvan (koyun/keçi) bakımı', itemType: 'faaliyet', hazards: ['Hayvan çarpması', 'Zoonoz hastalık (brusella vb.)', 'Kaygan zemin'] },
                            { id: id(), label: 'Kanatlı hayvan bakımı', itemType: 'faaliyet', hazards: ['Tüy tozu soluma', 'Zoonoz hastalık (kuş gribi)', 'Kaygan zemin'] },
                            { id: id(), label: 'Hayvan ağırlık ölçümü ve kısıtlama', itemType: 'faaliyet', hazards: ['Hayvan çarpması/tekme', 'El/kol sıkışması', 'Zoonoz bulaşı'] },
                            { id: id(), label: 'Yem hazırlama ve dağıtımı (miks/silaj)', itemType: 'faaliyet', hazards: ['Silaj gazı (CO2)', 'Döner karıştırıcı sıkışması', 'Kas-iskelet zorlanması'] },
                            { id: id(), label: 'Sağım makinesi ile sütçülük', itemType: 'faaliyet', hazards: ['Elektrik çarpması (ıslak ortam)', 'Hayvan tekme', 'Kas-iskelet zorlanması (tekrarlayan)'] },
                            { id: id(), label: 'Ahır/ağıl/kapalı bölme', itemType: 'ortam', hazards: ['Amonyak/metan gaz birikimi', 'Kötü aydınlatma', 'Dar/kapalı alan', 'Gübre kayması'] },
                        ]},
                    ]},
                    { id: 'ha_veteriner', label: 'Veteriner Müdahale & Kesimhane', icon: 'medical_services', subPhases: [
                        { id: 's_ha2', label: 'Veteriner & Kesim', items: [
                            { id: id(), label: 'Hayvan aşılama ve ilaç uygulaması', itemType: 'faaliyet', hazards: ['İğne batması', 'Hayvan saldırısı', 'Kimyasal/ilaç maruziyeti'] },
                            { id: id(), label: 'Hayvan nakli (araç yükleme-boşaltma)', itemType: 'faaliyet', hazards: ['Hayvan çarpması', 'Ezilme', 'Kaygan rampa düşme'] },
                            { id: id(), label: 'Kesimhane kesim işlemleri', itemType: 'is', hazards: ['Kesici alet yaralanması', 'Kan/vücut sıvısı biyolojik temas', 'Kaygan kan zemininde düşme'] },
                            { id: id(), label: 'Gübre/lağım pit boşaltma', itemType: 'faaliyet', hazards: ['H2S/amonyak gaz zehirlenmesi', 'Boğulma (kapalı alan)', 'Kayma düşmesi'] },
                            { id: id(), label: 'Kesimhane soğuk hava deposu', itemType: 'ortam', hazards: ['Hipotermi', 'Soğutucu gaz kaçağı', 'Buzlu zemin düşmesi', 'Kapıda kilitlenme'] },
                        ]},
                    ]},
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
                    { id: 'gu_hazirlama', label: 'Hammadde Hazırlama & Kesme', icon: 'cut', subPhases: [
                        { id: 's_gu1', label: 'Hazırlama', items: [
                            { id: id(), label: 'Et/sebze kesme makinesi operasyonu', itemType: 'is', hazards: ['Kesici bıçak yaralanması', 'El sıkışması', 'Dönen parça kontağı', 'Gürültü'] },
                            { id: id(), label: 'Dilimleyici / parçalayıcı makine', itemType: 'is', hazards: ['El/parmak amputasyonu', 'Kesici bıçak teması', 'Beklenmedik çalışma'] },
                            { id: id(), label: 'Hamur yoğurma ve karıştırma makinesi', itemType: 'is', hazards: ['El sıkışması (kova içi)', 'Ağır yük dökmesi', 'Elektrik çarpması'] },
                            { id: id(), label: 'Elle hammadde taşıma ve hazırlama', itemType: 'is', hazards: ['Bel/omurga zorlanması', 'Kayma (ıslak zemin)', 'Düşen yük çarpması'] },
                            { id: id(), label: 'Soğuk hava deposu çalışması', itemType: 'faaliyet', hazards: ['Hipotermi', 'Soğutucu gaz (NH3/R22) kaçağı', 'Buz zeminde düşme', 'Kapı kilitleme riski'] },
                            { id: id(), label: 'Gıda işleme alanı (ıslak zemin)', itemType: 'ortam', hazards: ['Islak/kaygan zemin', 'Gürültü', 'Mikrobiyolojik kontaminasyon'] },
                        ]},
                    ]},
                    { id: 'gu_isil', label: 'Isıl İşlem & Pişirme', icon: 'local_fire_department', subPhases: [
                        { id: 's_gu2', label: 'Isıl Süreçler', items: [
                            { id: id(), label: 'Fırın operasyonu (konveksiyon/döner)', itemType: 'faaliyet', hazards: ['Sıcak yüzey yanığı', 'Yanıcı buhar birikmesi', 'Gaz kaçağı–yangın'] },
                            { id: id(), label: 'Pastörizasyon/sterilizasyon (otoklav/UHT)', itemType: 'faaliyet', hazards: ['Yüksek basınç ve sıcaklık patlaması', 'Sıcak sıvı yaralanması', 'Basınç kabı arızası'] },
                            { id: id(), label: 'Yağ fritözü operasyonu', itemType: 'faaliyet', hazards: ['Sıçrayan sıcak yağ yanığı', 'Yangın', 'Aşırı ısınma'] },
                            { id: id(), label: 'Soğutma konveyörü ve tünel', itemType: 'ekipman', hazards: ['Döner bant sıkışması', 'Soğutucu gaz kaçağı', 'Hipotermi'] },
                            { id: id(), label: 'Gıda pişirme ve ısıl işlem alanı', itemType: 'ortam', hazards: ['Yüksek sıcaklık ortamı', 'Buhar sıçraması', 'Islak/kaygan zemin', 'Yangın'] },
                        ]},
                    ]},
                    { id: 'gu_ambalaj', label: 'Ambalaj & Dolum Hattı', icon: 'inventory_2', subPhases: [
                        { id: 's_gu3', label: 'Ambalajlama', items: [
                            { id: id(), label: 'Otomatik dolum makinesi operasyonu', itemType: 'is', hazards: ['Döner/hareketli parça sıkışması', 'Sıcak dolum – yanık', 'Gürültü'] },
                            { id: id(), label: 'Vakum ambalajlama', itemType: 'is', hazards: ['El sıkışması', 'Yüksek sıcaklık (ısı sızdırmazlık)', 'Vakum odası tehlikesi'] },
                            { id: id(), label: 'Konveyör bant ile ürün taşıma', itemType: 'faaliyet', hazards: ['Döner kısım sıkışması', 'Ergonomik tekrar hareketi', 'Düşen ürün çarpması'] },
                            { id: id(), label: 'Koli bantlama ve paletleme', itemType: 'faaliyet', hazards: ['El tekrar yaralanması', 'Kas-iskelet zorlanması', 'Palet devrilmesi'] },
                            { id: id(), label: 'Ambalaj hattı gürültü ortamı', itemType: 'ortam', hazards: ['Gürültü maruziyeti (işitme kaybı)', 'Islak/kaygan zemin'] },
                        ]},
                    ]},
                    { id: 'gu_cip', label: 'Temizlik & Sanitasyon (CIP)', icon: 'cleaning_services', subPhases: [
                        { id: 's_gu4', label: 'CIP & Higyen', items: [
                            { id: id(), label: 'CIP (Cleaning-In-Place) prosesi', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Sıcak sıvı yanığı', 'Basınçlı sıvı yaralanması'] },
                            { id: id(), label: 'Ekipman manuel temizliği (söküm/yıkama)', itemType: 'faaliyet', hazards: ['Kimyasal cilt/göz tahrişi', 'Keskin ekipman kenarı yaralanması', 'Islak zemin düşmesi'] },
                            { id: id(), label: 'Dezenfektan (klorin/kuaterner amonyum) kullanımı', itemType: 'faaliyet', hazards: ['Kimyasal soluma', 'Cilt/göz tahrişi', 'Reaktif karışım'] },
                            { id: id(), label: 'Sanitasyon alanı (sürekli ıslak zemin)', itemType: 'ortam', hazards: ['Islak zemin düşmesi', 'Elektrik çarpması', 'Kimyasal duman birikimi'] },
                        ]},
                    ]},
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
                    { id: 'og_ekran', label: 'Ekranlı Araç & Ergonomi', icon: 'monitor', subPhases: [
                        { id: 's_og1', label: 'Ekran & İş İstasyonu', items: [
                            { id: id(), label: 'Uzun süreli bilgisayar kullanımı', itemType: 'faaliyet', hazards: ['Göz yorgunluğu (VDU sendromu)', 'Boyun/bel kas zorlanması', 'Karpal tünel sendromu'] },
                            { id: id(), label: 'Uygunsuz ofis sandalyesi / masa düzeni', itemType: 'ortam', hazards: ['Bel/boyun hastalıkları', 'Ergonomik yetersizlik', 'Kas-iskelet bozuklukları'] },
                            { id: id(), label: 'Yazıcı / fotokopi makinesi kullanımı', itemType: 'faaliyet', hazards: ['Ozon/toner tozu soluma', 'Isıl yanık (fuser)', 'Elektrik çarpması'] },
                            { id: id(), label: 'Çoklu monitör ve kablo düzeni', itemType: 'ortam', hazards: ['Kablo takılma düşmesi', 'Elektrik çarpması', 'Yetersiz aydınlatma'] },
                            { id: id(), label: 'Uzaktan/evden çalışma ergonomisi', itemType: 'faaliyet', hazards: ['Uygunsuz çalışma ortamı', 'Yalnız çalışma riski', 'Gözetim eksikliği'] },
                        ]},
                    ]},
                    { id: 'og_yangin', label: 'Yangın & Tahliye', icon: 'emergency', subPhases: [
                        { id: 's_og2', label: 'Yangın Güvenliği', items: [
                            { id: id(), label: 'Elektrik kaçağı / kablo aşırı yükü', itemType: 'ortam', hazards: ['Yangın', 'Elektrik çarpması', 'Ofis aletleri yanığı'] },
                            { id: id(), label: 'Duman dedektörü bakımı', itemType: 'faaliyet', hazards: ['Arıza tespitinde gecikme', 'Tahliye gecikmesi', 'Yasal uyumsuzluk'] },
                            { id: id(), label: 'Tahliye tatbikatı', itemType: 'faaliyet', hazards: ['Eksik personel katılımı', 'Prosedür bilinmezliği', 'Asansör kullanımı riski'] },
                            { id: id(), label: 'Ofis mutfağı (çay odası) yangın riski', itemType: 'ortam', hazards: ['Unattended microdalga/su ısıtıcısı yangını', 'Yağ yangını', 'Elektrik çarpması'] },
                            { id: id(), label: 'Elektrik panosu / UPS odası', itemType: 'ortam', hazards: ['Ark flash', 'Yangın', 'Akü gaz sızıntısı', 'Yetkisiz erişim'] },
                        ]},
                    ]},
                    { id: 'og_fiziksel', label: 'Fiziksel Tehlikeler & Dolaşım', icon: 'directions_walk', subPhases: [
                        { id: 's_og3', label: 'Fiziksel Riskler', items: [
                            { id: id(), label: 'Ofis merdiven ve koridor kullanımı', itemType: 'ortam', hazards: ['Düşme', 'Kayma (ıslak zemin)', 'Engel takılması'] },
                            { id: id(), label: 'Dosya dolabı ve raf devrilmesi', itemType: 'ortam', hazards: ['Dolap devrilmesi', 'Düşen dosya çarpması', 'Kapalı parmak sıkışması'] },
                            { id: id(), label: 'Çay/kahve gibi sıcak içecek taşıma', itemType: 'faaliyet', hazards: ['Sıcak içecek yanığı', 'Döküntü kayma düşme'] },
                            { id: id(), label: 'Ağır kutu / kağıt kaldırma ve taşıma', itemType: 'is', hazards: ['Bel yaralanması', 'Yük düşmesi', 'Parmak sıkışması'] },
                            { id: id(), label: 'İş stresi ve psikososyal riskler', itemType: 'faaliyet', hazards: ['Tükenmişlik', 'Yüksek işyeri stresi', 'Psikosomatik hastalıklar', 'Devamsızlık'] },
                            { id: id(), label: 'Açık plan ofis akustik ortamı', itemType: 'ortam', hazards: ['Gürültü maruziyeti', 'Konsantrasyon bozukluğu', 'Verimlilik düşüşü'] },
                        ]},
                    ]},
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
    },

    // ══════════════════════════════════════════════════════════════════════════
    // DOĞALGAZ DAĞITIMI (NACE 35.22)
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'dogalgaz_dagitim',
        label: 'Doğalgaz Dağıtımı',
        icon: 'local_fire_department',
        color: '#f97316',
        subtypeQuestion: 'Modül seçiniz:',
        subtypes: [

            // ── 1. Şebeke Varlık Yönetimi ────────────────────────────────────
            {
                id: 'dg_sebeke_varlik',
                label: 'Şebeke Varlık Yönetimi',
                icon: 'route',
                phases: [
                    {
                        id: 'dgsv_hatlar', label: 'Hat Tipleri & Envanter', icon: 'straighten',
                        subPhases: [{ id: 'dgsv_h1', label: 'Şebeke Envanteri', items: [
                            { id: id(), label: 'Çelik dağıtım hattı envanter takibi', itemType: 'faaliyet', hazards: ['Güncel olmayan hat kaydı', 'Kaçak/arıza tespitinde gecikme', 'Yasal uyumsuzluk'] },
                            { id: id(), label: 'PE dağıtım hattı envanter takibi', itemType: 'faaliyet', hazards: ['Güncel olmayan hat kaydı', 'Üçüncü taraf kazı hasarı', 'Kayıp tespitinde güçlük'] },
                            { id: id(), label: 'Orta basınç hat yönetimi', itemType: 'faaliyet', hazards: ['Basınç aşımı', 'Bölge regülatörü arızası', 'Servis kesintisi'] },
                            { id: id(), label: 'Alçak basınç hat yönetimi', itemType: 'faaliyet', hazards: ['Düşük basınç kaynaklı yanıcı cihaz arızası', 'Müşteri ihbarı yönetimi güçlüğü'] },
                            { id: id(), label: 'Servis ve bağlantı hatları envanteri', itemType: 'faaliyet', hazards: ['Güncel olmayan kayıt', 'Sorumluluğun belirsizleşmesi'] },
                            { id: id(), label: 'Servis kutuları', itemType: 'ekipman', hazards: ['Mekanik hasar', 'Gaz sızıntısı', 'Üçüncü taraf müdahalesi'] },
                            { id: id(), label: 'Vana odaları / vana grupları', itemType: 'ekipman', hazards: ['Kapalı alan tehlikeleri', 'Oksijen yetersizliği', 'Gaz birikimi', 'Su baskını'] },
                        ]}],
                    },
                    {
                        id: 'dgsv_gis', label: 'GIS & As-Built Proje', icon: 'map',
                        subPhases: [{ id: 'dgsv_g1', label: 'Proje & Kayıt Yönetimi', items: [
                            { id: id(), label: 'Hat güzergahı ve GIS kayıt güncelleme', itemType: 'faaliyet', hazards: ['Hatalı güzergah kaydı', 'Kazı hasarı riski artışı', 'Koordinat hatası'] },
                            { id: id(), label: 'As-built proje teslimi ve arşivlenmesi', itemType: 'faaliyet', hazards: ['Eksik dokümantasyon', 'Yasal yaptırım', 'Arıza müdahalesinde yanlış hat tespiti'] },
                            { id: id(), label: 'Şebeke kodlama ve numaralama sistemi', itemType: 'faaliyet', hazards: ['Kodlama hatası', 'İzlenebilirlik kaybı', 'Yanlış ekipman müdahalesi'] },
                        ]}],
                    },
                ],
            },

            // ── 2. Şebeke Yapım & Yatırım ────────────────────────────────────
            {
                id: 'dg_sebeke_yapim',
                label: 'Şebeke Yapım & Yatırım',
                icon: 'construction',
                phases: [
                    {
                        id: 'dgsy_guzergah', label: 'Güzergah Planlama & Kazı', icon: 'terrain',
                        subPhases: [{ id: 'dgsy_g1', label: 'Kazı & Hendek', items: [
                            { id: id(), label: 'Güzergah planlama ve hat işaretleme', itemType: 'faaliyet', hazards: ['Yanlış güzergah', 'Diğer altyapıya çarpma', 'Onaysız mülk girişi'] },
                            { id: id(), label: 'Hendek kazısı (ekskavatör)', itemType: 'is', hazards: ['Hendek çökmesi', 'Toprak kayması', 'İş makinesi devrilmesi', 'Yeraltı hattına çarpma', 'Personel düşmesi'] },
                            { id: id(), label: 'Yaya ve araç trafiğinin yönetimi', itemType: 'faaliyet', hazards: ['Araç-yaya çarpışması', 'Trafik kazası', 'Trafik akışının bozulması'] },
                            { id: id(), label: 'İksa ve hendek güvenliği', itemType: 'faaliyet', hazards: ['Şev göçmesi', 'Ezilme', 'Kurtarma güçlüğü'] },
                            { id: id(), label: 'Ekskavatör / iş makinesi', itemType: 'ekipman', hazards: ['Devrilme', 'Ezilme', 'Yeraltı hattı hasarı', 'Hat gerilmesi'] },
                            { id: id(), label: 'Açık hendek alanı', itemType: 'ortam', hazards: ['Personel düşmesi', 'Araç takılma', 'Yağmur/su baskını', 'Gaz birikimi'] },
                        ]}],
                    },
                    {
                        id: 'dgsy_boru', label: 'Boru İndirme & Birleştirme', icon: 'settings_input_component',
                        subPhases: [{ id: 'dgsy_b1', label: 'Boru Montajı', items: [
                            { id: id(), label: 'Boru taşıma ve hendek içine indirme', itemType: 'is', hazards: ['Yük düşmesi', 'Sıkışma/ezilme', 'Elle taşıma kas-iskelet hasarı', 'Boru sallanması'] },
                            { id: id(), label: 'PE alın füzyon kaynağı', itemType: 'is', hazards: ['Yanık (sıcak plaka teması)', 'Hatalı kaynak/kaynak kusuru', 'Gaz sızıntısı'] },
                            { id: id(), label: 'PE elektrofüzyon kaynağı', itemType: 'is', hazards: ['Elektrik çarpması', 'Yanık', 'Hatalı kaynak', 'Fitings patlaması'] },
                            { id: id(), label: 'Çelik boru kaynağı', itemType: 'is', hazards: ['Kaynak gazları/dumanı', 'UV radyasyon', 'Yangın/patlama', 'Elektrik çarpması', 'Gözlem yaralanması'] },
                            { id: id(), label: 'Kaynak makinesi (alın/elektrofüzyon)', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Yanık', 'Hatalı bağlantı'] },
                        ]}],
                    },
                    {
                        id: 'dgsy_ndt', label: 'NDT / Test & Devreye Alma', icon: 'verified',
                        subPhases: [{ id: 'dgsy_n1', label: 'Test & Muayene', items: [
                            { id: id(), label: 'Tahribatsız muayene (NDT) uygulaması', itemType: 'faaliyet', hazards: ['Radyasyon maruziyeti (RT)', 'Kimyasal maruziyet (PT)', 'Hatalı kaynak geçirmesi'] },
                            { id: id(), label: 'Basınç testi (hidrostatik/pnömatik)', itemType: 'is', hazards: ['Boru patlaması', 'Parça fırlaması', 'Ani basınç düşüşü'] },
                            { id: id(), label: 'Kaplama ve izolasyon uygulaması', itemType: 'is', hazards: ['Kimyasal maruziyet', 'Yangın (solvent bazlı)', 'Solunum riski'] },
                            { id: id(), label: 'Dolgu, sıkıştırma ve zemin düzeltme', itemType: 'is', hazards: ['Boru ezilmesi', 'Hatalı dolgu/oturma', 'Toz maruziyeti'] },
                            { id: id(), label: 'Uyarı bandı ve marker uygulaması', itemType: 'faaliyet', hazards: ['Eksik işaretleme', 'Üçüncü taraf kazı hasarı artışı'] },
                            { id: id(), label: 'Devreye alma öncesi sızdırmazlık testi', itemType: 'faaliyet', hazards: ['Gaz kaçağı', 'Parlama/patlama', 'Hatalı bağlantı'] },
                            { id: id(), label: 'Yol / tretuvar onarımı (reinstatement)', itemType: 'is', hazards: ['Kayma düşme', 'Araç çarpması', 'Yetersiz sıkıştırma/çökme'] },
                        ]}],
                    },
                ],
            },

            // ── 3. Şebeke İşletme & Rutin Saha Operasyonları ────────────────
            {
                id: 'dg_sebeke_isletme',
                label: 'Şebeke İşletme & Rutin Saha Operasyonları',
                icon: 'settings_input_component',
                phases: [
                    {
                        id: 'dgsi_canli', label: 'Canlı Hat Üzerinde Çalışma', icon: 'warning',
                        subPhases: [{ id: 'dgsi_c1', label: 'Gazlı Hat Operasyonu', items: [
                            { id: id(), label: 'Devredeki hat üzerinde müdahale', itemType: 'is', hazards: ['Gaz kaçağı', 'Parlama/patlama', 'Zehirlenme', 'Oksijen yetersizliği'] },
                            { id: id(), label: 'Hat güzergah kontrolü (yürüyüşlü)', itemType: 'faaliyet', hazards: ['Kaçak tespitinde gecikme', 'Araç çarpması (trafik)', 'Zorlu arazi koşulları'] },
                            { id: id(), label: 'Üçüncü taraf faaliyetlerinin izlenmesi', itemType: 'faaliyet', hazards: ['Kasıtsız hat hasarı', 'Yetkisiz kazı', 'Koordinasyon eksikliği'] },
                        ]}],
                    },
                    {
                        id: 'dgsi_vana', label: 'Vana Manevrası & Şebeke İzolasyonu', icon: 'valve',
                        subPhases: [{ id: 'dgsi_v1', label: 'İzolasyon & Manevra', items: [
                            { id: id(), label: 'Vana manevrası (açma/kapama)', itemType: 'is', hazards: ['Yanlış vana operasyonu', 'Basınç darbesi', 'Gaz kaçağı', 'Müşteri gaz kesintisi'] },
                            { id: id(), label: 'Şebeke izolasyonu ve segment kapatma', itemType: 'faaliyet', hazards: ['Yanlış izolasyon noktası', 'Gaz hapsedilmesi', 'Basınç birikimi'] },
                            { id: id(), label: 'Basınç takibi ve trend analizi', itemType: 'faaliyet', hazards: ['Basınç anomalisi gözden kaçırma', 'Kaçak tespitinde gecikme'] },
                            { id: id(), label: 'Hat purj ve gazsızlaştırma operasyonu', itemType: 'is', hazards: ['Gaz birikimi', 'Patlayıcı atmosfer', 'Yetersiz havalandırma', 'Parlama'] },
                            { id: id(), label: 'Şebeke basınçlandırma ve devreye alma', itemType: 'is', hazards: ['Gaz kaçağı', 'Bağlantı hataları', 'Basınç darbesi', 'Patlama'] },
                        ]}],
                    },
                ],
            },

            // ── 4. Servis Hattı & Bağlantı Hattı ────────────────────────────
            {
                id: 'dg_servis_hat',
                label: 'Servis Hattı & Bağlantı Hattı',
                icon: 'cable',
                phases: [
                    {
                        id: 'dgsh_yeni', label: 'Yeni Bağlantı & Montaj', icon: 'add_road',
                        subPhases: [{ id: 'dgsh_y1', label: 'Servis & Bağlantı', items: [
                            { id: id(), label: 'Yeni servis hattı bağlantısı', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlayıcı atmosfer', 'Yanlış bağlantı', 'Basınç kontrolsüz açılması'] },
                            { id: id(), label: 'Servis kutusu montajı', itemType: 'is', hazards: ['Mekanik hasar', 'Gaz sızıntısı', 'Elektrostatik', 'Fitings hasarı'] },
                            { id: id(), label: 'Bağlantı hattı test ve kontrolü', itemType: 'faaliyet', hazards: ['Gaz kaçağı', 'Basınç testi riski', 'Eksik test/geçirme'] },
                            { id: id(), label: 'Servis hattı değişimi', itemType: 'is', hazards: ['Canlı hat teması', 'Gaz kaçağı', 'Basınç birikimi'] },
                        ]}],
                    },
                    {
                        id: 'dgsh_bakim', label: 'Bakım, Onarım & Arıza', icon: 'build',
                        subPhases: [{ id: 'dgsh_b1', label: 'Arıza & Bakım', items: [
                            { id: id(), label: 'Servis hattı arıza onarımı', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlama', 'Zehirlenme', 'Yangın'] },
                            { id: id(), label: 'Servis hattı iyileştirme', itemType: 'is', hazards: ['Mevcut hatta müdahale', 'Gaz izolasyonu güçlüğü'] },
                            { id: id(), label: 'Kutu ve bağlantı ekipmanı bakımı', itemType: 'is', hazards: ['Gaz sızıntısı', 'Mekanik hasar', 'Vana sıkışması'] },
                        ]}],
                    },
                ],
            },

            // ── 5. İstasyonlar & Basınç Düşürme-Ölçüm ───────────────────────
            {
                id: 'dg_istasyon',
                label: 'İstasyonlar & Basınç Düşürme-Ölçüm',
                icon: 'tune',
                phases: [

                    // ── RMS-A ──────────────────────────────────────────────────
                    {
                        id: 'dgis_rmsa', label: 'RMS-A — Ana Basınç Düşürme İstasyonu', icon: 'account_tree',
                        subPhases: [
                            { id: 'dgis_rmsa_1', label: 'Rutin Kontrol & Operasyon', items: [
                                { id: id(), label: 'Günlük saha kontrol turu (bina içi/dışı)', itemType: 'faaliyet', hazards: ['Gaz kaçağı tespitinde gecikme', 'Kapalı alan gaz birikimi', 'Yetkisiz giriş gözden kaçırma'] },
                                { id: id(), label: 'Giriş basıncı ve çıkış basıncı takibi', itemType: 'faaliyet', hazards: ['Basınç aşımı / sapması', 'Regülatör arızası', 'Müşteri tarafı yüksek basınç'] },
                                { id: id(), label: 'Gaz kaçak taraması (sabunlu su / dedektör)', itemType: 'faaliyet', hazards: ['Patlayıcı atmosfer', 'Ateşleme kaynağı riski', 'Sensör yanlış negatif'] },
                                { id: id(), label: 'Odorizasyon sistemi kontrolü', itemType: 'faaliyet', hazards: ['TBM kimyasal maruziyet', 'Koku cihazı sızıntısı', 'Göz/cilt tahrişi'] },
                                { id: id(), label: 'Isıtma sistemi (su banyosu / elektrikli ısıtıcı) kontrolü', itemType: 'faaliyet', hazards: ['Yangın', 'Gaz kaçağı', 'Donma-kaynaklı boru/regülatör arızası'] },
                                { id: id(), label: 'Telemetri / SCADA veri doğrulama', itemType: 'faaliyet', hazards: ['Yanlış okuma', 'Alarm gözden kaçırma', 'İletişim kopukluğu'] },
                                { id: id(), label: 'RMS-A istasyon binası (kapalı/yarı açık)', itemType: 'ortam', hazards: ['Gaz birikimi/patlama', 'Yetersiz havalandırma', 'Donucu sıcaklık etkisi', 'Yetkisiz erişim'] },
                            ]},
                            { id: 'dgis_rmsa_2', label: 'Ekipman Bakımı & Arıza', items: [
                                { id: id(), label: 'Basınç regülatörü bakımı (işletmede/devre dışı)', itemType: 'is', hazards: ['Basınç altında müdahale', 'Membran yırtılması', 'Gaz salınımı', 'Yanlış ayar'] },
                                { id: id(), label: 'Emniyet kapama vanası (EKV/SSV) testi ve bakımı', itemType: 'faaliyet', hazards: ['Yanlış tetikleme – gaz kesintisi', 'Valf sıkışması/açılmaması', 'Güvenlik test prosedürü ihlali'] },
                                { id: id(), label: 'Filtre elemanı değişimi', itemType: 'is', hazards: ['Basınç altı gaz salınımı', 'Kimyasal maruziyet (filtre içeriği)', 'Ezilme/sıkışma (flanş açma)'] },
                                { id: id(), label: 'Emniyet tahliye vanası (PRV) testi', itemType: 'faaliyet', hazards: ['Kontrolsüz gaz salınımı', 'Patlama', 'Gaz bulutunun tutuşması'] },
                                { id: id(), label: 'Su banyosu ısıtıcısı bakımı', itemType: 'faaliyet', hazards: ['Gaz kaçağı', 'Yanık', 'Su sızıntısı – kayma', 'Elektrik çarpması'] },
                                { id: id(), label: 'Bypass hattı açma-kapama prosedürü', itemType: 'is', hazards: ['Yanlış sıralama – basınç darbesi', 'Gaz kaçağı', 'Kontrol kaybı'] },
                                { id: id(), label: 'Basınçlı gaz borusu / flanş bağlantıları', itemType: 'ekipman', hazards: ['Gaz sızıntısı', 'Cıvata/conta hasar', 'Basınç darbesi yaralanması'] },
                            ]},
                            { id: 'dgis_rmsa_3', label: 'Devreye Alma & Kapatma', items: [
                                { id: id(), label: 'İstasyonu ilk kez devreye alma (commissioning)', itemType: 'is', hazards: ['Gaz ortamında ateşleme kaynağı', 'Basınç testi patlaması', 'Hatalı bağlantı', 'Personel sayım eksikliği'] },
                                { id: id(), label: 'Planlı kapatma ve tahliye prosedürü', itemType: 'faaliyet', hazards: ['Hatalı vana sıralaması', 'Hattaki kalıntı gaz', 'Müşteri bildirimi eksikliği'] },
                                { id: id(), label: 'Acil kapatma (ESD) devreye alma', itemType: 'faaliyet', hazards: ['Yanlış ESD tetikleme', 'Komşu ekipman etkilenmesi', 'Yeniden devreye alma hatası'] },
                                { id: id(), label: 'Hat nitrojen tahliyesi ve temizleme', itemType: 'is', hazards: ['Oksijen yetersizliği (N2 boğulma)', 'Basınç test ekipmanı hata', 'Kapalı alan girişi'] },
                            ]},
                        ],
                    },

                    // ── Bölge Regülatörü (BR) ──────────────────────────────────
                    {
                        id: 'dgis_br', label: 'BR — Bölge Regülatörü (Yol Üstü)', icon: 'settings_input_component',
                        subPhases: [
                            { id: 'dgis_br_1', label: 'Rutin Kontrol', items: [
                                { id: id(), label: 'Bölge regülatörü (BR) rutin kontrol', itemType: 'faaliyet', hazards: ['Gaz kaçağı tespitinde gecikme', 'Trafik riski (yol kenarı)', 'Kilit/güvenlik eksikliği'] },
                                { id: id(), label: 'Çıkış basıncı ölçümü ve kaydı', itemType: 'faaliyet', hazards: ['Basınç sapması fark edilmeme', 'Alçak basınç hattında müşteri riski'] },
                                { id: id(), label: 'Filtre diferansiyel basınç kontrolü', itemType: 'faaliyet', hazards: ['Tıkanma fark edilmemesi', 'Aşırı filtre basınç farkı – boru hasarı'] },
                                { id: id(), label: 'Bölge regülatörü kabini / kutusu', itemType: 'ortam', hazards: ['Kapalı alan gaz birikimi', 'Su baskını', 'Yetkisiz erişim', 'Trafik darbesi'] },
                            ]},
                            { id: 'dgis_br_2', label: 'Bakım & Değişim', items: [
                                { id: id(), label: 'BR regülatör membran değişimi', itemType: 'is', hazards: ['Basınç altı gaz salınımı', 'Yanıcı gaz maruziyeti', 'Yanlış montaj – basınç aşımı'] },
                                { id: id(), label: 'BR filtre elemanı değişimi', itemType: 'is', hazards: ['Gaz salınımı', 'Kimyasal maruziyet', 'Ezilme (flanş) '] },
                                { id: id(), label: 'Emniyet kapama vanası (EKV) testi', itemType: 'faaliyet', hazards: ['Yanlış tetik', 'Komşu müşteri kesilmesi', 'Valf sıkışması'] },
                                { id: id(), label: 'BR yol kenarı çalışması (trafik güvenliği)', itemType: 'faaliyet', hazards: ['Araç çarpması', 'Trafik kazası', 'Kazı sınırı ihlali'] },
                                { id: id(), label: 'Basınç test cihazı bağlantısı (mano/manometre)', itemType: 'ekipman', hazards: ['Yüksek basınçlı bağlantı açılması', 'Gösterge patlaması', 'Gaz sızdırma'] },
                            ]},
                        ],
                    },

                    // ── CNG İstasyonu ──────────────────────────────────────────
                    {
                        id: 'dgis_cng', label: 'CNG — Sıkıştırılmış Doğalgaz İstasyonu', icon: 'compress',
                        subPhases: [
                            { id: 'dgis_cng_1', label: 'Kompresör & Depolama', items: [
                                { id: id(), label: 'CNG kompresörü çalıştırma ve durdurma', itemType: 'faaliyet', hazards: ['Yüksek basınçlı gaz kaçağı', 'Kompresör aşırı ısınma', 'Titreşim-gürültü maruziyeti'] },
                                { id: id(), label: 'Yüksek basınçlı depolama silindiri kontrolü', itemType: 'faaliyet', hazards: ['Silindir/bağlantı çatlağı', 'Yüksek basınç patlaması', 'Yangın – silindir fırlaması (BLEVE)'] },
                                { id: id(), label: 'Kompresör yağ ve soğutma sistemi bakımı', itemType: 'faaliyet', hazards: ['Yüksek sıcaklık yanığı', 'Yağ/gaz karışımı yangını', 'Ekipman kilidini açma hatası'] },
                                { id: id(), label: 'Basınç tahliye vanası (PRV) test ve bakımı', itemType: 'faaliyet', hazards: ['Kontrolsüz yüksek basınçlı gaz salınımı', 'Ateşleme kaynakları', 'Patlama'] },
                                { id: id(), label: 'Depolama kabini / tüp demeti alanı', itemType: 'ortam', hazards: ['Gaz birikimi/patlama', 'Yüksek basınç ortamı', 'Yangın – BLEVE riski', 'Yetkisiz erişim'] },
                            ]},
                            { id: 'dgis_cng_2', label: 'Dolum Operasyonu', items: [
                                { id: id(), label: 'Araç yakıt tankı dolumu (yavaş/hızlı dolum)', itemType: 'is', hazards: ['Yanlış bağlantı – gaz kaçağı', 'Araç tankı aşırı basıncı', 'Statik elektrik kıvılcımı', 'Araç hareketi riski'] },
                                { id: id(), label: 'Tüp (cylinder) dolum prosedürü', itemType: 'is', hazards: ['Tüp aşırı doldurma', 'Tüp bağlantı kaçağı', 'Düşen tüp ezilmesi', 'Yüksek basınç yaralanması'] },
                                { id: id(), label: 'Dolum hortumuları ve bağlantı fitingleri kontrolü', itemType: 'faaliyet', hazards: ['Hortum çatlağı/patlaması', 'Yüksek basınçlı gaz fırlaması', 'Bağlantı sökülmesi'] },
                                { id: id(), label: 'Araç girişi / dolum alanı', itemType: 'ortam', hazards: ['Araç-personel çarpışması', 'Gaz birikimi', 'Statik elektrik', 'Sigara/telefon yasağı ihlali'] },
                            ]},
                            { id: 'dgis_cng_3', label: 'Güvenlik & Acil Durum', items: [
                                { id: id(), label: 'Gaz dedektörü (sabit/portatif) kalibrasyonu', itemType: 'faaliyet', hazards: ['Kalibrasyon hatası', 'Yanlış alarm', 'Cihaz arızası – alarm çalışmama'] },
                                { id: id(), label: 'Yangın söndürme sistemi (kuru toz/CO2) kontrolü', itemType: 'faaliyet', hazards: ['Sistem arızası', 'Yanlış tetikleme', 'Yetersiz güçte söndürme'] },
                                { id: id(), label: 'Acil durdurma (e-stop) testi', itemType: 'faaliyet', hazards: ['E-stop arızası', 'Yeniden devreye alma hatası', 'Sistemin kapanmaması'] },
                                { id: id(), label: 'Elektrostatik topraklama bağlantısı', itemType: 'ekipman', hazards: ['Statik elektrik birikimi – kıvılcım', 'Bağlantı kopmış – fark edilmeme'] },
                                { id: id(), label: 'CNG istasyon alanı (ATEX/Ex zonlar)', itemType: 'ortam', hazards: ['Ex zon ihlali (cep tel, ateş)', 'Yetersiz işaretleme', 'Yetkisiz araç girişi'] },
                            ]},
                        ],
                    },

                    // ── LNG İstasyonu ──────────────────────────────────────────
                    {
                        id: 'dgis_lng', label: 'LNG — Sıvılaştırılmış Doğalgaz İstasyonu', icon: 'ac_unit',
                        subPhases: [
                            { id: 'dgis_lng_1', label: 'LNG Depolama & Transfer', items: [
                                { id: id(), label: 'Kriojenik LNG tank doldurma (TIR/tanker transferi)', itemType: 'is', hazards: ['Kriojenik yanık (-162°C temas)', 'Bağlantı kaçağı – LNG buharlaşma', 'Yüksek basınç darbesi', 'Tanker statik elektriği'] },
                                { id: id(), label: 'LNG depolama tankı basınç takibi', itemType: 'faaliyet', hazards: ['Aşırı buharlaşma – PRV açılımı', 'Vakum/basınç dalgalanması', 'Tank mekanik bütünlüğü'] },
                                { id: id(), label: 'Kriojenik pompa operasyonu', itemType: 'faaliyet', hazards: ['Pompanın donması/blokajı', 'Kavitasyon hasarı', 'Kriojenik sıvı sıçraması'] },
                                { id: id(), label: 'Transfer hortumu / bağlantı flanşı', itemType: 'ekipman', hazards: ['Kriojenik yanık', 'Yüksek basınçlı sıvı fırlaması', 'Hortum donarak kırılması'] },
                                { id: id(), label: 'LNG tank çevresi (kriojenik ortam)', itemType: 'ortam', hazards: ['Kriojenik yanık', 'Buharlaşan metan birikimi – patlama', 'Oksijen deplasmanı – boğulma'] },
                            ]},
                            { id: 'dgis_lng_2', label: 'Gazlaştırma & Dağıtım', items: [
                                { id: id(), label: 'Atmosferik/su banyosu gazlaştırıcı operasyonu', itemType: 'faaliyet', hazards: ['Donma – buz oluşumu', 'Yüksek basınçlı gaz salınımı', 'Aşırı soğutma nedeniyle çatlak'] },
                                { id: id(), label: 'Gaz ısıtıcısı / ısı eşanjörü bakımı', itemType: 'faaliyet', hazards: ['Yanık (sıcak yüzey)', 'Gaz sızıntısı', 'Donma hasarı', 'Tıkanma'] },
                                { id: id(), label: 'Küçük ölçekli LNG yükleme (semitrailer dolumu)', itemType: 'is', hazards: ['Kriojenik yanık', 'Dolum hatası – taşma', 'Araç hareketi riski', 'Statik elektrik'] },
                                { id: id(), label: 'LNG gazlaştırma çalışma alanı', itemType: 'ortam', hazards: ['Kriojenik yüzeyler', 'Gaz bulutu birikimi', 'Donmuş zemin düşmesi', 'Buz/kırağı kayma riski'] },
                            ]},
                            { id: 'dgis_lng_3', label: 'Güvenlik & KKD', items: [
                                { id: id(), label: 'Kriojenik KKD kullanımı (yüz siperliği, kriyo eldiven)', itemType: 'faaliyet', hazards: ['Yetersiz KKD – kriojenik yanık', 'Yanlış KKD seçimi', 'KKD bakım eksikliği'] },
                                { id: id(), label: 'Metan gaz dedektörü kalibrasyonu', itemType: 'faaliyet', hazards: ['Kalibrasyon hatası', 'Alarm çalışmama', 'Patlayıcı atmosfer fark edilmeme'] },
                                { id: id(), label: 'İlk yardım – kriojenik yanık müdahalesi', itemType: 'faaliyet', hazards: ['Yanlış müdahale (su uygulanamaz)', 'Yaralının soğuk ortamda beklemesi', 'Acil servis gecikmesi'] },
                                { id: id(), label: 'LNG döküntü havuzu (spill containment)', itemType: 'ortam', hazards: ['Kriojenik sıvı yayılması', 'Gaz bulutu', 'Zemin hasarı (termal şok)'] },
                            ]},
                        ],
                    },

                    // ── RMS-C Müşteri İstasyonu ────────────────────────────────
                    {
                        id: 'dgis_rmsc', label: 'RMS-C — Müşteri / Abonelik İstasyonu', icon: 'home',
                        subPhases: [
                            { id: 'dgis_rmsc_1', label: 'Bağlantı & Devreye Alma', items: [
                                { id: id(), label: 'Müşteri sayaç ve regülatör montajı', itemType: 'is', hazards: ['Gaz kaçağı', 'Basınçlı bağlantı hatası', 'Müşteri tesisatı uygunsuzluğu'] },
                                { id: id(), label: 'Gaz açma prosedürü (ilk gaz verme)', itemType: 'faaliyet', hazards: ['Açık iç tesisat valfı', 'Gaz birikimi – patlama', 'Yetersiz havalandırma', 'Alev geri tepmesi'] },
                                { id: id(), label: 'Sızdırmazlık testi (sabunlu su / cihaz ile)', itemType: 'faaliyet', hazards: ['Gaz kaçağı gözden kaçırma', 'Ateşleme kaynağı', 'Basınç testi hatalı uygulaması'] },
                                { id: id(), label: 'Servis hattı bağlantısı ve topraklama', itemType: 'is', hazards: ['Elektroliz / katodik koruma hatası', 'Gaz kaçağı', 'PE boru hasar riski'] },
                                { id: id(), label: 'Müşteri iç tesisat ve cihaz kontrolü', itemType: 'faaliyet', hazards: ['Hatalı cihaz bağlantısı', 'CO oluşumu (bacasız cihaz)', 'Yetkisiz cihaz'] },
                            ]},
                            { id: 'dgis_rmsc_2', label: 'Sayaç & Ölçüm Yönetimi', items: [
                                { id: id(), label: 'Sayaç değişimi (basınç altında)', itemType: 'is', hazards: ['Gaz salınımı', 'Yangın/patlama riski', 'Yanlış sayaç tipi/kapasitesi'] },
                                { id: id(), label: 'Sayaç kalibrasyon ve test', itemType: 'faaliyet', hazards: ['Kalibrasyon hatası', 'Ticari kayıp/fazla fatura', 'Test ekipmanı bağlantı kaçağı'] },
                                { id: id(), label: 'Endeks okuma ve veri doğrulama', itemType: 'faaliyet', hazards: ['Kayıt hatası', 'Uzaktan okuma cihazı arızası', 'Müşteri sahası erişim riski'] },
                                { id: id(), label: 'Müşteri ihbarı değerlendirme (düşük basınç/gaz yok)', itemType: 'faaliyet', hazards: ['Gaz kesintisi – istem dışı giriş', 'İç tesisat problemi gözden kaçırma', 'Komşu müşteri etkilenmesi'] },
                            ]},
                            { id: 'dgis_rmsc_3', label: 'Müşteri Sahası Güvenliği', items: [
                                { id: id(), label: 'Endüstriyel müşteri (fabrika/tesis) istasyonu denetimi', itemType: 'faaliyet', hazards: ['Yüksek kapasite bağlantısı aşımı', 'Gaz yakıcı patlama', 'CO birikimi'] },
                                { id: id(), label: 'Müşteri iç tesisat kontrolü (bacalı/bacasız cihazlar)', itemType: 'faaliyet', hazards: ['CO zehirlenmesi (yetersiz havalandırma)', 'Gaz sızıntısı', 'Baca tıkanması'] },
                                { id: id(), label: 'Gaz kaçağı müdahalesi müşteri sahası', itemType: 'is', hazards: ['Kapalı alan gaz birikimi', 'Patlama/yangın', 'Müşteri panik riski', 'Müşteriyle çatışma'] },
                                { id: id(), label: 'Kesme ve yeniden bağlama işlemi', itemType: 'is', hazards: ['Müşteri sahası yetkisiz girişi', 'Enerji izolasyon hatası', 'Gaz kaçağı yeniden bağlamada'] },
                                { id: id(), label: 'Müşteri binası (konut/iş yeri)', itemType: 'ortam', hazards: ['CO birikimi', 'Gaz kaçağı', 'Kapalı alan', 'Müşteri kaynaklı ateşleme kaynakları'] },
                            ]},
                        ],
                    },

                ],
            },

            // ── 6. Sevkiyat Kontrol Merkezi / SCADA ──────────────────────────
            {
                id: 'dg_scada',
                label: 'Sevkiyat Kontrol Merkezi / SCADA',
                icon: 'monitor',
                phases: [
                    {
                        id: 'dgsc_op', label: 'SCADA İzleme & Alarm Yönetimi', icon: 'bar_chart',
                        subPhases: [{ id: 'dgsc_o1', label: 'Kontrol Merkezi Operasyonu', items: [
                            { id: id(), label: 'SCADA sistem izleme (vardiyalı)', itemType: 'faaliyet', hazards: ['Alarm yorgunluğu', 'Kritik alarm gözden kaçırma', 'Vardiya devir hatası'] },
                            { id: id(), label: 'Alarm yönetimi ve eskalasyon', itemType: 'faaliyet', hazards: ['Yanlış önceliklendirme', 'Gecikmiş müdahale', 'İletişim kopukluğu'] },
                            { id: id(), label: 'Uzaktan vana / istasyon kumandası', itemType: 'faaliyet', hazards: ['Yanlış komut', 'Bağlantı kesintisi', 'İnsan hatası'] },
                            { id: id(), label: 'Basınç ve debi trend takibi', itemType: 'faaliyet', hazards: ['Anomali gözden kaçırma', 'Telemetri gecikmesi'] },
                            { id: id(), label: 'Telemetri sürekliliği ve haberleşme', itemType: 'faaliyet', hazards: ['Telemetri kesintisi', 'Kör nokta', 'Siber saldırı'] },
                        ]}],
                    },
                    {
                        id: 'dgsc_infra', label: 'Altyapı & Güvenlik', icon: 'security',
                        subPhases: [{ id: 'dgsc_i1', label: 'Sistem Altyapısı', items: [
                            { id: id(), label: 'UPS / yedek güç sistemi', itemType: 'ekipman', hazards: ['Güç kesintisi', 'Batarya arızası', 'Yangın (batarya termik kaçağı)'] },
                            { id: id(), label: 'Jeneratör operasyonu (kontrol merkezi)', itemType: 'ekipman', hazards: ['Egzoz gazı (CO zehirlenmesi)', 'Yangın/yakıt sızıntısı', 'Gürültü'] },
                            { id: id(), label: 'Siber güvenlik temas noktaları', itemType: 'faaliyet', hazards: ['Yetkisiz erişim', 'Kötü amaçlı yazılım', 'Şebeke manipülasyonu'] },
                            { id: id(), label: 'Kontrol merkezi alanı', itemType: 'ortam', hazards: ['Ergonomi/uzun oturma', 'Ekran ışığı', 'Stres/yorgunluk'] },
                        ]}],
                    },
                ],
            },

            // ── 7. Acil Müdahale, Kaçak & Arıza ─────────────────────────────
            {
                id: 'dg_acil_mudahale',
                label: 'Acil Müdahale, Kaçak & Arıza',
                icon: 'emergency',
                phases: [
                    {
                        id: 'dgam_ihbar', label: 'İhbar, Kaçak Arama & Tespit', icon: 'notification_important',
                        subPhases: [{ id: 'dgam_i1', label: 'Kaçak & Tespit', items: [
                            { id: id(), label: 'Gaz kaçağı ihbarının değerlendirilmesi', itemType: 'faaliyet', hazards: ['Geç müdahale', 'Yanlış değerlendirme', 'Patlama/yangın'] },
                            { id: id(), label: 'Kaçak arama (gaz dedektörü ile)', itemType: 'is', hazards: ['Patlayıcı atmosfer', 'Parlama', 'Zehirlenme', 'Bilinçsizce ateşleme kaynağı getirme'] },
                            { id: id(), label: 'Ortam ölçümü (LEL, O2, CO)', itemType: 'faaliyet', hazards: ['Yanıltıcı okuma', 'Kalibrasyon hatası', 'Oksijen yetersizliği gözden kaçırma'] },
                            { id: id(), label: 'Gaz dedektörü (el tipi/sabit)', itemType: 'ekipman', hazards: ['Pil tükenmesi', 'Yanlış alarm', 'Kalibrasyon dışı cihaz'] },
                        ]}],
                    },
                    {
                        id: 'dgam_mudahale', label: 'Müdahale & Koordinasyon', icon: 'fire_truck',
                        subPhases: [{ id: 'dgam_m1', label: 'Acil Operasyon', items: [
                            { id: id(), label: 'Patlama / yangın sonrası emniyet alma', itemType: 'faaliyet', hazards: ['İkincil patlama', 'Yapı çökmesi', 'Personel yaralanması', 'Gaz beslenmesinin sürmesi'] },
                            { id: id(), label: 'Hat hasarı acil müdahalesi', itemType: 'is', hazards: ['Kontrolsüz gaz salınımı', 'Yangın/patlama', 'Kazı sahası riski'] },
                            { id: id(), label: 'Kazı hasarı müdahalesi (3. taraf)', itemType: 'is', hazards: ['Hasar genişlemesi', 'Gaz kaçağı artışı', 'Yetersiz izolasyon'] },
                            { id: id(), label: 'Gaz kesme ve müşteri tahliyesi', itemType: 'faaliyet', hazards: ['Yanlış segment kapatma', 'Yetkisiz alanlarda gaz kalması', 'Müşteri gaz cihazı açık bırakma'] },
                            { id: id(), label: 'Emniyet çemberi oluşturma ve yönetimi', itemType: 'faaliyet', hazards: ['Yetersiz çember mesafesi', 'Kalabalık kontrolü', 'Ateşleme kaynakları'] },
                            { id: id(), label: 'İtfaiye / AFAD / belediye koordinasyonu', itemType: 'faaliyet', hazards: ['Koordinasyon hatası', 'Yanlış bilgi paylaşımı', 'Geç ulaşma'] },
                            { id: id(), label: 'Olay sonrası kök neden analizi', itemType: 'faaliyet', hazards: ['Eksik analiz', 'Tekrarlayan kaza', 'Yasal bildirim ihlali'] },
                        ]}],
                    },
                ],
            },

            // ── 8. İç Tesisat Proje, Kontrol & Gaz Açma ─────────────────────
            {
                id: 'dg_ic_tesisat',
                label: 'İç Tesisat Proje, Kontrol & Gaz Açma',
                icon: 'plumbing',
                phases: [
                    {
                        id: 'dgit_proje', label: 'Proje & Onay Süreci', icon: 'description',
                        subPhases: [{ id: 'dgit_p1', label: 'Proje Onayı', items: [
                            { id: id(), label: 'Ön proje ve iç tesisat proje onayı', itemType: 'faaliyet', hazards: ['Eksik teknik inceleme', 'Uygunsuz proje onayı', 'Yasal sorumluluk'] },
                            { id: id(), label: 'Sertifikalı firma süreç takibi', itemType: 'faaliyet', hazards: ['Yetkisiz tesisat firması', 'Standart dışı montaj', 'Kayıt eksikliği'] },
                            { id: id(), label: 'Tadilat süreçleri ve onay yönetimi', itemType: 'faaliyet', hazards: ['Onaysız değişiklik', 'Mevcut tesisata müdahale riski'] },
                        ]}],
                    },
                    {
                        id: 'dgit_kontrol', label: 'Saha Kontrol & Test', icon: 'fact_check',
                        subPhases: [{ id: 'dgit_k1', label: 'Kontrol & Gaz Açma', items: [
                            { id: id(), label: 'Saha kontrolü (tesisat güzergah ve montaj)', itemType: 'faaliyet', hazards: ['Gözden kaçan uygunsuzluk', 'Gaz açma sonrası kaçak riski'] },
                            { id: id(), label: 'Sızdırmazlık testi doğrulama', itemType: 'faaliyet', hazards: ['Yetersiz test süresi', 'Basınç düşüşü gözden kaçırma', 'Gaz açılması sonrası kaçak'] },
                            { id: id(), label: 'Gaz açma operasyonu', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlama', 'Müşteri cihazı açık unutulma', 'Yanlış sıra açma'] },
                            { id: id(), label: 'Yakıcı cihaz devreye alma kontrolü', itemType: 'faaliyet', hazards: ['Geri tepme/alev geri tepmesi', 'CO oluşumu', 'Hatalı bağlantı'] },
                            { id: id(), label: 'Devreye alma tutanağı düzenlenmesi', itemType: 'faaliyet', hazards: ['Eksik kayıt', 'Yasal yaptırım', 'İzlenebilirlik kaybı'] },
                        ]}],
                    },
                ],
            },

            // ── 9. Abonelik, Sayaç & Müşteri Sahası ─────────────────────────
            {
                id: 'dg_abone_sayac',
                label: 'Abonelik, Sayaç & Müşteri Sahası',
                icon: 'speed',
                phases: [
                    {
                        id: 'dgas_abone', label: 'Abonelik & Sayaç İşlemleri', icon: 'person_add',
                        subPhases: [{ id: 'dgas_a1', label: 'Abonelik & Sayaç', items: [
                            { id: id(), label: 'Yeni abonelik açma (ilk bağlantı sahası)', itemType: 'faaliyet', hazards: ['Müşteri güvenlik bilgisinin eksik verilmesi', 'Kaçak tespit riski'] },
                            { id: id(), label: 'Sayaç montajı', itemType: 'is', hazards: ['Gaz kaçağı', 'Mekanik hasar', 'Yanlış montaj'] },
                            { id: id(), label: 'Sayaç söküm ve değişimi', itemType: 'is', hazards: ['Gaz kaçağı', 'Basınçlı gaz salınımı', 'El aleti yaralanması'] },
                            { id: id(), label: 'Regülatör ve sayaç çevresi kontrolü', itemType: 'faaliyet', hazards: ['Gaz birikimi', 'Hasar/tahribat', 'Yetersiz havalandırma'] },
                            { id: id(), label: 'Kaçak kullanım / usulsüz kullanım sahası', itemType: 'faaliyet', hazards: ['Fiziksel müdahale riski', 'Gaz kaçağı', 'Kişisel güvenlik riski'] },
                            { id: id(), label: 'Fesih sonrası güvenli kapama', itemType: 'is', hazards: ['Gaz kesme hatası', 'Müşteri cihazı açık bırakma', 'Yeniden açma girişimi'] },
                        ]}],
                    },
                ],
            },

            // ── 10. Katodik Koruma & Korozyon ────────────────────────────────
            {
                id: 'dg_katodik',
                label: 'Katodik Koruma & Korozyon',
                icon: 'electric_bolt',
                phases: [
                    {
                        id: 'dgkk_sistem', label: 'Katodik Koruma Sistemi', icon: 'shield',
                        subPhases: [{ id: 'dgkk_s1', label: 'Katodik Koruma', items: [
                            { id: id(), label: 'Katodik koruma istasyonu operasyonu', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Dış akım etkisi', 'Sistem arızası'] },
                            { id: id(), label: 'Test point ölçüm ve kontrolü', itemType: 'faaliyet', hazards: ['Yol kenarı trafik riski', 'Elektrik dokunma riski'] },
                            { id: id(), label: 'Potansiyel ölçümleri (hat üzeri)', itemType: 'faaliyet', hazards: ['Stray current (kaçak akım)', 'Galvanik çift oluşumu', 'Ölçüm cihazı arızası'] },
                            { id: id(), label: 'İzolasyon ekleri muayenesi', itemType: 'faaliyet', hazards: ['Elektrik ark flash', 'İzolasyon hasarı', 'Korozyon artışı'] },
                            { id: id(), label: 'Kaplama hasarı tespiti ve onarımı', itemType: 'is', hazards: ['Korozyon hızlanması', 'Yüzey aşındırıcı maruziyet', 'Çukurcuk korozyon'] },
                        ]}],
                    },
                ],
            },

            // ── 11. Kazı, Üçüncü Taraf Hasarı & Altyapı Koordinasyonu ───────
            {
                id: 'dg_kazi_uc_taraf',
                label: 'Kazı, Üçüncü Taraf Hasarı & Altyapı Koordinasyonu',
                icon: 'hardware',
                phases: [
                    {
                        id: 'dgku_izin', label: 'Kazı İzni & Planlama', icon: 'assignment',
                        subPhases: [{ id: 'dgku_i1', label: 'İzin & Koordinasyon', items: [
                            { id: id(), label: 'Kazı izni alma ve güzergah işaretleme', itemType: 'faaliyet', hazards: ['İşaretsiz hat', 'Yanlış güzergah bilgisi', 'Üçüncü taraf hasarı'] },
                            { id: id(), label: 'Belediye / altyapı koordinasyonu', itemType: 'faaliyet', hazards: ['Koordinasyon eksikliği', 'Diğer hat hasarı', 'Ruhsatsız kazı'] },
                            { id: id(), label: 'Üçüncü taraf kazı gözetimi', itemType: 'faaliyet', hazards: ['Gözetim eksikliği', 'Mekanik kazı hatası', 'Personel hasarı riski'] },
                        ]}],
                    },
                    {
                        id: 'dgku_kazi', label: 'Saha Kazı Operasyonu', icon: 'terrain',
                        subPhases: [{ id: 'dgku_k1', label: 'Kazı Faaliyetleri', items: [
                            { id: id(), label: 'Hat yakınında mekanik kazı', itemType: 'is', hazards: ['Hat hasarı/patlaması', 'Gaz kaçağı', 'Elektrik hattı hasarı', 'Ekskavatör yaralanması'] },
                            { id: id(), label: 'Yatay sondaj / yönlü delme (HDD)', itemType: 'is', hazards: ['Hat hasarı', 'Yüksek basınçlı sıvı', 'Titreşim', 'Çapraz hat teması'] },
                            { id: id(), label: 'Yol geçişleri ve kesişim noktaları', itemType: 'faaliyet', hazards: ['Trafik kazası', 'Altyapı hasarı', 'Çalışma alanı riski'] },
                            { id: id(), label: 'Acil kazı müdahalesi', itemType: 'is', hazards: ['Hızlı müdahale hataları', 'Gaz maruziyeti', 'Trafik riski', 'Stabilizasyon yetersizliği'] },
                        ]}],
                    },
                ],
            },

            // ── 12. Ölçüm, Kalibrasyon & Teknik Doğrulama ───────────────────
            {
                id: 'dg_olcum_kalibrasyon',
                label: 'Ölçüm, Kalibrasyon & Teknik Doğrulama',
                icon: 'straighten',
                phases: [
                    {
                        id: 'dgok_cihazlar', label: 'Ölçüm Cihazları & Kalibrasyon', icon: 'tune',
                        subPhases: [{ id: 'dgok_c1', label: 'Kalibrasyon', items: [
                            { id: id(), label: 'Basınç göstergesi kalibrasyon muayenesi', itemType: 'faaliyet', hazards: ['Kalibrasyon dışı cihaz', 'Hatalı basınç okuma', 'Aşırı basınç gözden kaçırma'] },
                            { id: id(), label: 'Debimetre (akış ölçer) kalibrasyon kontrolü', itemType: 'faaliyet', hazards: ['Ticari uyuşmazlık', 'Kayıp takip güçlüğü', 'Faturalama hatası'] },
                            { id: id(), label: 'Gaz dedektörü kalibrasyon doğrulama', itemType: 'faaliyet', hazards: ['Yanıltıcı alarm / alarm yok', 'Gaz kaçağı gözden kaçırma', 'Can güvenliği riski'] },
                            { id: id(), label: 'Regülatör ayar doğrulaması', itemType: 'faaliyet', hazards: ['Aşırı basınç', 'Yetersiz basınç', 'Müşteri cihazı arızası'] },
                            { id: id(), label: 'Emniyet ekipman fonksiyon testi', itemType: 'faaliyet', hazards: ['EKV çalışmama', 'Aşırı basınç kapanmaması', 'Hasar büyümesi'] },
                            { id: id(), label: 'Kalibrasyon dışı ekipman yönetimi', itemType: 'faaliyet', hazards: ['Ölçüm hatası sürmesi', 'Yasal uyumsuzluk', 'Güvensiz operasyon'] },
                        ]}],
                    },
                ],
            },

            // ── 13. Bakım-Onarım ─────────────────────────────────────────────
            {
                id: 'dg_bakim_onarim',
                label: 'Bakım-Onarım',
                icon: 'build',
                phases: [
                    {
                        id: 'dgbo_planli', label: 'Planlı & Kestirimci Bakım', icon: 'event',
                        subPhases: [{ id: 'dgbo_p1', label: 'Planlı Bakım', items: [
                            { id: id(), label: 'Regülatör planlı bakımı', itemType: 'is', hazards: ['Gaz kaçağı', 'Basınç birikimi', 'Yanlış sökme sırası'] },
                            { id: id(), label: 'Vana bakımı ve yağlama', itemType: 'is', hazards: ['Gaz sızıntısı', 'Sıkışma/ezilme', 'Kimyasal maruziyet (gres yağı)'] },
                            { id: id(), label: 'Filtre bakımı ve temizliği', itemType: 'is', hazards: ['Gaz maruziyeti', 'Parçacık fırlaması', 'Basıncın azaltılmaması'] },
                            { id: id(), label: 'İstasyon periyodik bakımı', itemType: 'faaliyet', hazards: ['Gaz birikimi (kapalı kabinde)', 'Basınç izolasyonsuz müdahale', 'Patlama'] },
                            { id: id(), label: 'Elektrik-enstrüman bakımı', itemType: 'is', hazards: ['Elektrik çarpması', 'Ark flash', 'Beklenmedik enerjilenme'] },
                        ]}],
                    },
                    {
                        id: 'dgbo_ariza', label: 'Arıza & Acil Bakım', icon: 'warning',
                        subPhases: [{ id: 'dgbo_a1', label: 'Arıza Müdahalesi', items: [
                            { id: id(), label: 'Arıza bakımı (gazlı hat üzerinde)', itemType: 'is', hazards: ['Gaz kaçağı', 'Parlama/patlama', 'Zehirlenme', 'Baskılı çalışma hataları'] },
                            { id: id(), label: 'LOTO ve enerji izolasyonu', itemType: 'faaliyet', hazards: ['Beklenmedik enerjilenme', 'Yetersiz kilitleme', 'Elektrik çarpması'] },
                            { id: id(), label: 'Purj ve gazsızlaştırma (bakım öncesi)', itemType: 'is', hazards: ['Gaz birikimi', 'Oksijen açığı (inert gaz kullanımda)', 'Patlayıcı atmosfer'] },
                            { id: id(), label: 'Yeniden devreye alma (bakım sonrası)', itemType: 'is', hazards: ['Gaz kaçağı', 'Yanlış bağlantı', 'Basınç testi eksikliği'] },
                        ]}],
                    },
                ],
            },

            // ── 14. Araç, Ekipman & Saha Lojistiği ──────────────────────────
            {
                id: 'dg_arac_ekipman',
                label: 'Araç, Ekipman & Saha Lojistiği',
                icon: 'local_shipping',
                phases: [
                    {
                        id: 'dgae_arac', label: 'Araç & Saha Ekipmanları', icon: 'directions_car',
                        subPhases: [{ id: 'dgae_a1', label: 'Araç & Ekipman', items: [
                            { id: id(), label: 'Acil müdahale aracı sefer öncesi kontrol', itemType: 'faaliyet', hazards: ['Araç arızası', 'Eksik ekipman', 'Acil gecikmesi'] },
                            { id: id(), label: 'Kazı ekskavatörü saha kullanımı', itemType: 'ekipman', hazards: ['Devrilme', 'Personel ezilme', 'Yeraltı hattı hasarı'] },
                            { id: id(), label: 'Kompresör ve jeneratör saha kullanımı', itemType: 'ekipman', hazards: ['Gürültü', 'Egzoz gazı/CO', 'Yangın', 'Titreşim'] },
                            { id: id(), label: 'Kaynak makinesi saha taşıma', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Ergonomik hasar', 'Düşme/çarpma'] },
                            { id: id(), label: 'Gaz ölçüm cihazları yönetimi', itemType: 'ekipman', hazards: ['Kalibrasyon dışı cihaz', 'Batarya tükenmesi', 'Yanlış alarm'] },
                            { id: id(), label: 'Saha araç trafiği ve park yönetimi', itemType: 'ortam', hazards: ['Araç-yaya çarpışması', 'Geri manevra kazası', 'Park alanı dar geçiş'] },
                        ]}],
                    },
                ],
            },

            // ── 15. Depo, Malzeme & Tehlikeli Madde ─────────────────────────
            {
                id: 'dg_depo_malzeme',
                label: 'Depo, Malzeme & Tehlikeli Madde',
                icon: 'warehouse',
                phases: [
                    {
                        id: 'dgdm_depo', label: 'Malzeme Depolama & Yönetimi', icon: 'inventory_2',
                        subPhases: [{ id: 'dgdm_d1', label: 'Depo & Stok', items: [
                            { id: id(), label: 'Boru (PE/çelik) stok sahası yönetimi', itemType: 'ortam', hazards: ['Boru devrilmesi', 'Yük düşmesi', 'Elle taşıma kas-iskelet'] },
                            { id: id(), label: 'Fitting ve ek parça depolama', itemType: 'ortam', hazards: ['Dağınık depolama', 'Kayma/takılma', 'Karışık stok/hatalı kullanım'] },
                            { id: id(), label: 'Regülatör ve filtre yedekleri depolama', itemType: 'ortam', hazards: ['Nem/korozyon', 'Hasar', 'Yanlış sınıflandırma'] },
                        ]}],
                    },
                    {
                        id: 'dgdm_tehlikeli', label: 'Tehlikeli Madde & Kimyasallar', icon: 'warning',
                        subPhases: [{ id: 'dgdm_t1', label: 'Tehlikeli Maddeler', items: [
                            { id: id(), label: 'Odorizan (THT/merkaptan) depolanması', itemType: 'ekipman', hazards: ['Kimyasal maruziyet', 'Koku/zehirlenme', 'Yangın/patlama', 'Deri-göz tahrişi'] },
                            { id: id(), label: 'Basınçlı kaplar ve tüp depolama', itemType: 'ekipman', hazards: ['Tüp devrilmesi', 'Vana hasarı', 'Gaz kaçağı', 'BLEVE riski'] },
                            { id: id(), label: 'Atık ve hurda yönetimi', itemType: 'faaliyet', hazards: ['Gaz kalıntısı olan ekipman', 'Kimyasal atık', 'Yasal uyumsuzluk'] },
                        ]}],
                    },
                ],
            },

            // ── 16. Ofis, Atölye, Garaj & Destek Tesisleri ──────────────────
            {
                id: 'dg_ofis_atolye',
                label: 'Ofis, Atölye, Garaj & Destek Tesisleri',
                icon: 'business',
                phases: [
                    {
                        id: 'dgoa_ofis', label: 'Ofis & İdari Alan', icon: 'desk',
                        subPhases: [{ id: 'dgoa_o1', label: 'Ofis Faaliyetleri', items: [
                            { id: id(), label: 'İdari ofis ve bölge merkezi çalışması', itemType: 'ortam', hazards: ['Ergonomi/ekran yorgunluğu', 'Elektrik çarpması (ofis ekipmanı)', 'Yangın'] },
                            { id: id(), label: 'UPS / jeneratör odası', itemType: 'ortam', hazards: ['Batarya kaza gazı (H2)', 'Yangın', 'CO birikimi (jeneratör)'] },
                            { id: id(), label: 'Elektrik odası ve pano', itemType: 'ortam', hazards: ['Elektrik çarpması', 'Ark flash', 'Yangın'] },
                        ]}],
                    },
                    {
                        id: 'dgoa_atolye', label: 'Atölye, Garaj & Yardımcı', icon: 'build',
                        subPhases: [{ id: 'dgoa_a1', label: 'Atölye & Garaj', items: [
                            { id: id(), label: 'Atölye çalışmaları (tamir, montaj)', itemType: 'is', hazards: ['El aleti yaralanması', 'Toz/metal talaş', 'Kimyasal maruziyet', 'Gürültü'] },
                            { id: id(), label: 'Araç garajı ve yıkama alanı', itemType: 'ortam', hazards: ['Kayma (ıslak zemin)', 'CO birikimi (kapalı garaj)', 'Yangın (yakıt)'] },
                            { id: id(), label: 'Yemekhane ve soyunma alanı', itemType: 'ortam', hazards: ['Hijyen riski', 'Kayma/düşme', 'Yangın (mutfak)'] },
                            { id: id(), label: 'Yangın ekipmanları depo alanı', itemType: 'ortam', hazards: ['Erişim engeli', 'Periyodik kontrol eksikliği', 'Eski/dolum süresi geçmiş tüpler'] },
                        ]}],
                    },
                ],
            },

            // ── 17. Şartlı Modüller ──────────────────────────────────────────
            {
                id: 'dg_sartli',
                label: 'Şartlı Modüller (LNG/CNG · Odorizasyon · Sıcak Çalışma · Kapalı Alan)',
                icon: 'warning',
                phases: [
                    {
                        id: 'dgsl_lng', label: 'LNG / CNG Uydu Besleme', icon: 'propane_tank',
                        subPhases: [{ id: 'dgsl_l1', label: 'LNG/CNG Operasyonu', items: [
                            { id: id(), label: 'LNG / CNG kabul ve transfer operasyonu', itemType: 'is', hazards: ['Kriyojenik yanık (LNG)', 'Yüksek basınç patlaması (CNG)', 'Gaz kaçağı', 'Patlayıcı atmosfer'] },
                            { id: id(), label: 'LNG/CNG tank ve skid alanı', itemType: 'ortam', hazards: ['Gaz birikimi', 'Kriyojenik sıvı dökülmesi', 'Yangın/patlama', 'Emniyet mesafesi ihlali'] },
                            { id: id(), label: 'Vaporizasyon ve basınç düşürme', itemType: 'ekipman', hazards: ['Donma (kriyojenik)', 'Gaz sızıntısı', 'Regülatör arızası'] },
                            { id: id(), label: 'Doldurma ve boşaltma operasyonu', itemType: 'is', hazards: ['Hortum patlaması', 'Statik elektrik', 'Gaz kaçağı', 'Yanlış bağlantı'] },
                        ]}],
                    },
                    {
                        id: 'dgsl_odor', label: 'Odorizasyon', icon: 'air',
                        subPhases: [{ id: 'dgsl_o1', label: 'Odorizasyon Operasyonu', items: [
                            { id: id(), label: 'Odorizan tankı dolum ve transferi', itemType: 'is', hazards: ['Kimyasal maruziyet (THT/merkaptan)', 'Cilt-göz tahrişi', 'Solunum sistemi irritasyonu', 'Dökülme'] },
                            { id: id(), label: 'Odorizasyon dozaj sistemi kontrolü', itemType: 'ekipman', hazards: ['Aşırı/yetersiz dozaj', 'Koku şikayeti', 'Gaz kaçağı gizlenmesi'] },
                            { id: id(), label: 'Sızıntı, dökülme ve temizlik', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet', 'Zemin kirliliği', 'Hava kirliliği ihbarı'] },
                        ]}],
                    },
                    {
                        id: 'dgsl_sicak', label: 'Sıcak Çalışma & Kaynak (Gaz Ortamında)', icon: 'local_fire_department',
                        subPhases: [{ id: 'dgsl_s1', label: 'Sıcak İş İzni & Operasyon', items: [
                            { id: id(), label: 'Gazlı ortamda sıcak çalışma izni', itemType: 'faaliyet', hazards: ['Patlama/yangın', 'Yetersiz izolasyon', 'İzin prosedürü atlanması'] },
                            { id: id(), label: 'Hot tap / tie-in operasyonu', itemType: 'is', hazards: ['Gaz kaçağı', 'Patlama', 'Yüksek basınç altında çalışma', 'Birikmiş gaz ateşlenmesi'] },
                            { id: id(), label: 'Çelik boru kaynağı (sahada)', itemType: 'is', hazards: ['Yangın/patlama (gaz ortamı)', 'Kaynak gazları', 'UV radyasyon', 'Elektrik çarpması'] },
                            { id: id(), label: 'Kesme-taşlama ve ısı üretimi', itemType: 'is', hazards: ['Kıvılcım/ateşleme kaynağı', 'Gaz bulutu ateşlenmesi', 'Göz yaralanması'] },
                        ]}],
                    },
                    {
                        id: 'dgsl_kapali', label: 'Kapalı Alan Çalışmaları', icon: 'sensor_door',
                        subPhases: [{ id: 'dgsl_k1', label: 'Kapalı Alan Girişi', items: [
                            { id: id(), label: 'Vana odası girişi ve çalışma', itemType: 'is', hazards: ['Gaz birikimi', 'Oksijen yetersizliği', 'Gaz zehirlenmesi', 'Kaçış güçlüğü'] },
                            { id: id(), label: 'Menhol / çukur içi çalışma', itemType: 'is', hazards: ['Patlayıcı atmosfer', 'Oksijen yetersizliği', 'Su baskını', 'Kurtarma güçlüğü'] },
                            { id: id(), label: 'İstasyon kabini içi bakım', itemType: 'is', hazards: ['Gaz birikimi (yetersiz havalandırma)', 'Yangın/patlama', 'Uzun süreli maruziyet'] },
                            { id: id(), label: 'Kapalı alan giriş izni prosedürü', itemType: 'faaliyet', hazards: ['Yetersiz havalandırma', 'Atmosfer ölçümü yapılmaması', 'Kurtarma ekibi olmadan giriş'] },
                            { id: id(), label: 'Kurtarma ekipmanı (harness, köprü, kurtarma halatı)', itemType: 'ekipman', hazards: ['Eksik/arızalı ekipman', 'Kurtarma gecikmesi', 'Yaralı personel erişim güçlüğü'] },
                        ]}],
                    },
                ],
            },

        ]
    },

    // ══════════════════════════════════════════════════════════════
    // PETROL İSTASYONU
    // ══════════════════════════════════════════════════════════════
    {
        id: 'petrol_istasyonu',
        label: 'Petrol İstasyonu',
        icon: 'local_gas_station',
        color: '#dc2626',
        subtypeQuestion: 'Modül seçiniz:',
        subtypes: [

            // ── 1. Kurumsal İSG ve Mevzuat Uyum ─────────────────────────────
            {
                id: 'pi_isg_mevzuat',
                label: 'Kurumsal İSG ve Mevzuat Uyum',
                icon: 'security',
                phases: [
                    {
                        id: 'pi_isg_gyk', label: 'Görev, Yetki & Sorumluluk', icon: 'manage_accounts',
                        subPhases: [
                            { id: 'pi_isg_gyk_1', label: 'Organizasyon ve Atama', items: [
                                { id: id(), label: 'İş güvenliği uzmanı (IGU) atama ve görev belgesi', itemType: 'faaliyet', hazards: ['Yasal uyumsuzluk', 'Görev boşluğu', 'Denetim riski'] },
                                { id: id(), label: 'İşyeri hekimi sözleşmesi ve görev tanımı', itemType: 'faaliyet', hazards: ['Sağlık gözetimi eksikliği', 'Yasal ceza'] },
                                { id: id(), label: 'Çalışan temsilcisi seçimi', itemType: 'faaliyet', hazards: ['Temsil eksikliği', 'Mevzuat ihlali'] },
                                { id: id(), label: 'İşveren vekili yetki belgesi', itemType: 'faaliyet', hazards: ['Yetkisiz karar', 'Sorumluluk boşluğu'] },
                                { id: id(), label: 'Yüklenici – alt işveren yönetimi', itemType: 'faaliyet', hazards: ['Koordinasyon eksikliği', 'Kaza sorumluluk transferi sorunu', 'Belge eksikliği'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_isg_egitim', label: 'Eğitim & İş İzin Sistemi', icon: 'school',
                        subPhases: [
                            { id: 'pi_isg_eg_1', label: 'Eğitim Programı', items: [
                                { id: id(), label: 'İşe giriş ve temel ISG eğitimi', itemType: 'faaliyet', hazards: ['Eğitimsiz personel', 'Yangın/patlama bilgisizliği'] },
                                { id: id(), label: 'Yangın eğitimi ve söndürücü tatbikatı', itemType: 'faaliyet', hazards: ['Panik', 'Yanlış söndürücü kullanımı', 'Gecikmeli müdahale'] },
                                { id: id(), label: 'İlk yardım eğitimi', itemType: 'faaliyet', hazards: ['Müdahale gecikmesi', 'Yanlış ilk yardım'] },
                                { id: id(), label: 'Petrol ürünleri tehlike ve MSDS eğitimi', itemType: 'faaliyet', hazards: ['Kimyasal maruziyet bilgisizliği', 'Dökülme yönetimi hatası'] },
                                { id: id(), label: 'Yüklenici güvenlik oryantasyonu', itemType: 'faaliyet', hazards: ['Saha kuralı ihlali', 'Kaza'] },
                            ]},
                            { id: 'pi_isg_izin_1', label: 'İş İzin Sistemi', items: [
                                { id: id(), label: 'Sıcak çalışma izni (kaynak, taşlama)', itemType: 'faaliyet', hazards: ['Ateşleyici kaynak', 'Patlama', 'Yangın ATEX ihlali'] },
                                { id: id(), label: 'Kapalı alan giriş izni', itemType: 'faaliyet', hazards: ['Oksijen yetersizliği', 'Gaz birikimi', 'Kurtarma güçlüğü'] },
                                { id: id(), label: 'Enerji izolasyon (LOTO) izni', itemType: 'faaliyet', hazards: ['Beklenmedik enerji açılması', 'Elektrik çarpması'] },
                                { id: id(), label: 'Yüksekte çalışma izni', itemType: 'faaliyet', hazards: ['Düşme', 'Nesne düşmesi'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_isg_kkd', label: 'KKD & Sağlık Gözetimi', icon: 'health_and_safety',
                        subPhases: [
                            { id: 'pi_isg_kkd_1', label: 'KKD Yönetimi', items: [
                                { id: id(), label: 'KKD envanteri (baret, eldiven, gözlük, bot)', itemType: 'ekipman', hazards: ['Yetersiz koruma', 'Standart dışı ürün'] },
                                { id: id(), label: 'Kimyasal dirençli eldiven (yakıt teması)', itemType: 'ekipman', hazards: ['Deri kimyasal yanığı', 'Absorpsiyon'] },
                                { id: id(), label: 'Yangın geciktirici tulum (tanker boşaltım)', itemType: 'ekipman', hazards: ['Yanma', 'Tutuşma'] },
                                { id: id(), label: 'KKD kullanım denetimi', itemType: 'faaliyet', hazards: ['KKD kullanmama alışkanlığı', 'Ceza riski'] },
                            ]},
                            { id: 'pi_isg_saglik_1', label: 'Sağlık Gözetimi', items: [
                                { id: id(), label: 'İşe giriş sağlık muayenesi', itemType: 'faaliyet', hazards: ['Uygun olmayan personel istihdam', 'Meslek hastalığı'] },
                                { id: id(), label: 'Periyodik muayene (benzene maruziyeti)', itemType: 'faaliyet', hazards: ['Kronik kimyasal maruziyet', 'Meslek hastalığı gecikmeli tespiti'] },
                                { id: id(), label: 'Biyolojik izleme (kan benzeni)', itemType: 'faaliyet', hazards: ['Benzol absorpsiyonu', 'Kanser riski'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_isg_olay', label: 'Olay Yönetimi & DÖF', icon: 'report',
                        subPhases: [
                            { id: 'pi_isg_olay_1', label: 'Ramak Kala & Kaza', items: [
                                { id: id(), label: 'Ramak kala bildirim sistemi', itemType: 'faaliyet', hazards: ['Bildirimsizlik kültürü', 'Tekrar eden olay'] },
                                { id: id(), label: 'İş kazası soruşturma prosedürü', itemType: 'faaliyet', hazards: ['Kök neden analizi eksikliği', 'Tekrar'] },
                                { id: id(), label: 'DÖF (Düzeltici-Önleyici Faaliyet) takibi', itemType: 'faaliyet', hazards: ['Kapanmayan aksiyon', 'Tekrar eden kaza'] },
                                { id: id(), label: 'Kaza kayıt ve istatistik (SGK bildirimi)', itemType: 'faaliyet', hazards: ['Yasal bildirim gecikmesi', 'Ceza'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 2. Lisans, Otomasyon ve Resmi Uygunluk ──────────────────────
            {
                id: 'pi_lisans_otomasyon',
                label: 'Lisans, Otomasyon ve Resmi Uygunluk',
                icon: 'assignment',
                phases: [
                    {
                        id: 'pi_lis_lisans', label: 'EPDK Lisans & Ruhsatlar', icon: 'verified',
                        subPhases: [
                            { id: 'pi_lis_l1', label: 'Lisans Süreci', items: [
                                { id: id(), label: 'EPDK bayilik lisansı geçerlilik ve yenileme', itemType: 'faaliyet', hazards: ['Lisans süresi dolması', 'Faaliyetin durdurulması', 'Ceza'] },
                                { id: id(), label: 'Yapı kullanım izni (iskan) ve ÇED belgesi', itemType: 'faaliyet', hazards: ['Belgesiz faaliyet', 'Yasal risk'] },
                                { id: id(), label: 'Belediye işyeri açma ruhsatı', itemType: 'faaliyet', hazards: ['Ruhsatsız işletme', 'Kapatma riski'] },
                                { id: id(), label: 'İtfaiye uygunluk belgesi', itemType: 'faaliyet', hazards: ['Yangın emniyet uygunsuzluğu', 'İdari yaptırım'] },
                                { id: id(), label: 'Çevre lisansları (atık yönetimi)', itemType: 'faaliyet', hazards: ['Atık ihlali', 'Çevre cezası'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_lis_otomasyon', label: 'Bayi Otomasyon Sistemi', icon: 'smart_screen',
                        subPhases: [
                            { id: 'pi_lis_ot1', label: 'Otomasyon & Ulusal Marker', items: [
                                { id: id(), label: 'Bayi otomasyon sistemi kurulum ve entegrasyon', itemType: 'ekipman', hazards: ['Sistem arızası', 'Stok kayıt uyumsuzluğu'] },
                                { id: id(), label: 'Ulusal marker sistemi uyumu (kaçak akaryakıt denetimi)', itemType: 'faaliyet', hazards: ['İhlal', 'Lisans iptali', 'Ceza'] },
                                { id: id(), label: 'Satış kayıt cihazı (ÖKC) entegrasyonu', itemType: 'ekipman', hazards: ['Fiş kesememesi', 'Vergi uyumsuzluğu'] },
                                { id: id(), label: 'Stok yönetimi ve kayıp-kaçak takibi', itemType: 'faaliyet', hazards: ['Envanter hatası', 'Hırsızlık/kayıp tespitsiz kalma'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_lis_denetim', label: 'Denetim Hazırlığı', icon: 'checklist',
                        subPhases: [
                            { id: 'pi_lis_d1', label: 'Denetim Kontrol Listesi', items: [
                                { id: id(), label: 'EPDK saha denetimi hazırlığı (belge dosyası)', itemType: 'faaliyet', hazards: ['Belge eksikliği', 'Para cezası'] },
                                { id: id(), label: 'Enerji Bakanlığı denetim kontrol noktaları', itemType: 'faaliyet', hazards: ['Teknik uyumsuzluk'] },
                                { id: id(), label: 'Belediye ve çevre denetimi hazırlığı', itemType: 'faaliyet', hazards: ['İdari yaptırım'] },
                                { id: id(), label: 'Pompa/dispenser metroloji damgası kontrolü', itemType: 'ekipman', hazards: ['Ölçüm uyumsuzluğu', 'Tüketici şikayeti', 'Ceza'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 3. Yakıt Kabulü ve Tanker Boşaltma ──────────────────────────
            {
                id: 'pi_yakit_kabul',
                label: 'Yakıt Kabulü ve Tanker Boşaltma',
                icon: 'local_shipping',
                phases: [
                    {
                        id: 'pi_tank_kabul', label: 'Tanker Kabulü & Belge Kontrolü', icon: 'fact_check',
                        subPhases: [
                            { id: 'pi_tank_k1', label: 'Giriş Kontrolü', items: [
                                { id: id(), label: 'Tanker sürücüsü kimlik ve eğitim belgesi kontrolü', itemType: 'faaliyet', hazards: ['Yetkisiz sürücü', 'Yasal uyumsuzluk'] },
                                { id: id(), label: 'Taşıma irsaliyesi ve ürün uygunluk belgesi', itemType: 'faaliyet', hazards: ['Yanlış ürün teslimi', 'Karışım/kontaminasyon'] },
                                { id: id(), label: 'Tanker araç muayenesi (sızıntı, bağlantı)', itemType: 'ekipman', hazards: ['Dökülme', 'Yangın'] },
                                { id: id(), label: 'Saha içi manevra ve park pozisyonu', itemType: 'faaliyet', hazards: ['Çarpma', 'Araç-yaya çatışması', 'Geri manevra kazası'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_tank_oncesi', label: 'Boşaltım Öncesi Hazırlık', icon: 'checklist_rtl',
                        subPhases: [
                            { id: 'pi_tank_o1', label: 'Güvenlik Hazırlığı', items: [
                                { id: id(), label: 'Tanker statik topraklama bağlantısı', itemType: 'faaliyet', hazards: ['Statik elektrik – kıvılcım', 'Yangın/patlama'] },
                                { id: id(), label: 'Saha çevresi emniyet konisi ve bant kurulumu', itemType: 'faaliyet', hazards: ['İzinsiz giriş', 'Araç çarpması'] },
                                { id: id(), label: 'Dolum ağzı kapağı açma ve tank seviyesi okuma', itemType: 'faaliyet', hazards: ['Taşma', 'Yakıt karışımı', 'Buhar inhalasyonu'] },
                                { id: id(), label: 'Ateş kaynaklarının kontrolü (sigarayı söndür, motorlar kapalı)', itemType: 'faaliyet', hazards: ['Buhar tutuşması', 'Patlama'] },
                                { id: id(), label: 'Döküntü emici kit ve yangın söndürücü hazırlığı', itemType: 'ekipman', hazards: ['Dökülmeye hazırsızlık', 'Yangın gecikmiş müdahale'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_tank_bosaltim', label: 'Boşaltım Operasyonu', icon: 'oil_barrel',
                        subPhases: [
                            { id: 'pi_tank_b1', label: 'Aktif Boşaltım', items: [
                                { id: id(), label: 'Hortum bağlantısı ve sızdırmazlık kontrolü', itemType: 'faaliyet', hazards: ['Bağlantı açılması', 'Yakıt dökülmesi', 'Yangın'] },
                                { id: id(), label: 'Sürekli seviye izleme (dolum sırasında)', itemType: 'faaliyet', hazards: ['Tank taşması', 'Yakıt dökülmesi', 'Zemin/kanalizasyon kontaminasyonu'] },
                                { id: id(), label: 'Dispenser operasyonunu boşaltım süresince durdurma', itemType: 'faaliyet', hazards: ['Tank basınç dalgalanması', 'Hava girişi', 'Pompa arızası'] },
                                { id: id(), label: 'Buhar geri kazanım bağlantısı (VRS)', itemType: 'ekipman', hazards: ['Hidrokarbon buharı salınımı', 'Kanserojen maruziyet'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_tank_sonrasi', label: 'Boşaltım Sonrası & Belgeleme', icon: 'task_alt',
                        subPhases: [
                            { id: 'pi_tank_s1', label: 'Kapanış & Kayıt', items: [
                                { id: id(), label: 'Hortum söküm ve ağız kapakları kapatma', itemType: 'faaliyet', hazards: ['Hortumda kalan yakıt dökülmesi', 'Buhar salınımı'] },
                                { id: id(), label: 'Döküntü ve sızıntı nihai kontrolü', itemType: 'faaliyet', hazards: ['Gözden kaçan sızıntı', 'Toprak kirliliği'] },
                                { id: id(), label: 'Topraklama sökümü ve konilerin kaldırılması', itemType: 'faaliyet', hazards: ['Statik topraklama sökülmeden hareket'] },
                                { id: id(), label: 'Teslim belgesi ve stok güncelleme', itemType: 'faaliyet', hazards: ['Envanter hatası', 'Kayıp tespitsiz kalma'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 4. Yeraltı Tankları ve Dolum Ağzı ───────────────────────────
            {
                id: 'pi_yeralti_tank',
                label: 'Yeraltı Tankları ve Dolum Ağzı',
                icon: 'layers',
                phases: [
                    {
                        id: 'pi_yt_envanter', label: 'Tank Envanteri & Seviye Takibi', icon: 'analytics',
                        subPhases: [
                            { id: 'pi_yt_e1', label: 'Otomatik Seviye Ölçümü', items: [
                                { id: id(), label: 'ATG (otomatik tank ölçer) günlük okuma', itemType: 'ekipman', hazards: ['Ölçüm arızası', 'Sızıntı tespitsiz kalma', 'Stok kayıp'] },
                                { id: id(), label: 'Stok hesabı – kayıp-kaçak analizi', itemType: 'faaliyet', hazards: ['Zemin suyu kirliliği', 'EPDK ihlali', 'Hırsızlık'] },
                                { id: id(), label: 'Günlük/haftalık envanter mutabakat kaydı', itemType: 'faaliyet', hazards: ['Belge eksikliği', 'Uyumsuzluk tespiti gecikmesi'] },
                                { id: id(), label: 'Ürün karışımı riski – tank etiketleme', itemType: 'faaliyet', hazards: ['Yanlış ürün doldurulması', 'Araç motoru hasarı'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yt_havalan', label: 'Havalandırma & Taşma Önleme', icon: 'air',
                        subPhases: [
                            { id: 'pi_yt_h1', label: 'Havalandırma Sistemi', items: [
                                { id: id(), label: 'Havalandırma (vent) boru ve kapakları', itemType: 'ekipman', hazards: ['Tıkanma – aşırı basınç', 'Atmosfere buhar salınımı', 'Yangın'] },
                                { id: id(), label: 'P/V valfi kontrolü (basınç-vakum)', itemType: 'ekipman', hazards: ['Valfi arıza – vakum çökmesi veya aşırı basınç', 'Patlama'] },
                                { id: id(), label: 'Taşma önleme valfi (overfill) testi', itemType: 'ekipman', hazards: ['Valf arızası – tank taşması', 'Toprak kirliliği'] },
                                { id: id(), label: 'Havalandırma borusu çevresi (ATEX Zone)', itemType: 'ortam', hazards: ['Ateşleyici kaynak', 'Patlama riski'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yt_sizma', label: 'Sızdırmazlık & Kaçak İzleme', icon: 'sensors',
                        subPhases: [
                            { id: 'pi_yt_s1', label: 'Kaçak Dedeksiyon', items: [
                                { id: id(), label: 'Çift cidarlı tank iç boşluk sensör izleme', itemType: 'ekipman', hazards: ['Sızıntı tespitsiz – çevre kirliliği', 'Yangın/patlama'] },
                                { id: id(), label: 'Yeraltı sızıntı dedektörü (SIR/sensor)', itemType: 'ekipman', hazards: ['Zemin suyu kirliliği', 'EPDK ihlali'] },
                                { id: id(), label: 'Boru hattı kaçak testi (baskı testi)', itemType: 'faaliyet', hazards: ['Boru hasarı', 'Yakıt sızıntısı', 'Hatalı test basıncı'] },
                                { id: id(), label: 'İzleme kuyusu numunesi', itemType: 'faaliyet', hazards: ['Numune kirlenmesi', 'Yanlış analiz', 'Çevre suçlaması'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yt_agiz', label: 'Dolum Ağzı & Saha Emniyeti', icon: 'lock',
                        subPhases: [
                            { id: 'pi_yt_a1', label: 'Dolum Ağzı Güvenliği', items: [
                                { id: id(), label: 'Dolum ağzı kilitleri ve kapak sızdırmazlığı', itemType: 'ekipman', hazards: ['İzinsiz dolum', 'Yağmur suyu girişi', 'Sızıntı'] },
                                { id: id(), label: 'Ağız çevresi yüzey drenajı ve havuzcuk', itemType: 'ortam', hazards: ['Dökülmenin drenaja kaçması', 'Toprak kirliliği'] },
                                { id: id(), label: 'Dolum ağzı tanım plakası (ürün renk kodu)', itemType: 'ekipman', hazards: ['Yanlış ürün dolumu', 'Karışım hasarı'] },
                                { id: id(), label: 'Tank sahası aydınlatması ve işaretleme', itemType: 'ortam', hazards: ['Gece kaza riski', 'Yetersiz görünürlük'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 5. Dispenser Adaları ve Ön Saha ─────────────────────────────
            {
                id: 'pi_dispenser',
                label: 'Dispenser Adaları ve Ön Saha Yakıt İkmal',
                icon: 'local_gas_station',
                phases: [
                    {
                        id: 'pi_disp_ekipman', label: 'Pompa / Dispenser Güvenliği', icon: 'precision_manufacturing',
                        subPhases: [
                            { id: 'pi_disp_e1', label: 'Ekipman Güvenliği', items: [
                                { id: id(), label: 'Dispenser Ex-proof sertifikası ve onay', itemType: 'ekipman', hazards: ['ATEX ihlali', 'Kıvılcım kaynağı', 'Patlama'] },
                                { id: id(), label: 'Dispenser metroloji damgası (ölçüm doğruluğu)', itemType: 'ekipman', hazards: ['Yanlış ölçüm', 'Tüketici şikayeti', 'Ceza'] },
                                { id: id(), label: 'Acil durdurma butonu (dispenser üzeri)', itemType: 'ekipman', hazards: ['Yangında hızlı durdurma yapılamaması'] },
                                { id: id(), label: 'Dispenser periyodik bakım kaydı', itemType: 'faaliyet', hazards: ['Arıza', 'Sızıntı', 'Kalibrasyon kayması'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_disp_hortum', label: 'Hortum, Tabanca & Breakaway', icon: 'hose',
                        subPhases: [
                            { id: 'pi_disp_h1', label: 'Hortum & Bağlantı', items: [
                                { id: id(), label: 'Hortum görsel muayenesi (çatlak, soyulma)', itemType: 'ekipman', hazards: ['Hortum yırtılması', 'Yakıt dökülmesi', 'Yangın'] },
                                { id: id(), label: 'Breakaway kaplin varlığı ve test', itemType: 'ekipman', hazards: ['Araç çekme kazasında hortum kopması', 'Yakıt fışkırması', 'Yangın'] },
                                { id: id(), label: 'Tabanca kilidi ve otomatik kesme testi', itemType: 'ekipman', hazards: ['Yakıt taşması', 'Araç içi dolum kazası'] },
                                { id: id(), label: 'Hortum askısı ve düzgün depolama', itemType: 'faaliyet', hazards: ['Sürçme-düşme', 'Hortum ömrünün azalması'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_disp_musteri', label: 'Müşteri Dolumu & Saha Kuralları', icon: 'directions_car',
                        subPhases: [
                            { id: 'pi_disp_m1', label: 'Dolum Esnasında Güvenlik', items: [
                                { id: id(), label: 'Motor kapatma zorunluluğu tabelası ve denetimi', itemType: 'faaliyet', hazards: ['Motor çalışırken yakıt doldurma', 'Kıvılcım riski'] },
                                { id: id(), label: 'Cep telefonu ve sigara yasağı uygulaması', itemType: 'faaliyet', hazards: ['Statik/ark', 'Buhar tutuşması'] },
                                { id: id(), label: 'Statik elektrik topraklama noktası (metal araçlar)', itemType: 'ekipman', hazards: ['Statik deşarj – kıvılcım', 'Yangın'] },
                                { id: id(), label: 'Çocuk/yaya dolum adası mesafesi', itemType: 'faaliyet', hazards: ['Yaralanma', 'Hortum sarması'] },
                                { id: id(), label: 'Dolum adası aydınlatma yeterliliği', itemType: 'ortam', hazards: ['Gece görünürlük eksikliği', 'Hatalı dolum'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_disp_ada', label: 'Ada Çevresi & Fiziksel Koruma', icon: 'fence',
                        subPhases: [
                            { id: 'pi_disp_a1', label: 'Araç Çarpma Koruması', items: [
                                { id: id(), label: 'Ada başı beton bariyerleri / kazık', itemType: 'ekipman', hazards: ['Araç çarpması – dispenser hasarı', 'Yakıt dökülmesi', 'Yangın'] },
                                { id: id(), label: 'Ada üstü gölgelik metal yapı sağlamlığı', itemType: 'ortam', hazards: ['Rüzgar/yük ile çökme', 'Yaralanma'] },
                                { id: id(), label: 'Zemin işaretleme ve ada çevresi drenaj', itemType: 'ortam', hazards: ['Kaygan zemin (dökülen yakıt)', 'Düşme'] },
                                { id: id(), label: 'CCTV kamera açısı (adaları kapsıyor mu)', itemType: 'ekipman', hazards: ['Güvenlik açığı', 'Hırsızlık'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 6. Araç Trafiği ve Saha Düzeni ───────────────────────────────
            {
                id: 'pi_arac_trafik',
                label: 'Araç Trafiği ve Saha Düzeni',
                icon: 'traffic',
                phases: [
                    {
                        id: 'pi_trf_yonetim', label: 'Trafik Yönetimi & Yönlendirme', icon: 'signpost',
                        subPhases: [
                            { id: 'pi_trf_y1', label: 'Giriş-Çıkış Düzeni', items: [
                                { id: id(), label: 'Tek yönlü trafik akışı ve işaret', itemType: 'faaliyet', hazards: ['Çarpışma', 'Geri manevra kazası', 'Trafik karmaşası'] },
                                { id: id(), label: 'Ağır araç (tanker) yolu ayrımı', itemType: 'ortam', hazards: ['Araç-yaya çatışması', 'Çarpma'] },
                                { id: id(), label: 'Hız sınırı tabelası (saha içi ≤10 km/h)', itemType: 'faaliyet', hazards: ['Hızlı geçiş – kaza'] },
                                { id: id(), label: 'Geri manevra ikaz sistemi (reflektör/sesten)', itemType: 'ekipman', hazards: ['Gözden kaçan yaya', 'Çarpma'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_trf_yaya', label: 'Araç-Yaya Ayrımı', icon: 'directions_walk',
                        subPhases: [
                            { id: 'pi_trf_yy1', label: 'Yaya Güvenliği', items: [
                                { id: id(), label: 'Yaya geçidi ve kaldırım ayrımı', itemType: 'ortam', hazards: ['Araç çarpması', 'Sürçme'] },
                                { id: id(), label: 'Market girişi önü yaya güvenlik bölgesi', itemType: 'ortam', hazards: ['Araç-müşteri teması'] },
                                { id: id(), label: 'Bisiklet ve motosiklet güvenli park alanı', itemType: 'ortam', hazards: ['Devrilme', 'Araç çarpması'] },
                                { id: id(), label: 'Gece görünürlük – aydınlatma ve reflektif şerit', itemType: 'ortam', hazards: ['Görünmez yaya', 'Kaza'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_trf_zemin', label: 'Zemin & Saha Güvenliği', icon: 'grid_on',
                        subPhases: [
                            { id: 'pi_trf_z1', label: 'Zemin Durumu', items: [
                                { id: id(), label: 'Zemin kaymaz kaplama ve periyodik kontrol', itemType: 'ortam', hazards: ['Kaygan zemin (dökülen yakıt/yağmur)', 'Düşme'] },
                                { id: id(), label: 'Bozuk asfalt/çukur tespiti ve onarım', itemType: 'ortam', hazards: ['Araç süspansiyon hasarı', 'Yaya düşmesi'] },
                                { id: id(), label: 'Kar-buz temizleme prosedürü (kış)', itemType: 'faaliyet', hazards: ['Kayma', 'Araç kayması', 'Yaya düşmesi'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 7. Yangın, Patlama ve ATEX ───────────────────────────────────
            {
                id: 'pi_yangin_atex',
                label: 'Yangın, Patlama ve ATEX',
                icon: 'local_fire_department',
                phases: [
                    {
                        id: 'pi_atex_zone', label: 'Tehlikeli Bölge Sınıflandırması (ATEX)', icon: 'warning',
                        subPhases: [
                            { id: 'pi_atex_z1', label: 'Zone Haritası & Kaynak Kontrolü', items: [
                                { id: id(), label: 'ATEX zone haritası (Zone 0/1/2) hazırlığı', itemType: 'faaliyet', hazards: ['Yanlış sınıflandırma', 'Ateşleyici kaynak izni', 'Patlama'] },
                                { id: id(), label: 'Zone içi ekipman Ex-proof sertifika kontrolü', itemType: 'ekipman', hazards: ['Sertifikasız ekipman', 'Patlama', 'ATEX ihlali'] },
                                { id: id(), label: 'Ateşleyici kaynak envanteri ve kontrol', itemType: 'faaliyet', hazards: ['Kıvılcım', 'Statik elektrik', 'Sıcak çalışma'] },
                                { id: id(), label: 'Gaz/buhar dedektör sistemi (sabit)', itemType: 'ekipman', hazards: ['Kaçak tespitsiz', 'Patlama'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_atex_yangin', label: 'Yangın Önleme & Söndürme', icon: 'fire_extinguisher',
                        subPhases: [
                            { id: 'pi_atex_y1', label: 'Yangın Söndürme Sistemi', items: [
                                { id: id(), label: 'Köpüklü yangın söndürücü (adalar için)', itemType: 'ekipman', hazards: ['Yetersiz söndürücü kapasitesi', 'Yanlış tip'] },
                                { id: id(), label: 'ABC kuru tozlu söndürücü bakımı ve tarihi', itemType: 'ekipman', hazards: ['Dolum süresi dolmuş söndürücü', 'Yangına müdahale edilememesi'] },
                                { id: id(), label: 'Kum kovası ve yedek ekipman', itemType: 'ekipman', hazards: ['Küçük dökülme yangınına hazırsızlık'] },
                                { id: id(), label: 'Yangın ihbar paneli ve dedektörler', itemType: 'ekipman', hazards: ['Alarm gecikmesi', 'Yanlış alarm'] },
                                { id: id(), label: 'Otomatik gaz kesme sistemi (yangın anı)', itemType: 'ekipman', hazards: ['Manuel kesme gecikmesi', 'Yangın büyümesi'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_atex_acil', label: 'Acil Durum & Tahliye', icon: 'emergency',
                        subPhases: [
                            { id: 'pi_atex_a1', label: 'Acil Durum Prosedürleri', items: [
                                { id: id(), label: 'Acil stop butonu (ana kesme) konumu ve testi', itemType: 'ekipman', hazards: ['Butona erişilememesi', 'Tanılinamaması', 'Yangın yayılması'] },
                                { id: id(), label: 'Acil kapatma valfi (dispenser ana valfı)', itemType: 'ekipman', hazards: ['Valfi sıkışmış', 'Arızalı kapama'] },
                                { id: id(), label: 'Tahliye planı ve toplanma noktası', itemType: 'faaliyet', hazards: ['Duman', 'Karışıklık', 'Panik'] },
                                { id: id(), label: 'Acil durum tatbikatı (yılda en az 1)', itemType: 'faaliyet', hazards: ['Tatbikatsız personel', 'Panik müdahale'] },
                                { id: id(), label: 'İtfaiye erişim yolu açık tutulması', itemType: 'ortam', hazards: ['Araç park engeli', 'Gecikmeli müdahale'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_atex_yild', label: 'Yıldırımdan Korunma', icon: 'bolt',
                        subPhases: [
                            { id: 'pi_atex_yl1', label: 'Paratoner & Topraklama', items: [
                                { id: id(), label: 'Paratoner sistemi periyodik ölçüm', itemType: 'ekipman', hazards: ['Toprak direnci aşımı', 'Yıldırım hasarı'] },
                                { id: id(), label: 'Gölgelik ve metal yapı topraklama sürekliliği', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Yangın'] },
                                { id: id(), label: 'Aşırı gerilim koruma (OBO/SPD) panelde', itemType: 'ekipman', hazards: ['Elektrik darbesi', 'Ekipman arızası'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 8. Elektrik, Topraklama ve Yıldırımdan Korunma ─────────────
            {
                id: 'pi_elektrik',
                label: 'Elektrik, Topraklama ve Yıldırımdan Korunma',
                icon: 'electric_bolt',
                phases: [
                    {
                        id: 'pi_elek_exproof', label: 'Ex-Proof Ekipmanlar & Kablaj', icon: 'cable',
                        subPhases: [
                            { id: 'pi_elek_e1', label: 'Zone İçi Elektrik', items: [
                                { id: id(), label: 'Dispenser elektrik bağlantısı Ex-proof kablo girişi', itemType: 'ekipman', hazards: ['Kablo hasarı', 'Kıvılcım', 'Patlama'] },
                                { id: id(), label: 'Zone içi aydınlatma armatürü sertifikası', itemType: 'ekipman', hazards: ['ATEX ihlali', 'Kıvılcım'] },
                                { id: id(), label: 'Kablo koruma boru ve toprak altı geçiş', itemType: 'ekipman', hazards: ['Mekanik hasar', 'Su girişi', 'Kaçak akım'] },
                                { id: id(), label: 'Ex-proof kablo başlığı (gland) sızdırmazlığı', itemType: 'ekipman', hazards: ['Gaz girişi', 'Patlama'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_elek_toprak', label: 'Topraklama Sistemi', icon: 'ground',
                        subPhases: [
                            { id: 'pi_elek_t1', label: 'Topraklama Sürekliliği', items: [
                                { id: id(), label: 'Ana topraklama barası ölçümü (≤10 Ω)', itemType: 'faaliyet', hazards: ['Yüksek toprak direnci', 'Statik elektrik', 'Elektrik çarpması'] },
                                { id: id(), label: 'Tanker topraklama noktası ve kablo', itemType: 'ekipman', hazards: ['Topraklanmamış tanker', 'Statik deşarj', 'Yangın'] },
                                { id: id(), label: 'Ada metal yapı eşpotansiyel bağlantısı', itemType: 'ekipman', hazards: ['Potansiyel farkı', 'Elektrik çarpması'] },
                                { id: id(), label: 'Topraklama periyodik ölçüm kayıtları', itemType: 'faaliyet', hazards: ['Ölçümsüz sistem', 'Yasal uyumsuzluk'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_elek_pano', label: 'Pano & Periyodik Elektrik Kontrolleri', icon: 'dashboard',
                        subPhases: [
                            { id: 'pi_elek_p1', label: 'Elektrik Panosu', items: [
                                { id: id(), label: 'AG pano kapak kilidi ve IP sınıfı', itemType: 'ekipman', hazards: ['İzinsiz erişim', 'Elektrik çarpması'] },
                                { id: id(), label: 'Kaçak akım rölesi (RCD) testi', itemType: 'ekipman', hazards: ['Kaçak akım algılanamaması', 'Yangın'] },
                                { id: id(), label: 'Sigorta ve devre kesici kapasitesi kontrolü', itemType: 'ekipman', hazards: ['Aşırı yük', 'Yangın'] },
                                { id: id(), label: 'Kablo yalıtım direnci ölçümü (periyodik)', itemType: 'faaliyet', hazards: ['Yalıtım bozukluğu', 'Elektrik çarpması', 'Yangın'] },
                                { id: id(), label: 'Elektrik iç tesisat periyodik muayene raporu', itemType: 'faaliyet', hazards: ['Raporlanmamış hata', 'Yasal uyumsuzluk'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 9. Sızıntı, Çevre ve Atık Yönetimi ─────────────────────────
            {
                id: 'pi_sizinti_cevre',
                label: 'Sızıntı, Çevre ve Atık Yönetimi',
                icon: 'eco',
                phases: [
                    {
                        id: 'pi_cev_dokul', label: 'Dökülme Önleme & Müdahale', icon: 'warning_amber',
                        subPhases: [
                            { id: 'pi_cev_d1', label: 'Dökülme Yönetimi', items: [
                                { id: id(), label: 'Döküntü emici kit (granül/ped) varlığı ve konumu', itemType: 'ekipman', hazards: ['Dökülmeye hazırsızlık', 'Kayma', 'Zemin kirliliği'] },
                                { id: id(), label: 'Dökülme prosedürü – yalıtma, emme, bertaraf', itemType: 'faaliyet', hazards: ['Drenaja ulaşma', 'Toprak kirliliği', 'Yangın'] },
                                { id: id(), label: 'Ada drenaj ızgarası yağ tutucu sifon', itemType: 'ekipman', hazards: ['Kirli suyun kanalizasyona ulaşması', 'Çevre ihlali'] },
                                { id: id(), label: 'Acil müdahale seti (branda, bariyer bant)', itemType: 'ekipman', hazards: ['Büyük dökülmeye hazırsızlık'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_cev_atik', label: 'Atık Yönetimi', icon: 'delete',
                        subPhases: [
                            { id: 'pi_cev_a1', label: 'Tehlikeli Atıklar', items: [
                                { id: id(), label: 'Yağlı atık ve filtre bertaraf lisanslı firma', itemType: 'faaliyet', hazards: ['Yasadışı atık', 'Çevre cezası'] },
                                { id: id(), label: 'Kontamine emici bez ve eldiven – özel kap', itemType: 'faaliyet', hazards: ['Karışık atık', 'Kimyasal temas'] },
                                { id: id(), label: 'Atık akaryakıt (kirli benzin/mazot) teslimi', itemType: 'faaliyet', hazards: ['Lisanssız bertaraf', 'Çevre ihlali'] },
                                { id: id(), label: 'Atık beyan sistemi (UATF) kaydı', itemType: 'faaliyet', hazards: ['Kayıtsız atık', 'Denetim cezası'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_cev_toprak', label: 'Toprak & Su Kirliliği Önleme', icon: 'water',
                        subPhases: [
                            { id: 'pi_cev_t1', label: 'Çevre İzleme', items: [
                                { id: id(), label: 'İzleme kuyusu (groundwater) periyodik numunesi', itemType: 'faaliyet', hazards: ['Zemin suyu kirliliği fark edilmemesi', 'Hukuki sorumluluk'] },
                                { id: id(), label: 'Yüzey suyu drenaj yağ tutucu bakımı', itemType: 'ekipman', hazards: ['Kirli su deşarjı', 'Çevre cezası'] },
                                { id: id(), label: 'Toprak numune analizi (5 yılda bir)', itemType: 'faaliyet', hazards: ['BTEX kirliliği fark edilmemesi'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 10. Market, Kasa ve İdari Bina ──────────────────────────────
            {
                id: 'pi_market_bina',
                label: 'Market, Kasa ve İdari Bina',
                icon: 'store',
                phases: [
                    {
                        id: 'pi_mkt_musteri', label: 'Müşteri Alanı & Raf Güvenliği', icon: 'shopping_cart',
                        subPhases: [
                            { id: 'pi_mkt_m1', label: 'İçeride Güvenlik', items: [
                                { id: id(), label: 'Raf istifi yükseklik ve ağırlık limiti', itemType: 'faaliyet', hazards: ['Raf devrilmesi', 'Ürün düşmesi', 'Müşteri yaralanması'] },
                                { id: id(), label: 'Zemin kaymaz paspas ve ıslak zemin ikaz', itemType: 'ortam', hazards: ['Kayma-düşme', 'İç mekân sızıntısı'] },
                                { id: id(), label: 'Gıda ve kimyasal ürün ayrımı (rafta)', itemType: 'faaliyet', hazards: ['Çapraz kontaminasyon', 'Zehirlenme'] },
                                { id: id(), label: 'Kasa çalışanı ergonomisi (oturma, ekran, uzanma)', itemType: 'faaliyet', hazards: ['Kas-iskelet hasarı', 'Monoton çalışma'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_mkt_yangin', label: 'Yangın & Tahliye', icon: 'fire_extinguisher',
                        subPhases: [
                            { id: 'pi_mkt_y1', label: 'Yangın Güvenliği', items: [
                                { id: id(), label: 'Yangın söndürücü market içi (ABC kuru toz)', itemType: 'ekipman', hazards: ['Yangın ilk müdahale yapılamaması'] },
                                { id: id(), label: 'Acil çıkış kapısı açılabilirlik testi', itemType: 'ekipman', hazards: ['Kaçış yolu kapanması', 'Kapı kilitli – panik'] },
                                { id: id(), label: 'Yangın yükü envanteri (karton, ambalaj)', itemType: 'faaliyet', hazards: ['Yüksek yangın yükü', 'Hızlı yayılma'] },
                                { id: id(), label: 'Acil aydınlatma ve yönlendirme piktogramı', itemType: 'ekipman', hazards: ['Karanlıkta tahliye başarısızlığı'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 11. Bakım, Onarım, Temizlik ve Arıza Müdahalesi ─────────────
            {
                id: 'pi_bakim_onarim',
                label: 'Bakım, Onarım, Temizlik ve Arıza Müdahalesi',
                icon: 'build',
                phases: [
                    {
                        id: 'pi_bak_disp', label: 'Dispenser & Tank Ekipmanı Bakımı', icon: 'settings',
                        subPhases: [
                            { id: 'pi_bak_d1', label: 'Periyodik Bakım', items: [
                                { id: id(), label: 'Dispenser filtre değişimi', itemType: 'faaliyet', hazards: ['Kirli yakıt', 'Pompa arızası', 'Ölçüm kayması'] },
                                { id: id(), label: 'Dispenser hortum ve tabanca yıllık değişimi', itemType: 'faaliyet', hazards: ['Hortum yırtılması', 'Yakıt dökülmesi'] },
                                { id: id(), label: 'Tank submersible pompa bakımı', itemType: 'faaliyet', hazards: ['Yakıt sızıntısı', 'Elektrik çarpması', 'Pompa arızası'] },
                                { id: id(), label: 'Taşma önleme / P-V valfi testi', itemType: 'faaliyet', hazards: ['Valfi arızası – tank taşması veya basınç sorunu'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_bak_loto', label: 'LOTO (Enerji İzolasyonu)', icon: 'lock',
                        subPhases: [
                            { id: 'pi_bak_l1', label: 'Kilitleme & Etiketleme', items: [
                                { id: id(), label: 'Dispenser elektrik ve yakıt izolasyonu (LOTO)', itemType: 'faaliyet', hazards: ['Beklenmedik enerji devreye girmesi', 'Yangın', 'Yaralanma'] },
                                { id: id(), label: 'LOTO kiti (kilit, etiket, kutu) varlığı', itemType: 'ekipman', hazards: ['Eksik kit', 'İzolasyon uygulanamaması'] },
                                { id: id(), label: 'Birden fazla enerji kaynağı izolasyon prosedürü', itemType: 'faaliyet', hazards: ['Gözden kaçan enerji kaynağı'] },
                                { id: id(), label: 'Çalışma tamamlandı – enerji geri verme prosedürü', itemType: 'faaliyet', hazards: ['Personel çalışma alanında iken enerji açılması'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_bak_ariza', label: 'Arıza Müdahalesi & Devreye Alma', icon: 'engineering',
                        subPhases: [
                            { id: 'pi_bak_a1', label: 'Acil Arıza', items: [
                                { id: id(), label: 'Dispenser arızası – geçici izolasyon ve bariyer', itemType: 'faaliyet', hazards: ['Yakıt kaçağı devam etmesi', 'Yangın'] },
                                { id: id(), label: 'Yakıt sızıntısı acil müdahale', itemType: 'faaliyet', hazards: ['Zemin kirliliği', 'Yangın', 'Personel maruziyeti'] },
                                { id: id(), label: 'Servis sonrası devreye alma testi (sızdırmazlık)', itemType: 'faaliyet', hazards: ['Sızıntılı iade', 'Müşteriye verilmeden önce kontrol eksikliği'] },
                                { id: id(), label: 'Bakım kaydı ve imza (yetkili teknisyen)', itemType: 'faaliyet', hazards: ['Kayıtsız bakım', 'Sorumluluk belirsizliği'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 12. Yardımcı Tesisler ─────────────────────────────────────────
            {
                id: 'pi_yardimci_tesis',
                label: 'Yardımcı Tesisler',
                icon: 'apartment',
                phases: [
                    {
                        id: 'pi_yt_kompr', label: 'Kompresör, Hava-Su Ünitesi & Jeneratör', icon: 'compress',
                        subPhases: [
                            { id: 'pi_yt_k1', label: 'Mekanik Yardımcı Ekipmanlar', items: [
                                { id: id(), label: 'Hava kompresörü basınç tüpü ve emniyet valfi testi', itemType: 'ekipman', hazards: ['Basınç tüpü patlaması', 'Aşırı basınç'] },
                                { id: id(), label: 'Kompresör filtre ve yağ değişimi', itemType: 'faaliyet', hazards: ['Kompresör arızası', 'Yangın'] },
                                { id: id(), label: 'Hava-su ünitesi elektrik-su teması', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Kaçak akım'] },
                                { id: id(), label: 'Jeneratör egzoz çıkışı ve CO birikimi', itemType: 'ortam', hazards: ['CO zehirlenmesi', 'Kapalı alanda çalıştırma'] },
                                { id: id(), label: 'Jeneratör yakıt deposu sızıntı kontrolü', itemType: 'ekipman', hazards: ['Yakıt dökülmesi', 'Yangın'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yt_pano', label: 'Pano Odası & Totem Alanı', icon: 'electrical_services',
                        subPhases: [
                            { id: 'pi_yt_p1', label: 'Tesisat Alanları', items: [
                                { id: id(), label: 'Pano odası temizlik ve erişim denetimi', itemType: 'ortam', hazards: ['İzinsiz giriş', 'Elektrik çarpması', 'Yangın'] },
                                { id: id(), label: 'Aydınlatma direği temeli ve devirme riski', itemType: 'ekipman', hazards: ['Rüzgar yükü', 'Direk devrilmesi', 'Yaralanma'] },
                                { id: id(), label: 'Totem aydınlatma kablo güvenliği', itemType: 'ekipman', hazards: ['Açık uç', 'Yangın', 'Elektrik çarpması'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yt_personel', label: 'Personel Mahalleri & Depo', icon: 'meeting_room',
                        subPhases: [
                            { id: 'pi_yt_pe1', label: 'Sosyal Alanlar', items: [
                                { id: id(), label: 'Mola odası havalandırma ve iklimlendirme', itemType: 'ortam', hazards: ['Sıcak stres', 'CO birikimi', 'Yorgunluk'] },
                                { id: id(), label: 'Soyunma dolapları ve hijyen koşulları', itemType: 'ortam', hazards: ['Biyolojik risk', 'Kimyasal kontaminasyon'] },
                                { id: id(), label: 'Tehlikeli madde deposu ayrımı ve kilidi', itemType: 'ortam', hazards: ['Kimyasal temas', 'Karışım patlaması'] },
                                { id: id(), label: 'Depo yangın yükü ve söndürücü', itemType: 'ortam', hazards: ['Yangın yayılması', 'Geri kaçma engellemesi'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 13. Oto Gaz / LPG ─────────────────────────────────────────────
            {
                id: 'pi_lpg',
                label: 'Oto Gaz / LPG',
                icon: 'gas_meter',
                phases: [
                    {
                        id: 'pi_lpg_tank', label: 'LPG Tanker & Tank Güvenliği', icon: 'propane_tank',
                        subPhases: [
                            { id: 'pi_lpg_t1', label: 'LPG Kabulü & Depolama', items: [
                                { id: id(), label: 'LPG tanker kabulü – sürücü belgesi ve araç tescil', itemType: 'faaliyet', hazards: ['Yetkisiz tanker', 'Kaçak riski'] },
                                { id: id(), label: 'LPG yerüstü tank emniyet mesafeleri (binaE/ yola)', itemType: 'ortam', hazards: ['Patlama tesir alanı ihlali', 'Yasal uyumsuzluk'] },
                                { id: id(), label: 'LPG dedektör ve alarm sistemi', itemType: 'ekipman', hazards: ['Kaçak tespitsiz – patlama'] },
                                { id: id(), label: 'LPG tank emniyet valfi testi ve tarih', itemType: 'ekipman', hazards: ['Valfi arızası', 'Aşırı basınç patlaması'] },
                                { id: id(), label: 'LPG dolum sırasında ateş kaynağı yasakları', itemType: 'faaliyet', hazards: ['Buhar-hava karışımı tutuşması', 'BLEVE'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_lpg_disp', label: 'LPG Dispenser & Dolum', icon: 'ev_station',
                        subPhases: [
                            { id: 'pi_lpg_d1', label: 'Araç LPG Dolumu', items: [
                                { id: id(), label: 'LPG dispenser Ex-proof sertifikası', itemType: 'ekipman', hazards: ['ATEX ihlali', 'Kıvılcım kaynağı'] },
                                { id: id(), label: 'LPG hortum ve bağlantı sızdırmazlık testi', itemType: 'faaliyet', hazards: ['Gaz kaçağı', 'Yangın/patlama'] },
                                { id: id(), label: 'Araç LPG tankı bağlantı kontrolü', itemType: 'faaliyet', hazards: ['Bağlantı yanlışlığı', 'Gaz salınımı'] },
                                { id: id(), label: 'Dolum sırasında motor kapatma', itemType: 'faaliyet', hazards: ['Kıvılcım', 'Statik elektrik'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_lpg_mevzuat', label: 'LPG Mevzuat & Eğitim', icon: 'menu_book',
                        subPhases: [
                            { id: 'pi_lpg_m1', label: 'Lisans & Personel', items: [
                                { id: id(), label: 'EPDK LPG bayilik lisansı', itemType: 'faaliyet', hazards: ['Lisanssız satış', 'Yasal yaptırım'] },
                                { id: id(), label: 'Sorumlu müdür atama belgesi (LPG)', itemType: 'faaliyet', hazards: ['Sorumsuz işletme', 'Ceza'] },
                                { id: id(), label: 'LPG personeli özel güvenlik eğitimi', itemType: 'faaliyet', hazards: ['Eğitimsiz personel', 'BLEVE riski bilgisizliği'] },
                                { id: id(), label: 'LPG tesis periyodik muayene raporu', itemType: 'faaliyet', hazards: ['Yasal uyumsuzluk', 'Denetim riski'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 14. Oto Yıkama ────────────────────────────────────────────────
            {
                id: 'pi_oto_yikama',
                label: 'Oto Yıkama',
                icon: 'local_car_wash',
                phases: [
                    {
                        id: 'pi_yik_ekipman', label: 'Yıkama Ekipmanı & Elektrik-Su', icon: 'water_drop',
                        subPhases: [
                            { id: 'pi_yik_e1', label: 'Ekipman Güvenliği', items: [
                                { id: id(), label: 'Yüksek basınçlı yıkama makinesi topraklama', itemType: 'ekipman', hazards: ['Elektrik-su teması', 'Elektrik çarpması'] },
                                { id: id(), label: 'Basınçlı su hortumu ve tabanca basınç sınırı', itemType: 'ekipman', hazards: ['Hortum savrulması', 'Göz/cilt basınç yaralanması'] },
                                { id: id(), label: 'Su ısıtıcı kazan basınç ve emniyet valfi', itemType: 'ekipman', hazards: ['Buhar yanığı', 'Kazan patlaması'] },
                                { id: id(), label: 'Elektrik panosu IP66 su koruması', itemType: 'ekipman', hazards: ['Su sıçraması – kısa devre', 'Yangın'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yik_kimyasal', label: 'Kimyasal Deterjanlar & Atık Su', icon: 'science',
                        subPhases: [
                            { id: 'pi_yik_k1', label: 'Kimyasal Yönetimi', items: [
                                { id: id(), label: 'Deterjan MSDS ve depolama koşulları', itemType: 'faaliyet', hazards: ['Cilt/göz yanığı', 'İnhalasyon'] },
                                { id: id(), label: 'KKD (önlük, gözlük, eldiven) deterjan teması', itemType: 'ekipman', hazards: ['Kimyasal yanık'] },
                                { id: id(), label: 'Yıkama suyu atık drenajı ve yağ tutucu', itemType: 'ortam', hazards: ['Kirli atık su deşarjı', 'Çevre ihlali'] },
                                { id: id(), label: 'Su geri dönüşüm sistemi kontrolü', itemType: 'ekipman', hazards: ['Sistem tıkanması', 'Taşma'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_yik_zemin', label: 'Zemin & Yaya Güvenliği', icon: 'grid_on',
                        subPhases: [
                            { id: 'pi_yik_z1', label: 'Kaygan Zemin & Drenaj', items: [
                                { id: id(), label: 'Yıkama zemin kaymaz kaplama', itemType: 'ortam', hazards: ['Kayma-düşme (çalışan/müşteri)'] },
                                { id: id(), label: 'Yıkama alanı drenaj ızgaraları temizliği', itemType: 'faaliyet', hazards: ['Su birikintisi', 'Kayma', 'Koku'] },
                                { id: id(), label: 'Otomatik yıkama giriş kapısı – araç algılama', itemType: 'ekipman', hazards: ['Yaya sıkışması', 'Kapı darbesi'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 15. Lastik Hava-Su-Servis ─────────────────────────────────────
            {
                id: 'pi_lastik_hava',
                label: 'Lastik Hava-Su-Servis',
                icon: 'air',
                phases: [
                    {
                        id: 'pi_las_hava', label: 'Basınçlı Hava & Kompresör', icon: 'compress',
                        subPhases: [
                            { id: 'pi_las_h1', label: 'Hava Ünitesi Güvenliği', items: [
                                { id: id(), label: 'Kompresör emniyet valfi ve basınç göstergesi', itemType: 'ekipman', hazards: ['Aşırı basınç', 'Patlama', 'Göstergesi arızalı'] },
                                { id: id(), label: 'Hava hortumu savrulma riski – maksimum basınç', itemType: 'ekipman', hazards: ['Hortum savrulması', 'Yüz/göz yaralanması'] },
                                { id: id(), label: 'Lastik dolum basıncı sınırı tabelası', itemType: 'faaliyet', hazards: ['Lastik patlaması (aşırı şişirme)', 'Yaralanma'] },
                                { id: id(), label: 'Hava ünitesi elektrik bağlantısı ve topraklama', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Kaçak akım'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_las_servis', label: 'Lastik Değişim & Küçük Servis', icon: 'build',
                        subPhases: [
                            { id: 'pi_las_s1', label: 'Servis Operasyonları', items: [
                                { id: id(), label: 'Kriko ve kaldırma takozları güvenli kullanımı', itemType: 'ekipman', hazards: ['Araç düşmesi', 'Ezilme'] },
                                { id: id(), label: 'El aletleri (tork anahtarı, küçük ekipman)', itemType: 'ekipman', hazards: ['El yaralanması', 'Fırlayan parça'] },
                                { id: id(), label: 'Müşteri aracı trafik alanında servis yasağı', itemType: 'faaliyet', hazards: ['Araç çarpması', 'Çalışana yayalar çarpması'] },
                                { id: id(), label: 'Atık lastik depolama ve bertaraf', itemType: 'faaliyet', hazards: ['Yangın yükü', 'Çevre ihlali'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 16. Hızlı Market / Kafe ───────────────────────────────────────
            {
                id: 'pi_market_kafe',
                label: 'Hızlı Market / Kafe',
                icon: 'restaurant',
                phases: [
                    {
                        id: 'pi_kafe_mutfak', label: 'Mutfak Ekipmanı & Yangın', icon: 'outdoor_grill',
                        subPhases: [
                            { id: 'pi_kafe_m1', label: 'Pişirme Ekipmanları', items: [
                                { id: id(), label: 'Fritöz sıcaklık kontrolü ve yangın riski', itemType: 'ekipman', hazards: ['Yağ ateşlemesi', 'Yanma', 'CO oluşumu'] },
                                { id: id(), label: 'Mikrodalgalanma fırını elektrik güvenliği', itemType: 'ekipman', hazards: ['Kısa devre', 'Yangın', 'Elektrik çarpması'] },
                                { id: id(), label: 'Kahve makinesi buhar basıncı ve yanma', itemType: 'ekipman', hazards: ['Buhar yanığı', 'Sıcak su yanığı'] },
                                { id: id(), label: 'Davlumbaz yağ filtresi temizliği (yangın yükü)', itemType: 'faaliyet', hazards: ['Yağ birikimi – yangın', 'Kötü havalandırma – CO'] },
                                { id: id(), label: 'Mutfak yangın söndürme sistemi (F sınıfı)', itemType: 'ekipman', hazards: ['Yağ yangınına müdahale edilememesi'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_kafe_lpg', label: 'LPG Tüp Kullanımı (Varsa)', icon: 'propane',
                        subPhases: [
                            { id: 'pi_kafe_l1', label: 'LPG Tüp Güvenliği', items: [
                                { id: id(), label: 'LPG tüp doluluk ve son kullanma kontrolü', itemType: 'ekipman', hazards: ['Boş tüp arızası', 'Eski/hasarlı tüp'] },
                                { id: id(), label: 'Tüp depolama – havalandırmalı alan ve bağlı dik', itemType: 'ortam', hazards: ['Gaz birikimi', 'Devrilme – regülatör hasarı', 'Patlama'] },
                                { id: id(), label: 'LPG bağlantı regülatörü ve hortum muayenesi', itemType: 'ekipman', hazards: ['Gaz kaçağı', 'Patlama'] },
                                { id: id(), label: 'Tüp değişim prosedürü ve havalandırma', itemType: 'faaliyet', hazards: ['Değişim sırasında gaz salınımı', 'Patlama riski'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_kafe_gida', label: 'Gıda Hijyeni & Müşteri Güvenliği', icon: 'food_bank',
                        subPhases: [
                            { id: 'pi_kafe_g1', label: 'Hijyen & Yoğunluk', items: [
                                { id: id(), label: 'Soğuk vitrin sıcaklık takibi', itemType: 'ekipman', hazards: ['Soğuk zincir kırılması', 'Gıda zehirlenmesi'] },
                                { id: id(), label: 'Ellerin hijyeni ve personel sağlık kartı', itemType: 'faaliyet', hazards: ['Çapraz kontaminasyon', 'Gıda kaynaklı hastalık'] },
                                { id: id(), label: 'Müşteri yoğunluğu – geçiş ve kalabalık yönetimi', itemType: 'ortam', hazards: ['İtişme', 'Sıcak içecek dökülmesi', 'Kayma'] },
                                { id: id(), label: 'Allerjen bilgi panosu', itemType: 'faaliyet', hazards: ['Allerjen reaksiyonu', 'Yasal sorumluluk'] },
                            ]},
                        ],
                    },
                ],
            },

            // ── 17. EV Şarj ───────────────────────────────────────────────────
            {
                id: 'pi_ev_sarj',
                label: 'EV Şarj',
                icon: 'charging_station',
                phases: [
                    {
                        id: 'pi_ev_unite', label: 'Şarj Ünitesi & Elektriksel Koruma', icon: 'electric_bolt',
                        subPhases: [
                            { id: 'pi_ev_u1', label: 'Ünite Güvenliği', items: [
                                { id: id(), label: 'Şarj ünitesi IP sınıfı ve dış ortam uygunluğu', itemType: 'ekipman', hazards: ['Su girişi', 'Kısa devre', 'Yangın'] },
                                { id: id(), label: 'RCCB/RCD özel EV şarj koruma', itemType: 'ekipman', hazards: ['Kaçak akım algılanamaması', 'Elektrik çarpması'] },
                                { id: id(), label: 'Şarj ünitesi topraklama ve TN-S sistemi', itemType: 'ekipman', hazards: ['Toprak kaçağı', 'Elektrik çarpması'] },
                                { id: id(), label: 'Kablo yönetimi – sürçme/takılma riski', itemType: 'ortam', hazards: ['Kablo üzerinde düşme', 'Kablo çekilmesi – bağlantı hasarı'] },
                                { id: id(), label: 'Şarj üniteleri sigorta ve yük dengeleme', itemType: 'ekipman', hazards: ['Aşırı yük – bina sigorta atması', 'Yangın'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_ev_arac', label: 'Araç Yerleşimi & Fiziksel Güvenlik', icon: 'electric_car',
                        subPhases: [
                            { id: 'pi_ev_a1', label: 'Park & Çevre', items: [
                                { id: id(), label: 'EV şarj alanı bariyer ve park çizgisi', itemType: 'ortam', hazards: ['Yanlış araç park (ICE engellemesi)', 'Araç çarpması – üniteye'] },
                                { id: id(), label: 'Araç şarj süresi – uzun bekleme & park güvenliği', itemType: 'faaliyet', hazards: ['Gece bekleyişi güvenlik riski', 'Araç soyulması'] },
                                { id: id(), label: 'EV şarj alanı aydınlatma yeterliliği', itemType: 'ortam', hazards: ['Gece kablo görünmezliği', 'Güvenlik riski'] },
                            ]},
                        ],
                    },
                    {
                        id: 'pi_ev_liion', label: 'Li-ion Batarya & Acil Kesme', icon: 'battery_alert',
                        subPhases: [
                            { id: 'pi_ev_l1', label: 'Batarya Güvenliği', items: [
                                { id: id(), label: 'Li-ion batarya termal kaçağı yangın riski', itemType: 'faaliyet', hazards: ['Termal kaçak – kontrol edilemez yangın', 'Su ile söndürme yetersizliği'] },
                                { id: id(), label: 'Acil durdurma butonu (EV şarj alanı)', itemType: 'ekipman', hazards: ['Şarjın kesilememesi', 'Yangın büyümesi'] },
                                { id: id(), label: 'Li-ion yangını müdahale prosedürü ve itfaiye bilgilendirme', itemType: 'faaliyet', hazards: ['Yanlış söndürme yöntemi', 'Zehirli gaz inhalasyonu'] },
                                { id: id(), label: 'EV şarj istasyonu yakınında kolay yanıcı madde yasağı', itemType: 'ortam', hazards: ['Yangın yayılması', 'Yanıcı madde tutulması'] },
                            ]},
                        ],
                    },
                ],
            },
        ]
    },

    // ══════════════════════════════════════════════════════════════════════════
    // KOLEJ / ÖZEL OKUL
    // ══════════════════════════════════════════════════════════════════════════
    {
        id: 'kolej',
        label: 'Kolej & Özel Okul',
        icon: 'school',
        color: '#6366f1',
        subtypeQuestion: 'Okul kademesini / yapısını seçin:',
        subtypes: [
            {
                id: 'kolej_genel',
                label: 'Genel Kampüs (Tüm Kademeler)',
                icon: 'account_balance',
                phases: [

                    // 1. Kurumsal İSG ve Mevzuat Uyum
                    {
                        id: 'kj_isg', label: 'Kurumsal İSG ve Mevzuat Uyum', icon: 'security',
                        subPhases: [
                            { id: 'kj_isg_1', label: 'Görev-Yetki-Sorumluluk & Organizasyon', items: [
                                { id: id(), label: 'İSG uzmanı / işyeri hekimi atama ve görev belgesi', itemType: 'faaliyet', hazards: ['Yasal uyumsuzluk', 'Mevzuat cezası', 'Görev boşluğu'] },
                                { id: id(), label: 'İşçi sağlığı ve güvenliği kurulu oluşturma ve toplantı tutanakları', itemType: 'faaliyet', hazards: ['Kurul eksikliği', 'Periyodik toplantı yapılmaması'] },
                                { id: id(), label: 'Çalışan temsilcisi seçimi ve görev tanımı', itemType: 'faaliyet', hazards: ['Temsil eksikliği', 'Hakların kullandırılmaması'] },
                                { id: id(), label: 'MEB özel öğretim mevzuatı uyum takibi', itemType: 'faaliyet', hazards: ['Yönetmelik değişikliğinin kaçırılması', 'Lisans iptali riski'] },
                                { id: id(), label: 'Yüklenici güvenlik oryantasyonu ve belge kontrolü', itemType: 'faaliyet', hazards: ['Yüklenici kazası', 'Koordinasyon eksikliği'] },
                            ]},
                            { id: 'kj_isg_2', label: 'Risk Değerlendirmesi, DÖF ve Kayıtlar', items: [
                                { id: id(), label: 'Okul geneli risk değerlendirmesi hazırlama ve güncelleme', itemType: 'faaliyet', hazards: ['Eksik veya eski risk değerlendirmesi', 'Mevzuat ihlali'] },
                                { id: id(), label: 'Ramak kala ve kaza bildirim prosedürü', itemType: 'faaliyet', hazards: ['Bildirimsiz kaza', 'Tekrar eden olay', 'Yasal yükümlülük kaçırma'] },
                                { id: id(), label: 'DÖF (Düzeltici-Önleyici Faaliyet) takip sistemi', itemType: 'faaliyet', hazards: ['Kök neden çözümsüz kalması', 'Tekrar eden kaza'] },
                                { id: id(), label: 'İSG eğitimleri planlama ve devam kaydı', itemType: 'faaliyet', hazards: ['Eğitimsiz personel', 'Sertifika geçerlilik takipsizliği'] },
                                { id: id(), label: 'KKD temin, dağıtım ve kullanım denetimi', itemType: 'faaliyet', hazards: ['KKD kullanılmaması', 'Uygunsuz KKD seçimi'] },
                            ]},
                        ],
                    },

                    // 2. Öğrenci Güvenliği ve Gözetim
                    {
                        id: 'kj_ogrenci', label: 'Öğrenci Güvenliği ve Gözetim', icon: 'child_care',
                        subPhases: [
                            { id: 'kj_ogr_1', label: 'Giriş-Çıkış ve Teslim Prosedürleri', items: [
                                { id: id(), label: 'Sabah giriş ve öğleden sonra çıkış düzeni', itemType: 'faaliyet', hazards: ['Yoğunluk ezilmesi', 'Kayıp öğrenci', 'Yetkisiz teslim'] },
                                { id: id(), label: 'Kaybolan / geç kalan öğrenci prosedürü', itemType: 'faaliyet', hazards: ['Geç fark edilme', 'Panik yönetimi', 'Veli iletişim hatası'] },
                                { id: id(), label: 'Öğrenci veliye teslim-tesellüm kuralları', itemType: 'faaliyet', hazards: ['Yetkisiz kişiye teslim', 'Öğrenci güvenliğinin tehlikeye girmesi'] },
                                { id: id(), label: 'Teneffüs gözetim planı ve nöbet sistemi', itemType: 'faaliyet', hazards: ['Gözetimsiz alan', 'Yaralanma geç fark edilmesi'] },
                            ]},
                            { id: 'kj_ogr_2', label: 'Sınıf Değişimi, Riskli Davranış ve Hassas Öğrenciler', items: [
                                { id: id(), label: 'Sınıf değişimi sırasında koridor akışı ve kalabalık yönetimi', itemType: 'faaliyet', hazards: ['Koşma-çarpışma yaralanması', 'Merdiven düşmesi'] },
                                { id: id(), label: 'Riskli davranış (pencere tırmanma, korkuluk asılma) gözetimi', itemType: 'faaliyet', hazards: ['Yüksekten düşme', 'Yaralanma', 'Ölüm'] },
                                { id: id(), label: 'Akran zorbalığına bağlı fiziksel güvenlik süreçleri', itemType: 'faaliyet', hazards: ['Fiziksel yaralanma', 'Psikolojik hasar', 'Hukuki yükümlülük'] },
                                { id: id(), label: 'Kronik hastalığı/engeli olan öğrenci güvenlik planı', itemType: 'faaliyet', hazards: ['Acil durumda gecikmeli müdahale', 'Eksik bilgi aktarımı'] },
                                { id: id(), label: 'Yaş grubu bazlı güvenlik değerlendirmesi (anaokulu / ilk / orta / lise)', itemType: 'faaliyet', hazards: ['Yaş uygunsuz ekipman', 'Gelişim düzeyine uygun gözetim eksikliği'] },
                            ]},
                        ],
                    },

                    // 3. Giriş-Çıkış, Ziyaretçi ve Kampüs Güvenliği
                    {
                        id: 'kj_giris', label: 'Giriş-Çıkış, Ziyaretçi ve Kampüs Güvenliği', icon: 'door_front',
                        subPhases: [
                            { id: 'kj_gir_1', label: 'Kapı ve Güvenlik Noktası', items: [
                                { id: id(), label: 'Ana giriş güvenlik bariyeri ve güvenlik görevlisi', itemType: 'ekipman', hazards: ['Yetkisiz giriş', 'Okula yabancı kişi girişi'] },
                                { id: id(), label: 'Ziyaretçi kayıt sistemi ve yaka kartı', itemType: 'faaliyet', hazards: ['Takipsiz ziyaretçi', 'Tehlikeli kişi kampüse girişi'] },
                                { id: id(), label: 'Araçlı giriş yönetimi ve park düzeni', itemType: 'faaliyet', hazards: ['Araç-yaya çarpışması', 'Kampüs içi hız riski'] },
                                { id: id(), label: 'Güvenlik kamerası kapsama alanı ve kayıt süresi', itemType: 'ekipman', hazards: ['Kör nokta', 'Kamera arızası', 'KVKK uyumsuzluğu'] },
                            ]},
                            { id: 'kj_gir_2', label: 'Toplu Etkinlik ve Tören Yoğunluğu', items: [
                                { id: id(), label: 'Veli toplantısı ve tören yoğun dönem kampüs trafik planı', itemType: 'faaliyet', hazards: ['Araç yoğunluğu', 'Yaya çarpışması', 'Park kaos'] },
                                { id: id(), label: 'Okul çevresi yaya güvenliği ve trafiği', itemType: 'ortam', hazards: ['Okul önü çarpışma', 'Araçların yaya geçidine park etmesi'] },
                                { id: id(), label: 'Gece etkinlikleri – aydınlatma ve güvenli çıkış', itemType: 'ortam', hazards: ['Yetersiz aydınlatma', 'Dış güvenlik boşluğu'] },
                            ]},
                        ],
                    },

                    // 4. Derslikler ve Eğitim Alanları
                    {
                        id: 'kj_derslik', label: 'Derslikler ve Eğitim Alanları', icon: 'menu_book',
                        subPhases: [
                            { id: 'kj_der_1', label: 'Fiziksel Güvenlik ve Mobilya', items: [
                                { id: id(), label: 'Okul sıraları / sandalyelerin kararlılığı ve keskin kenar kontrolü', itemType: 'ekipman', hazards: ['Devrilme', 'Kesik yaralanması', 'Sıkışma'] },
                                { id: id(), label: 'Dolap ve raf sabitleme (deprem güvenliği)', itemType: 'ekipman', hazards: ['Sarsıntıda devrilme', 'Öğrenci üstüne düşme'] },
                                { id: id(), label: 'Priz ve uzatma kablosu güvenliği (priz kapakçığı)', itemType: 'ekipman', hazards: ['Elektrik çarpması', 'Kablo üstüne düşme'] },
                                { id: id(), label: 'Pencere emniyet kilidi ve yüksekten düşme önlemi', itemType: 'ekipman', hazards: ['Çocuğun camdan düşmesi', 'Pencere kırılması'] },
                            ]},
                            { id: 'kj_der_2', label: 'Havalandırma, Aydınlatma ve Ergonomi', items: [
                                { id: id(), label: 'Doğal ve mekanik havalandırma yeterliliği', itemType: 'ortam', hazards: ['CO2 birikmesi', 'Oksijen yetersizliği', 'Konsantrasyon kaybı'] },
                                { id: id(), label: 'Sınıf aydınlatma düzeyi (300 lüks min.)', itemType: 'ortam', hazards: ['Göz yorgunluğu', 'Gün içi konsantrasyon düşüklüğü'] },
                                { id: id(), label: 'Öğrenci oturma ergonomisi ve sıra-sandalye uyumu', itemType: 'ortam', hazards: ['Boyun-bel ağrısı', 'Uzun dönem kas-iskelet problemi'] },
                                { id: id(), label: 'Acil çıkış erişimi – sınıf kapısı ve kaçış yolu', itemType: 'ortam', hazards: ['Yangında tahliye engeli', 'Kilitli kapı – mahsur kalma'] },
                            ]},
                        ],
                    },

                    // 5. Koridor, Merdiven, Kapı ve Ortak Alanlar
                    {
                        id: 'kj_koridor', label: 'Koridor, Merdiven, Kapı ve Ortak Alanlar', icon: 'staircase',
                        subPhases: [
                            { id: 'kj_kor_1', label: 'Merdiven ve Koridor Güvenliği', items: [
                                { id: id(), label: 'Merdiven korkuluk sağlamlığı ve yüksekliği', itemType: 'ekipman', hazards: ['Korkuluk devrilmesi', 'Çocuk düşmesi', 'Mevzuat uyumsuzluğu'] },
                                { id: id(), label: 'Merdiven kaymaz zemin kaplaması ve görsel kenar bantı', itemType: 'ortam', hazards: ['Kayma-düşme', 'Fraktür yaralanması'] },
                                { id: id(), label: 'Koridor zemininde ıslak zemin uyarısı ve döküntü yönetimi', itemType: 'faaliyet', hazards: ['Kayma-düşme', 'Kırık-çıkık yaralanması'] },
                                { id: id(), label: 'Teneffüs koşu/itme riski – kural ve gözetim', itemType: 'faaliyet', hazards: ['Çarpışma yaralanması', 'Cam kırılması', 'Düşme'] },
                            ]},
                            { id: 'kj_kor_2', label: 'Acil Çıkış Kapıları ve Tahliye Yolu', items: [
                                { id: id(), label: 'Acil çıkış kapıları – panik bar ve kilitsizlik kontrolü', itemType: 'ekipman', hazards: ['Kilitli kapı – tahliye engeli', 'Kapıda izdiham'] },
                                { id: id(), label: 'Acil çıkış yolu aydınlatması (yedek güç dahil)', itemType: 'ekipman', hazards: ['Elektrik kesintisinde karanlık yol', 'Panik tahliyede yön kaybı'] },
                                { id: id(), label: 'Turnike / otomatik kapı sıkışma ve tahliye açma testi', itemType: 'ekipman', hazards: ['Yangında kapı açılamama', 'Öğrenci sıkışması'] },
                                { id: id(), label: 'Engelli erişim rampaları ve asansör yedek güç', itemType: 'ortam', hazards: ['Asansörde mahsur kalma', 'Rampa yokluğu – tahliye engeli'] },
                            ]},
                        ],
                    },

                    // 6. Laboratuvarlar
                    {
                        id: 'kj_lab', label: 'Laboratuvarlar (Fen, Kimya, Fizik, Biyoloji)', icon: 'biotech',
                        subPhases: [
                            { id: 'kj_lab_1', label: 'Kimyasal Güvenlik ve Depolama', items: [
                                { id: id(), label: 'Kimyasal madde envanteri ve SDS (güvenlik bilgi formu) erişimi', itemType: 'faaliyet', hazards: ['Bilinmeyen kimyasal temas', 'Zehirlenme', 'Mevzuat ihlali'] },
                                { id: id(), label: 'Kimyasal depolama dolabı – yanıcı/korozif/toksik ayrımı', itemType: 'ortam', hazards: ['Uyumsuz kimyasal depolama – reaksiyon', 'Dökülme-yangın'] },
                                { id: id(), label: 'Kimyasal dökülme müdahale kiti ve prosedürü', itemType: 'ekipman', hazards: ['Kimyasal yayılması', 'Öğrenci maruziyeti', 'Cilt/göz hasarı'] },
                                { id: id(), label: 'Kimyasal atık ayrıştırma ve lisanslı bertaraf', itemType: 'faaliyet', hazards: ['Çevre kirliliği', 'Yasal ceza', 'Karıştırma reaksiyonu'] },
                            ]},
                            { id: 'kj_lab_2', label: 'Deney Tezgâhı, Gaz-Elektrik ve Güvenlik Ekipmanları', items: [
                                { id: id(), label: 'Gaz çıkışları (bek/brülör) ve ana gaz valfi kontrolü', itemType: 'ekipman', hazards: ['Gaz kaçağı', 'Yangın', 'Patlama'] },
                                { id: id(), label: 'Göz duşu ve acil duş – erişim, basınç ve haftalık test', itemType: 'ekipman', hazards: ['Kimyasal göz hasarı', 'Uzak/erişilmez duş'] },
                                { id: id(), label: 'Havalandırma (davlumbaz/fume hood) çekiş testi', itemType: 'ekipman', hazards: ['Kimyasal buhar soluma', 'CO birikimi'] },
                                { id: id(), label: 'Kişisel koruyucu ekipman (gözlük, önlük, eldiven) kullanım denetimi', itemType: 'faaliyet', hazards: ['Kimyasal temas', 'Göz hasarı', 'Cilt yanığı'] },
                                { id: id(), label: 'Deney sırasında öğretmen gözetim zorunluluğu', itemType: 'faaliyet', hazards: ['Gözetimsiz kimyasal kullanımı', 'Yaralanma'] },
                            ]},
                        ],
                    },

                    // 7. BT, Robotik, Maker ve Atölye
                    {
                        id: 'kj_bt', label: 'BT, Robotik, Maker ve Atölye', icon: 'precision_manufacturing',
                        subPhases: [
                            { id: 'kj_bt_1', label: 'Elektrik ve Kablo Güvenliği', items: [
                                { id: id(), label: 'Bilgisayar laboratuvarı kablo yönetimi ve kablo kanalları', itemType: 'ortam', hazards: ['Kablo üzerine basma-düşme', 'Aşırı yüklenmiş priz'] },
                                { id: id(), label: 'Çoklu adaptör / uzatma kablosu aşırı yük kontrolü', itemType: 'ekipman', hazards: ['Yangın (aşırı yük)', 'Elektrik çarpması'] },
                                { id: id(), label: 'Şarj noktaları – gözetimsiz gece şarj yasağı', itemType: 'faaliyet', hazards: ['Batarya yangını', 'Şarj cihazı aşırı ısınması'] },
                            ]},
                            { id: 'kj_bt_2', label: 'Atölye Ekipmanları ve Havalandırma', items: [
                                { id: id(), label: '3D yazıcı – erişim bölgesi, UFF/parçacık yayımı ve havalandırma', itemType: 'ekipman', hazards: ['UFP inhalasyonu', 'Sıcak uç yanması', 'Plastik dumanı'] },
                                { id: id(), label: 'Lehimleme istasyonu duman emme ve kişisel KKD', itemType: 'faaliyet', hazards: ['Kurşun dumanı soluma', 'Göz yanması', 'Cilt yanması'] },
                                { id: id(), label: 'Küçük el aletleri (vidalama, kesme, zımpara) güvenli kullanım', itemType: 'faaliyet', hazards: ['Kesik yaralanması', 'Göz yaralanması', 'Parmak ezilmesi'] },
                                { id: id(), label: 'Atölye havalandırma yeterliliği ve toz/duman maruziyeti', itemType: 'ortam', hazards: ['Kimyasal buhar birikimi', 'Kronik solunum riski'] },
                            ]},
                        ],
                    },

                    // 8. Görsel Sanatlar, Müzik ve Sahne Alanları
                    {
                        id: 'kj_sanat', label: 'Görsel Sanatlar, Müzik ve Sahne Alanları', icon: 'palette',
                        subPhases: [
                            { id: 'kj_san_1', label: 'Atölye Malzemeleri ve Kesici Aletler', items: [
                                { id: id(), label: 'Boya, vernik ve çözücü depolama ve havalandırma', itemType: 'ortam', hazards: ['Çözücü buharı soluma', 'Yangın (yanıcı boya)', 'Cilt/göz tahrişi'] },
                                { id: id(), label: 'Kesici el aletleri (maket bıçağı, makas, keski) yaş uyum kontrolü', itemType: 'ekipman', hazards: ['Kesik yaralanması', 'Yaşa uygun olmayan alet kullanımı'] },
                                { id: id(), label: 'Seramik fırını – sıcak yüzey ve havalandırma', itemType: 'ekipman', hazards: ['Yanma', 'Duman/gaz birikimi'] },
                            ]},
                            { id: 'kj_san_2', label: 'Sahne Platformu, Ses ve Işık Sistemi', items: [
                                { id: id(), label: 'Sahne platformu kenar koruyucu ve merdiven güvenliği', itemType: 'ortam', hazards: ['Yüksekten düşme', 'Merdiven devrilmesi'] },
                                { id: id(), label: 'Perde mekanik sistemi (ray/motor) bakım ve yük kontrolü', itemType: 'ekipman', hazards: ['Perde düşmesi', 'Motor arızası – sıkışma'] },
                                { id: id(), label: 'Sahne aydınlatma ekipmanları – aşırı ısınma ve elektrik güvenliği', itemType: 'ekipman', hazards: ['Yangın (ısınan armatür)', 'Elektrik çarpması'] },
                                { id: id(), label: 'Ses sistemi – kablo yönetimi ve hoparlör asma emniyeti', itemType: 'ekipman', hazards: ['Hoparlör düşmesi', 'Kabloya takılma düşme'] },
                            ]},
                        ],
                    },

                    // 9. Spor Salonu ve Açık Spor Alanları
                    {
                        id: 'kj_spor', label: 'Spor Salonu ve Açık Spor Alanları', icon: 'sports_basketball',
                        subPhases: [
                            { id: 'kj_spr_1', label: 'Kapalı Spor Salonu', items: [
                                { id: id(), label: 'Spor salonu zemin (parke/PVC) kayganlık ve bütünlük', itemType: 'ortam', hazards: ['Kayma-düşme', 'Parke kalkması – takılma'] },
                                { id: id(), label: 'Spor alet ve ekipmanları montaj sağlamlığı (kale direkleri, pota)', itemType: 'ekipman', hazards: ['Pota/kale devrilmesi', 'Alet düşmesi', 'Ezilme'] },
                                { id: id(), label: 'Jimnastik ekipmanları (ped, beşik, bar) yer güvenliği', itemType: 'ekipman', hazards: ['Düşme – ped yetersizliği', 'Ekipman devrilmesi'] },
                                { id: id(), label: 'Kondisyon odası ekipmanları güvenlik çiti ve yaş kısıtlaması', itemType: 'ekipman', hazards: ['Çocuk yaralanması', 'Bant/kol sıkışması'] },
                                { id: id(), label: 'Spor derslerinde öğretmen gözetim zorunluluğu', itemType: 'faaliyet', hazards: ['Gözetimsiz yaralanma', 'Ciddi kaza geç fark edilmesi'] },
                            ]},
                            { id: 'kj_spr_2', label: 'Açık Alanlar ve Tribün', items: [
                                { id: id(), label: 'Futbol/basketbol sahası zemini (delik, çökmüş alan)', itemType: 'ortam', hazards: ['Burkulma', 'Düşme', 'Topuk yaralanması'] },
                                { id: id(), label: 'Tribün sağlamlığı, korkuluk ve kapasite kontrolü', itemType: 'ortam', hazards: ['Tribün çökmesi', 'İzdiham', 'Düşme'] },
                                { id: id(), label: 'Soyunma odası hijyeni ve kaygan zemin yönetimi', itemType: 'ortam', hazards: ['Kayma-düşme (ıslak zemin)', 'Mantar bulaşısı'] },
                                { id: id(), label: 'Top çarpması riski – pano, cam ve kişi güvenliği', itemType: 'faaliyet', hazards: ['Top çarpması yaralanması', 'Cam kırılması'] },
                            ]},
                        ],
                    },

                    // 10. Yemekhane, Kantin, Mutfak ve Gıda Hijyeni
                    {
                        id: 'kj_mutfak', label: 'Yemekhane, Kantin, Mutfak ve Gıda Hijyeni', icon: 'restaurant',
                        subPhases: [
                            { id: 'kj_mfk_1', label: 'Mutfak Ekipmanları ve Yangın Riski', items: [
                                { id: id(), label: 'Endüstriyel ocak ve fırın sıcak yüzey güvenliği', itemType: 'ekipman', hazards: ['Yanma', 'Sıcak buhar', 'Sıcak nesne çarpması'] },
                                { id: id(), label: 'LPG / doğalgaz bağlantısı ve sızıntı dedektörü', itemType: 'ekipman', hazards: ['Gaz kaçağı', 'Patlama', 'Zehirlenme'] },
                                { id: id(), label: 'Bıçak ve kesici alet yönetimi ve kilitleme', itemType: 'ekipman', hazards: ['Kesik yaralanması', 'Çocuk erişimi'] },
                                { id: id(), label: 'Mutfak davlumbazı yağ filtresi temizliği ve yangın riski', itemType: 'faaliyet', hazards: ['Yağ yangını', 'Yangının havalandırmadan yayılması'] },
                            ]},
                            { id: 'kj_mfk_2', label: 'Gıda Güvenliği ve Alerjen Yönetimi', items: [
                                { id: id(), label: 'Soğuk zincir takibi ve buzdolabı/derin dondurucu sıcaklık kaydı', itemType: 'faaliyet', hazards: ['Gıda bozulması', 'Gıda zehirlenmesi'] },
                                { id: id(), label: 'Alerjen yönetimi – etiketleme ve personel eğitimi', itemType: 'faaliyet', hazards: ['Alerji krizi', 'Anafilaksi', 'Öğrenci ölümü'] },
                                { id: id(), label: 'Yemekhane ıslak zemin ve taşıma güzergâhı', itemType: 'ortam', hazards: ['Kayma-düşme (tray taşıma)', 'Sıcak yiyecek dökülmesi'] },
                                { id: id(), label: 'Personel hijyeni (el yıkama, sağlık raporu, kıyafet)', itemType: 'faaliyet', hazards: ['Çapraz kontaminasyon', 'Gıda zehirlenmesi salgını'] },
                            ]},
                        ],
                    },

                    // 11. Okul Servisi ve Öğrenci İndirme-Bindirme
                    {
                        id: 'kj_servis', label: 'Okul Servisi ve Öğrenci İndirme-Bindirme', icon: 'directions_bus',
                        subPhases: [
                            { id: 'kj_srv_1', label: 'Servis Araç ve Rehber Güvenliği', items: [
                                { id: id(), label: 'Servis aracı ruhsat, muayene ve sigorta takibi', itemType: 'faaliyet', hazards: ['Muayenesiz araç kazası', 'Yasal uyumsuzluk'] },
                                { id: id(), label: 'Taşıt rehber personeli görev ve eğitimi', itemType: 'faaliyet', hazards: ['Rehbersiz taşıma', 'Araç içi kaza fark edilmemesi'] },
                                { id: id(), label: 'Araç içi koltuk, emniyet kemeri ve kapasite kontrolü', itemType: 'ekipman', hazards: ['Kemer takmama', 'Kapasite aşımı', 'Ani frende çarpışma'] },
                                { id: id(), label: 'Araç içi acil çıkış kapısı ve ilk yardım kiti', itemType: 'ekipman', hazards: ['Kaza sonrası mahsur kalma', 'İlk yardım yapılamaması'] },
                            ]},
                            { id: 'kj_srv_2', label: 'İndirme-Bindirme Alanı Güvenliği', items: [
                                { id: id(), label: 'Kampüs önü indirme-bindirme alanı ve yaya bölgesi ayrımı', itemType: 'ortam', hazards: ['Araç-öğrenci çarpışması', 'Öğrenci araç altında kalması'] },
                                { id: id(), label: 'Araç bekleme sırası ve çift sıra park – görüş engeli', itemType: 'ortam', hazards: ['Görüş engeli – öğrenci gözden kaybolması', 'Araç çarpışması'] },
                                { id: id(), label: 'Kötü hava koşullarında (yağmur, buz) indirme düzeni', itemType: 'faaliyet', hazards: ['Kaygan zemin düşme', 'Görüş kısıtlı geri manevra'] },
                            ]},
                        ],
                    },

                    // 12. Temizlik, Dezenfeksiyon ve Kimyasal Kullanım
                    {
                        id: 'kj_temizlik', label: 'Temizlik, Dezenfeksiyon ve Kimyasal Kullanım', icon: 'cleaning_services',
                        subPhases: [
                            { id: 'kj_tem_1', label: 'Kimyasal Depolama ve Etiketleme', items: [
                                { id: id(), label: 'Temizlik kimyasalları kilitli depo dolabı – çocuk erişim engeli', itemType: 'ortam', hazards: ['Çocuk kimyasal içmesi', 'Yanlış kullanım'] },
                                { id: id(), label: 'Kimyasal ürün etiketleme ve SDS dosyası erişimi', itemType: 'faaliyet', hazards: ['Yanlış ürün kullanımı', 'Kimyasal reaksiyon', 'Mevzuat ihlali'] },
                                { id: id(), label: 'Farklı kimyasalların karıştırılması – klorlu/amonyaklı karışım yasağı', itemType: 'faaliyet', hazards: ['Toksik gaz oluşumu', 'Zehirlenme'] },
                            ]},
                            { id: 'kj_tem_2', label: 'Islak Zemin ve Havalandırma', items: [
                                { id: id(), label: 'Islak zemin tabelası ve temizlik sırasında alan kapatma', itemType: 'faaliyet', hazards: ['Kayma-düşme (öğrenci/personel)', 'Fraktür yaralanması'] },
                                { id: id(), label: 'Dezenfektanların seyrelti oranı ve kişisel KKD', itemType: 'faaliyet', hazards: ['Cilt/göz irritasyonu', 'Konsantre kimyasal maruziyeti'] },
                                { id: id(), label: 'Temizlik sonrası havalandırma süresi – kimyasal buhar temizliği', itemType: 'faaliyet', hazards: ['Solunum yolu tahrişi', 'Dersin kimyasal buharla başlaması'] },
                            ]},
                        ],
                    },

                    // 13. Bakım-Onarım ve Teknik İşler
                    {
                        id: 'kj_bakim', label: 'Bakım-Onarım ve Teknik İşler', icon: 'build',
                        subPhases: [
                            { id: 'kj_bak_1', label: 'El Aletleri, Yüksekte Çalışma ve Çatı', items: [
                                { id: id(), label: 'Yüksekte çalışma izni (2 m üzeri) ve güvenli merdiven kullanımı', itemType: 'faaliyet', hazards: ['Düşme', 'Merdiven kayması', 'Nesne düşmesi'] },
                                { id: id(), label: 'Matkap, taşlama gibi el aletleri güvenli kullanım', itemType: 'faaliyet', hazards: ['El/göz yaralanması', 'Elektrik çarpması'] },
                                { id: id(), label: 'Çatı erişimi – güvenlik halatı ve güvenli geçiş planı', itemType: 'faaliyet', hazards: ['Düşme', 'Çatı yüzeyi kayması', 'Çatı çökmesi'] },
                                { id: id(), label: 'Taşeron/bakım firması çalışma izni ve gözetim', itemType: 'faaliyet', hazards: ['Taşeron kazası', 'Koordinasyonsuz çalışma'] },
                            ]},
                            { id: 'kj_bak_2', label: 'Elektrik ve LOTO', items: [
                                { id: id(), label: 'Elektrik arıza müdahalesi – yetkili elektrikçi zorunluluğu', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Ark flaşı', 'Yangın'] },
                                { id: id(), label: 'Enerji izolasyonu (LOTO) prosedürü', itemType: 'faaliyet', hazards: ['Beklenmedik enerji gelişi', 'Elektrik çarpması'] },
                                { id: id(), label: 'Okul çalışır durumdayken bakım koordinasyonu – öğrenci güvenliği', itemType: 'faaliyet', hazards: ['Bakım alanına öğrenci girişi', 'Nesne düşmesi'] },
                            ]},
                        ],
                    },

                    // 14. Elektrik, Mekanik ve Bina Teknik Sistemleri
                    {
                        id: 'kj_teknik', label: 'Elektrik, Mekanik ve Bina Teknik Sistemleri', icon: 'electrical_services',
                        subPhases: [
                            { id: 'kj_tek_1', label: 'Elektrik Panoları, Jeneratör ve UPS', items: [
                                { id: id(), label: 'Elektrik dağıtım panosu erişim kilidi ve yetkisiz giriş engeli', itemType: 'ortam', hazards: ['Çocuk elektrik çarpması', 'Yetkisiz müdahale'] },
                                { id: id(), label: 'Jeneratör egzoz havalandırması ve CO riski', itemType: 'ekipman', hazards: ['CO zehirlenmesi', 'Yakıt yangını'] },
                                { id: id(), label: 'Periyodik elektrik tesisatı kontrolü ve TS EN 62446 uyumu', itemType: 'faaliyet', hazards: ['Eski tesisat yangını', 'Kaçak akım'] },
                            ]},
                            { id: 'kj_tek_2', label: 'HVAC, Asansör, Kazan ve Su Sistemi', items: [
                                { id: id(), label: 'Kazan dairesi erişim kilidi ve periyodik bakım', itemType: 'ortam', hazards: ['Patlama', 'Yanma', 'Çocuk erişimi'] },
                                { id: id(), label: 'Asansör yıllık bakım ve acil durum iletişim sistemi', itemType: 'ekipman', hazards: ['Mahsur kalma', 'Kapı sıkışması'] },
                                { id: id(), label: 'HVAC filtre temizliği ve Legionella riski (soğutma kulesi varsa)', itemType: 'faaliyet', hazards: ['Legionella maruziyeti', 'Çocuk solunum hastalığı'] },
                                { id: id(), label: 'Su deposu temizliği ve hijyen kontrolü', itemType: 'faaliyet', hazards: ['Mikrobiyolojik kontaminasyon', 'Toplu hastalık'] },
                            ]},
                        ],
                    },

                    // 15. Yangın, Acil Durum ve Afet
                    {
                        id: 'kj_yangin', label: 'Yangın, Acil Durum ve Afet', icon: 'local_fire_department',
                        subPhases: [
                            { id: 'kj_yan_1', label: 'Yangın Algılama, Söndürme ve Tahliye', items: [
                                { id: id(), label: 'Yangın algılama sistemi bakımı ve yıllık test', itemType: 'ekipman', hazards: ['Algılama gecikmesi', 'Yanlış alarm – tahliye refleksi körelmesi'] },
                                { id: id(), label: 'Yangın söndürücü doluluk ve erişilebilirlik kontrolü', itemType: 'ekipman', hazards: ['Boş söndürücü', 'Erişim engeli'] },
                                { id: id(), label: 'Tahliye planı, kat ve acil çıkış görevlileri atama', itemType: 'faaliyet', hazards: ['Plansız tahliye karmaşası', 'Personel sayım hatası'] },
                                { id: id(), label: 'Engelli ve küçük yaş grubu öğrenci tahliye senaryosu', itemType: 'faaliyet', hazards: ['Tahliye gecikmesi', 'Yavaş hareket eden grubun geride kalması'] },
                            ]},
                            { id: 'kj_yan_2', label: 'Deprem ve Tatbikat', items: [
                                { id: id(), label: 'Deprem sırasında sığınma noktaları ve güvenli alan belirleme', itemType: 'faaliyet', hazards: ['Yanlış pozisyon – nesne altında kalma'] },
                                { id: id(), label: 'Toplanma alanı yeterliliği ve yolun açıklığı', itemType: 'ortam', hazards: ['Park kalabalığı – toplanma alanı bloke', 'Araç çarpışması riski'] },
                                { id: id(), label: 'Yılda en az 1 yangın + 1 deprem tatbikatı ve kayıt', itemType: 'faaliyet', hazards: ['Tahliye alışkanlığı edinilmemesi', 'Mevzuat ihlali'] },
                                { id: id(), label: 'Tatbikat sonrası değerlendirme ve DÖF', itemType: 'faaliyet', hazards: ['Tatbikat bulguları iyileştirilmemesi'] },
                            ]},
                        ],
                    },

                    // 16. Sağlık Odası, İlk Yardım ve İlaç Yönetimi
                    {
                        id: 'kj_saglik', label: 'Sağlık Odası, İlk Yardım ve İlaç Yönetimi', icon: 'medical_services',
                        subPhases: [
                            { id: 'kj_sag_1', label: 'Revir ve İlk Yardım', items: [
                                { id: id(), label: 'Sağlık odası / revir asgari donanımı ve okul hemşiresi/görevlisi', itemType: 'ortam', hazards: ['Acil müdahalede ekipman eksikliği', 'Gecikmeli sağlık müdahalesi'] },
                                { id: id(), label: 'İlk yardım dolabı içerik kontrolü ve son kullanma tarihi', itemType: 'ekipman', hazards: ['Yetersiz ilk yardım', 'Süresi geçmiş malzeme'] },
                                { id: id(), label: 'İlk yardım sertifikalı personel sayısı ve liste güncelliği', itemType: 'faaliyet', hazards: ['İlk yardımcısız kaza', 'Sertifika süresi dolmuş personel'] },
                                { id: id(), label: 'AED (otomatik defibrilatör) varlığı, erişimi ve yıllık test', itemType: 'ekipman', hazards: ['Kardiyak arrest – AED yokluğu', 'Pil tükenmişliği'] },
                            ]},
                            { id: 'kj_sag_2', label: 'İlaç Yönetimi ve Özel Sağlık Durumları', items: [
                                { id: id(), label: 'Kronik ilaç kullanan öğrenci (epilepsi, astım, diyabet) takip planı', itemType: 'faaliyet', hazards: ['İlaç verilmemesi – kriz', 'Yanlış ilaç'] },
                                { id: id(), label: 'Epipen (anafilaksi) varlığı, depolama ve kullanım eğitimi', itemType: 'ekipman', hazards: ['Anafilaksi krizi – epinefrinsiz müdahale'] },
                                { id: id(), label: 'Veli onayı olmadan ilaç verme yasağı prosedürü', itemType: 'faaliyet', hazards: ['İlaç hatası', 'Hukuki yükümlülük'] },
                                { id: id(), label: 'Acil sağlık çağrısı prosedürü ve ambulans erişim yolu', itemType: 'faaliyet', hazards: ['Gecikmeli ambulans', 'Ambulans girişi engellenmiş kapı'] },
                            ]},
                        ],
                    },

                    // 17. Psikososyal Risk ve Davranışsal Güvenlik
                    {
                        id: 'kj_psiko', label: 'Psikososyal Risk ve Davranışsal Güvenlik', icon: 'psychology',
                        subPhases: [
                            { id: 'kj_psi_1', label: 'Personel Psikososyal Riskleri', items: [
                                { id: id(), label: 'Öğretmen yoğun iş yükü, fazla mesai ve tükenmişlik riski', itemType: 'faaliyet', hazards: ['Tükenmişlik sendromu', 'Hata artışı', 'Uzun süreli devamsızlık'] },
                                { id: id(), label: 'Nöbet sistemi stres ve yalnız çalışma riski', itemType: 'faaliyet', hazards: ['Nöbette yaralanma geç fark edilmesi', 'Psikolojik yük'] },
                                { id: id(), label: 'Mobbing / taciz bildirimi ve soruşturma prosedürü', itemType: 'faaliyet', hazards: ['Çözümsüz kalan taciz', 'Psikolojik hasar', 'Personel devri'] },
                            ]},
                            { id: 'kj_psi_2', label: 'Öğrenci Kriz Yönetimi ve Müdahale', items: [
                                { id: id(), label: 'Kriz yaşayan öğrenci (panik atak, kendine zarar) güvenli müdahale protokolü', itemType: 'faaliyet', hazards: ['Yanlış müdahale', 'Durum ağırlaşması', 'Hukuki risk'] },
                                { id: id(), label: 'Öğrenci-veli çatışması ve fiziksel gerginlik yönetimi', itemType: 'faaliyet', hazards: ['Personele fiziksel saldırı', 'Hukuki sorun'] },
                                { id: id(), label: 'Akşam ve hafta sonu etkinliklerinde azaltılmış personel güvenliği', itemType: 'faaliyet', hazards: ['Yetersiz gözetim', 'Kaza geç fark edilmesi'] },
                            ]},
                        ],
                    },

                    // 18. Etkinlik, Tören ve Toplu Organizasyon
                    {
                        id: 'kj_etkinlik', label: 'Etkinlik, Tören ve Toplu Organizasyon', icon: 'celebration',
                        subPhases: [
                            { id: 'kj_etk_1', label: 'Kalabalık Yönetimi ve Sahne Kurulumu', items: [
                                { id: id(), label: 'Mezuniyet töreni / gösteri kalabalık yönetimi ve tahliye planı', itemType: 'faaliyet', hazards: ['İzdiham', 'Panik', 'Çıkış blokajı'] },
                                { id: id(), label: 'Sahne ve tribün geçici kurulum yapısal kontrol', itemType: 'faaliyet', hazards: ['Yapı çökmesi', 'Yük aşımı'] },
                                { id: id(), label: 'Geçici elektrik ve ses sistemi kurulum güvenliği', itemType: 'faaliyet', hazards: ['Elektrik çarpması', 'Kablo üzerine düşme', 'Aşırı yük yangını'] },
                                { id: id(), label: 'Söküm sırasında iş ekipmanları ve yüksekte çalışma', itemType: 'faaliyet', hazards: ['Düşme', 'Ekipman üstüne düşmesi', 'LOTO ihlali'] },
                            ]},
                            { id: 'kj_etk_2', label: 'Geziler ve Dış Etkinlikler', items: [
                                { id: id(), label: 'Okul gezisi risk değerlendirmesi ve veli onayı', itemType: 'faaliyet', hazards: ['Belirsiz sorumluluk', 'Kaza halinde hukuki boşluk'] },
                                { id: id(), label: 'Gezi aracı ve rehber yeterliliği', itemType: 'faaliyet', hazards: ['Muayenesiz araç', 'Rehbersiz gezi – kayıp öğrenci'] },
                                { id: id(), label: 'Gezi güzergâhı ve destinasyon risk tespiti', itemType: 'faaliyet', hazards: ['Tehlikeli aktivite', 'Coğrafi risk', 'İlk yardım imkânsızlığı'] },
                                { id: id(), label: 'Kulüp etkinlikleri gözetim ve güvenli alan tespiti', itemType: 'faaliyet', hazards: ['Gözetimsiz aktivite', 'Alan yetersizliği – yaralanma'] },
                            ]},
                        ],
                    },
                ],
            },
        ],
    },

];

// Tüm sektörlere Ortak İnceleme Konuları modülü eklenir
GUIDED_LIBRARY.forEach(sector => sector.subtypes.push(COMMON_SUBTYPE));
