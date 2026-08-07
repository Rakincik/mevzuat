'use client'

import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, BookOpen } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import KurumEmblem from '@/components/KurumEmblem'
import styles from './page.module.css'


export default function KurumDetailPage() {
    const { kurumSlug } = useParams<{ kurumSlug: string }>()
    const { products, kurumlar, altKategoriler: globalAltKategoriler } = useApp()
    
    const kurum = kurumlar.find(k => k.slug === kurumSlug)

    if (!kurum) {
        notFound()
    }

    // Get Level 2 AltKategoriler for this ministry from dynamic products list
    const ministryProducts = products.filter(p => p.status !== 'passive' && (p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug))))
    const map = new Map<string, { name: string; count: number }>()

    ministryProducts.forEach(p => {
        if (p.altKategoriSlugs && p.altKategoriNames) {
            p.altKategoriSlugs.forEach((slug, idx) => {
                const name = p.altKategoriNames?.[idx] || p.altKategoriName
                if (slug && name) {
                    const item = map.get(slug)
                    if (item) {
                        item.count++
                    } else {
                        map.set(slug, { name, count: 1 })
                    }
                }
            })
        } else {
            const item = map.get(p.altKategoriSlug)
            if (item) {
                item.count++
            } else {
                map.set(p.altKategoriSlug, { name: p.altKategoriName, count: 1 })
            }
        }
    })

    const altKategoriler: any[] = []
    map.forEach((value, slug) => {
        const globalCat = globalAltKategoriler.find(c => c.slug === slug)
        
        let description = globalCat?.description || `${value.name} sınavlarına yönelik güncel hazırlık setleri ve dersler.`
        if (!globalCat?.description) {
            if (slug === 'yazi-isleri-mudurlugu') description = 'Yazı İşleri Müdürlüğü kadroları için kapsamlı konu anlatımları ve deneme sınavları.'
            if (slug === 'zabit-katipligi') description = 'Zabıt Kâtipliği sınavlarına özel hazırlık paketleri ve pratik dersler.'
            if (slug === 'icra-mudurlugu') description = 'İcra Müdürlüğü sınavı İcra-İflas Hukuku ve ilgili kanun dersleri.'
            if (slug === 'seflik-sinavi') description = 'Şef kadroları Görevde Yükselme Sınavı (GYS) müfredat dersleri.'
            if (slug === 'sube-mudurlugu') description = 'Şube Müdürü kadroları için A segmenti mevzuat konu anlatımları.'
            if (slug === 'nufus-goc-mevzuati') description = 'Nüfus Hizmetleri ve Göç İdaresi Kanunu ders modülleri.'
            if (slug === 'ortak-kanunlar') description = 'Tüm kurumlarda geçerli ortak kanunlar: Anayasa, 657 ve İdare Hukuku.'
            if (slug === 'tam-paketler') description = 'Tüm ortak mevzuat konularını kapsayan avantajlı kombine paketler.'
        }

        const order = globalCat?.order !== undefined ? globalCat.order : 999
        const status = globalCat?.status || 'active'

        if (status === 'active') {
            altKategoriler.push({
                name: value.name,
                slug,
                description,
                productCount: value.count,
                order
            })
        }
    })

    // Sort subcategories by order!
    altKategoriler.sort((a, b) => a.order - b.order)


    return (
        <div className="container section">
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.breadcrumbs}>
                    <Link href="/">Ana Sayfa</Link> / <Link href="/products">Kurumlar</Link> / <span>{kurum.name}</span>
                </div>

                <div className={styles.kurumHeader}>
                    <div className={styles.kurumIconWrapper}>
                        <KurumEmblem slug={kurumSlug} size={84} />
                    </div>
                    <div>
                        <span className={styles.miniLabel} style={{ color: kurum.color }}>T.C. BAKANLIK MÜFREDATI</span>
                        <h1 className={styles.title}>{kurum.name}</h1>
                        <p className={styles.kurumDescription}>{kurum.description}</p>
                    </div>
                </div>
            </div>

            {/* Subcategory Grid Header */}
            <div className={styles.sectionTitleArea}>
                <h2>Sınav Kadroları & Alanları</h2>
                <p>Hazırlandığınız kadro veya unvan grubunu seçerek ilgili eğitim setlerine ulaşabilirsiniz.</p>
            </div>

            {/* Grid displaying AltKategoriler */}
            <div className={styles.grid}>
                {altKategoriler.map((altKat, index) => (
                    <motion.article
                        key={altKat.slug}
                        className={styles.subCard}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <Link href={`/products/${kurumSlug}/${altKat.slug}`} className={styles.subCardLink}>
                            <div className={styles.subCardInner}>
                                <div className={styles.subCardContent}>
                                    <span className={styles.subCardLabel} style={{ color: kurum.color }}>
                                        {kurum.name} SINAVI
                                    </span>
                                    <h3 className={styles.subCardTitle}>{altKat.name}</h3>
                                    <p className={styles.subCardDescription}>{altKat.description}</p>
                                </div>

                                <div className={styles.subCardFooter}>
                                    <div className={styles.subCardBadge}>
                                        <BookOpen size={13} style={{ color: kurum.color }} />
                                        <span>{altKat.productCount} Aktif Eğitim</span>
                                    </div>

                                    <div className={styles.subCardCta}>
                                        <span className={styles.subCardCtaText}>Sınavı İncele</span>
                                        <div className={styles.subCardCtaArrow} style={{ '--arrow-accent': kurum.color } as React.CSSProperties}>
                                            <ArrowRight size={15} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </motion.article>
                ))}
            </div>
        </div>
    )
}
