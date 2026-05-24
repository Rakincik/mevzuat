import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
    id: string
    name: string
    slug: string
    price: number
    salePrice?: number | null
    image?: string | null
    quantity: number
    packageType?: string
    categoryName?: string
}

interface CartState {
    items: CartItem[]
    isOpen: boolean
    lastAddedItem: CartItem | null

    // Actions
    addItem: (item: Omit<CartItem, 'quantity'>) => void
    removeItem: (id: string) => void
    updateQuantity: (id: string, quantity: number) => void
    clearCart: () => void
    toggleCart: () => void
    setLastAddedItem: (item: CartItem | null) => void

    // Computed
    getTotalItems: () => number
    getTotalPrice: () => number
    getFreeShippingProgress: () => number
}

const FREE_SHIPPING_THRESHOLD = 500

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            lastAddedItem: null,

            addItem: (item) => {
                set((state) => {
                    const existingItem = state.items.find((i) => i.id === item.id)

                    if (existingItem) {
                        return {
                            items: state.items.map((i) =>
                                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                            ),
                            lastAddedItem: { ...existingItem, quantity: existingItem.quantity + 1 },
                            isOpen: true // Auto-open cart
                        }
                    }

                    const newItem = { ...item, quantity: 1 }
                    return {
                        items: [...state.items, newItem],
                        lastAddedItem: newItem,
                        isOpen: true // Auto-open cart
                    }
                })

                // Clear lastAddedItem after animation
                setTimeout(() => set({ lastAddedItem: null }), 2000)
            },

            removeItem: (id) =>
                set((state) => ({
                    items: state.items.filter((i) => i.id !== id),
                })),

            updateQuantity: (id, quantity) =>
                set((state) => ({
                    items: quantity <= 0
                        ? state.items.filter((i) => i.id !== id)
                        : state.items.map((i) =>
                            i.id === id ? { ...i, quantity } : i
                        ),
                })),

            clearCart: () => set({ items: [], lastAddedItem: null }),

            toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

            setLastAddedItem: (item) => set({ lastAddedItem: item }),

            getTotalItems: () => {
                const state = get()
                return state.items.reduce((sum, item) => sum + item.quantity, 0)
            },

            getTotalPrice: () => {
                const state = get()
                return state.items.reduce(
                    (sum, item) => sum + (item.salePrice || item.price) * item.quantity,
                    0
                )
            },

            getFreeShippingProgress: () => {
                const total = get().getTotalPrice()
                return Math.min((total / FREE_SHIPPING_THRESHOLD) * 100, 100)
            },
        }),
        {
            name: 'cart-storage',
        }
    )
)
