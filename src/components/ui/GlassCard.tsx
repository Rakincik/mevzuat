'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import styles from './GlassCard.module.css'

interface GlassCardProps extends HTMLMotionProps<'div'> {
    children: ReactNode
    variant?: 'default' | 'elevated' | 'neon'
    hoverEffect?: boolean
    glowColor?: 'cyan' | 'magenta' | 'gold' | 'green'
    className?: string
}

export default function GlassCard({
    children,
    variant = 'default',
    hoverEffect = true,
    glowColor = 'cyan',
    className = '',
    ...props
}: GlassCardProps) {
    return (
        <motion.div
            className={`${styles.card} ${styles[variant]} ${styles[`glow-${glowColor}`]} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            whileHover={hoverEffect ? {
                y: -8,
                scale: 1.02,
                transition: { duration: 0.3 }
            } : undefined}
            {...props}
        >
            <div className={styles.glowBorder} />
            <div className={styles.content}>
                {children}
            </div>
        </motion.div>
    )
}
