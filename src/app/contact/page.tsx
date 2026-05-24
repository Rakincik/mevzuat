'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { MapPin, Phone, Mail, Clock, Send, Map } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import styles from './contact.module.css'

export default function ContactPage() {
    const { settings, pages } = useApp()
    const contactPage = pages.find(p => p.id === 'contact')
    
    const phone = contactPage?.phone || settings.phone
    const email = contactPage?.email || settings.email
    const address = contactPage?.address || settings.address

    return (
        <div className={styles.pageContainer}>
            {/* Header */}
            <header className={styles.header}>
                <div className="container">
                    <motion.h1
                        className={styles.title}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        Bizimle İletişime Geçin
                    </motion.h1>
                    <p className={styles.subtitle}>
                        Sorularınız, önerileriniz veya iş birlikleri için buradayız.
                    </p>
                </div>
            </header>

            <div className="container">
                <div className={styles.grid}>
                    {/* Left: Info */}
                    <motion.div
                        className={styles.infoStack}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}>
                                <MapPin size={24} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Merkez Ofis</h3>
                                <p>{address}</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}>
                                <Phone size={24} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>Telefon</h3>
                                <p>{phone}</p>
                            </div>
                        </div>

                        <div className={styles.infoCard}>
                            <div className={styles.iconBox}>
                                <Mail size={24} />
                            </div>
                            <div className={styles.cardContent}>
                                <h3>E-posta</h3>
                                <p>{email}</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Form */}
                    <motion.div
                        className={styles.formCard}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className={styles.formTitle}>Mesaj Gönderin</h2>
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Adınız Soyadınız</label>
                                <input type="text" className={styles.input} placeholder="Örn: Ahmet Yılmaz" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>E-posta Adresiniz</label>
                                <input type="email" className={styles.input} placeholder="ahmet@ornek.com" />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Konu</label>
                                <input type="text" className={styles.input} placeholder="Konu başlığı..." />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Mesajınız</label>
                                <textarea className={styles.textarea} placeholder="Mesajınızı buraya yazın..."></textarea>
                            </div>
                            <button type="submit" className={styles.submitBtn}>
                                Gönder <Send size={18} style={{ display: 'inline', marginLeft: 8 }} />
                            </button>
                        </form>
                    </motion.div>
                </div>

                {/* Map Placeholder */}
                <div className={styles.mapSection}>
                    <div className={styles.mapPlaceholder}>
                        <Map size={48} />
                        <p>Google Maps Harita Alanı</p>
                        <p style={{ fontSize: '0.9em' }}>Ankara, Çankaya</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
