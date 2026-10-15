'use client'

import { useEffect, useRef, useState } from 'react'
import { ShoppingCart, MailCheck, X, Minus, Plus, Package, Loader2 } from 'lucide-react'
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface ProductInfo {
    id: number;
    title: string
    category: string
    sku?: string | null
    attributes?: { label: string; value: string }[]
}

interface ProductModalsProps {
    product: ProductInfo
}

export default function ProductModals({ product }: ProductModalsProps) {
    const [modal, setModal] = useState<'buy' | 'enquire' | null>(null)

    const openModal = (type: 'buy' | 'enquire') => setModal(type)
    const closeModal = () => setModal(null)

    return (
        <>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                    onClick={() => openModal('buy')}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-stone-900 text-stone-50 text-sm font-medium hover:bg-stone-800 active:scale-[0.98] transition-all"
                >
                    <ShoppingCart size={18} />
                    Buy Now
                </button>
                <button
                    onClick={() => openModal('enquire')}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-stone-200 text-stone-700 text-sm font-medium hover:border-stone-400 active:scale-[0.98] transition-all"
                >
                    <MailCheck size={18} />
                    Enquire Now
                </button>
            </div>

            {modal === 'buy' && (
                <BuyNowModal product={product} onClose={closeModal} />
            )}
            {modal === 'enquire' && (
                <EnquireModal product={product} onClose={closeModal} />
            )}
        </>
    )
}


//Shared: Overlay wrapper
export function ModalOverlay({ onClose, children }: { onClose: () => void, children: React.ReactNode }) {

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        document.addEventListener('keydown', handler)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', handler)
            document.body.style.overflow = ''
        }
    }, [onClose])

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(28,22,14,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            {children}
        </div>
    )
}

//Shared: Product strip (shown at top of modal)
function ProductStrip({ product }: { product: ProductInfo }) {

    const meta = [
        product.category,
        ...(product.attributes?.map(a => a.value) ?? []),
        product.sku ? `SKU: ${product.sku}` : null,
    ].filter(Boolean).join(' · ')

    return (
        <div className="mx-7 mt-5 flex items-center gap-3 rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-stone-200">
                <Package size={22} className="text-stone-400" />
            </div>
            <div className="min-w-0">
                <p className="truncate text-[13px] font-medium text-stone-800 font-serif">
                    {product.title}
                </p>
                <p className="mt-0.5 text-[11px] text-stone-400 tracking-wide">
                    {meta}
                </p>
            </div>
        </div>
    )
}

// Shared: Field label + input wrapper
export function Field({ label, required, children }: { label: string, required?: boolean, children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400">
                {label}{required && <span className="ml-0.5 text-amber-600">*</span>}
            </label>
            {children}
        </div>
    )
}

export const inputCls =
    'w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-800 placeholder-stone-300 outline-none transition focus:border-amber-400 focus:bg-white focus:ring-2 focus:ring-amber-100'


// Shared: Section divider
export function SectionDivider({ label }: { label: string }) {
    return (
        <div className="flex items-center gap-3">
            <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-300">
                {label}
            </span>
            <div className="h-px flex-1 bg-stone-100" />
        </div>
    )
}

// Shared: Success screen
export function SuccessScreen({ icon, title, subtitle, accentClass, onClose }: {
    icon: React.ReactNode, title: string, subtitle: string, accentClass: string, onClose: () => void
}) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-12 text-center">
            <div className={`flex h-16 w-16 items-center justify-center rounded-full ${accentClass}`}>
                {icon}
            </div>
            <h3 className="font-serif text-xl text-stone-900">{title}</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">{subtitle}</p>
            <button
                onClick={onClose}
                className="mt-2 rounded-xl bg-stone-900 px-8 py-3 text-sm font-medium text-stone-50 hover:bg-stone-800 active:scale-[0.98] transition-all"
            >
                Done
            </button>
        </div>
    )
}

export function ErrorBanner({ message }: { message: string }) {
    return (
        <div className="mx-0 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span className="mt-0.5 shrink-0">⚠</span>
            <span>{message}</span>
        </div>
    )
}
//Error display Function
export function getApiError(err: unknown): string {
    if (err instanceof AxiosError) {
        return (
            err.response?.data?.message ??
            err.response?.data?.error ??
            err.message ??
            'Something went wrong.'
        )
    }
    if (err instanceof Error) return err.message
    return 'Something went wrong.'
}

// Buy Now Modal
export function BuyNowModal({ product, onClose }: { product: ProductInfo; onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false)
    const [qty, setQty] = useState(1)
    const [form, setForm] = useState({ name: '', email: '', contact: '', note: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(f => ({ ...f, [key]: e.target.value }))
        if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        if (!form.name.trim()) errs.name = 'Required'
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
        if (!form.contact.trim()) errs.contact = 'Required'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const { mutate, isPending, isError, error, reset } = useMutation({
        mutationFn: async () => {
            return (
                await axios.post("https://www.gangapapers.in/novasac/api/product/buy-now", { product_id: product.id, qty: qty, ...form })
            )
        },
        onSuccess(val) {
            toast.success(val.data?.message ?? 'Order request sent!')
            setSubmitted(true)
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
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
                data-lenis-prevent
            >
                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-7">
                    <div>
                        <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                            Place Order
                        </span>
                        <h2 className="mt-2.5 font-serif text-2xl text-stone-900">Complete Your Purchase</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 disabled:pointer-events-none disabled:opacity-40"
                    >
                        <X size={16} />
                    </button>
                </div>

                {submitted ? (
                    <SuccessScreen
                        icon={<ShoppingCart size={28} className="text-amber-700" />}
                        title="Order Request Sent!"
                        subtitle="Our team will contact you within 24 hours to confirm your order and arrange payment."
                        accentClass="bg-amber-50"
                        onClose={onClose}
                    />
                ) : (
                    <div className="max-h-[72vh] overflow-y-auto">
                        <ProductStrip product={product} />

                        <div className="flex flex-col gap-4 px-7 py-6">

                            {isError && <ErrorBanner message={getApiError(error)} />}

                            <SectionDivider label="Your details" />

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Full Name" required>
                                    <input
                                        className={inputCls + (errors.name ? ' border-red-300! ring-red-100!!' : '')}
                                        placeholder="Rahul Sharma"
                                        value={form.name}
                                        onChange={set('name')}
                                        disabled={isPending}
                                    />
                                    {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
                                </Field>
                                <Field label="Contact Number" required>
                                    <input
                                        className={inputCls + (errors.contact ? ' border-red-300! ring-red-100!' : '')}
                                        placeholder="+91 98765 43210"
                                        type="tel"
                                        value={form.contact}
                                        onChange={set('contact')}
                                        disabled={isPending}
                                    />
                                    {errors.contact && <span className="text-[11px] text-red-500">{errors.contact}</span>}
                                </Field>
                            </div>

                            <Field label="Email Address" required>
                                <input
                                    className={inputCls + (errors.email ? ' border-red-300! ring-red-100!' : '')}
                                    placeholder="rahul@example.com"
                                    type="email"
                                    value={form.email}
                                    onChange={set('email')}
                                    disabled={isPending}
                                />
                                {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
                            </Field>

                            <SectionDivider label="Order details" />

                            <Field label="Quantity">
                                <div className="flex items-center">
                                    <button
                                        onClick={() => setQty(q => Math.max(1, q - 1))}
                                        disabled={isPending || qty <= 1}
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-l-xl border border-r-0 border-stone-200 bg-stone-50 text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Minus size={14} />
                                    </button>
                                    <div className="flex h-10 w-16 select-none items-center justify-center border-y border-stone-200 bg-stone-50 text-sm font-medium text-stone-800">
                                        {qty}
                                    </div>
                                    <button
                                        onClick={() => setQty(q => Math.min(999, q + 1))}
                                        disabled={isPending || qty >= 999}
                                        type="button"
                                        className="flex h-10 w-10 items-center justify-center rounded-r-xl border border-l-0 border-stone-200 bg-stone-50 text-stone-600 transition-colors hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        <Plus size={14} />
                                    </button>
                                </div>
                            </Field>

                            <Field label="Additional Note (optional)">
                                <textarea
                                    className={inputCls + ' resize-none'}
                                    rows={3}
                                    placeholder="Customisation, engraving text, delivery requirements…"
                                    value={form.note}
                                    onChange={set('note')}
                                    disabled={isPending}
                                />
                            </Field>

                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-3.5 text-sm font-medium text-stone-50 transition-all hover:bg-stone-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart size={16} />
                                        Send Order Request
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] leading-relaxed text-stone-300">
                                🔒 Your details are safe with us. We'll confirm within 24 hours.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ModalOverlay>
    )
}

// Enquire Now Modal
export function EnquireModal({ product, onClose }: { product: ProductInfo; onClose: () => void }) {
    const [submitted, setSubmitted] = useState(false)
    const [form, setForm] = useState({ name: '', email: '', contact: '', org: '', message: '' })
    const [errors, setErrors] = useState<Record<string, string>>({})

    const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm(f => ({ ...f, [key]: e.target.value }))
        if (errors[key]) setErrors(prev => { const n = { ...prev }; delete n[key]; return n })
    }

    const validate = () => {
        const errs: Record<string, string> = {}
        if (!form.name.trim()) errs.name = 'Required'
        if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email'
        if (!form.contact.trim()) errs.contact = 'Required'
        if (!form.message.trim()) errs.message = 'Please describe your requirements'
        setErrors(errs)
        return Object.keys(errs).length === 0
    }

    const { mutate, isPending, isError, error, reset } = useMutation({
        mutationFn: async () => {
            return (
                await axios.post("https://www.gangapapers.in/novasac/api/product/enquiry", { product_id: product.id, ...form })
            )
        },
        onSuccess(val) {
            toast.success(val.data?.message ?? 'Enquiry sent successfully!')
            setForm({ name: '', email: '', contact: '', org: '', message: '' })
            setSubmitted(true)
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
                className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300"
                data-lenis-prevent
            >
                {/* Header */}
                <div className="flex items-start justify-between px-7 pt-7">
                    <div>
                        <span className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                            Enquire
                        </span>
                        <h2 className="mt-2.5 font-serif text-2xl text-stone-900">Send an Enquiry</h2>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isPending}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700 disabled:pointer-events-none disabled:opacity-40"
                    >
                        <X size={16} />
                    </button>
                </div>

                {submitted ? (
                    <SuccessScreen
                        icon={<MailCheck size={28} className="text-emerald-600" />}
                        title="Enquiry Received!"
                        subtitle="Thanks for reaching out. Our team will review your requirements and respond within 1 business day."
                        accentClass="bg-emerald-50"
                        onClose={onClose}
                    />
                ) : (
                    <div className="max-h-[72vh] overflow-y-auto">
                        <ProductStrip product={product} />

                        <div className="flex flex-col gap-4 px-7 py-6">

                            {/* API-level error banner */}
                            {isError && <ErrorBanner message={getApiError(error)} />}

                            <SectionDivider label="Your details" />

                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Full Name" required>
                                    <input
                                        className={inputCls + (errors.name ? ' border-red-300! ring-red-100!' : '')}
                                        placeholder="Priya Mehta"
                                        value={form.name}
                                        onChange={set('name')}
                                        disabled={isPending}
                                    />
                                    {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
                                </Field>
                                <Field label="Contact Number" required>
                                    <input
                                        className={inputCls + (errors.contact ? ' border-red-300! ring-red-100!' : '')}
                                        placeholder="+91 98765 43210"
                                        type="tel"
                                        value={form.contact}
                                        onChange={set('contact')}
                                        disabled={isPending}
                                    />
                                    {errors.contact && <span className="text-[11px] text-red-500">{errors.contact}</span>}
                                </Field>
                            </div>

                            <Field label="Email Address" required>
                                <input
                                    className={inputCls + (errors.email ? ' border-red-300! ring-red-100!' : '')}
                                    placeholder="priya@company.com"
                                    type="email"
                                    value={form.email}
                                    onChange={set('email')}
                                    disabled={isPending}
                                />
                                {errors.email && <span className="text-[11px] text-red-500">{errors.email}</span>}
                            </Field>

                            <Field label="Organisation Name">
                                <input
                                    className={inputCls}
                                    placeholder="Acme Corp Pvt. Ltd."
                                    value={form.org}
                                    onChange={set('org')}
                                    disabled={isPending}
                                />
                            </Field>

                            <SectionDivider label="Your requirements" />

                            <Field label="Message / Requirements" required>
                                <textarea
                                    className={inputCls + ' resize-none' + (errors.message ? ' border-red-300! ring-red-100!' : '')}
                                    rows={4}
                                    placeholder="Describe your requirements — bulk quantity, customisation, branding, delivery timeline, budget range…"
                                    value={form.message}
                                    onChange={set('message')}
                                    disabled={isPending}
                                />
                                {errors.message && <span className="text-[11px] text-red-500">{errors.message}</span>}
                            </Field>

                            <button
                                onClick={handleSubmit}
                                disabled={isPending}
                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 py-3.5 text-sm font-medium text-white transition-all hover:bg-emerald-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin" />
                                        Sending…
                                    </>
                                ) : (
                                    <>
                                        <MailCheck size={16} />
                                        Send Enquiry
                                    </>
                                )}
                            </button>

                            <p className="text-center text-[11px] leading-relaxed text-stone-300">
                                🔒 We respect your privacy. Expect a response within 1 business day.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </ModalOverlay>
    )
}