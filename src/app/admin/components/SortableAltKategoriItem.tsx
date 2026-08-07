import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, Trash2, FolderOpen, ArrowUpDown, HelpCircle } from 'lucide-react';
import { AltKategori, Kurum, Product } from '@/context/AppContext';

interface Props {
    subcat: AltKategori;
    activeKurumColor: string;
    subcatProductCount: number;
    onEdit: () => void;
    onDelete: () => void;
    onManageOrder: () => void;
    kurumlar: Kurum[];
    activeKurumSlug: string;
    globalProducts: Product[];
}

export function SortableAltKategoriItem({ 
    subcat, 
    activeKurumColor, 
    subcatProductCount, 
    onEdit, 
    onDelete, 
    onManageOrder,
    kurumlar,
    activeKurumSlug,
    globalProducts
}: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: subcat.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        background: 'white', 
        border: isDragging ? `2px solid ${activeKurumColor || '#6366f1'}` : '1px solid #e2e8f0', 
        borderRadius: '12px', 
        padding: '18px',
        display: 'flex',
        flexDirection: 'column' as const,
        justifyContent: 'space-between',
        gap: '12px',
        boxShadow: isDragging ? '0 10px 25px -5px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.02)',
        position: 'relative' as const,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: isDragging ? 10 : 1,
        opacity: isDragging ? 0.9 : 1
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <div>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                    <span style={{ fontSize: '9px', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>#{subcat.order !== undefined ? subcat.order : 999}</span>
                    {subcat.status === 'passive' && (
                        <span style={{ fontSize: '9px', background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>PASİF</span>
                    )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: '0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FolderOpen size={14} style={{ color: activeKurumColor }} />
                        <span>{subcat.name}</span>
                    </h4>
                    
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                        <button 
                            style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                            onClick={onEdit}
                            title="Kategoriyi Düzenle"
                        >
                            <Edit3 size={13} />
                        </button>
                        <button 
                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            onClick={onDelete}
                            title="Kategoriyi Sil"
                        >
                            <Trash2 size={13} />
                        </button>
                    </div>
                </div>
                
                <span style={{ fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace', fontWeight: '600' }}>/{subcat.slug}</span>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '8px 0 0 0', lineHeight: '1.4' }}>{subcat.description || 'Açıklama belirtilmemiş.'}</p>
            </div>

            {/* Display list of other shared institutions under description */}
            {(() => {
                const otherSharedKurums = subcat.kurumSlugs
                    .filter(slug => slug !== activeKurumSlug)
                    .map(slug => kurumlar.find(k => k.slug === slug)?.name || slug);

                if (otherSharedKurums.length === 0) return null;

                return (
                    <div 
                        style={{ 
                            fontSize: '10px', 
                            fontWeight: '700', 
                            color: '#059669', 
                            background: '#d1fae5', 
                            padding: '6px 10px', 
                            borderRadius: '6px', 
                            display: 'inline-flex', 
                            alignItems: 'center', 
                            gap: '4px',
                            marginTop: '8px',
                            cursor: 'help',
                            lineHeight: '1.3'
                        }}
                        title="Bu kategori ortak bir alandır. İçerisinde yapacağınız ders ekleme, silme ve sıralama işlemleri ortak olduğu diğer bakanlıklarda da yansıyacaktır."
                    >
                        <span>🔗 Ortak: {otherSharedKurums.join(', ')}</span>
                        <HelpCircle size={11} style={{ color: '#059669', flexShrink: 0 }} />
                    </div>
                );
            })()}

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                {(() => {
                    const globalProductCount = globalProducts.filter(p => 
                        p.altKategoriSlug === subcat.slug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(subcat.slug))
                    ).length;

                    const displayProductCountText = subcatProductCount === globalProductCount
                        ? `${subcatProductCount} DERS`
                        : `${subcatProductCount} / ${globalProductCount} DERS`;

                    const productCountTitle = subcatProductCount === globalProductCount
                        ? "Bu alt kategorideki toplam ders sayısı"
                        : `Bu kurumda ${subcatProductCount} ders var. Toplamda ise bu kategoride ${globalProductCount} ders bulunuyor.`;

                    return (
                        <span 
                            style={{ fontSize: '11px', fontWeight: '800', color: '#475569', background: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', cursor: 'help' }}
                            title={productCountTitle}
                        >
                            {displayProductCountText}
                        </span>
                    );
                })()}

                <button 
                    onClick={onManageOrder}
                    className="btn btn-sm btn-outline"
                    style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '4px', 
                        fontSize: '11px', 
                        padding: '4px 8px', 
                        marginLeft: 'auto', 
                        borderColor: '#2563eb', 
                        color: '#2563eb',
                        background: 'white',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                    }}
                    title="Eğitimlerin sıralamasını yönet"
                >
                    <ArrowUpDown size={11} />
                    <span>Sırala</span>
                </button>
            </div>
        </div>
    );
}
