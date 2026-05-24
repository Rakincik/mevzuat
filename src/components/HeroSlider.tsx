'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
    ChevronLeft, ChevronRight, ArrowRight, HelpCircle,
    MonitorPlay, ClipboardList, BookOpen, Target, 
    GraduationCap, Award, Trophy, Users, 
    RefreshCw, Sparkles, Rocket, Landmark, Info, 
    Trash2, Play, CheckCircle, ShieldCheck, Mail, Phone, MapPin
} from 'lucide-react'
import styles from './HeroSlider.module.css'

// Curated lookup dictionary of supported slide/cta icons to enable tree-shaking
const iconMap: { [key: string]: React.ComponentType<any> } = {
    MonitorPlay, ClipboardList, BookOpen, Target, 
    GraduationCap, HelpCircle, Award, Trophy, Users, 
    RefreshCw, Sparkles, Rocket, Landmark, Info, 
    Trash2, ChevronLeft, ChevronRight, ArrowRight,
    Play, CheckCircle, ShieldCheck, Mail, Phone, MapPin
}

// Dynamic icon helper to render Lucide Icons by string name
const DynamicIcon = ({ name, size = 24, color }: { name: string; size?: number; color?: string }) => {
    const IconComponent = iconMap[name] || HelpCircle
    return <IconComponent size={size} style={{ color }} />
}

interface SlideProp {
    id: string
    title: string
    subtitle: string
    cta: string
    link: string
    bgClass?: string
    image?: string
    icon: string
    iconColor?: string
    titleColor?: string
    subtitleColor?: string
}

interface CtaPanelProp {
    title: string
    subtitle: string
    href: string
    icon: string
    bgGradient?: string
}

interface HeroSliderProps {
    slides?: SlideProp[]
    ctaPanels?: CtaPanelProp[]
}

const defaultSlides: SlideProp[] = [
    {
        id: 'slide_1',
        title: "MEVZUAT ADAM ile Zirveye",
        subtitle: "Görevde Yükselme ve Unvan Değişikliği sınavlarında yanınızdayız.",
        cta: "Eğitimleri İncele",
        link: "/products",
        icon: "Rocket",
        iconColor: "#f97316"
    },
    {
        id: 'slide_2',
        title: "Online Video Dersler",
        subtitle: "Alanında uzman eğitmenlerden kapsamlı konu anlatımları ve soru çözümleri.",
        cta: "Derslere Göz At",
        link: "/products?category=online",
        icon: "BookOpen",
        iconColor: "#3b82f6"
    },
    {
        id: 'slide_3',
        title: "Güncel Mevzuat Yayınları",
        subtitle: "Değişen kanun ve yönetmeliklere uygun en güncel kaynaklar.",
        cta: "Kitapları Gör",
        link: "/products?category=kitap",
        icon: "Target",
        iconColor: "#10b981"
    }
]

const defaultCtaPanels: CtaPanelProp[] = [
    {
        title: "Ders Paneli",
        subtitle: "Video derslerinize erişin",
        href: "https://derspaneli.mevzuatadam.com",
        icon: "MonitorPlay",
        bgGradient: "blue"
    },
    {
        title: "Soru Bankası",
        subtitle: "Binlerce soru ile pratik yapın",
        href: "https://sorubankasi.mevzuatadam.com",
        icon: "ClipboardList",
        bgGradient: "purple"
    }
]

export default function HeroSlider({ slides: propSlides, ctaPanels: propCtaPanels }: HeroSliderProps) {
    const slidesData = propSlides && propSlides.length > 0 ? propSlides : defaultSlides
    const ctaPanelsData = propCtaPanels && propCtaPanels.length > 0 ? propCtaCtaPanels(propCtaPanels) : defaultCtaPanels

    function propCtaCtaPanels(panels: any[]) {
        // Safe mapping to ensure it has valid gradients
        return panels.map(p => ({
            ...p,
            bgGradient: p.bgGradient || 'blue'
        }))
    }

    const [current, setCurrent] = useState(0)
    const [direction, setDirection] = useState(0)

    // Reset current slide if slidesData length changes
    useEffect(() => {
        setCurrent(0)
    }, [slidesData.length])

    // Autoplay
    useEffect(() => {
        if (slidesData.length <= 1) return
        const timer = setInterval(() => {
            nextSlide()
        }, 5000)
        return () => clearInterval(timer)
    }, [current, slidesData.length])

    const nextSlide = () => {
        if (slidesData.length <= 1) return
        setDirection(1)
        setCurrent((prev) => (prev + 1) % slidesData.length)
    }

    const prevSlide = () => {
        if (slidesData.length <= 1) return
        setDirection(-1)
        setCurrent((prev) => (prev === 0 ? slidesData.length - 1 : prev - 1))
    }

    const getSlideBgClass = (slide: any, index: number) => {
        if (slide.bgClass) return slide.bgClass
        const bgClasses = [styles.slide1, styles.slide2, styles.slide3]
        return bgClasses[index % bgClasses.length]
    }

    const getCtaPanelClass = (bgGradient?: string) => {
        switch (bgGradient) {
            case 'blue':
                return styles.bgBlue
            case 'purple':
                return styles.bgPurple
            case 'emerald':
                return styles.bgEmerald
            case 'orange':
                return styles.bgOrange
            default:
                return styles.ctaDersPaneli
        }
    }

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? 600 : -600,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (dir: number) => ({
            zIndex: 0,
            x: dir < 0 ? 600 : -600,
            opacity: 0
        })
    }

    return (
        <div className={styles.heroWrapper}>
            {/* Left: Compact Slider */}
            <section className={styles.sliderContainer}>
                {slidesData.length > 0 ? (
                    <AnimatePresence initial={false} custom={direction} mode="wait">
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            className={`${styles.slide} ${getSlideBgClass(slidesData[current], current)}`}
                            style={slidesData[current].image ? { 
                                backgroundImage: `url(${slidesData[current].image})`, 
                                backgroundSize: 'cover', 
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat'
                            } : {}}
                        >
                            <div className={styles.sliderOverlay} />
                            <div className={styles.slideContent}>
                                {slidesData[current].icon && slidesData[current].icon !== 'none' && (
                                    <motion.div
                                        className={styles.iconWrapper}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <DynamicIcon 
                                            name={slidesData[current].icon} 
                                            size={32} 
                                            color={slidesData[current].iconColor || '#f97316'} 
                                        />
                                    </motion.div>
                                )}

                                <motion.h1
                                    className={styles.title}
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    style={slidesData[current].titleColor ? { color: slidesData[current].titleColor } : {}}
                                    dangerouslySetInnerHTML={{ __html: slidesData[current].title }}
                                />

                                <motion.p
                                    className={styles.subtitle}
                                    initial={{ y: 15, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                    style={slidesData[current].subtitleColor ? { color: slidesData[current].subtitleColor } : {}}
                                    dangerouslySetInnerHTML={{ __html: slidesData[current].subtitle }}
                                />

                                {slidesData[current].cta && slidesData[current].link && (
                                    <motion.div
                                        initial={{ y: 15, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        <Link href={slidesData[current].link} className="btn btn-accent">
                                            {slidesData[current].cta}
                                        </Link>
                                    </motion.div>
                                )}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className={styles.slide} style={{ background: '#1E293B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: 'rgba(255,255,255,0.5)' }}>Henüz slide eklenmedi.</p>
                    </div>
                )}

                {/* Controls */}
                {slidesData.length > 1 && (
                    <>
                        <button className={`${styles.navBtn} ${styles.prev}`} onClick={prevSlide} aria-label="Önceki slide">
                            <ChevronLeft size={22} />
                        </button>
                        <button className={`${styles.navBtn} ${styles.next}`} onClick={nextSlide} aria-label="Sonraki slide">
                            <ChevronRight size={22} />
                        </button>

                        {/* Dots */}
                        <div className={styles.dots}>
                            {slidesData.map((_, index) => (
                                <button
                                    key={index}
                                    className={`${styles.dot} ${index === current ? styles.activeDot : ''}`}
                                    onClick={() => {
                                        setDirection(index > current ? 1 : -1)
                                        setCurrent(index)
                                    }}
                                    aria-label={`Slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Right: CTA Panels */}
            <div className={styles.ctaPanels}>
                {ctaPanelsData.map((panel, index) => (
                    <a
                        key={index}
                        href={panel.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${styles.ctaCard} ${getCtaPanelClass(panel.bgGradient)}`}
                    >
                        <div className={styles.ctaIconBox}>
                            <DynamicIcon name={panel.icon || 'HelpCircle'} size={28} color="#fff" />
                        </div>
                        <span className={styles.ctaTitle}>{panel.title}</span>
                        <span className={styles.ctaSubtitle}>{panel.subtitle}</span>
                        <div className={styles.ctaArrow}>
                            <ArrowRight size={18} />
                        </div>
                    </a>
                ))}
            </div>
        </div>
    )
}

