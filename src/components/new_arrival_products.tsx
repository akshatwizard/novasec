'use client';

import Section from './ui/section'
import Wrapper from './ui/wrapper'
import { useState } from 'react'
import HomeProductCard, { productImage } from './home_product_card'
import OrderRequestModal from './order_request_modal'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Clock, PackageSearch, ShoppingCart } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProductData, ProductResponse } from '@/types/home_product.types';


/** Popular products (shared with the featured card in the categories section; fetched once). */
export function usePopularProducts() {
    return useQuery<ProductData[]>({
        queryKey: ["new_arrival_products"],
        queryFn: async () => {
            const res = await axios.get<ProductResponse>(
                "https://www.gangapapers.in/novasac/api/home/new-arrivals"
            );
            return res.data.data;
        },
    });
}

type Props = {
    /** Show only the first N products and a link to the full list (used on the homepage). */
    limit?: number
}

export default function Products({ limit }: Props) {
    const [buyProduct, setBuyProduct] = useState<ProductData | null>(null)

    const { data, isLoading, error } = usePopularProducts();

    return (
        <Section>
            {/* On the homepage this is the opening section, right under the menu. */}
            <Wrapper className="lg:pt-8 md:pt-6 sm:pt-5 pt-4 lg:gap-8 md:gap-6 gap-5">
                <PopularBanner showCta={Boolean(limit)} />

                <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {isLoading ? (
                        Array.from({ length: limit ?? 8 }).map((_, i) => (
                            <ProductCardSkeleton key={i} />
                        ))
                    ) : error ? (
                        <EmptyState message="Failed to load products. Please try again later." />
                    ) : !data?.length ? (
                        <EmptyState message="No products found." />
                    ) : (
                        (limit ? data.slice(0, limit) : data).map((product) => (
                            <HomeProductCard product={product} onBuyNow={setBuyProduct} key={product.id} />
                        ))
                    )}
                </div>

                {limit && data && data.length > limit && (
                    <Link
                        href="/popular-products"
                        className="mx-auto -mt-4 inline-flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-500 hover:text-white"
                    >
                        View all popular products
                        <ChevronRight size={16} />
                    </Link>
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

/** Banner-style heading for the Popular Products section. */
function PopularBanner({ showCta }: { showCta: boolean }) {
    return (
        <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 px-6 py-8 text-white shadow-lg shadow-primary-500/20 sm:px-10 sm:py-10 lg:px-14 lg:py-12">
            {/* decorative rings */}
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border-[40px] border-white/10" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-40 size-56 rounded-full border-[28px] border-white/10 max-md:hidden" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex max-w-2xl flex-col gap-3">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                        <span className="size-1.5 rounded-full bg-white" />
                        Best sellers
                    </span>
                    <h2 className="lg:text-6xl md:text-5xl text-4xl font-light leading-tight">
                        Popular <em className="font-normal">Products</em>
                    </h2>
                    <p className="text-pretty text-white/90 md:text-lg text-base">
                        Our most popular bags, ready to order. Add them to your cart or buy now — we confirm price and delivery within 1 business day.
                    </p>
                    <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/95">
                        <li className="inline-flex items-center gap-1.5"><ShoppingCart size={16} /> No payment until confirmed</li>
                        <li className="inline-flex items-center gap-1.5"><Clock size={16} /> Reply within 1 business day</li>
                    </ul>
                </div>

                {showCta && (
                    <Link
                        href="/popular-products"
                        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow-md transition-transform hover:scale-105"
                    >
                        View all products
                        <ArrowRight size={16} />
                    </Link>
                )}
            </div>
        </div>
    );
}

function ProductCardSkeleton() {
    return (
        <div className="w-full rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
            <div className="h-48 bg-zinc-200" />
            <div className="p-3 space-y-2">
                <div className="h-3 w-1/2 bg-zinc-200 rounded-full" />
                <div className="h-4 w-3/4 bg-zinc-200 rounded" />
                <div className="h-5 w-1/3 bg-zinc-200 rounded" />
            </div>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="col-span-full flex flex-col items-center justify-center gap-3 py-16 text-zinc-400">
            <PackageSearch size={40} strokeWidth={1.5} />
            <p className="text-sm">{message}</p>
        </div>
    );
}

