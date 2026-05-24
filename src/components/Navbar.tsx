'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/stores/cartStore'
import { useUIStore } from '@/stores/uiStore'
import { useApp } from '@/context/AppContext'
import { ShoppingCart, Menu, X, Zap, LogIn, UserPlus, Search, Scale } from 'lucide-react'
import Image from 'next/image'
import styles from './Navbar.module.css'

export default function Navbar() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)
    const { getTotalItems } = useCartStore()
    const { pages } = useApp()

    useEffect(() => {
        setMounted(true)
    }, [])

    const cartCount = mounted ? getTotalItems() : 0
    const homePage = pages.find(p => p.id === 'home')

    if (isAdmin) return null

    return (
        <nav className={styles.navbar}>
            {mounted && homePage?.showAnnouncement && (homePage?.announcementText || homePage?.announcementImage) && (
                <div 
                    className={styles.announcementBar}
                    style={homePage.announcementType === 'image' ? { padding: 0, background: 'transparent', height: 'auto', minHeight: 'auto' } : { background: homePage.announcementBg || 'linear-gradient(90deg, #ef4444 0%, #f97316 100%)' }}
                >
                    {homePage.announcementLink ? (
                        <Link href={homePage.announcementLink} className={styles.announcementLink} style={{ display: 'block', width: '100%', height: '100%', lineHeight: 0 }}>
                            {homePage.announcementType === 'image' && homePage.announcementImage ? (
                                <Image src={homePage.announcementImage} alt="Duyuru Görseli" width={1200} height={55} className={styles.announcementImage} unoptimized={homePage.announcementImage.startsWith('data:')} />
                            ) : (
                                <span className={styles.announcementText}>{homePage.announcementText}</span>
                            )}
                        </Link>
                    ) : (
                        homePage.announcementType === 'image' && homePage.announcementImage ? (
                            <Image src={homePage.announcementImage} alt="Duyuru Görseli" width={1200} height={55} className={styles.announcementImage} style={{ display: 'block', width: '100%' }} unoptimized={homePage.announcementImage.startsWith('data:')} />
                        ) : (
                            <span className={styles.announcementText}>{homePage.announcementText}</span>
                        )
                    )}
                </div>
            )}
            <div className={`container ${styles.navbarContainer}`}>
                {/* Logo */}
                <Link href="/" className={styles.logo}>
                    <Image
                        src="/images/logo.png"
                        alt="MEVZUAT ADAM"
                        width={300}
                        height={90}
                        style={{ height: '70px', width: 'auto', objectFit: 'contain' }}
                        priority
                    />
                </Link>

                {/* Desktop Navigation */}
                <ul className={styles.navLinks}>
                    <li><Link href="/" className={styles.navLink}>Ana Sayfa</Link></li>
                    <li><Link href="/products?category=egitimler" className={styles.navLink}>Eğitimler</Link></li>
                    <li><Link href="/faq" className={styles.navLink}>SSS</Link></li>
                    <li><Link href="/about" className={styles.navLink}>Hakkımızda</Link></li>
                    <li><Link href="/contact" className={styles.navLink}>İletişim</Link></li>
                </ul>

                {/* Right Side */}
                <div className={styles.navActions}>
                    <button
                        className={styles.iconButton}
                        onClick={() => useUIStore.getState().openSearch()}
                        aria-label="Arama"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-main)', marginRight: '8px' }}
                    >
                        <Search size={22} />
                    </button>

                    <button
                        className={styles.cartButton}
                        onClick={() => useCartStore.getState().toggleCart()}
                        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <span>Sepetim</span>
                        {cartCount > 0 && <span className={styles.cartBadge}>{cartCount}</span>}
                    </button>

                    <Link href="/auth/login" className="btn btn-outline btn-sm">
                        Giriş Yap
                    </Link>

                    <Link href="/auth/register" className="btn btn-primary btn-sm">
                        Kayıt Ol
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.menuButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    ☰
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    {[
                        { name: 'Ana Sayfa', href: '/' },
                        { name: 'Eğitimler', href: '/products?category=egitimler' },
                        { name: 'Yayınlar', href: '/products?category=yayinlar' },
                        { name: 'Hakkımızda', href: '/about' },
                        { name: 'İletişim', href: '/contact' }
                    ].map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={styles.mobileLink}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className={styles.mobileActions}>
                        <Link href="/auth/login" className="btn btn-outline btn-sm" onClick={() => setIsMenuOpen(false)}>
                            Giriş
                        </Link>
                        <Link href="/auth/register" className="btn btn-primary btn-sm" onClick={() => setIsMenuOpen(false)}>
                            Kayıt Ol
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    )
}
