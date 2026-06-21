'use client'

import React, { useState } from 'react'
import { Plus, Search, Edit3, Trash2, Users, AlertCircle } from 'lucide-react'
import { useApp, Student } from '@/context/AppContext'
import styles from '../page.module.css'

interface UsersTabProps {
    triggerToast: (message: string) => void
    onAddStudent: () => void
    onEditStudent: (student: Student) => void
}

export default function UsersTab({ triggerToast, onAddStudent, onEditStudent }: UsersTabProps) {
    const { students, deleteStudent, triggerConfirm, bulkDeleteStudents } = useApp()
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const filteredStudents = students.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.phone.includes(searchTerm)
    )

    // Reset selection when search changes
    React.useEffect(() => {
        setSelectedIds([])
    }, [searchTerm])

    const handleDelete = (id: string, name: string) => {
        triggerConfirm({
            title: 'Öğrenciyi Sil',
            message: `"${name}" isimli öğrenciyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
            confirmText: 'Sil',
            cancelText: 'Vazgeç',
            isDangerous: true,
            onConfirm: () => {
                deleteStudent(id)
                triggerToast('Öğrenci silindi.')
            }
        })
    }

    return (
        <div>
            {/* Toolbar */}
            <div className={styles.toolbar}>
                <div className={styles.filterControls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="İsim, e-posta veya telefon ile ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={styles.searchInput}
                        />
                        <Search className={styles.searchIcon} size={16} />
                    </div>
                </div>

                <button className={styles.btnAddItem} onClick={onAddStudent}>
                    <Plus size={16} />
                    <span>Yeni Öğrenci Ekle</span>
                </button>
            </div>

            {/* Table View */}
            <div className={styles.tableCard}>
                <div className={styles.tableHeader} style={{ gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="checkbox" 
                            checked={filteredStudents.length > 0 && selectedIds.length === filteredStudents.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedIds(filteredStudents.map(s => s.id))
                                } else {
                                    setSelectedIds([])
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <div className={styles.colName}>ÖĞRENCİ BİLGİLERİ</div>
                    <div>KAYITLI KURSLAR</div>
                    <div>DURUM</div>
                    <div>KAYIT TARİHİ</div>
                    <div className={styles.colAction} style={{ justifyContent: 'center' }}>İŞLEMLER</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredStudents.map(student => (
                        <div key={student.id} className={styles.tableRow} style={{ gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 100px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    style={{ cursor: 'pointer' }}
                                    checked={selectedIds.includes(student.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds(prev => [...prev, student.id])
                                        } else {
                                            setSelectedIds(prev => prev.filter(id => id !== student.id))
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles.colName}>
                                <div style={{ fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>{student.name}</div>
                                <div style={{ fontSize: '12px', color: '#64748b' }}>
                                    {student.email} • {student.phone}
                                </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '9999px',
                                    background: '#f1f5f9',
                                    color: '#475569',
                                    fontSize: '11px',
                                    fontWeight: '700',
                                    fontFamily: 'monospace'
                                }}>
                                    {student.enrolledCourses?.length || 0} KURS
                                </span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {student.status === 'active' ? (
                                    <span style={{ color: '#10b981', fontWeight: '700', fontSize: '12px', background: '#dcfce7', padding: '4px 8px', borderRadius: '4px' }}>AKTİF</span>
                                ) : (
                                    <span style={{ color: '#ef4444', fontWeight: '700', fontSize: '12px', background: '#fee2e2', padding: '4px 8px', borderRadius: '4px' }}>ASKIDA</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
                                {new Date(student.createdAt).toLocaleDateString('tr-TR')}
                            </div>

                            <div className={styles.colAction}>
                                <button 
                                    className={styles.actionEditBtn} 
                                    onClick={() => onEditStudent(student)}
                                    title="Düzenle"
                                >
                                    <Edit3 size={14} />
                                </button>
                                <button 
                                    className={styles.actionDeleteBtn} 
                                    onClick={() => handleDelete(student.id, student.name)}
                                    title="Sil"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredStudents.length === 0 && (
                        <div className={styles.emptyTable}>
                            <AlertCircle size={36} className={styles.emptyIcon} />
                            <h3>Öğrenci Bulunamadı</h3>
                            <p>
                                {students.length === 0 
                                    ? "Platforma kayıtlı herhangi bir öğrenci bulunmamaktadır." 
                                    : "Arama kriterlerinize uygun öğrenci bulunamadı."}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 100 }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedIds.length} öğrenci seçildi</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            className="btn btn-sm" 
                            style={{ background: '#ef4444', color: 'white', border: 'none' }}
                            onClick={() => {
                                triggerConfirm({
                                    title: 'Toplu Silme',
                                    message: `Seçili ${selectedIds.length} öğrenciyi kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`,
                                    isDangerous: true,
                                    confirmText: 'Evet, Sil',
                                    onConfirm: () => {
                                        bulkDeleteStudents(selectedIds)
                                        setSelectedIds([])
                                        triggerToast(`${selectedIds.length} öğrenci başarıyla silindi.`)
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
