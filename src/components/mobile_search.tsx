'use client'
import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { Package, Search, TrendingUp, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useDebounce } from '@/hooks/useDebounce'
import { useSearchSuggestions } from '@/hooks/search'
import MobileSearchDropdown from './search_dropdown'

interface MobileSearchProps {
    open: boolean
    onClose: () => void
}


export default function MobileSearch({ open, onClose }: MobileSearchProps) {
    const router = useRouter()
    const inputRef = useRef<HTMLInputElement>(null)
    const [query, setQuery] = useState('')
    const [isFocused, setIsFocused] = useState(false)

    const debouncedQuery = useDebounce({ value: query, delay: 400 })
    const { data, isFetching } = useSearchSuggestions(debouncedQuery)

    const showDropdown = isFocused && query.trim().length >= 1
    const suggestions = data?.suggestions ?? []

    // Auto-focus input when opened
    useEffect(() => {
        if (open) {
            setTimeout(() => inputRef.current?.focus(), 120)
        } else {
            setQuery('')
            setIsFocused(false)
        }
    }, [open])

    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [open])

    const handleSelect = (title: string) => {
        setQuery(title)
        setIsFocused(false)
        onClose()
        router.push(`/search?q=${encodeURIComponent(title)}`)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && query.trim()) handleSelect(query.trim())
        if (e.key === 'Escape') onClose()
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 md:hidden"
                        onClick={onClose}
                    />

                    {/* Panel — slides down from top */}
                    <motion.section
                        key="panel"
                        initial={{ opacity: 0, y: -24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                        className="fixed top-0 left-0 right-0 z-50 md:hidden bg-white border-b border-slate-200 px-4 pt-5 pb-4 shadow-xl shadow-slate-200/40"
                    >
                        {/* Top row: label + close */}
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400 font-semibold">
                                Search
                            </p>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-100 active:bg-stone-200 transition-colors"
                                aria-label="Close search"
                            >
                                <X className="w-4 h-4 text-zinc-600" strokeWidth={2} />
                            </button>
                        </div>

                        {/* Search input row */}
                        <div className="flex items-center gap-2 h-11">
                            <div
                                className={`flex-1 flex items-center h-full border rounded-lg px-3 gap-2 transition-colors duration-200
                            ${isFocused ? 'border-zinc-400' : 'border-slate-200 bg-stone-50'}`}
                            >
                                <Search className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={1.5} />
                                <input
                                    ref={inputRef}
                                    type="search"
                                    inputMode="search"
                                    enterKeyHint="search"
                                    autoComplete="off"
                                    placeholder="Search products, big bags, PP sacks…"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onFocus={() => setIsFocused(true)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 bg-transparent outline-none border-none text-sm text-zinc-700
                             placeholder:text-slate-400 h-full min-w-0"
                                />
                                {/* Clear button */}
                                <AnimatePresence>
                                    {query.length > 0 && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.7 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.7 }}
                                            transition={{ duration: 0.12 }}
                                            onClick={() => { setQuery(''); inputRef.current?.focus() }}
                                            className="shrink-0 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center"
                                            aria-label="Clear"
                                        >
                                            <X className="w-3 h-3 text-slate-500" strokeWidth={2.5} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Search submit button */}
                            <button
                                onClick={() => query.trim() && handleSelect(query.trim())}
                                className="shrink-0 h-11 px-4 bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                           rounded-lg text-white transition-colors duration-200 flex items-center justify-center"
                                aria-label="Submit search"
                            >
                                <Search className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                        </div>

                        {/* Dropdown results */}
                        <AnimatePresence>
                            {showDropdown && (
                                <MobileSearchDropdown
                                    suggestions={suggestions}
                                    query={debouncedQuery}
                                    onSelect={handleSelect}
                                    isLoading={isFetching}
                                />
                            )}
                        </AnimatePresence>

                        {/* Idle state — trending / quick links */}
                        <AnimatePresence>
                            {!showDropdown && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="mt-4"
                                >
                                    <p className="text-[10px] uppercase tracking-[0.18em] text-slate-400 font-semibold mb-2 px-1">
                                        Popular
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {['Big Bags', 'Small Bags', 'Big Bag with Liner'].map((term) => (
                                            <button
                                                key={term}
                                                onClick={() => handleSelect(term)}
                                                className="text-xs px-3 py-1.5 rounded-full border border-slate-200
                                   text-stone-500 hover:border-amber-300 hover:text-amber-700
                                   hover:bg-amber-50 active:bg-amber-100 transition-colors"
                                            >
                                                {term}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.section>
                </>
            )}
        </AnimatePresence>
    )
}