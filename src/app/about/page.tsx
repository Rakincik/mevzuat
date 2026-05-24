'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Users, BookOpen, Award, TrendingUp, User } from 'lucide-react'
import { DynamicIcon } from '@/components/DynamicIcon'
import { useApp } from '@/context/AppContext'
import styles from './about.module.css'

export default function AboutPage() {
    const { settings, pages } = useApp()
    const aboutPage = pages.find(p => p.id === 'about')
    
    const aboutText = aboutPage?.aboutText || settings.aboutText
    const aboutVision = aboutPage?.aboutVision || settings.aboutVision
    const aboutMission = aboutPage?.aboutMission || settings.aboutMission
    const customSections = aboutPage?.customSections || []

    return (
        <div style={{ paddingBottom: 'var(--space-3xl)' }}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <div className={`container ${styles.heroContent}`}>
                    <motion.h1
                        className={styles.heroTitle}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        Eğitimde <span className="text-accent">Yeni Nesil Yaklaşım</span>
                    </motion.h1>
                    <motion.p
                        className={styles.heroLead}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        2015'ten bu yana binlerce öğrencinin kariyer hedeflerine ulaşmasına öncülük ediyoruz.
                        Teknoloji ve eğitimi harmanlayarak, öğrenmeyi erişilebilir ve etkili kılıyoruz.
                    </motion.p>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.section}>
                <div className="container">
                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <Users size={32} color="var(--color-accent)" style={{ marginBottom: 16 }} />
                            <span className={styles.statNumber}>50K+</span>
                            <span className={styles.statLabel}>Mutlu Öğrenci</span>
                        </div>
                        <div className={styles.statItem}>
                            <BookOpen size={32} color="var(--color-primary)" style={{ marginBottom: 16 }} />
                            <span className={styles.statNumber}>500+</span>
                            <span className={styles.statLabel}>Eğitim Seti</span>
                        </div>
                        <div className={styles.statItem}>
                            <Award size={32} color="var(--status-warning)" style={{ marginBottom: 16 }} />
                            <span className={styles.statNumber}>%98</span>
                            <span className={styles.statLabel}>Başarı Oranı</span>
                        </div>
                        <div className={styles.statItem}>
                            <TrendingUp size={32} color="var(--status-success)" style={{ marginBottom: 16 }} />
                            <span className={styles.statNumber}>10+</span>
                            <span className={styles.statLabel}>Yıllık Tecrübe</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className={styles.section} style={{ background: 'var(--bg-surface-secondary)' }}>
                <div className="container">
                    <div className={styles.missionGrid}>
                        <div className={styles.missionContent}>
                            <h2 className={styles.sectionTitle} style={{ textAlign: 'left' }}>Vizyon & Misyon</h2>
                            <h3>Vizyonumuz</h3>
                            <p>
                                {aboutVision}
                            </p>
                            <h3>Misyonumuz</h3>
                            <p>
                                {aboutMission}
                            </p>
                        </div>
                        <div className={styles.missionImage} style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-surface)' }}>
                            <Image
                                src="/images/logo.png"
                                alt="MEVZUAT ADAM"
                                width={280}
                                height={100}
                                style={{ width: '85%', height: 'auto', objectFit: 'contain' }}
                                priority
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* DYNAMIC CARD GRID (Sections with 'card' layout) */}
            {customSections.some(s => s.layout === 'card') && (
                <section className={styles.section} style={{ background: 'var(--bg-surface)' }}>
                    <div className="container">
                        <h2 className={styles.sectionTitle}>Neden Bizi Seçmelisiniz?</h2>
                        <div className={styles.customCardGrid}>
                            {customSections.filter(s => s.layout === 'card').map((sect) => (
                                <div key={sect.id} className={styles.customCardItem}>
                                    <div 
                                        className={styles.cardIconWrapper} 
                                        style={{ backgroundColor: `${sect.iconColor}15`, color: sect.iconColor || 'var(--color-primary)' }}
                                    >
                                        <DynamicIcon name={sect.icon || 'Award'} size={24} />
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
                </section>
            )}

            {/* DYNAMIC SPLIT & FULL-WIDTH SECTIONS (Sections with layout reverse, left, right, banner) */}
            {customSections.filter(s => s.layout !== 'card').map((sect) => {
                const isLeft = sect.layout === 'split-left';
                const isFull = sect.layout === 'full-width';
                
                if (isFull) {
                    return (
                        <section key={sect.id} className={styles.fullWidthSection} style={{ background: `linear-gradient(135deg, ${sect.iconColor || '#3b82f6'}08 0%, ${sect.iconColor || '#6366f1'}18 100%)`, borderLeft: `6px solid ${sect.iconColor || 'var(--color-primary)'}` }}>
                            <div className="container">
                                <div className={styles.fullWidthContent}>
                                    <div className={styles.fullWidthHeaderRow}>
                                        <div className={styles.fullWidthIconWrapper} style={{ backgroundColor: `${sect.iconColor}15`, color: sect.iconColor }}>
                                            <DynamicIcon name={sect.icon || 'Award'} size={28} />
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
                        </section>
                    );
                }

                return (
                    <section key={sect.id} className={styles.section} style={{ background: isLeft ? 'var(--bg-surface-secondary)' : 'var(--bg-surface)' }}>
                        <div className="container">
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

                                {/* Media Column (Image or Big Icon with sphere gradient background) */}
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
                    </section>
                );
            })}

            {/* Team Section */}
            <section className={styles.section}>
                <div className="container">
                    <h2 className={styles.sectionTitle}>Uzman Kadromuz</h2>
                    <div className={styles.teamGrid}>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={styles.member}>
                                <div className={styles.memberImage}>
                                    <User size={64} />
                                </div>
                                <div className={styles.memberContent}>
                                    <span className={styles.memberName}>Dr. Öğr. Üyesi {['Ahmet Yılmaz', 'Ayşe Demir', 'Mehmet Öztürk', 'Zeynep Kaya'][i - 1]}</span>
                                    <span className={styles.memberRole}>Eğitim Koordinatörü</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
