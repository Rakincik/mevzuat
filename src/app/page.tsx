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
  const { products, kurumlar, settings, featuredIds, pages, altKategoriler } = useApp()
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

  // Get active subcategories (altKategoriler) that are marked to show on homepage
  const featuredSubcatOrders = homePage?.featuredSubcatOrders || []
  const activeAltKategoriler = (altKategoriler || [])
    .filter(cat => cat.status !== 'passive' && cat.showOnHomepage === true)
    .sort((a, b) => {
      const idxA = featuredSubcatOrders.indexOf(a.id)
      const idxB = featuredSubcatOrders.indexOf(b.id)
      if (idxA > -1 && idxB > -1) return idxA - idxB
      if (idxA > -1) return -1
      if (idxB > -1) return 1
      return (a.order || 999) - (b.order || 999)
    })

  const getSubcategoryProductCount = (subcatSlug: string) => {
    return products.filter(p => p.status !== 'passive' && (p.altKategoriSlug === subcatSlug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(subcatSlug)))).length
  }

  const getSubcategoryPrimaryInstitution = (cat: any) => {
    const parentSlug = cat.kurumSlugs?.[0] || 'genel-gys'
    return kurumlar.find(k => k.slug === parentSlug)
  }

  const sectionOrder = homePage?.sectionOrder || ['slider', 'featured', 'subcategories', 'yapboz', 'about', 'kurumlar']

  return (
    <div className={styles.homeContainer}>
      {sectionOrder.map((sectionKey) => {
        switch (sectionKey) {
          case 'slider':
            return mounted && (homePage?.activeSections?.slider !== false || homePage?.activeSections?.ctaPanels !== false) && (
              <HeroSlider 
                key="slider"
                slides={homePage?.activeSections?.slider !== false ? homePage?.slides : []} 
                ctaPanels={homePage?.activeSections?.ctaPanels !== false ? homePage?.ctaPanels : []} 
              />
            )
          case 'featured':
            return (!homePage || homePage.activeSections?.featured !== false) && (
              <section key="featured" className="section container" style={{ paddingTop: '4rem', paddingBottom: '2rem' }}>
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
            )
          case 'subcategories':
            return (!homePage || homePage.activeSections?.subcategories !== false) && activeAltKategoriler.length > 0 && (
              <section key="subcategories" className="section container" style={{ paddingBottom: '2rem' }}>
                <div className="section-header">
                  <h2>Popüler Sınav Grupları</h2>
                  <p>Hedeflediğiniz kariyer ve unvan sınavına ait özel ders grupları.</p>
                </div>
                
                <div className={styles.subcategoriesGrid} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
                  {activeAltKategoriler.map(cat => {
                    const count = getSubcategoryProductCount(cat.slug);
                    const primaryKurum = getSubcategoryPrimaryInstitution(cat);
                    const kurumColor = primaryKurum?.color || '#3b82f6';
                    const kurumName = primaryKurum?.name || 'Mevzuat Sınavları';
                    const linkUrl = primaryKurum ? `/products/${primaryKurum.slug}/${cat.slug}` : `/products/genel-gys/${cat.slug}`;

                    return (
                      <Link 
                        href={linkUrl}
                        key={cat.id} 
                        className={styles.subcatCard}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          padding: '24px',
                          background: 'var(--bg-surface)',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border-subtle)',
                          transition: 'all 0.3s ease',
                          textDecoration: 'none',
                          position: 'relative',
                          overflow: 'hidden',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
                        }}
                      >
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '4px',
                          height: '100%',
                          backgroundColor: kurumColor
                        }} />
                        
                        <div>
                          <span style={{
                            fontSize: '10px',
                            fontWeight: '800',
                            color: kurumColor,
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            display: 'block',
                            marginBottom: '6px'
                          }}>
                            {kurumName}
                          </span>
                          
                          <h3 style={{
                            fontSize: '18px',
                            fontWeight: '800',
                            color: 'var(--text-main)',
                            margin: '0 0 8px 0',
                            lineHeight: '1.3'
                          }}>
                            {cat.name}
                          </h3>
                          
                          <p style={{
                            fontSize: '13px',
                            color: 'var(--text-secondary)',
                            margin: '0 0 16px 0',
                            lineHeight: '1.5'
                          }}>
                            {cat.description || 'Sınav hazırlık konu anlatımı ve soru bankaları.'}
                          </p>
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          borderTop: '1px solid var(--border-subtle)',
                          paddingTop: '12px',
                          marginTop: '12px'
                        }}>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: 'var(--text-muted)'
                          }}>
                            📚 {count} Aktif Eğitim
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: '800',
                            color: kurumColor,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            İncele →
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )
          case 'yapboz':
            return mounted && homePage?.customSections && homePage.customSections.length > 0 && (
              <div key="yapboz">
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
              </div>
            )
          case 'about':
            return (!homePage || homePage.activeSections?.about !== false) && (
              <section key="about" id="about" className="section container" style={{ paddingBottom: '2rem' }}>
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
                  <p 
                    style={{ maxWidth: '800px', lineHeight: '1.8', color: 'var(--text-secondary)', fontSize: '1.1rem' }}
                    dangerouslySetInnerHTML={{ __html: (mounted && aboutPage?.aboutText ? aboutPage.aboutText : settings.aboutText) || '' }}
                  />
                  <Link href="/about" className="btn btn-outline" style={{ border: '2px solid var(--color-primary)', fontWeight: 'var(--font-bold)' }}>
                    Daha Fazla Bilgi Al
                  </Link>
                </div>
              </section>
            )
          case 'kurumlar':
            return (!homePage || homePage.activeSections?.kurumlar !== false) && (
              <section key="kurumlar" className="section container">
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
            )
          default:
            return null
        }
      })}
    </div>
  )
}


