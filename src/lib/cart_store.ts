import { useSyncExternalStore } from 'react'

/**
 * Tiny client-side cart.
 *
 * There is no checkout or payment on the site yet: the cart is an *order request* list. Items
 * live in this browser (localStorage) and are sent to the Novasac team through the order request
 * form, who then confirm price, delivery and payment with the customer.
 *
 * It is an external store read with useSyncExternalStore, so the header badge, the product
 * section and the cart drawer all stay in sync without needing a provider in the layout.
 */

export interface CartItem {
    /** One line per product + size combination. */
    id: string
    productId: string
    title: string
    size: string
    qty: number
    image: string
}

interface CartState {
    items: CartItem[]
    open: boolean
}

export const MAX_QTY = 999

// Bumped to v2 so carts saved before the single-size change (old size options) are dropped.
const STORAGE_KEY = 'novasac_cart_v2'

// What the server (and the first client render) sees, so hydration always matches.
const SERVER_STATE: CartState = { items: [], open: false }

let state: CartState = SERVER_STATE
let loaded = false
let storageBound = false
const listeners = new Set<() => void>()

const clampQty = (qty: number) => Math.min(MAX_QTY, Math.max(1, Math.floor(qty) || 1))

function isCartItem(value: unknown): value is CartItem {
    if (typeof value !== 'object' || value === null) return false
    const v = value as Record<string, unknown>
    return (
        typeof v.id === 'string' &&
        typeof v.productId === 'string' &&
        typeof v.title === 'string' &&
        typeof v.size === 'string' &&
        typeof v.image === 'string' &&
        typeof v.qty === 'number'
    )
}

// localStorage can be missing or throw (private windows, blocked site data), so the cart must
// keep working in memory when it does.
function readStorage(): CartItem[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY)
        if (!raw) return []
        const parsed: unknown = JSON.parse(raw)
        return Array.isArray(parsed)
            ? parsed.filter(isCartItem).map((item) => ({ ...item, qty: clampQty(item.qty) }))
            : []
    } catch {
        return []
    }
}

function writeStorage(items: CartItem[]) {
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    } catch {
        /* keep the in-memory cart */
    }
}

function update(next: CartState, persist: boolean) {
    state = next
    if (persist) writeStorage(next.items)
    listeners.forEach((listener) => listener())
}

function getSnapshot(): CartState {
    if (typeof window === 'undefined') return SERVER_STATE
    if (!loaded) {
        loaded = true
        state = { ...state, items: readStorage() }
    }
    return state
}

function getServerSnapshot(): CartState {
    return SERVER_STATE
}

function subscribe(listener: () => void) {
    listeners.add(listener)

    // Keep several open tabs in step.
    if (!storageBound && typeof window !== 'undefined') {
        storageBound = true
        window.addEventListener('storage', (event) => {
            if (event.key !== STORAGE_KEY) return
            update({ ...state, items: readStorage() }, false)
        })
    }

    return () => {
        listeners.delete(listener)
    }
}

export function useCart(): CartState {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}

export function cartCount(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.qty, 0)
}

export function addToCart(item: Omit<CartItem, 'id' | 'qty'>, qty: number, openDrawer = true) {
    const current = getSnapshot()
    const id = `${item.productId}::${item.size}`
    const amount = clampQty(qty)
    const exists = current.items.some((line) => line.id === id)

    const items = exists
        ? current.items.map((line) => (line.id === id ? { ...line, qty: clampQty(line.qty + amount) } : line))
        : [...current.items, { ...item, id, qty: amount }]

    update({ items, open: openDrawer ? true : current.open }, true)
}

export function setItemQty(id: string, qty: number) {
    const current = getSnapshot()
    update({ ...current, items: current.items.map((line) => (line.id === id ? { ...line, qty: clampQty(qty) } : line)) }, true)
}

export function removeItem(id: string) {
    const current = getSnapshot()
    update({ ...current, items: current.items.filter((line) => line.id !== id) }, true)
}

export function clearCart() {
    update({ ...getSnapshot(), items: [] }, true)
}

export function openCart() {
    update({ ...getSnapshot(), open: true }, false)
}

export function closeCart() {
    update({ ...getSnapshot(), open: false }, false)
}
