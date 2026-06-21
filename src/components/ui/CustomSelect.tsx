'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

interface Option {
    label: string | React.ReactNode
    value: string
    disabled?: boolean
}

interface CustomSelectProps {
    value: string
    onChange: (value: string) => void
    options: Option[]
    placeholder?: string
    id?: string
    style?: React.CSSProperties
    className?: string
}

export default function CustomSelect({ value, onChange, options, placeholder = 'Seçiniz', id, style, className }: CustomSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectedOption = options.find(opt => opt.value === value)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%', ...style }} className={className} id={id}>
            <div 
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    padding: '10px 14px',
                    border: isOpen ? '1px solid #3b82f6' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    background: '#fff',
                    color: selectedOption ? '#0f172a' : '#64748b',
                    fontSize: '14px',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: isOpen ? '0 0 0 4px rgba(59, 130, 246, 0.1)' : 'none',
                    transition: 'all 0.2s ease',
                    minHeight: '42px',
                    fontFamily: 'inherit'
                }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <ChevronDown size={16} style={{ color: '#64748b', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} />
            </div>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    left: 0,
                    width: '100%',
                    background: '#fff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
                    zIndex: 50,
                    maxHeight: '250px',
                    overflowY: 'auto',
                    padding: '4px'
                }}>
                    {options.map((option) => (
                        <div
                            key={option.value}
                            onClick={() => {
                                if (option.disabled) return;
                                onChange(option.value)
                                setIsOpen(false)
                            }}
                            style={{
                                padding: '8px 12px',
                                borderRadius: '4px',
                                cursor: option.disabled ? 'default' : 'pointer',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: option.value === value ? '#eff6ff' : 'transparent',
                                color: option.disabled ? '#94a3b8' : (option.value === value ? '#2563eb' : '#334155'),
                                fontSize: option.disabled ? '11px' : '13px',
                                fontWeight: option.disabled ? '800' : (option.value === value ? '600' : '500'),
                                textTransform: option.disabled ? 'uppercase' : 'none',
                                letterSpacing: option.disabled ? '0.05em' : 'normal',
                                marginTop: option.disabled ? '6px' : '0',
                                marginBottom: option.disabled ? '2px' : '0',
                                transition: 'background 0.15s ease'
                            }}
                            onMouseEnter={(e) => {
                                if (!option.disabled && option.value !== value) {
                                    e.currentTarget.style.background = '#f8fafc'
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!option.disabled && option.value !== value) {
                                    e.currentTarget.style.background = 'transparent'
                                }
                            }}
                        >
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {option.label}
                            </span>
                            {option.value === value && <Check size={14} style={{ flexShrink: 0 }} />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
