'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingCart, ArrowRight, X, Check } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useApp, Coupon } from '@/context/AppContext'
import styles from './page.module.css'

export default function CartPage() {
    const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCartStore()
    const { coupons, addOrder, useCoupon, products, useProductCoupon } = useApp()
    
    const [couponCode, setCouponCode] = useState('')
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null)
    const [couponError, setCouponError] = useState('')
    const [couponSuccess, setCouponSuccess] = useState('')

    // Checkout modal states
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [customerName, setCustomerName] = useState('')
    const [customerEmail, setCustomerEmail] = useState('')
    const [customerPhone, setCustomerPhone] = useState('')

    const totalPrice = getTotalPrice()

    // Calculate Discount
    let discountAmount = 0
    if (appliedCoupon) {
        if ((appliedCoupon as any).isProductExclusive) {
            const item = items.find(i => i.id === (appliedCoupon as any).targetProductId)
            if (item) {
                const itemTotal = (item.salePrice || item.price) * item.quantity
                discountAmount = appliedCoupon.discountType === 'percentage'
                    ? itemTotal * (appliedCoupon.discountValue / 100)
                    : Math.min(itemTotal, appliedCoupon.discountValue)
            }
        } else {
            discountAmount = appliedCoupon.discountType === 'percentage'
                ? totalPrice * (appliedCoupon.discountValue / 100)
                : Math.min(totalPrice, appliedCoupon.discountValue)
        }
    }
    const discountedPrice = totalPrice - discountAmount
    const vat = discountedPrice * 0.18 // KDV %18 applied on discounted price
    const finalTotal = discountedPrice + vat

    const handleApplyCoupon = () => {
        setCouponError('')
        setCouponSuccess('')

        if (!couponCode.trim()) {
            setCouponError('Lütfen bir kupon kodu girin.')
            return
        }

        // 1. Search in global coupons
        let foundCoupon: any = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
        let isProductExclusive = false
        let targetProductId = ''

        // 2. Search in product-exclusive coupons of cart items
        if (!foundCoupon) {
            for (const item of items) {
                const prod = products.find(p => p.id === item.id)
                if (prod && prod.exclusiveCouponsList) {
                    const excCoupon = prod.exclusiveCouponsList.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase())
                    if (excCoupon) {
                        foundCoupon = {
                            id: excCoupon.id,
                            code: excCoupon.code,
                            discountType: excCoupon.discountType,
                            discountValue: excCoupon.discountValue,
                            maxUses: excCoupon.maxUses,
                            usedCount: excCoupon.usedCount,
                            description: excCoupon.description
                        }
                        isProductExclusive = true
                        targetProductId = item.id
                        break
                    }
                }
            }
        }

        if (foundCoupon) {
            if (foundCoupon.maxUses !== undefined && foundCoupon.usedCount >= foundCoupon.maxUses) {
                setCouponError('Bu kuponun maksimum kullanım sınırına ulaşıldı.')
                return
            }

            setAppliedCoupon({
                ...foundCoupon,
                isProductExclusive,
                targetProductId
            } as any)
            
            const displayValue = foundCoupon.discountType === 'fixed' 
                ? `${foundCoupon.discountValue} ₺` 
                : `%${foundCoupon.discountValue}`
            
            if (isProductExclusive) {
                const matchedItem = items.find(i => i.id === targetProductId)
                setCouponSuccess(`${matchedItem ? matchedItem.name.substring(0, 25) + '... ' : ''}için ${displayValue} Özel İndirim Uygulandı!`)
            } else {
                setCouponSuccess(`${displayValue} İndirim Uygulandı!`)
            }
        } else {
            setCouponError('Geçersiz veya süresi dolmuş kupon kodu.')
            setAppliedCoupon(null)
        }
    }

    const removeCoupon = () => {
        setAppliedCoupon(null)
        setCouponCode('')
        setCouponSuccess('')
    }

    const handleCheckoutSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!customerName || !customerEmail || !customerPhone) {
            alert('Lütfen formdaki tüm zorunlu alanları doldurun.')
            return
        }

        const orderItems = items.map(item => ({
            id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            productId: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        }))

        const newOrder = {
            id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
            customerName: customerName.trim(),
            customerEmail: customerEmail.trim(),
            customerPhone: customerPhone.trim(),
            items: orderItems,
            subTotal: totalPrice,
            discount: discountAmount,
            tax: vat,
            total: finalTotal,
            status: 'PENDING' as const,
            createdAt: new Date().toISOString()
        }

        addOrder(newOrder)
        if (appliedCoupon) {
            if ((appliedCoupon as any).isProductExclusive) {
                useProductCoupon((appliedCoupon as any).targetProductId, appliedCoupon.code)
            } else {
                useCoupon(appliedCoupon.code)
            }
        }
        setIsSuccess(true)
        clearCart()
    }

    if (items.length === 0 && !isSuccess) {
        return (
            <div className="container section">
                <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>
                        <ShoppingCart size={64} color="var(--text-muted)" />
                    </div>
                    <h2>Sepetiniz Boş</h2>
                    <p>Henüz herhangi bir eğitim seti eklemediniz.</p>
                    <Link href="/products" className="btn btn-primary btn-lg">
                        Alışverişe Başla
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="container section">
            {isSuccess ? (
                <div className={styles.successScreen}>
                    <div className={styles.successIcon}>
                        <Check size={40} />
                    </div>
                    <h2>Siparişiniz Başarıyla Alındı!</h2>
                    <p style={{ maxWidth: '450px', color: 'var(--text-secondary)' }}>
                        Eğitim setleriniz ve aktivasyon detayları kısa süre içerisinde kayıtlı e-posta adresinize gönderilecektir. Bizi tercih ettiğiniz için teşekkür ederiz!
                    </p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: 'var(--space-md)' }}>
                        Ana Sayfaya Dön
                    </Link>
                </div>
            ) : (
                <>
                    <h1 className={styles.pageTitle}>Alışveriş Sepeti ({items.length} Ürün)</h1>

                    <div className={styles.layout}>
                        {/* Items */}
                        <div className={styles.itemsColumn}>
                            <div className={styles.tableHeader}>
                                <span>Ürün</span>
                                <span>Fiyat</span>
                                <span>Adet</span>
                                <span>Toplam</span>
                                <span></span>
                            </div>

                            <AnimatePresence>
                                {items.map(item => (
                                    <motion.div
                                        key={item.id}
                                        className={styles.cartItem}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                    >
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemImage}>
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        width={60}
                                                        height={80}
                                                        style={{ objectFit: 'cover', borderRadius: '4px' }}
                                                    />
                                                ) : (
                                                    <span style={{ fontSize: '1.5rem' }}>📘</span>
                                                )}
                                            </div>
                                            <div className={styles.itemMeta}>
                                                <span className={styles.itemName}>{item.name}</span>
                                                <span className={styles.itemSlug}>{item.categoryName || 'Eğitim Seti'}</span>
                                            </div>
                                        </div>

                                        <div className={styles.itemPrice}>
                                            {(item.salePrice || item.price).toLocaleString('tr-TR')} ₺
                                        </div>

                                        <div className={styles.itemQuantity}>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>

                                        <div className={styles.itemTotal}>
                                            {((item.salePrice || item.price) * item.quantity).toLocaleString('tr-TR')} ₺
                                        </div>

                                        <button className={styles.removeBtn} onClick={() => removeItem(item.id)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Summary */}
                        <div className={styles.summaryColumn}>
                            <div className={styles.summaryCard}>
                                <h3>Sipariş Özeti</h3>

                                <div className={styles.couponSection}>
                                    <div className={styles.couponInputWrapper}>
                                        <input
                                            type="text"
                                            placeholder="Kupon Kodu"
                                            className="input"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value)}
                                            disabled={!!appliedCoupon}
                                        />
                                        {appliedCoupon ? (
                                            <button className="btn btn-outline btn-sm" onClick={removeCoupon}>Kaldır</button>
                                        ) : (
                                            <button className="btn btn-secondary btn-sm" onClick={handleApplyCoupon}>Uygula</button>
                                        )}
                                    </div>
                                    {couponError && <p className={styles.couponError}>{couponError}</p>}
                                    {couponSuccess && <p className={styles.couponSuccess}>{couponSuccess}</p>}
                                </div>

                                <div className={styles.summaryDivider}></div>

                                <div className={styles.summaryRow}>
                                    <span>Ara Toplam</span>
                                    <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
                                </div>

                                {appliedCoupon && (
                                    <div className={`${styles.summaryRow} ${styles.discountRow}`}>
                                        <span>İndirim ({appliedCoupon.code})</span>
                                        <span>-{discountAmount.toLocaleString('tr-TR')} ₺</span>
                                    </div>
                                )}

                                <div className={styles.summaryRow}>
                                    <span>KDV (%18)</span>
                                    <span>{vat.toLocaleString('tr-TR')} ₺</span>
                                </div>

                                <div className={styles.summaryTotal}>
                                    <span>Genel Toplam</span>
                                    <span>{finalTotal.toLocaleString('tr-TR')} ₺</span>
                                </div>

                                <button 
                                    className={`btn btn-primary btn-lg ${styles.checkoutBtn}`}
                                    onClick={() => setIsCheckoutOpen(true)}
                                >
                                    Ödemeye Geç <ArrowRight size={20} />
                                </button>

                                <div className={styles.secureBadge}>
                                    🔒 Güvenli Ödeme SSL ile korunmaktadır.
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* CHECKOUT MODAL */}
            {isCheckoutOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContainer}>
                        <div className={styles.modalHeader}>
                            <h2>GÜVENLİ ÖDEME & SİPARİŞ</h2>
                            <button className={styles.modalCloseBtn} onClick={() => setIsCheckoutOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleCheckoutSubmit}>
                            <div className={styles.modalBody}>
                                <div className={styles.checkoutForm}>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="cust-name">Ad Soyad *</label>
                                        <input 
                                            id="cust-name"
                                            type="text" 
                                            required
                                            className="input"
                                            value={customerName}
                                            onChange={(e) => setCustomerName(e.target.value)}
                                            placeholder="Örn: Rüstem Rakıncık"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="cust-email">E-posta Adresi *</label>
                                        <input 
                                            id="cust-email"
                                            type="email" 
                                            required
                                            className="input"
                                            value={customerEmail}
                                            onChange={(e) => setCustomerEmail(e.target.value)}
                                            placeholder="ornek@email.com"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="cust-phone">Telefon Numarası *</label>
                                        <input 
                                            id="cust-phone"
                                            type="tel" 
                                            required
                                            className="input"
                                            value={customerPhone}
                                            onChange={(e) => setCustomerPhone(e.target.value)}
                                            placeholder="05XX XXX XX XX"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.modalFooter}>
                                <button type="button" className={styles.btnCancel} onClick={() => setIsCheckoutOpen(false)}>
                                    İPTAL
                                </button>
                                <button type="submit" className="btn btn-primary" style={{ marginTop: 0 }}>
                                    <Check size={16} />
                                    <span>Ödemeyi Tamamla ({finalTotal.toLocaleString('tr-TR')} ₺)</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
