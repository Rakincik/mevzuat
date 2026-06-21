'use client'

import React, { useState } from 'react'
import { Search, Info, Trash2, AlertCircle } from 'lucide-react'
import { useApp, Order } from '@/context/AppContext'
import { CustomSelect } from './CustomSelect'
import styles from '../page.module.css'

interface OrdersTabProps {
    triggerToast: (message: string) => void
    onViewDetails: (order: Order) => void
}

export default function OrdersTab({ triggerToast, onViewDetails }: OrdersTabProps) {
    const { orders, updateOrderStatus, deleteOrder, triggerConfirm, bulkUpdateOrders } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('all')
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    const handleStatusChange = (orderId: string, status: Order['status']) => {
        updateOrderStatus(orderId, status)
        triggerToast('Sipariş durumu başarıyla güncellendi!')
    }

    const handleOrderDelete = (id: string) => {
        triggerConfirm({
            title: 'Siparişi Sil',
            message: 'Sipariş kaydını kalıcı olarak silmek istediğinize emin misiniz?',
            confirmText: 'Kayıtları Sil',
            cancelText: 'Vazgeç',
            isDangerous: true,
            onConfirm: () => {
                deleteOrder(id)
                triggerToast('Sipariş kaydı silindi.')
            }
        })
    }

    // Filter logic
    const filteredOrders = orders.filter(order => {
        const matchesStatus = selectedOrderStatus === 'all' || order.status === selectedOrderStatus
        const matchesSearch = 
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.id.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesStatus && matchesSearch
    })

    // Reset selection when filters change
    React.useEffect(() => {
        setSelectedIds([])
    }, [searchQuery, selectedOrderStatus])

    return (
        <div>
            <div className={styles.toolbar}>
                <div className={styles.filterControls}>
                    <div className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder="Müşteri adı, e-posta veya Sipariş ID ara..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInput}
                        />
                        <Search className={styles.searchIcon} size={16} />
                    </div>

                    <div className={styles.selectBox}>
                        <CustomSelect 
                            value={selectedOrderStatus}
                            onChange={(val) => setSelectedOrderStatus(val as string)}
                            options={[
                                { value: 'all', label: 'Tüm Durumlar' },
                                { value: 'PENDING', label: 'Beklemede (Ödeme Bekliyor)' },
                                { value: 'PAID', label: 'Ödendi (Aktif)' },
                                { value: 'SHIPPED', label: 'Kargolandı' },
                                { value: 'DELIVERED', label: 'Teslim Edildi' },
                                { value: 'CANCELLED', label: 'İptal Edildi' },
                            ]}
                        />
                    </div>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader} style={{ gridTemplateColumns: '40px 1.2fr 1.5fr 1fr 1fr 100px' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input 
                            type="checkbox" 
                            checked={filteredOrders.length > 0 && selectedIds.length === filteredOrders.length}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedIds(filteredOrders.map(o => o.id))
                                } else {
                                    setSelectedIds([])
                                }
                            }}
                            style={{ cursor: 'pointer' }}
                        />
                    </div>
                    <div>SİPARİŞ ID / TARİH</div>
                    <div>MÜŞTERİ BİLGİLERİ</div>
                    <div>TOPLAM TUTAR</div>
                    <div>SİPARİŞ DURUMU</div>
                    <div style={{ textAlign: 'right' }}>İŞLEMLER</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredOrders.map(order => (
                        <div key={order.id} className={styles.tableRow} style={{ gridTemplateColumns: '40px 1.2fr 1.5fr 1fr 1fr 100px' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <input 
                                    type="checkbox" 
                                    style={{ cursor: 'pointer' }}
                                    checked={selectedIds.includes(order.id)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedIds(prev => [...prev, order.id])
                                        } else {
                                            setSelectedIds(prev => prev.filter(id => id !== order.id))
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles.colName}>
                                <span className={styles.productName} style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{order.id}</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>
                                    {new Date(order.createdAt).toLocaleDateString('tr-TR')} {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className={styles.colName}>
                                <span style={{ fontSize: '13px', fontWeight: '600', color: '#0f172a' }}>{order.customerName}</span>
                                <span style={{ fontSize: '11px', color: '#64748b' }}>{order.customerEmail}</span>
                            </div>
                            <div className={styles.colPrice}>
                                <span style={{ fontWeight: 'bold', color: '#0f172a' }}>{order.total.toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <div>
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                    className={`${styles.statusDropdown} ${styles[`status-${order.status}`]}`}
                                >
                                    <option value="PENDING">BEKLEMEDE</option>
                                    <option value="PAID">ÖDENDİ</option>
                                    <option value="SHIPPED">KARGOLANDI</option>
                                    <option value="DELIVERED">TESLİM EDİLDİ</option>
                                    <option value="CANCELLED">İPTAL EDİLDİ</option>
                                </select>
                            </div>
                            <div className={styles.colAction}>
                                <button 
                                    className={styles.actionEditBtn}
                                    onClick={() => onViewDetails(order)}
                                    title="Sipariş Detaylarını Gör"
                                >
                                    <Info size={14} />
                                </button>
                                <button 
                                    className={styles.actionDeleteBtn}
                                    onClick={() => handleOrderDelete(order.id)}
                                    title="Sipariş Kaydını Sil"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {filteredOrders.length === 0 && (
                        <div className={styles.emptyTable}>
                            <AlertCircle size={36} className={styles.emptyIcon} />
                            <h3>Kayıtlı Sipariş Bulunamadı</h3>
                            <p>Arama veya filtre kriterlerinizle eşleşen bir sipariş kaydı bulunmamaktadır.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bulk Action Bar */}
            {selectedIds.length > 0 && (
                <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', padding: '16px 24px', borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', display: 'flex', gap: '20px', alignItems: 'center', zIndex: 100 }}>
                    <span style={{ color: 'white', fontWeight: 'bold' }}>{selectedIds.length} sipariş seçildi</span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span style={{ color: '#94a3b8', fontSize: '12px', marginRight: '8px' }}>Toplu Durum Değiştir:</span>
                        <select
                            onChange={(e) => {
                                if (e.target.value) {
                                    triggerConfirm({
                                        title: 'Toplu Durum Güncelleme',
                                        message: `Seçili ${selectedIds.length} siparişin durumunu güncellemek istediğinize emin misiniz?`,
                                        confirmText: 'Evet, Güncelle',
                                        onConfirm: () => {
                                            bulkUpdateOrders(selectedIds, { status: e.target.value as Order['status'] })
                                            setSelectedIds([])
                                            triggerToast(`${selectedIds.length} sipariş başarıyla güncellendi.`)
                                        }
                                    })
                                    e.target.value = "" // reset select after action
                                }
                            }}
                            className={styles.selectInput}
                            style={{ background: '#1e293b', color: 'white', border: '1px solid #334155', padding: '6px 12px', borderRadius: '6px', fontSize: '12px' }}
                            defaultValue=""
                        >
                            <option value="" disabled>Durum Seçin...</option>
                            <option value="PENDING">BEKLEMEDE</option>
                            <option value="PAID">ÖDENDİ</option>
                            <option value="SHIPPED">KARGOLANDI</option>
                            <option value="DELIVERED">TESLİM EDİLDİ</option>
                            <option value="CANCELLED">İPTAL EDİLDİ</option>
                        </select>
                        <button className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: '#334155', marginLeft: '12px' }} onClick={() => setSelectedIds([])}>Vazgeç</button>
                    </div>
                </div>
            )}
        </div>
    )
}
