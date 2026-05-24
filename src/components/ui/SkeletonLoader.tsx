'use client'

import { motion } from 'framer-motion'
import styles from './SkeletonLoader.module.css'

interface SkeletonProps {
    variant?: 'text' | 'card' | 'circle' | 'rectangle'
    width?: string | number
    height?: string | number
    count?: number
    className?: string
}

export default function SkeletonLoader({
    variant = 'text',
    width,
    height,
    count = 1,
    className = '',
}: SkeletonProps) {
    const skeletons = Array.from({ length: count }, (_, i) => i)

    const getStyles = () => {
        const base: React.CSSProperties = {}

        if (width) base.width = typeof width === 'number' ? `${width}px` : width
        if (height) base.height = typeof height === 'number' ? `${height}px` : height

        return base
    }

    return (
        <>
            {skeletons.map((i) => (
                <motion.div
                    key={i}
                    className={`${styles.skeleton} ${styles[variant]} ${className}`}
                    style={getStyles()}
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.1,
                    }}
                />
            ))}
        </>
    )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
    return (
        <div className={styles.productCardSkeleton}>
            <SkeletonLoader variant="rectangle" className={styles.imageSkeleton} />
            <div className={styles.contentSkeleton}>
                <SkeletonLoader variant="text" width="40%" height={12} />
                <SkeletonLoader variant="text" width="80%" height={18} />
                <SkeletonLoader variant="text" width="100%" height={14} count={2} />
                <SkeletonLoader variant="text" width="50%" height={24} />
            </div>
        </div>
    )
}

// Bento Grid Skeleton
export function BentoGridSkeleton() {
    return (
        <div className={styles.bentoGridSkeleton}>
            <SkeletonLoader variant="rectangle" className={styles.bentoLarge} />
            <SkeletonLoader variant="rectangle" className={styles.bentoSmall} />
            <SkeletonLoader variant="rectangle" className={styles.bentoSmall} />
            <SkeletonLoader variant="rectangle" className={styles.bentoMedium} />
            <SkeletonLoader variant="rectangle" className={styles.bentoMedium} />
        </div>
    )
}
