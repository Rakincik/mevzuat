'use client'

import React, { useState } from 'react'
import { 
    Edit3, Eye, FileText, CheckCircle, AlertCircle, 
    Copy, Check, Home as HomeIcon, BookOpen, Phone, 
    HelpCircle, FileSignature, Search, Layers, ExternalLink,
    Plus, Trash2
} from 'lucide-react'
import { useApp, EditablePage } from '@/context/AppContext'
import styles from '../page.module.css'

interface PagesTabProps {
    onEditPage: (page: EditablePage) => void
    onCreateNewPage: () => void
}

export default function PagesTab({ onEditPage, onCreateNewPage }: PagesTabProps) {
    const { pages, deletePage, triggerConfirm } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Turkish friendly search filter
    const filteredPages = (pages || []).filter(page => 
        page.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        page.slug.toLowerCase().includes(searchQuery.toLowerCase())
    )

    // Analytics calculations for the dashboard stats board
    const totalPages = pages ? pages.length : 0
    const publishedPages = pages ? pages.filter(p => p.status === 'published').length : 0
    const seoReadyPages = pages ? pages.filter(p => p.seoTitle && p.seoDescription).length : 0
    const seoMissingPages = totalPages - seoReadyPages

    const getPageIcon = (id: string) => {
        const size = 18
        switch (id) {
            case 'home': 
                return <HomeIcon size={size} style={{ color: '#4f46e5' }} />
            case 'about': 
                return <BookOpen size={size} style={{ color: '#8b5cf6' }} />
            case 'contact': 
                return <Phone size={size} style={{ color: '#3b82f6' }} />
            case 'faq': 
                return <HelpCircle size={size} style={{ color: '#10b981' }} />
            default: 
                return <FileText size={size} style={{ color: '#f59e0b' }} />
        }
    }

    const getLayoutLabel = (id: string) => {
        if (id.startsWith('custom_')) {
            return { label: 'Özel Dinamik Sayfa', style: { background: '#fdf4ff', color: '#c026d3', border: '1px solid #f5d0fe', fontSize: '11px', fontWeight: 'bold' as const, padding: '4px 10px', borderRadius: '20px' } }
        }
        switch (id) {
            case 'home': 
                return { label: 'Ana Sayfa Sihirbazı', style: { background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe', fontSize: '11px', fontWeight: 'bold' as const, padding: '4px 10px', borderRadius: '20px' } }
            case 'about': 
                return { label: 'Standart Hakkımızda', style: { background: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe', fontSize: '11px', fontWeight: 'bold' as const, padding: '4px 10px', borderRadius: '20px' } }
            case 'contact': 
                return { label: 'İletişim Formu', style: { background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', fontSize: '11px', fontWeight: 'bold' as const, padding: '4px 10px', borderRadius: '20px' } }
            case 'faq': 
                return { label: 'Soru-Cevap (SSS)', style: { background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontSize: '11px', fontWeight: 'bold' as const, padding: '4px 10px', borderRadius: '20px' } }
            default: 
                return { label: 'Hukuki / Standart Makale', style: { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', fontSize: '11px', fontWeight: 'bold' as const, padding: '4px 10px', borderRadius: '20px' } }
        }
    }

    const copyToClipboard = (slug: string, id: string) => {
        if (typeof window === 'undefined') return
        const fullUrl = `${window.location.origin}/pages/${slug}`
        navigator.clipboard.writeText(fullUrl)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const handleDeletePage = (page: EditablePage) => {
        triggerConfirm({
            title: 'Sayfayı Sil',
            message: `"${page.title}" adlı özel sayfayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve sayfaya giden linkler 404 hatası verir.`,
            confirmText: 'Evet, Sayfayı Sil',
            isDangerous: true,
            onConfirm: () => {
                deletePage(page.id)
            }
        })
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* 1. Dashboard Stats Board */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ background: '#e0e7ff', color: '#4f46e5', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Layers size={22} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{totalPages}</span>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>Toplam Sayfa</span>
                    </div>
                </div>
                
                <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '18px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <div style={{ background: '#ecfdf5', color: '#10b981', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <CheckCircle size={22} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', lineHeight: '1.2' }}>{publishedPages}</span>
                        <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.02em', marginTop: '2px' }}>Aktif Yayında</span>
                    </div>
                </div>


            </div>

            {/* 2. Premium Real-Time Search Bar & Add Button */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ flex: 1, background: 'white', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                    <Search size={18} style={{ color: '#94a3b8' }} />
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Sayfa adı veya URL linki ile ara... (Örn: Hakkımızda, terms)"
                        style={{ border: 'none', outline: 'none', background: 'transparent', width: '100%', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}
                    />
                    {searchQuery && (
                        <button 
                            onClick={() => setSearchQuery('')}
                            style={{ border: 'none', background: 'none', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}
                        >
                            Temizle
                        </button>
                    )}
                </div>
                
                <button 
                    className={styles.btnAddProduct}
                    onClick={onCreateNewPage}
                    style={{ flexShrink: 0, padding: '14px 24px', borderRadius: '16px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px -3px rgba(37, 99, 235, 0.4)' }}
                >
                    <Plus size={18} />
                    <span>Yeni Özel Sayfa</span>
                </button>
            </div>

            {/* 3. Redesigned Table Card */}
            <div className={styles.tableCard} style={{ borderRadius: '20px', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px -15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <div className={styles.pageTableHeader} style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '16px 24px', fontSize: '11px', fontWeight: 'bold', color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', display: 'grid', gridTemplateColumns: '2.2fr 1.2fr 1fr 220px', alignItems: 'center' }}>
                    <div>Sayfa Başlığı & URL</div>
                    <div>Şablon / Tasarım</div>
                    <div>Yayın Durumu</div>
                    <div style={{ textAlign: 'right' }}>İşlemler</div>
                </div>
                
                <div className={styles.tableBody}>
                    {filteredPages.length > 0 ? (
                        filteredPages.map((page) => {
                            const layout = getLayoutLabel(page.id)
                            const hasSeo = page.seoTitle && page.seoDescription
                            const isHome = page.id === 'home'
                            const pageUrl = isHome ? '/' : `/pages/${page.slug}`

                            return (
                                <div 
                                    key={page.id} 
                                    className={styles.pageTableRow} 
                                    style={{ 
                                        display: 'grid', 
                                        gridTemplateColumns: '2.2fr 1.2fr 1fr 220px', 
                                        alignItems: 'center', 
                                        padding: '20px 24px', 
                                        borderBottom: '1px solid #f1f5f9',
                                        background: 'white',
                                        transition: 'all 0.2s ease'
                                    }}
                                >
                                    {/* Column 1: Title and URL slug with copy button */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            {getPageIcon(page.id)}
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            <span style={{ fontSize: '14px', fontWeight: '750', color: '#0f172a' }}>{page.title}</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace', fontWeight: '600' }}>
                                                    {pageUrl}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => copyToClipboard(page.slug, page.id)}
                                                    style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px', display: 'flex', alignItems: 'center', color: copiedId === page.id ? '#10b981' : '#94a3b8', transition: 'color 0.15s ease' }}
                                                    title="Sayfa linkini kopyala"
                                                >
                                                    {copiedId === page.id ? <Check size={11} /> : <Copy size={11} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column 2: Template badges */}
                                    <div>
                                        <span style={layout.style}>
                                            {layout.label}
                                        </span>
                                    </div>

                                    {/* Column 3: Yayın Durumu */}
                                    <div>
                                        <span 
                                            className={`${styles.statusPill} ${page.status === 'published' ? styles['statusPill-published'] : styles['statusPill-draft']}`}
                                            style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 'bold' }}
                                        >
                                            {page.status === 'published' ? 'Yayında' : 'Taslak'}
                                        </span>
                                    </div>

                                    {/* Column 4: Premium actions (Edit & Sitede Gör) */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                        <a 
                                            href={pageUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className={styles.starBtn}
                                            style={{ padding: '7px 10px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', border: '1px solid #cbd5e1', color: '#475569', background: 'white' }}
                                            title="Sitede Canlı Görüntüle"
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#f8fafc'
                                                e.currentTarget.style.borderColor = '#94a3b8'
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'white'
                                                e.currentTarget.style.borderColor = '#cbd5e1'
                                            }}
                                        >
                                            <Eye size={12} />
                                            <span>Sitede Gör</span>
                                        </a>

                                        <button 
                                            className={styles.actionEditBtn}
                                            onClick={() => onEditPage(page)}
                                            style={{ padding: '7px 12px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 'bold', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe' }}
                                            title="Sayfa İçeriğini Düzenle"
                                        >
                                            <Edit3 size={12} />
                                            <span>Düzenle</span>
                                        </button>
                                        
                                        {page.id.startsWith('custom_') && (
                                            <button 
                                                onClick={() => handleDeletePage(page)}
                                                className={styles.actionDeleteBtn}
                                                style={{ padding: '7px 7px', borderRadius: '8px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 'bold', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', marginLeft: '4px' }}
                                                title="Bu özel sayfayı sil"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div style={{ padding: '48px', textAlign: 'center', color: '#64748b', fontSize: '14px', fontWeight: '500', background: 'white' }}>
                            Arama kriterlerine uygun sayfa bulunamadı.
                        </div>
                    )}
                </div>
            </div>

        </div>
    )
}
