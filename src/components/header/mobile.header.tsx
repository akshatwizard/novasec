"use client";
import { ChevronDown, X, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { MenuResponse } from "@/types/menu.types";
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import { MenuItems } from "@/constant/menu";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

const skeletonItems = Array.from({ length: 5 });

export default function MobileMenu({ isOpen, onClose }: Props) {
    const [active, setActive] = useState<number | null>(null);

    const { data, isFetching, isLoading } = useQuery<MenuResponse>({
        queryKey: ["menu"],
        queryFn: async () => {
            const res = await axios.get<MenuResponse>("https://www.gangapapers.in/novasac/api/menu");
            return res.data;
        },
    });

    const loading = isFetching || isLoading;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={onClose}
                        className="max-[1150px]:block hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ x: "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "-100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 32 }}
                        className="hidden fixed inset-y-0 left-0 z-50 max-[1150px]:flex w-[88%] max-w-90 flex-col bg-white shadow-2xl"
                        data-lenis-prevent
                    >
                        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                            <div className="flex items-center gap-2.5">
                                <span className="size-2 rounded-full bg-primary-500" />
                                <span className="text-sm font-semibold tracking-wide text-zinc-800 uppercase">
                                    Browse
                                </span>
                            </div>
                            <button
                                onClick={onClose}
                                aria-label="Close menu"
                                className="flex size-9 items-center justify-center rounded-xl bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 hover:text-zinc-800"
                            >
                                <X size={16} strokeWidth={2.5} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto overscroll-contain py-3" data-lenis-prevent>
                            {loading &&
                                skeletonItems.map((_, i) => (
                                    <div key={i} className="px-5 py-3">
                                        <div
                                            className="h-4 animate-pulse rounded-md bg-zinc-100"
                                            style={{ width: `${55 + i * 8}%` }}
                                        />
                                    </div>
                                ))}

                            {!loading && data &&
                                data.data.map((item, idx) => {
                                    const isActive = active === idx;

                                    return (
                                        <div key={item.title} className="border-b border-zinc-50">

                                            <button
                                                onClick={() => setActive((prev) => (prev === idx ? null : idx))}
                                                className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 ${isActive
                                                    ? "bg-primary-50 text-primary-600"
                                                    : "text-zinc-700 hover:bg-zinc-50"
                                                    }`}
                                            >
                                                {item.category_image && (
                                                    <div className="relative size-8 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                                        <Image
                                                            src={item.category_image}
                                                            alt={item.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                )}

                                                <span className="flex-1 text-sm font-semibold tracking-wide">
                                                    {item.title}
                                                </span>

                                                <ChevronDown
                                                    size={15}
                                                    strokeWidth={2.5}
                                                    className={`shrink-0 transition-transform duration-300 ${isActive ? "rotate-180 text-primary-500" : "text-zinc-400"
                                                        }`}
                                                />
                                            </button>

                                            <AnimatePresence initial={false}>
                                                {isActive && (
                                                    <motion.div
                                                        key="content"
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
                                                        className="overflow-hidden bg-zinc-50/70"
                                                    >
                                                        {item.attributes.map((attr, aIdx) => (
                                                            <div key={aIdx} className="px-5 py-3">
                                                                {/* Attribute group label */}
                                                                <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                                                                    {attr.title}
                                                                </p>

                                                                {/* Sub-values */}
                                                                <div className="flex flex-col gap-0.5">
                                                                    {attr.values.map((sub, j) => (
                                                                        <Link
                                                                            key={j}
                                                                            href={`/category/${item.category_slug}/${sub.slug}/${attr.slug}`}
                                                                            onClick={onClose}
                                                                            className="group/link flex items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-600 transition-all duration-200 hover:bg-white hover:text-primary-600 hover:shadow-sm"
                                                                        >
                                                                            <span>{sub.name}</span>
                                                                            <ArrowRight
                                                                                size={12}
                                                                                className="-translate-x-1 opacity-0 transition-all duration-200 group-hover/link:translate-x-0 group-hover/link:opacity-100 text-primary-500"
                                                                            />
                                                                        </Link>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })
                            }

                            {
                                MenuItems.map((menu, idx) => (
                                    <div className="border-b border-zinc-50" key={menu.name}>
                                        <Link
                                            href={menu.path}
                                            className={`flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-200 text-zinc-700 hover:bg-zinc-50`}
                                            onClick={onClose}
                                        >
                                            {menu.icon && (
                                                <div className="relative size-8 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                                                    <Image
                                                        src={menu.icon}
                                                        alt={menu.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                            )}
                                            <span className="flex-1 text-sm font-semibold tracking-wide">
                                                {menu.name}
                                            </span>
                                        </Link>
                                    </div>
                                ))
                            }
                        </div>

                        {/* Footer */}
                        <div className="border-t border-zinc-100 px-5 py-4">
                            <p className="text-center text-[11px] text-zinc-400 tracking-wide">
                                Novasac — Quality Packaging Solutions
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}