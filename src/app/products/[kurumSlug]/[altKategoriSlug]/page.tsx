'use client'
 
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import { getKurumBySlug } from '@/data/products'
import KurumEmblem from '@/components/KurumEmblem'
import ProductCard from '@/components/ProductCard'
import { useApp } from '@/context/AppContext'
import styles from './page.module.css'
 
export default function SubcategoryPage() {
    const { kurumSlug, altKategoriSlug } = useParams<{ kurumSlug: string; altKategoriSlug: string }>()
    const { products: allDynamicProducts, altKategoriler } = useApp()
    
    const kurum = getKurumBySlug(kurumSlug)
    if (!kurum) {
        notFound()
    }
 
    const products = allDynamicProducts.filter(p => 
        (p.kurumSlug === kurumSlug || (p.kurumSlugs && p.kurumSlugs.includes(kurumSlug))) && 
        (p.altKategoriSlug === altKategoriSlug || (p.altKategoriSlugs && p.altKategoriSlugs.includes(altKategoriSlug)))
    )
    if (products.length === 0) {
        notFound()
    }

    // Dynamically retrieve the correct alt category name matching the active slug
    const currentAltCat = altKategoriler.find(c => c.slug === altKategoriSlug)
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
            <div className={styles.grid}>
                {products.map(product => (
                    <ProductCard
                        key={product.id}
                        {...product}
                        slug={`${kurumSlug}/${altKategoriSlug}/${product.slug}`}
                    />
                ))}
            </div>
        </div>
    )
}
