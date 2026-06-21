'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Star, ChevronUp, ChevronDown, Trash2, Sparkles, AlertCircle, Plus, ChevronDown as ChevronDownIcon } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import styles from '../page.module.css'

interface FeaturedTabProps {
    triggerToast: (message: string) => void
}

export default function FeaturedTab({ triggerToast }: FeaturedTabProps) {
    const { products, kurumlar, featuredIds, toggleFeatured, updateMultipleProducts } = useApp()
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Close dropdown when clicked outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Filter active featured products (automatically sorted in AppContext)
    const featuredProducts = products.filter(product => featuredIds.includes(product.id))

    // Filter available products that are not yet featured
    const nonFeaturedProducts = products.filter(product => !featuredIds.includes(product.id))

    const handleMoveUp = (index: number) => {
        if (index === 0) return
        
        // Assign sequential, distinct orders to all featured products, swapping index and index-1
        const updates = featuredProducts.map((p, idx) => {
            let targetOrder = idx + 1
            if (idx === index) {
                targetOrder = index // Moves to the order of the one above it
            } else if (idx === index - 1) {
                targetOrder = index + 1 // Moves to the order of the current one
            }
            return { id: p.id, fields: { order: targetOrder } }
        })

        updateMultipleProducts(updates)
        triggerToast('Sıralama yukarı taşındı.')
    }

    const handleMoveDown = (index: number) => {
        if (index === featuredProducts.length - 1) return
        
        // Assign sequential, distinct orders to all featured products, swapping index and index+1
        const updates = featuredProducts.map((p, idx) => {
            let targetOrder = idx + 1
            if (idx === index) {
                targetOrder = index + 2 // Moves to the order of the one below it
            } else if (idx === index + 1) {
                targetOrder = index + 1 // Moves to the order of the current one
            }
            return { id: p.id, fields: { order: targetOrder } }
        })

        updateMultipleProducts(updates)
        triggerToast('Sıralama aşağı taşındı.')
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
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

                {/* Quick Add Custom Dropdown */}
                <div ref={dropdownRef} style={{ position: 'relative', minWidth: '280px' }}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="btn btn-primary"
                        style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', fontSize: '13px', fontWeight: '700' }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={16} /> Vitrine Yeni Eğitim Ekle
                        </span>
                        <ChevronDownIcon size={16} style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </button>

                    {isDropdownOpen && (
                        <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', zIndex: 20, maxHeight: '250px', overflowY: 'auto', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}>
                            {nonFeaturedProducts.length === 0 ? (
                                <div style={{ padding: '16px', fontSize: '13px', color: '#64748b', textAlign: 'center', fontWeight: '500' }}>
                                    Eklenebilecek tüm eğitimler zaten vitrinde.
                                </div>
                            ) : (
                                nonFeaturedProducts.map(p => (
                                    <div 
                                        key={p.id} 
                                        onClick={() => {
                                            toggleFeatured(p.id)
                                            triggerToast('Eğitim başarıyla vitrine eklendi!')
                                            setIsDropdownOpen(false)
                                        }}
                                        style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: '13px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'background 0.2s', fontWeight: '600', color: '#1e293b' }}
                                        onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                                    >
                                        {p.name}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Grid Symmetry Warning Box */}
            {featuredProducts.length > 0 && featuredProducts.length % 3 !== 0 && (
                <div className={styles.symmetryTipBox}>
                    <Sparkles size={18} style={{ flexShrink: 0 }} />
                    <span>💡 Tavsiye: Ana sayfa görünümünün simetrik ve dengeli durması için vitrine 3'ün katı kadar (Örn: 3, 6, 9) eğitim eklemeniz önerilir. (Şu an aktif: {featuredProducts.length} eğitim)</span>
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
                                <div className={styles.colName}>
                                    <div className={styles.productName} style={{ fontWeight: '700' }}>{product.name}</div>
                                    <div className={styles.productKurum}>
                                        {kurumlar.find(k => k.slug === product.kurumSlug)?.name || product.kurumSlug}
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
        </div>
    )
}
