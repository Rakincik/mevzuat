'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, User as UserIcon, BookOpen } from 'lucide-react'
import { useApp, Student } from '@/context/AppContext'
import styles from '../page.module.css'

interface UserModalProps {
    isOpen: boolean
    onClose: () => void
    editingStudent: Student | null
    triggerToast: (message: string) => void
}

export default function UserModal({ isOpen, onClose, editingStudent, triggerToast }: UserModalProps) {
    const { addStudent, updateStudent, products, kurumlar } = useApp()
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [status, setStatus] = useState<'active' | 'suspended'>('active')
    const [enrolledCourses, setEnrolledCourses] = useState<string[]>([])
    const [courseSearch, setCourseSearch] = useState('')

    useEffect(() => {
        if (isOpen) {
            if (editingStudent) {
                setName(editingStudent.name)
                setEmail(editingStudent.email)
                setPhone(editingStudent.phone)
                setStatus(editingStudent.status)
                setEnrolledCourses(editingStudent.enrolledCourses || [])
            } else {
                setName('')
                setEmail('')
                setPhone('')
                setStatus('active')
                setEnrolledCourses([])
            }
            setCourseSearch('')
        }
    }, [isOpen, editingStudent])

    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!name || !email) {
            alert('Lütfen ad ve e-posta alanlarını doldurun.')
            return
        }

        if (editingStudent) {
            updateStudent(editingStudent.id, {
                name,
                email,
                phone,
                status,
                enrolledCourses
            })
            triggerToast('Öğrenci bilgileri güncellendi.')
        } else {
            addStudent({
                id: 'usr_' + Math.random().toString(36).substr(2, 9),
                name,
                email,
                phone,
                status,
                enrolledCourses,
                createdAt: new Date().toISOString()
            })
            triggerToast('Yeni öğrenci eklendi.')
        }
        onClose()
    }

    const toggleCourse = (productId: string) => {
        setEnrolledCourses(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        )
    }

    const handleSelectAllCourses = () => {
        const allIds = products.map(p => p.id)
        setEnrolledCourses(allIds)
    }

    const handleClearCourses = () => {
        setEnrolledCourses([])
    }

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(courseSearch.toLowerCase()) || 
            (kurumlar.find(k => k.slug === product.kurumSlug)?.name || '').toLowerCase().includes(courseSearch.toLowerCase())
        return matchesSearch
    })

    return (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className={styles.modalContainer} style={{ maxWidth: '750px' }}>
                <div className={styles.modalHeader}>
                    <h2>{editingStudent ? 'Öğrenciyi Düzenle' : 'Yeni Öğrenci Ekle'}</h2>
                    <button onClick={onClose} className={styles.modalCloseBtn}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className={styles.modalBody} style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '28px', padding: '24px 28px' }}>
                        {/* Sol Kolon: Profil Bilgileri */}
                        <div className={styles.adminForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Live Initials Card */}
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '8px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px' }}>
                                    {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'}
                                </div>
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <h4 style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', margin: '0', textTransform: 'uppercase', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name || 'Yeni Öğrenci'}</h4>
                                    <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>{email || 'E-posta adresi girilmedi'}</span>
                                </div>
                            </div>

                            <h3 style={{ fontSize: '13px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155', margin: '0 0 4px 0' }}>
                                <UserIcon size={15} /> Profil Bilgileri
                            </h3>
                            
                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Öğrenci Adı Soyadı *</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder="Örn: Ahmet Yılmaz"
                                    className={styles.formInput}
                                    style={{ padding: '10px 14px', fontSize: '13px' }}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>E-posta Adresi *</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="Örn: ahmet@example.com"
                                    className={styles.formInput}
                                    style={{ padding: '10px 14px', fontSize: '13px' }}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Telefon Numarası</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                    placeholder="Örn: 0555 123 45 67"
                                    className={styles.formInput}
                                    style={{ padding: '10px 14px', fontSize: '13px' }}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label style={{ fontSize: '11px', fontWeight: '700', color: '#475569' }}>Hesap Durumu</label>
                                <select 
                                    value={status} 
                                    onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')}
                                    className={styles.formSelect}
                                    style={{ padding: '10px 14px', fontSize: '13px' }}
                                >
                                    <option value="active">Aktif (Giriş Yapabilir)</option>
                                    <option value="suspended">Askıya Alındı (Giriş Yapamaz)</option>
                                </select>
                            </div>
                        </div>

                        {/* Sağ Kolon: Manuel Eğitim Atama */}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <h3 style={{ fontSize: '13px', fontWeight: '800', margin: '0', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                                    <BookOpen size={15} /> Manuel Eğitim Tanımla
                                </h3>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        type="button" 
                                        onClick={handleSelectAllCourses} 
                                        style={{ border: 'none', background: 'none', color: '#3b82f6', fontSize: '10px', fontWeight: '700', cursor: 'pointer', padding: '0' }}
                                    >
                                        Tümünü Seç
                                    </button>
                                    <span style={{ color: '#cbd5e1', fontSize: '10px' }}>|</span>
                                    <button 
                                        type="button" 
                                        onClick={handleClearCourses} 
                                        style={{ border: 'none', background: 'none', color: '#ef4444', fontSize: '10px', fontWeight: '700', cursor: 'pointer', padding: '0' }}
                                    >
                                        Temizle
                                    </button>
                                </div>
                            </div>
                            <p style={{ fontSize: '11px', color: '#64748b', marginBottom: '10px', lineHeight: '1.4' }}>
                                Öğrencinin erişimi olacak eğitimleri işaretleyin.
                            </p>

                            {/* Search bar inside course assignment */}
                            <div style={{ position: 'relative', marginBottom: '10px' }}>
                                <input 
                                    type="text"
                                    placeholder="Eğitim veya bakanlık ara..."
                                    value={courseSearch}
                                    onChange={(e) => setCourseSearch(e.target.value)}
                                    className={styles.formInput}
                                    style={{ padding: '8px 12px', fontSize: '12px', width: '100%' }}
                                />
                            </div>

                            <div style={{ 
                                maxHeight: '250px', 
                                overflowY: 'auto', 
                                border: '1px solid #cbd5e1', 
                                borderRadius: '12px',
                                padding: '10px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '6px',
                                background: '#f8fafc',
                                flexGrow: 1
                            }}>
                                {filteredProducts.length === 0 ? (
                                    <p style={{ fontSize: '12px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Uyumlu eğitim bulunamadı.</p>
                                ) : (
                                    filteredProducts.map(product => {
                                        const isSelected = enrolledCourses.includes(product.id)
                                        return (
                                            <label key={product.id} style={{ 
                                                display: 'flex', 
                                                alignItems: 'flex-start', 
                                                gap: '10px', 
                                                padding: '8px 12px',
                                                borderRadius: '8px',
                                                background: isSelected ? '#ffffff' : 'transparent',
                                                border: isSelected ? '1px solid #0f172a' : '1px solid transparent',
                                                boxShadow: isSelected ? '0 4px 12px -4px rgba(15, 23, 42, 0.08)' : 'none',
                                                cursor: 'pointer',
                                                transition: 'all 0.15s ease'
                                            }}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={isSelected}
                                                    onChange={() => toggleCourse(product.id)}
                                                    style={{ marginTop: '3px', cursor: 'pointer' }}
                                                />
                                                <div>
                                                    <div style={{ fontSize: '12px', fontWeight: '700', color: isSelected ? '#0f172a' : '#334155', transition: 'color 0.15s ease' }}>{product.name}</div>
                                                    <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>{kurumlar.find(k => k.slug === product.kurumSlug)?.name || product.kurumSlug}</div>
                                                </div>
                                            </label>
                                        )
                                    })
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" onClick={onClose} className="btn btn-outline" style={{ padding: '8px 16px', fontSize: '13px' }}>İptal</button>
                        <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <Save size={14} />
                            <span>{editingStudent ? 'Değişiklikleri Kaydet' : 'Öğrenciyi Kaydet'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
