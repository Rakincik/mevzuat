import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useCartStore } from '@/stores/cartStore'
import { BookOpen, ShoppingCart } from 'lucide-react'
import styles from './ProductCard.module.css'

interface ProductCardProps {
    id: string
    name: string
    slug: string
    description: string
    price: number
    salePrice?: number | null
    image?: string | null
    categoryName?: string
}

export default function ProductCard({
    id,
    name,
    slug,
    description,
    price,
    salePrice,
    image,
    categoryName,
}: ProductCardProps) {
    const { addItem } = useCartStore()

    const hasDiscount = salePrice && salePrice < price

    return (
        <article className={styles.card}>
            <Link href={`/products/${slug}`} className={styles.cardLink}>
                {/* Image */}
                <div className={styles.imageWrapper}>
                    {image ? (
                        <Image
                            src={image}
                            alt={name}
                            fill
                            className={styles.image}
                        />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <BookOpen size={48} />
                        </div>
                    )}

                    {hasDiscount && (
                        <span className={styles.badgeSale}>İndirim</span>
                    )}
                </div>

                {/* Content */}
                <div className={styles.content}>
                    <div className={styles.header}>
                        {categoryName && (
                            <span className={styles.category}>{categoryName}</span>
                        )}
                        <h3 className={styles.title}>{name}</h3>
                    </div>

                    <p className={styles.description}>{description}</p>

                    <div className={styles.footer}>
                        <div className={styles.priceWrapper}>
                            {hasDiscount ? (
                                <>
                                    <span className={styles.price}>{salePrice.toLocaleString('tr-TR')} ₺</span>
                                    <span className={styles.oldPrice}>{price.toLocaleString('tr-TR')} ₺</span>
                                </>
                            ) : (
                                <span className={styles.price}>{price.toLocaleString('tr-TR')} ₺</span>
                            )}
                        </div>

                        <button
                            className={styles.addButton}
                            onClick={(e) => {
                                e.preventDefault()
                                addItem({ id, name, slug, price, salePrice, image })
                            }}
                        >
                            <ShoppingCart size={18} className={styles.btnIcon} />
                            <span>Sepete Ekle</span>
                        </button>
                    </div>
                </div>
            </Link>
        </article>
    )
}
