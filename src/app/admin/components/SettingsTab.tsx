'use client'

import React, { useState, useEffect } from 'react'
import { Settings, Info, Save, Share2, Globe } from 'lucide-react'
import { useApp } from '@/context/AppContext'
import styles from '../page.module.css'

interface SettingsTabProps {
    triggerToast: (message: string) => void
}

export default function SettingsTab({ triggerToast }: SettingsTabProps) {
    const { settings, updateSettings } = useApp()
    const [settingsForm, setSettingsForm] = useState({ ...settings })

    // Sync settings form when settings are loaded from context
    useEffect(() => {
        if (settings) {
            setSettingsForm({ ...settings })
        }
    }, [settings])

    const handleSettingsSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        updateSettings(settingsForm)
        triggerToast('Site ayarları başarıyla güncellendi!')
    }

    return (
        <div className={styles.bentoGrid}>
            {/* Card 1: Site Kimliği & İletişim Bilgileri */}
            <div className={styles.bentoCard}>
                <h2 className={styles.cardTitle}>
                    <Globe size={18} />
                    <span>Site Kimliği & İletişim Bilgileri</span>
                </h2>
                <p className={styles.cardDesc}>Sitenin tarayıcı başlığı, sloganı ve genel iletişim kanallarını buradan yönetin.</p>
                
                <form onSubmit={handleSettingsSubmit} className={styles.adminForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="siteTitle">Site Başlığı</label>
                        <input 
                            id="siteTitle"
                            type="text" 
                            value={settingsForm.siteTitle || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, siteTitle: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: MEVZUAT ADAM - Görevde Yükselme"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="siteSubtitle">Site Alt Başlığı (Slogan)</label>
                        <input 
                            id="siteSubtitle"
                            type="text" 
                            value={settingsForm.siteSubtitle || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, siteSubtitle: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: Kurumsal eğitim çözümleri ve sınav hazırlık platformu"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="phone">Telefon Numarası</label>
                        <input 
                            id="phone"
                            type="text" 
                            value={settingsForm.phone || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: 0507 773 63 47"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">E-posta Adresi</label>
                        <input 
                            id="email"
                            type="email" 
                            value={settingsForm.email || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: mevzuatadam@gmail.com"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="address">Kurumsal Adres</label>
                        <textarea 
                            id="address"
                            value={settingsForm.address || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                            className={styles.formTextarea}
                            placeholder="Eğitim Vadisi Plaza, Kat: 5, No: 42, Çankaya, Ankara"
                        />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                        <Save size={16} />
                        <span>Genel Bilgileri Kaydet</span>
                    </button>
                </form>
            </div>

            {/* Card 2: Canlı Destek & Sosyal Medya Entegrasyonu */}
            <div className={styles.bentoCard}>
                <h2 className={styles.cardTitle}>
                    <Share2 size={18} />
                    <span>Canlı Destek & Sosyal Medya</span>
                </h2>
                <p className={styles.cardDesc}>WhatsApp canlı destek numarasını ve sitenin sosyal medya kanallarını buradan kontrol edin.</p>
                
                <form onSubmit={handleSettingsSubmit} className={styles.adminForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="whatsapp">WhatsApp Telefonu (Uluslararası Format)</label>
                        <input 
                            id="whatsapp"
                            type="text" 
                            value={settingsForm.whatsapp || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: 905077736347"
                        />
                        <div className={styles.inputAlert}>
                            <Info size={16} className={styles.inputAlertIcon} />
                            <span className={styles.inputAlertText}>
                                WhatsApp butonu için başında '+' ve aralarında boşluk olmadan ülke koduyla birlikte yazın.
                            </span>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="instagram">Instagram Adresi</label>
                        <input 
                            id="instagram"
                            type="text" 
                            value={settingsForm.instagram || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, instagram: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: https://instagram.com/mevzuatadam"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="youtube">YouTube Kanalı</label>
                        <input 
                            id="youtube"
                            type="text" 
                            value={settingsForm.youtube || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, youtube: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: https://youtube.com/mevzuatadam"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="twitter">Twitter / X Adresi</label>
                        <input 
                            id="twitter"
                            type="text" 
                            value={settingsForm.twitter || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, twitter: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: https://x.com/mevzuatadam"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="facebook">Facebook Adresi</label>
                        <input 
                            id="facebook"
                            type="text" 
                            value={settingsForm.facebook || ''}
                            onChange={(e) => setSettingsForm({ ...settingsForm, facebook: e.target.value })}
                            className={styles.formInput}
                            placeholder="Örn: https://facebook.com/mevzuatadam"
                        />
                    </div>

                    <button type="submit" className={styles.btnSubmit}>
                        <Save size={16} />
                        <span>Destek & Sosyal Medyayı Kaydet</span>
                    </button>
                </form>
            </div>
        </div>
    )
}
