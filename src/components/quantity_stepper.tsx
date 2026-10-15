'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'

interface QuantityStepperProps {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    disabled?: boolean
    /** Accessible name for the number field, e.g. "Quantity". */
    label?: string
    compact?: boolean
}

/** − [ 3 ] + control. The number can also be typed; it is clamped to min–max when the field loses focus. */
export default function QuantityStepper({
    value,
    onChange,
    min = 1,
    max = 999,
    disabled,
    label = 'Quantity',
    compact,
}: QuantityStepperProps) {
    // While typing, the field may be empty or partial; the real value only changes on valid input.
    const [draft, setDraft] = useState<string | null>(null)

    const clamp = (n: number) => Math.min(max, Math.max(min, n))
    const size = compact ? 'h-8 w-8' : 'h-11 w-11'
    const field = compact ? 'h-8 w-11 text-sm' : 'h-11 w-16 text-base'

    const step = (delta: number) => {
        setDraft(null)
        onChange(clamp(value + delta))
    }

    return (
        <div className="inline-flex items-center" role="group" aria-label={label}>
            <button
                type="button"
                onClick={() => step(-1)}
                disabled={disabled || value <= min}
                aria-label="Decrease quantity"
                className={`${size} flex items-center justify-center rounded-l-xl border border-r-0 border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Minus size={compact ? 13 : 15} />
            </button>
            <input
                type="text"
                inputMode="numeric"
                autoComplete="off"
                aria-label={label}
                disabled={disabled}
                value={draft ?? String(value)}
                onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 3)
                    setDraft(digits)
                    if (digits !== '') onChange(clamp(parseInt(digits, 10)))
                }}
                onBlur={() => setDraft(null)}
                onFocus={(e) => e.target.select()}
                className={`${field} border-y border-zinc-200 bg-white text-center font-semibold text-zinc-900 outline-none focus:bg-primary-50`}
            />
            <button
                type="button"
                onClick={() => step(1)}
                disabled={disabled || value >= max}
                aria-label="Increase quantity"
                className={`${size} flex items-center justify-center rounded-r-xl border border-l-0 border-zinc-200 bg-zinc-50 text-zinc-600 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-40`}
            >
                <Plus size={compact ? 13 : 15} />
            </button>
        </div>
    )
}
