'use client';

import { PrimaryStaticItems, SecondaryMenuItems } from '@/constant/menu';
import { MenuResponse } from '@/types/menu.types';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Used until the menu API answers (same categories and slugs as the live menu).
const FALLBACK_CATEGORIES = [
    { title: "Big Bags", href: "/category/big-bags" },
    { title: "Small Bags", href: "/category/small-bags" },
    { title: "Asbestos Bags", href: "/category/asbestos-bags" },
    { title: "Garden/Garbage Bags", href: "/category/garden-bags" },
];

/**
 * Main-menu links for screens below 1150px, where the desktop menu is hidden. Same structure as
 * the desktop: a row of highlighted primary links (wrapping onto a second line on narrow phones) and a slim
 * secondary row underneath, so all eight links are always on screen without opening a menu.
 */
export default function MobileNavLinks() {
    const pathname = usePathname();

    const { data } = useQuery<MenuResponse>({
        queryKey: ["menu"],
        queryFn: async () => {
            const res = await axios.get<MenuResponse>("https://www.gangapapers.in/novasac/api/menu");
            return res.data;
        },
    });

    const categories = data?.data.length
        ? data.data.map((item) => ({ title: item.title, href: `/category/${item.category_slug}` }))
        : FALLBACK_CATEGORIES;

    const primary = [
        ...categories,
        ...PrimaryStaticItems.map((item) => ({ title: item.name, href: item.path })),
    ];

    const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

    return (
        <nav aria-label="Main menu" className="min-[1150px]:hidden w-full border-b border-zinc-200 bg-white">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1.5 px-4 py-2.5">
                {primary.map((link) => (
                    <li key={link.href} className="shrink-0">
                        <Link
                            href={link.href}
                            aria-current={isCurrent(link.href) ? "page" : undefined}
                            className={`block border-b-2 py-0.5 text-[13px] font-bold whitespace-nowrap transition-colors ${isCurrent(link.href)
                                ? "border-primary-600 text-primary-700"
                                : "border-transparent text-primary-600 hover:text-primary-700"
                                }`}
                        >
                            {link.title}
                        </Link>
                    </li>
                ))}
            </ul>
            <ul className="flex items-center justify-end gap-1 overflow-x-auto border-t border-zinc-100 bg-zinc-50 px-4 py-1.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {SecondaryMenuItems.map((item, idx) => (
                    <li key={item.path} className="flex shrink-0 items-center">
                        {idx > 0 && <span aria-hidden="true" className="mx-1.5 size-1 rounded-full bg-zinc-300" />}
                        <Link
                            href={item.path}
                            aria-current={isCurrent(item.path) ? "page" : undefined}
                            className={`text-xs font-medium whitespace-nowrap hover:text-primary-600 ${isCurrent(item.path) ? "text-primary-600" : "text-zinc-600"}`}
                        >
                            {item.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
