'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit3, Trash2, AlertCircle, Landmark, FolderOpen, Layers, Info, ArrowUpDown } from 'lucide-react'
import { useApp, Kurum, AltKategori } from '@/context/AppContext'
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
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableKurumItem } from './SortableKurumItem';
import { SortableAltKategoriItem } from './SortableAltKategoriItem';

interface KurumlarTabProps {
    triggerToast: (message: string) => void
    onAddKurum: () => void
    onEditKurum: (kurum: Kurum) => void
    onAddAltKategori: (initialKurumSlug?: string) => void
    onEditAltKategori: (cat: AltKategori) => void
    onManageProductOrder: (subcat: AltKategori, activeKurum: Kurum) => void
}

export default function KurumlarTab({ triggerToast, onAddKurum, onEditKurum, onAddAltKategori, onEditAltKategori, onManageProductOrder }: KurumlarTabProps) {
    const { kurumlar, altKategoriler, products, deleteKurum, deleteAltKategori, triggerConfirm, reorderKurumlar, reorderAltKategoriler } = useApp()
    const [activeKurumSlug, setActiveKurumSlug] = useState<string>('')

    // Set first institution as active by default
    useEffect(() => {
        if (kurumlar.length > 0 && !activeKurumSlug) {
            // we will find the first based on sorted order below, but for now just picking [0] is fine
            setActiveKurumSlug(kurumlar[0].slug)
        }
    }, [kurumlar, activeKurumSlug])

    const sortedKurumlar = [...kurumlar].sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 999
        const orderB = b.order !== undefined ? b.order : 999
        return orderA - orderB
    })

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

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sortedKurumlar.findIndex((k) => k.id === active.id);
            const newIndex = sortedKurumlar.findIndex((k) => k.id === over.id);

            const reorderedList = arrayMove(sortedKurumlar, oldIndex, newIndex);
            
            const updatedList = reorderedList.map((kurum, index) => ({
                ...kurum,
                order: index + 1
            }));

            reorderKurumlar(updatedList);
            triggerToast('Sıralama güncellendi.');
        }
    };

    const handleDragEndAltKategori = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = activeSubcategories.findIndex((s) => s.id === active.id);
            const newIndex = activeSubcategories.findIndex((s) => s.id === over.id);

            const reorderedSubset = arrayMove(activeSubcategories, oldIndex, newIndex);
            
            const orderMap = new Map<string, number>();
            reorderedSubset.forEach((subcat, index) => {
                orderMap.set(subcat.id, index + 1);
            });

            const updatedGlobalList = altKategoriler.map((subcat) => {
                if (orderMap.has(subcat.id)) {
                    return { ...subcat, order: orderMap.get(subcat.id) };
                }
                return subcat;
            });

            reorderAltKategoriler(updatedGlobalList);
            triggerToast('Kategori sıralaması güncellendi.');
        }
    };

    const handleKurumDelete = (id: string, name: string) => {
        triggerConfirm({
            title: 'Kurumu Sil',
            message: `"${name}" kurumunu silmek istediğinize emin misiniz? SADECE bu kuruma ait olan özel eğitimler kalıcı olarak silinecektir. Birden fazla kuruma bağlı olan ortak eğitimlerin ise sadece bu kurumla olan bağı koparılacaktır.`,
            confirmText: 'Kurumu Sil',
            isDangerous: true,
            onConfirm: () => {
                deleteKurum(id)
                triggerToast('Kurum başarıyla silindi ve ilişkili eğitimler güncellendi.')
                if (activeKurumSlug === name) {
                    setActiveKurumSlug('')
                }
            }
        })
    }

    const handleAltCatDelete = (id: string, name: string) => {
        triggerConfirm({
            title: 'Alt Kategoriyi Sil',
            message: `"${name}" alt kategorisini silmek istediğinize emin misiniz? Bu kategori silindiğinde ilişkili ürünlerin sadece kategori bağı kaldırılacaktır (ürünler silinmez).`,
            confirmText: 'Kategoriyi Sil',
            isDangerous: true,
            onConfirm: () => {
                deleteAltKategori(id)
                triggerToast('Alt kategori silindi.')
            }
        })
    }

    const activeKurum = kurumlar.find(k => k.slug === activeKurumSlug) || kurumlar[0]
    
    // Filter subcategories belonging to active institution
    const activeSubcategories = altKategoriler.filter(cat => 
        activeKurum ? cat.kurumSlugs.includes(activeKurum.slug) : false
    ).sort((a, b) => {
        const orderA = a.order !== undefined ? a.order : 999
        const orderB = b.order !== undefined ? b.order : 999
        return orderA - orderB
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Header info */}
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px 20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
                <Layers size={20} style={{ color: '#2563eb', flexShrink: 0 }} />
                <div style={{ fontSize: '13px', color: '#1e40af', fontWeight: '500', lineHeight: '1.4' }}>
                    <strong>Merkezi Hiyerarşi Yönetimi:</strong> Sitenizdeki eğitimleri organize eden <strong>Üst Kurumları (Bakanlıklar)</strong> ve onlara bağlı <strong>Alt Kategorileri (Sınav Grupları)</strong> buradan yönetebilirsiniz. Alt kategorileri dilediğinizce düzenlediğinizde, ilişkili tüm ürünler arka planda otomatik güncellenir.
                </div>
            </div>

            {kurumlar.length === 0 ? (
                <div className={styles.emptyTable}>
                    <AlertCircle size={36} className={styles.emptyIcon} />
                    <h3>Kayıtlı Kurum Bulunamadı</h3>
                    <p>Sistemde tanımlı hiçbir kurum bulunmuyor. Yeni kurum ekleyerek başlayın.</p>
                    <button className={styles.btnAddItem} onClick={onAddKurum} style={{ marginTop: '16px' }}>
                        <Plus size={16} />
                        <span>Yeni Kurum Ekle</span>
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
                    
                    {/* LEFT COLUMN: Ministries / Upper Institutions */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#475569', margin: '0', textTransform: 'uppercase', letterSpacing: '0.03em' }}>🏛️ Üst Kurumlar ({sortedKurumlar.length})</h3>
                            <button 
                                className="btn btn-outline btn-sm" 
                                onClick={onAddKurum}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', padding: '6px 10px', borderColor: '#cbd5e1', color: '#475569' }}
                            >
                                <Plus size={12} />
                                <span>Kurum Ekle</span>
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                                <SortableContext items={sortedKurumlar.map(k => k.id)} strategy={verticalListSortingStrategy}>
                                    {sortedKurumlar.map(kurum => (
                                        <SortableKurumItem 
                                            key={kurum.id}
                                            kurum={kurum}
                                            isActive={activeKurum && activeKurum.id === kurum.id}
                                            products={products}
                                            onClick={() => setActiveKurumSlug(kurum.slug)}
                                            onEdit={() => onEditKurum(kurum)}
                                            onDelete={() => handleKurumDelete(kurum.id, kurum.name)}
                                        />
                                    ))}
                                </SortableContext>
                            </DndContext>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Subcategories of Active Upper Institution */}
                    {activeKurum && (
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', minHeight: '60vh' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: activeKurum.color }} />
                                        <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0' }}>{activeKurum.name} Alt Kategorileri</h3>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>Bu kuruma bağlı sınav grupları ve müfredat kırılımları listelenmektedir.</span>
                                </div>

                                <button 
                                    className="btn btn-primary"
                                    onClick={() => onAddAltKategori(activeKurum.slug)}
                                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '8px 16px', marginTop: 0 }}
                                >
                                    <Plus size={14} />
                                    <span>Alt Kategori Ekle</span>
                                </button>
                            </div>

                            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEndAltKategori}>
                                <SortableContext items={activeSubcategories.map(s => s.id)} strategy={rectSortingStrategy}>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                        {activeSubcategories.map(subcat => {
                                            const subcatProductCount = products.filter(p => 
                                                (p.kurumSlug === activeKurum.slug || (p.kurumSlugs && p.kurumSlugs.includes(activeKurum.slug))) &&
                                                (p.altKategoriSlug === subcat.slug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(subcat.slug)))
                                            ).length

                                            return (
                                                <SortableAltKategoriItem
                                                    key={subcat.id}
                                                    subcat={subcat}
                                                    activeKurumColor={activeKurum.color}
                                                    subcatProductCount={subcatProductCount}
                                                    onEdit={() => onEditAltKategori(subcat)}
                                                    onDelete={() => handleAltCatDelete(subcat.id, subcat.name)}
                                                    onManageOrder={() => onManageProductOrder(subcat, activeKurum)}
                                                    kurumlar={kurumlar}
                                                    activeKurumSlug={activeKurum.slug}
                                                    globalProducts={products}
                                                />
                                            )
                                        })}

                                        <div 
                                            onClick={() => onAddAltKategori(activeKurum.slug)}
                                            style={{ 
                                                border: '2px dashed #cbd5e1', 
                                                borderRadius: '12px', 
                                                padding: '24px', 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '8px', 
                                                cursor: 'pointer', 
                                                background: 'white', 
                                                color: '#64748b',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'center',
                                                minHeight: '140px'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = activeKurum.color}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                        >
                                            <Plus size={24} style={{ color: activeKurum.color }} />
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>Yeni Alt Kategori Tanımla</span>
                                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>Doğrudan {activeKurum.name} kurumuna bağlanır.</span>
                                        </div>
                                    </div>
                                </SortableContext>
                            </DndContext>

                            {activeSubcategories.length === 0 && (
                                <div style={{ border: '1px dashed #cbd5e1', borderRadius: '12px', padding: '40px 20px', textAlign: 'center', color: '#94a3b8', background: 'white' }}>
                                    <FolderOpen size={32} style={{ margin: '0 auto 10px', opacity: 0.5 }} />
                                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#475569', margin: '0 0 4px 0' }}>Alt Kategori Bulunamadı</h4>
                                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Bu bakanlığa atanmış hiçbir alt sınav grubu veya ders kategorisi bulunmuyor. Yeni bir alt kategori ekleyerek başlayabilirsiniz.</p>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            )}
        </div>
    )
}
