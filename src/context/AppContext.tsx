'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { allProducts as initialProducts, allKurumlar as initialKurumlar, Product, Kurum } from '@/data/products'
import ConfirmModal from '@/components/ConfirmModal'
export type { Product, Kurum }

export interface AltKategori {
    id: string
    name: string
    slug: string
    description: string
    kurumSlugs: string[]
}

export interface AppSettings {
    siteTitle: string
    siteSubtitle: string
    phone: string
    email: string
    address: string
    whatsapp: string
    aboutText: string
    aboutVision: string
    aboutMission: string
    instagram?: string
    youtube?: string
    twitter?: string
    facebook?: string
}

export interface OrderItem {
    id: string
    productId: string
    name: string
    price: number
    quantity: number
}

export interface Order {
    id: string
    customerName: string
    customerEmail: string
    customerPhone: string
    items: OrderItem[]
    subTotal: number
    discount: number
    tax: number
    total: number
    status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
    createdAt: string
}

export interface Coupon {
    id: string
    code: string
    discountType: 'percentage' | 'fixed'
    discountValue: number
    maxUses?: number
    usedCount: number
    description: string
}

export interface FAQItem {
    id: string
    q: string
    a: string
}

export interface PageSection {
    id: string
    title: string
    content: string
    layout: 'card' | 'split-left' | 'split-right' | 'full-width'
    icon?: string // e.g. 'Award', 'Trophy', 'Users', 'RefreshCw'
    iconColor?: string // e.g. '#3b82f6'
    image?: string // base64 or path
    buttonText?: string
    buttonLink?: string
    buttonStyle?: 'primary' | 'secondary' | 'link'
}

export interface EditablePage {
    id: 'home' | 'about' | 'contact' | 'faq' | 'terms' | 'privacy' | 'shipping' | 'returns'
    title: string
    slug: string
    content?: string // For legal pages
    aboutText?: string // For about page
    aboutVision?: string
    aboutMission?: string
    phone?: string // For contact page
    email?: string
    address?: string
    whatsapp?: string
    faqs?: FAQItem[] // For FAQ page
    customSections?: PageSection[] // For custom sections
    // Homepage Dynamic properties
    showAnnouncement?: boolean
    announcementText?: string
    announcementLink?: string
    announcementBg?: string
    announcementType?: 'text' | 'image'
    announcementImage?: string
    slides?: { id: string; title: string; subtitle: string; cta: string; link: string; bgClass?: string; image?: string; icon: string; iconColor?: string }[]
    ctaPanels?: { title: string; subtitle: string; href: string; icon: string; bgGradient?: string }[]
    seoTitle?: string
    seoDescription?: string
    status: 'published' | 'draft'
    createdAt: string
}

export interface AppContextType {
    products: Product[]
    kurumlar: Kurum[]
    altKategoriler: AltKategori[]
    settings: AppSettings
    featuredIds: string[]
    orders: Order[]
    coupons: Coupon[]
    pages: EditablePage[]
    addProduct: (product: Product) => void
    updateProduct: (id: string, product: Partial<Product>) => void
    updateMultipleProducts: (updates: { id: string; fields: Partial<Product> }[]) => void
    deleteProduct: (id: string) => void
    addKurum: (kurum: Kurum) => void
    updateKurum: (id: string, kurum: Partial<Kurum>) => void
    deleteKurum: (id: string) => void
    addAltKategori: (cat: AltKategori) => void
    updateAltKategori: (id: string, cat: Partial<AltKategori>) => void
    deleteAltKategori: (id: string) => void
    triggerConfirm: (options: {
        title: string
        message: string
        confirmText?: string
        cancelText?: string
        isDangerous?: boolean
        onConfirm: () => void
    }) => void
    updateSettings: (settings: Partial<AppSettings>) => void
    toggleFeatured: (id: string) => void
    resetAllData: () => void
    addOrder: (order: Order) => void
    updateOrderStatus: (id: string, status: Order['status']) => void
    deleteOrder: (id: string) => void
    addCoupon: (coupon: Coupon) => void
    deleteCoupon: (id: string) => void
    useCoupon: (code: string) => void
    useProductCoupon: (productId: string, code: string) => void
    updatePage: (id: EditablePage['id'], fields: Partial<EditablePage>) => void
}

const defaultSettings: AppSettings = {
    siteTitle: "MEVZUAT ADAM - Görevde Yükselme ve Mevzuat Platformu",
    siteSubtitle: "Kurumsal eğitim çözümleri ve sınav hazırlık platformu",
    phone: "0507 773 63 47",
    email: "mevzuatadam@gmail.com",
    address: "Eğitim Vadisi Plaza, Kat: 5, No: 42, Çankaya, Ankara 06550",
    whatsapp: "905077736347",
    aboutText: "MEVZUAT ADAM, kamu personeli ve kariyer meslek adaylarına yönelik en kapsamlı ve güncel mevzuat bilgilerini, sınav hazırlık materyallerini ve profesyonel eğitim çözümlerini sunmaktadır. Görevde Yükselme, Unvan Değişikliği ve Kurum Sınavlarında (Maliye, Adalet Bakanlığı vb.) binlerce adayın başarıya ulaşmasında yanınızdayız. Uzman eğitmen kadromuz ve sürekli güncellenen dijital/basılı yayınlarımız ile hedeflerinize emin adımlarla ilerlemeniz için buradayız.",
    aboutVision: "Mevzuat ve GYS eğitimlerinde Türkiye'nin öncü, en yenilikçi ve adaylar tarafından en çok tavsiye edilen prestijli dijital akademi markası olmak.",
    aboutMission: "Adayların kamu kariyeri hedeflerine ulaşmalarını kolaylaştıracak en anlaşılır, en güncel ve en yüksek başarı oranlı ders materyallerini sunmak.",
    instagram: "https://instagram.com/mevzuatadam",
    youtube: "https://youtube.com/mevzuatadam",
    twitter: "https://x.com/mevzuatadam",
    facebook: ""
}

const defaultCoupons: Coupon[] = [
    { id: 'c1', code: 'BOMBASTIK20', discountType: 'percentage', discountValue: 20, maxUses: 100, usedCount: 15, description: 'Tüm sepetlerde %20 indirim' },
    { id: 'c2', code: 'INDIRIM10', discountType: 'percentage', discountValue: 10, maxUses: 200, usedCount: 45, description: 'Tüm sepetlerde %10 indirim' },
    { id: 'c3', code: 'MEVZUST500', discountType: 'fixed', discountValue: 500, maxUses: 50, usedCount: 8, description: 'Tüm sepetlerde 500 ₺ sabit indirim' }
]

const defaultPages: EditablePage[] = [
    {
        id: 'home',
        title: 'Ana Sayfa',
        slug: 'home',
        showAnnouncement: true,
        announcementText: '🔥 Adalet Bakanlığı GYS Kitap Setimiz Satışa Çıktı! Sınırlı Sayıda Stok İçin Hemen Tıklayın.',
        announcementLink: '/products',
        announcementBg: 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)',
        announcementType: 'text',
        announcementImage: '',
        slides: [
            {
                id: 'slide_1',
                title: 'MEVZUAT ADAM ile Zirveye',
                subtitle: 'Görevde Yükselme ve Unvan Değişikliği sınavlarında yanınızdayız.',
                cta: 'Eğitimleri İncele',
                link: '/products',
                icon: 'Rocket',
                iconColor: '#f97316'
            },
            {
                id: 'slide_2',
                title: 'Online Video Dersler',
                subtitle: 'Alanında uzman eğitmenlerden kapsamlı konu anlatımları ve soru çözümleri.',
                cta: 'Derslere Göz At',
                link: '/products?category=online',
                icon: 'BookOpen',
                iconColor: '#3b82f6'
            },
            {
                id: 'slide_3',
                title: 'Güncel Mevzuat Yayınları',
                subtitle: 'Değişen kanun ve yönetmeliklere uygun en güncel kaynaklar.',
                cta: 'Kitapları Gör',
                link: '/products?category=kitap',
                icon: 'Target',
                iconColor: '#10b981'
            }
        ],
        ctaPanels: [
            {
                title: 'Ders Paneli',
                subtitle: 'Video derslerinize erişin',
                href: 'https://derspaneli.mevzuatadam.com',
                icon: 'MonitorPlay',
                bgGradient: 'blue'
            },
            {
                title: 'Soru Bankası',
                subtitle: 'Binlerce soru ile pratik yapın',
                href: 'https://sorubankasi.mevzuatadam.com',
                icon: 'ClipboardList',
                bgGradient: 'purple'
            }
        ],
        customSections: [],
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'about',
        title: 'Hakkımızda',
        slug: 'about',
        aboutText: 'MEVZUAT ADAM, kamu personeli ve kariyer meslek adaylarına yönelik en kapsamlı ve güncel mevzuat bilgilerini, sınav hazırlık materyallerini ve profesyonel eğitim çözümlerini sunmaktadır. Görevde Yükselme, Unvan Değişikliği ve Kurum Sınavlarında (Maliye, Adalet Bakanlığı vb.) binlerce adayın başarıya ulaşmasında yanınızdayız.',
        aboutVision: 'Mevzuat ve GYS eğitimlerinde Türkiye\'nin öncü, en yenilikçi ve adaylar tarafından en çok tavsiye edilen prestijli dijital akademi markası olmak.',
        aboutMission: 'Adayların kamu kariyeri hedeflerine ulaşmalarını kolaylaştıracak en anlaşılır, en güncel ve en yüksek başarı oranlı ders materyallerini sunmak.',
        customSections: [
            {
                id: 'sect_1',
                title: 'Uzman Kamu Eğitmen Kadromuz',
                content: 'Derslerimizin tamamı, uzun yıllar kamu bakanlıklarında görev yapmış başmüfettişler, uzman şefler ve mevzuat denetçileri tarafından hazırlanmaktadır. Sınav müfredatlarına tam uygun nokta atışı anlatımlar sunuyoruz.',
                layout: 'split-left',
                icon: 'Award',
                iconColor: '#3b82f6',
                buttonText: 'Eğitimlerimizi İnceleyin',
                buttonLink: '/products',
                buttonStyle: 'primary'
            },
            {
                id: 'sect_2',
                title: 'Neden Biz? %98 Rekor Başarı Oranı',
                content: 'Geçtiğimiz dönem yapılan Bakanlık Görevde Yükselme Sınavlarında (GYS) ilk 100 aday içerisinden tam 42 aday Mevzuat Adam hazırlık paketleriyle başarıya ulaştı ve yeni kadrolarına atandı.',
                layout: 'card',
                icon: 'Trophy',
                iconColor: '#eab308'
            },
            {
                id: 'sect_3',
                title: 'Her Zaman %100 Güncel Mevzuat',
                content: 'Resmi Gazete\'de yayımlanan yasa ve yönetmelik değişikliklerini anlık olarak takip ediyor, video eğitimlerimizi ve test sorularımızı 24 saat içinde güncelliyerek adaylarımızı asla riske atmıyoruz.',
                layout: 'card',
                icon: 'RefreshCw',
                iconColor: '#10b981'
            }
        ],
        seoTitle: 'Hakkımızda | MEVZUAT ADAM',
        seoDescription: 'Kamu görevde yükselme sınavlarına hazırlıkta Türkiye\'nin lider platformu MEVZUAT ADAM hakkında bilgi alın.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'contact',
        title: 'İletişim',
        slug: 'contact',
        phone: '0507 773 63 47',
        email: 'mevzuatadam@gmail.com',
        address: 'Eğitim Vadisi Plaza, Kat: 5, No: 42, Çankaya, Ankara 06550',
        whatsapp: '905077736347',
        seoTitle: 'İletişim | MEVZUAT ADAM',
        seoDescription: 'MEVZUAT ADAM eğitim platformu iletişim numaraları, WhatsApp destek hattı ve Ankara ofis adresi.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'faq',
        title: 'Sıkça Sorulan Sorular',
        slug: 'faq',
        faqs: [
            { id: 'f1', q: 'Eğitim içerikleri müfredata uygun mu?', a: 'Evet, tüm içeriklerimiz güncel mevzuata %100 uygundur ve yasal değişiklikler anlık olarak yansıtılır.' },
            { id: 'f2', q: 'Video derslere nasıl ulaşabilirim?', a: 'Satın aldığınız derslere kayıt işlemlerinin ardından Ders Paneli üzerinden 7/24 kesintisiz erişim sağlayabilirsiniz.' },
            { id: 'f3', q: 'İade şansım var mı?', a: 'Evet, dijital eğitim paketlerimizi satın aldıktan sonra 14 gün içinde yasal koşullar çerçevesinde iade edebilirsiniz.' },
            { id: 'f4', q: 'Soru bankasına erişim ne kadar sürer?', a: 'Satın alma işlemi sonrası anında erişim sağlanır ve paketiniz 1 yıl (365 gün) boyunca aktif kalır.' }
        ],
        seoTitle: 'Sıkça Sorulan Sorular | MEVZUAT ADAM',
        seoDescription: 'Ders kayıtları, iade şartları, müfredat uyumluluğu ve ödeme seçenekleri hakkında merak ettikleriniz.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'terms',
        title: 'Kullanım Koşulları',
        slug: 'terms',
        content: '<h2>1. Kabul Edilen Şartlar</h2><p>Bu internet sitesine (www.mevzuatadam.com) erişerek ve hizmetlerimizi kullanarak, aşağıda belirtilen kullanım koşullarını, ilgili tüm yasa ve yönetmelikleri kabul etmiş sayılırsınız.</p><h2>2. Hizmet ve Lisans Şartları</h2><p>MEVZUAT ADAM platformu üzerinde sunulan tüm video eğitimler, soru bankaları, PDF dokümanları ve basılı materyaller telif hakları kanununa tabidir. Satın alınan üyelikler bireysel kullanım içindir, hesabın üçüncü şahıslarla paylaşılması yasal yaptırımlara tabidir.</p><h2>3. Kullanıcı Sorumlulukları</h2><p>Kullanıcılar sistem üzerindeki faaliyetlerinde ahlak ve adaba, yasalara uygun davranmayı taahhüt eder. Sistem güvenliğini tehlikeye atacak girişimlerde bulunamazlar.</p>',
        seoTitle: 'Kullanım Koşulları ve Üyelik Sözleşmesi | MEVZUAT ADAM',
        seoDescription: 'Platform kullanım şartları, video derslerin telif hakları ve kullanıcı üyelik yükümlülükleri hakkında yasal sözleşme.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'privacy',
        title: 'Gizlilik ve KVKK Politikası',
        slug: 'privacy',
        content: '<h2>1. Veri Sorumlusu</h2><p>6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kișisel verileriniz veri sorumlusu sıfatıyla MEVZUAT ADAM tarafından aşağıda açıklanan kapsamda ișlenebilecektir.</p><h2>2. Toplanan Veriler ve İşleme Amaçları</h2><p>Üyelik ișlemleriniz, satın almalarınız ve faturalandırma süreçleriniz kapsamında adınız, e-postanız, telefon numaranız ve fatura adresiniz toplanmaktadır. Bu veriler eğitim süreçlerinin yönetilmesi, fatura kesilmesi ve bilgi verilmesi amaçlarıyla sınırlı olarak ișlenmektedir.</p><h2>3. Verilerin Üçüncü Kişilerle Paylaşımı</h2><p>Kişisel verileriniz, yasal zorunluluklar haricinde hiçbir șekilde ticari amaçlarla üçüncü şahıslarla veya kurumlarla paylaşılmaz. Verileriniz en yüksek güvenlik standartlarına sahip sunucularda kriptolanmıș olarak saklanmaktadır.</p>',
        seoTitle: 'Gizlilik ve KVKK Politikası | MEVZUAT ADAM',
        seoDescription: 'Kişisel verilerinizin korunması kanunu (KVKK) kapsamında MEVZUAT ADAM veri saklama ve işleme politikası.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'shipping',
        title: 'Mesafeli Satış Sözleşmesi',
        slug: 'shipping',
        content: '<h2>1. Taraflar</h2><p>İşbu sözleşme, MEVZUAT ADAM (Satıcı) ile platform üzerinden dijital veya fiziksel sipariş oluşturan Tüketici (Alıcı) arasında mesafeli ortamda kurulmuştur.</p><h2>2. Sözleşmenin Konusu</h2><p>Alıcının, Satıcıya ait internet sitesinden elektronik ortamda siparişini verdiği nitelikleri ve satış fiyatı belirtilen ürünlerin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.</p><h2>3. Teslimat ve Dijital Erişim</h2><p>Dijital eğitim setleri ve online soru bankaları ödemenin başarıyla tamamlanmasının ardından Alıcının hesabına anında tanımlanır. Fiziksel kitap setleri ise 3 iș günü içerisinde kargo firmasına teslim edilir.</p>',
        seoTitle: 'Mesafeli Satış Sözleşmesi | MEVZUAT ADAM',
        seoDescription: 'Online alışveriş ve e-ticaret süreçleri için yasal mesafeli satış sözleşmesi şartları.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    },
    {
        id: 'returns',
        title: 'İade ve İptal Koşulları',
        slug: 'returns',
        content: '<h2>1. Cayma Hakkı</h2><p>Alıcı, fiziksel ürünlerde (kitap, basılı doküman vb.) teslim tarihinden itibaren 14 (ondört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin sözleşmeden cayma hakkına sahiptir. Ürünün ambalajının açılmamış ve kullanılmamış olması şarttır.</p><h2>2. Dijital Ürünlerde İade Koşulları</h2><p>Online video dersler, soru bankaları ve anında erișilen PDF\'ler niteliği itibariyle elektronik ortamda anında ifa edilen gayri maddi mallar kapsamında olduğundan, üyelik hesabı aktive edilip içeriklere erișim sağlandıktan sonra cayma hakkı kapsamında iade edilemez. Aktivasyon öncesi taleplerde ise tam ücret iadesi yapılır.</p><h2>3. İade Süreci</h2><p>Onaylanan iade taleplerinde ücret, alıcının ödeme yaptığı kredi kartına veya banka hesabına 7 iș günü içerisinde aynen iade edilir.</p>',
        seoTitle: 'İade, İptal ve Cayma Hakkı Koşulları | MEVZUAT ADAM',
        seoDescription: 'Online eğitimler ve kitap setleri için geçerli yasal iade ve cayma hakkı kuralları.',
        status: 'published',
        createdAt: '2026-05-23T00:00:00.000Z'
    }
]

const AppContext = createContext<AppContextType | undefined>(undefined)

const sortProducts = (list: Product[]) => {
    return [...list].sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 9999
        const orderB = b.order !== undefined ? b.order : 9999
        if (orderA !== orderB) return orderA - orderB
        return a.name.localeCompare(b.name, 'tr')
    })
}

const resequenceProducts = (list: Product[], targetId?: string, newOrder?: number): Product[] => {
    if (!targetId || newOrder === undefined) {
        return [...list]
            .sort((a, b) => {
                const orderA = a.order !== undefined ? a.order : 9999
                const orderB = b.order !== undefined ? b.order : 9999
                if (orderA !== orderB) return orderA - orderB
                return a.name.localeCompare(b.name, 'tr')
            })
            .map((p, idx) => ({ ...p, order: idx + 1 }))
    }

    const targetProduct = list.find(p => p.id === targetId)
    if (!targetProduct) {
        return resequenceProducts(list)
    }

    const restProducts = list
        .filter(p => p.id !== targetId)
        .sort((a, b) => {
            const orderA = a.order !== undefined ? a.order : 9999
            const orderB = b.order !== undefined ? b.order : 9999
            if (orderA !== orderB) return orderA - orderB
            return a.name.localeCompare(b.name, 'tr')
        })

    const insertIndex = Math.max(0, Math.min(restProducts.length, newOrder - 1))
    const updatedList = [...restProducts]
    updatedList.splice(insertIndex, 0, { ...targetProduct, order: newOrder })

    return updatedList.map((p, idx) => ({ ...p, order: idx + 1 }))
}

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [products, setProducts] = useState<Product[]>([])
    const [kurumlar, setKurumlar] = useState<Kurum[]>([])
    const [altKategoriler, setAltKategoriler] = useState<AltKategori[]>([])
    const [settings, setSettings] = useState<AppSettings>(defaultSettings)
    const [featuredIds, setFeaturedIds] = useState<string[]>([])
    const [orders, setOrders] = useState<Order[]>([])
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [pages, setPages] = useState<EditablePage[]>([]);
    const [initialized, setInitialized] = useState(false)

    const [confirmState, setConfirmState] = useState<{
        isOpen: boolean
        title: string
        message: string
        confirmText?: string
        cancelText?: string
        isDangerous?: boolean
        onConfirm: () => void
    }>({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    })

    const triggerConfirm = (options: {
        title: string
        message: string
        confirmText?: string
        cancelText?: string
        isDangerous?: boolean
        onConfirm: () => void
    }) => {
        setConfirmState({
            isOpen: true,
            title: options.title,
            message: options.message,
            confirmText: options.confirmText,
            cancelText: options.cancelText,
            isDangerous: options.isDangerous,
            onConfirm: options.onConfirm
        })
    }

    const saveState = async (key: string, value: any) => {
        try {
            if (typeof window !== 'undefined') {
                localStorage.setItem(key, JSON.stringify(value))
                await fetch('/api/store', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key, value })
                })
            }
        } catch (e: any) {
            console.error(`Error saving ${key} to central database:`, e)
        }
    }

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // 1. Immediately load local values for ultra-fast startup (Offline First / Snappy UX)
            const loadLocalData = () => {
                const savedProducts = localStorage.getItem('app_products')
                let loadedProducts = initialProducts
                if (savedProducts) {
                    try { loadedProducts = JSON.parse(savedProducts) } catch (e) {}
                }
                const healedProducts = loadedProducts.map((p, idx) => ({
                    ...p,
                    order: p.order !== undefined ? p.order : (idx + 1)
                }))
                const sortedAndResequenced = resequenceProducts(healedProducts)
                setProducts(sortedAndResequenced)

                const savedKurumlar = localStorage.getItem('app_kurumlar')
                let loadedKurumlar = initialKurumlar
                if (savedKurumlar) {
                    try { loadedKurumlar = JSON.parse(savedKurumlar) } catch (e) {}
                }
                setKurumlar(loadedKurumlar)

                const savedSettings = localStorage.getItem('app_settings')
                let loadedSettings = defaultSettings
                if (savedSettings) {
                    try { loadedSettings = JSON.parse(savedSettings) } catch (e) {}
                }
                setSettings(loadedSettings)

                const savedFeatured = localStorage.getItem('featured_product_ids')
                let loadedFeatured = initialProducts.filter(p => p.isFeatured).map(p => p.id)
                if (savedFeatured) {
                    try { loadedFeatured = JSON.parse(savedFeatured) } catch (e) {}
                }
                setFeaturedIds(loadedFeatured)

                const savedOrders = localStorage.getItem('app_orders')
                let loadedOrders: Order[] = []
                if (savedOrders) {
                    try { loadedOrders = JSON.parse(savedOrders) } catch (e) {}
                }
                setOrders(loadedOrders)

                const savedCoupons = localStorage.getItem('app_coupons')
                let loadedCoupons = defaultCoupons
                if (savedCoupons) {
                    try { loadedCoupons = JSON.parse(savedCoupons) } catch (e) {}
                }
                setCoupons(loadedCoupons)

                const savedPages = localStorage.getItem('app_pages')
                let loadedPages = defaultPages
                if (savedPages) {
                    try { loadedPages = JSON.parse(savedPages) } catch (e) {}
                }
                setPages(loadedPages)

                const savedAltKategoriler = localStorage.getItem('app_alt_kategoriler')
                let loadedAltKategoriler: AltKategori[] = []
                if (savedAltKategoriler) {
                    try { loadedAltKategoriler = JSON.parse(savedAltKategoriler) } catch (e) {}
                }
                setAltKategoriler(loadedAltKategoriler)
            }

            loadLocalData()

            // 2. Fetch fresh database values from central SQLite DB
            const fetchFromDb = async () => {
                try {
                    const response = await fetch('/api/store')
                    const result = await response.json()
                    if (result.success && result.data) {
                        const dbData = result.data

                        // Products
                        if (dbData.app_products) {
                            const sorted = resequenceProducts(dbData.app_products)
                            setProducts(sorted)
                            localStorage.setItem('app_products', JSON.stringify(sorted))
                        } else {
                            const localProducts = localStorage.getItem('app_products')
                            if (localProducts) {
                                try {
                                    const parsed = JSON.parse(localProducts)
                                    saveState('app_products', parsed)
                                    setProducts(parsed)
                                } catch (e) {
                                    saveState('app_products', resequenceProducts(initialProducts))
                                }
                            } else {
                                saveState('app_products', resequenceProducts(initialProducts))
                            }
                        }

                        // Institutions
                        if (dbData.app_kurumlar) {
                            setKurumlar(dbData.app_kurumlar)
                            localStorage.setItem('app_kurumlar', JSON.stringify(dbData.app_kurumlar))
                        } else {
                            const localKurumlar = localStorage.getItem('app_kurumlar')
                            if (localKurumlar) {
                                try {
                                    const parsed = JSON.parse(localKurumlar)
                                    saveState('app_kurumlar', parsed)
                                    setKurumlar(parsed)
                                } catch (e) {
                                    saveState('app_kurumlar', initialKurumlar)
                                }
                            } else {
                                saveState('app_kurumlar', initialKurumlar)
                            }
                        }

                        // Settings
                        if (dbData.app_settings) {
                            setSettings(dbData.app_settings)
                            localStorage.setItem('app_settings', JSON.stringify(dbData.app_settings))
                        } else {
                            const localSettings = localStorage.getItem('app_settings')
                            if (localSettings) {
                                try {
                                    const parsed = JSON.parse(localSettings)
                                    saveState('app_settings', parsed)
                                    setSettings(parsed)
                                } catch (e) {
                                    saveState('app_settings', defaultSettings)
                                }
                            } else {
                                saveState('app_settings', defaultSettings)
                            }
                        }

                        // Featured Ids
                        if (dbData.featured_product_ids) {
                            setFeaturedIds(dbData.featured_product_ids)
                            localStorage.setItem('featured_product_ids', JSON.stringify(dbData.featured_product_ids))
                        } else {
                            const localFeatured = localStorage.getItem('featured_product_ids')
                            if (localFeatured) {
                                try {
                                    const parsed = JSON.parse(localFeatured)
                                    saveState('featured_product_ids', parsed)
                                    setFeaturedIds(parsed)
                                } catch (e) {
                                    const initialFeatured = initialProducts.filter(p => p.isFeatured).map(p => p.id)
                                    saveState('featured_product_ids', initialFeatured)
                                }
                            } else {
                                const initialFeatured = initialProducts.filter(p => p.isFeatured).map(p => p.id)
                                saveState('featured_product_ids', initialFeatured)
                            }
                        }

                        // Orders
                        if (dbData.app_orders) {
                            setOrders(dbData.app_orders)
                            localStorage.setItem('app_orders', JSON.stringify(dbData.app_orders))
                        } else {
                            const localOrders = localStorage.getItem('app_orders')
                            if (localOrders) {
                                try {
                                    const parsed = JSON.parse(localOrders)
                                    saveState('app_orders', parsed)
                                    setOrders(parsed)
                                } catch (e) {
                                    saveState('app_orders', [])
                                }
                            } else {
                                saveState('app_orders', [])
                            }
                        }

                        // Coupons
                        if (dbData.app_coupons) {
                            setCoupons(dbData.app_coupons)
                            localStorage.setItem('app_coupons', JSON.stringify(dbData.app_coupons))
                        } else {
                            const localCoupons = localStorage.getItem('app_coupons')
                            if (localCoupons) {
                                try {
                                    const parsed = JSON.parse(localCoupons)
                                    saveState('app_coupons', parsed)
                                    setCoupons(parsed)
                                } catch (e) {
                                    saveState('app_coupons', defaultCoupons)
                                }
                            } else {
                                saveState('app_coupons', defaultCoupons)
                            }
                        }

                        // Pages
                        if (dbData.app_pages) {
                            setPages(dbData.app_pages)
                            localStorage.setItem('app_pages', JSON.stringify(dbData.app_pages))
                        } else {
                            const localPages = localStorage.getItem('app_pages')
                            if (localPages) {
                                try {
                                    const parsed = JSON.parse(localPages)
                                    saveState('app_pages', parsed)
                                    setPages(parsed)
                                } catch (e) {
                                    saveState('app_pages', defaultPages)
                                }
                            } else {
                                saveState('app_pages', defaultPages)
                            }
                        }

                        // Subcategories
                        if (dbData.app_alt_kategoriler) {
                            setAltKategoriler(dbData.app_alt_kategoriler)
                            localStorage.setItem('app_alt_kategoriler', JSON.stringify(dbData.app_alt_kategoriler))
                        } else {
                            const localAltKategoriler = localStorage.getItem('app_alt_kategoriler')
                            if (localAltKategoriler) {
                                try {
                                    const parsed = JSON.parse(localAltKategoriler)
                                    saveState('app_alt_kategoriler', parsed)
                                    setAltKategoriler(parsed)
                                } catch (e) {
                                    // Fallback to auto-heal
                                    const map = new Map<string, AltKategori>()
                                    const pList = dbData.app_products || initialProducts
                                    pList.forEach((p: any) => {
                                        const pKurumSlugs = p.kurumSlugs || [p.kurumSlug].filter(Boolean)
                                        if (p.altKategoriSlugs && p.altKategoriNames) {
                                            p.altKategoriSlugs.forEach((slug: string, idx: number) => {
                                                const name = p.altKategoriNames?.[idx] || p.altKategoriName
                                                const existing = map.get(slug)
                                                if (existing) {
                                                    pKurumSlugs.forEach((ks: string) => {
                                                        if (!existing.kurumSlugs.includes(ks)) {
                                                            existing.kurumSlugs.push(ks)
                                                        }
                                                    })
                                                } else {
                                                    map.set(slug, {
                                                        id: 'altcat_' + Math.random().toString(36).substr(2, 9),
                                                        name,
                                                        slug,
                                                        description: `${name} sınav hazırlık dersleri.`,
                                                        kurumSlugs: [...pKurumSlugs]
                                                    })
                                                }
                                            })
                                        } else if (p.altKategoriSlug && p.altKategoriName) {
                                            const slug = p.altKategoriSlug
                                            const existing = map.get(slug)
                                            if (existing) {
                                                pKurumSlugs.forEach((ks: string) => {
                                                    if (!existing.kurumSlugs.includes(ks)) {
                                                        existing.kurumSlugs.push(ks)
                                                    }
                                                })
                                            } else {
                                                map.set(slug, {
                                                    id: 'altcat_' + Math.random().toString(36).substr(2, 9),
                                                    name: p.altKategoriName,
                                                    slug,
                                                    description: `${p.altKategoriName} sınav hazırlık dersleri.`,
                                                    kurumSlugs: [...pKurumSlugs]
                                                })
                                            }
                                        }
                                    })
                                    const healedAltCat = Array.from(map.values())
                                    setAltKategoriler(healedAltCat)
                                    saveState('app_alt_kategoriler', healedAltCat)
                                }
                            } else {
                                // Fallback to auto-heal
                                const map = new Map<string, AltKategori>()
                                const pList = dbData.app_products || initialProducts
                                pList.forEach((p: any) => {
                                    const pKurumSlugs = p.kurumSlugs || [p.kurumSlug].filter(Boolean)
                                    if (p.altKategoriSlugs && p.altKategoriNames) {
                                        p.altKategoriSlugs.forEach((slug: string, idx: number) => {
                                            const name = p.altKategoriNames?.[idx] || p.altKategoriName
                                            const existing = map.get(slug)
                                            if (existing) {
                                                pKurumSlugs.forEach((ks: string) => {
                                                    if (!existing.kurumSlugs.includes(ks)) {
                                                        existing.kurumSlugs.push(ks)
                                                    }
                                                })
                                            } else {
                                                map.set(slug, {
                                                    id: 'altcat_' + Math.random().toString(36).substr(2, 9),
                                                    name,
                                                    slug,
                                                    description: `${name} sınav hazırlık dersleri.`,
                                                    kurumSlugs: [...pKurumSlugs]
                                                })
                                            }
                                        })
                                    } else if (p.altKategoriSlug && p.altKategoriName) {
                                        const slug = p.altKategoriSlug
                                        const existing = map.get(slug)
                                        if (existing) {
                                            pKurumSlugs.forEach((ks: string) => {
                                                if (!existing.kurumSlugs.includes(ks)) {
                                                    existing.kurumSlugs.push(ks)
                                                }
                                            })
                                        } else {
                                            map.set(slug, {
                                                id: 'altcat_' + Math.random().toString(36).substr(2, 9),
                                                name: p.altKategoriName,
                                                slug,
                                                description: `${p.altKategoriName} sınav hazırlık dersleri.`,
                                                kurumSlugs: [...pKurumSlugs]
                                            })
                                        }
                                    }
                                })
                                const healedAltCat = Array.from(map.values())
                                setAltKategoriler(healedAltCat)
                                saveState('app_alt_kategoriler', healedAltCat)
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching fresh data from central database:', error)
                } finally {
                    setInitialized(true)
                }
            }

            fetchFromDb()
        }
    }, [])

    const safeSaveProducts = (updatedList: Product[]) => {
        try {
            saveState('app_products', updatedList)
        } catch (e: any) {
            if (e.name === 'QuotaExceededError' || e.code === 22 || e.message?.includes('quota')) {
                alert('⚠️ Tarayıcı Depolama Limiti Aşıldı!\n\nYüklediğiniz resimlerin boyutu çok büyük olduğu için tarayıcının depolama sınırı aşıldı. Resim sıkıştırma devrededir ancak tarayıcınızın hafızası dolu kalmış olabilir. Lütfen daha küçük boyutlu resimler yüklemeyi deneyin ya da "Verileri Sıfırla" butonuyla hafızayı temizleyin.')
            } else {
                console.error('LocalStorage write error:', e)
            }
        }
    }

    const addProduct = (product: Product) => {
        const orderVal = product.order !== undefined ? product.order : products.length + 1
        const updated = resequenceProducts([...products, product], product.id, orderVal)
        setProducts(updated)
        safeSaveProducts(updated)
    }

    const updateProduct = (id: string, updatedFields: Partial<Product>) => {
        const target = products.find(p => p.id === id)
        if (!target) return

        const oldOrder = target.order
        const newOrder = updatedFields.order !== undefined ? updatedFields.order : oldOrder

        const mergedList = products.map(p => p.id === id ? { ...p, ...updatedFields } : p)
        
        let updated: Product[]
        if (newOrder !== undefined && newOrder !== oldOrder) {
            updated = resequenceProducts(mergedList, id, newOrder)
        } else {
            updated = resequenceProducts(mergedList)
        }

        setProducts(updated)
        safeSaveProducts(updated)
    }

    const updateMultipleProducts = (updates: { id: string; fields: Partial<Product> }[]) => {
        let updatedList = [...products]
        updates.forEach(u => {
            updatedList = updatedList.map(p => p.id === u.id ? { ...p, ...u.fields } : p)
        })
        const updated = resequenceProducts(updatedList)
        setProducts(updated)
        safeSaveProducts(updated)
    }

    const deleteProduct = (id: string) => {
        const remaining = products.filter(p => p.id !== id)
        const updated = resequenceProducts(remaining)
        setProducts(updated)
        safeSaveProducts(updated)
        
        // Also remove from featured if it was there
        if (featuredIds.includes(id)) {
            const updatedFeatured = featuredIds.filter(fId => fId !== id)
            setFeaturedIds(updatedFeatured)
            saveState('featured_product_ids', updatedFeatured)
        }
    }

    const addKurum = (kurum: Kurum) => {
        const updated = [...kurumlar, kurum]
        setKurumlar(updated)
        saveState('app_kurumlar', updated)
    }

    const updateKurum = (id: string, updatedFields: Partial<Kurum>) => {
        const updated = kurumlar.map(k => k.id === id ? { ...k, ...updatedFields } : k)
        setKurumlar(updated)
        saveState('app_kurumlar', updated)
    }

    const deleteKurum = (id: string) => {
        const targetKurum = kurumlar.find(k => k.id === id)
        if (!targetKurum) return
        
        const updated = kurumlar.filter(k => k.id !== id)
        setKurumlar(updated)
        saveState('app_kurumlar', updated)

        // Also delete all products associated with this institution to maintain integrity
        const updatedProducts = products.filter(p => p.kurumSlug !== targetKurum.slug)
        setProducts(updatedProducts)
        saveState('app_products', updatedProducts)
    }

    const addAltKategori = (cat: AltKategori) => {
        const updated = [...altKategoriler, cat]
        setAltKategoriler(updated)
        saveState('app_alt_kategoriler', updated)
    }

    const updateAltKategori = (id: string, updatedFields: Partial<AltKategori>) => {
        const target = altKategoriler.find(c => c.id === id)
        if (!target) return

        const oldSlug = target.slug
        const newSlug = updatedFields.slug || target.slug
        const newName = updatedFields.name || target.name

        // Update altKategoriler list
        const updated = altKategoriler.map(c => c.id === id ? { ...c, ...updatedFields } : c)
        setAltKategoriler(updated)
        saveState('app_alt_kategoriler', updated)

        // Referential Integrity: Toplu güncelleme across all products in Next.js state!
        const updatedProducts = products.map(p => {
            let changed = false
            let updatedSlugs = p.altKategoriSlugs ? [...p.altKategoriSlugs] : [p.altKategoriSlug].filter(Boolean)
            let updatedNames = p.altKategoriNames ? [...p.altKategoriNames] : [p.altKategoriName].filter(Boolean)
            
            // Check and update lists
            const slugIndex = updatedSlugs.indexOf(oldSlug)
            if (slugIndex > -1) {
                updatedSlugs[slugIndex] = newSlug
                updatedNames[slugIndex] = newName
                changed = true
            }
            
            // Check and update single values if they match
            let pSlug = p.altKategoriSlug
            let pName = p.altKategoriName
            if (p.altKategoriSlug === oldSlug) {
                pSlug = newSlug
                pName = newName
                changed = true
            }
            
            if (changed) {
                return {
                    ...p,
                    altKategoriSlug: pSlug,
                    altKategoriName: pName,
                    altKategoriSlugs: updatedSlugs,
                    altKategoriNames: updatedNames
                }
            }
            return p
        })

        setProducts(updatedProducts)
        saveState('app_products', updatedProducts)
    }

    const deleteAltKategori = (id: string) => {
        const target = altKategoriler.find(c => c.id === id)
        if (!target) return

        const targetSlug = target.slug

        const updated = altKategoriler.filter(c => c.id !== id)
        setAltKategoriler(updated)
        saveState('app_alt_kategoriler', updated)

        // Referential Integrity: Safely remove or unlink from products
        const updatedProducts = products.map(p => {
            let changed = false
            let updatedSlugs = p.altKategoriSlugs ? [...p.altKategoriSlugs] : [p.altKategoriSlug].filter(Boolean)
            let updatedNames = p.altKategoriNames ? [...p.altKategoriNames] : [p.altKategoriName].filter(Boolean)

            const slugIndex = updatedSlugs.indexOf(targetSlug)
            if (slugIndex > -1) {
                updatedSlugs.splice(slugIndex, 1)
                updatedNames.splice(slugIndex, 1)
                changed = true
            }

            let pSlug = p.altKategoriSlug
            let pName = p.altKategoriName
            if (p.altKategoriSlug === targetSlug) {
                pSlug = updatedSlugs[0] || ''
                pName = updatedNames[0] || ''
                changed = true
            }

            if (changed) {
                return {
                    ...p,
                    altKategoriSlug: pSlug,
                    altKategoriName: pName,
                    altKategoriSlugs: updatedSlugs,
                    altKategoriNames: updatedNames
                }
            }
            return p
        })

        setProducts(updatedProducts)
        saveState('app_products', updatedProducts)
    }

    const updateSettings = (updatedFields: Partial<AppSettings>) => {
        const updated = { ...settings, ...updatedFields }
        setSettings(updated)
        saveState('app_settings', updated)
    }

    const toggleFeatured = (id: string) => {
        let updated: string[]
        if (featuredIds.includes(id)) {
            updated = featuredIds.filter(fId => fId !== id)
        } else {
            updated = [...featuredIds, id]
        }
        setFeaturedIds(updated)
        saveState('featured_product_ids', updated)
    }

    const resetAllData = async () => {
        localStorage.removeItem('app_products')
        localStorage.removeItem('app_kurumlar')
        localStorage.removeItem('app_alt_kategoriler')
        localStorage.removeItem('app_settings')
        localStorage.removeItem('featured_product_ids')
        localStorage.removeItem('app_orders')
        localStorage.removeItem('app_coupons')
        localStorage.removeItem('app_pages')
        
        setProducts(initialProducts)
        setKurumlar(initialKurumlar)
        setAltKategoriler([])
        setSettings(defaultSettings)
        setFeaturedIds(initialProducts.filter(p => p.isFeatured).map(p => p.id))
        setOrders([])
        setCoupons(defaultCoupons)
        setPages(defaultPages)

        await saveState('app_products', resequenceProducts(initialProducts))
        await saveState('app_kurumlar', initialKurumlar)
        await saveState('app_alt_kategoriler', [])
        await saveState('app_settings', defaultSettings)
        await saveState('featured_product_ids', initialProducts.filter(p => p.isFeatured).map(p => p.id))
        await saveState('app_orders', [])
        await saveState('app_coupons', defaultCoupons)
        await saveState('app_pages', defaultPages)
    }

    const addOrder = (order: Order) => {
        const updated = [order, ...orders]
        setOrders(updated)
        saveState('app_orders', updated)
    }

    const updateOrderStatus = (id: string, status: Order['status']) => {
        const updated = orders.map(o => o.id === id ? { ...o, status } : o)
        setOrders(updated)
        saveState('app_orders', updated)
    }

    const deleteOrder = (id: string) => {
        const updated = orders.filter(o => o.id !== id)
        setOrders(updated)
        saveState('app_orders', updated)
    }

    const addCoupon = (coupon: Coupon) => {
        const updated = [...coupons, coupon]
        setCoupons(updated)
        saveState('app_coupons', updated)
    }

    const deleteCoupon = (id: string) => {
        const updated = coupons.filter(c => c.id !== id)
        setCoupons(updated)
        saveState('app_coupons', updated)
    }

    const useCoupon = (code: string) => {
        const updated = coupons.map(c => c.code.toUpperCase() === code.toUpperCase() ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c)
        setCoupons(updated)
        saveState('app_coupons', updated)
    }

    const useProductCoupon = (productId: string, code: string) => {
        const updated = products.map(p => {
            if (p.id === productId && p.exclusiveCouponsList) {
                const updatedList = p.exclusiveCouponsList.map(c => 
                    c.code.toUpperCase() === code.toUpperCase() ? { ...c, usedCount: (c.usedCount || 0) + 1 } : c
                )
                return { ...p, exclusiveCouponsList: updatedList }
            }
            return p
        })
        setProducts(updated)
        saveState('app_products', updated)
    }

    const updatePage = (id: EditablePage['id'], fields: Partial<EditablePage>) => {
        const updated = pages.map(p => p.id === id ? { ...p, ...fields } : p)
        setPages(updated)
        try {
            saveState('app_pages', updated)
        } catch (e) {
            console.error("LocalStorage save failed due to quota limit:", e)
            alert("Hata: Görsel boyutu tarayıcı hafıza limitini (5MB) aştı! Lütfen slayt arka planına daha düşük boyutlu veya optimize edilmiş bir resim yükleyin.")
        }
    }

    return (
        <AppContext.Provider value={{
            products,
            kurumlar,
            altKategoriler,
            settings,
            featuredIds,
            orders,
            coupons,
            pages,
            addProduct,
            updateProduct,
            updateMultipleProducts,
            deleteProduct,
            addKurum,
            updateKurum,
            deleteKurum,
            addAltKategori,
            updateAltKategori,
            deleteAltKategori,
            updateSettings,
            toggleFeatured,
            resetAllData,
            addOrder,
            updateOrderStatus,
            deleteOrder,
            addCoupon,
            deleteCoupon,
            useCoupon,
            useProductCoupon,
            updatePage,
            triggerConfirm
        }}>
            {initialized ? (
                <>
                    {children}
                    <ConfirmModal 
                        isOpen={confirmState.isOpen}
                        title={confirmState.title}
                        message={confirmState.message}
                        confirmText={confirmState.confirmText}
                        cancelText={confirmState.cancelText}
                        isDangerous={confirmState.isDangerous}
                        onConfirm={confirmState.onConfirm}
                        onClose={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
                    />
                </>
            ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', fontFamily: 'Inter, sans-serif', color: '#0F172A', background: '#F8FAFC' }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '40px', height: '40px', border: '4px solid #CBD5E1', borderTopColor: '#0F172A', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 16px' }} />
                        <h3>Yükleniyor...</h3>
                    </div>
                    <style>{`
                        @keyframes spin {
                            to { transform: rotate(360deg); }
                        }
                    `}</style>
                </div>
            )}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
