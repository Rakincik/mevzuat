'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Sparkles } from 'lucide-react'
import { useApp, AltKategori } from '@/context/AppContext'
import styles from '../page.module.css'

interface AltKategoriModalProps {
    isOpen: boolean
    onClose: () => void
    editingAltKategori: AltKategori | null
    triggerToast: (message: string) => void
    initialKurumSlug?: string // Hangi kurum seçiliyken ekle dediysek o pre-checked gelir
}

export default function AltKategoriModal({ isOpen, onClose, editingAltKategori, triggerToast, initialKurumSlug }: AltKategoriModalProps) {
    const { addAltKategori, updateAltKategori, kurumlar } = useApp()
    const [isSlugPristine, setIsSlugPristine] = useState(true)
    const [catForm, setCatForm] = useState({
        name: '',
        slug: '',
        description: '',
        kurumSlugs: [] as string[],
        order: 999,
        status: 'active' as 'active' | 'passive',
        showOnHomepage: false
    })

    // Sync form state when modal opens/changes
    useEffect(() => {
        if (editingAltKategori) {
            setCatForm({
                name: editingAltKategori.name,
                slug: editingAltKategori.slug,
                description: editingAltKategori.description || '',
                kurumSlugs: editingAltKategori.kurumSlugs || [],
                order: editingAltKategori.order !== undefined ? editingAltKategori.order : 999,
                status: editingAltKategori.status || 'active',
                showOnHomepage: editingAltKategori.showOnHomepage !== undefined ? editingAltKategori.showOnHomepage : false
            })
            setIsSlugPristine(false)
        } else {
            setCatForm({
                name: '',
                slug: '',
                description: '',
                kurumSlugs: initialKurumSlug ? [initialKurumSlug] : [],
                order: 999,
                status: 'active',
                showOnHomepage: false
            })
            setIsSlugPristine(true)
        }
    }, [editingAltKategori, isOpen, initialKurumSlug])

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
        const nextSlug = isSlugPristine ? slugify(nameVal) : catForm.slug
        setCatForm(prev => ({
            ...prev,
            name: nameVal,
            slug: nextSlug
        }))
    }

    const handleKurumToggle = (slug: string) => {
        setCatForm(prev => {
            const alreadySelected = prev.kurumSlugs.includes(slug)
            const nextSlugs = alreadySelected
                ? prev.kurumSlugs.filter(s => s !== slug)
                : [...prev.kurumSlugs, slug]
            return {
                ...prev,
                kurumSlugs: nextSlugs
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!catForm.name) {
            alert('Lütfen Alt Kategori Adı alanını doldurun.')
            return
        }

        if (catForm.kurumSlugs.length === 0) {
            alert('Lütfen en az bir tane Üst Kurum / Bakanlık seçin.')
            return
        }

        const calculatedSlug = catForm.slug.trim() || slugify(catForm.name)

        const catData = {
            name: catForm.name.trim(),
            slug: calculatedSlug,
            description: catForm.description.trim(),
            kurumSlugs: catForm.kurumSlugs,
            order: catForm.order,
            status: catForm.status,
            showOnHomepage: catForm.showOnHomepage
        }

        if (editingAltKategori) {
            updateAltKategori(editingAltKategori.id, catData)
            triggerToast('Alt kategori başarıyla güncellendi!')
        } else {
            const newCat: AltKategori = {
                id: 'altcat_' + Date.now(),
                ...catData
            }
            addAltKategori(newCat)
            triggerToast('Yeni alt kategori başarıyla eklendi!')
        }

        onClose()
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer} style={{ maxWidth: '580px', borderRadius: '16px' }}>
                <div className={styles.modalHeader} style={{ background: '#f8fafc', padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a', margin: '0' }}>
                        {editingAltKategori ? '📂 ALT KATEGORİYİ DÜZENLE' : '✨ YENİ ALT KATEGORİ TANIMLA'}
                    </h2>
                    <button className={styles.modalCloseBtn} onClick={onClose} style={{ padding: '8px', background: '#f1f5f9' }}>
                        <X size={18} />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody} style={{ padding: '24px 28px' }}>
                        <div className={styles.adminForm} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="cat-name" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Alt Kategori / Sınav Grubu Başlığı *</label>
                                <input 
                                    id="cat-name"
                                    type="text"
                                    required
                                    value={catForm.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    className={styles.formInput}
                                    style={{ padding: '12px 16px', fontSize: '14px' }}
                                    placeholder="Örn: Görevde Yükselme Sınavı (GYS)"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="cat-slug" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Link Slug (URL Adresi)</label>
                                <input 
                                    id="cat-slug"
                                    type="text"
                                    value={catForm.slug}
                                    onChange={(e) => {
                                        setCatForm({ ...catForm, slug: e.target.value })
                                        setIsSlugPristine(false)
                                    }}
                                    className={styles.formInput}
                                    style={{ padding: '12px 16px', fontSize: '14px' }}
                                    placeholder="Örn: gorevde-yukselme-sinavi"
                                />
                                {isSlugPristine && catForm.name && (
                                    <div style={{ color: '#6366f1', fontSize: '11px', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                                        <Sparkles size={11} />
                                        <span>Başlıktan otomatik üretiliyor...</span>
                                    </div>
                                )}
                            </div>

                            {/* Institutions checkbox grid */}
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '8px', display: 'block' }}>Bağlı Olduğu Bakanlık / Üst Kurumlar * (Çoklu seçebilirsiniz)</label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px', background: '#f8fafc', padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: '180px', overflowY: 'auto' }}>
                                    {kurumlar.map(k => {
                                        const isChecked = catForm.kurumSlugs.includes(k.slug)
                                        return (
                                            <label 
                                                key={k.slug}
                                                style={{ 
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    gap: '8px', 
                                                    padding: '8px 10px', 
                                                    background: isChecked ? '#eff6ff' : 'white', 
                                                    border: isChecked ? `2px solid ${k.color || '#3b82f6'}` : '1px solid #cbd5e1', 
                                                    borderRadius: '6px', 
                                                    cursor: 'pointer',
                                                    transition: 'all 0.15s ease',
                                                    fontSize: '12px',
                                                    fontWeight: '700',
                                                    color: '#1e293b'
                                                }}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    checked={isChecked}
                                                    onChange={() => handleKurumToggle(k.slug)}
                                                    style={{ width: '15px', height: '15px', cursor: 'pointer' }}
                                                />
                                                <span>{k.name}</span>
                                            </label>
                                        )
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div className={styles.formGroup}>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Sıra Numarası</label>
                                    <input 
                                        type="number"
                                        value={catForm.order}
                                        onChange={(e) => setCatForm({ ...catForm, order: parseInt(e.target.value) || 0 })}
                                        className={styles.formInput}
                                        style={{ padding: '10px 14px', fontSize: '14px' }}
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Durum</label>
                                    <select 
                                        value={catForm.status}
                                        onChange={(e) => setCatForm({ ...catForm, status: e.target.value as 'active' | 'passive' })}
                                        className={styles.formInput}
                                        style={{ padding: '10px 14px', fontSize: '14px' }}
                                    >
                                        <option value="active">Aktif</option>
                                        <option value="passive">Pasif (Gizli)</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                                <input 
                                    id="cat-showOnHomepage"
                                    type="checkbox" 
                                    checked={catForm.showOnHomepage}
                                    onChange={(e) => setCatForm({ ...catForm, showOnHomepage: e.target.checked })}
                                    style={{ width: '16px', height: '16px', cursor: 'pointer', margin: 0 }}
                                />
                                <label htmlFor="cat-showOnHomepage" style={{ fontSize: '13px', fontWeight: '700', color: '#334155', cursor: 'pointer', margin: 0 }}>
                                    Ana Sayfada Öne Çıkar (Popüler Sınav Grupları sekmesinde gösterilir)
                                </label>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="cat-desc" style={{ fontSize: '13px', fontWeight: '700', color: '#334155' }}>Alt Kategori Açıklaması</label>
                                <textarea 
                                    id="cat-desc"
                                    value={catForm.description}
                                    onChange={(e) => setCatForm({ ...catForm, description: e.target.value })}
                                    className={styles.formTextarea}
                                    style={{ minHeight: '100px', padding: '12px 14px', fontSize: '13px' }}
                                    placeholder="Bu gruptaki sınavlar, hedeflenen kadrolar veya ders içerikleri hakkında kısa bilgi yazın..."
                                />
                            </div>

                        </div>
                    </div>
                    <div className={styles.modalFooter} style={{ padding: '18px 28px', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                        <button type="button" className={styles.btnCancel} onClick={onClose} style={{ padding: '10px 18px', fontSize: '13px' }}>
                            İPTAL
                        </button>
                        <button type="submit" className={styles.btnSubmit} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '10px 20px', fontSize: '13px', marginTop: 0 }}>
                            <Save size={14} />
                            <span>{editingAltKategori ? 'KAYDET' : 'EKLE'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
