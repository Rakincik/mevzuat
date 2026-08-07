'use client'

import React, { useState, useEffect } from 'react'
import { Search, Plus, Star, Edit3, Trash2, AlertCircle, ChevronLeft, ChevronRight, Copy } from 'lucide-react'
import { useApp, Product } from '@/context/AppContext'
import { CustomSelect } from './CustomSelect'
import styles from '../page.module.css'

interface ProductsTabProps {
    triggerToast: (message: string) => void
    onAddProduct: () => void
    onEditProduct: (product: Product) => void
}

export default function ProductsTab({ triggerToast, onAddProduct, onEditProduct }: ProductsTabProps) {
    const { products, kurumlar, featuredIds, toggleFeatured, deleteProduct, triggerConfirm, bulkDeleteProducts, addProduct } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedKurum, setSelectedKurum] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(10)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Reset current page and selections when search query, selected institution or page limit changes
    useEffect(() => {
        setCurrentPage(1)
        setSelectedIds([])
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

    const handleProductDuplicate = (product: Product) => {
        const clonedProduct: Product = {
            ...product,
            id: 'prod_' + Date.now(),
            name: `${product.name} (Kopya)`,
            slug: `${product.slug}-kopya`,
            isFeatured: false,
            order: (product.order ?? 9999) + 1
        }
        addProduct(clonedProduct)
        triggerToast('Eğitim başarıyla kopyalandı! Düzenlemek için tıklayabilirsiniz.')
    }

    // Filter logic
    const filteredProducts = products.filter(product => {
        const matchesKurum = selectedKurum === 'all' || 
            product.kurumSlug === selectedKurum || 
            (product.kurumSlugs && product.kurumSlugs.includes(selectedKurum))
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

                    <div className={styles.selectBox} style={{ minWidth: '220px' }}>
                        <CustomSelect
                            value={selectedKurum}
                            onChange={(val) => setSelectedKurum(val as string)}
                            options={[
                                { value: 'all', label: 'Tüm Kurumlar' },
                                ...kurumlar.map(k => ({ value: k.slug, label: k.name }))
                            ]}
                        />
                    </div>

                    <div className={styles.selectBox} style={{ minWidth: '180px' }}>
                        <CustomSelect
                            value={itemsPerPage}
                            onChange={(val) => setItemsPerPage(val === 'all' ? 'all' : parseInt(val as string))}
                            options={[
                                { value: 10, label: '10 Eğitim Göster' },
                                { value: 20, label: '20 Eğitim Göster' },
                                { value: 30, label: '30 Eğitim Göster' },
                                { value: 50, label: '50 Eğitim Göster' },
                                { value: 'all', label: 'Tümünü Göster' }
                            ]}
                        />
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
                    <div className={styles.colName} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input 
                            type="checkbox" 
                            checked={paginatedProducts.length > 0 && selectedIds.length === paginatedProducts.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedIds(paginatedProducts.map(p => p.id))
                                } else {
                                    setSelectedIds([])
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                        EĞİTİM ADI / KURUM
                    </div>
                    <div className={styles.colCategory}>TÜRÜ</div>
                    <div className={styles.colPrice}>FİYAT</div>
                    <div className={styles.colAction} style={{ justifyContent: 'center' }}>İŞLEMLER</div>
                </div>

                <div className={styles.tableBody}>
                    {paginatedProducts.map(product => {
                        const isFeatured = featuredIds.includes(product.id)
                        return (
                             <div key={product.id} className={`${styles.tableRow} ${isFeatured ? styles.rowFeatured : ''}`}>
                                 <div className={styles.colName} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                                     <input 
                                         type="checkbox" 
                                         style={{ marginTop: '4px', cursor: 'pointer' }}
                                         checked={selectedIds.includes(product.id)}
                                         onChange={(e) => {
                                             if (e.target.checked) {
                                                 setSelectedIds(prev => [...prev, product.id])
                                             } else {
                                                 setSelectedIds(prev => prev.filter(id => id !== product.id))
                                             }
                                         }}
                                     />
                                     <div>
                                         <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                             <span style={{ fontSize: '10px', background: '#cbd5e1', color: '#1e293b', padding: '1px 5px', borderRadius: '4px', fontWeight: '800', fontFamily: 'monospace' }} title="Görüntüleme Sırası">
                                                 Sıra #{product.order !== undefined ? product.order : 9999}
                                             </span>
                                         {product.status === 'passive' && (
                                            <span style={{ fontSize: '10px', background: '#fee2e2', color: '#ef4444', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }} title="Bu eğitim yayında değil">
                                                PASİF
                                            </span>
                                         )}
                                         {product.showOnHomepage === false && (
                                            <span style={{ fontSize: '10px', background: '#fef3c7', color: '#d97706', padding: '1px 5px', borderRadius: '4px', fontWeight: '800' }} title="Ana sayfa vitrininde görünmez">
                                                GİZLİ
                                            </span>
                                         )}
                                         <div className={styles.productName} style={{ fontWeight: '700' }}>{product.name}</div>
                                     </div>
                                     <div className={styles.productKurum}>
                                         {kurumlar.find(k => k.slug === product.kurumSlug)?.name || product.kurumSlug}
                                         {product.instructorName && (
                                            <span style={{ marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid #cbd5e1', color: '#64748b', fontSize: '11px' }}>
                                                Eğitmen: {product.instructorName}
                                            </span>
                                         )}
                                         {product.totalDuration && (
                                            <span style={{ marginLeft: '8px', paddingLeft: '8px', borderLeft: '1px solid #cbd5e1', color: '#64748b', fontSize: '11px' }}>
                                                {product.totalDuration}
                                            </span>
                                         )}
                                     </div>
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
                                        onClick={() => handleProductDuplicate(product)}
                                        title="Eğitimi Kopyala / Çoğalt"
                                        style={{ color: '#8b5cf6', borderColor: '#d8b4fe', background: '#f5f3ff' }}
                                    >
                                        <Copy size={14} />
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
            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 100 }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedIds.length} eğitim seçildi</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className="btn btn-sm" 
                            style={{ background: '#ef4444', color: 'white', border: 'none' }}
                            onClick={() => {
                                triggerConfirm({
                                    title: 'Toplu Silme',
                                    message: `Seçili ${selectedIds.length} eğitimi kalıcı olarak silmek istediğinize emin misiniz?`,
                                    isDangerous: true,
                                    confirmText: 'Evet, Sil',
                                    onConfirm: () => {
                                        bulkDeleteProducts(selectedIds)
                                        setSelectedIds([])
                                        triggerToast(`${selectedIds.length} eğitim başarıyla silindi.`)
                                    }
                                })
                            }}
                        >
                            <Trash2 size={14} /> Toplu Sil
                        </button>
                        <button className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: '#334155' }} onClick={() => setSelectedIds([])}>Vazgeç</button>
                    </div>
                </div>
            )}
        </div>
    )
}
