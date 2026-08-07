// ==========================================
// Kurum (Üst Küme - Level 1)
// ==========================================
export interface Kurum {
    id: string
    name: string
    slug: string
    description: string
    icon: string // kept for fallback/compatibility
    color: string // accent color for UI
    productCount: number
    order?: number
    showOnHomepage?: boolean
    status?: 'active' | 'passive'
    image?: string
    seoTitle?: string
    seoDescription?: string
}

export const allKurumlar: Kurum[] = [
    {
        id: 'k1',
        name: 'Hazine ve Maliye Bakanlığı',
        slug: 'hazine-maliye-bakanligi',
        description: 'Görevde Yükselme, V.H.K.İ ve Şef kadroları için kapsamlı eğitim setleri.',
        icon: 'Landmark',
        color: '#2563EB',
        productCount: 8
    },
    {
        id: 'k2',
        name: 'Adalet Bakanlığı',
        slug: 'adalet-bakanligi',
        description: 'Zabıt Kâtibi, İcra Müdürlüğü ve Yazı İşleri Müdürlüğü sınav hazırlıkları.',
        icon: 'Scale',
        color: '#7c3aed',
        productCount: 6
    },
    {
        id: 'k3',
        name: 'İçişleri Bakanlığı',
        slug: 'icisleri-bakanligi',
        description: 'Nüfus ve Vatandaşlık İşleri, İl Müdürlükleri GYS hazırlıkları.',
        icon: 'Shield',
        color: '#0d9488',
        productCount: 5
    },
    {
        id: 'k4',
        name: 'Sağlık Bakanlığı',
        slug: 'saglik-bakanligi',
        description: 'Sağlık personeli görevde yükselme ve unvan değişikliği sınav hazırlıkları.',
        icon: 'HeartPulse',
        color: '#dc2626',
        productCount: 4
    },
    {
        id: 'k5',
        name: 'Milli Eğitim Bakanlığı',
        slug: 'milli-egitim-bakanligi',
        description: 'Şube Müdürü, Şef ve diğer kadrolar için görevde yükselme eğitimleri.',
        icon: 'GraduationCap',
        color: '#d97706',
        productCount: 5
    },
    {
        id: 'k6',
        name: 'Genel GYS / Ortak Mevzuat',
        slug: 'genel-gys',
        description: 'Tüm kurumlarda geçerli ortak mevzuat dersleri: Anayasa, İdare Hukuku, 657 vb.',
        icon: 'Briefcase',
        color: '#475569',
        productCount: 12
    }
]

export function getKurumBySlug(slug: string): Kurum | undefined {
    return allKurumlar.find(k => k.slug === slug)
}

// ==========================================
// AltKategori (Orta Küme - Level 2)
// ==========================================
export interface AltKategori {
    name: string
    slug: string
    description: string
    productCount: number
    kurumSlugs?: string[]
}

// ==========================================
// Product / Ders (Alt Küme - Level 3)
// ==========================================
export interface ProductCoupon {
    id: string
    code: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    maxUses?: number
    usedCount: number
    description: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    salePrice: number | null
    image: string
    categoryName: string // e.g. "Online Eğitim", "Kitap Seti"
    kurumSlug: string // Level 1 parent
    kurumSlugs?: string[]
    altKategoriSlug: string // Level 2 parent slug
    altKategoriName: string // Level 2 parent name
    altKategoriSlugs?: string[]
    altKategoriNames?: string[]
    isFeatured?: boolean
    status?: 'active' | 'passive'
    showOnHomepage?: boolean
    instructorName?: string
    totalDuration?: string
    categoryOrders?: Record<string, number>
    images?: string[]
    exclusiveCoupons?: string
    exclusiveCouponsList?: ProductCoupon[]
    order?: number
    features?: string[]
    whyUs?: { title: string; description: string }[]
    badges?: string[]
}

export const allProducts: Product[] = [
    // ==========================================
    // Hazine ve Maliye Bakanlığı (8 Ürün)
    // ==========================================
    {
        id: '1',
        name: '4688 Sayılı Kamu Görevlileri Sendikaları ve Toplu Sözleşme Kanunu',
        slug: '4688-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmen: Gürkan Sancak',
        price: 750,
        salePrice: 500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı',
        isFeatured: true
    },
    {
        id: '2',
        name: '2886 Sayılı Devlet İhale Kanunu',
        slug: '2886-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmen: Gürkan Sancak',
        price: 450,
        salePrice: 350,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı'
    },
    {
        id: '3',
        name: '4735 Sayılı Kamu İhale Sözleşmeleri Kanunu',
        slug: '4735-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmen: Gürkan Sancak',
        price: 450,
        salePrice: 350,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı'
    },
    {
        id: '4',
        name: '4734 Sayılı Kamu İhale Kanunu',
        slug: '4734-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmen: Gürkan Sancak',
        price: 600,
        salePrice: 450,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı'
    },
    {
        id: '5',
        name: 'Hazine ve Maliye Bakanlığı V.H.K.İ Tam Paket',
        slug: 'hazine-maliye-vhki',
        description: 'Veri Hazırlama ve Kontrol İşletmeni - Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 6000,
        salePrice: 4500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'vhki-sinavi',
        altKategoriName: 'V.H.K.İ. Sınav Hazırlığı',
        isFeatured: true
    },
    {
        id: '6',
        name: '3628 Sayılı Mal Bildiriminde Bulunulması Kanunu',
        slug: '3628-sayili-kanun',
        description: 'Rüşvet ve Yolsuzluklarla Mücadele Kanunu - Konu Anlatımı',
        price: 600,
        salePrice: 450,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı'
    },
    {
        id: '7',
        name: '5018 Sayılı Kamu Mali Yönetimi ve Kontrol Kanunu',
        slug: '5018-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmen: Gürkan Sancak',
        price: 500,
        salePrice: 400,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı'
    },
    {
        id: '8',
        name: '6245 Sayılı Harcırah Kanunu',
        slug: '6245-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmen: Gürkan Sancak',
        price: 400,
        salePrice: 300,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı'
    },

    // ==========================================
    // Adalet Bakanlığı (6 Ürün)
    // ==========================================
    {
        id: '9',
        name: 'Adalet Bakanlığı Zabıt Kâtibi Hazırlık Seti',
        slug: 'adalet-zabit-katibi',
        description: 'Zabıt Kâtipliği sınavına yönelik tüm mevzuat ve soru bankası.',
        price: 3500,
        salePrice: 2800,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'zabit-katipligi',
        altKategoriName: 'Zabıt Kâtipliği Sınavı',
        isFeatured: true
    },
    {
        id: '10',
        name: 'İcra ve İflas Hukuku',
        slug: 'icra-iflas-hukuku',
        description: 'İcra Müdürlüğü sınavı için kapsamlı konu anlatımı ve soru çözümleri.',
        price: 800,
        salePrice: 650,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'icra-mudurlugu',
        altKategoriName: 'İcra Müdürlüğü Sınavı'
    },
    {
        id: '11',
        name: 'Ceza Muhakemesi Kanunu (CMK)',
        slug: 'ceza-muhakemesi-kanunu',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 600,
        salePrice: 500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'yazi-isleri-mudurlugu',
        altKategoriName: 'Yazı İşleri Müdürlüğü'
    },
    {
        id: '12',
        name: 'Hukuk Muhakemeleri Kanunu (HMK)',
        slug: 'hukuk-muhakemeleri-kanunu',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 600,
        salePrice: null,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'yazi-isleri-mudurlugu',
        altKategoriName: 'Yazı İşleri Müdürlüğü'
    },
    {
        id: '13',
        name: 'Adalet Bakanlığı Yazı İşleri Müdürlüğü Seti',
        slug: 'adalet-yazi-isleri',
        description: 'Yazı İşleri Müdürlüğü GYS sınavına hazırlık tam paket.',
        price: 4000,
        salePrice: 3200,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'yazi-isleri-mudurlugu',
        altKategoriName: 'Yazı İşleri Müdürlüğü'
    },
    {
        id: '14',
        name: 'Adalet Bakanlığı GYS Şef Kadrosu',
        slug: 'adalet-gys-sef',
        description: 'Şef kadrosu GYS sınavına yönelik hazırlık eğitim seti.',
        price: 3000,
        salePrice: 2500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'seflik-sinavi',
        altKategoriName: 'Şeflik Kadrosu Sınavı'
    },

    // ==========================================
    // İçişleri Bakanlığı (5 Ürün)
    // ==========================================
    {
        id: '15',
        name: 'İçişleri Bakanlığı GYS Tam Paket',
        slug: 'icisleri-gys-paket',
        description: 'Nüfus ve Vatandaşlık İşleri dahil tüm mevzuat dersleri.',
        price: 5000,
        salePrice: 3800,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'icisleri-bakanligi',
        altKategoriSlug: 'gorevde-yukselme',
        altKategoriName: 'Görevde Yükselme Sınavı'
    },
    {
        id: '16',
        name: '5490 Sayılı Nüfus Hizmetleri Kanunu',
        slug: '5490-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 500,
        salePrice: 400,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'icisleri-bakanligi',
        altKategoriSlug: 'nufus-goc-mevzuati',
        altKategoriName: 'Nüfus ve Göç Mevzuatı'
    },
    {
        id: '17',
        name: '5442 Sayılı İl İdaresi Kanunu',
        slug: '5442-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 450,
        salePrice: 350,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'icisleri-bakanligi',
        altKategoriSlug: 'ortak-mevzuat',
        altKategoriName: 'Ortak Konular & Kanunlar'
    },
    {
        id: '18',
        name: '6458 Sayılı Yabancılar ve Uluslararası Koruma Kanunu',
        slug: '6458-sayili-kanun',
        description: 'Göç İdaresi ve Yabancılar Hukuku - Konu Anlatımı',
        price: 500,
        salePrice: null,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'icisleri-bakanligi',
        altKategoriSlug: 'nufus-goc-mevzuati',
        altKategoriName: 'Nüfus ve Göç Mevzuatı'
    },
    {
        id: '19',
        name: 'İçişleri Bakanlığı Şube Müdürü GYS',
        slug: 'icisleri-sube-muduru',
        description: 'Şube Müdürü kadrosu GYS sınavına hazırlık.',
        price: 5500,
        salePrice: 4200,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'icisleri-bakanligi',
        altKategoriSlug: 'sube-mudurlugu',
        altKategoriName: 'Şube Müdürlüğü Sınavı'
    },

    // ==========================================
    // Sağlık Bakanlığı (4 Ürün)
    // ==========================================
    {
        id: '20',
        name: 'Sağlık Bakanlığı GYS Tam Paket',
        slug: 'saglik-gys-paket',
        description: 'Sağlık personeli görevde yükselme sınavı hazırlık seti.',
        price: 4500,
        salePrice: 3500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'saglik-bakanligi',
        altKategoriSlug: 'gorevde-yukselme',
        altKategoriName: 'Görevde Yükselme Sınavı'
    },
    {
        id: '21',
        name: '3359 Sayılı Sağlık Hizmetleri Temel Kanunu',
        slug: '3359-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 500,
        salePrice: 400,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'saglik-bakanligi',
        altKategoriSlug: 'saglik-mevzuati',
        altKategoriName: 'Sağlık Mevzuatı Konuları'
    },
    {
        id: '22',
        name: 'Sağlıkta Dönüşüm ve Yönetim Mevzuatı',
        slug: 'saglikta-donusum',
        description: 'Sağlık yönetimi ve dönüşüm programı mevzuat dersleri.',
        price: 600,
        salePrice: null,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'saglik-bakanligi',
        altKategoriSlug: 'saglik-mevzuati',
        altKategoriName: 'Sağlık Mevzuatı Konuları'
    },
    {
        id: '23',
        name: 'Hasta Hakları ve Tıbbi Etik',
        slug: 'hasta-haklari-etik',
        description: 'Hasta hakları yönetmeliği ve tıbbi etik ilkeleri.',
        price: 400,
        salePrice: 300,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'saglik-bakanligi',
        altKategoriSlug: 'saglik-mevzuati',
        altKategoriName: 'Sağlık Mevzuatı Konuları'
    },

    // ==========================================
    // Milli Eğitim Bakanlığı (5 Ürün)
    // ==========================================
    {
        id: '24',
        name: 'MEB GYS Şube Müdürü Tam Paket',
        slug: 'meb-gys-sube-muduru',
        description: 'Milli Eğitim Bakanlığı Şube Müdürü GYS hazırlık seti.',
        price: 5000,
        salePrice: 3800,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'milli-egitim-bakanligi',
        altKategoriSlug: 'sube-mudurlugu',
        altKategoriName: 'Şube Müdürlüğü Sınavı'
    },
    {
        id: '25',
        name: '1739 Sayılı Milli Eğitim Temel Kanunu',
        slug: '1739-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 500,
        salePrice: 400,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'milli-egitim-bakanligi',
        altKategoriSlug: 'meb-mevzuati',
        altKategoriName: 'Eğitim ve MEB Mevzuatı'
    },
    {
        id: '26',
        name: '652 Sayılı MEB Teşkilat Kanunu',
        slug: '652-sayili-kanun',
        description: 'MEB Teşkilat ve Görevleri Hakkında KHK - Konu Anlatımı',
        price: 450,
        salePrice: 350,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'milli-egitim-bakanligi',
        altKategoriSlug: 'meb-mevzuati',
        altKategoriName: 'Eğitim ve MEB Mevzuatı'
    },
    {
        id: '27',
        name: 'MEB GYS Şef Kadrosu',
        slug: 'meb-gys-sef',
        description: 'MEB Şef kadrosu GYS sınavına yönelik hazırlık eğitim seti.',
        price: 3500,
        salePrice: 2800,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'milli-egitim-bakanligi',
        altKategoriSlug: 'seflik-sinavi',
        altKategoriName: 'Şeflik Kadrosu Sınavı'
    },
    {
        id: '28',
        name: 'Öğretmen Atama ve Yer Değiştirme Yönetmeliği',
        slug: 'ogretmen-atama-yonetmeligi',
        description: 'Öğretmen atama mevzuatı konu anlatımı.',
        price: 400,
        salePrice: null,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'milli-egitim-bakanligi',
        altKategoriSlug: 'meb-mevzuati',
        altKategoriName: 'Eğitim ve MEB Mevzuatı'
    },

    // ==========================================
    // Genel GYS / Ortak Mevzuat (12 Ürün)
    // ==========================================
    {
        id: '29',
        name: '657 Sayılı Devlet Memurları Kanunu',
        slug: '657-sayili-kanun',
        description: 'Tüm kurumlarda geçerli temel mevzuat - Konu Anlatımı ve Soru Analizi',
        price: 700,
        salePrice: 550,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '30',
        name: 'T.C. Anayasası',
        slug: 'tc-anayasasi',
        description: 'Anayasa Hukuku konu anlatımı ve çıkmış soru analizi.',
        price: 600,
        salePrice: 450,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '31',
        name: '4982 Sayılı Bilgi Edinme Hakkı Kanunu',
        slug: '4982-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 350,
        salePrice: 250,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '32',
        name: '5176 Sayılı Kamu Görevlileri Etik Kanunu',
        slug: '5176-sayili-kanun',
        description: 'Kamu görevlileri etik ilkeleri - Konu Anlatımı',
        price: 350,
        salePrice: null,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '33',
        name: '3071 Sayılı Dilekçe Hakkının Kullanılması Kanunu',
        slug: '3071-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi',
        price: 300,
        salePrice: 200,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '34',
        name: 'İdare Hukuku Genel Esaslar',
        slug: 'idare-hukuku-genel',
        description: 'İdare Hukuku temel kavramlar ve güncel içtihatlar.',
        price: 600,
        salePrice: 500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '35',
        name: '4483 Sayılı Memurlar ve Diğer Kamu Görevlileri Hakkında Kanun',
        slug: '4483-sayili-kanun',
        description: 'Soruşturma izni ve ceza kovuşturması - Konu Anlatımı',
        price: 400,
        salePrice: 300,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '36',
        name: 'Resmi Yazışmalarda Uygulanacak Usul ve Esaslar',
        slug: 'resmi-yazismalar',
        description: 'Resmi yazışma kuralları ve format bilgisi.',
        price: 300,
        salePrice: null,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '37',
        name: '6098 Sayılı Türk Borçlar Kanunu (Özet)',
        slug: '6098-sayili-kanun',
        description: 'GYS sınavlarında çıkan Borçlar Kanunu konuları.',
        price: 400,
        salePrice: 300,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '38',
        name: 'Kamu Personel Rejimi ve Disiplin Hukuku',
        slug: 'kamu-personel-disiplin',
        description: 'Disiplin soruşturması, cezalar ve itiraz yolları.',
        price: 500,
        salePrice: 400,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '39',
        name: 'Türkiye Cumhuriyeti İnkılap Tarihi ve Atatürkçülük',
        slug: 'inkilap-tarihi',
        description: 'GYS sınavlarında çıkan İnkılap Tarihi konuları.',
        price: 350,
        salePrice: 250,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Ortak Mevzuat',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'ortak-kanunlar',
        altKategoriName: 'Ortak Kanunlar'
    },
    {
        id: '40',
        name: 'Genel GYS Tam Paket (Tüm Ortak Mevzuat)',
        slug: 'genel-gys-tam-paket',
        description: 'Tüm kurumlarda geçerli ortak mevzuat derslerinin tamamı tek pakette.',
        price: 8000,
        salePrice: 5500,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Tam Paket',
        kurumSlug: 'genel-gys',
        altKategoriSlug: 'tam-paketler',
        altKategoriName: 'Genel Sınav Paketleri'
    }
]

// ==========================================
// Dynamic Helpers for Three-Tier Hierarchy
// ==========================================

// Helper: Get unique AltKategoriler for a Ministry
export function getAltKategorilerByKurum(kurumSlug: string): AltKategori[] {
    const products = allProducts.filter(p => p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug)))
    const map = new Map<string, { name: string; count: number }>()

    products.forEach(p => {
        if (p.altKategoriSlugs && p.altKategoriNames) {
            p.altKategoriSlugs.forEach((slug, idx) => {
                const name = p.altKategoriNames?.[idx] || p.altKategoriName
                const item = map.get(slug)
                if (item) {
                    item.count++
                } else {
                    map.set(slug, { name, count: 1 })
                }
            })
        } else {
            const item = map.get(p.altKategoriSlug)
            if (item) {
                item.count++
            } else {
                map.set(p.altKategoriSlug, { name: p.altKategoriName, count: 1 })
            }
        }
    })

    const altKategoriler: AltKategori[] = []
    map.forEach((value, slug) => {
        // Custom short descriptions for AltKategoriler to look extremely professional
        let description = `${value.name} sınavlarına yönelik güncel hazırlık setleri ve dersler.`
        if (slug === 'yazi-isleri-mudurlugu') description = 'Yazı İşleri Müdürlüğü kadroları için kapsamlı konu anlatımları ve deneme sınavları.'
        if (slug === 'zabit-katipligi') description = 'Zabıt Kâtipliği sınavlarına özel hazırlık paketleri ve pratik dersler.'
        if (slug === 'icra-mudurlugu') description = 'İcra Müdürlüğü sınavı İcra-İflas Hukuku ve ilgili kanun dersleri.'
        if (slug === 'seflik-sinavi') description = 'Şef kadroları Görevde Yükselme Sınavı (GYS) müfredat dersleri.'
        if (slug === 'sube-mudurlugu') description = 'Şube Müdürü kadroları için A segmenti mevzuat konu anlatımları.'
        if (slug === 'nufus-goc-mevzuati') description = 'Nüfus Hizmetleri ve Göç İdaresi Kanunu ders modülleri.'
        if (slug === 'ortak-kanunlar') description = 'Tüm kurumlarda geçerli ortak kanunlar: Anayasa, 657 ve İdare Hukuku.'
        if (slug === 'tam-paketler') description = 'Tüm ortak mevzuat konularını kapsayan avantajlı kombine paketler.'

        altKategoriler.push({
            name: value.name,
            slug,
            description,
            productCount: value.count
        })
    })

    return altKategoriler
}

// Helper: Get products by subcategory
export function getProductsBySubcategory(kurumSlug: string, altKategoriSlug: string): Product[] {
    return allProducts.filter(p => 
        (p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug))) && 
        (p.altKategoriSlug === altKategoriSlug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(altKategoriSlug)))
    )
}

// Helper: Get product by slug within a subcategory
export function getProductBySlug(dersSlug: string): Product | undefined {
    return allProducts.find(p => p.slug === dersSlug)
}

// Keep old compatibility helper
export function getProductsByKurum(kurumSlug: string): Product[] {
    return allProducts.filter(p => p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug)))
}
