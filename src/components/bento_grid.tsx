'use client';

import Link from 'next/link';
import Section from './ui/section'
import Wrapper from './ui/wrapper'
import Image from "next/image";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { MenuResponse } from '@/types/menu.types';

type GridItems = {
    title: string;
    description?: string;
    image: string;
    large?: boolean;
    cta: string;
    url: string;
    tag?: string;
}

export default function BentoGrid() {
    // Reuses the same "menu" query the header already fetches — React Query
    // de-dupes this against that request, so it's not an extra network call.
    const { data } = useQuery<MenuResponse>({
        queryKey: ["menu"],
        queryFn: async function () {
            const res = await axios.get<MenuResponse>("https://www.gangapapers.in/novasac/api/menu");
            return res.data
        },
    })

    // Resolve the live category slug for "Big Bags" instead of a hardcoded guess.
    // Falls back to the previous known-good path if the menu hasn't loaded yet or the
    // category can't be matched, so the link is never broken.
    const bulkBagsCategory = data?.data.find(
        (item) => item.title.trim().toLowerCase().startsWith("big bag")
    );
    const bulkBagsUrl = bulkBagsCategory
        ? `/category/${bulkBagsCategory.category_slug}`
        : "/category/big-bags";

    const items: GridItems[] = [
        {
            title: "Big Bag Outlet",
            description: "High-quality branded packaging solutions for businesses of every scale.",
            image: "/images/bento/big_bag.png",
            cta: "Shop Now",
            url: bulkBagsUrl,
        },
        {
            title: "Custom-made Bulk Bags",
            description: "Tailor-made bulk bags built to your exact specifications.",
            image: "/images/custom-bag/bag.jpg",
            cta: "Contact Us",
            url: "/custom-made-bags",
        },
    ];

    return (
        <Section>
            <Wrapper>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item) => (
                        <div
                            key={item.title}
                            className={`group relative overflow-hidden bg-neutral-900 rounded-3xl ${item.large ? "md:col-span-2 h-90" : "h-110"
                                }`}
                        >
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                sizes={item.large
                                    ? "(max-width: 768px) 100vw, 100vw"
                                    : "(max-width: 768px) 100vw, 50vw"
                                }
                                className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                            />

                            <div className="absolute inset-0 bg-black/20 transition-all duration-500 group-hover:bg-black/60" />

                            <div
                                className="absolute inset-0 z-20 flex items-center justify-center opacity-100  transition-all duration-500 pointer-events-none"
                            >
                                <Link
                                    href={item.url}
                                    className="pointer-events-auto translate-y-4 md:translate-y-8 md:group-hover:translate-y-0 transition-all duration-500 rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white shadow-xl hover:scale-105"
                                >
                                    {item.cta}
                                </Link>
                            </div>

                            {/* Tag */}
                            {item.tag && (
                                <span className="absolute top-5 left-5 z-10 rounded-full bg-primary-500 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                                    {item.tag}
                                </span>
                            )}

                            {/* Bottom Content */}
                            <div
                                className="absolute bottom-0 left-0 right-0 z-10 p-6 transition-all duration-500 md:group-hover:translate-y-4"
                            >
                                <h3
                                    className={`font-bold leading-tight text-white ${item.large ? "text-2xl md:text-4xl" : "text-xl md:text-2xl"
                                        }`}
                                >
                                    {item.title}
                                </h3>

                                {item.description && (
                                    <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
                                        {item.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </Wrapper>
        </Section>
    );
}