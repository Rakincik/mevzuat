'use client'

import React, { useState } from 'react'
import { Percent, Trash2, AlertCircle, Plus } from 'lucide-react'
import { useApp, Coupon } from '@/context/AppContext'
import styles from '../page.module.css'

interface CouponsTabProps {
    triggerToast: (message: string) => void
}

export default function CouponsTab({ triggerToast }: CouponsTabProps) {
    const { coupons, addCoupon, deleteCoupon, triggerConfirm, products, updateProduct } = useApp()
    const [couponForm, setCouponForm] = useState({
        code: '',
        discountType: 'percentage' as 'percentage' | 'fixed',
        discountValue: '',
        maxUses: '',
        description: ''
    })

    const handleCouponSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!couponForm.code.trim() || !couponForm.discountValue) {
            alert('Lütfen en az kupon kodu ve indirim değeri alanlarını doldurun.')
            return
        }

        const value = parseFloat(couponForm.discountValue)
        if (isNaN(value) || value <= 0) {
            alert('Lütfen geçerli bir indirim değeri girin.')
            return
        }

        if (couponForm.discountType === 'percentage' && value > 100) {
            alert('Yüzdesel indirim oranı %100\'den fazla olamaz.')
            return
        }

        const maxUsesVal = couponForm.maxUses.trim() ? parseInt(couponForm.maxUses) : undefined
        if (maxUsesVal !== undefined && (isNaN(maxUsesVal) || maxUsesVal <= 0)) {
            alert('Lütfen geçerli bir maksimum kullanım sınırı girin.')
            return
        }

        const defaultDesc = couponForm.discountType === 'percentage'
            ? `Tüm sepetlerde %${value} indirim`
            : `Tüm sepetlerde ${value} ₺ sabit indirim`

        const newCoupon: Coupon = {
            id: 'coupon_' + Date.now(),
            code: couponForm.code.trim().toUpperCase(),
            discountType: couponForm.discountType,
            discountValue: value,
            maxUses: maxUsesVal,
            usedCount: 0,
            description: couponForm.description.trim() || defaultDesc
        }

        addCoupon(newCoupon)
        setCouponForm({ code: '', discountType: 'percentage', discountValue: '', maxUses: '', description: '' })
        triggerToast('Yeni indirim kuponu tanımlandı!')
    }

    // Gather product-exclusive coupons
    const productExclusiveCoupons = products.reduce((acc, product) => {
        if (product.exclusiveCouponsList && product.exclusiveCouponsList.length > 0) {
            product.exclusiveCouponsList.forEach(coupon => {
                acc.push({
                    ...coupon,
                    isProductExclusive: true,
                    productName: product.name,
                    productId: product.id
                })
            })
        }
        return acc
    }, [] as any[])

    const handleCouponDelete = (id: string, code: string) => {
        triggerConfirm({
            title: 'Kuponu İptal Et',
            message: `"${code}" indirim kuponunu iptal etmek istediğinize emin misiniz?`,
            confirmText: 'Kuponu Sil',
            cancelText: 'Vazgeç',
            isDangerous: true,
            onConfirm: () => {
                deleteCoupon(id)
                triggerToast('Kupon silindi.')
            }
        })
    }

    const handleProductCouponDelete = (productId: string, couponId: string, code: string) => {
        triggerConfirm({
            title: 'Kuponu İptal Et',
            message: `"${code}" ürüne özel indirim kuponunu iptal etmek istediğinize emin misiniz?`,
            confirmText: 'Kuponu Sil',
            cancelText: 'Vazgeç',
            isDangerous: true,
            onConfirm: () => {
                const product = products.find(p => p.id === productId)
                if (product && product.exclusiveCouponsList) {
                    const updatedList = product.exclusiveCouponsList.filter(c => c.id !== couponId)
                    const codes = updatedList.map(c => c.code).join(', ')
                    updateProduct(productId, {
                        exclusiveCouponsList: updatedList,
                        exclusiveCoupons: codes
                    })
                    triggerToast('Ürüne özel kupon silindi.')
                }
            }
        })
    }

    return (
        <div className={styles.bentoGrid}>
            {/* Add Coupon */}
            <div className={styles.bentoCard}>
                <h2 className={styles.cardTitle}>
                    <Percent size={18} />
                    <span>Yeni İndirim Kuponu Ekle</span>
                </h2>
                <p className={styles.cardDesc}>Sepet sayfasında uygulanacak dinamik indirim kuponları tanımlayın.</p>
                
                <form onSubmit={handleCouponSubmit} className={styles.adminForm}>
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="coup-code">Kupon Kodu *</label>
                            <input 
                                id="coup-code"
                                type="text" 
                                required
                                value={couponForm.code}
                                onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                                className={styles.formInput}
                                placeholder="Örn: YAZFIRSATI"
                                style={{ textTransform: 'uppercase' }}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="coup-type">İndirim Türü *</label>
                            <select
                                id="coup-type"
                                value={couponForm.discountType}
                                onChange={(e) => setCouponForm({ ...couponForm, discountType: e.target.value as 'percentage' | 'fixed' })}
                                className={styles.formSelect}
                            >
                                <option value="percentage">% Yüzdesel İndirim</option>
                                <option value="fixed">₺ Sabit Tutar İndirimi</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="coup-val">İndirim Miktarı *</label>
                            <input 
                                id="coup-val"
                                type="number" 
                                required
                                min="1"
                                value={couponForm.discountValue}
                                onChange={(e) => setCouponForm({ ...couponForm, discountValue: e.target.value })}
                                className={styles.formInput}
                                placeholder={couponForm.discountType === 'percentage' ? 'Örn: 25 (%25)' : 'Örn: 150 (150 ₺)'}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="coup-max">Maksimum Kullanım Sınırı (Boşsa Sınırsız)</label>
                            <input 
                                id="coup-max"
                                type="number" 
                                min="1"
                                value={couponForm.maxUses}
                                onChange={(e) => setCouponForm({ ...couponForm, maxUses: e.target.value })}
                                className={styles.formInput}
                                placeholder="Örn: 100"
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="coup-desc">Kupon Açıklaması (İsteğe Bağlı)</label>
                        <input 
                            id="coup-desc"
                            type="text" 
                            value={couponForm.description}
                            onChange={(e) => setCouponForm({ ...couponForm, description: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: Tüm sepetlerde geçerli 150 ₺ indirim"
                        />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                        <Plus size={16} />
                        <span>Kupon Oluştur</span>
                    </button>
                </form>
            </div>

            {/* Active Coupons Grid */}
            <div className={styles.bentoCard} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                    <h2 className={styles.cardTitle}>
                        <Percent size={18} />
                        <span>Kupon Yönetim Paneli</span>
                    </h2>
                    <p className={styles.cardDesc}>Sistemde tanımlı tüm genel ve ürüne özel indirim kodları.</p>
                </div>

                {/* Sub-section 1: Global Coupons */}
                <div>
                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>
                        <span>🌐 GENEL (GLOBAL) KUPONLAR</span>
                        <span style={{ fontSize: '11px', background: '#cbd5e1', color: '#334155', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{coupons.length}</span>
                    </h3>
                    
                    <div className={styles.couponGrid}>
                        {coupons.map(coupon => {
                            const type = coupon.discountType || 'percentage'
                            const val = coupon.discountValue !== undefined ? coupon.discountValue : ((coupon as any).discountRate ? (coupon as any).discountRate * 100 : 0)
                            const displayRate = type === 'percentage' ? `%${val} İndirim` : `${val} ₺ İndirim`
                            const usesLimitText = coupon.maxUses 
                                ? `${coupon.usedCount} / ${coupon.maxUses} Kullanım` 
                                : `${coupon.usedCount} Kullanım (Sınırsız)`

                            return (
                                <div key={coupon.id} className={styles.couponCard}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span className={styles.couponCodeBadge}>{coupon.code}</span>
                                            <span style={{ fontSize: '10px', padding: '2px 6px', background: type === 'percentage' ? '#eff6ff' : '#ecfdf5', color: type === 'percentage' ? '#2563eb' : '#10b981', borderRadius: '4px', fontWeight: 'bold' }}>
                                                {type === 'percentage' ? 'Yüzdesel' : 'Sabit'}
                                            </span>
                                        </div>
                                        <div className={styles.couponRate}>{displayRate}</div>
                                        <div className={styles.couponDesc} style={{ margin: '4px 0 8px 0' }}>{coupon.description}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span>📊 {usesLimitText}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className={styles.actionDeleteBtn}
                                        onClick={() => handleCouponDelete(coupon.id, coupon.code)}
                                        title="Kuponu İptal Et"
                                        style={{ padding: '6px', alignSelf: 'flex-start' }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            )
                        })}

                        {coupons.length === 0 && (
                            <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
                                Aktif genel indirim kuponu bulunmamaktadır. Sol taraftan hemen oluşturun.
                            </div>
                        )}
                    </div>
                </div>

                {/* Sub-section 2: Product Exclusive Coupons */}
                <div style={{ marginTop: '10px' }}>
                    <h3 style={{ fontSize: '13px', fontWeight: '800', color: '#475569', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px' }}>
                        <span>🎟️ ÜRÜNE ÖZEL KUPONLAR</span>
                        <span style={{ fontSize: '11px', background: '#cbd5e1', color: '#334155', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{productExclusiveCoupons.length}</span>
                    </h3>
                    
                    <div className={styles.couponGrid}>
                        {productExclusiveCoupons.map(coupon => {
                            const type = coupon.discountType || 'percentage'
                            const val = coupon.discountValue
                            const displayRate = type === 'percentage' ? `%${val} İndirim` : `${val} ₺ İndirim`
                            const usesLimitText = coupon.maxUses 
                                ? `${coupon.usedCount} / ${coupon.maxUses} Kullanım` 
                                : `${coupon.usedCount} Kullanım (Sınırsız)`

                            return (
                                <div key={coupon.id} className={styles.couponCard} style={{ borderLeft: '4px solid #8b5cf6' }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <span className={styles.couponCodeBadge} style={{ background: '#f3e8ff', color: '#6b21a8' }}>{coupon.code}</span>
                                            <span style={{ fontSize: '10px', padding: '2px 6px', background: type === 'percentage' ? '#eff6ff' : '#ecfdf5', color: type === 'percentage' ? '#2563eb' : '#10b981', borderRadius: '4px', fontWeight: 'bold' }}>
                                                {type === 'percentage' ? 'Yüzdesel' : 'Sabit'}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#6b21a8', fontWeight: '800', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                            📦 Ürün: {coupon.productName}
                                        </div>
                                        <div className={styles.couponRate}>{displayRate}</div>
                                        <div className={styles.couponDesc} style={{ margin: '4px 0 8px 0' }}>{coupon.description}</div>
                                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <span>📊 {usesLimitText}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className={styles.actionDeleteBtn}
                                        onClick={() => handleProductCouponDelete(coupon.productId, coupon.id, coupon.code)}
                                        title="Kuponu İptal Et"
                                        style={{ padding: '6px', alignSelf: 'flex-start' }}
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                </div>
                            )
                        })}

                        {productExclusiveCoupons.length === 0 && (
                            <div style={{ padding: '1.5rem', border: '2px dashed #e2e8f0', borderRadius: '8px', textAlign: 'center', color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>
                                Ürüne özel tanımlanmış kupon bulunmamaktadır. Eğitim Yönetimi panelinden ekleyebilirsiniz.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
