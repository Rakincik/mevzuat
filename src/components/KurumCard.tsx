'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar } from 'lucide-react'
import KurumEmblem from './KurumEmblem'
import styles from './KurumCard.module.css'

interface KurumCardProps {
    id: string
    name: string
    slug: string
    description: string
    color: string
    productCount: number
    index?: number
}

export default function KurumCard({
    name,
    slug,
    description,
    color,
    productCount,
    index = 0,
}: KurumCardProps) {
    // Sınav türü etiketi (T.C. Bakanlık Sınavı veya Genel Sınav)
    const categoryLabel = slug === 'genel-gys' ? 'T.C. GENEL SINAVLARI' : 'T.C. BAKANLIK SINAVLARI'

    // Her kuruma özel asil katı arka plan renkleri (Logonun resmi kırmızısıyla uyumlu ve asil duran)
    const bgColors: Record<string, string> = {
        'hazine-maliye-bakanligi': '#1e293b',
        'adalet-bakanligi': '#1e3a8a',
        'icisleri-bakanligi': '#0f766e',
        'saglik-bakanligi': '#991b1b',
        'milli-egitim-bakanligi': '#c2410c',
        'genel-gys': '#475569',
    }

    const cardColor = bgColors[slug] || '#1e293b'

    return (
        <motion.article
            className={styles.card}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
            <Link href={`/products/${slug}`} className={styles.cardLink}>
                {/* Dış çeper ışık efekti */}
                <div className={styles.cardBorderGlow} style={{ '--hover-glow': color } as React.CSSProperties} />

                <div className={styles.cardInner}>
                    {/* Üst Kısım - Resmi Arma Haznesi (Katı Renk + Glassmorphic Kalkan) */}
                    <div className={styles.cardHeader} style={{ backgroundColor: cardColor }}>
                        {/* Geometrik filigran (watermark) arka plan deseni */}
                        <div className={styles.headerPattern} />
                        
                        {/* Glassmorphic Kalkan */}
                        <div className={styles.emblemShield}>
                            <KurumEmblem slug={slug} size={90} className={styles.emblem} />
                        </div>
                    </div>

                    {/* Alt Kısım - Metin Alanı ve Bilgiler */}
                    <div className={styles.body}>
                        {/* Kategori Ön-Başlığı */}
                        <span className={styles.category} style={{ color: color }}>
                            {categoryLabel}
                        </span>

                        {/* Kurum Adı */}
                        <h3 className={styles.title}>{name}</h3>

                        {/* Açıklama */}
                        <p className={styles.description}>{description}</p>
                    </div>

                    {/* Kart Alt Bilgi Alanı */}
                    <div className={styles.footer}>
                        <div className={styles.badge} style={{ '--badge-accent': color } as React.CSSProperties}>
                            <Calendar size={13} />
                            <span>{productCount} Aktif Eğitim</span>
                        </div>
                        <div className={styles.ctaArea}>
                            <span className={styles.ctaText}>Dersleri İncele</span>
                            <div className={styles.ctaArrow}>
                                <ArrowRight size={16} />
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.article>
    )
}
