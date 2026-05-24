'use client'

import React, { useState } from 'react'
import { Search, Info, Trash2, AlertCircle } from 'lucide-react'
import { useApp, Order } from '@/context/AppContext'
import styles from '../page.module.css'

interface OrdersTabProps {
    triggerToast: (message: string) => void
    onViewDetails: (order: Order) => void
}

export default function OrdersTab({ triggerToast, onViewDetails }: OrdersTabProps) {
    const { orders, updateOrderStatus, deleteOrder, triggerConfirm } = useApp()
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedOrderStatus, setSelectedOrderStatus] = useState('all')

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
                        <select
                            value={selectedOrderStatus}
                            onChange={(e) => setSelectedOrderStatus(e.target.value)}
                            className={styles.selectInput}
                        >
                            <option value="all">Tüm Durumlar</option>
                            <option value="PENDING">Beklemede (Ödeme Bekliyor)</option>
                            <option value="PAID">Ödendi (Aktif)</option>
                            <option value="SHIPPED">Kargolandı</option>
                            <option value="DELIVERED">Teslim Edildi</option>
                            <option value="CANCELLED">İptal Edildi</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.tableCard}>
                <div className={styles.tableHeader} style={{ gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 100px' }}>
                    <div>SİPARİŞ ID / TARİH</div>
                    <div>MÜŞTERİ BİLGİLERİ</div>
                    <div>TOPLAM TUTAR</div>
                    <div>SİPARİŞ DURUMU</div>
                    <div style={{ textAlign: 'right' }}>İŞLEMLER</div>
                </div>

                <div className={styles.tableBody}>
                    {filteredOrders.map(order => (
                        <div key={order.id} className={styles.tableRow} style={{ gridTemplateColumns: '1.2fr 1.5fr 1fr 1fr 100px' }}>
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
        </div>
    )
}
