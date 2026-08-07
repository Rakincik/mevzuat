'use client'
 
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import KurumEmblem from '@/components/KurumEmblem'
import ProductCard from '@/components/ProductCard'
import { useApp } from '@/context/AppContext'
import styles from './page.module.css'
 
export default function SubcategoryPage() {
    const { kurumSlug, altKategoriSlug } = useParams<{ kurumSlug: string; altKategoriSlug: string }>()
    const { products: allDynamicProducts, altKategoriler, kurumlar } = useApp()
    
    const kurum = kurumlar.find(k => k.slug === kurumSlug)
    if (!kurum) {
        notFound()
    }
 
    const currentAltCat = altKategoriler.find(c => c.slug === altKategoriSlug)
    
    // Only throw 404 if the category doesn't exist in our config AND has no products
    if (!currentAltCat && allDynamicProducts.filter(p => p.altKategoriSlug === altKategoriSlug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(altKategoriSlug))).length === 0) {
        notFound()
    }

    const products = allDynamicProducts.filter(p => 
        p.status !== 'passive' &&
        (p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug))) && 
        (p.altKategoriSlug === altKategoriSlug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(altKategoriSlug)))
    )

    const sortedProducts = [...products].sort((a, b) => {
        const key = `${kurumSlug}_${altKategoriSlug}`
        const orderA = a.categoryOrders?.[key] ?? a.order ?? 9999
        const orderB = b.categoryOrders?.[key] ?? b.order ?? 9999
        if (orderA !== orderB) return orderA - orderB
        return a.name.localeCompare(b.name, 'tr')
    })

    // Dynamically retrieve the correct alt category name matching the active slug
    const firstProduct = products[0]
    let altKategoriName = 'Kategori'

    if (currentAltCat) {
        altKategoriName = currentAltCat.name
    } else if (firstProduct) {
        if (firstProduct.altKategoriSlugs && firstProduct.altKategoriNames) {
            const slugIdx = firstProduct.altKategoriSlugs.indexOf(altKategoriSlug)
            if (slugIdx > -1 && firstProduct.altKategoriNames[slugIdx]) {
                altKategoriName = firstProduct.altKategoriNames[slugIdx]
            } else {
                altKategoriName = firstProduct.altKategoriName
            }
        } else {
            altKategoriName = firstProduct.altKategoriName
        }
    }

    return (
        <div className="container section">
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.breadcrumbs}>
                    <Link href="/">Ana Sayfa</Link> /{' '}
                    <Link href="/products">Kurumlar</Link> /{' '}
                    <Link href={`/products/${kurumSlug}`}>{kurum.name}</Link> /{' '}
                    <span>{altKategoriName}</span>
                </div>

                <div className={styles.subHeader}>
                    {/* Official Seal and Subcategory Title */}
                    <div className={styles.emblemWrapper}>
                        <KurumEmblem slug={kurumSlug} size={84} />
                    </div>
                    <div>
                        <span className={styles.miniLabel} style={{ color: kurum.color }}>
                            {kurum.name} Sınav Grubu
                        </span>
                        <h1>{altKategoriName}</h1>
                        <p className={styles.description}>
                            Bu kategori altında {products.length} adet sınav hazırlık eğitimi ve ders listelenmektedir.
                        </p>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className={styles.toolbar}>
                <span>{products.length} Ders listeleniyor</span>
            </div>

            {/* Products Grid */}
            {sortedProducts.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 24px', background: '#f8fafc', borderRadius: '12px', border: '1.5px dashed #cbd5e1', marginTop: '20px' }}>
                    <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📘</span>
                    <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '8px' }}>Bu Sınav Grubunda Henüz Eğitim Bulunmamaktadır</h3>
                    <p style={{ fontSize: '14px', color: '#64748b' }}>Bu kuruma ait sınav grubu için eğitim içerikleri yakında eklenecektir.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {sortedProducts.map(product => (
                        <ProductCard
                            key={product.id}
                            {...product}
                            slug={`${kurumSlug}/${altKategoriSlug}/${product.slug}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
