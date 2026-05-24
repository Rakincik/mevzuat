'use client'

import React from 'react'
import { AlertTriangle, HelpCircle, X } from 'lucide-react'

interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    isDangerous?: boolean
    onConfirm: () => void
    onClose: () => void
}

export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = 'Evet, Devam Et',
    cancelText = 'İptal',
    isDangerous = false,
    onConfirm,
    onClose
}: ConfirmModalProps) {
    if (!isOpen) return null

    const handleConfirm = () => {
        onConfirm()
        onClose()
    }

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            animation: 'fadeIn 0.2s ease'
        }}>
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>
            
            <div style={{
                background: 'white',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '440px',
                padding: '24px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                animation: 'scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                position: 'relative'
            }}>
                {/* Close btn */}
                <button 
                    onClick={onClose} 
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '50%',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#e2e8f0'}
                    onMouseLeave={(e) => e.currentTarget.style.background = '#f1f5f9'}
                >
                    <X size={14} />
                </button>

                {/* Icon & Title */}
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                    <div style={{
                        background: isDangerous ? '#fee2e2' : '#eff6ff',
                        color: isDangerous ? '#ef4444' : '#3b82f6',
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                    }}>
                        {isDangerous ? <AlertTriangle size={20} /> : <HelpCircle size={20} />}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1, paddingRight: '20px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: '900', color: '#0f172a', margin: '0', lineHeight: '1.3' }}>
                            {title}
                        </h3>
                        <p style={{ fontSize: '12.5px', color: '#475569', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                            {message}
                        </p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button 
                        onClick={onClose} 
                        style={{
                            padding: '10px 16px',
                            background: '#fff',
                            border: '1.5px solid #cbd5e1',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: '700',
                            color: '#475569',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
                        onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
                    >
                        {cancelText}
                    </button>
                    
                    <button 
                        onClick={handleConfirm} 
                        style={{
                            padding: '10px 20px',
                            background: isDangerous ? '#ef4444' : '#3b82f6',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '12.5px',
                            fontWeight: '800',
                            color: 'white',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                            boxShadow: isDangerous ? '0 4px 12px rgba(239, 68, 68, 0.2)' : '0 4px 12px rgba(59, 130, 246, 0.2)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                        {confirmText}
                    </button>
                </div>

            </div>
        </div>
    )
}
