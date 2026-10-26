'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader2, ShoppingCart, X } from 'lucide-react'
import {
    ErrorBanner,
    Field,
    ModalOverlay,
    SectionDivider,
    SuccessScreen,
    getApiError,
    inputCls,
} from './product_modal'

export interface OrderLine {
    title: string
    size: string
    qty: number
    image: string
    sku?: string
}

interface OrderRequestModalProps {
    items: OrderLine[]
    onClose: () => void
    /** Called once the request has been accepted by the server. */
    onSent?: () => void
}

/**
 * Order request used by both "Buy Now" and the cart. There is no online payment yet, so it
 * goes through the same contact endpoint as the other forms: the Novasac team receives the list of
 * items and confirms price, delivery and payment with the customer.
 */
export default function OrderRequestModal({ items, onClose, onSent }: OrderRequestModalProps) {
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ name: '', phone: '', email: '', company: '', note: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((f) => ({ ...f, [key]: e.target.value }))
        if (errors[key]) setErrors((prev) => { const next = { ...prev }; delete next[key]; return next })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        if (!form.name.trim()) errs.name = 'Required field'
        if (!form.phone.trim()) errs.phone = 'Required field'
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email address'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const totalUnits = items.reduce((total, item) => total + item.qty, 0)

    const { mutate, isPending, isError, error, reset } = useMutation({
        mutationFn: async () => {
            const lines = [
                'Order request (online store, novasac.eu).',
                '',
                'Items:',
                ...items.map((item) => [`- ${item.qty} × ${item.title}`, item.size && `Size: ${item.size}`, item.sku && `SKU: ${item.sku}`].filter(Boolean).join(' — ')),
            ]
            if (form.company.trim()) lines.push('', `Company: ${form.company.trim()}`)
            if (form.note.trim()) lines.push('', 'Customer note:', form.note.trim())

            return axios.post('https://www.gangapapers.in/novasac/api/contact-submit', {
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                subject: 'Recycled Bags Order',
                message: lines.join('\n'),
            })
        },
        onSuccess() {
            toast.success('Order request sent!')
            setSubmitted(true)
            onSent?.()
        },
        onError(err) {
            toast.error(getApiError(err))
        },
    })

    const handleSubmit = () => {
        if (!validate()) return
        reset()
        mutate()
    }

    return (
        <ModalOverlay onClose={onClose}>
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-request-title"
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
                data-lenis-prevent
            >
                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-7">
                    <div>
                        <span className="inline-block rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-700">
                            Place order
                        </span>
                        <h2 id="order-request-title" className="mt-2.5 font-serif text-2xl text-stone-900">
                            Complete your order
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isPending}
                        aria-label="Close"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 disabled:pointer-events-none disabled:opacity-40"
                    >
                        <X size={16} />
                    </button>
                </div>

                {submitted ? (
                    <SuccessScreen
                        icon={<ShoppingCart size={28} className="text-primary-600" />}
                        title="Order request sent!"
                        subtitle="Our team will contact you within 1 business day to confirm your order, the price and payment."
                        accentClass="bg-primary-50"
                        onClose={onClose}
                    />
                ) : (
                    <form
                        noValidate
                        onSubmit={(e) => { e.preventDefault(); handleSubmit() }}
                        className="max-h-[72vh] overflow-y-auto"
                    >
                        {/* What is being ordered */}
                        <ul className="mx-7 mt-5 divide-y divide-primary-100 rounded-xl border border-primary-100 bg-primary-50/60">
                            {items.map((item, index) => (
                                <li key={`${item.title}-${item.size}-${index}`} className="flex items-center gap-3 px-4 py-3">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white">
                                        <Image
                                            src={item.image}
                                            alt=""
                                            fill
                                            sizes="48px"
                                            className="object-contain"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-serif text-[13px] font-medium text-stone-800">{item.title}</p>
                                        {(item.size || item.sku) && (
                                            <p className="mt-0.5 text-[11px] tracking-wide text-stone-500">
                                                {[item.size && `Size: ${item.size}`, item.sku && `SKU: ${item.sku}`].filter(Boolean).join(' · ')}
                                            </p>
                                        )}
                                    </div>
                                    <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-stone-700">
                                        × {item.qty}
                                    </span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-col gap-4 px-7 py-6">
                            {isError && <ErrorBanner message={getApiError(error)} />}

                            <SectionDivider label="Your details" />

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <Field label="Full name" required>
                                    <input
                                        className={inputCls + (errors.name ? ' border-red-300! ring-red-100!' : '')}
                                        placeholder="Jane Smith"
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={set('name')}
                                        disabled={isPending}
                                    />
                                    {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
                                </Field>
                                <Field label="Contact phone" required>
                                    <input
                                        className={inputCls + (errors.phone ? ' border-red-300! ring-red-100!' : '')}
                                        placeholder="+34 600 123 456"
                                        type="tel"
                                        autoComplete="tel"
                                        value={form.phone}
                                        onChange={set('phone')}
                                        disabled={isPending}
                                    />
                                    {errors.phone && <span className="text-[11px] text-red-500">{errors.phone}</span>}
                                </Field>
                            </div>

                            <Field label="Email address" required>
                                <input
                                    className={inputCls + (errors.email ? ' border-red-300! ring-red-100!' : '')}
                                    placeholder="jane@example.com"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={set('email')}
                                    disabled={isPending}
                                />
                                {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
                            </Field>

                            <Field label="Company name (optional)">
                                <input
                                    className={inputCls}
                                    placeholder="Example Company Ltd."
                                    autoComplete="organization"
                                    value={form.company}
                                    onChange={set('company')}
                                    disabled={isPending}
                                />
                            </Field>

                            <Field label="Additional note (optional)">
                                <textarea
                                    className={inputCls + ' resize-none'}
                                    rows={3}
                                    placeholder="Delivery address, the lead time you need, customisation with your logo…"
                                    value={form.note}
                                    onChange={set('note')}
                                    disabled={isPending}
                                />
                            </Field>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 py-3.5 text-sm font-medium text-white transition-all hover:bg-primary-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
                                        Send order request ({totalUnits} {totalUnits === 1 ? 'unit' : 'units'})
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] leading-relaxed text-stone-400">
                                🔒 Nothing is charged yet: our team will confirm the price, delivery time and payment within 1 business day.
                            </p>
                        </div>
                    </form>
                )}
            </div>
        </ModalOverlay>
    )
}
