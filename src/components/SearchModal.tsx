'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, X, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useUIStore } from '@/stores/uiStore'
import { allProducts } from '@/data/products'
import styles from './SearchModal.module.css'

export default function SearchModal() {
    const { isSearchOpen, closeSearch } = useUIStore()
    const [query, setQuery] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    // Focus input on open
    useEffect(() => {
        if (isSearchOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100)
        }
    }, [isSearchOpen])

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeSearch()
            // Optional: Ctrl+K to open (handled in layout or here if mounted)
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [closeSearch])

    // Filter products
    const filteredProducts = query.trim() === ''
        ? []
        : allProducts.filter(product =>
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.categoryName.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5) // Limit to 5 results

    if (!isSearchOpen) return null

    return (
        <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && closeSearch()}>
            <div className={styles.modal}>
                {/* Header */}
                <div className={styles.searchHeader}>
                    <Search className={styles.searchIcon} size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Ürün, kategori veya içerik ara..."
                        className={styles.searchInput}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <div className={styles.shortcut}>ESC</div>
                </div>

                {/* Results */}
                <div className={styles.results}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <Link
                                key={product.id}
                                href={`/products/${product.slug}`}
                                className={styles.resultItem}
                                onClick={closeSearch}
                            >
                                <div className={styles.resultImage}>
                                    {product.image && (
                                        <Image src={product.image} alt={product.name} fill style={{ objectFit: 'cover', borderRadius: '4px' }} />
                                    )}
                                </div>
                                <div className={styles.resultInfo} style={{ flex: 1 }}>
                                    <h4>{product.name}</h4>
                                    <span className={styles.resultCategory} style={{ fontSize: '12px', color: '#94a3b8' }}>
                                        {product.categoryName}
                                    </span>
                                </div>
                                <div className={styles.resultPrice}>
                                    {(product.salePrice || product.price).toLocaleString('tr-TR')} ₺
                                </div>
                                <ChevronRight size={16} color="#cbd5e1" />
                            </Link>
                        ))
                    ) : query.trim() !== '' ? (
                        <div className={styles.emptyState}>
                            <p>Sonuç bulunamadı: "{query}"</p>
                        </div>
                    ) : (
                        <div className={styles.emptyState} style={{ opacity: 0.5 }}>
                            <p>Aramaya başlamak için yazın...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
