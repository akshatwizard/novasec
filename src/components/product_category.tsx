'use client';

import Section from './ui/section'
import Wrapper from './ui/wrapper'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, PackageSearch } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HomeCategoryData, HomeCategoryResponse } from '@/types/home_category.types';


// Two-line descriptions for the category cards, matched on the category slug/title from the API.
const CATEGORY_DESCRIPTIONS: { match: RegExp; text: string }[] = [
    { match: /big/i, text: "Heavy-duty FIBC bulk bags for storing and moving large loads safely. Available with filling and discharge spouts, liners and lifting loops." },
    { match: /small/i, text: "Woven polypropylene sacks for smaller quantities of sand, grain, feed or debris. Strong, reusable and easy to carry, stack and store." },
    { match: /asbestos/i, text: "Clearly marked bags for the safe removal and transport of asbestos waste. Made for demolition and removal contractors." },
    { match: /garden|garbage/i, text: "Tough, reusable bags for green waste, leaves and building debris. Ideal for gardens, landscapers and waste collection." },
];

const descriptionFor = (category: HomeCategoryData) =>
    CATEGORY_DESCRIPTIONS.find((d) => d.match.test(category.slug) || d.match.test(category.title))?.text ??
    `Explore our full range of ${category.title.toLowerCase()} for industrial and professional use.`;

// Recycled Bags is not a catalog category, so its card is added here.
const RECYCLED_CARD = {
    title: "Recycled Bags",
    href: "/recycled-bags",
    image: "/images/recycled/recycled-bags-card.jpg",
    text: "Bags made with certified post-consumer and post-industrial recycled plastic. Lower carbon footprint, traceable according to EN 15343.",
};

/**
 * Opening section of the homepage: the four product categories (from the API) plus Recycled
 * Bags, as five fixed cards with a short description each. No slider.
 */
export default function ProductCategory() {

    const { data, isLoading, error } = useQuery<HomeCategoryData[]>({
        queryKey: ["home_category"],
        queryFn: async () => {
            const res = await axios.get<HomeCategoryResponse>(
                "https://www.gangapapers.in/novasac/api/home/category"
            );
            return res.data.data;
        },
    });

    return (
        <Section>
            <Wrapper className="lg:gap-8 md:gap-6 gap-5 lg:pt-10 md:pt-8 pt-6 lg:pb-12 md:pb-10 pb-8">

                <div className="flex flex-col gap-3">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                        <span className="size-1.5 rounded-full bg-primary-500" />
                        Our Product Categories
                    </span>
                    <h2 className="lg:text-5xl md:text-4xl text-3xl leading-tight font-light text-zinc-900">
                        Industrial bags built for <em className="text-primary-500">every load</em>
                    </h2>
                    <p className="max-w-2xl text-pretty text-zinc-600 md:text-lg text-base">
                        From heavy-duty big bags to certified recycled bags — choose a category to explore the full range.
                    </p>
                </div>

                {isLoading ? (
                    <div className={gridCls}>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <CategoryCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <EmptyState message="Failed to load categories. Please try again later." />
                ) : !data?.length ? (
                    <EmptyState message="No categories found." />
                ) : (
                    <div className={gridCls}>
                        {data.map((category, i) => (
                            <CategoryCard
                                key={category.id}
                                href={`/category/${category.slug}`}
                                title={category.title}
                                image={category.image}
                                text={descriptionFor(category)}
                                badge={`${category.products_count} items`}
                                priority={i < 2}
                            />
                        ))}
                        <CategoryCard
                            href={RECYCLED_CARD.href}
                            title={RECYCLED_CARD.title}
                            image={RECYCLED_CARD.image}
                            text={RECYCLED_CARD.text}
                            badge="EN 15343"
                        />
                    </div>
                )}

            </Wrapper>
        </Section>
    );
}

// Five across on desktop; on phones the fifth card spans the full row instead of sitting alone.
const gridCls =
    "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 [&>*:last-child:nth-child(odd)]:col-span-2 md:[&>*:last-child:nth-child(odd)]:col-span-1";

function CategoryCardSkeleton() {
    return (
        <div className="rounded-xl bg-white border border-zinc-100 overflow-hidden animate-pulse">
            <div className="aspect-[4/3] bg-zinc-200" />
            <div className="p-4 space-y-2">
                <div className="h-4 bg-zinc-200 rounded w-3/4" />
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-5/6" />
            </div>
        </div>
    );
}

type CategoryCardProps = {
    href: string
    title: string
    image: string
    text: string
    badge?: string
    priority?: boolean
}

function CategoryCard({ href, title, image, text, badge, priority }: CategoryCardProps) {
    return (
        <Link
            href={href}
            className="group relative flex flex-col rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
        >
            {/* Whole picture shown (no cropping), on a light background */}
            <div className="relative aspect-[4/3] overflow-hidden bg-zinc-50">
                <Image
                    src={image}
                    alt={title}
                    fill
                    priority={priority}
                    className="object-contain p-2 group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                />
            </div>

            <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
                <h3 className="text-lg md:text-xl font-semibold leading-snug text-zinc-800 group-hover:text-primary-500 transition-colors">
                    {title}
                </h3>
                <p className="text-sm md:text-[15px] leading-relaxed text-zinc-600">
                    {text}
                </p>
                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span className="inline-flex items-center gap-1 text-sm md:text-[15px] font-semibold text-primary-600">
                        View products
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {badge && (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs md:text-[13px] font-semibold text-zinc-600">
                            {badge}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-zinc-400">
            <PackageSearch size={40} strokeWidth={1.5} />
            <p className="text-sm">{message}</p>
        </div>
    );
}
