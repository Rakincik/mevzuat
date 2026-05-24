'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Twitter, Instagram, Youtube, Linkedin, Zap, Scale, Facebook } from 'lucide-react'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'
import styles from './Footer.module.css'

export default function Footer() {
    const pathname = usePathname()
    const isAdmin = pathname?.startsWith('/admin')
    const { settings, pages } = useApp()
    const currentYear = new Date().getFullYear()

    const publishedPages = pages || []
    
    // Base links
    const supportList = [
        { name: 'Sıkça Sorulan Sorular', href: '/faq' },
        { name: 'İletişim', href: '/contact' }
    ]
    
    const companyList = [
        { name: 'Hakkımızda', href: '/about' },
        { name: 'Eğitmenlerimiz', href: '/instructors' },
        { name: 'Referanslar', href: '/testimonials' },
        { name: 'Yönetim Paneli', href: '/admin' }
    ]

    // Find and push dynamic pages if they are published
    const shippingPage = publishedPages.find(p => p.id === 'shipping' && p.status === 'published')
    if (shippingPage) supportList.push({ name: shippingPage.title, href: `/pages/${shippingPage.slug}` })

    const returnsPage = publishedPages.find(p => p.id === 'returns' && p.status === 'published')
    if (returnsPage) supportList.push({ name: returnsPage.title, href: `/pages/${returnsPage.slug}` })

    const privacyPage = publishedPages.find(p => p.id === 'privacy' && p.status === 'published')
    if (privacyPage) companyList.push({ name: privacyPage.title, href: `/pages/${privacyPage.slug}` })

    const termsPage = publishedPages.find(p => p.id === 'terms' && p.status === 'published')
    if (termsPage) companyList.push({ name: termsPage.title, href: `/pages/${termsPage.slug}` })

    const footerLinks = {
        products: [
            { name: 'Görevde Yükselme', href: '/products?category=gorevde-yukselme' },
            { name: 'Unvan Değişikliği', href: '/products?category=unvan-degisikligi' },
            { name: 'Mevzuat Kitapları', href: '/products?category=mevzuat-kitaplari' },
            { name: 'Tüm Yayınlar', href: '/products' },
        ],
        support: supportList,
        company: companyList,
    }

    if (isAdmin) return null

    return (
        <footer className={styles.footer}>
            <div className={styles.footerGlow} />

            <div className="container">
                <div className={styles.footerGrid}>
                    {/* Brand */}
                    <motion.div
                        className={styles.footerBrand}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/" className={styles.logo}>
                            <Image
                                src="/images/logo.png"
                                alt="MEVZUAT ADAM"
                                width={300}
                                height={90}
                                style={{ height: '80px', width: 'auto', objectFit: 'contain', filter: 'brightness(0) invert(1)' }}
                            />
                        </Link>
                        <p className={styles.brandDesc}>
                            Görevde Yükselme, Unvan Değişikliği ve Mevzuat sınavlarına yönelik Türkiye'nin en kapsamlı eğitim platformu.
                        </p>
                        <div className={styles.socialLinks}>
                            {settings.instagram && (
                                <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Instagram size={20} />
                                </a>
                            )}
                            {settings.youtube && (
                                <a href={settings.youtube} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Youtube size={20} />
                                </a>
                            )}
                            {settings.twitter && (
                                <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Twitter size={20} />
                                </a>
                            )}
                            {settings.facebook && (
                                <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                                    <Facebook size={20} />
                                </a>
                            )}
                        </div>
                    </motion.div>

                    {/* Links */}
                    <div className={styles.footerLinks}>
                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>Ürünler</h4>
                            <ul>
                                {footerLinks.products.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>Destek</h4>
                            <ul>
                                <li>
                                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className={styles.footerLink}>{settings.phone}</a>
                                </li>
                                <li>
                                    <a href={`mailto:${settings.email}`} className={styles.footerLink}>{settings.email}</a>
                                </li>
                                {footerLinks.support.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.linkGroup}>
                            <h4 className={styles.linkGroupTitle}>Şirket</h4>
                            <ul>
                                {footerLinks.company.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className={styles.footerLink}>
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className={styles.footerBottom}>
                    <p>© {currentYear} MEVZUAT ADAM. Tüm hakları saklıdır.</p>
                    <div className={styles.bottomLinks}>
                        <Link href="/pages/privacy">Gizlilik Politikası</Link>
                        <Link href="/pages/terms">Kullanım Koşulları</Link>
                    </div>
                </div>

                {/* Signature */}
                <div className={styles.signature}>
                    <span>Designed & Developed by</span>
                    <a href="#" className={styles.signatureLink}>
                        <svg width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.vectorLogo}>
                            <defs>
                                <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#FFD700" />
                                    <stop offset="100%" stopColor="#FFA500" />
                                </linearGradient>
                            </defs>
                            {/* O */}
                            <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="3" />
                            {/* N */}
                            <path d="M26 4L26 20L29 20L29 10L35 20L38 20L38 4L35 4L35 14L29 4L26 4Z" fill="currentColor" />
                            {/* 7 */}
                            <path d="M44 4H56L49 20H45L51 6H44V4Z" fill="url(#goldGradient)" />
                            {/* YAZILIM */}
                            <text x="60" y="18" fill="currentColor" fontSize="8" fontWeight="600" fontFamily="sans-serif" letterSpacing="1" opacity="0.8">YAZILIM</text>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    )
}
