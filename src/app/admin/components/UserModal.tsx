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

    return (
        <div className={styles.modalOverlay} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className={styles.modalContent} style={{ maxWidth: '700px' }}>
                <div className={styles.modalHeader}>
                    <h2>{editingStudent ? 'Öğrenciyi Düzenle' : 'Yeni Öğrenci Ekle'}</h2>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className={styles.modalBody}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        {/* Sol Kolon: Profil Bilgileri */}
                        <div>
                            <h3 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                                <UserIcon size={16} /> Profil Bilgileri
                            </h3>
                            
                            <div className={styles.formGroup}>
                                <label>Öğrenci Adı Soyadı</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    placeholder="Örn: Ahmet Yılmaz"
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>E-posta Adresi</label>
                                <input 
                                    type="email" 
                                    value={email} 
                                    onChange={e => setEmail(e.target.value)} 
                                    placeholder="Örn: ahmet@example.com"
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Telefon Numarası</label>
                                <input 
                                    type="text" 
                                    value={phone} 
                                    onChange={e => setPhone(e.target.value)} 
                                    placeholder="Örn: 0555 123 45 67"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>Hesap Durumu</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value as 'active' | 'suspended')}>
                                    <option value="active">Aktif (Giriş Yapabilir)</option>
                                    <option value="suspended">Askıya Alındı (Giriş Yapamaz)</option>
                                </select>
                            </div>
                        </div>

                        {/* Sağ Kolon: Manuel Eğitim Atama */}
                        <div>
                            <h3 style={{ fontSize: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: '#334155' }}>
                                <BookOpen size={16} /> Manuel Eğitim Tanımla
                            </h3>
                            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '12px', lineHeight: '1.5' }}>
                                Öğrencinin erişim yetkisi olduğu kursları aşağıdan seçebilirsiniz. Öğrenci giriş yaptığında bu kursları panellerinde göreceklerdir.
                            </p>

                            <div style={{ 
                                maxHeight: '300px', 
                                overflowY: 'auto', 
                                border: '1px solid #e2e8f0', 
                                borderRadius: '8px',
                                padding: '12px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '8px'
                            }}>
                                {products.length === 0 ? (
                                    <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', padding: '20px 0' }}>Sistemde kayıtlı kurs bulunamadı.</p>
                                ) : (
                                    products.map(product => (
                                        <label key={product.id} style={{ 
                                            display: 'flex', 
                                            alignItems: 'flex-start', 
                                            gap: '10px', 
                                            padding: '8px',
                                            borderRadius: '6px',
                                            background: enrolledCourses.includes(product.id) ? '#eff6ff' : 'transparent',
                                            border: enrolledCourses.includes(product.id) ? '1px solid #bfdbfe' : '1px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}>
                                            <input 
                                                type="checkbox" 
                                                checked={enrolledCourses.includes(product.id)}
                                                onChange={() => toggleCourse(product.id)}
                                                style={{ marginTop: '4px' }}
                                            />
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: '500', color: '#0f172a' }}>{product.name}</div>
                                                <div style={{ fontSize: '11px', color: '#64748b' }}>{kurumlar.find(k => k.slug === product.kurumSlug)?.name || product.kurumSlug}</div>
                                            </div>
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalFooter} style={{ marginTop: '24px' }}>
                        <button type="button" onClick={onClose} className="btn btn-outline">İptal</button>
                        <button type="submit" className="btn btn-primary">
                            <Save size={16} />
                            {editingStudent ? 'Değişiklikleri Kaydet' : 'Öğrenciyi Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
