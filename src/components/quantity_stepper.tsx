'use client'

import { useState } from 'react'
import { Minus, Plus } from 'lucide-react'
import { MAX_QTY, MIN_QTY, nextQty, prevQty, snapQty } from '@/lib/quantity'

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

/**
 * − [ 10 ] + control. The buttons move through the allowed quantities (1, 10–100 by 10, 150–500 by 50).
 * A typed number is moved to the nearest allowed quantity when the field loses focus (or on Enter).
 */
export default function QuantityStepper({
    value,
    onChange,
    min = MIN_QTY,
    max = MAX_QTY,
    disabled,
    label = 'Quantity',
    compact,
}: QuantityStepperProps) {
    // While typing, the field may be empty or partial; the real value only changes on valid input.
    const [draft, setDraft] = useState<string | null>(null)

    const clamp = (n: number) => snapQty(Math.min(max, Math.max(min, n)))
    const size = compact ? 'h-8 w-8' : 'h-11 w-11'
    const field = compact ? 'h-8 w-11 text-sm' : 'h-11 w-16 text-base'

    const step = (direction: 1 | -1) => {
        setDraft(null)
        onChange(clamp(direction > 0 ? nextQty(value) : prevQty(value)))
    }

    const commitDraft = () => {
        if (draft !== null && draft !== '') onChange(clamp(parseInt(draft, 10)))
        setDraft(null)
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
                }}
                onBlur={commitDraft}
                onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur() }}
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
