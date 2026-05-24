'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import Link from 'next/link'
import { useApp } from '@/context/AppContext'

const staticFaqs = [
    {
        category: "Sipariş ve Teslimat",
        items: [
            {
                q: "Siparişim ne zaman kargoya verilir?",
                a: "Hafta içi saat 16:00'ya kadar verdiğiniz siparişler aynı gün, 16:00'dan sonraki siparişler ise ertesi iş günü kargoya verilir. Cumartesi ve Pazar günleri verilen siparişler Pazartesi günü işleme alınır."
            },
            {
                q: "Hangi kargo firması ile çalışıyorsunuz?",
                a: "Anlaşmalı olduğumuz kargo firmaları Aras Kargo ve Yurtiçi Kargo'dur. Sipariş sırasında size en uygun olanı seçebilirsiniz."
            },
            {
                q: "Kargo ücreti ne kadar?",
                a: "1000 TL ve üzeri alışverişlerinizde kargo ücretsizdir. Bu tutarın altındaki siparişlerde sabit kargo ücreti uygulanır."
            }
        ]
    },
    {
        category: "İade ve Değişim",
        items: [
            {
                q: "Satın aldığım ürünü iade edebilir miyim?",
                a: "Evet, satın aldığınız ürünü teslim tarihinden itibaren 14 gün içerisinde, ambalajı açılmamış ve zarar görmemiş olması şartıyla iade edebilirsiniz. Dijital içerik ve online eğitimlerde iade hakkı, hizmetin ifasına başlanmamış olması (aktivasyon kodunun kullanılmamış olması) durumunda geçerlidir."
            },
            {
                q: "İade işleminde kargo ücretini kim öder?",
                a: "Ayıplı, hasarlı veya yanlış gönderilen ürünlerin iadesinde kargo ücreti firmamıza aittir. Keyfi iadelerde kargo ücreti alıcıya aittir."
            }
        ]
    },
    {
        category: "Online Eğitimler",
        items: [
            {
                q: "Online eğitimleri ne kadar süre izleyebilirim?",
                a: "Satın aldığınız online eğitim paketleri, sınav tarihine kadar (veya pakette belirtilen süre boyunca) 7/24 sınırsız erişiminize açıktır."
            },
            {
                q: "Videoları indirebilir miyim?",
                a: "Telif hakları gereği videolarımız indirilemez, ancak internet bağlantısı olan her yerden bilgisayar, tablet veya telefonunuzla kesintisiz izleyebilirsiniz."
            },
            {
                q: "Teknik destek veriyor musunuz?",
                a: "Evet, eğitim platformumuzla ilgili yaşadığınız her türlü teknik sorunda WhatsApp hattımızdan veya teknik destek birimimizden yardım alabilirsiniz."
            }
        ]
    }
]

export default function FAQPage() {
    const { pages } = useApp()
    const faqPage = pages.find(p => p.id === 'faq')
    const dynamicFaqs = faqPage?.faqs || []
    
    const [openIndex, setOpenIndex] = useState<string | null>(null)

    const toggleAccordion = (index: string) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="container" style={{ padding: '4rem 1rem', maxWidth: '900px', fontFamily: 'Inter, sans-serif' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '1rem' }}>Sıkça Sorulan Sorular</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    {faqPage?.seoDescription || "Aklınıza takılan soruların cevaplarını burada bulabilirsiniz."}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                {dynamicFaqs.length > 0 ? (
                    <div>
                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            marginBottom: '1.5rem',
                            color: 'var(--text-main)',
                            borderBottom: '2px solid var(--border-subtle)',
                            paddingBottom: '0.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <HelpCircle size={24} color="var(--color-accent)" />
                            Genel Sıkça Sorulanlar
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {dynamicFaqs.map((item, itemIndex) => {
                                const index = `dynamic-${itemIndex}`
                                const isOpen = openIndex === index

                                return (
                                    <div
                                        key={item.id || index}
                                        style={{
                                            backgroundColor: 'var(--bg-surface)',
                                            borderRadius: 'var(--radius-lg)',
                                            border: '1px solid var(--border-subtle)',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <button
                                            onClick={() => toggleAccordion(index)}
                                            style={{
                                                width: '100%',
                                                padding: '1.25rem',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                textAlign: 'left',
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: isOpen ? 'var(--color-primary)' : 'var(--text-main)',
                                                transition: 'color 0.2s'
                                            }}
                                        >
                                            {item.q}
                                            {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                        </button>

                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                >
                                                    <div style={{
                                                        padding: '0 1.25rem 1.25rem 1.25rem',
                                                        color: 'var(--text-secondary)',
                                                        lineHeight: '1.6',
                                                        borderTop: '1px solid var(--border-subtle)'
                                                    }}>
                                                        {item.a}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    staticFaqs.map((section, secIndex) => (
                        <div key={secIndex}>
                            <h2 style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                marginBottom: '1.5rem',
                                color: 'var(--text-main)',
                                borderBottom: '2px solid var(--border-subtle)',
                                paddingBottom: '0.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                <HelpCircle size={24} color="var(--color-accent)" />
                                {section.category}
                            </h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {section.items.map((item, itemIndex) => {
                                    const index = `static-${secIndex}-${itemIndex}`
                                    const isOpen = openIndex === index

                                    return (
                                        <div
                                            key={index}
                                            style={{
                                                backgroundColor: 'var(--bg-surface)',
                                                borderRadius: 'var(--radius-lg)',
                                                border: '1px solid var(--border-subtle)',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <button
                                                onClick={() => toggleAccordion(index)}
                                                style={{
                                                    width: '100%',
                                                    padding: '1.25rem',
                                                    display: 'flex',
                                                    justifyContent: 'space-between',
                                                    alignItems: 'center',
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    fontSize: '1.1rem',
                                                    fontWeight: '600',
                                                    color: isOpen ? 'var(--color-primary)' : 'var(--text-main)',
                                                    transition: 'color 0.2s'
                                                }}
                                            >
                                                {item.q}
                                                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>

                                            <AnimatePresence>
                                                {isOpen && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                                    >
                                                        <div style={{
                                                            padding: '0 1.25rem 1.25rem 1.25rem',
                                                            color: 'var(--text-secondary)',
                                                            lineHeight: '1.6',
                                                            borderTop: '1px solid var(--border-subtle)'
                                                        }}>
                                                            {item.a}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div style={{
                marginTop: '4rem',
                padding: '2rem',
                backgroundColor: 'var(--bg-surface-secondary)',
                borderRadius: 'var(--radius-lg)',
                textAlign: 'center'
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Aradığınız cevabı bulamadınız mı?</h3>
                <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    Hafta içi 09:00 - 18:00 saatleri arasında destek ekibimizle iletişime geçebilirsiniz.
                </p>
                <Link href="/contact" className="btn btn-primary">
                    Bize Ulaşın
                </Link>
            </div>
        </div>
    )
}
