'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [cursorText, setCursorText] = useState('')

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 400 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        // Hide on mobile
        if (window.matchMedia('(pointer: coarse)').matches) return

        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
        }

        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement

            // Check for interactive elements
            const interactive = target.closest('a, button, [data-cursor]')
            if (interactive) {
                setIsHovering(true)
                const text = interactive.getAttribute('data-cursor') || ''
                setCursorText(text)
            }
        }

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('a, button, [data-cursor]')) {
                setIsHovering(false)
                setCursorText('')
            }
        }

        window.addEventListener('mousemove', moveCursor)
        window.addEventListener('mousedown', handleMouseDown)
        window.addEventListener('mouseup', handleMouseUp)
        document.addEventListener('mouseover', handleMouseOver)
        document.addEventListener('mouseout', handleMouseOut)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            window.removeEventListener('mousedown', handleMouseDown)
            window.removeEventListener('mouseup', handleMouseUp)
            document.removeEventListener('mouseover', handleMouseOver)
            document.removeEventListener('mouseout', handleMouseOut)
        }
    }, [cursorX, cursorY])

    // Mobile check
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
        return null
    }

    return (
        <>
            {/* Main cursor dot */}
            <motion.div
                className={`${styles.cursor} ${isHovering ? styles.hovering : ''} ${isClicking ? styles.clicking : ''}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            />

            {/* Cursor ring */}
            <motion.div
                className={`${styles.cursorRing} ${isHovering ? styles.ringHovering : ''}`}
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                {cursorText && (
                    <span className={styles.cursorText}>{cursorText}</span>
                )}
            </motion.div>
        </>
    )
}
