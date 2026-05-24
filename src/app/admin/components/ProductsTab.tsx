'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, Star, Edit3, Trash2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useApp, Product } from '@/context/AppContext'
import styles from '../page.module.css'

interface ProductsTabProps {
    triggerToast: (message: string) => void
    onAddProduct: () => void
    onEditProduct: (product: Product) => void
}

export default function ProductsTab({ triggerToast, onAddProduct, onEditProduct }: ProductsTabProps) {
    const { products, kurumlar, featuredIds, toggleFeatured, deleteProduct, triggerConfirm } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedKurum, setSelectedKurum] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10)

    // Reset current page when search query, selected institution or page limit changes
    useEffect(() => {
        setCurrentPage(1)
    }, [searchQuery, selectedKurum, itemsPerPage])


    const handleProductDelete = (id: string, name: string) => {
        triggerConfirm({
            title: 'Eğitimi Sil',
            message: `"${name}" eğitimini silmek istediğinize emin misiniz?`,
            confirmText: 'Eğitimi Sil',
            isDangerous: true,
            onConfirm: () => {
                deleteProduct(id)
                triggerToast('Eğitim silindi.')
            }
        })
    }

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesKurum = selectedKurum === 'all' || product.kurumSlug === selectedKurum
        const matchesSearch = 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
        return matchesKurum && matchesSearch
    })

    // Pagination Calculations
    const totalItems = filteredProducts.length
    const isAll = itemsPerPage === 'all'
    const limit = isAll ? totalItems : (itemsPerPage as number)
    const totalPages = isAll ? 1 : Math.ceil(totalItems / limit)

    // Slice products for current page
    const paginatedProducts = isAll 
        ? filteredProducts 
        : filteredProducts.slice((currentPage - 1) * limit, currentPage * limit)

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1
    const endItem = Math.min(currentPage * limit, totalItems)

    const getPageNumbers = () => {
        const pages = []
        const maxButtons = 5
        
        if (totalPages <= maxButtons) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            let start = Math.max(2, currentPage - 1)
            let end = Math.min(totalPages - 1, currentPage + 1)
            
            if (currentPage <= 2) {
                end = 4
            } else if (currentPage >= totalPages - 1) {
                start = totalPages - 3
            }
            
            if (start > 2) pages.push('ellipsis-start')
            for (let i = start; i <= end; i++) pages.push(i)
            if (end < totalPages - 1) pages.push('ellipsis-end')
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.filterControls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Eğitim, kanun adı veya açıklama ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <Search className={styles.searchIcon} size={16} />
                    </div>

                    <div className={styles.selectBox}>
                        <select
                            value={selectedKurum}
                            onChange={(e) => setSelectedKurum(e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="all">Tüm Kurumlar</option>
                            {kurumlar.map(k => (
                                <option key={k.slug} value={k.slug}>{k.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.selectBox} style={{ minWidth: '130px' }}>
                        <select
                            value={itemsPerPage}
                            onChange={(e) => {
                                const val = e.target.value
                                setItemsPerPage(val === 'all' ? 'all' : parseInt(val))
                            }}
                            className={styles.selectInput}
                            title="Sayfa Başına Gösterilecek Eğitim Sayısı"
                        >
                            <option value={10}>10 Eğitim Göster</option>
                            <option value={20}>20 Eğitim Göster</option>
                            <option value={30}>30 Eğitim Göster</option>
                            <option value={50}>50 Eğitim Göster</option>
                            <option value="all">Tümünü Göster</option>
                        </select>
                    </div>
                </div>

                <button className={styles.btnAddItem} onClick={onAddProduct}>
                    <Plus size={16} />
                    <span>Yeni Eğitim Ekle</span>
                </button>
            </div>

            {/* Table View */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader}>
                    <div className={styles.colName}>EĞİTİM ADI / KURUM</div>
                    <div className={styles.colCategory}>TÜRÜ</div>
                    <div className={styles.colPrice}>FİYAT</div>
                    <div className={styles.colAction} style={{ justifyContent: 'center' }}>İŞLEMLER</div>
                </div>

                <div className={styles.tableBody}>
                    {paginatedProducts.map(product => {
                        const isFeatured = featuredIds.includes(product.id)
                        return (
                             <div key={product.id} className={`${styles.tableRow} ${isFeatured ? styles.rowFeatured : ''}`}>
                                 <div className={styles.colName}>
                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                         <span style={{ fontSize: '10px', background: '#cbd5e1', color: '#1e293b', padding: '1px 5px', borderRadius: '4px', fontWeight: '800', fontFamily: 'monospace' }} title="Görüntüleme Sırası">
                                             Sıra #{product.order !== undefined ? product.order : 9999}
                                         </span>
                                         <div className={styles.productName} style={{ fontWeight: '700' }}>{product.name}</div>
                                     </div>
                                     <div className={styles.productKurum}>
                                         {kurumlar.find(k => k.slug === product.kurumSlug)?.name || product.kurumSlug}
                                     </div>
                                 </div>
                                <div className={styles.colCategory}>
                                    <span className={styles.catBadge}>{product.categoryName}</span>
                                </div>
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
                                <div className={styles.colAction}>
                                    <button 
                                        className={`${styles.starBtn} ${isFeatured ? styles.starActive : ''}`}
                                        onClick={() => {
                                            toggleFeatured(product.id)
                                            triggerToast(isFeatured ? 'Öne çıkarma kaldırıldı' : 'Öne çıkarıldı!')
                                        }}
                                        title={isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                                    >
                                        <Star size={14} fill={isFeatured ? "currentColor" : "none"} />
                                    </button>
                                    <button 
                                        className={styles.actionEditBtn}
                                        onClick={() => onEditProduct(product)}
                                        title="Eğitimi Düzenle"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button 
                                        className={styles.actionDeleteBtn}
                                        onClick={() => handleProductDelete(product.id, product.name)}
                                        title="Eğitimi Sil"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        )
                    })}

                    {filteredProducts.length === 0 && (
                        <div className={styles.emptyTable}>
                            <AlertCircle size={36} className={styles.emptyIcon} />
                            <h3>Eğitim Bulunamadı</h3>
                            <p>Arama veya filtre kriterlerinizle eşleşen bir ders bulunmamaktadır.</p>
                        </div>
                    )}
                </div>

                {/* Premium Neo-Brutalist Pagination Footer */}
                {filteredProducts.length > 0 && (
                    <div className={styles.paginationContainer}>
                        <div className={styles.paginationInfo}>
                            {totalItems} eğitimden {startItem}-{endItem} arası listeleniyor
                        </div>
                        
                        <div className={styles.paginationControls}>
                            <button
                                type="button"
                                className={`${styles.pageBtn} ${currentPage === 1 ? styles.pageBtnDisabled : ''}`}
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                title="Önceki Sayfa"
                            >
                                <ChevronLeft size={15} strokeWidth={2.5} />
                            </button>
                            
                            {getPageNumbers().map((p, idx) => {
                                if (p === 'ellipsis-start' || p === 'ellipsis-end') {
                                    return (
                                        <span key={`ellipsis-${idx}`} style={{ padding: '0 4px', color: '#94a3b8', fontWeight: '800', fontSize: '12px' }}>
                                            ...
                                        </span>
                                    )
                                }
                                return (
                                    <button
                                        type="button"
                                        key={p}
                                        className={`${styles.pageBtn} ${currentPage === p ? styles.pageBtnActive : ''}`}
                                        onClick={() => setCurrentPage(p as number)}
                                    >
                                        {p}
                                    </button>
                                )
                            })}
                            
                            <button
                                type="button"
                                className={`${styles.pageBtn} ${currentPage === totalPages ? styles.pageBtnDisabled : ''}`}
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                title="Sonraki Sayfa"
                            >
                                <ChevronRight size={15} strokeWidth={2.5} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
