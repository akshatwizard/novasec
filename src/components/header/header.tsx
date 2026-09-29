'use client';
import Image from 'next/image'
import Link from 'next/link'
import SearchBar from './search'
import { BadgeCheck, Building2, ChevronRight, LogOut, Phone, Recycle, Search, ShoppingBag, ShoppingCart, TextAlignJustify, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/auth_context';
import LoginModal from '../login_modal';
import { useRouter } from 'next/navigation';
import MobileMenu from './mobile.header';
import MobileStrip from './mobile_strip';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchSuggestions } from '@/hooks/search';
import MobileSearch from '../mobile_search';
import { AnimatePresence, Variants, motion } from 'motion/react';


const containerVariants: Variants = {
    hide: {
        opacity: 0,
        y: 30,
        scale: 0.98,
        pointerEvents: "none",
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        pointerEvents: "auto",
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 25,
            mass: 0.8,
            bounce: 0.4,
            staggerChildren: 0.2,
            delayChildren: 0.1,
        },
    },
};
const itemVariants: Variants = {
    hide: {
        opacity: 0,
        y: -10,
    },
    show: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
        },
    },
};

export default function Header() {
    const [openLoginModal, setOpenLoginModal] = useState<boolean>(false);
    const [steps, setSteps] = useState<"login" | "otp">("login");
    const { isAuthenticated, user, logout } = useAuth()
    const router = useRouter()
    const [openMenu, setOpenMenu] = useState<boolean>(false);
    const [query, setQuery] = useState<string>("")
    const [isFocused, setIsFocused] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const [openMobileSearch, setOpenMobileSearch] = useState<boolean>(false)
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const debouncedQuery = useDebounce({ value: query, delay: 400 })
    const { data, isFetching } = useSearchSuggestions(debouncedQuery)

    const showDropdown = isFocused && query.trim().length >= 1
    const suggestions = data?.suggestions ?? []

    const handleSelect = (title: string) => {
        setQuery(title)
        setIsFocused(false)
        router.push(`/search?q=${encodeURIComponent(title)}`)
    }

    const handleSearchSubmit = () => {
        if (query.trim()) handleSelect(query.trim())
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') handleSearchSubmit()
        if (e.key === 'Escape') setIsFocused(false)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            )
                setShowOptions(false);
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    return (
        <>
            <header className='w-full bg-primary-500 lg:px-12 md:px-10 px-4'>
                <nav className="relative w-full py-1.5 lg:px-1.5 mx-auto max-w-7xl flex items-center justify-between gap-5">
                    <Link className="relative shrink-0" href="/">
                        <Image
                            src={"/images/logo/logo-w.svg"}
                            width={150}
                            height={64}
                            alt="Novasac"
                            className={`lg:w-28 md:w-24 sm:w-20 w-16 h-auto`}
                            loading="eager"
                            fetchPriority='high'
                            aria-label='Logo'
                        />
                    </Link>

                    <SearchBar
                        ref={searchRef}
                        query={query}
                        setQuery={setQuery}
                        isFocused={isFocused}
                        onFocus={() => setIsFocused(true)}
                        onKeyDown={handleKeyDown}
                        onSubmit={handleSearchSubmit}
                        showDropdown={showDropdown}
                        suggestions={suggestions}
                        debouncedQuery={debouncedQuery}
                        onSelect={handleSelect}
                        isLoading={isFetching}
                    />

                    <div className="relative flex items-center gap-2" ref={dropdownRef}>
                        <Image
                            src={"/images/wap.png"}
                            alt='Contact us'
                            width={20}
                            height={20}
                            className='size-7 cursor-pointer'
                        />

                        <button name='Shopping cart' className="relative hidden md:flex items-center justify-center w-10 h-10 rounded-sm transition-colors duration-300 ease-in-out hover:bg-primary-400 cursor-pointer">
                            <ShoppingCart className="text-white" size={28} strokeWidth={1} fill='white' />
                            <span className='sr-only'>Shopping cart</span>
                        </button>

                        <button name='Options' className="hidden md:flex items-center justify-center w-10 h-10 rounded-sm transition-colors duration-300 ease-in-out hover:bg-primary-400 cursor-pointer"
                            onClick={() => setShowOptions(!showOptions)}
                        >
                            <TextAlignJustify className="text-white" size={28} strokeWidth={1} fill='white' />
                            <span className='sr-only'>Options</span>
                        </button>

                        <button name='Serch Now' className="relative md:hidden flex items-center justify-center w-10 h-10 rounded-sm transition-colors duration-300 ease-in-out hover:bg-zinc-800/10 cursor-pointer"
                            onClick={() => setOpenMobileSearch(true)}
                        >
                            <Search className="text-white" size={24} strokeWidth={1.5} />
                            <span className='sr-only'>Search Now</span>
                        </button>

                        <button name='Open Menu' className="hidden max-[1150px]:flex items-center justify-center w-10 h-10 rounded-sm transition-colors duration-300 ease-in-out hover:bg-zinc-800/10 cursor-pointer"
                            onClick={() => setOpenMenu(true)}
                        >
                            <TextAlignJustify className="text-white" size={24} strokeWidth={1.5} />
                            <span className='sr-only'>Open Menu</span>
                        </button>

                        <AnimatePresence>
                            {showOptions && (
                                <motion.div
                                    className="absolute z-50 mt-4 top-full right-0 p-4 min-w-60 max-w-64 bg-stone-50 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200 space-y-5"
                                    variants={containerVariants}
                                    initial="hide"
                                    animate="show"
                                    exit="hide"
                                >
                                    <div className="flex flex-col gap-1">
                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => (
                                                isAuthenticated && user
                                                    ? router.push(
                                                        `/profile/${user?.name.toLocaleLowerCase().split(" ").join("-")}`
                                                    )
                                                    : setOpenLoginModal(true),
                                                setShowOptions(false)
                                            )}
                                            className="cursor-pointer group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <User size={16} />
                                            <span>{isAuthenticated && user ? user.name : "Login"}</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </motion.button>

                                        <motion.button
                                            variants={itemVariants}
                                            className="cursor-pointer group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <ShoppingBag size={16} />
                                            <span>Orders</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </motion.button>

                                        <motion.button
                                            variants={itemVariants}
                                            className="cursor-pointer group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <ShoppingCart size={16} />
                                            <span>Cart</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </motion.button>

                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => (router.push("/about"), setShowOptions(false))}
                                            className="cursor-pointer group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <Building2 size={16} />
                                            <span>About Us</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </motion.button>

                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => (router.push("/contact"), setShowOptions(false))}
                                            className="cursor-pointer group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <Phone size={16} />
                                            <span>Contact Us</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </motion.button>

                                        <motion.button
                                            variants={itemVariants}
                                            onClick={() => (router.push("#"), setShowOptions(false))}
                                            className="cursor-pointer group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors duration-150"
                                        >
                                            <BadgeCheck size={16} />
                                            <span>Certifications</span>
                                            <ChevronRight
                                                size={14}
                                                className="ml-auto text-gray-400 group-hover:translate-x-0.5 transition-transform"
                                            />
                                        </motion.button>

                                        {
                                            isAuthenticated && user && (
                                                <motion.button
                                                    variants={itemVariants}
                                                    onClick={() => (logout(), setShowOptions(false))}
                                                    className="cursor-pointer group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                >
                                                    <span>Logout</span>
                                                    <LogOut
                                                        size={14}
                                                        className="text-red-500 group-hover:scale-110 transition-transform"
                                                    />
                                                </motion.button>
                                            )
                                        }
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </nav>
            </header>

            <LoginModal
                isOpen={openLoginModal}
                onClose={() => setOpenLoginModal(false)}
                currentStep={steps}
                changeStep={setSteps}
            />
            <MobileMenu
                isOpen={openMenu}
                onClose={() => setOpenMenu(false)}
            />
            <MobileStrip
                openLoginModal={setOpenLoginModal}
            />
            <MobileSearch
                open={openMobileSearch}
                onClose={() => setOpenMobileSearch(false)}
            />
        </>
    )
}
