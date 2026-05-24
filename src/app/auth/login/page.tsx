'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import styles from './auth.module.css'
import Image from 'next/image'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!email || !password) {
            setError('Lütfen tüm alanları doldurun.')
            return
        }

        if (email === 'mevzuatadam@admin.com' && password === 'Mevzuat.1!') {
            localStorage.setItem('admin_auth', 'true')
            router.push('/admin')
        } else {
            setError('E-posta veya şifre hatalı!')
        }
    }

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
                    <h2>Giriş Yap</h2>
                    <p>Hesabınıza erişmek için bilgilerinizi girin.</p>
                </div>

                {error && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        border: '1px solid #fca5a5',
                        color: '#b91c1c',
                        padding: '10px 14px',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        marginBottom: '16px',
                        textAlign: 'center',
                        fontWeight: '500'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email">E-posta</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="input" 
                            placeholder="E-postanız" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="password">Şifre</label>
                        <input 
                            type="password" 
                            id="password" 
                            className="input" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <label className={styles.checkbox}>
                            <input type="checkbox" />
                            Beni Hatırla
                        </label>
                        <Link href="/auth/forgot-password" className={styles.link}>Şifremi Unuttum</Link>
                    </div>

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }}>
                        Giriş Yap
                    </button>
                </form>

                <div className={styles.footer}>
                    Hesabınız yok mu? <Link href="/auth/register" className={styles.link}>Kayıt Ol</Link>
                </div>
            </div>
        </div>
    )
}
