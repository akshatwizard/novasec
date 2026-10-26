'use client';

import Section from './ui/section'
import Wrapper from './ui/wrapper'
import { Heading, SubHeading } from './ui/headings'
import { useState } from 'react'
import HomeProductCard, { productImage } from './home_product_card'
import OrderRequestModal from './order_request_modal'
import Link from 'next/link'
import { ChevronRight, PackageSearch } from 'lucide-react'
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProductData, ProductResponse } from '@/types/home_product.types';


type Props = {
    /** Show only the first N products and a link to the full list (used on the homepage). */
    limit?: number
}

export default function Products({ limit }: Props) {
    const [buyProduct, setBuyProduct] = useState<ProductData | null>(null)

    const { data, isLoading, error } = useQuery<ProductData[]>({
        queryKey: ["new_arrival_products"],
        queryFn: async () => {
            const res = await axios.get<ProductResponse>(
                "https://www.gangapapers.in/novasac/api/home/new-arrivals"
            );
            return res.data.data;
        },
    });

    return (
        <Section>
            <Wrapper>
                <div className="w-full flex flex-col gap-2">
                    <Heading>Popular products</Heading>
                    <SubHeading>
                        Our most popular products at great prices. Just for you!
                    </SubHeading>
                </div>

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

