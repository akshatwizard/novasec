'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ShoppingBag, ShoppingCart, Trash2, X } from 'lucide-react'
import { cartCount, clearCart, closeCart, removeItem, setItemQty, useCart, type CartItem } from '@/lib/cart_store'
import QuantityStepper from './quantity_stepper'
import OrderRequestModal from './order_request_modal'

/** Slide-over cart. Mounted once in the root layout; opened from the header and from "Add to Cart". */
export default function CartDrawer() {
    const { items, open } = useCart()
    // The items being ordered are captured when the order form opens, so the form keeps showing
    // them even after the cart is emptied by a successful request.
    const [orderItems, setOrderItems] = useState<CartItem[] | null>(null)
    const [sent, setSent] = useState(false)
    const closeRef = useRef<HTMLButtonElement>(null)

    const ordering = orderItems !== null

    useEffect(() => {
        if (!open || ordering) return
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
        document.addEventListener('keydown', onKey)
        closeRef.current?.focus()
        return () => document.removeEventListener('keydown', onKey)
    }, [open, ordering])

    const closeOrder = () => {
        setOrderItems(null)
        if (sent) {
            setSent(false)
            closeCart()
        }
    }

    if (!open && !ordering) return null

    const count = cartCount(items)

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-[45]">
                    <div
                        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] animate-in fade-in duration-200"
                        onClick={closeCart}
                        aria-hidden="true"
                    />
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="cart-title"
                        className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <ShoppingBag size={20} className="text-primary-600" />
                                <h2 id="cart-title" className="text-lg font-semibold text-zinc-900">Your cart</h2>
                                {count > 0 && (
                                    <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-semibold text-primary-700">
                                        {count} {count === 1 ? 'unit' : 'units'}
                                    </span>
                                )}
                            </div>
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={closeCart}
                                aria-label="Close cart"
                                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
                                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
                                    <ShoppingCart size={28} className="text-primary-500" />
                                </span>
                                <p className="text-base font-semibold text-zinc-900">Your cart is empty</p>
                                <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
                                    Add products to request your order. Our team will confirm it with you.
                                </p>
                                <button
                                    type="button"
                                    onClick={closeCart}
                                    className="mt-2 rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                                >
                                    Continue shopping
                                </button>
                            </div>
                        ) : (
                            <>
                                <ul className="flex-1 divide-y divide-zinc-100 overflow-y-auto px-5" data-lenis-prevent>
                                    {items.map((item) => (
                                        <li key={item.id} className="flex gap-4 py-5">
                                            <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-zinc-100 bg-zinc-50">
                                                <Image
                                                    src={item.image}
                                                    alt={item.title}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover object-[85%_center]"
                                                />
                                            </div>
                                            <div className="flex min-w-0 flex-1 flex-col gap-2">
                                                <div>
                                                    <p className="text-sm font-semibold leading-snug text-zinc-900">{item.title}</p>
                                                    <p className="mt-0.5 text-xs text-zinc-500">Size: {item.size}</p>
                                                </div>
                                                <div className="mt-auto flex items-center justify-between gap-3">
                                                    <QuantityStepper
                                                        compact
                                                        value={item.qty}
                                                        onChange={(qty) => setItemQty(item.id, qty)}
                                                        label={`Quantity of ${item.title}, size ${item.size}`}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(item.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 transition-colors hover:text-red-600"
                                                    >
                                                        <Trash2 size={14} />
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Footer */}
                                <div className="border-t border-zinc-100 bg-zinc-50/70 px-5 py-5">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-zinc-600">Total units</span>
                                        <span className="font-semibold text-zinc-900">{count}</span>
                                    </div>
                                    <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                                        Nothing is charged yet. Our team will confirm the price, delivery time and payment with you before the order is processed.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setOrderItems(items)}
                                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/25 transition-all hover:bg-primary-700 active:scale-[0.98]"
                                    >
                                        <ShoppingCart size={17} />
                                        Request order
                                    </button>
                                    <div className="mt-3 flex items-center justify-between text-xs">
                                        <button type="button" onClick={closeCart} className="font-medium text-zinc-600 hover:text-primary-600">
                                            Continue shopping
                                        </button>
                                        <button type="button" onClick={clearCart} className="font-medium text-zinc-500 hover:text-red-600">
                                            Empty cart
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </aside>
                </div>
            )}

            {ordering && (
                <OrderRequestModal
                    items={orderItems}
                    onClose={closeOrder}
                    onSent={() => { setSent(true); clearCart() }}
                />
            )}
        </>
    )
}
