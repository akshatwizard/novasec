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
            <HomeProductCard product={product} onBuyNow={setBuyProduct} key={product.id} />
        ))
    )

    return (
        <Section>
            {limit ? (
                /* Homepage: same layout as the categories section — heading, then horizontal cards
                   (image beside the text), auto-scrolling: 3 per view on desktop, 2 on tablet, 1 on phones */
                <Wrapper className="lg:gap-7 md:gap-6 gap-5 lg:pt-8 md:pt-6 pt-5 lg:pb-10 md:pb-8 pb-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                        <div className="flex flex-col gap-3">
                            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                                <span className="size-1.5 rounded-full bg-primary-500" />
                                Popular Products
                            </span>
                            <h2 className="lg:text-[44px] md:text-4xl text-3xl leading-tight font-light text-zinc-900">
                                Best sellers, <em className="text-primary-500">ready to order</em>
                            </h2>
                            <p className="max-w-2xl text-pretty text-zinc-600 md:text-lg text-base">
                                Add to cart or buy now — we confirm price and delivery within 1 business day.
                            </p>
                        </div>
                        <Link
                            href="/popular-products"
                            className="inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-5 py-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-500 hover:text-white"
                        >
                            View all products
                            <ArrowRight size={15} />
                        </Link>
                    </div>

                    {products.length > 0 ? (
                        <SliderWrapper
                            autoPlay
                            autoPlayOptions={{ delay: 3000, stopOnMouseEnter: true, stopOnInteraction: false }}
                            options={{ loop: true, align: 'start' }}
                            className="-ml-3 md:-ml-4"
                            viewportClassName="py-1 -my-1"
                            slideClassName="flex basis-full pl-3 md:basis-1/2 md:pl-4 lg:basis-1/3 [&>*]:flex-1 [&>*]:min-w-0"
                            btnLeft="-left-3 rounded-full bg-white text-zinc-800 shadow-md hover:bg-primary-500 hover:text-white disabled:bg-white/60"
                            btnRight="-right-3 rounded-full bg-white text-zinc-800 shadow-md hover:bg-primary-500 hover:text-white disabled:bg-white/60"
                        >
                            {products.map((product) => (
                                <HomeProductCard key={product.id} product={product} onBuyNow={setBuyProduct} horizontal />
                            ))}
                        </SliderWrapper>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {isLoading
                                ? Array.from({ length: 3 }).map((_, i) => <HorizontalSkeleton key={i} />)
                                : grid}
                        </div>
                    )}
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

/** Banner-style heading for the full Popular Products page. */
function PopularBanner() {
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

function HorizontalSkeleton() {
    return (
        <div className="flex rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
            <div className="w-32 sm:w-40 aspect-square bg-zinc-200 shrink-0" />
            <div className="flex-1 p-4 space-y-2">
                <div className="h-4 w-3/4 bg-zinc-200 rounded" />
                <div className="h-5 w-1/3 bg-zinc-200 rounded" />
                <div className="h-8 w-full bg-zinc-100 rounded-full" />
            </div>
        </div>
    );
}

function ProductCardSkeleton() {
    return (
        <div className="w-full rounded-2xl border border-gray-100 bg-white overflow-hidden animate-pulse">
            <div className="aspect-square bg-zinc-200" />
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

