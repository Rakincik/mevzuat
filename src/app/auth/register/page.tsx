'use client'

import Link from 'next/link'
import styles from './auth.module.css'
import Image from 'next/image'

export default function RegisterPage() {
    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <div className={styles.logoWrapper} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Image
                        src="/images/logo.png"
                        alt="MEVZUAT ADAM"
                        width={200}
                        height={60}
                        style={{ height: '50px', width: 'auto', objectFit: 'contain', marginBottom: '1.25rem' }}
                        priority
                    />
                    <h2>Kayıt Ol</h2>
                    <p>Yeni bir hesap oluşturun ve avantajlardan yararlanın.</p>
                </div>

                <form className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name">Ad</label>
                            <input type="text" id="name" className="input" placeholder="Adınız" />
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="surname">Soyad</label>
                            <input type="text" id="surname" className="input" placeholder="Soyadınız" />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="email">E-posta</label>
                        <input type="email" id="email" className="input" placeholder="ornek@email.com" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Şifre</label>
                        <input type="password" id="password" className="input" placeholder="••••••••" />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="confirmPassword">Şifre Tekrar</label>
                        <input type="password" id="confirmPassword" className="input" placeholder="••••••••" />
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Kayıt Ol
                    </button>
                </form>

                <div className={styles.footer}>
                    Zaten hesabınız var mı? <Link href="/auth/login" className={styles.link}>Giriş Yap</Link>
                </div>
            </div>
        </div>
    )
}
