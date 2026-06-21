'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Upload, Landmark, Sparkles, Info, Trash2 } from 'lucide-react'
import { useApp, Kurum } from '@/context/AppContext'
import styles from '../page.module.css'

interface KurumModalProps {
    isOpen: boolean
    onClose: () => void
    editingKurum: Kurum | null
    triggerToast: (message: string) => void
}

export default function KurumModal({ isOpen, onClose, editingKurum, triggerToast }: KurumModalProps) {
    const { addKurum, updateKurum, triggerConfirm } = useApp()
    const [isSlugPristine, setIsSlugPristine] = useState(true)
    const [kurumForm, setKurumForm] = useState({
        name: '',
        slug: '',
        description: '',
        color: '#4f46e5',
        icon: 'Landmark',
        order: 999,
        showOnHomepage: true,
        status: 'active' as 'active' | 'passive',
        image: '',
        seoTitle: '',
        seoDescription: ''
    })

    // Sync form state when modal opens/changes
    useEffect(() => {
        if (editingKurum) {
            setKurumForm({
                name: editingKurum.name,
                slug: editingKurum.slug,
                description: editingKurum.description || '',
                color: editingKurum.color || '#4f46e5',
                icon: editingKurum.icon || 'Landmark',
                order: editingKurum.order !== undefined ? editingKurum.order : 999,
                showOnHomepage: editingKurum.showOnHomepage !== undefined ? editingKurum.showOnHomepage : true,
                status: editingKurum.status || 'active',
                image: editingKurum.image || '',
                seoTitle: editingKurum.seoTitle || '',
                seoDescription: editingKurum.seoDescription || ''
            })
            setIsSlugPristine(false)
        } else {
            setKurumForm({
                name: '',
                slug: '',
                description: '',
                color: '#3b82f6',
                icon: 'Landmark',
                order: 999,
                showOnHomepage: true,
                status: 'active',
                image: '',
                seoTitle: '',
                seoDescription: ''
            })
            setIsSlugPristine(true)
        }
    }, [editingKurum, isOpen])

    if (!isOpen) return null

    // Turkish friendly slugify helper
    const slugify = (text: string) => {
        const trMap: { [key: string]: string } = {
            'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
            'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
        }
        let cleaned = text
        for (const key in trMap) {
            cleaned = cleaned.replace(new RegExp(key, 'g'), trMap[key])
        }
        return cleaned
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '-')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start
            .replace(/-+$/, '')             // Trim - from end
    }

    const handleNameChange = (nameVal: string) => {
        const nextSlug = isSlugPristine ? slugify(nameVal) : kurumForm.slug
        setKurumForm(prev => ({
            ...prev,
            name: nameVal,
            slug: nextSlug
        }))
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        const file = files[0]
        if (file.size > 10 * 1024 * 1024) {
            triggerConfirm({
                title: 'Dosya Çok Büyük',
                message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                confirmText: 'Tamam',
                cancelText: 'Kapat',
                isDangerous: true,
                onConfirm: () => {}
            })
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            if (reader.result) {
                setKurumForm(prev => ({
                    ...prev,
                    icon: reader.result as string // store custom base64 in icon field
                }))
            }
        }
        reader.readAsDataURL(file)
    }

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return
        const file = files[0]
        if (file.size > 10 * 1024 * 1024) {
            triggerConfirm({
                title: 'Dosya Çok Büyük',
                message: `"${file.name}" çok büyük! Maksimum 10 MB yükleyebilirsiniz.`,
                confirmText: 'Tamam',
                cancelText: 'Kapat',
                isDangerous: true,
                onConfirm: () => {}
            })
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            if (reader.result) {
                setKurumForm(prev => ({
                    ...prev,
                    image: reader.result as string
                }))
            }
        }
        reader.readAsDataURL(file)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!kurumForm.name) {
            alert('Lütfen Kurum Adı alanını doldurun.')
            return
        }

        const calculatedSlug = kurumForm.slug.trim() || slugify(kurumForm.name)

        const kurumData = {
            name: kurumForm.name.trim(),
            slug: calculatedSlug,
            description: kurumForm.description.trim(),
            color: kurumForm.color,
            icon: kurumForm.icon.trim() || 'Landmark',
            productCount: editingKurum ? editingKurum.productCount : 0,
            order: kurumForm.order,
            showOnHomepage: kurumForm.showOnHomepage,
            status: kurumForm.status,
            image: kurumForm.image,
            seoTitle: kurumForm.seoTitle,
            seoDescription: kurumForm.seoDescription
        }

        if (editingKurum) {
            updateKurum(editingKurum.id, kurumData)
            triggerToast('Kurum başarıyla güncellendi!')
        } else {
            const newKurum: Kurum = {
                id: 'kurum_' + Date.now(),
                ...kurumData
            }
            addKurum(newKurum)
            triggerToast('Yeni kurum başarıyla eklendi!')
        }

        onClose()
    }

    const hasCustomLogo = kurumForm.icon && (kurumForm.icon.startsWith('data:') || kurumForm.icon.startsWith('/') || kurumForm.icon.startsWith('http'))
    const hasCustomCover = kurumForm.image && (kurumForm.image.startsWith('data:') || kurumForm.image.startsWith('/') || kurumForm.image.startsWith('http'))

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} style={{ maxWidth: '1100px', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                <div className={styles.modalHeader} style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', padding: '24px 28px', borderBottom: 'none' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'white', margin: '0', letterSpacing: '-0.02em' }}>
                        <span>{editingKurum ? 'KURUM AYARLARINI DÜZENLE' : 'YENİ ÜST KURUM / BAKANLIK EKLE'}</span>
                    </h2>
                    <button className={styles.modalCloseBtn} onClick={onClose} style={{ padding: '8px', background: 'rgba(255,255,255,0.08)', color: 'white', border: 'none', borderRadius: '50%', cursor: 'pointer' }}>
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody} style={{ padding: '28px 32px', maxHeight: '75vh', overflowY: 'auto', overflowX: 'hidden' }}>
                        <div className={styles.adminForm} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
                            
                            {/* SOL KOLON - Temel Bilgiler */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ fontSize: '14px', margin: 0, paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>Temel Bilgiler</h3>
                                
                                <div className={styles.formGroup}>
                                <label htmlFor="kurum-name" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Kurum / Bakanlık Adı *</label>
                                <input 
                                    id="kurum-name"
                                    type="text"
                                    required
                                    value={kurumForm.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className={styles.formInput}
                                    style={{ padding: '12px 16px', fontSize: '14px' }}
                                    placeholder="Örn: Gençlik ve Spor Bakanlığı"
                                />
                            </div>

                            <div className={styles.formRow} style={{ gap: '20px' }}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="kurum-slug" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Link Slug (Eşsiz URL Adı)</label>
                                    <input 
                                        id="kurum-slug"
                                        type="text"
                                        value={kurumForm.slug}
                                        onChange={(e) => {
                                            setKurumForm({ ...kurumForm, slug: e.target.value })
                                            setIsSlugPristine(false)
                                        }}
                                        className={styles.formInput}
                                        style={{ padding: '12px 16px', fontSize: '14px' }}
                                        placeholder="Örn: genclik-ve-spor-bakanligi"
                                    />
                                    {isSlugPristine && kurumForm.name && (
                                        <div style={{ color: '#6366f1', fontSize: '11px', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                            <Sparkles size={11} />
                                            <span>Başlıktan otomatik üretiliyor...</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* CUSTOM IMAGE UPLOAD AREA */}
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px', display: 'block' }}>Kurum Logosu / Görseli</label>
                                
                                {hasCustomLogo ? (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1.5px solid #e2e8f0' }}>
                                        <img 
                                            src={kurumForm.icon} 
                                            alt="Logo Önizleme" 
                                            style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'contain', background: '#fff', border: `2.5px solid ${kurumForm.color}`, padding: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }} 
                                        />
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a' }}>Özel Logo Aktif</span>
                                            <span style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.3' }}>Bu görsel, eğitim sayfalarında ve kurum logoları listesinde gösterilecektir.</span>
                                            <button 
                                                type="button" 
                                                onClick={() => setKurumForm(prev => ({ ...prev, icon: 'Landmark' }))} 
                                                style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: '0', alignSelf: 'flex-start', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                            >
                                                <Trash2 size={12} />
                                                <span>Resmi Kaldır (Varsayılan Embleme Dön)</span>
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        <label 
                                            htmlFor="kurum-logo-upload" 
                                            style={{ 
                                                display: 'flex', 
                                                flexDirection: 'column', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                gap: '8px', 
                                                padding: '28px', 
                                                background: '#f8fafc', 
                                                border: '2px dashed #cbd5e1', 
                                                borderRadius: '12px', 
                                                cursor: 'pointer',
                                                transition: 'all 0.2s ease',
                                                textAlign: 'center'
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = kurumForm.color}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                        >
                                            <Upload size={24} style={{ color: kurumForm.color }} />
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>Logo / Görsel Yükle</span>
                                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>PNG, JPG, SVG (Maks. 10MB)</span>
                                            <input 
                                                id="kurum-logo-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </label>
                                        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '8px', fontSize: '11.5px', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', lineHeight: '1.4' }}>
                                            <Info size={16} style={{ color: '#2563eb', flexShrink: 0 }} />
                                            <span>Logo yüklemezseniz, sistem otomatik olarak şık bir dairesel devlet arması üretecektir.</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* CURATED HSL PALETTE FOR THEME COLOR */}
                            <div className={styles.formGroup}>
                                <label htmlFor="kurum-color" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Kurum Vurgu Rengi (Sitedeki Teması)</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <input 
                                        id="kurum-color"
                                        type="color"
                                        value={kurumForm.color}
                                        onChange={(e) => setKurumForm({ ...kurumForm, color: e.target.value })}
                                        style={{ width: '40px', height: '40px', border: 'none', borderRadius: '50%', cursor: 'pointer', padding: '0', background: 'none' }}
                                    />
                                    <input 
                                        type="text"
                                        value={kurumForm.color}
                                        onChange={(e) => setKurumForm({ ...kurumForm, color: e.target.value })}
                                        className={styles.formInput}
                                        style={{ textTransform: 'uppercase', width: '90px', padding: '8px 12px', fontSize: '13px', fontFamily: 'monospace' }}
                                        placeholder="#HEX"
                                    />
                                    <div style={{ display: 'flex', gap: '6px' }}>
                                        {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#475569'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setKurumForm({ ...kurumForm, color })}
                                                style={{ 
                                                    width: '24px', 
                                                    height: '24px', 
                                                    borderRadius: '50%', 
                                                    background: color, 
                                                    border: kurumForm.color === color ? '2px solid #0f172a' : '1px solid #cbd5e1', 
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    transform: kurumForm.color === color ? 'scale(1.15)' : 'none'
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="kurum-desc" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Kurum / Sınav Kısa Açıklaması</label>
                                    <textarea 
                                        id="kurum-desc"
                                        value={kurumForm.description}
                                        onChange={(e) => setKurumForm({ ...kurumForm, description: e.target.value })}
                                        className={styles.formTextarea}
                                        style={{ minHeight: '100px', padding: '12px 14px', fontSize: '13px' }}
                                        placeholder="Sınav hazırlıkları, V.H.K.İ. ve Şef kadroları vb. sınavlar hakkında kısa bilgi..."
                                    />
                                </div>
                            </div>

                            {/* SAĞ KOLON - Gelişmiş Ayarlar */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <h3 style={{ fontSize: '14px', margin: 0, paddingBottom: '8px', borderBottom: '1px solid #e2e8f0', color: '#334155' }}>Görünüm & SEO Ayarları</h3>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div className={styles.formGroup}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Sıra Numarası</label>
                                        <input 
                                            type="number"
                                            value={kurumForm.order}
                                            onChange={(e) => setKurumForm({ ...kurumForm, order: parseInt(e.target.value) || 0 })}
                                            className={styles.formInput}
                                            style={{ padding: '10px 14px', fontSize: '14px' }}
                                        />
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Durum</label>
                                        <select 
                                            value={kurumForm.status}
                                            onChange={(e) => setKurumForm({ ...kurumForm, status: e.target.value as 'active' | 'passive' })}
                                            className={styles.formInput}
                                            style={{ padding: '10px 14px', fontSize: '14px' }}
                                        >
                                            <option value="active">Aktif</option>
                                            <option value="passive">Pasif (Gizli)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#334155' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={kurumForm.showOnHomepage}
                                            onChange={(e) => setKurumForm({ ...kurumForm, showOnHomepage: e.target.checked })}
                                            style={{ width: '16px', height: '16px' }}
                                        />
                                        Ana Sayfa Vitrininde Göster
                                    </label>
                                </div>

                                <div className={styles.formGroup}>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px', display: 'block' }}>Kapak Görseli (Banner)</label>
                                    {hasCustomCover ? (
                                        <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', height: '120px', border: '1px solid #e2e8f0' }}>
                                            <img src={kurumForm.image} alt="Kapak Önizleme" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            <button 
                                                type="button" 
                                                onClick={() => setKurumForm(prev => ({ ...prev, image: '' }))} 
                                                style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label 
                                            style={{ 
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                                                height: '120px', background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' 
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#94a3b8'}
                                            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#cbd5e1'}
                                        >
                                            <Upload size={24} style={{ color: '#94a3b8' }} />
                                            <span style={{ fontSize: '13px', fontWeight: '800', color: '#475569' }}>Kapak Resmi Yükle</span>
                                            <span style={{ fontSize: '10px', color: '#94a3b8' }}>1920x400 Önerilir (Maks. 10MB)</span>
                                            <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: 'none' }} />
                                        </label>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                    <div className={styles.modalFooter} style={{ padding: '20px 32px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <button type="button" className={styles.btnCancel} onClick={onClose} style={{ padding: '10px 18px', fontSize: '13px' }}>
                            İPTAL
                        </button>
                        <button type="submit" className={styles.btnSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 22px', fontSize: '13px', marginTop: 0, background: kurumForm.color }}>
                            <Save size={14} />
                            <span>{editingKurum ? 'KAYDET' : 'EKLE'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
