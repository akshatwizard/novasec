'use client';

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Zap } from "lucide-react";
import { ProductData } from "@/types/home_product.types";
import { addToCart } from "@/lib/cart_store";

type Props = {
    product: ProductData;
    /** Opens the order request form for this product. */
    onBuyNow: (product: ProductData) => void;
    /** Image beside the text instead of on top — used for the featured card in the categories grid. */
    horizontal?: boolean;
    /** Smaller card for the homepage Popular Products strip (shorter image, no SKU, smaller buttons). */
    compact?: boolean;
};

export const productHref = (product: ProductData) =>
    `/products/${product.slug}/${product.attribute_value ?? product.attribute_value_slug ?? ""}`;

export const productImage = (product: ProductData) => product.image ?? "/images/no-image.svg";

/** One cart line per product variant (the variant is the attribute value in its URL). */
export const productCartId = (product: ProductData) =>
    `product-${product.id}-${product.attribute_value ?? product.attribute_value_slug ?? "default"}`;

const formatEUR = (n: number) =>
    new Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(n);

/**
 * Popular-products card in the same style as the catalog listing card, plus Add to Cart and
 * Buy Now. The price is the product's EUR price, or "Price on request" when none is set.
 */
export default function HomeProductCard({ product, onBuyNow, horizontal, compact }: Props) {
    const href = productHref(product);
    // Use whichever price the backend has filled in (mrp first, as on the catalog cards).
    const price =
        product.mrp && product.mrp > 0 ? product.mrp
            : product.offer_rate && product.offer_rate > 0 ? product.offer_rate
                : null;

    const handleAddToCart = () =>
        addToCart(
            {
                productId: productCartId(product),
                title: product.title,
                size: "",
                image: productImage(product),
                sku: product.sku ?? undefined,
            },
            1,
        );

    return (
        <div className={`group relative flex ${horizontal ? "flex-row" : "flex-col"} rounded-2xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary-300 overflow-hidden`}>

            {/* Image */}
            {/* Square frame: product photos (mostly portrait or square) fill it instead of floating in a short, wide strip */}
            <Link
                href={href}
                className={`relative shrink-0 overflow-hidden bg-white ${horizontal ? "w-32 sm:w-40 self-stretch min-h-32" : compact ? "aspect-[5/4] w-full" : "aspect-square w-full"}`}
                tabIndex={-1}
                aria-hidden="true"
            >
                <Image
                    src={productImage(product)}
                    alt={product.title}
                    fill
                    sizes={horizontal ? "160px" : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"}
                    className={`object-contain ${horizontal ? "p-1" : "p-2"} transition-transform duration-700 ease-out group-hover:scale-105`}
                />
            </Link>

            {/* Content */}
            <div className={`flex flex-col flex-1 min-w-0 ${compact ? "gap-1.5 p-3" : "space-y-2"} ${horizontal ? "p-3 sm:p-4" : compact ? "" : "px-4 py-4"}`}>
                <Link href={href}>
                    <h3 className={`${compact ? "text-sm" : "text-[15px]"} font-semibold text-gray-800 leading-snug transition hover:text-primary-600 line-clamp-2`}>
                        {product.title}
                    </h3>
                </Link>

                {product.sku && !compact && (
                    <p className="text-[10px] text-gray-400 tracking-wide">
                        SKU · {product.sku}
                    </p>
                )}

                <div className="flex-1" />

                {/* Price */}
                {price !== null ? (
                    <span className={`${compact ? "text-base" : "text-lg"} font-bold text-zinc-900`}>{formatEUR(price)}</span>
                ) : (
                    <span className="text-sm font-semibold text-zinc-500">Price on request</span>
                )}

                {/* Actions */}
                <div className={`grid ${compact ? "gap-1.5 [&>button]:py-1.5 [&>button]:text-[11px]" : "gap-2 pt-1"} ${horizontal ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1 xl:grid-cols-2"}`}>
                    <button
                        type="button"
                        onClick={handleAddToCart}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-primary-500 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-600 active:scale-[0.98] cursor-pointer"
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        Add to Cart
                    </button>
                    <button
                        type="button"
                        onClick={() => onBuyNow(product)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-full bg-zinc-900 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-zinc-800 active:scale-[0.98] cursor-pointer"
                    >
                        <Zap className="h-3.5 w-3.5" />
                        Buy Now
                    </button>
                </div>
            </div>
        </div>
    );
}
