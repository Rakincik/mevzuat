'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import styles from './BentoGrid.module.css'

interface BentoGridProps {
    children: ReactNode
    className?: string
}

interface BentoItemProps {
    children: ReactNode
    colSpan?: 1 | 2 | 3
    rowSpan?: 1 | 2
    index?: number
    className?: string
}

export function BentoGrid({ children, className = '' }: BentoGridProps) {
    return (
        <div className={`${styles.grid} ${className}`}>
            {children}
        </div>
    )
}

export function BentoItem({
    children,
    colSpan = 1,
    rowSpan = 1,
    index = 0,
    className = ''
}: BentoItemProps) {
    return (
        <motion.div
            className={`${styles.item} ${styles[`col-${colSpan}`]} ${styles[`row-${rowSpan}`]} ${className}`}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.22, 1, 0.36, 1]
            }}
            whileHover={{
                y: -6,
                transition: { duration: 0.3 }
            }}
        >
            <div className={styles.glowBorder} />
            <div className={styles.content}>
                {children}
            </div>
        </motion.div>
    )
}
