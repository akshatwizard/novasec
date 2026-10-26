'use client';
import { PrimaryStaticItems, SecondaryMenuItems } from '@/constant/menu';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import axios from 'axios'
import { MenuResponse } from '@/types/menu.types';
import Image from 'next/image';

// Shown while the menu API loads, or if it fails, so the primary links are always there.
const FALLBACK_CATEGORIES = [
  { title: "Big Bags", href: "/category/big-bags" },
  { title: "Small Bags", href: "/category/small-bags" },
  { title: "Asbestos Bags", href: "/category/asbestos-bags" },
  { title: "Garden/Garbage Bags", href: "/category/garden-bags" },
];

// Open (unboxed) bold links; an underline marks hover, an open dropdown and the current page.
const linkBase =
  "relative flex h-full items-center gap-1.5 text-[15px] font-bold tracking-wide transition-colors duration-200 after:absolute after:inset-x-0 after:bottom-0 after:h-[3px] after:rounded-full after:bg-primary-600 after:transition-transform after:duration-300 hover:text-primary-700 hover:after:scale-x-100";
const linkIdle = "text-primary-600 after:scale-x-0";
const linkActive = "text-primary-700 after:scale-x-100";

/**
 * Desktop main menu (≥1150px), two always-visible rows:
 *  1. Primary — the four product categories (from the menu API, with their size/type dropdowns)
 *     plus Recycled Bags, as open bold links.
 *  2. Secondary — Technical Textiles, Custom-made Bulk Bags and About Us, as a slim right-aligned row below.
 */
export default function DesktopHeader() {
  const [active, setActive] = useState<string | null>(null)
  const pathname = usePathname()
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > 180);
  });

  const { data } = useQuery<MenuResponse>({
    queryKey: ["menu"],
    queryFn: async function () {
      const res = await axios.get<MenuResponse>("https://www.gangapapers.in/novasac/api/menu");
      return res.data
    },
  })

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className={`sticky top-0 z-40 w-full max-[1150px]:hidden ${scrolled ? "shadow-md" : ""}`}>

      {/* Row 1 — primary */}
      <nav
        aria-label="Main menu"
        className={`relative z-20 ${scrolled ? "bg-white/90 backdrop-blur-md" : "bg-white"} border-b border-zinc-200 lg:px-12 md:px-10 px-8 h-14`}
      >
        <div className='w-full max-w-7xl mx-auto flex items-center h-full gap-7'>

          {!data?.data.length && FALLBACK_CATEGORIES.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent(item.href) ? "page" : undefined}
              className={`${linkBase} ${isCurrent(item.href) ? linkActive : linkIdle}`}
            >
              {item.title}
            </Link>
          ))}

          {data?.data.map((item, idx) => {
            const key = `dynamic-${idx}`
            const href = `/category/${item.category_slug}`
            const groups = item.attributes.filter((attr) => attr.values.length > 0)

            return (
              <div
                key={key}
                className='h-full relative flex items-center'
                onMouseEnter={() => setActive(key)}
                onMouseLeave={() => setActive(null)}
              >
                <Link
                  href={href}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className={`${linkBase} ${isCurrent(href) || active === key ? linkActive : linkIdle}`}
                >
                  {item.title}
                  {groups.length > 0 && (
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${active === key ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                <AnimatePresence>
                  {active === key && groups.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 z-50 bg-white shadow-lg border border-zinc-100 w-max min-w-50 rounded-md overflow-hidden py-1"
                    >
                      {groups.map((attr, aIdx) => (
                        <div key={aIdx}>
                          {groups.length > 1 && (
                            <p className="px-4 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                              {attr.title}
                            </p>
                          )}
                          {attr.values.map((sub, j) => (
                            <Link
                              key={j}
                              href={`/category/${item.category_slug}/${sub.slug}/${attr.slug}`}
                              className="px-4 py-2 flex items-center gap-1.5 hover:text-primary-500 transition-colors duration-300 text-zinc-600 text-sm font-medium group/sub hover:bg-primary-50"
                            >
                              <ChevronRight
                                size={10}
                                className='group-hover/sub:translate-x-0.5 transition-transform duration-300'
                              />
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}

          {PrimaryStaticItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              aria-current={isCurrent(item.path) ? "page" : undefined}
              className={`${linkBase} ${isCurrent(item.path) ? linkActive : linkIdle}`}
            >
              {item.name}
            </Link>
          ))}

          <Link
            href={"/novasac-recycling"}
            aria-label="Novasac Recycling"
            className="ml-auto flex items-center justify-center w-10 h-10 shrink-0"
          >
            <Image
              src="/images/recycle.png"
              alt="Recycle"
              width={64}
              height={64}
              className='size-8'
            />
          </Link>
        </div>
      </nav>

      {/* Row 2 — secondary */}
      <div className={`relative z-10 ${scrolled ? "bg-zinc-50/90 backdrop-blur-md" : "bg-zinc-50"} border-b border-zinc-200 lg:px-12 md:px-10 px-8 h-9`}>
        <ul className='w-full max-w-7xl mx-auto flex items-center justify-end h-full gap-1'>
          {SecondaryMenuItems.map((item, idx) => (
            <li key={item.path} className="flex items-center h-full">
              {idx > 0 && <span aria-hidden="true" className="mx-2 size-1 rounded-full bg-zinc-300" />}
              <Link
                href={item.path}
                aria-current={isCurrent(item.path) ? "page" : undefined}
                className={`text-[13px] font-medium transition-colors duration-200 hover:text-primary-600 ${isCurrent(item.path) ? "text-primary-600" : "text-zinc-600"}`}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
