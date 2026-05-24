'use client'

import dynamic from 'next/dynamic'

// Lazy load heavy client drawer & modal with ssr: false inside a Client Component
const CartSidebar = dynamic(() => import('./CartSidebar'), { ssr: false })
const SearchModal = dynamic(() => import('./SearchModal'), { ssr: false })

export default function ClientOverlays() {
    return (
        <>
            <CartSidebar />
            <SearchModal />
        </>
    )
}
