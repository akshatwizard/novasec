'use client';

import Section from './ui/section'
import Wrapper from './ui/wrapper'
import { useState } from 'react'
import HomeProductCard, { productImage } from './home_product_card'
import OrderRequestModal from './order_request_modal'
import SliderWrapper from './ui/slider_wrapper'
import Link from 'next/link'
import { ArrowRight, Clock, PackageSearch, ShoppingCart } from 'lucide-react'
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

    const products = (data && limit ? data.slice(0, limit) : data) ?? []

    const grid = isLoading ? (
        Array.from({ length: limit ?? 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
    ) : error ? (
        <EmptyState message="Failed to load products. Please try again later." />
    ) : !products.length ? (
        <EmptyState message="No products found." />
    ) : (
        products.map((product) => (
            <HomeProductCard product={product} onBuyNow={setBuyProduct} compact={Boolean(limit)} key={product.id} />
        ))
    )

    return (
        <Section>
            {limit ? (
                /* Homepage: compact strip — banner panel beside one row of products */
                <Wrapper className="lg:pt-8 md:pt-6 sm:pt-5 pt-4 lg:pb-8 md:pb-6 pb-5">
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[290px_minmax(0,1fr)] lg:gap-4">
                        <PopularBanner compact />
                        {products.length > 0 ? (
                            /* 8 products, auto-scrolling (loops; pauses while hovered; arrows to browse) */
                            <div className="min-w-0">
                                <SliderWrapper
                                    autoPlay
                                    autoPlayOptions={{ delay: 2500, stopOnMouseEnter: true, stopOnInteraction: false }}
                                    options={{ loop: true, align: 'start' }}
                                    className="-ml-3"
                                    viewportClassName="py-1 -my-1"
                                    slideClassName="flex basis-1/2 pl-3 md:basis-1/4 [&>*]:flex-1 [&>*]:min-w-0"
                                    btnLeft="left-1 rounded-full bg-white text-zinc-800 shadow-md hover:bg-primary-500 hover:text-white disabled:bg-white/60"
                                    btnRight="right-1 rounded-full bg-white text-zinc-800 shadow-md hover:bg-primary-500 hover:text-white disabled:bg-white/60"
                                >
                                    {products.map((product) => (
                                        <HomeProductCard key={product.id} product={product} onBuyNow={setBuyProduct} compact />
                                    ))}
                                </SliderWrapper>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {grid}
                            </div>
                        )}
                    </div>
                </Wrapper>
            ) : (
                /* Full list page */
                <Wrapper className="lg:pt-8 md:pt-6 sm:pt-5 pt-4 lg:gap-8 md:gap-6 gap-5">
                    <PopularBanner />
                    <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {grid}
                    </div>
                </Wrapper>
            )}

            {buyProduct && (
                <OrderRequestModal
                    items={[{ title: buyProduct.title, size: '', qty: 1, image: productImage(buyProduct), sku: buyProduct.sku ?? undefined }]}
                    onClose={() => setBuyProduct(null)}
                />
            )}
        </Section>
    );
}

/**
 * Banner-style heading for Popular Products. `compact` is the homepage panel that sits beside the
 * products (a short strip on phones); otherwise the wide banner of the full list page.
 */
function PopularBanner({ compact }: { compact?: boolean }) {
    if (compact) {
        return (
            <div className="relative flex overflow-hidden rounded-2xl bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 px-5 py-5 text-white shadow-lg shadow-primary-500/20 lg:flex-col lg:justify-between lg:px-7 lg:py-7">
                <span aria-hidden="true" className="pointer-events-none absolute -right-14 -top-16 size-48 rounded-full border-[28px] border-white/10" />
                <span aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-10 size-44 rounded-full border-[24px] border-white/10 max-lg:hidden" />

                <div className="relative flex flex-1 items-center justify-between gap-4 lg:flex-col lg:items-start lg:justify-between">
                    <div className="flex flex-col gap-1.5 lg:gap-3">
                        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-white/15 px-3 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em]">
                            <span className="size-1.5 rounded-full bg-white" />
                            Best sellers
                        </span>
                        <h2 className="lg:text-5xl text-3xl font-light leading-[1.05]">
                            Popular <em className="font-normal">Products</em>
                        </h2>
                        <p className="hidden text-sm leading-relaxed text-white/90 lg:block">
                            Ready to order — we confirm price and delivery within 1 business day. No payment until confirmed.
                        </p>
                    </div>
                    <Link
                        href="/popular-products"
                        className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-semibold text-primary-700 shadow-md transition-transform hover:scale-105 lg:px-5 lg:py-2.5"
                    >
                        View all
                        <ArrowRight size={15} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full overflow-hidden rounded-3xl bg-linear-to-br from-primary-600 via-primary-500 to-primary-400 px-6 py-7 text-white shadow-lg shadow-primary-500/20 sm:px-10 sm:py-8 lg:px-12 lg:py-9">
            <span aria-hidden="true" className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full border-[40px] border-white/10" />
            <span aria-hidden="true" className="pointer-events-none absolute -bottom-28 right-40 size-56 rounded-full border-[28px] border-white/10 max-md:hidden" />
            <div className="relative flex max-w-2xl flex-col gap-2.5">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
                    <span className="size-1.5 rounded-full bg-white" />
                    Best sellers
                </span>
                <h1 className="lg:text-5xl md:text-4xl text-3xl font-light leading-tight">
                    Popular <em className="font-normal">Products</em>
                </h1>
                <p className="text-pretty text-white/90 md:text-lg text-base">
                    Our most popular bags, ready to order. Add them to your cart or buy now — we confirm price and delivery within 1 business day.
                </p>
                <ul className="mt-1 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-white/95">
                    <li className="inline-flex items-center gap-1.5"><ShoppingCart size={16} /> No payment until confirmed</li>
                    <li className="inline-flex items-center gap-1.5"><Clock size={16} /> Reply within 1 business day</li>
                </ul>
            </div>
        </div>
    );
}

function ProductCardSkeleton() {
    return (
        <div className="w-full rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
            <div className="aspect-[5/4] bg-zinc-200" />
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

