'use client'

import { Minus, Plus } from 'lucide-react'
import { MAX_QTY, MIN_QTY, QTY_STEPS, nextQty, prevQty, qtyIndex } from '@/lib/quantity'

interface QuantitySliderProps {
    value: number
    onChange: (value: number) => void
    disabled?: boolean
    /** Smaller version for product cards. */
    compact?: boolean
    className?: string
}

const LOCALE = 'en-GB'
const LABEL = 'Quantity'
const fmt = (n: number) => n.toLocaleString(LOCALE)

/** Width of the draggable dot in px (keep in sync with .qty-range in globals.css). */
const THUMB = 18

/**
 * Quantity slider: drag the dot right to increase, left to decrease. It moves through the
 * allowed quantities (1, 10–100, 150–1,000, 1,500–10,000), each step equally spaced so small
 * quantities are as easy to pick as large ones. The number floats above the dot; − and + step once.
 */
export default function QuantitySlider({ value, onChange, disabled, compact, className = '' }: QuantitySliderProps) {
    const last = QTY_STEPS.length - 1
    const index = Math.max(0, qtyIndex(value))
    const pct = (index / last) * 100
    // Keeps the bubble centred over the dot (the dot travels THUMB px less than the full width).
    const bubbleLeft = `calc(${pct}% + ${(0.5 - pct / 100) * THUMB}px)`

    const btn = `${compact ? 'size-6' : 'size-8'} flex shrink-0 items-center justify-center rounded-md border border-primary-300 bg-white text-primary-700 transition-colors hover:bg-primary-50 disabled:cursor-not-allowed disabled:opacity-40`

    return (
        <div className={`w-full select-none ${className}`}>
            <div className={`flex items-center ${compact ? 'gap-1.5' : 'gap-2.5'}`}>
                <button
                    type="button"
                    onClick={() => onChange(prevQty(value))}
                    disabled={disabled || value <= MIN_QTY}
                    aria-label="Decrease quantity"
                    className={btn}
                >
                    <Minus size={compact ? 12 : 14} />
                </button>

                <div className={`relative flex-1 ${compact ? 'pt-6' : 'pt-8'}`}>
                    <span
                        aria-hidden="true"
                        className={`pointer-events-none absolute top-0 -translate-x-1/2 whitespace-nowrap rounded-md bg-primary-500 font-bold text-white shadow-sm ${compact ? 'px-1.5 py-0.5 text-[11px]' : 'px-2.5 py-1 text-sm'}`}
                        style={{ left: bubbleLeft }}
                    >
                        {fmt(value)}
                        <span className="absolute left-1/2 top-full -translate-x-1/2 border-x-4 border-t-4 border-x-transparent border-t-primary-500" />
                    </span>
                    <input
                        type="range"
                        min={0}
                        max={last}
                        step={1}
                        value={index}
                        disabled={disabled}
                        onChange={(e) => onChange(QTY_STEPS[Number(e.target.value)] ?? MIN_QTY)}
                        aria-label={LABEL}
                        aria-valuetext={fmt(value)}
                        className="qty-range block w-full"
                        style={{ ['--qty-pct' as string]: `${pct}%` }}
                    />
                </div>

                <button
                    type="button"
                    onClick={() => onChange(nextQty(value))}
                    disabled={disabled || value >= MAX_QTY}
                    aria-label="Increase quantity"
                    className={btn}
                >
                    <Plus size={compact ? 12 : 14} />
                </button>
            </div>
            <div className={`mt-0.5 flex justify-between text-zinc-400 ${compact ? 'px-8 text-[10px]' : 'px-11 text-[11px]'}`} aria-hidden="true">
                <span>{fmt(MIN_QTY)}</span>
                <span>{fmt(MAX_QTY)}</span>
            </div>
        </div>
    )
}
