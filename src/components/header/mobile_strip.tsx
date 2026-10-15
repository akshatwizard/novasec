'use client';

import { Heart, Home, ShoppingCart, User } from "lucide-react";
import Link from "next/link";
import { motion, useMotionValueEvent, useScroll } from 'motion/react'
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth_context";
import { Dispatch, SetStateAction, useState } from "react";
import { cartCount, openCart, useCart } from "@/lib/cart_store";

type Props = {
    openLoginModal: Dispatch<SetStateAction<boolean>>
}

export default function MobileStrip({ openLoginModal }: Props) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const cartUnits = cartCount(useCart().items);
    const { scrollY } = useScroll();
    const [scrollDirection, setScrollDirection] = useState("up")

    useMotionValueEvent(scrollY, "change", (current) => {
        const previous = scrollY.getPrevious() ?? 0;
        const diff = current - previous;

        if (Math.abs(diff) < 2) return;

        setScrollDirection(diff > 0 ? "down" : "up");
    });


    return (
        <motion.div
            initial={{ y: 0 }}
            animate={{
                y: scrollDirection === "down" ? 100 : 0
            }}
            transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
            }}
            className='md:hidden fixed inset-x-0 -bottom-1 h-16 w-full z-40'>
            <div className="w-full h-full bg-primary-600 grid grid-cols-4">
                <Link aria-label="Home" href={'/'} className="w-full h-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-300 ease-linear">
                    <Home fill="white" className="text-white" size={28} strokeWidth={1.8} />
                    <span className="sr-only">Home</span>
                </Link>
                <Link aria-label="Home" href={'/'} className="w-full h-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-300 ease-linear">
                    <Heart fill="white" className="text-white" size={28} strokeWidth={1.8} />
                    <span className="sr-only">Home</span>
                </Link>
                <button type="button" aria-label="Shopping Cart" onClick={openCart} className="relative w-full h-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-300 ease-linear cursor-pointer">
                    <span className="relative">
                        <ShoppingCart fill="white" className="text-white" size={28} strokeWidth={1.8} />
                        {cartUnits > 0 && (
                            <span aria-hidden="true" className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[11px] font-bold leading-none text-primary-600 shadow">
                                {cartUnits > 99 ? '99+' : cartUnits}
                            </span>
                        )}
                    </span>
                    <span className="sr-only">Shopping Cart{cartUnits > 0 ? `, ${cartUnits} ${cartUnits === 1 ? 'unit' : 'units'}` : ''}</span>
                </button>
                <button aria-label="Account/Profile" className="w-full h-full flex items-center justify-center hover:bg-primary-500 transition-colors duration-300 ease-linear cursor-pointer"
                    onClick={() => isAuthenticated ? router.push(`/profile/${user?.customer_id}`) : openLoginModal(true)}
                >
                    <User fill="white" className="text-white" size={28} strokeWidth={1.8} />
                    <span className="sr-only">Account/Profile</span>
                </button>
            </div>
        </motion.div>
    )
}
