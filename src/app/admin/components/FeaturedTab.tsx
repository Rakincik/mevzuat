'use client'

import React, { useState, useEffect } from 'react'
import { Star, ChevronUp, ChevronDown, Trash2, Sparkles, AlertCircle, Plus, FolderHeart, X } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import styles from '../page.module.css'

interface FeaturedTabProps {
    triggerToast: (message: string) => void
}

export default function FeaturedTab({ triggerToast }: FeaturedTabProps) {
    const { 
        products, 
        kurumlar, 
        featuredIds, 
        toggleFeatured, 
        updateMultipleProducts,
        altKategoriler,
        updateAltKategori,
        pages,
        updatePage
    } = useApp()

    const [subTab, setSubTab] = useState<'products' | 'subcats'>('products')
    
    // Modal states
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false)
    const [isSubcatModalOpen, setIsSubcatModalOpen] = useState(false)
    
    // Search & Filter states
    const [courseSearch, setCourseSearch] = useState('')
    const [courseKurumFilter, setCourseKurumFilter] = useState('')
    const [subcatSearch, setSubcatSearch] = useState('')
    const [subcatKurumFilter, setSubcatKurumFilter] = useState('')
    
    // Hover states for micro-animations
    const [hoveredCourseId, setHoveredCourseId] = useState<string | null>(null)
    const [hoveredSubcatId, setHoveredSubcatId] = useState<string | null>(null)

    const homePage = pages.find(p => p.id === 'home')

    // 1. PRODUCTS SHOWCASE DATA
    const featuredProducts = products.filter(product => featuredIds.includes(product.id))
    const nonFeaturedProducts = products.filter(product => !featuredIds.includes(product.id))

    const handleMoveUp = (index: number) => {
        if (index === 0) return
        const updates = featuredProducts.map((p, idx) => {
            let targetOrder = idx + 1
            if (idx === index) {
                targetOrder = index
            } else if (idx === index - 1) {
                targetOrder = index + 1
            }
            return { id: p.id, fields: { order: targetOrder } }
        })
        updateMultipleProducts(updates)
        triggerToast('Sıralama yukarı taşındı.')
    }

    const handleMoveDown = (index: number) => {
        if (index === featuredProducts.length - 1) return
        const updates = featuredProducts.map((p, idx) => {
            let targetOrder = idx + 1
            if (idx === index) {
                targetOrder = index + 2
            } else if (idx === index + 1) {
                targetOrder = index + 1
            }
            return { id: p.id, fields: { order: targetOrder } }
        })
        updateMultipleProducts(updates)
        triggerToast('Sıralama aşağı taşındı.')
    }

    // 2. SUBCATEGORIES SHOWCASE DATA
    const checkedIds = (altKategoriler || [])
        .filter(cat => cat.status !== 'passive' && cat.showOnHomepage === true)
        .map(c => c.id)

    const featuredSubcats = [...(altKategoriler || [])]
        .filter(cat => checkedIds.includes(cat.id))
        .sort((a, b) => {
            const idxA = (homePage?.featuredSubcatOrders || []).indexOf(a.id)
            const idxB = (homePage?.featuredSubcatOrders || []).indexOf(b.id)
            if (idxA > -1 && idxB > -1) return idxA - idxB
            if (idxA > -1) return -1
            if (idxB > -1) return 1
            return 0
        })

    const nonFeaturedSubcats = (altKategoriler || [])
        .filter(cat => cat.status !== 'passive' && !checkedIds.includes(cat.id))

    const handleMoveSubcatUp = (index: number) => {
        if (index === 0) return
        const currentOrders = [...(homePage?.featuredSubcatOrders || [])]
        const temp = currentOrders[index]
        currentOrders[index] = currentOrders[index - 1]
        currentOrders[index - 1] = temp
        updatePage('home', { ...homePage, featuredSubcatOrders: currentOrders })
        triggerToast('Sınav grubu sıralaması yukarı taşındı.')
    }

    const handleMoveSubcatDown = (index: number) => {
        const currentOrders = [...(homePage?.featuredSubcatOrders || [])]
        if (index === currentOrders.length - 1) return
        const temp = currentOrders[index]
        currentOrders[index] = currentOrders[index + 1]
        currentOrders[index + 1] = temp
        updatePage('home', { ...homePage, featuredSubcatOrders: currentOrders })
        triggerToast('Sınav grubu sıralaması aşağı taşındı.')
    }

    const handleToggleShowOnHomepage = (catId: string, show: boolean) => {
        const cat = altKategoriler.find(c => c.id === catId)
        if (!cat) return
        updateAltKategori(catId, { ...cat, showOnHomepage: show })
        
        const currentOrders = [...(homePage?.featuredSubcatOrders || [])]
        let nextOrders = [...currentOrders]
        if (show) {
            if (!nextOrders.includes(catId)) {
                nextOrders.push(catId)
            }
        } else {
            nextOrders = nextOrders.filter(id => id !== catId)
        }
        updatePage('home', { ...homePage, featuredSubcatOrders: nextOrders })
        
        triggerToast(show ? 'Sınav grubu vitrine eklendi!' : 'Sınav grubu vitrinden kaldırıldı.')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Sub-Tab Navigation Bar */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', gap: '24px', marginBottom: '8px' }}>
                <button
                    type="button"
                    onClick={() => setSubTab('products')}
                    style={{
                        padding: '12px 4px',
                        fontSize: '13px',
                        fontWeight: '800',
                        border: 'none',
                        background: 'transparent',
                        borderBottom: subTab === 'products' ? '3px solid #6366f1' : '3px solid transparent',
                        color: subTab === 'products' ? '#6366f1' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                    }}
                >
                    🎓 ÖNE ÇIKAN EĞİTİMLER
                </button>
                <button
                    type="button"
                    onClick={() => setSubTab('subcats')}
                    style={{
                        padding: '12px 4px',
                        fontSize: '13px',
                        fontWeight: '800',
                        border: 'none',
                        background: 'transparent',
                        borderBottom: subTab === 'subcats' ? '3px solid #6366f1' : '3px solid transparent',
                        color: subTab === 'subcats' ? '#6366f1' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                    }}
                >
                    📂 ÖNE ÇIKAN SINAV GRUPLARI
                </button>
            </div>

            {/* TAB CONTENT: PRODUCTS */}
            {subTab === 'products' && (
                <>
                    {/* Upper Showcase Info & Controller */}
                    <div className={styles.showcaseHeader} style={{ background: '#f8fafc', padding: '20px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                <Star size={18} fill="#ca8a04" color="#ca8a04" />
                                <span>Ana Sayfa Vitrin Yönetimi</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>
                                Ana sayfanızdaki yatay kaydırıcıda (slider) gösterilen öne çıkan eğitimlerin sırasını ve dizilimini yönetin.
                            </p>
                        </div>
        
                        {/* Trigger Search Modal Button */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsCourseModalOpen(true)}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '13px', fontWeight: '700', borderRadius: '8px' }}
                            >
                                <Plus size={16} /> Vitrine Yeni Eğitim Ekle
                            </button>
                        </div>
                    </div>
        
                    {/* Grid Symmetry Warning Box */}
                    {featuredProducts.length > 0 && (
                        <div className={styles.symmetryTipBox} style={{
                            background: featuredProducts.length % 3 !== 0 ? '#fffbeb' : '#f0fdf4',
                            borderColor: featuredProducts.length % 3 !== 0 ? '#f59e0b' : '#22c55e',
                            boxShadow: featuredProducts.length % 3 !== 0 ? '4px 4px 0px 0px #f59e0b' : '4px 4px 0px 0px #22c55e',
                            color: featuredProducts.length % 3 !== 0 ? '#b45309' : '#15803d'
                        }}>
                            <Sparkles size={18} style={{ flexShrink: 0 }} />
                            <span>
                                {featuredProducts.length % 3 !== 0 
                                    ? `💡 Tavsiye: Ana sayfa görünümünün simetrik ve dengeli durması için vitrine 3'ün katı kadar (Örn: 3, 6, 9) eğitim eklemeniz önerilir. En şık tasarım için en fazla 6 veya 9 adet eklenmesi tavsiye edilir. (Şu an aktif: ${featuredProducts.length} eğitim)`
                                    : `Vitrindeki eğitim sayısı (${featuredProducts.length}) simetri kurallarına uygun (3'ün katı). En şık tasarım için en fazla 6 veya 9 adet eklenmesi tavsiye edilir.`}
                            </span>
                        </div>
                    )}
        
                    {/* Active Showcase Table Bento Card */}
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader} style={{ gridTemplateColumns: '80px 2.2fr 1fr 120px 120px' }}>
                            <div className={styles.colName} style={{ alignItems: 'center', padding: 0 }}>VİTRİN NO</div>
                            <div className={styles.colName}>EĞİTİM ADI / KURUM</div>
                            <div className={styles.colPrice}>FİYAT</div>
                            <div className={styles.colAction} style={{ justifyContent: 'center' }}>SIRALAMA</div>
                            <div className={styles.colAction} style={{ justifyContent: 'center' }}>İŞLEMLER</div>
                        </div>
        
                        <div className={styles.tableBody}>
                            {featuredProducts.map((product, index) => {
                                return (
                                    <div key={product.id} className={styles.tableRow} style={{ gridTemplateColumns: '80px 2.2fr 1fr 120px 120px' }}>
                                        {/* Showcase Number Badge */}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontWeight: '900', fontFamily: 'monospace', border: '1.5px solid #bfdbfe' }}>
                                                #{index + 1}
                                            </span>
                                        </div>
        
                                        {/* Product Details */}
                                        <div className={styles.colName} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ width: '40px', height: '52px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                                                {product.image ? (
                                                    <img 
                                                        src={product.image} 
                                                        alt={product.name} 
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '18px' }}>📘</span>
                                                )}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div className={styles.productName} style={{ fontWeight: '700', fontSize: '13.5px', color: '#1e293b' }}>{product.name}</div>
                                                <div className={styles.productKurum} style={{ fontSize: '11px', color: '#64748b' }}>
                                                    {kurumlar.find(k => k.slug === product.kurumSlug)?.name || product.kurumSlug}
                                                </div>
                                            </div>
                                        </div>
        
                                        {/* Category and Price */}
                                        <div className={styles.colPrice}>
                                            {product.salePrice ? (
                                                <div className={styles.priceContainer}>
                                                    <span className={styles.salePrice}>{product.salePrice} ₺</span>
                                                    <span className={styles.oldPrice}>{product.price} ₺</span>
                                                </div>
                                            ) : (
                                                <span className={styles.salePrice}>{product.price} ₺</span>
                                            )}
                                        </div>
        
                                        {/* Up & Down Reordering Arrows */}
                                        <div className={styles.colAction} style={{ justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                type="button"
                                                className={`${styles.reorderBtn} ${index === 0 ? styles.reorderBtnDisabled : ''}`}
                                                onClick={() => handleMoveUp(index)}
                                                disabled={index === 0}
                                                title="Yukarı Taşı"
                                            >
                                                <ChevronUp size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.reorderBtn} ${index === featuredProducts.length - 1 ? styles.reorderBtnDisabled : ''}`}
                                                onClick={() => handleMoveDown(index)}
                                                disabled={index === featuredProducts.length - 1}
                                                title="Aşağı Taşı"
                                            >
                                                <ChevronDown size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
        
                                        {/* Action Buttons (Trash to remove from featured) */}
                                        <div className={styles.colAction} style={{ justifyContent: 'center' }}>
                                            <button 
                                                type="button"
                                                className={styles.actionDeleteBtn}
                                                onClick={() => {
                                                    toggleFeatured(product.id)
                                                    triggerToast('Eğitim vitrinden kaldırıldı.')
                                                }}
                                                title="Vitrinden Kaldır"
                                                style={{ padding: '6px' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
        
                            {featuredProducts.length === 0 && (
                                <div className={styles.emptyTable} style={{ padding: '40px 20px' }}>
                                    <AlertCircle size={42} className={styles.emptyIcon} />
                                    <h3>Ana Sayfa Vitrini Boş</h3>
                                    <p style={{ maxWidth: '400px', margin: '8px auto 0 auto' }}>
                                        Şu an ana sayfanızda sergilenen bir eğitim bulunmamaktadır. Sağ üst köşedeki seçiciden veya Eğitim Yönetimi listesinden hemen eğitim ekleyebilirsiniz.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* TAB CONTENT: SUBCATEGORIES */}
            {subTab === 'subcats' && (
                <>
                    {/* Upper Showcase Info & Controller */}
                    <div className={styles.showcaseHeader} style={{ background: '#f8fafc', padding: '20px 24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '15px', fontWeight: '800', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                                <FolderHeart size={18} fill="#ca8a04" color="#ca8a04" />
                                <span>Ana Sayfa Sınav Vitrin Yönetimi</span>
                            </h2>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0', fontWeight: '500' }}>
                                Ana sayfanızdaki "Popüler Sınav Grupları" bölümünde öne çıkarılan sınav kategorilerinin sırasını ve yayında gösterim durumunu yönetin.
                            </p>
                        </div>
        
                        {/* Trigger Search Modal Button */}
                        <div>
                            <button
                                type="button"
                                onClick={() => setIsSubcatModalOpen(true)}
                                className="btn btn-primary"
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', fontSize: '13px', fontWeight: '700', borderRadius: '8px' }}
                            >
                                <Plus size={16} /> Vitrine Yeni Sınav Grubu Ekle
                            </button>
                        </div>
                    </div>
        
                    {/* Grid Symmetry Warning Box for Subcategories */}
                    {featuredSubcats.length > 0 && (
                        <div className={styles.symmetryTipBox} style={{
                            background: featuredSubcats.length % 2 !== 0 ? '#fffbeb' : '#f0fdf4',
                            borderColor: featuredSubcats.length % 2 !== 0 ? '#f59e0b' : '#22c55e',
                            boxShadow: featuredSubcats.length % 2 !== 0 ? '4px 4px 0px 0px #f59e0b' : '4px 4px 0px 0px #22c55e',
                            color: featuredSubcats.length % 2 !== 0 ? '#b45309' : '#15803d'
                        }}>
                            <Sparkles size={18} style={{ flexShrink: 0 }} />
                            <span>
                                {featuredSubcats.length % 2 !== 0 
                                    ? `💡 Tavsiye: Ana sayfa görünümünün simetrik durması için çift sayıda (Örn: 2, 4, 6, 8) sınav grubu eklemeniz önerilir. En şık tasarım için en fazla 4, 6 veya 8 adet tavsiye edilir. (Şu an aktif: ${featuredSubcats.length} sınav grubu)`
                                    : `Vitrindeki sınav grubu sayısı (${featuredSubcats.length}) simetri kurallarına uygun (çift sayı). En şık tasarım için en fazla 4, 6 veya 8 adet tavsiye edilir.`}
                            </span>
                        </div>
                    )}
        
                    {/* Active Showcase Table Bento Card */}
                    <div className={styles.tableCard}>
                        <div className={styles.tableHeader} style={{ gridTemplateColumns: '80px 2.2fr 1fr 120px 120px' }}>
                            <div className={styles.colName} style={{ alignItems: 'center', padding: 0 }}>VİTRİN NO</div>
                            <div className={styles.colName}>SINAV GRUBU ADI / ÜST BAKANLIK</div>
                            <div className={styles.colPrice}>İLİŞKİLİ DERS SAYISI</div>
                            <div className={styles.colAction} style={{ justifyContent: 'center' }}>SIRALAMA</div>
                            <div className={styles.colAction} style={{ justifyContent: 'center' }}>İŞLEMLER</div>
                        </div>
        
                        <div className={styles.tableBody}>
                            {featuredSubcats.map((cat, index) => {
                                const parentSlug = cat.kurumSlugs?.[0];
                                const parentKurum = kurumlar.find(k => k.slug === parentSlug);
                                const count = products.filter(p => p.status !== 'passive' && (p.altKategoriSlug === cat.slug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(cat.slug)))).length;
                                return (
                                    <div key={cat.id} className={styles.tableRow} style={{ gridTemplateColumns: '80px 2.2fr 1fr 120px 120px' }}>
                                        {/* Showcase Number Badge */}
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                            <span style={{ fontSize: '12px', background: '#eff6ff', color: '#2563eb', padding: '4px 10px', borderRadius: '6px', fontWeight: '900', fontFamily: 'monospace', border: '1.5px solid #bfdbfe' }}>
                                                #{index + 1}
                                            </span>
                                        </div>
        
                                        {/* Subcategory Details */}
                                        <div className={styles.colName} style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                <div style={{ fontWeight: '700', fontSize: '13.5px', color: '#1e293b' }}>{cat.name}</div>
                                                {parentKurum && (
                                                    <div style={{ fontSize: '11px', color: parentKurum.color || '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>
                                                        {parentKurum.name}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
        
                                        {/* Price block reuse as Course Count */}
                                        <div className={styles.colPrice}>
                                            <span style={{ fontSize: '13.5px', fontWeight: '700', color: '#475569' }}>
                                                📚 {count} Eğitim Paketi
                                            </span>
                                        </div>
        
                                        {/* Up & Down Reordering Arrows */}
                                        <div className={styles.colAction} style={{ justifyContent: 'center', gap: '8px' }}>
                                            <button
                                                type="button"
                                                className={`${styles.reorderBtn} ${index === 0 ? styles.reorderBtnDisabled : ''}`}
                                                onClick={() => handleMoveSubcatUp(index)}
                                                disabled={index === 0}
                                                title="Yukarı Taşı"
                                            >
                                                <ChevronUp size={16} strokeWidth={2.5} />
                                            </button>
                                            <button
                                                type="button"
                                                className={`${styles.reorderBtn} ${index === featuredSubcats.length - 1 ? styles.reorderBtnDisabled : ''}`}
                                                onClick={() => handleMoveSubcatDown(index)}
                                                disabled={index === featuredSubcats.length - 1}
                                                title="Aşağı Taşı"
                                            >
                                                <ChevronDown size={16} strokeWidth={2.5} />
                                            </button>
                                        </div>
        
                                        {/* Action Buttons (Trash to remove from featured) */}
                                        <div className={styles.colAction} style={{ justifyContent: 'center' }}>
                                            <button 
                                                type="button"
                                                className={styles.actionDeleteBtn}
                                                onClick={() => {
                                                    handleToggleShowOnHomepage(cat.id, false)
                                                }}
                                                title="Vitrinden Kaldır"
                                                style={{ padding: '6px' }}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                )
                            })}
        
                            {featuredSubcats.length === 0 && (
                                <div className={styles.emptyTable} style={{ padding: '40px 20px' }}>
                                    <AlertCircle size={42} className={styles.emptyIcon} />
                                    <h3>Ana Sayfa Sınav Vitrini Boş</h3>
                                    <p style={{ maxWidth: '400px', margin: '8px auto 0 auto' }}>
                                        Şu an ana sayfanızda sergilenen bir sınav grubu bulunmamaktadır. Sağ üst köşedeki seçiciden hemen aktif sınav grubu ekleyebilirsiniz.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {/* COURSE SHOWCASE ADD MODAL */}
            {isCourseModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer} style={{ maxWidth: '820px', width: '90%', borderRadius: '16px' }}>
                        <div className={styles.modalHeader} style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Star size={18} fill="#ca8a04" color="#ca8a04" />
                                <span>VİTRİNE YENİ EĞİTİM EKLE</span>
                            </h2>
                            <button 
                                type="button" 
                                className={styles.modalCloseBtn} 
                                onClick={() => {
                                    setIsCourseModalOpen(false)
                                    setCourseSearch('')
                                    setCourseKurumFilter('')
                                }} 
                                style={{ padding: '8px', background: '#f1f5f9' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.modalBody} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Search and Pill Filters Row */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input 
                                    type="text"
                                    placeholder="🔍 Eğitim adına göre ara..."
                                    value={courseSearch}
                                    onChange={(e) => setCourseSearch(e.target.value)}
                                    className={styles.formInput}
                                    style={{ padding: '12px 16px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                                    <button
                                        type="button"
                                        onClick={() => setCourseKurumFilter('')}
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            borderRadius: '20px',
                                            border: '1.5px solid',
                                            borderColor: courseKurumFilter === '' ? '#6366f1' : '#cbd5e1',
                                            background: courseKurumFilter === '' ? '#eff6ff' : 'white',
                                            color: courseKurumFilter === '' ? '#6366f1' : '#475569',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        🏛️ Tümü
                                    </button>
                                    {kurumlar.map(k => {
                                        const isActive = courseKurumFilter === k.slug
                                        return (
                                            <button
                                                key={k.slug}
                                                type="button"
                                                onClick={() => setCourseKurumFilter(k.slug)}
                                                style={{
                                                    padding: '6px 14px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    borderRadius: '20px',
                                                    border: '1.5px solid',
                                                    borderColor: isActive ? (k.color || '#6366f1') : '#cbd5e1',
                                                    background: isActive ? `${k.color}15` : 'white',
                                                    color: isActive ? (k.color || '#6366f1') : '#475569',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {k.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* List Container in Grid */}
                            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '4px' }}>
                                {(() => {
                                    const filtered = nonFeaturedProducts.filter(p => {
                                        const matchesSearch = p.name.toLowerCase().includes(courseSearch.toLowerCase())
                                        const matchesKurum = courseKurumFilter ? p.kurumSlug === courseKurumFilter : true
                                        return matchesSearch && matchesKurum
                                    })

                                    if (filtered.length === 0) {
                                        return (
                                            <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '13px', color: '#64748b', fontWeight: '500', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                                Eklenebilecek uygun eğitim bulunamadı.
                                            </div>
                                        )
                                    }

                                    return (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '12px' }}>
                                            {filtered.map(p => {
                                                const kurum = kurumlar.find(k => k.slug === p.kurumSlug)
                                                const isHovered = hoveredCourseId === p.id
                                                return (
                                                    <div 
                                                        key={p.id}
                                                        onMouseEnter={() => setHoveredCourseId(p.id)}
                                                        onMouseLeave={() => setHoveredCourseId(null)}
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between', 
                                                            padding: '14px 16px', 
                                                            border: '1px solid',
                                                            borderColor: isHovered ? '#6366f1' : '#e2e8f0',
                                                            borderRadius: '12px',
                                                            background: 'white',
                                                            boxShadow: isHovered ? '0 10px 20px -5px rgba(99, 102, 241, 0.12), 0 4px 6px -2px rgba(99, 102, 241, 0.05)' : '0 2px 4px rgba(0,0,0,0.02)',
                                                            transform: isHovered ? 'translateY(-2px)' : 'none',
                                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            cursor: 'default'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                                                            <div style={{ width: '36px', height: '48px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden', border: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                                {p.image ? (
                                                                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                                                ) : (
                                                                    <span style={{ fontSize: '14px' }}>📘</span>
                                                                )}
                                                            </div>
                                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', minWidth: 0 }}>
                                                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                    {p.name}
                                                                </span>
                                                                {kurum && (
                                                                    <span style={{ fontSize: '10px', color: kurum.color || '#6366f1', fontWeight: '700', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                        🏛️ {kurum.name}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                toggleFeatured(p.id)
                                                                triggerToast('Eğitim vitrine eklendi!')
                                                            }}
                                                            className="btn btn-sm btn-primary"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '11px', fontWeight: '800', flexShrink: 0, marginLeft: '12px' }}
                                                        >
                                                            <Plus size={12} /> Ekle
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                        <div className={styles.modalFooter} style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="button" 
                                className={styles.btnCancel} 
                                onClick={() => {
                                    setIsCourseModalOpen(false)
                                    setCourseSearch('')
                                    setCourseKurumFilter('')
                                }}
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* SUBCATEGORY SHOWCASE ADD MODAL */}
            {isSubcatModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer} style={{ maxWidth: '820px', width: '90%', borderRadius: '16px' }}>
                        <div className={styles.modalHeader} style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f172a', margin: '0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <FolderHeart size={18} fill="#ca8a04" color="#ca8a04" />
                                <span>VİTRİNE YENİ SINAV GRUBU EKLE</span>
                            </h2>
                            <button 
                                type="button" 
                                className={styles.modalCloseBtn} 
                                onClick={() => {
                                    setIsSubcatModalOpen(false)
                                    setSubcatSearch('')
                                    setSubcatKurumFilter('')
                                }} 
                                style={{ padding: '8px', background: '#f1f5f9' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div className={styles.modalBody} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Search and Pill Filters Row */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <input 
                                    type="text"
                                    placeholder="🔍 Sınav grubu adına göre ara..."
                                    value={subcatSearch}
                                    onChange={(e) => setSubcatSearch(e.target.value)}
                                    className={styles.formInput}
                                    style={{ padding: '12px 16px', fontSize: '13px', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                                />
                                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '6px', whiteSpace: 'nowrap', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
                                    <button
                                        type="button"
                                        onClick={() => setSubcatKurumFilter('')}
                                        style={{
                                            padding: '6px 14px',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            borderRadius: '20px',
                                            border: '1.5px solid',
                                            borderColor: subcatKurumFilter === '' ? '#6366f1' : '#cbd5e1',
                                            background: subcatKurumFilter === '' ? '#eff6ff' : 'white',
                                            color: subcatKurumFilter === '' ? '#6366f1' : '#475569',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s ease'
                                        }}
                                    >
                                        🏛️ Tümü
                                    </button>
                                    {kurumlar.map(k => {
                                        const isActive = subcatKurumFilter === k.slug
                                        return (
                                            <button
                                                key={k.slug}
                                                type="button"
                                                onClick={() => setSubcatKurumFilter(k.slug)}
                                                style={{
                                                    padding: '6px 14px',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    borderRadius: '20px',
                                                    border: '1.5px solid',
                                                    borderColor: isActive ? (k.color || '#6366f1') : '#cbd5e1',
                                                    background: isActive ? `${k.color}15` : 'white',
                                                    color: isActive ? (k.color || '#6366f1') : '#475569',
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease'
                                                }}
                                            >
                                                {k.name}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* List Container in Grid */}
                            <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '4px' }}>
                                {(() => {
                                    const filtered = nonFeaturedSubcats.filter(cat => {
                                        const matchesSearch = cat.name.toLowerCase().includes(subcatSearch.toLowerCase())
                                        const matchesKurum = subcatKurumFilter ? cat.kurumSlugs?.includes(subcatKurumFilter) : true
                                        return matchesSearch && matchesKurum
                                    })

                                    if (filtered.length === 0) {
                                        return (
                                            <div style={{ padding: '40px 20px', textAlign: 'center', fontSize: '13px', color: '#64748b', fontWeight: '500', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                                                Eklenebilecek uygun sınav grubu bulunamadı.
                                            </div>
                                        )
                                    }

                                    return (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '12px' }}>
                                            {filtered.map(cat => {
                                                const parentSlug = cat.kurumSlugs?.[0]
                                                const parentKurum = kurumlar.find(k => k.slug === parentSlug)
                                                const count = products.filter(p => p.status !== 'passive' && (p.altKategoriSlug === cat.slug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(cat.slug)))).length
                                                const isHovered = hoveredSubcatId === cat.id
                                                return (
                                                    <div 
                                                        key={cat.id}
                                                        onMouseEnter={() => setHoveredSubcatId(cat.id)}
                                                        onMouseLeave={() => setHoveredSubcatId(null)}
                                                        style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between', 
                                                            padding: '14px 16px', 
                                                            border: '1px solid',
                                                            borderColor: isHovered ? '#6366f1' : '#e2e8f0',
                                                            borderRadius: '12px',
                                                            background: 'white',
                                                            boxShadow: isHovered ? '0 10px 20px -5px rgba(99, 102, 241, 0.12), 0 4px 6px -2px rgba(99, 102, 241, 0.05)' : '0 2px 4px rgba(0,0,0,0.02)',
                                                            transform: isHovered ? 'translateY(-2px)' : 'none',
                                                            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                                            cursor: 'default'
                                                        }}
                                                    >
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', minWidth: 0, flex: 1 }}>
                                                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', lineHeight: '1.3', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {cat.name}
                                                            </span>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                {parentKurum && (
                                                                    <span style={{ fontSize: '10px', color: parentKurum.color || '#6366f1', fontWeight: '700', textTransform: 'uppercase' }}>
                                                                        🏛️ {parentKurum.name}
                                                                    </span>
                                                                )}
                                                                <span style={{ fontSize: '10px', color: '#64748b', fontWeight: '600', flexShrink: 0 }}>
                                                                    📚 {count} Eğitim
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                handleToggleShowOnHomepage(cat.id, true)
                                                            }}
                                                            className="btn btn-sm btn-primary"
                                                            style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', fontSize: '11px', fontWeight: '800', flexShrink: 0, marginLeft: '12px' }}
                                                        >
                                                            <Plus size={12} /> Ekle
                                                        </button>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )
                                })()}
                            </div>
                        </div>
                        <div className={styles.modalFooter} style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
                            <button 
                                type="button" 
                                className={styles.btnCancel} 
                                onClick={() => {
                                    setIsSubcatModalOpen(false)
                                    setSubcatSearch('')
                                    setSubcatKurumFilter('')
                                }}
                                style={{ padding: '8px 16px', fontSize: '12px' }}
                            >
                                Kapat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
