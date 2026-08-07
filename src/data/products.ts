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

export const allKurumlar: Kurum[] = []

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
    images?: string[]
    exclusiveCoupons?: string
    exclusiveCouponsList?: ProductCoupon[]
    order?: number
    categoryOrders?: Record<string, number>
    features?: string[]
    whyUs?: { title: string; description: string }[]
    badges?: string[]
    status?: 'active' | 'passive'
    showOnHomepage?: boolean
    instructorName?: string
    totalDuration?: string
}

export const allProducts: Product[] = []

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
