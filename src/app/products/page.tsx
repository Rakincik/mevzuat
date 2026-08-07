'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Search, 
    SlidersHorizontal, 
    X, 
    RefreshCw, 
    ChevronDown, 
    BookOpen, 
    Filter, 
    Building2, 
    Tag, 
    ArrowUpDown,
    Check,
    Sparkles,
    Clock,
    Flame,
    ArrowDownAZ,
    ArrowUpZA,
    Percent,
    TrendingUp
} from 'lucide-react'
import KurumCard from '@/components/KurumCard'
import ProductCard from '@/components/ProductCard'
import { useApp } from '@/context/AppContext'
import styles from './page.module.css'

export default function ProductsPage() {
    return (
        <Suspense fallback={
            <div className="container section" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <div className={styles.loadingSpinner}>
                    <RefreshCw className={styles.spinIcon} size={32} />
                    <span>Müfredat Yükleniyor...</span>
                </div>
            </div>
        }>
            <ProductsPageContent />
        </Suspense>
    )
}

function ProductsPageContent() {
    const { products: allProducts, kurumlar: allKurumlar, altKategoriler } = useApp()
    const searchParams = useSearchParams()

    const categoryParam = searchParams.get('category')
    const kurumParam = searchParams.get('kurum')

    // View mode: 'kurumlar' (classic bento seals) or 'egitimler' (e-commerce catalog)
    const [viewMode, setViewMode] = useState<'kurumlar' | 'egitimler'>('kurumlar')

    // Filter states
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedKurumlar, setSelectedKurumlar] = useState<string[]>([])
    const [selectedAltKategoriler, setSelectedAltKategoriler] = useState<string[]>([])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
    const [sortBy, setSortBy] = useState('önerilen')
    const [isSortOpen, setIsSortOpen] = useState(false)
    
    // UI control states
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

    // Dynamically retrieve unique categories from allProducts
    const uniqueCategories = Array.from(new Set(allProducts.map(p => p.categoryName)))
    
    // Dynamically filter altKategoriler based on selected Kurumlar (if any are selected)
    const displayAltKategoriler = selectedKurumlar.length > 0 
        ? (altKategoriler || []).filter(ak => selectedKurumlar.some(s => ak.kurumSlugs.includes(s)))
        : (altKategoriler || [])

    const sortOptions = [
        { value: 'önerilen', label: 'Önerilen Sıralama', icon: <Sparkles size={14} /> },
        { value: 'en-yeniler', label: 'En Yeni Eğitimler', icon: <Clock size={14} /> },
        { value: 'en-cok-satanlar', label: 'En Çok Satanlar', icon: <Flame size={14} /> },
        { value: 'indirim-orani', label: 'En Yüksek İndirim', icon: <Percent size={14} /> },
        { value: 'fiyat-artan', label: 'Fiyat: Düşükten Yükseğe', icon: <TrendingUp size={14} /> },
        { value: 'fiyat-azalan', label: 'Fiyat: Yüksekten Düşüğe', icon: <TrendingUp size={14} style={{ transform: 'rotate(180deg)' }} /> },
        { value: 'alfabetik-az', label: 'Alfabetik (A-Z)', icon: <ArrowDownAZ size={14} /> },
        { value: 'alfabetik-za', label: 'Alfabetik (Z-A)', icon: <ArrowUpZA size={14} /> }
    ]

    const activeSort = sortOptions.find(opt => opt.value === sortBy) || sortOptions[0]

    // Sync query parameters on mount or when they change
    useEffect(() => {
        if (categoryParam || kurumParam) {
            setViewMode('egitimler')
            
            if (categoryParam) {
                // Map short query labels to full category names
                if (categoryParam === 'egitimler' || categoryParam === 'online') {
                    const onlineCat = uniqueCategories.find(c => c.toLowerCase().includes('online'))
                    if (onlineCat) setSelectedCategories([onlineCat])
                } else if (categoryParam === 'yayinlar' || categoryParam === 'kitap') {
                    const kitapCat = uniqueCategories.find(c => c.toLowerCase().includes('kitap') || c.toLowerCase().includes('yayın'))
                    if (kitapCat) setSelectedCategories([kitapCat])
                } else {
                    const matchedCat = uniqueCategories.find(c => c.toLowerCase().includes(categoryParam.toLowerCase()))
                    if (matchedCat) setSelectedCategories([matchedCat])
                }
            }
            
            if (kurumParam) {
                const kurumExists = allKurumlar.some(k => k.slug === kurumParam)
                if (kurumExists) {
                    setSelectedKurumlar([kurumParam])
                }
            }
        }
    }, [categoryParam, kurumParam])

    // Toggle multi-select array
    const toggleFilter = (slug: string, state: string[], setState: React.Dispatch<React.SetStateAction<string[]>>) => {
        if (state.includes(slug)) {
            setState(state.filter(item => item !== slug))
        } else {
            setState([...state, slug])
        }
    }

    // Reset filters helper
    const handleResetFilters = () => {
        setSearchQuery('')
        setSelectedKurumlar([])
        setSelectedAltKategoriler([])
        setSelectedCategories([])
        setPriceRange({ min: 0, max: 10000 })
        setSortBy('önerilen')
    }

    // Dynamic filtering
    const filteredProducts = allProducts.filter(product => {
        if (product.status === 'passive') return false

        // Search text matching
        const matchesSearch = searchQuery === '' || 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())

        // Kurum matching
        const matchesKurum = selectedKurumlar.length === 0 || 
            selectedKurumlar.includes(product.kurumSlug) || 
            (product.kurumSlugs && product.kurumSlugs.some(slug => selectedKurumlar.includes(slug)))

        // Alt Kategori (Dersler) matching
        const matchesAltKategori = selectedAltKategoriler.length === 0 ||
            (product.altKategoriSlug && selectedAltKategoriler.includes(product.altKategoriSlug)) ||
            (product.altKategoriSlugs && product.altKategoriSlugs.some(slug => selectedAltKategoriler.includes(slug)))

        // Category matching
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.categoryName)

        // Price matching
        const finalPrice = product.salePrice || product.price
        const matchesPrice = finalPrice >= priceRange.min && finalPrice <= priceRange.max

        return matchesSearch && matchesKurum && matchesAltKategori && matchesCategory && matchesPrice
    })

    // Dynamic sorting
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const priceA = a.salePrice || a.price
        const priceB = b.salePrice || b.price

        switch (sortBy) {
            case 'fiyat-artan':
                return priceA - priceB
            case 'fiyat-azalan':
                return priceB - priceA
            case 'alfabetik-az':
                return a.name.localeCompare(b.name, 'tr')
            case 'alfabetik-za':
                return b.name.localeCompare(a.name, 'tr')
            case 'en-yeniler':
                return Number(b.id) - Number(a.id)
            case 'en-cok-satanlar':
                // Rank specific popular items or odd/even ids as bestsellers
                const scoreA = Number(a.id) % 3 === 0 ? 20 : Number(a.id)
                const scoreB = Number(b.id) % 3 === 0 ? 20 : Number(b.id)
                return scoreB - scoreA
            case 'indirim-orani':
                const discA = a.salePrice ? (a.price - a.salePrice) / a.price : 0
                const discB = b.salePrice ? (b.price - b.salePrice) / b.price : 0
                return discB - discA
            case 'önerilen':
            default:
                let orderA = a.order ?? 9999
                let orderB = b.order ?? 9999

                if (selectedAltKategoriler.length === 1) {
                    const altCatSlug = selectedAltKategoriler[0]
                    const keyA = selectedKurumlar.length === 1 ? `${selectedKurumlar[0]}_${altCatSlug}` : `${a.kurumSlug}_${altCatSlug}`
                    const keyB = selectedKurumlar.length === 1 ? `${selectedKurumlar[0]}_${altCatSlug}` : `${b.kurumSlug}_${altCatSlug}`
                    orderA = a.categoryOrders?.[keyA] ?? a.order ?? 9999
                    orderB = b.categoryOrders?.[keyB] ?? b.order ?? 9999
                }

                if (orderA !== orderB) return orderA - orderB
                return a.name.localeCompare(b.name, 'tr')
        }
    })

    return (
        <div className="container section">
            {/* Header Area */}
            <div className={styles.header}>
                <div className={styles.breadcrumbs}>
                    <Link href="/">Ana Sayfa</Link> / <span>Kurumsal Sınavlar</span>
                </div>
                <h1 className={styles.pageTitle}>Sınav Hazırlık Akademisi</h1>
                <p className={styles.subtitle}>
                    Devlet kurumları sınav müfredatlarına tam uyumlu profesyonel video eğitim setleri ve basılı soru bankaları.
                </p>

                {/* Premium Segmented Switcher Control */}
                <div className={styles.tabContainer}>
                    <div className={styles.tabBackground}>
                        <button 
                            className={`${styles.tabBtn} ${viewMode === 'kurumlar' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('kurumlar')}
                        >
                            <Building2 size={16} />
                            <span>Kurumlara Göre Göz At</span>
                        </button>
                        <button 
                            className={`${styles.tabBtn} ${viewMode === 'egitimler' ? styles.activeTab : ''}`}
                            onClick={() => setViewMode('egitimler')}
                        >
                            <BookOpen size={16} />
                            <span>Tüm Eğitimleri Listele</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Render Kurum Cards (Bento grid) */}
            <AnimatePresence mode="wait">
                {viewMode === 'kurumlar' ? (
                    <motion.div
                        key="kurumlar"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.kurumGrid}
                    >
                        {allKurumlar.map((kurum, index) => (
                            <KurumCard
                                key={kurum.id}
                                {...kurum}
                                index={index}
                            />
                        ))}
                    </motion.div>
                ) : (
                    /* Render Classic E-Commerce Filter Catalog */
                    <motion.div
                        key="egitimler"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className={styles.catalogLayout}
                    >
                        {/* LEFT COLUMN: Sidebar Filters (Hidden on Mobile) */}
                        <aside className={styles.sidebarFilters}>
                            <div className={styles.filterCard}>
                                <div className={styles.filterCardHeader}>
                                    <div className={styles.filterCardTitle}>
                                        <Filter size={18} />
                                        <span>Gelişmiş Filtreler</span>
                                    </div>
                                    {(selectedKurumlar.length > 0 || selectedCategories.length > 0 || searchQuery !== '' || priceRange.min > 0 || priceRange.max < 10000) && (
                                        <button className={styles.clearBtn} onClick={handleResetFilters}>
                                            Temizle
                                        </button>
                                    )}
                                </div>

                                {/* Text Search facet */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Ders veya Kanun Ara</h4>
                                    <div className={styles.searchWrapper}>
                                        <input
                                            type="text"
                                            placeholder="Örn: 657, Anayasa..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                        <Search className={styles.searchIcon} size={16} />
                                    </div>
                                </div>

                                {/* Institution facet */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>İlgili Kurum / Bakanlık</h4>
                                    <div className={styles.checkboxList}>
                                        {allKurumlar.map(kurum => {
                                            const isChecked = selectedKurumlar.includes(kurum.slug)
                                            return (
                                                <label key={kurum.slug} className={styles.checkboxLabel}>
                                                    <div className={styles.checkboxWrapper}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleFilter(kurum.slug, selectedKurumlar, setSelectedKurumlar)}
                                                            className={styles.realCheckbox}
                                                        />
                                                        <div className={`${styles.customCheckbox} ${isChecked ? styles.checkedCheckbox : ''}`} style={{ '--accent-checkbox': kurum.color } as React.CSSProperties}>
                                                            {isChecked && <Check size={10} strokeWidth={4} />}
                                                        </div>
                                                    </div>
                                                    <span className={styles.checkboxText}>{kurum.name}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Alt Kategori (Dersler) facet */}
                                {displayAltKategoriler.length > 0 && (
                                    <div className={styles.facetGroup}>
                                        <h4 className={styles.facetTitle}>Dersler / Konular</h4>
                                        <div className={styles.checkboxList}>
                                            {displayAltKategoriler.map(altKat => {
                                                const isChecked = selectedAltKategoriler.includes(altKat.slug)
                                                return (
                                                    <label key={altKat.slug} className={styles.checkboxLabel}>
                                                        <div className={styles.checkboxWrapper}>
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleFilter(altKat.slug, selectedAltKategoriler, setSelectedAltKategoriler)}
                                                                className={styles.realCheckbox}
                                                            />
                                                            <div className={`${styles.customCheckbox} ${isChecked ? styles.checkedCheckbox : ''}`}>
                                                                {isChecked && <Check size={10} strokeWidth={4} />}
                                                            </div>
                                                        </div>
                                                        <span className={styles.checkboxText}>{altKat.name}</span>
                                                    </label>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Category facet */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Eğitim & Ürün Türü</h4>
                                    <div className={styles.checkboxList}>
                                        {uniqueCategories.map(category => {
                                            const isChecked = selectedCategories.includes(category)
                                            return (
                                                <label key={category} className={styles.checkboxLabel}>
                                                    <div className={styles.checkboxWrapper}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                                                            className={styles.realCheckbox}
                                                        />
                                                        <div className={`${styles.customCheckbox} ${isChecked ? styles.checkedCheckbox : ''}`}>
                                                            {isChecked && <Check size={10} strokeWidth={4} />}
                                                        </div>
                                                    </div>
                                                    <span className={styles.checkboxText}>{category}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Price facet */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Fiyat Aralığı (₺)</h4>
                                    <div className={styles.priceInputs}>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min || ''}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                            className={styles.priceInput}
                                        />
                                        <span className={styles.priceSeparator}>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max || ''}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                            className={styles.priceInput}
                                        />
                                    </div>
                                    <div className={styles.priceQuickFilter}>
                                        <button className={styles.quickPriceBtn} onClick={() => setPriceRange({ min: 0, max: 1000 })}>1.000 ₺ Altı</button>
                                        <button className={styles.quickPriceBtn} onClick={() => setPriceRange({ min: 1000, max: 4000 })}>1.000 - 4.000 ₺</button>
                                        <button className={styles.quickPriceBtn} onClick={() => setPriceRange({ min: 4000, max: 10000 })}>4.000 ₺ Üstü</button>
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* RIGHT COLUMN: Results Catalog */}
                        <main className={styles.mainCatalog}>
                            {/* Toolbar (Mobile Filters Toggle & Results count & Sorting) */}
                            <div className={styles.catalogToolbar}>
                                <div className={styles.toolbarLeft}>
                                    {/* Mobile Filters Toggle Trigger */}
                                    <button 
                                        className={styles.mobileFilterToggle}
                                        onClick={() => setIsMobileFiltersOpen(true)}
                                    >
                                        <SlidersHorizontal size={16} />
                                        <span>Filtrele ({selectedKurumlar.length + selectedCategories.length + (searchQuery !== '' ? 1 : 0)})</span>
                                    </button>

                                    <div className={styles.resultsCount}>
                                        <strong>{sortedProducts.length}</strong> ders listeleniyor
                                    </div>
                                </div>

                                <div className={styles.toolbarRight}>
                                    <div className={styles.sortContainer}>
                                        {/* Transparent overlay backdrop to close on click outside */}
                                        {isSortOpen && (
                                            <div 
                                                className={styles.sortBackdrop} 
                                                onClick={() => setIsSortOpen(false)} 
                                            />
                                        )}
                                        
                                        <button 
                                            className={`${styles.sortTrigger} ${isSortOpen ? styles.sortTriggerActive : ''}`}
                                            onClick={() => setIsSortOpen(!isSortOpen)}
                                        >
                                            <span className={styles.sortTriggerIcon}>{activeSort.icon}</span>
                                            <span className={styles.sortTriggerLabel}>{activeSort.label}</span>
                                            <ChevronDown size={15} className={`${styles.sortChevron} ${isSortOpen ? styles.chevronOpen : ''}`} />
                                        </button>

                                        <AnimatePresence>
                                            {isSortOpen && (
                                                <motion.ul 
                                                    className={styles.sortDropdown}
                                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                                                >
                                                    {sortOptions.map(option => {
                                                        const isSelected = option.value === sortBy
                                                        return (
                                                            <li key={option.value}>
                                                                <button
                                                                    className={`${styles.sortOption} ${isSelected ? styles.sortOptionSelected : ''}`}
                                                                    onClick={() => {
                                                                        setSortBy(option.value)
                                                                        setIsSortOpen(false)
                                                                    }}
                                                                >
                                                                    <span className={styles.optionIcon}>{option.icon}</span>
                                                                    <span className={styles.optionLabel}>{option.label}</span>
                                                                    {isSelected && <Check size={14} className={styles.optionCheck} />}
                                                                </button>
                                                            </li>
                                                        )
                                                    })}
                                                </motion.ul>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </div>

                            {/* Active Filters Tag Strip */}
                            {(selectedKurumlar.length > 0 || selectedCategories.length > 0 || searchQuery !== '' || priceRange.min > 0 || priceRange.max < 10000) && (
                                <div className={styles.activeFiltersStrip}>
                                    {searchQuery !== '' && (
                                        <div className={styles.filterTag}>
                                            <span>Ara: &quot;{searchQuery}&quot;</span>
                                            <button onClick={() => setSearchQuery('')}><X size={12} /></button>
                                        </div>
                                    )}
                                    {selectedKurumlar.map(slug => {
                                        const kName = allKurumlar.find(k => k.slug === slug)?.name
                                        return (
                                            <div key={slug} className={styles.filterTag}>
                                                <span>{kName}</span>
                                                <button onClick={() => toggleFilter(slug, selectedKurumlar, setSelectedKurumlar)}><X size={12} /></button>
                                            </div>
                                        )
                                    })}
                                    {selectedCategories.map(cat => (
                                        <div key={cat} className={styles.filterTag}>
                                            <span>{cat}</span>
                                            <button onClick={() => toggleFilter(cat, selectedCategories, setSelectedCategories)}><X size={12} /></button>
                                        </div>
                                    ))}
                                    {(priceRange.min > 0 || priceRange.max < 10000) && (
                                        <div className={styles.filterTag}>
                                            <span>{priceRange.min}₺ - {priceRange.max}₺</span>
                                            <button onClick={() => setPriceRange({ min: 0, max: 10000 })}><X size={12} /></button>
                                        </div>
                                    )}
                                    <button className={styles.clearAllTag} onClick={handleResetFilters}>
                                        Tümünü Temizle
                                    </button>
                                </div>
                            )}

                            {/* Catalog Grid */}
                            {sortedProducts.length > 0 ? (
                                <div className={styles.productGrid}>
                                    {sortedProducts.map(product => (
                                        <ProductCard
                                            key={product.id}
                                            {...product}
                                            slug={`${product.kurumSlug}/${product.altKategoriSlug}/${product.slug}`}
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* Empty state */
                                <div className={styles.emptyState}>
                                    <div className={styles.emptyIconBox}>
                                        <Search size={40} />
                                    </div>
                                    <h3>Aramanızla Eşleşen Eğitim Bulunamadı</h3>
                                    <p>Seçtiğiniz filtreleri gevşeterek veya arama teriminizi değiştirerek tekrar deneyebilirsiniz.</p>
                                    <button className="btn btn-outline" onClick={handleResetFilters}>
                                        <RefreshCw size={14} style={{ marginRight: '6px' }} />
                                        Filtreleri Sıfırla
                                    </button>
                                </div>
                            )}
                        </main>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* MOBILE SIDE/BOTTOM DRAWER FILTER DIALOG */}
            <AnimatePresence>
                {isMobileFiltersOpen && (
                    <>
                        {/* Overlay backdrop */}
                        <motion.div 
                            className={styles.drawerOverlay}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMobileFiltersOpen(false)}
                        />

                        {/* Slide-in drawer container */}
                        <motion.div 
                            className={styles.drawerContainer}
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                        >
                            <div className={styles.drawerHeader}>
                                <h3>Filtreleri Özelleştir</h3>
                                <button className={styles.closeDrawerBtn} onClick={() => setIsMobileFiltersOpen(false)}>
                                    <X size={22} />
                                </button>
                            </div>

                            <div className={styles.drawerContent}>
                                {/* Live Search in mobile */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Ders Ara</h4>
                                    <div className={styles.searchWrapper}>
                                        <input
                                            type="text"
                                            placeholder="Ders adı yazın..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className={styles.searchInput}
                                        />
                                        <Search className={styles.searchIcon} size={16} />
                                    </div>
                                </div>

                                {/* Institution checklist in mobile */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Resmi Kurumlar</h4>
                                    <div className={styles.checkboxList}>
                                        {allKurumlar.map(kurum => {
                                            const isChecked = selectedKurumlar.includes(kurum.slug)
                                            return (
                                                <label key={kurum.slug} className={styles.checkboxLabel}>
                                                    <div className={styles.checkboxWrapper}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleFilter(kurum.slug, selectedKurumlar, setSelectedKurumlar)}
                                                            className={styles.realCheckbox}
                                                        />
                                                        <div className={`${styles.customCheckbox} ${isChecked ? styles.checkedCheckbox : ''}`} style={{ '--accent-checkbox': kurum.color } as React.CSSProperties}>
                                                            {isChecked && <Check size={10} strokeWidth={4} />}
                                                        </div>
                                                    </div>
                                                    <span className={styles.checkboxText}>{kurum.name}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Category checklist in mobile */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Eğitim Türü</h4>
                                    <div className={styles.checkboxList}>
                                        {uniqueCategories.map(category => {
                                            const isChecked = selectedCategories.includes(category)
                                            return (
                                                <label key={category} className={styles.checkboxLabel}>
                                                    <div className={styles.checkboxWrapper}>
                                                        <input
                                                            type="checkbox"
                                                            checked={isChecked}
                                                            onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                                                            className={styles.realCheckbox}
                                                        />
                                                        <div className={`${styles.customCheckbox} ${isChecked ? styles.checkedCheckbox : ''}`}>
                                                            {isChecked && <Check size={10} strokeWidth={4} />}
                                                        </div>
                                                    </div>
                                                    <span className={styles.checkboxText}>{category}</span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* Price inputs in mobile */}
                                <div className={styles.facetGroup}>
                                    <h4 className={styles.facetTitle}>Fiyat Aralığı (₺)</h4>
                                    <div className={styles.priceInputs}>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            value={priceRange.min || ''}
                                            onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                                            className={styles.priceInput}
                                        />
                                        <span className={styles.priceSeparator}>-</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            value={priceRange.max || ''}
                                            onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                                            className={styles.priceInput}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.drawerFooter}>
                                <button className={styles.drawerResetBtn} onClick={handleResetFilters}>
                                    Filtreleri Sıfırla
                                </button>
                                <button className={styles.drawerApplyBtn} onClick={() => setIsMobileFiltersOpen(false)}>
                                    Sonuçları Göster ({sortedProducts.length})
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
