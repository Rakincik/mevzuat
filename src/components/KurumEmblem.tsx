'use client'

import React from 'react'
import { useApp } from '@/context/AppContext'

interface KurumEmblemProps {
    slug: string
    size?: number
    className?: string
}

export default function KurumEmblem({ slug, size = 80, className = '' }: KurumEmblemProps) {
    const { kurumlar } = useApp()
    const kurum = kurumlar.find(k => k.slug === slug)

    if (kurum && kurum.icon && (kurum.icon.startsWith('data:') || kurum.icon.startsWith('/') || kurum.icon.startsWith('http'))) {
        return (
            <img 
                src={kurum.icon} 
                alt={kurum.name} 
                width={size} 
                height={size} 
                className={className} 
                style={{ 
                    objectFit: 'contain', 
                    borderRadius: '50%', 
                    background: '#fff', 
                    border: `2px solid ${kurum.color || '#e2e8f0'}`, 
                    padding: '4px', 
                    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                    display: 'block' 
                }}
            />
        )
    }

    // Kurumların resmi metinleri
    const nameMap: Record<string, string> = {
        'hazine-maliye-bakanligi': 'T.C. HAZİNE VE MALİYE BAKANLIĞI',
        'adalet-bakanligi': 'T.C. ADALET BAKANLIĞI',
        'icisleri-bakanligi': 'T.C. İÇİŞLERİ BAKANLIĞI',
        'saglik-bakanligi': 'T.C. SAĞLIK BAKANLIĞI',
        'milli-egitim-bakanligi': 'T.C. MİLLÎ EĞİTİM BAKANLIĞI',
        'genel-gys': 'T.C. CUMHURBAŞKANLIĞI',
    }

    const text = nameMap[slug] || 'T.C. TÜRKİYE CUMHURİYETİ'

    // Her kuruma özel asil arka plan gradyan renkleri (T.C. Kırmızı tonları ile harmanlanmış kurumsal renkler)
    // Resmi logolarda merkez kısımlar kırmızı-bayrak rengidir. Dış halka da kırmızıdır.
    // Premium görünüm için hafif bir derinlik gradyanı veriyoruz.
    const bgGradients: Record<string, { start: string; end: string }> = {
        'hazine-maliye-bakanligi': { start: '#991b1b', end: '#7f1d1d' }, // Klasik T.C. Kırmızısı
        'adalet-bakanligi': { start: '#991b1b', end: '#7f1d1d' },
        'icisleri-bakanligi': { start: '#991b1b', end: '#7f1d1d' },
        'saglik-bakanligi': { start: '#991b1b', end: '#7f1d1d' },
        'milli-egitim-bakanligi': { start: '#991b1b', end: '#7f1d1d' },
        'genel-gys': { start: '#c2410c', end: '#7c2d12' }, // Cumhurbaşkanlığı için hafif altın-turuncu kırmızısı
    }

    const colors = bgGradients[slug] || { start: '#991b1b', end: '#7f1d1d' }
    const gradientId = `bg-grad-${slug}`
    const goldGradientId = `gold-grad-${slug}`
    const textPathId = `text-path-${slug}`

    // 16 Yıldız için rotasyon dereceleri
    const starRotations = Array.from({ length: 16 }, (_, i) => (i * 360) / 16)

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            style={{ display: 'block', overflow: 'visible' }}
        >
            <defs>
                {/* Merkez ve Dış Halka Kırmızı Radyal Gradyanı */}
                <radialGradient id={gradientId} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={colors.start} />
                    <stop offset="100%" stopColor={colors.end} />
                </radialGradient>

                {/* Ultra-Premium Yansımalı Altın/Bronz Metalik Gradyan */}
                <linearGradient id={goldGradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFECA6" />
                    <stop offset="25%" stopColor="#D4A333" />
                    <stop offset="50%" stopColor="#FFF9E0" />
                    <stop offset="75%" stopColor="#B3861B" />
                    <stop offset="100%" stopColor="#FFECA6" />
                </linearGradient>

                {/* Metnin kavisli yerleşeceği kusursuz dairesel yol */}
                {/* 20.5, 70.6 noktasından başlayıp 36 yarıçapıyla saat yönünde 79.5, 70.6 noktasına gider (üstten kavis) */}
                <path
                    id={textPathId}
                    d="M 19 68 A 35.5 35.5 0 1 1 81 68"
                    fill="none"
                />

                {/* Yumuşak derinlik gölgesi */}
                <filter id="premium-shadow" x="-10%" y="-10%" width="120%" height="120%">
                    <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#000000" floodOpacity="0.3" />
                </filter>
            </defs>

            {/* Dış Derinlik Gölgesi */}
            <circle cx="50" cy="50" r="47" fill="none" filter="url(#premium-shadow)" />

            {/* Dış Kırmızı Logo Bandı */}
            <circle cx="50" cy="50" r="47" fill={`url(#${gradientId})`} stroke={`url(#${goldGradientId})`} strokeWidth="1.5" />
            <circle cx="50" cy="50" r="44.5" stroke={`url(#${goldGradientId})`} strokeWidth="0.75" strokeOpacity="0.5" />

            {/* Dış Altın Sınır Çizgisi */}
            <circle cx="50" cy="50" r="30" stroke={`url(#${goldGradientId})`} strokeWidth="1" />

            {/* İç Kırmızı Daire (Ay-Yıldız Haznesi) */}
            <circle cx="50" cy="50" r="21" fill={`url(#${gradientId})`} stroke={`url(#${goldGradientId})`} strokeWidth="1.25" />

            {/* Dairesel 16 Türk Devleti Yıldızları */}
            {starRotations.map((angle, idx) => (
                <g key={idx} transform={`rotate(${angle} 50 50)`}>
                    {/* Üstte tam ortada (x=50, y=25.5) duracak 5 köşeli kusursuz altın yıldız */}
                    <polygon
                        points="50,23.8 51,25.6 53.1,25.6 51.4,26.8 52,28.8 50,27.6 48,28.8 48.6,26.8 46.9,25.6 49,25.6"
                        fill={`url(#${goldGradientId})`}
                    />
                </g>
            ))}

            {/* İç Kısımdaki Türk Bayrağı Ay-Yıldızı */}
            {slug === 'genel-gys' ? (
                // Cumhurbaşkanlığı için özel 16 Işınlı Altın Güneş
                <g transform="translate(50, 50)">
                    <circle cx="0" cy="0" r="6" fill={`url(#${goldGradientId})`} />
                    {Array.from({ length: 16 }, (_, i) => (
                        <path
                            key={i}
                            d="M 0 -5 L 1.2 -11 L 0 -8 L -1.2 -11 Z"
                            fill={`url(#${goldGradientId})`}
                            transform={`rotate(${(i * 360) / 16})`}
                        />
                    ))}
                </g>
            ) : (
                // T.C. Bakanlıkları için kusursuz Ay-Yıldız
                <g>
                    {/* Hilal */}
                    <path
                        d="M 45.2 41 A 9.5 9.5 0 1 0 45.2 59 A 7.8 7.8 0 1 1 45.2 41 Z"
                        fill={`url(#${goldGradientId})`}
                    />
                    {/* Yıldız */}
                    <polygon
                        points="56.2,46.2 57.3,49.5 60.8,49.5 58,51.3 58.9,54.8 56.2,52.8 53.5,54.8 54.4,51.3 51.6,49.5 55.1,49.5"
                        fill={`url(#${goldGradientId})`}
                    />
                </g>
            )}

            {/* Dairesel Kavisli Bakanlık Yazısı */}
            <text fontFamily="'Cinzel', 'Times New Roman', 'Georgia', serif" fontSize="4.8" fontWeight="bold" letterSpacing="0.05">
                <textPath
                    href={`#${textPathId}`}
                    startOffset="50%"
                    textAnchor="middle"
                    fill={`url(#${goldGradientId})`}
                >
                    {text}
                </textPath>
            </text>

            {/* Alt Kısımdaki Süsleme Yıldızları (Dengeleyici tasarım) */}
            <g transform="translate(50, 88)">
                {/* Sol küçük süs yıldızı */}
                <polygon
                    points="-12,-1 	-11.3,0.5 	-9.8,0.5 	-10.9,1.3 	-10.5,2.7 	-12,1.9 	-13.5,2.7 	-13.1,1.3 	-14.2,0.5 	-12.7,0.5"
                    fill={`url(#${goldGradientId})`}
                    opacity="0.8"
                />
                {/* Merkez büyük süs yıldızı */}
                <polygon
                    points="0,-2 	1,0 	3,0 	1.4,1.1 	2,3 	0,1.9 	-2,3 	-1.4,1.1 	-3,0 	-1,0"
                    fill={`url(#${goldGradientId})`}
                />
                {/* Sağ küçük süs yıldızı */}
                <polygon
                    points="12,-1 	12.7,0.5 	14.2,0.5 	13.1,1.3 	13.5,2.7 	12,1.9 	10.5,2.7 	10.9,1.3 	9.8,0.5 	11.3,0.5"
                    fill={`url(#${goldGradientId})`}
                    opacity="0.8"
                />
            </g>
        </svg>
    )
}
