'use client'

import React, { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import styles from './CartSidebar.module.css'

export default function CartSidebar() {
    const {
        isOpen,
        toggleCart,
        items,
        removeItem,
        updateQuantity,
        getTotalPrice
    } = useCartStore()

    // Prevent body scroll when cart is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    return (
        <>
            {/* Backdrop */}
            <div
                className={`${styles.overlay} ${isOpen ? styles.open : ''}`}
                onClick={toggleCart}
            />

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <div className={styles.title}>
                        <ShoppingCart size={24} />
                        Sepetim ({items.length})
                    </div>
                    <button className={styles.closeButton} onClick={toggleCart}>
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.items}>
                    {items.length === 0 ? (
                        <div className={styles.emptyState}>
                            <ShoppingCart size={48} opacity={0.2} />
                            <p>Sepetiniz henüz boş.</p>
                            <button className="btn btn-primary" onClick={toggleCart}>
                                Alışverişe Başla
                            </button>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemImage}>
                                    {item.image ? (
                                        <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: '#eee' }} />
                                    )}
                                </div>
                                <div className={styles.itemContent}>
                                    <div>
                                        <h4 className={styles.itemName}>{item.name}</h4>
                                        <span className={styles.itemPrice}>
                                            {(item.salePrice || item.price).toLocaleString('tr-TR')} ₺
                                        </span>
                                    </div>
                                    <div className={styles.itemActions}>
                                        <div className={styles.quantityControls}>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className={styles.qtyValue}>{item.quantity}</span>
                                            <button
                                                className={styles.qtyBtn}
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>
                                        <button
                                            className={styles.removeBtn}
                                            onClick={() => removeItem(item.id)}
                                        >
                                            Kaldır
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.subtotal}>
                            <span className={styles.subtotalLabel}>Ara Toplam</span>
                            <span className={styles.subtotalValue}>
                                {getTotalPrice().toLocaleString('tr-TR')} ₺
                            </span>
                        </div>
                        <Link href="/cart" className={styles.checkoutButton} onClick={toggleCart}>
                            Sepeti Onayla
                            <ArrowRight size={20} />
                        </Link>
                    </div>
                )}
            </aside>
        </>
    )
}
