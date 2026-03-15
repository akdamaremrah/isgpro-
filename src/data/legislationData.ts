export interface Regulation {
    id: string;
    title: string;
    mbs_link?: string;
    kaysis_link?: string;
    local_link?: string;
    category: string;
    content?: string;
}

export const legislationData: Regulation[] = [
    {
        id: "reg_0",
        title: "Alt İşverenlik Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=12401&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/38317",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/aiy7.5.12401.doc",
        category: "Genel"
    },
    {
        id: "reg_1",
        title: "Analık İzni veya Ücretsiz İzin Sonrası Yapılacak Kısmi Süreli Çalışmalar Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23039&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/48737",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/23039.pdf",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_2",
        title: "Asansör İşletme ve Bakım Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=31350&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/151320",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/151320.pdf",
        category: "Ekipman"
    },
    {
        id: "reg_3",
        title: "Asansör Periyodik Kontrol Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=24505&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/52834",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/52834.pdf",
        category: "Ekipman"
    },
    {
        id: "reg_4",
        title: "Asansör Yönetmeliği (2014/33/AB)",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=21976&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/46880",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/46880.pdf",
        category: "Ekipman"
    },
    {
        id: "reg_5",
        title: "Askeri İşyerleri ile Yurt Güvenliği İçin Gerekli Maddeler Üretilen İşyerlerinde Denetim, Teftiş ve Alınacak Sağlık ve Güvenlik Önlemlerine İlişkin Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17278&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42220",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/aiytygigmaisvdasvgoiy7.5.17278.doc",
        category: "Sağlık"
    },
    {
        id: "reg_6",
        title: "Balıkçı Gemilerinde Yapılan Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16905&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/41873",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/bgycsvsvgoiy7.5.16905.doc",
        category: "Sağlık"
    },
    {
        id: "reg_7",
        title: "Binaların Yangından Korunması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=200712937&MevzuatTur=21&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35165",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/bykhy21.5.12937.doc",
        category: "Güvenlik"
    },
    {
        id: "reg_8",
        title: "Biyolojik Etkenlere Maruziyet Risklerinin Önlenmesi Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18536&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42436",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/bemrophy7.5.18536.doc",
        category: "Sağlık"
    },
    {
        id: "reg_9",
        title: "Büyük Endüstriyel Kazaların Önlenmesi ve Etkilerinin Azaltılması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=31154&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/148762",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/148762.pdf",
        category: "Güvenlik"
    },
    {
        id: "reg_10",
        title: "Çalışma Gücü ve Meslekte Kazanma Gücü Kaybı Oranı Tespit İşlemleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=12448&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/38346",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/cgmkgkoti7.5.12448.doc",
        category: "Genel"
    },
    {
        id: "reg_11",
        title: "Çalışma Hayatına İlişkin Bazı Bilgilerin ve Belgelerin Bildirilmesine Dair Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5463&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35384",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/chibbvbbdy7.5.5463.doc",
        category: "Genel"
    },
    {
        id: "reg_12",
        title: "Çocuk ve Genç İşçilerin Çalıştırılma Usul ve Esasları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6250&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35650",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/cvgicuehy7.5.6250.doc",
        category: "Genel"
    },
    {
        id: "reg_13",
        title: "Deniz İş Kanununa İlişkin Çalışma ve Dinlenme Süreleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18151&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42304",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/dikicsvdshy7.5.18151.doc",
        category: "Genel"
    },
    {
        id: "reg_14",
        title: "Ekranlı Araçlarla Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18335&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42358",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/eacsvgoiy7.5.18335.doc",
        category: "Sağlık"
    },
    {
        id: "reg_15",
        title: "Elektrik İç Tesisleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=11162&MevzuatTur=7&MevzuatTertip=4",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/34002",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/eity7.4.11162.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_16",
        title: "Elektrik Kuvvetli Akım Tesisleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6147&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35544",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/ekaty7.5.6147.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_17",
        title: "Elektrik Tesislerinde Topraklamalar Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6115&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35512",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/etty7.5.6115.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_18",
        title: "Elle Taşıma İşleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18641&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42525",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/etiy7.5.18641.doc",
        category: "Genel"
    },
    {
        id: "reg_19",
        title: "Engelli, Eski Hükümlü ve Terör Mağduru İstihdamı Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=12140&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/38315",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/eehvtmihy7.5.12140.doc",
        category: "Genel"
    },
    {
        id: "reg_20",
        title: "Gemi Adamlarının Eğitim, Sınav, Vardiya Tutma, Kütükleme ve Donatılma Esasları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6387&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35764",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/gaesvtkvdehy7.5.6387.doc",
        category: "Eğitim"
    },
    {
        id: "reg_21",
        title: "Geçici veya Belirli Süreli İşlerde İş Sağlığı ve Güvenliği Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18742&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42609",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/gvbsiisghy7.5.18742.doc",
        category: "Genel"
    },
    {
        id: "reg_22",
        title: "Haftalık İş Günlerine Bölünemeyen Çalışma Süreleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6251&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35651",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/higbcsy7.5.6251.doc",
        category: "Genel"
    },
    {
        id: "reg_23",
        title: "Hazırlama, Tamamlama ve Temizleme İşleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6252&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35652",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/httiy7.5.6252.doc",
        category: "Genel"
    },
    {
        id: "reg_24",
        title: "Hijyen Eğitimi Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18512&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42403",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/hey7.5.18512.doc",
        category: "Sağlık"
    },
    {
        id: "reg_25",
        title: "İlkyardım Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=20970&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/44933",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/iy7.5.20970.doc",
        category: "Genel"
    },
    {
        id: "reg_26",
        title: "İş Ekipmanlarının Kullanımında Sağlık ve Güvenlik Şartları Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18311&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42352",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/42352ieksgsy.pdf",
        category: "Sağlık"
    },
    {
        id: "reg_27",
        title: "İş Güvenliği Uzmanlarının Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16926&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/41900",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/41900.pdf",
        category: "Güvenlik"
    },
    {
        id: "reg_28",
        title: "İş Hijyeni Ölçüm, Test ve Analizleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=40042&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/193818",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/193818.pdf",
        category: "Sağlık"
    },
    {
        id: "reg_29",
        title: "İş Sağlığı ve Güvenliği Hizmetleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16924&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/41898",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/41898.pdf",
        category: "Genel"
    },
    {
        id: "reg_30",
        title: "İş Sağlığı ve Güvenliği Kurulları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17031&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/41958",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/isvgkhy7.5.17031.doc",
        category: "Genel"
    },
    {
        id: "reg_31",
        title: "İş Sağlığı ve Güvenliği Risk Değerlendirmesi Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16925&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/41899",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/isvgrdy7.5.16925.doc",
        category: "Genel"
    },
    {
        id: "reg_32",
        title: "İşyeri Bina ve Eklentilerinde Alınacak Sağlık ve Güvenlik Önlemlerine İlişkin Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18592&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42469",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/ibveasvgoiy7.5.18592.doc",
        category: "Sağlık"
    },
    {
        id: "reg_33",
        title: "İşyeri Hekimi ve Diğer Sağlık Personelinin Görev, Yetki, Sorumluluk ve Eğitimleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18615&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42492",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/42492.pdf",
        category: "Sağlık"
    },
    {
        id: "reg_34",
        title: "İşyerlerinde Acil Durumlar Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18493&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42377",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/42377iadhy.pdf",
        category: "Genel"
    },
    {
        id: "reg_35",
        title: "Kanserojen veya Mutajen Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18701&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42566",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kmvmcsvgoiy7.5.18701.doc",
        category: "Sağlık"
    },
    {
        id: "reg_36",
        title: "Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18642&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42526",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kmcsvgoiy7.5.18642.doc",
        category: "Sağlık"
    },
    {
        id: "reg_37",
        title: "Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18494&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42378",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kkdikhy7.5.18494.doc",
        category: "Ekipman"
    },
    {
        id: "reg_38",
        title: "Maden İşyerlerinde İş Sağlığı ve Güvenliği Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18833&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42700",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/miisghy7.5.18833.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_39",
        title: "Patlayıcı Ortamların Tehlikelerinden Çalışanların Korunması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17254&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42157",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/potckhy7.5.17254.doc",
        category: "Güvenlik"
    },
    {
        id: "reg_40",
        title: "Sağlık ve Güvenlik İşaretleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18749&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42621",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/svgiy7.5.18749.doc",
        category: "Sağlık"
    },
    {
        id: "reg_41",
        title: "Tozla Mücadele Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18939&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42823",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/tmy7.5.18939.doc",
        category: "Genel"
    },
    {
        id: "reg_42",
        title: "Yapı İşlerinde İş Sağlığı ve Güvenliği Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18804&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42674",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/yiisghy7.5.18804.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_43",
        title: "Yıllık Ücretli İzin Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5451&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35376",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/yuiy7.5.5451.doc",
        category: "Sosyal Haklar"
    },
    {
        id: "reg_44",
        title: "Kamu Görevlileri Etik Davranış İlkeleri ile Başvuru Usul ve Esasları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=8183&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/36735",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kgedibuvehy7.5.8183.doc",
        category: "Genel"
    },
    {
        id: "reg_45",
        title: "Kamu Kurum ve Kuruluşlarına Eski Hükümlü veya Terörle Mücadelede Malul Sayılmayacak Şekilde Yaralananların İşçi Olarak Alınmasında Uygulanacak Usul ve Esaslar Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13447&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/39263",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kkvkehvtmmssyioauuvehy7.5.13447.doc",
        category: "Genel"
    },
    {
        id: "reg_46",
        title: "Kanserojen veya Mutajen Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18695&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42569",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kvmmcsvgohy7.5.18695.doc",
        category: "Sağlık"
    },
    {
        id: "reg_47",
        title: "Kazı Destek Yapıları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39898&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://www.mevzuat.gov.tr/mevzuatmetin/yonetmelik/7.5.39898EK.zip",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/7.5.39898.pdf",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_48",
        title: "Kimyasal Maddelerle Çalışmalarda Sağlık ve Güvenlik Önlemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18709&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42582",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kmcsvgohy7.5.18709.pdf",
        category: "Sağlık"
    },
    {
        id: "reg_49",
        title: "Kimyasalların Kaydı, Değerlendirilmesi, İzni ve Kısıtlanması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23694&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/106452",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/7.5.23694.pdf",
        category: "Genel"
    },
    {
        id: "reg_50",
        title: "Kişisel Koruyucu Donanım Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=31465&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/151126",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kkdy7.5.31465.doc",
        category: "Ekipman"
    },
    {
        id: "reg_51",
        title: "Kişisel Koruyucu Donanımların İşyerlerinde Kullanılması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18540&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42418",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kkdikhy7.5.18540.doc",
        category: "Ekipman"
    },
    {
        id: "reg_52",
        title: "Konut Kapıcıları Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=5449&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35375",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/kky7.5.5449.doc",
        category: "Genel"
    },
    {
        id: "reg_53",
        title: "Korumalı İşyerleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39309&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/185743",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/korumaliihy185743.pdf",
        category: "Genel"
    },
    {
        id: "reg_54",
        title: "Kısa Çalışma ve Kısa Çalışma Ödeneğine İlişkin Usul ve Esaslar Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=40836&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/202808",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/202808.pdf",
        category: "Genel"
    },
    {
        id: "reg_55",
        title: "Maddelerin ve Karışımların Fiziko-Kimyasal, Toksikolojik ve Ekotoksikolojik Özelliklerinin Belirlenmesinde Uygulanacak Test Yöntemleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19109&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42961",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/mvkfktveobutyhy7.5.19109.doc",
        category: "Genel"
    },
    {
        id: "reg_56",
        title: "Maddelerin ve Karışımların Sınıflandırılması, Etiketlenmesi ve Ambalajlanması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19108&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42960",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/mvksevahy7.5.19108.doc",
        category: "Genel"
    },
    {
        id: "reg_57",
        title: "Maden İşyerlerinde İş Sağlığı ve Güvenliği Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18858&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42721",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/miisvgy7.5.18858.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_58",
        title: "Makina Emniyeti Yönetmeliği (2006/42/AT)",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=12907&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/38904",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/mey7.5.12907.doc",
        category: "Ekipman"
    },
    {
        id: "reg_59",
        title: "Sağlık Kuralları Bakımından Günde Azami Yedi Buçuk Saat veya Daha Az Çalışılması Gereken İşler Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18588&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42465",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/skbgaybsvdacgihy7.5.18588.doc",
        category: "Sağlık"
    },
    {
        id: "reg_60",
        title: "Sağlık ve Güvenlik İşaretleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18829&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42693",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/svgiy7.5.18829.doc",
        category: "Sağlık"
    },
    {
        id: "reg_61",
        title: "Sendika ve Konfederasyonların Denetim Esasları ve Tutacakları Defterler ile Toplu İş Sözleşmesi Sicili Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19053&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42907",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/svkdevtditisshy7.5.19053.doc",
        category: "Genel"
    },
    {
        id: "reg_62",
        title: "Sendika Üyeliğinin Kazanılması ve Sona Ermesi ile Üyelik Aidatının Tahsili Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18562&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42439",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/sukvseiuathy7.5.18562.doc",
        category: "Genel"
    },
    {
        id: "reg_63",
        title: "Serbest Bölgelerde Çalışacak Yabancıların Çalışma İzinlerine Dair Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23611&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/105629",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/sbcycidy7.5.23611.doc",
        category: "Genel"
    },
    {
        id: "reg_64",
        title: "Sosyal Sigorta İşlemleri Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13973&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/39623",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/ssiy7.5.13973.doc",
        category: "Sosyal Haklar"
    },
    {
        id: "reg_65",
        title: "Sıvılaştırılmış Petrol Gazları (LPG) Piyasası Eğitim ve Sorumlu Müdür Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=16852&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/41833",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/spgpevsmy7.5.16852.doc",
        category: "Eğitim"
    },
    {
        id: "reg_66",
        title: "Şantiye Şefleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=31300&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/150459",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/7.5.31300.pdf",
        category: "Genel"
    },
    {
        id: "reg_67",
        title: "Tarımda İş Aracılığı Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13997&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/39642",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/tiay7.5.13997.doc",
        category: "Genel"
    },
    {
        id: "reg_68",
        title: "Tebligat Kanununun Uygulanmasına Dair Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=15828&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/40954",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/tkudy7.5.15828.doc",
        category: "Genel"
    },
    {
        id: "reg_69",
        title: "Tehlikeli ve Çok Tehlikeli Sınıfta Yer Alan İşlerde Çalıştırılacakların Mesleki Eğitimlerine Dair Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18581&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42458",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/tvctsyaicmedy7.5.18581.doc",
        category: "Eğitim"
    },
    {
        id: "reg_70",
        title: "Toplu İş Sözleşmesi Yetki Tespiti ile Grev Oylaması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=18938&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42798",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/tisytigohy7.5.18938.doc",
        category: "Genel"
    },
    {
        id: "reg_71",
        title: "Toplu İş Sözleşmesinde Arabulucuya ve Hakeme Başvurma Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=19094&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42947",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/7.5.19094.doc",
        category: "Genel"
    },
    {
        id: "reg_72",
        title: "Tıbbi Atıkların Kontrolü Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=23273&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/95749",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/taky7.5.23273.doc",
        category: "Sağlık"
    },
    {
        id: "reg_73",
        title: "Ulusal İş Sağlığı ve Güvenliği Konseyi Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=17095&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/42013",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/uisvgky7.5.17095.doc",
        category: "Genel"
    },
    {
        id: "reg_74",
        title: "Ulusal Meslek Standartlarının ve Ulusal Yeterliliklerin Hazırlanması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=21185&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/59559",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/umsvuyhhy7.5.21185.doc",
        category: "Genel"
    },
    {
        id: "reg_75",
        title: "Uluslararası İşgücü Danışma Kurulunun Çalışma Usul ve Esasları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=42659&MevzuatTur=7&MevzuatTertip=5",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/7.5.42659.pdf",
        category: "Genel"
    },
    {
        id: "reg_76",
        title: "Uluslararası İşgücü Kanunu Uygulama Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=39337&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/186830",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/7.5.39337.pdf",
        category: "Genel"
    },
    {
        id: "reg_77",
        title: "Uzaktan Çalışma Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=38393&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/173025",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/ucy7.5.38393.doc",
        category: "Genel"
    },
    {
        id: "reg_78",
        title: "Yapı Denetimi Uygulama Yönetmeliği",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=11951&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/38337",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/yduy7.5.11951.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_79",
        title: "Yapı Müteahhitlerinin Sınıflandırılması ve Kayıtlarının Tutulması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=31301&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/150460",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/ymsvkthy7.5.31301.doc",
        category: "Tehlikeli İşler"
    },
    {
        id: "reg_80",
        title: "Yurtiçinde İşe Yerleştirme Hizmetleri Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=13013&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/38973",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/yiyhhy7.5.13013.doc",
        category: "Genel"
    },
    {
        id: "reg_81",
        title: "Yüzdelerden Toplanan Paraların İşçilere Dağıtılması Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=6247&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/35644",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/ytpidhy7.5.6247.doc",
        category: "Genel"
    },
    {
        id: "reg_82",
        title: "Zararlı Maddeler ve Karışımlara İlişkin Güvenlik Bilgi Formları Hakkında Yönetmelik",
        mbs_link: "https://www.mevzuat.gov.tr/mevzuat?MevzuatNo=20309&MevzuatTur=7&MevzuatTertip=5",
        kaysis_link: "https://kms.kaysis.gov.tr/Home/Goster/44062",
        local_link: "https://bilgit.com/mevzuat/yonetmelikler/zmvkigbfhy7.5.20309.doc",
        category: "Güvenlik"
    }
];
