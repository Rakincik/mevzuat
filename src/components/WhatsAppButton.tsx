'use client'

import { MessageCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useApp } from '@/context/AppContext'


const formatWhatsAppNumber = (num: string): string => {
    if (!num) return ''
    // 1. Remove all spaces, plus signs, parentheses, and dashes
    let cleaned = num.replace(/[\s\+\(\)\-]/g, '')
    
    // 2. If it starts with '00', remove the leading '00'
    if (cleaned.startsWith('00')) {
        cleaned = cleaned.substring(2)
    }
    
    // 3. If it starts with '0' (like '0507...'), replace the leading '0' with '90' (Turkey country code)
    if (cleaned.startsWith('0') && cleaned.length === 11) {
        cleaned = '90' + cleaned.substring(1)
    }
    
    // 4. If it has 10 digits (like '507...'), prepend '90' (Turkey country code)
    if (cleaned.length === 10 && (cleaned.startsWith('5') || cleaned.startsWith('8'))) {
        cleaned = '90' + cleaned
    }
    
    return cleaned
}

export default function WhatsAppButton() {
    const pathname = usePathname()
    const { settings } = useApp()

    const sanitizedPhone = formatWhatsAppNumber(settings.whatsapp || '905077736347')

    return (
        <motion.a
            href={`https://wa.me/${sanitizedPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#25D366',
                zIndex: 99999,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(37, 211, 102, 0.4)',
                cursor: 'pointer'
            }}
        >
            <MessageCircle size={32} color="white" />
            <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#25D366]"
                animate={{ scale: [1, 1.5], opacity: [1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '50%',
                    border: '2px solid #25D366',
                    pointerEvents: 'none'
                }}
            />
        </motion.a>
    )
}
