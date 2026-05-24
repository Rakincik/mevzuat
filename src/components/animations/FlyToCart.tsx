'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import styles from './FlyToCart.module.css'

interface FlyToCartProps {
    isActive: boolean
    startPosition: { x: number; y: number }
    productImage?: string
    onComplete?: () => void
}

export default function FlyToCart({
    isActive,
    startPosition,
    productImage,
    onComplete
}: FlyToCartProps) {
    const [particles, setParticles] = useState<number[]>([])

    useEffect(() => {
        if (isActive) {
            // Generate particles for explosion effect
            setParticles(Array.from({ length: 8 }, (_, i) => i))
        }
    }, [isActive])

    // Get cart icon position (top-right area typically)
    const endPosition = { x: window.innerWidth - 60, y: 35 }

    return (
        <AnimatePresence>
            {isActive && (
                <>
                    {/* Flying product thumbnail */}
                    <motion.div
                        className={styles.flyingItem}
                        initial={{
                            x: startPosition.x,
                            y: startPosition.y,
                            scale: 1,
                            opacity: 1,
                        }}
                        animate={{
                            x: endPosition.x,
                            y: endPosition.y,
                            scale: 0.2,
                            opacity: 0.8,
                        }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{
                            duration: 0.8,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        onAnimationComplete={onComplete}
                    >
                        {productImage ? (
                            <img src={productImage} alt="" className={styles.thumbnail} />
                        ) : (
                            <span className={styles.placeholder}>📚</span>
                        )}

                        {/* Trail effect */}
                        <motion.div
                            className={styles.trail}
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.4 }}
                        />
                    </motion.div>

                    {/* Particles at end position */}
                    {particles.map((i) => (
                        <motion.div
                            key={i}
                            className={styles.particle}
                            initial={{
                                x: endPosition.x,
                                y: endPosition.y,
                                scale: 0,
                                opacity: 1,
                            }}
                            animate={{
                                x: endPosition.x + (Math.random() - 0.5) * 100,
                                y: endPosition.y + (Math.random() - 0.5) * 100,
                                scale: [0, 1, 0],
                                opacity: [1, 1, 0],
                            }}
                            transition={{
                                duration: 0.6,
                                delay: 0.7,
                                ease: 'easeOut',
                            }}
                        />
                    ))}
                </>
            )}
        </AnimatePresence>
    )
}
