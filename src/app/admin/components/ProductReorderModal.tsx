'use client'

import React from 'react'
import { X, Move, AlertCircle } from 'lucide-react'
import { useApp, Product, Kurum, AltKategori } from '@/context/AppContext'
import styles from '../page.module.css'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableProductItemProps {
    product: Product
    index: number
    kurumSlug: string
    altKategoriSlug: string
}

function SortableProductItem({ product, index, kurumSlug, altKategoriSlug }: SortableProductItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: product.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '12px 16px',
        background: 'white',
        border: '1.5px solid #e2e8f0',
        borderRadius: '8px',
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 10px 15px -3px rgba(0,0,0,0.1)' : 'none',
        zIndex: isDragging ? 100 : 1,
        position: 'relative' as const,
        opacity: isDragging ? 0.8 : 1
    };

    const key = `${kurumSlug}_${altKategoriSlug}`
    const displayOrder = product.categoryOrders?.[key] ?? product.order ?? 9999

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94a3b8' }}>
                <Move size={16} />
            </div>
            
            <span style={{ 
                fontSize: '11px', 
                background: '#eff6ff', 
                color: '#2563eb', 
                padding: '2px 8px', 
                borderRadius: '4px', 
                fontWeight: '800',
                fontFamily: 'monospace',
                border: '1px solid #bfdbfe'
            }}>
                #{displayOrder}
            </span>

            <div style={{ flexGrow: 1 }}>
                <h4 style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                    {product.name}
                </h4>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                    {product.categoryName} • {product.price} ₺
                </p>
            </div>
        </div>
    )
}

interface ProductReorderModalProps {
    isOpen: boolean
    onClose: () => void
    kurum: Kurum | null
    altKategori: AltKategori | null
    triggerToast: (message: string) => void
}

export default function ProductReorderModal({ isOpen, onClose, kurum, altKategori, triggerToast }: ProductReorderModalProps) {
    const { products, updateMultipleProducts } = useApp()
    
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    if (!isOpen || !kurum || !altKategori) return null

    const categoryKey = `${kurum.slug}_${altKategori.slug}`

    // Filter products belonging to this subcategory under this institution
    const filteredProducts = products.filter(p => 
        (p.kurumSlug === kurum.slug || (p.kurumSlugs && p.kurumSlugs.includes(kurum.slug))) && 
        (p.altKategoriSlug === altKategori.slug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(altKategori.slug)))
    )

    // Sort by current category-specific order, falling back to global order
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        const orderA = a.categoryOrders?.[categoryKey] ?? a.order ?? 9999
        const orderB = b.categoryOrders?.[categoryKey] ?? b.order ?? 9999
        if (orderA !== orderB) return orderA - orderB
        return a.name.localeCompare(b.name, 'tr')
    })

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedProducts.findIndex((p) => p.id === active.id);
            const newIndex = sortedProducts.findIndex((p) => p.id === over.id);

            const reordered = arrayMove(sortedProducts, oldIndex, newIndex);
            
            // Build the updates mapping categoryOrders
            const updates = reordered.map((product, idx) => {
                const categoryOrders = { ...(product.categoryOrders || {}) }
                categoryOrders[categoryKey] = idx + 1
                return {
                    id: product.id,
                    fields: {
                        categoryOrders
                    }
                }
            })

            updateMultipleProducts(updates)
            triggerToast('Sıralama güncellendi.')
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div 
                className={styles.modalContainer} 
                style={{ 
                    maxWidth: '600px', 
                    width: '90%', 
                    maxHeight: '85vh', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    padding: '0', 
                    borderRadius: '16px', 
                    overflow: 'hidden' 
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.modalHeader} style={{ padding: '20px 24px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0' }}>Eğitim Sıralaması</h3>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
                            {kurum.name} • {altKategori.name}
                        </span>
                    </div>
                    <button className={styles.modalCloseBtn} onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#64748b' }}>
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div style={{ flexGrow: 1, overflowY: 'auto', padding: '24px' }}>
                    <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '12px 16px', color: '#166534', fontSize: '12px', fontWeight: '500', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <AlertCircle size={16} style={{ color: '#15803d', flexShrink: 0 }} />
                        <span>Eğitimleri sürükleyip bırakarak yeni sırasını belirleyebilirsiniz. Değişiklikler otomatik olarak kaydedilir.</span>
                    </div>

                    {sortedProducts.length === 0 ? (
                        <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94a3b8' }}>
                            <AlertCircle size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                            <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#475569', margin: '0 0 4px 0' }}>Eğitim Bulunamadı</h4>
                            <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Bu kategoriye atanmış hiçbir eğitim bulunmamaktadır.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sortedProducts.map(p => p.id)} strategy={verticalListSortingStrategy}>
                                    {sortedProducts.map((product, idx) => (
                                        <SortableProductItem 
                                            key={product.id}
                                            product={product}
                                            index={idx}
                                            kurumSlug={kurum.slug}
                                            altKategoriSlug={altKategori.slug}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className={styles.modalFooter} style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button className="btn btn-primary" onClick={onClose}>
                        Tamam
                    </button>
                </div>
            </div>
        </div>
    )
}
