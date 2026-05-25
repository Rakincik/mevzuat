'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Share2, Check, ShieldCheck, Truck, Clock, Star, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import styles from './page.module.css'
import ProductCard from '@/components/ProductCard'

const faqs = [
    { q: "Eğitim içerikleri müfredata uygun mu?", a: "Evet, tüm içeriklerimiz güncel mevzuata %100 uygundur ve değişiklikler anlık olarak yansıtılır." },
    { q: "Video derslere nasıl ulaşabilirim?", a: "Satın aldığınız derslere Ders Paneli üzerinden 7/24 erişim sağlayabilirsiniz." },
    { q: "İade şansım var mı?", a: "Evet, ürünü satın aldıktan sonra 14 gün içinde iade edebilirsiniz." },
    { q: "Soru bankasına erişim ne kadar sürer?", a: "Satın alma sonrası anında erişim sağlanır, 1 yıl boyunca aktif kalır." }
]

import { useApp } from '@/context/AppContext'

export default function DersDetailPage() {
    const { kurumSlug, altKategoriSlug, dersSlug } = useParams<{ kurumSlug: string; altKategoriSlug: string; dersSlug: string }>()
    const { addItem } = useCartStore()
    const { products, kurumlar } = useApp()
    
    const [activeTab, setActiveTab] = useState('description')
    const [showSticky, setShowSticky] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(0)
    const [activeImage, setActiveImage] = useState('')

    const kurum = kurumlar.find(k => k.slug === kurumSlug)
    const product = products.find(p => p.slug === dersSlug)

    const productImages = product
        ? (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean) as string[]
        : []

    // Related products from same subcategory
    const relatedProducts = products
        .filter(p => 
            (p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug))) && 
            (p.altKategoriSlug === altKategoriSlug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(altKategoriSlug))) && 
            p.slug !== dersSlug
        )
        .slice(0, 4)

    useEffect(() => {
        if (product) {
            setActiveImage(product.image || '/images/premium-mevzuat-cover.png')
        }
    }, [product])

    const handlePrevImage = () => {
        if (productImages.length <= 1) return
        let currentIndex = productImages.indexOf(activeImage)
        if (currentIndex === -1) currentIndex = 0
        const prevIndex = (currentIndex - 1 + productImages.length) % productImages.length
        setActiveImage(productImages[prevIndex])
    }

    const handleNextImage = () => {
        if (productImages.length <= 1) return
        let currentIndex = productImages.indexOf(activeImage)
        if (currentIndex === -1) currentIndex = 0
        const nextIndex = (currentIndex + 1) % productImages.length
        setActiveImage(productImages[nextIndex])
    }

    useEffect(() => {
        const handleScroll = () => {
            setShowSticky(window.scrollY > 600)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!product || !kurum) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '100px 0' }}>
                <h2>Ders Bulunamadı</h2>
                <p>Aradığınız ders mevcut değil.</p>
                <Link href={`/products/${kurumSlug}`} className="btn btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
                    Kuruma Dön
                </Link>
            </div>
        )
    }

    const hasDiscount = product.salePrice && product.salePrice < product.price
    const discountPercent = hasDiscount ? Math.round((1 - product.salePrice! / product.price) * 100) : 0

        // Find the correct subcategory name matching the URL parameter 'altKategoriSlug'
        let activeAltKategoriName = product.altKategoriName
        if (product.altKategoriSlugs && product.altKategoriNames) {
            const slugIdx = product.altKategoriSlugs.indexOf(altKategoriSlug)
            if (slugIdx > -1 && product.altKategoriNames[slugIdx]) {
                activeAltKategoriName = product.altKategoriNames[slugIdx]
            }
        }

        return (
            <div className="container section">
                {/* Three-Tier Breadcrumbs */}
                <div className={styles.breadcrumbs}>
                    <Link href="/">Ana Sayfa</Link> /{' '}
                    <Link href="/products">Kurumlar</Link> /{' '}
                    <Link href={`/products/${kurumSlug}`}>{kurum.name}</Link> /{' '}
                    <Link href={`/products/${kurumSlug}/${altKategoriSlug}`}>{activeAltKategoriName}</Link> /{' '}
                    <span>{product.name}</span>
                </div>

            <div className={styles.grid}>
                {/* Gallery */}
                <div className={styles.gallery}>
                    <div className={styles.mainImage}>
                        {activeImage ? (
                            <Image
                                src={activeImage}
                                alt={product.name}
                                width={600}
                                height={800}
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                priority
                            />
                        ) : product.image ? (
                            <Image
                                src={product.image}
                                alt={product.name}
                                width={600}
                                height={800}
                                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
                                priority
                            />
                        ) : null}

                        {/* Navigation Overlay Arrows */}
                        {productImages.length > 1 && (
                            <>
                                <button
                                    className={`${styles.navButton} ${styles.prevButton}`}
                                    onClick={handlePrevImage}
                                    aria-label="Önceki Fotoğraf"
                                >
                                    <ChevronLeft size={24} />
                                </button>
                                <button
                                    className={`${styles.navButton} ${styles.nextButton}`}
                                    onClick={handleNextImage}
                                    aria-label="Sonraki Fotoğraf"
                                >
                                    <ChevronRight size={24} />
                                </button>
                            </>
                        )}
                    </div>
                    <div className={styles.thumbnails}>
                        {productImages.map((imgUrl, index) => {
                            const isActive = activeImage === imgUrl;
                            return (
                                <div 
                                    key={index} 
                                    className={`${styles.thumbnail} ${isActive ? styles.activeThumbnail : ''}`}
                                    onClick={() => setActiveImage(imgUrl)}
                                    onMouseEnter={() => setActiveImage(imgUrl)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Image
                                        src={imgUrl}
                                        alt={`Thumbnail ${index + 1}`}
                                        width={80}
                                        height={80}
                                        style={{ objectFit: 'contain' }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Info */}
                <div className={styles.info}>
                    <div className={styles.header}>
                        <span className={styles.category}>{product.categoryName}</span>
                        <h1 className={styles.title}>{product.name}</h1>

                        <div className={styles.rating}>
                            <div className={styles.stars}>
                                {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                        key={star}
                                        size={16}
                                        fill={star <= 4 ? "#FFB800" : "none"}
                                        color={star <= 4 ? "#FFB800" : "#CBD5E1"}
                                    />
                                ))}
                            </div>
                            <span className={styles.reviewCount}>4.8 (124 Değerlendirme)</span>
                        </div>
                    </div>

                    <div className={styles.priceWrapper}>
                        {hasDiscount ? (
                            <>
                                <span className={styles.price}>{product.salePrice!.toLocaleString('tr-TR')} ₺</span>
                                <span className={styles.oldPrice}>{product.price.toLocaleString('tr-TR')} ₺</span>
                                <span className={styles.discountBadge}>%{discountPercent} İndirim</span>
                            </>
                        ) : (
                            <span className={styles.price}>{product.price.toLocaleString('tr-TR')} ₺</span>
                        )}
                    </div>

                    <p className={styles.description}>{product.description}</p>

                    {/* Trust Badges */}
                    <div className={styles.trustBadges}>
                        <div className={styles.badge}>
                            <Truck size={20} color="var(--color-primary)" />
                            <span>{((product as any).badges && (product as any).badges[0]) || "Anında Erişim"}</span>
                        </div>
                        <div className={styles.badge}>
                            <ShieldCheck size={20} color="var(--color-primary)" />
                            <span>{((product as any).badges && (product as any).badges[1]) || "Güvenli Ödeme"}</span>
                        </div>
                        <div className={styles.badge}>
                            <Clock size={20} color="var(--color-primary)" />
                            <span>{((product as any).badges && (product as any).badges[2]) || "14 Gün İade"}</span>
                        </div>
                    </div>

                    <ul className={styles.features}>
                        {((product as any).features && (product as any).features.length > 0 ? (product as any).features : [
                            "Tamamı Video Çözümlü",
                            "Mobil Uygulama Desteği",
                            "7/24 Eğitmen Desteği",
                            "1 Yıl Sınırsız Erişim"
                        ]).map((feat: string, idx: number) => (
                            <li key={idx}><Check size={16} color="var(--status-success)" /> {feat}</li>
                        ))}
                    </ul>

                    <div className={styles.actions}>
                        <button
                            className="btn btn-primary btn-lg"
                            style={{ flex: 1 }}
                            onClick={() => addItem({ id: product.id, name: product.name, slug: `${kurumSlug}/${altKategoriSlug}/${product.slug}`, price: product.price, salePrice: product.salePrice, image: product.image })}
                        >
                            Sepete Ekle
                        </button>
                        <button className="btn btn-outline btn-lg">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Rich Tabs */}
            <div className={styles.tabsSection}>
                <div className={styles.tabsHeader}>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'description' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('description')}
                    >
                        Ders Açıklaması
                    </button>
                    <button
                        className={`${styles.tabBtn} ${activeTab === 'faq' ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab('faq')}
                    >
                        Sıkça Sorulanlar
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'description' && (
                        <div className={styles.richContent}>
                            <h3>Ders İçeriği</h3>
                            <p>{product.description}</p>
                            <p>Bu ders, {kurum.name} bünyesindeki {product.altKategoriName} sınavlarına hazırlık sürecinde ihtiyaç duyulan temel mevzuat bilgilerini kapsamlı şekilde ele almaktadır.</p>

                            <h3>Neden Bu Dersi Tercih Etmelisiniz?</h3>
                            <ul>
                                {((product as any).whyUs && (product as any).whyUs.length > 0 ? (product as any).whyUs : [
                                    { title: "Güncel Mevzuat", description: "En son değişikliklere göre anında güncellenmiştir." },
                                    { title: "Çıkmış Soru Analizi", description: "Geçmiş sınav soruları detaylı çözümleriyle birlikte." },
                                    { title: "Uzman Eğitmen", description: "Alanında deneyimli eğitmenler tarafından hazırlanmıştır." }
                                ]).map((item: any, idx: number) => (
                                    <li key={idx}><strong>{item.title}:</strong> {item.description}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {activeTab === 'faq' && (
                        <div className={styles.faqSection}>
                            {((product as any).faqs && (product as any).faqs.length > 0 ? (product as any).faqs : faqs).map((item: any, index: number) => (
                                <div key={index} className={styles.faqItem}>
                                    <button className={styles.faqQuestion} onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                                        {item.q}
                                        {openFaq === index ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === index && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className={styles.faqAnswer}
                                            >
                                                <p>{item.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Related Products under same Subcategory */}
            {relatedProducts.length > 0 && (
                <section className={styles.relatedSection}>
                    <h2>Aynı Kategori Altındaki Diğer Dersler</h2>
                    <div className={styles.relatedGrid}>
                        {relatedProducts.map(p => (
                            <ProductCard key={p.id} {...p} slug={`${kurumSlug}/${altKategoriSlug}/${p.slug}`} />
                        ))}
                    </div>
                </section>
            )}

            {/* Sticky Bar */}
            <AnimatePresence>
                {showSticky && (
                    <motion.div
                        className={styles.stickyBar}
                        initial={{ y: 100 }}
                        animate={{ y: 0 }}
                        exit={{ y: 100 }}
                    >
                        <div className={`container ${styles.stickyContent}`}>
                            <div className={styles.stickyInfo}>
                                <span className={styles.stickyTitle}>{product.name}</span>
                                <span className={styles.stickyPrice}>{(product.salePrice || product.price).toLocaleString('tr-TR')} ₺</span>
                            </div>
                            <button
                                className="btn btn-primary"
                                onClick={() => addItem({ id: product.id, name: product.name, slug: `${kurumSlug}/${altKategoriSlug}/${product.slug}`, price: product.price, salePrice: product.salePrice, image: product.image })}
                            >
                                Sepete Ekle
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
