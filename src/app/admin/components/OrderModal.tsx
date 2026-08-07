'use client'

import React from 'react'
import { X, User, Mail, Phone, Calendar, MessageCircle, Printer, CreditCard, FileText, CheckCircle2, XCircle } from 'lucide-react'
import { useApp, Order } from '@/context/AppContext'
import styles from '../page.module.css'

interface OrderModalProps {
    order: Order | null
    onClose: () => void
}

export default function OrderModal({ order, onClose }: OrderModalProps) {
    const { updateOrderStatus, triggerConfirm } = useApp()
    if (!order) return null

    const handlePrint = () => {
        window.print()
    }

    const whatsappMessage = encodeURIComponent(
        `Merhaba ${order.customerName},\n\nMEVZUAT ADAM platformundan oluşturduğunuz ${order.id} kodlu siparişiniz alınmıştır. Aktivasyon işlemleriniz ve ders paneli şifreniz hakkında görüşmek için yazıyorum.`
    )
    const whatsappUrl = `https://wa.me/${order.customerPhone.replace(/\+/g, '').replace(/\s+/g, '')}?text=${whatsappMessage}`

    return (
        <div className={styles.modalOverlay}>
            <div id="print-area" className={styles.modalContainer} style={{ maxWidth: '580px' }}>
                <div className={styles.modalHeader}>
                    <h2>SİPARİŞ DETAYI: {order.id}</h2>
                    <button className={styles.modalCloseBtn} onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.orderDetailGrid}>
                        <div className={styles.orderDetailItem}>
                            <div className={styles.orderDetailItemLabel}>Müşteri Adı</div>
                            <div className={styles.orderDetailItemVal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={12} color="#64748b" />
                                <span>{order.customerName}</span>
                            </div>
                        </div>
                        <div className={styles.orderDetailItem}>
                            <div className={styles.orderDetailItemLabel}>E-posta</div>
                            <div className={styles.orderDetailItemVal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Mail size={12} color="#64748b" />
                                <span style={{ fontSize: '12px' }}>{order.customerEmail}</span>
                            </div>
                        </div>
                        <div className={styles.orderDetailItem}>
                            <div className={styles.orderDetailItemLabel}>Telefon</div>
                            <div className={styles.orderDetailItemVal} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <Phone size={12} color="#64748b" />
                                    <span>{order.customerPhone}</span>
                                </div>
                                <a 
                                    href={whatsappUrl}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    style={{ 
                                        display: 'inline-flex', 
                                        alignItems: 'center', 
                                        gap: '4px', 
                                        fontSize: '11px', 
                                        color: '#16a34a', 
                                        fontWeight: 'bold', 
                                        textDecoration: 'none', 
                                        background: '#dcfce7', 
                                        padding: '2px 8px', 
                                        borderRadius: '4px', 
                                        border: '1px solid #bbf7d0',
                                        transition: 'all 0.2s ease'
                                    }}
                                    title="WhatsApp'tan İletişime Geç"
                                >
                                    <MessageCircle size={12} />
                                    <span>WhatsApp</span>
                                </a>
                            </div>
                        </div>
                        <div className={styles.orderDetailItem}>
                            <div className={styles.orderDetailItemLabel}>Sipariş Tarihi</div>
                            <div className={styles.orderDetailItemVal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Calendar size={12} color="#64748b" />
                                <span>{new Date(order.createdAt).toLocaleDateString('tr-TR')} {new Date(order.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                        </div>
                        <div className={styles.orderDetailItem}>
                            <div className={styles.orderDetailItemLabel}>Ödeme Yöntemi</div>
                            <div className={styles.orderDetailItemVal} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <CreditCard size={12} color="#64748b" />
                                <span style={{ fontWeight: 'bold', color: order.paymentMethod === 'havale' ? '#16a34a' : '#2563eb' }}>
                                    {order.paymentMethod === 'havale' ? 'EFT / Banka Havalesi' : 'Kredi Kartı'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <h4 style={{ fontSize: '13px', fontWeight: 'bold', textTransform: 'uppercase', color: '#475569', letterSpacing: '0.02em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Sipariş Edilen Eğitimler</h4>
                        <div className={styles.orderItemsList}>
                            {order.items.map(item => (
                                <div key={item.id} className={styles.orderItemRow}>
                                    <span className={styles.orderItemName}>{item.name}</span>
                                    <span className={styles.orderItemQtyPrice}>{item.quantity} Adet × {item.price.toLocaleString('tr-TR')} ₺</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginTop: '20px', background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                            <span>Ara Toplam</span>
                            <span>{order.subTotal.toLocaleString('tr-TR')} ₺</span>
                        </div>
                        {order.discount > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#16a34a', fontWeight: '600', marginBottom: '6px' }}>
                                <span>Uygulanan İndirim</span>
                                <span>-{order.discount.toLocaleString('tr-TR')} ₺</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#475569', marginBottom: '8px' }}>
                            <span>KDV (%18)</span>
                            <span>{order.tax.toLocaleString('tr-TR')} ₺</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', color: '#0f172a', fontWeight: 'bold', borderTop: '1px solid #e2e8f0', paddingTop: '8px' }}>
                            <span>Genel Toplam</span>
                            <span>{order.total.toLocaleString('tr-TR')} ₺</span>
                        </div>
                    </div>

                    {order.paymentMethod === 'havale' && (
                        <div style={{ marginTop: '20px', background: '#f0fdf4', padding: '16px', borderRadius: '8px', border: '1.5px dashed #10b981' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 'bold', color: '#14532d', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <FileText size={16} />
                                <span>Ödeme Dekontu (Öğrenci Yüklemesi)</span>
                            </h4>
                            {order.receipt ? (
                                <div>
                                    {order.receipt.startsWith('data:application/pdf') ? (
                                        <a 
                                            href={order.receipt} 
                                            download={`dekont-${order.id}.pdf`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '10px 16px',
                                                background: 'white',
                                                border: '1px solid #bbf7d0',
                                                borderRadius: '6px',
                                                color: '#15803d',
                                                fontSize: '13px',
                                                fontWeight: 'bold',
                                                textDecoration: 'none',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                                            }}
                                        >
                                            📄 PDF Dekontu İndir
                                        </a>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            <div style={{ maxWidth: '100%', maxHeight: '240px', overflow: 'hidden', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                                <img 
                                                    src={order.receipt} 
                                                    alt="Dekont" 
                                                    style={{ width: '100%', height: 'auto', objectFit: 'contain', cursor: 'pointer' }}
                                                    onClick={() => {
                                                        const win = window.open();
                                                        if (win) win.document.write(`<img src="${order.receipt}" style="max-width:100%; height:auto;" />`);
                                                    }}
                                                    title="Tam boyutta görmek için tıklayın"
                                                />
                                            </div>
                                            <a 
                                                href={order.receipt} 
                                                download={`dekont-${order.id}.png`}
                                                style={{
                                                    alignSelf: 'flex-start',
                                                    fontSize: '12px',
                                                    color: '#15803d',
                                                    fontWeight: 'bold',
                                                    textDecoration: 'underline'
                                                }}
                                            >
                                                Görsel Dekontu Bilgisayara İndir
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <p style={{ fontSize: '12px', color: '#b45309', fontWeight: 'bold' }}>
                                    ⚠ Dekont yüklenmemiş!
                                </p>
                            )}
                        </div>
                    )}
                </div>
                <div className={styles.modalFooter} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <button 
                        type="button" 
                        className={styles.btnCancel} 
                        onClick={handlePrint}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', margin: 0 }}
                    >
                        <Printer size={15} />
                        <span>Yazdır</span>
                    </button>
                    
                    {order.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button 
                                type="button" 
                                className="btn btn-outline" 
                                style={{ color: '#ef4444', borderColor: '#fca5a5', marginTop: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                                onClick={() => {
                                    triggerConfirm({
                                        title: 'Siparişi İptal Et',
                                        message: 'Bu siparişi iptal etmek istediğinize emin misiniz?',
                                        confirmText: 'Evet, İptal Et',
                                        cancelText: 'Vazgeç',
                                        isDangerous: true,
                                        onConfirm: () => {
                                            updateOrderStatus(order.id, 'CANCELLED')
                                            onClose()
                                        }
                                    })
                                }}
                            >
                                <XCircle size={14} />
                                <span>Reddet / İptal Et</span>
                            </button>
                            <button 
                                type="button" 
                                className="btn btn-primary" 
                                style={{ background: '#10b981', borderColor: '#10b981', marginTop: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px' }}
                                onClick={() => {
                                    triggerConfirm({
                                        title: 'Ödemeyi Onayla',
                                        message: 'Bu siparişin ödemesini onaylamak ve eğitimleri aktif etmek istediğinize emin misiniz?',
                                        confirmText: 'Evet, Onayla',
                                        cancelText: 'Vazgeç',
                                        onConfirm: () => {
                                            updateOrderStatus(order.id, 'PAID')
                                            onClose()
                                        }
                                    })
                                }}
                            >
                                <CheckCircle2 size={14} />
                                <span>Ödemeyi Onayla</span>
                            </button>
                        </div>
                    ) : (
                        <button type="button" className="btn btn-primary" onClick={onClose} style={{ marginTop: 0 }}>
                            KAPAT
                        </button>
                    )}
                </div>
            </div>

            {/* Print only CSS styling */}
            <style>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    #print-area, #print-area * {
                        visibility: visible;
                    }
                    #print-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                        margin: 0;
                        padding: 0;
                        border: none !important;
                        box-shadow: none !important;
                        background: white !important;
                        color: black !important;
                    }
                    .modalCloseBtn, button, a {
                        display: none !important;
                    }
                    .orderDetailItem {
                        border: 1px solid #cbd5e1 !important;
                        background: #f8fafc !important;
                    }
                }
            `}</style>
        </div>
    )
}
