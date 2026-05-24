'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { 
    Settings as SettingsIcon, ShoppingBag, BookOpen, Percent, 
    FileText, ArrowLeft, Star, Plus, Check, CreditCard, LogOut
} from 'lucide-react'
import { useApp, Product, Order, Kurum, EditablePage, AltKategori } from '@/context/AppContext'
import styles from './page.module.css'

// Dynamic import of modular tab sub-components (lazy loads on-demand)
const SettingsTab = dynamic(() => import('./components/SettingsTab'), { ssr: false })
const OrdersTab = dynamic(() => import('./components/OrdersTab'), { ssr: false })
const ProductsTab = dynamic(() => import('./components/ProductsTab'), { ssr: false })
const KurumlarTab = dynamic(() => import('./components/KurumlarTab'), { ssr: false })
const FeaturedTab = dynamic(() => import('./components/FeaturedTab'), { ssr: false })
const CouponsTab = dynamic(() => import('./components/CouponsTab'), { ssr: false })
const PagesTab = dynamic(() => import('./components/PagesTab'), { ssr: false })

// Dynamic import of modular modal components (lazy loads on-demand)
const OrderModal = dynamic(() => import('./components/OrderModal'), { ssr: false })
const ProductModal = dynamic(() => import('./components/ProductModal'), { ssr: false })
const KurumModal = dynamic(() => import('./components/KurumModal'), { ssr: false })
const PageCMSModal = dynamic(() => import('./components/PageCMSModal'), { ssr: false })
const AltKategoriModal = dynamic(() => import('./components/AltKategoriModal'), { ssr: false })

export default function AdminPage() {
    const { 
        products, kurumlar, orders, coupons, resetAllData, triggerConfirm 
    } = useApp()

    const [authorized, setAuthorized] = useState<boolean | null>(null)
    const router = useRouter()

    useEffect(() => {
        const auth = localStorage.getItem('admin_auth')
        if (auth === 'true') {
            setAuthorized(true)
        } else {
            setAuthorized(false)
            router.push('/auth/login')
        }
    }, [router])

    const handleLogout = () => {
        localStorage.removeItem('admin_auth')
        router.push('/auth/login')
    }

    const [activeTab, setActiveTab] = useState<'settings' | 'orders' | 'products' | 'kurumlar' | 'featured' | 'coupons' | 'pages'>('settings')

    // Toast state
    const [showSuccessToast, setShowSuccessToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    // Modal open states
    const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null)
    const [isProductModalOpen, setIsProductModalOpen] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [isKurumModalOpen, setIsKurumModalOpen] = useState(false)
    const [editingKurum, setEditingKurum] = useState<Kurum | null>(null)
    const [isAltKategoriModalOpen, setIsAltKategoriModalOpen] = useState(false)
    const [editingAltKategori, setEditingAltKategori] = useState<AltKategori | null>(null)
    const [initialKurumSlugForAltCat, setInitialKurumSlugForAltCat] = useState<string | undefined>(undefined)
    const [isPageModalOpen, setIsPageModalOpen] = useState(false)
    const [editingPage, setEditingPage] = useState<EditablePage | null>(null)

    const triggerToast = (message: string) => {
        setToastMessage(message)
        setShowSuccessToast(true)
        setTimeout(() => setShowSuccessToast(false), 3000)
    }

    const handleResetAll = () => {
        triggerConfirm({
            title: 'Sistemi Sıfırla',
            message: 'Tüm verileri varsayılana sıfırlamak istediğinize emin misiniz? Yapılan tüm ekleme, silme, kupon ve sipariş işlemleri kaybolacaktır!',
            confirmText: 'Sıfırla',
            cancelText: 'Vazgeç',
            isDangerous: true,
            onConfirm: () => {
                resetAllData()
                triggerToast('Tüm veriler fabrika ayarlarına sıfırlandı.')
            }
        })
    }

    // Modal open triggers
    const openAddProductModal = () => {
        setEditingProduct(null)
        setIsProductModalOpen(true)
    }

    const openEditProductModal = (product: Product) => {
        setEditingProduct(product)
        setIsProductModalOpen(true)
    }

    const openAddKurumModal = () => {
        setEditingKurum(null)
        setIsKurumModalOpen(true)
    }

    const openEditKurumModal = (kurum: Kurum) => {
        setEditingKurum(kurum)
        setIsKurumModalOpen(true)
    }

    const openAddAltKategoriModal = (initialKurumSlug?: string) => {
        setEditingAltKategori(null)
        setInitialKurumSlugForAltCat(initialKurumSlug)
        setIsAltKategoriModalOpen(true)
    }

    const openEditAltKategoriModal = (cat: AltKategori) => {
        setEditingAltKategori(cat)
        setInitialKurumSlugForAltCat(undefined)
        setIsAltKategoriModalOpen(true)
    }

    const openEditPageModal = (page: EditablePage) => {
        setEditingPage(page)
        setIsPageModalOpen(true)
    }

    // Statistics calculations
    const activeOrders = orders.filter(o => o.status !== 'CANCELLED')
    const totalSalesRevenue = activeOrders.reduce((sum, o) => sum + o.total, 0)

    if (authorized === null || authorized === false) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                color: 'var(--text-secondary)'
            }}>
                <div style={{
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid var(--color-primary)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    animation: 'spin 1s linear infinite',
                    marginBottom: '16px'
                }} />
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
                <span>Yönetici yetkisi doğrulanıyor...</span>
            </div>
        )
    }

    return (
        <div className="container section">
            {/* Header Area */}
            <div className={styles.adminHeader}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <Image
                            src="/images/logo.png"
                            alt="MEVZUAT ADAM"
                            width={160}
                            height={48}
                            style={{ height: '45px', width: 'auto', objectFit: 'contain' }}
                            priority
                        />
                        <div style={{ width: '2px', height: '30px', background: '#e2e8f0' }} />
                        <h1 className={styles.adminTitle} style={{ margin: 0, fontSize: '1.6rem', fontWeight: 'var(--font-extrabold)' }}>Admin Paneli</h1>
                    </div>

                    <Link href="/" className={styles.backBtn} style={{ margin: 0 }}>
                        <ArrowLeft size={14} />
                        <span>Ana Sayfaya Dön</span>
                    </Link>
                </div>
            </div>

            {/* Layout Wrapper Grid */}
            <div className={styles.adminLayout}>
                {/* Left Sidebar Menu */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarBrand}>
                        <span className={styles.sidebarBrandName}>Mevzuat Adam</span>
                    </div>

                    <div className={styles.sidebarMenu}>
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'settings' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('settings')}
                        >
                            <SettingsIcon size={16} />
                            <span>Genel Ayarlar</span>
                        </button>
                        
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'orders' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('orders')}
                        >
                            <ShoppingBag size={16} />
                            <span>Sipariş Yönetimi</span>
                        </button>
                        
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('products')}
                        >
                            <BookOpen size={16} />
                            <span>Eğitim Yönetimi</span>
                        </button>
                        
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'kurumlar' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('kurumlar')}
                        >
                            <Plus size={16} />
                            <span>Kategori Yönetimi</span>
                        </button>

                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'featured' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('featured')}
                        >
                            <Star size={16} />
                            <span>Öne Çıkanlar</span>
                        </button>
                        
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'coupons' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('coupons')}
                        >
                            <Percent size={16} />
                            <span>Kupon Yönetimi</span>
                        </button>
                        
                        <button 
                            className={`${styles.tabBtn} ${activeTab === 'pages' ? styles.tabActive : ''}`}
                            onClick={() => setActiveTab('pages')}
                        >
                            <FileText size={16} />
                            <span>Sayfa Yönetimi</span>
                        </button>
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid #cbd5e1', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <button 
                            onClick={handleResetAll}
                            className={styles.actionDeleteBtn}
                            style={{ width: '100%', padding: '8px 12px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                            title="Tüm verileri varsayılana sıfırlar"
                        >
                            Verileri Sıfırla
                        </button>
                        <button 
                            onClick={handleLogout}
                            className="btn btn-outline"
                            style={{ 
                                width: '100%', 
                                padding: '8px 12px', 
                                fontSize: '11px', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '6px',
                                color: '#ef4444',
                                borderColor: '#fca5a5',
                                background: 'white'
                            }}
                            title="Güvenli çıkış yap"
                        >
                            <LogOut size={12} />
                            <span>Güvenli Çıkış</span>
                        </button>
                    </div>
                </aside>

                {/* Right Content Area */}
                <main className={styles.mainContent}>
                    {/* Stats Bento Grid */}
                    <div className={styles.statsBar}>
                        <div className={styles.statCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={styles.statVal}>{totalSalesRevenue.toLocaleString('tr-TR')} ₺</span>
                                <div style={{ padding: '8px', borderRadius: '50%', background: '#dcfce7', color: '#15803d' }}>
                                    <CreditCard size={18} />
                                </div>
                            </div>
                            <span className={styles.statLabel}>Toplam Ciro (Aktif)</span>
                        </div>
                        <div className={styles.statCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={styles.statVal}>{orders.length}</span>
                                <div style={{ padding: '8px', borderRadius: '50%', background: '#eff6ff', color: '#2563eb' }}>
                                    <ShoppingBag size={18} />
                                </div>
                            </div>
                            <span className={styles.statLabel}>Sipariş Sayısı</span>
                        </div>
                        <div className={styles.statCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={styles.statVal}>{products.length}</span>
                                <div style={{ padding: '8px', borderRadius: '50%', background: '#faf5ff', color: '#7c3aed' }}>
                                    <BookOpen size={18} />
                                </div>
                            </div>
                            <span className={styles.statLabel}>Toplam Ders/Eğitim</span>
                        </div>
                        <div className={styles.statCard}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span className={styles.statVal}>{coupons.length}</span>
                                <div style={{ padding: '8px', borderRadius: '50%', background: '#fff7ed', color: '#ea580c' }}>
                                    <Percent size={18} />
                                </div>
                            </div>
                            <span className={styles.statLabel}>Aktif Kuponlar</span>
                        </div>
                    </div>

                    {/* Active Tab Router */}
                    {activeTab === 'settings' && <SettingsTab triggerToast={triggerToast} />}
                    {activeTab === 'orders' && <OrdersTab triggerToast={triggerToast} onViewDetails={setSelectedOrderDetails} />}
                    {activeTab === 'products' && <ProductsTab triggerToast={triggerToast} onAddProduct={openAddProductModal} onEditProduct={openEditProductModal} />}
                    {activeTab === 'kurumlar' && (
                        <KurumlarTab 
                            triggerToast={triggerToast} 
                            onAddKurum={openAddKurumModal} 
                            onEditKurum={openEditKurumModal} 
                            onAddAltKategori={openAddAltKategoriModal}
                            onEditAltKategori={openEditAltKategoriModal}
                        />
                    )}
                    {activeTab === 'featured' && <FeaturedTab triggerToast={triggerToast} />}
                    {activeTab === 'coupons' && <CouponsTab triggerToast={triggerToast} />}
                    {activeTab === 'pages' && <PagesTab onEditPage={openEditPageModal} />}
                </main>
            </div>

            {/* MODALS RENDERING */}
            <OrderModal order={selectedOrderDetails} onClose={() => setSelectedOrderDetails(null)} />
            
            <ProductModal 
                isOpen={isProductModalOpen} 
                onClose={() => setIsProductModalOpen(false)} 
                editingProduct={editingProduct} 
                triggerToast={triggerToast} 
            />
            
            <KurumModal 
                isOpen={isKurumModalOpen} 
                onClose={() => setIsKurumModalOpen(false)} 
                editingKurum={editingKurum} 
                triggerToast={triggerToast} 
            />
            
            <AltKategoriModal
                isOpen={isAltKategoriModalOpen}
                onClose={() => setIsAltKategoriModalOpen(false)}
                editingAltKategori={editingAltKategori}
                triggerToast={triggerToast}
                initialKurumSlug={initialKurumSlugForAltCat}
            />
            
            <PageCMSModal 
                isOpen={isPageModalOpen} 
                onClose={() => setIsPageModalOpen(false)} 
                editingPage={editingPage} 
                triggerToast={triggerToast} 
            />

            {/* Success Toast Feedback */}
            {showSuccessToast && (
                <div className={styles.successToast}>
                    <Check size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}
        </div>
    )
}
