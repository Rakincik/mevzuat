// ==========================================
// Kurum (Üst Küme - Level 1)
// ==========================================


 const allKurumlar = [
    {
        id: 'k1',
        name: 'Hazine ve Maliye Bakanlığı',
        slug: 'hazine-maliye-bakanligi',
        description: 'Görevde Yükselme, V.H.K.İ ve Şef kadroları için kapsamlı eğitim setleri.',
        icon: 'Landmark',
        color: '#2563EB',
        productCount
    },
    {
        id: 'k2',
        name: 'Adalet Bakanlığı',
        slug: 'adalet-bakanligi',
        description: 'Zabıt Kâtibi, İcra Müdürlüğü ve Yazı İşleri Müdürlüğü sınav hazırlıkları.',
        icon: 'Scale',
        color: '#7c3aed',
        productCount
    },
    {
        id: 'k3',
        name: 'İçişleri Bakanlığı',
        slug: 'icisleri-bakanligi',
        description: 'Nüfus ve Vatandaşlık İşleri, İl Müdürlükleri GYS hazırlıkları.',
        icon: 'Shield',
        color: '#0d9488',
        productCount
    },
    {
        id: 'k4',
        name: 'Sağlık Bakanlığı',
        slug: 'saglik-bakanligi',
        description: 'Sağlık personeli görevde yükselme ve unvan değişikliği sınav hazırlıkları.',
        icon: 'HeartPulse',
        color: '#dc2626',
        productCount
    },
    {
        id: 'k5',
        name: 'Milli Eğitim Bakanlığı',
        slug: 'milli-egitim-bakanligi',
        description: 'Şube Müdürü, Şef ve diğer kadrolar için görevde yükselme eğitimleri.',
        icon: 'GraduationCap',
        color: '#d97706',
        productCount
    },
    {
        id: 'k6',
        name: 'Genel GYS / Ortak Mevzuat',
        slug: 'genel-gys',
        description: 'Tüm kurumlarda geçerli ortak mevzuat dersleri, İdare Hukuku, 657 vb.',
        icon: 'Briefcase',
        color: '#475569',
        productCount
    }
]



// ==========================================
// AltKategori (Orta Küme - Level 2)
// ==========================================


// ==========================================
// Product / Ders (Alt Küme - Level 3)
// ==========================================




 const allProducts = [
    // ==========================================
    // Hazine ve Maliye Bakanlığı (8 Ürün)
    // ==========================================
    {
        id: '1',
        name: '4688 Sayılı Kamu Görevlileri Sendikaları ve Toplu Sözleşme Kanunu',
        slug: '4688-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmenürkan Sancak',
        price,
        salePrice,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Online Eğitim',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'mevzuat-dersleri',
        altKategoriName: 'Mevzuat Konu Anlatımı',
        isFeatured
    },
    {
        id: '2',
        name: '2886 Sayılı Devlet İhale Kanunu',
        slug: '2886-sayili-kanun',
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmenürkan Sancak',
        price,
        salePrice,
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
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmenürkan Sancak',
        price,
        salePrice,
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
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmenürkan Sancak',
        price,
        salePrice,
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
        price,
        salePrice,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'hazine-maliye-bakanligi',
        altKategoriSlug: 'vhki-sinavi',
        altKategoriName: 'V.H.K.İ. Sınav Hazırlığı',
        isFeatured
    },
    {
        id: '6',
        name: '3628 Sayılı Mal Bildiriminde Bulunulması Kanunu',
        slug: '3628-sayili-kanun',
        description: 'Rüşvet ve Yolsuzluklarla Mücadele Kanunu - Konu Anlatımı',
        price,
        salePrice,
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
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmenürkan Sancak',
        price,
        salePrice,
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
        description: 'Konu Anlatımı ve Çıkmış Soru Analizi - Eğitmenürkan Sancak',
        price,
        salePrice,
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
        price,
        salePrice,
        image: '/images/premium-mevzuat-cover.png',
        categoryName: 'Kurum Sınavı',
        kurumSlug: 'adalet-bakanligi',
        altKategoriSlug: 'zabit-katipligi',
        altKategoriName: 'Zabıt Kâtipliği Sınavı',
        isFeatured
    },
    {
        id: '10',
        name: 'İcra ve İflas Hukuku',
        slug: 'icra-iflas-hukuku',
        description: 'İcra Müdürlüğü sınavı için kapsamlı konu anlatımı ve soru çözümleri.',
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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
        price,
        salePrice,
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

// Helper unique AltKategoriler for a Ministry


// Helper products by subcategory


// Helper product by slug within a subcategory


// Keep old compatibility helper


console.log(JSON.stringify({ allKurumlar, allProducts }, null, 2));
