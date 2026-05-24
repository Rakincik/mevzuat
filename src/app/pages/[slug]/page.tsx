'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
    FileText, ArrowLeft, ShieldCheck, HelpCircle, 
    BookOpen, Phone, Mail, MapPin, Send, MessageSquare, Zap
} from 'lucide-react'
import { DynamicIcon } from '@/components/DynamicIcon'
import { useApp } from '@/context/AppContext'
import styles from './page.module.css'

export default function CustomPageDetail() {
    const { slug } = useParams<{ slug: string }>()
    const { pages } = useApp()
    
    // Find matching active page
    const page = pages.find(p => p.slug === slug && p.status === 'published')
    
    // List other legal agreements for the left sticky menu
    const otherLegalPages = pages.filter(p => 
        (p.id === 'terms' || p.id === 'privacy' || p.id === 'shipping' || p.id === 'returns') &&
        p.status === 'published'
    )

    if (!page) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '100px 0', fontFamily: 'Inter, sans-serif' }}>
                <HelpCircle size={48} color="#94a3b8" style={{ marginBottom: '16px' }} />
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>Sayfa Bulunamadı</h2>
                <p style={{ color: '#64748b', marginTop: '8px' }}>Aradığınız sayfa yayından kaldırılmış veya mevcut değil.</p>
                <Link href="/" className="btn btn-primary" style={{ marginTop: '24px', display: 'inline-block' }}>
                    Ana Sayfaya Dön
                </Link>
            </div>
        )
    }

    return (
        <div className="container section" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Breadcrumbs */}
            <div className={styles.breadcrumbs}>
                <Link href="/">Ana Sayfa</Link> /{' '}
                <span>{page.title}</span>
            </div>

            {/* Template: Legal Sözleşme Şablonu */}
            {page.id !== 'about' && page.id !== 'contact' && page.id !== 'faq' && (
                <div className={styles.legalLayout}>
                    {/* Left Sticky Nav Tree */}
                    <aside className={styles.legalSidebar}>
                        <div className={styles.sidebarHeader}>
                            <ShieldCheck size={18} color="#3b82f6" />
                            <span>Kurumsal & Yasal</span>
                        </div>
                        <div className={styles.sidebarMenu}>
                            {otherLegalPages.map((item) => (
                                <Link 
                                    key={item.id} 
                                    href={`/pages/${item.slug}`} 
                                    className={`${styles.sidebarLink} ${slug === item.slug ? styles.linkActive : ''}`}
                                >
                                    <FileText size={14} />
                                    <span>{item.title}</span>
                                </Link>
                            ))}
                        </div>
                    </aside>

                    {/* Right Rich Content */}
                    <main className={styles.legalContent}>
                        <h1 className={styles.pageTitle}>{page.title}</h1>
                        <span className={styles.pageDate}>Son Güncelleme: {new Date(page.createdAt).toLocaleDateString('tr-TR')}</span>
                        
                        <div 
                            className={styles.richText}
                            dangerouslySetInnerHTML={{ __html: page.content || '' }} 
                        />
                    </main>
                </div>
            )}

            {/* Template: Standart / Hakkımızda Şablonu */}
            {page.id === 'about' && (
                <div className={styles.standardLayout}>
                    <h1 className={styles.pageTitle} style={{ textAlign: 'center', marginBottom: '8px' }}>{page.title}</h1>
                    <p style={{ textAlign: 'center', color: '#64748b', fontSize: '15px', marginBottom: '32px' }}>Vizyonumuz, misyonumuz ve MEVZUAT ADAM hikayesi.</p>
                    
                    <div className={styles.aboutWrapper}>
                        <div className={styles.aboutCard}>
                            <h2>Kurumsal Hikayemiz</h2>
                            <p className={styles.aboutTextContent}>{page.aboutText}</p>
                        </div>

                        <div className={styles.visionMissionGrid}>
                            <div className={styles.visionCard}>
                                <div className={styles.cardHeaderIcon} style={{ background: '#eff6ff', color: '#3b82f6' }}>
                                    <Zap size={20} />
                                </div>
                                <h3>Vizyonumuz</h3>
                                <p>{page.aboutVision}</p>
                            </div>
                            <div className={styles.missionCard}>
                                <div className={styles.cardHeaderIcon} style={{ background: '#faf5ff', color: '#7c3aed' }}>
                                    <BookOpen size={20} />
                                </div>
                                <h3>Misyonumuz</h3>
                                <p>{page.aboutMission}</p>
                            </div>
                        </div>

                        {/* DYNAMIC CARD GRID (Sections with 'card' layout) */}
                        {page.customSections && page.customSections.some(s => s.layout === 'card') && (
                            <div style={{ marginTop: '48px', width: '100%' }}>
                                <h2 style={{ textAlign: 'center', fontSize: '20px', fontWeight: '800', marginBottom: '24px', color: '#0f172a' }}>Neden Bizi Seçmelisiniz?</h2>
                                <div className={styles.customCardGrid}>
                                    {page.customSections.filter(s => s.layout === 'card').map((sect) => (
                                        <div key={sect.id} className={styles.customCardItem}>
                                            <div 
                                                className={styles.cardIconWrapper} 
                                                style={{ backgroundColor: `${sect.iconColor}15`, color: sect.iconColor || 'var(--color-primary)' }}
                                            >
                                                <DynamicIcon name={sect.icon || 'Award'} size={22} />
                                            </div>
                                            <h3 className={styles.cardItemTitle}>{sect.title}</h3>
                                            <p className={styles.cardItemDesc}>{sect.content}</p>
                                            
                                            {sect.buttonText && sect.buttonLink && (
                                                <div style={{ marginTop: '16px' }}>
                                                    <a 
                                                        href={sect.buttonLink} 
                                                        className={`${styles.ctaBtnInline} ${sect.buttonStyle === 'secondary' ? styles.btnSec : sect.buttonStyle === 'link' ? styles.btnLink : styles.btnPrim}`}
                                                        style={{ 
                                                            '--accent-color': sect.iconColor || 'var(--color-primary)' 
                                                        } as React.CSSProperties}
                                                    >
                                                        <span>{sect.buttonText}</span>
                                                        {sect.buttonStyle === 'link' && <span style={{ marginLeft: 4 }}>➔</span>}
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* DYNAMIC SPLIT & FULL-WIDTH SECTIONS */}
                        {page.customSections && page.customSections.filter(s => s.layout !== 'card').map((sect) => {
                            const isLeft = sect.layout === 'split-left';
                            const isFull = sect.layout === 'full-width';
                            
                            if (isFull) {
                                return (
                                    <div key={sect.id} className={styles.fullWidthSection} style={{ background: `linear-gradient(135deg, ${sect.iconColor || '#3b82f6'}08 0%, ${sect.iconColor || '#6366f1'}18 100%)`, borderLeft: `6px solid ${sect.iconColor || 'var(--color-primary)'}`, marginTop: '32px', width: '100%' }}>
                                        <div className={styles.fullWidthContent}>
                                            <div className={styles.fullWidthHeaderRow}>
                                                <div className={styles.fullWidthIconWrapper} style={{ backgroundColor: `${sect.iconColor}15`, color: sect.iconColor }}>
                                                    <DynamicIcon name={sect.icon || 'Award'} size={26} />
                                                </div>
                                                <h2 className={styles.fullWidthTitle}>{sect.title}</h2>
                                            </div>
                                            <p className={styles.fullWidthText}>{sect.content}</p>
                                            {sect.buttonText && sect.buttonLink && (
                                                <a 
                                                    href={sect.buttonLink} 
                                                    className={`${styles.ctaBtn} ${sect.buttonStyle === 'secondary' ? styles.btnSec : sect.buttonStyle === 'link' ? styles.btnLink : styles.btnPrim}`}
                                                    style={{ 
                                                        '--accent-color': sect.iconColor || 'var(--color-primary)' 
                                                    } as React.CSSProperties}
                                                >
                                                    {sect.buttonText}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={sect.id} className={styles.splitSectionWrapper} style={{ background: isLeft ? '#f8fafc' : '#ffffff', border: '1px solid #e2e8f0', marginTop: '32px', width: '100%' }}>
                                    <div className={`${styles.splitLayout} ${sect.layout === 'split-right' ? styles.layoutReverse : ''}`}>
                                        
                                        {/* Text column */}
                                        <div className={styles.splitTextCol}>
                                            <span className={styles.splitCategory} style={{ color: sect.iconColor || 'var(--color-accent)' }}>KURUMSAL DETAY</span>
                                            <h2 className={styles.splitTitle}>{sect.title}</h2>
                                            <div style={{ width: '40px', height: '4px', background: sect.iconColor || 'var(--color-primary)', borderRadius: '2px', marginBottom: '20px' }} />
                                            <p className={styles.splitDesc}>{sect.content}</p>
                                            
                                            {sect.buttonText && sect.buttonLink && (
                                                <div style={{ marginTop: '24px' }}>
                                                    <a 
                                                        href={sect.buttonLink} 
                                                        className={`${styles.ctaBtn} ${sect.buttonStyle === 'secondary' ? styles.btnSec : sect.buttonStyle === 'link' ? styles.btnLink : styles.btnPrim}`}
                                                        style={{ 
                                                            '--accent-color': sect.iconColor || 'var(--color-primary)' 
                                                        } as React.CSSProperties}
                                                    >
                                                        {sect.buttonText}
                                                    </a>
                                                </div>
                                            )}
                                        </div>

                                        {/* Media Column */}
                                        <div className={styles.splitMediaCol}>
                                            {sect.image ? (
                                                <div className={styles.mediaFrame} style={{ borderColor: `${sect.iconColor || 'var(--color-primary)'}20` }}>
                                                    <Image 
                                                        src={sect.image} 
                                                        alt={sect.title} 
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 50vw"
                                                        className={styles.uploadedImg} 
                                                        style={{ objectFit: 'cover' }}
                                                        unoptimized={sect.image.startsWith('data:')}
                                                    />
                                                </div>
                                            ) : (
                                                <div className={styles.dynamicMediaSphere} style={{ background: `radial-gradient(circle, ${sect.iconColor}10 0%, ${sect.iconColor}25 70%, ${sect.iconColor}02 100%)` }}>
                                                    <div className={styles.dynamicSphereRing} style={{ borderColor: `${sect.iconColor}15` }} />
                                                    <div className={styles.dynamicSphereRing2} style={{ borderColor: `${sect.iconColor}05` }} />
                                                    <div className={styles.dynamicInnerIcon} style={{ color: sect.iconColor }}>
                                                        <DynamicIcon name={sect.icon || 'Award'} size={64} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>
            )}

            {/* Template: İletişim Şablonu */}
            {page.id === 'contact' && (
                <div className={styles.infoLayout}>
                    <div className={styles.infoContent}>
                        <h1 className={styles.pageTitle}>{page.title}</h1>
                        <p style={{ color: '#64748b', marginBottom: '24px' }}>Bizimle iletişime geçin. Sorularınız, önerileriniz ve destek istekleriniz için buradayız.</p>
                        
                        <div className={styles.contactGrid}>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <h4>Telefon</h4>
                                    <p>{page.phone}</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h4>E-posta</h4>
                                    <p>{page.email}</p>
                                </div>
                            </div>
                            <div className={styles.contactItem}>
                                <div className={styles.contactIcon}>
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h4>Adres</h4>
                                    <p>{page.address}</p>
                                </div>
                            </div>
                        </div>

                        {/* WhatsApp support card */}
                        <div className={styles.whatsappCard}>
                            <div className={styles.whatsappHeader}>
                                <MessageSquare size={20} />
                                <h4>Canlı WhatsApp Desteği</h4>
                            </div>
                            <p>Sınav hazırlık paketlerimiz, ödeme kolaylıkları veya üyelik aktivasyonu ile ilgili sorularınızı doğrudan WhatsApp üzerinden ekibimize iletebilirsiniz.</p>
                            <a 
                                href={`https://wa.me/${page.whatsapp}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={styles.whatsappBtn}
                            >
                                WhatsApp Sohbeti Başlat
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
