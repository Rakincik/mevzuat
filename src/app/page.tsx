'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { HelpCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { DynamicIcon } from '@/components/DynamicIcon'
import HeroSlider from '@/components/HeroSlider'
import KurumCard from '@/components/KurumCard'
import ProductCard from '@/components/ProductCard'
import { useApp } from '@/context/AppContext'
import styles from './page.module.css'

export default function Home() {
  const { products, kurumlar, settings, featuredIds, pages } = useApp()
  const [mounted, setMounted] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleScroll = (direction: 'left' | 'right') => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current
      const scrollAmount = clientWidth
      sliderRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth'
      })
    }
  }


  const homePage = pages.find(p => p.id === 'home')
  const aboutPage = pages.find(p => p.id === 'about')

  // Dynamic featured products
  const featuredProducts = products
    .filter(p => featuredIds.includes(p.id))
    .filter(p => p.status !== 'passive' && p.showOnHomepage !== false)
    .sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 9999
      const orderB = b.order !== undefined ? b.order : 9999
      return orderA - orderB
    })
  const showArrows = featuredProducts.length > 3

  // Filter and sort kurumlar for homepage
  const homepageKurumlar = kurumlar
    .filter(k => k.status !== 'passive' && k.showOnHomepage !== false)
    .sort((a, b) => {
      const orderA = a.order !== undefined ? a.order : 999
      const orderB = b.order !== undefined ? b.order : 999
      return orderA - orderB
    })

  return (
    <div className={styles.homeContainer}>
      <HeroSlider 
        slides={mounted ? homePage?.slides : undefined} 
        ctaPanels={mounted ? homePage?.ctaPanels : undefined} 
      />

      {/* Öne Çıkan Eğitimler */}
      <section className="section container" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
        <div className="section-header" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-end', 
          marginBottom: 'var(--space-lg)',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h2 style={{ fontSize: '2rem', fontWeight: 'var(--font-extrabold)', color: 'var(--text-main)', letterSpacing: '-0.02em', margin: 0 }}>Öne Çıkan Eğitimler</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '1rem', margin: 0 }}>
              {settings.siteSubtitle || "En çok tercih edilen popüler sınav hazırlık paketleri ve soru bankaları."}
            </p>
          </div>
          <Link href="/products?category=egitimler" className="btn btn-outline" style={{ display: 'inline-flex', alignItems: 'center', height: 'fit-content' }}>
            Tüm Eğitimleri Gör
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <div className={styles.sliderWrapper}>
            {showArrows && (
              <button 
                className={`${styles.sliderArrow} ${styles.arrowLeft}`} 
                onClick={() => handleScroll('left')}
                aria-label="Önceki sayfa"
              >
                <ChevronLeft size={22} strokeWidth={2.5} />
              </button>
            )}

            <div ref={sliderRef} className={styles.featuredGrid}>
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  slug={`${product.kurumSlug}/${product.altKategoriSlug}/${product.slug}`}
                />
              ))}
            </div>

            {showArrows && (
              <button 
                className={`${styles.sliderArrow} ${styles.arrowRight}`} 
                onClick={() => handleScroll('right')}
                aria-label="Sonraki sayfa"
              >
                <ChevronRight size={22} strokeWidth={2.5} />
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-lg)', border: '1px dashed var(--border-subtle)' }}>
            <p style={{ color: 'var(--text-muted)', margin: 0 }}>Öne çıkarılan eğitim bulunmamaktadır. Yönetim panelinden ekleyebilirsiniz.</p>
          </div>
        )}
      </section>

      {/* Dynamic Custom Sections (Modular Yapboz Builder) */}
      {mounted && homePage?.customSections && homePage.customSections.length > 0 && (
        <>
          {/* Card Layout Section */}
          {homePage.customSections.some(s => s.layout === 'card') && (
            <section className={styles.section} style={{ background: 'var(--bg-surface)' }}>
              <div className="container">
                <h2 className={styles.sectionTitle}>Neden Biz?</h2>
                <div className={styles.customCardGrid}>
                  {homePage.customSections.filter(s => s.layout === 'card').map((sect) => (
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

          {/* Alternating Split & Full-width layouts */}
          {homePage.customSections.filter(s => s.layout !== 'card').map((sect) => {
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
        </>
      )}

      {/* Hakkımızda */}
      <section id="about" className="section container" style={{ paddingBottom: '2rem' }}>
        <div className={styles.aboutContainer} style={{
          backgroundColor: 'var(--bg-surface)',
          padding: '3rem',
          borderRadius: 'var(--radius-md)',
          border: '2px solid var(--color-primary)',
          boxShadow: '6px 6px 0px 0px var(--color-primary)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.5rem'
        }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-primary)', fontWeight: 'var(--font-extrabold)' }}>Hakkımızda</h2>
          <p style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {mounted && aboutPage?.aboutText ? aboutPage.aboutText : settings.aboutText}
          </p>
          <Link href="/about" className="btn btn-outline" style={{ border: '2px solid var(--color-primary)', fontWeight: 'var(--font-bold)' }}>
            Daha Fazla Bilgi Al
          </Link>
        </div>
      </section>

      {/* Kurumlar */}
      <section className="section container">
        <div className="section-header">
          <h2>Kurumlar</h2>
          <p>Sınav hazırlığı yapmak istediğiniz kurumu seçin, ilgili derslere ulaşın.</p>
        </div>

        <div className={styles.kurumlarGrid}>
          {homepageKurumlar.map((kurum, index) => (
            <KurumCard
              key={kurum.id}
              {...kurum}
              index={index}
            />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
          <Link href="/products" className="btn btn-outline">
            Tüm Kurumları Gör
          </Link>
        </div>
      </section>
    </div>
  )
}


