import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit3, Trash2, Landmark } from 'lucide-react';
import { Kurum, Product } from '@/context/AppContext';

interface Props {
    kurum: Kurum;
    isActive: boolean;
    products: Product[];
    onClick: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function SortableKurumItem({ kurum, isActive, products, onClick, onEdit, onDelete }: Props) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: kurum.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        padding: '16px', 
        background: isActive ? '#f8fafc' : 'white', 
        borderTop: isActive ? `2px solid ${kurum.color || '#3b82f6'}` : '1px solid #e2e8f0',
        borderRight: isActive ? `2px solid ${kurum.color || '#3b82f6'}` : '1px solid #e2e8f0',
        borderBottom: isActive ? `2px solid ${kurum.color || '#3b82f6'}` : '1px solid #e2e8f0',
        borderLeft: `6px solid ${kurum.color || '#3b82f6'}`,
        borderRadius: '12px', 
        cursor: isDragging ? 'grabbing' : 'grab',
        boxShadow: isDragging ? '0 10px 25px -5px rgba(0,0,0,0.1)' : isActive ? '0 8px 20px -8px rgba(0,0,0,0.08)' : 'none',
        zIndex: isDragging ? 10 : 1,
        position: 'relative' as const,
        opacity: isDragging ? 0.9 : 1
    };

    const count = products.filter(p => p.kurumSlug === kurum.slug || (p.kurumSlugs && p.kurumSlugs.includes(kurum.slug))).length;

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '9px', background: '#e2e8f0', color: '#475569', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>#{kurum.order !== undefined ? kurum.order : 999}</span>
                {kurum.status === 'passive' && (
                    <span style={{ fontSize: '9px', background: '#fee2e2', color: '#ef4444', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>PASİF</span>
                )}
                {kurum.showOnHomepage === false && (
                    <span style={{ fontSize: '9px', background: '#fef3c7', color: '#d97706', padding: '2px 6px', borderRadius: '4px', fontWeight: '800' }}>GİZLİ</span>
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', margin: '0', lineHeight: '1.3', flexGrow: 1, paddingRight: '8px' }}>{kurum.name}</h4>
                
                <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
                    <button 
                        style={{ border: 'none', background: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                        onClick={onEdit}
                        title="Kurum Ayarlarını Düzenle"
                    >
                        <Edit3 size={13} />
                    </button>
                    {kurum.slug !== 'genel-gys' && (
                        <button 
                            style={{ border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                            onClick={onDelete}
                            title="Kurumu Sil"
                        >
                            <Trash2 size={13} />
                        </button>
                    )}
                </div>
            </div>

            <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 10px 0', lineHeight: '1.4' }}>{kurum.description || 'Açıklama belirtilmemiş.'}</p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '10px', fontWeight: '800', color: '#94a3b8' }}>
                {isActive ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: kurum.color || '#3b82f6' }}>
                        <Landmark size={10} />
                        <span>AKTİF SEÇİM</span>
                    </span>
                ) : (
                     <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#cbd5e1' }}>
                        <Landmark size={10} />
                        <span>SÜRÜKLE</span>
                    </span>
                )}
                
                <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '20px', color: '#475569' }}>{count} EĞİTİM</span>
            </div>
        </div>
    );
}
