'use client';

import Section from './ui/section'
import Wrapper from './ui/wrapper'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronRight, PackageSearch, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { HomeCategoryData, HomeCategoryResponse } from '@/types/home_category.types';
import { ProductData } from '@/types/home_product.types';
import HomeProductCard, { productImage } from './home_product_card'
import OrderRequestModal from './order_request_modal'
import { usePopularProducts } from './new_arrival_products'


// Two-line descriptions for the category cards, matched on the category slug/title from the API.
const CATEGORY_DESCRIPTIONS: { match: RegExp; text: string }[] = [
    { match: /big/i, text: "Heavy-duty FIBC bulk bags for storing and moving large loads safely." },
    { match: /small/i, text: "Strong woven PP sacks for sand, grain, feed or debris." },
    { match: /asbestos/i, text: "Clearly marked bags for the safe removal of asbestos waste." },
    { match: /garden|garbage/i, text: "Tough, reusable bags for green waste, leaves and debris." },
];

const descriptionFor = (category: HomeCategoryData) =>
    CATEGORY_DESCRIPTIONS.find((d) => d.match.test(category.slug) || d.match.test(category.title))?.text ??
    `Our full range of ${category.title.toLowerCase()} for professional use.`;

// Recycled Bags is not a catalog category, so its card is added here.
const RECYCLED_CARD = {
    title: "Recycled Bags",
    href: "/recycled-bags",
    image: "/images/recycled/recycled-bags-card.jpg",
    text: "Made with certified recycled plastic, traceable according to EN 15343.",
};

/**
 * Opening section of the homepage: the four product categories (from the API) plus Recycled
 * Bags, as fixed cards with a short description each, plus a sixth card showing a random
 * product from Popular Products. Two rows of three on desktop. No slider.
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

    // Sixth block: one popular product, picked at random per visit. The products are fetched in
    // the browser, so this never affects the server render or hydration.
    const { data: popular } = usePopularProducts();
    const [seed] = useState(() => Math.random());
    const featured = popular?.length ? popular[Math.floor(seed * popular.length)] : null;
    const [buyProduct, setBuyProduct] = useState<ProductData | null>(null);

    return (
        <Section>
            <Wrapper className="lg:gap-7 md:gap-6 gap-5 lg:pt-8 md:pt-6 pt-5 lg:pb-12 md:pb-10 pb-8">

                <div className="flex flex-col gap-3">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                        <span className="size-1.5 rounded-full bg-primary-500" />
                        Our Product Categories
                    </span>
                    <h2 className="lg:text-[44px] md:text-4xl text-3xl leading-tight font-light text-zinc-900">
                        Industrial bags built for <em className="text-primary-500">every load</em>
                    </h2>
                    <p className="max-w-2xl text-pretty text-zinc-600 md:text-lg text-base">
                        From heavy-duty big bags to certified recycled bags — choose a category to explore the full range.
                    </p>
                </div>

                {isLoading ? (
                    <div className={gridCls}>
                        {Array.from({ length: 6 }).map((_, i) => (
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
                        {featured && (
                            <div className="relative flex flex-col [&>*:last-child]:flex-1">
                                <span className="absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-full bg-primary-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white shadow-sm">
                                    <Sparkles size={11} />
                                    Featured
                                </span>
                                <HomeProductCard product={featured} onBuyNow={setBuyProduct} horizontal />
                            </div>
                        )}
                    </div>
                )}

            </Wrapper>

            {buyProduct && (
                <OrderRequestModal
                    items={[{ title: buyProduct.title, size: '', qty: 1, image: productImage(buyProduct), sku: buyProduct.sku ?? undefined }]}
                    onClose={() => setBuyProduct(null)}
                />
            )}
        </Section>
    );
}

// Compact horizontal cards: two rows of three on desktop, two columns on tablet, one column on
// phones (image beside the text keeps every card short).
const gridCls = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4";

function CategoryCardSkeleton() {
    return (
        <div className="flex rounded-xl bg-white border border-zinc-100 overflow-hidden animate-pulse">
            <div className="w-32 sm:w-40 aspect-square bg-zinc-200 shrink-0" />
            <div className="flex-1 p-4 space-y-2">
                <div className="h-4 bg-zinc-200 rounded w-2/3" />
                <div className="h-3 bg-zinc-100 rounded w-full" />
                <div className="h-3 bg-zinc-100 rounded w-4/5" />
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
            className="group relative flex rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary-300 transition-all duration-300"
        >
            {/* Square image beside the text */}
            <div className="relative w-32 sm:w-40 aspect-square shrink-0 overflow-hidden bg-white">
                <Image
                    src={image}
                    alt={title}
                    fill
                    priority={priority}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="160px"
                />
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-4">
                <h3 className="text-lg font-semibold leading-snug text-zinc-800 group-hover:text-primary-500 transition-colors">
                    {title}
                </h3>
                <p className="text-sm leading-relaxed text-zinc-600 line-clamp-3">
                    {text}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-semibold text-primary-600">
                        View products
                        <ChevronRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                    </span>
                    {badge && (
                        <span className="shrink-0 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-600">
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
