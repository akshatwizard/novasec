'use client';
import { MenuItems } from '@/constant/menu';
import { useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Factory, Heart, ShoppingCart, Sprout, User } from 'lucide-react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import Link from 'next/link';
import { useState } from 'react';
import axios from 'axios'
import { MenuResponse } from '@/types/menu.types';
import Image from 'next/image';

export default function DesktopHeader() {
  const [active, setActive] = useState<string | null>(null)
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState<boolean | null>(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (latest > 180) {
      setScrolled(true);
    } else {
      setScrolled(null);
    }
  });

  const { data, isFetching, isLoading } = useQuery<MenuResponse>({
    queryKey: ["menu"],
    queryFn: async function () {
      const res = await axios.get<MenuResponse>("https://www.gangapapers.in/novasac/api/menu");
      return res.data
    },
  })


  return (
    <div className={`sticky top-0 z-40 w-full ${scrolled ? "shadow-md bg-white/80 backdrop-blur-md" : "bg-white"} border-b border-zinc-200 max-[1150px]:hidden lg:px-12 md:px-10 px-8 h-12`}>

      <div className='w-full max-w-7xl mx-auto flex items-center h-full justify-between'>

        <div className='flex items-center h-full gap-1 w-full'>

          {
            (isFetching || isLoading) && (
              ["Big Bags", "Small Bags", "Asbestos Bags", "Garden/Garbage Bags"].map((k, i) => (
                <button key={i} disabled className="px-1.5 text-sm font-medium text-primary-500 flex items-center gap-1.5" >
                  {k}
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300`}
                  />
                </button>
              ))
            )
          }

          {
            data && data.data.map((item, idx) => {
              const key = `dynamic-${idx}`
              return (
                <div
                  key={key}
                  className='h-full relative px-1.5 group flex items-center text-sm font-medium text-primary-500'
                  onMouseEnter={() => setActive(key)}
                  onMouseLeave={() => setActive(null)}
                >

                  <Link href={`/category/${item.category_slug}`} className="cursor-pointer flex items-center gap-1.5 h-full">
                    {item.title}
                    <ChevronDown
                      size={12}
                      className={`transition-transform duration-300 ${active === key ? "rotate-180" : ""}`}
                    />
                  </Link>

                  <AnimatePresence>
                    {active === key && item.attributes.map((attr, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute top-full left-0 bg-white shadow-lg border border-zinc-100 w-max min-w-50 rounded-md overflow-hidden"
                      >
                        {attr.values.map((sub, j) => (
                          <Link
                            key={j}
                            href={`/category/${item.category_slug}/${sub.slug}/${attr.slug}` || "#"}
                            className="px-4 py-2 flex items-center gap-1.5 hover:text-primary-500 transition-colors duration-300 text-zinc-600 text-sm group/sub hover:bg-primary-50"
                          >
                            <ChevronRight
                              size={10}
                              className='group-hover/sub:translate-x-0.5 transition-transform duration-300'
                            />
                            {sub.name}
                          </Link>
                        ))}
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <AnimatePresence mode='popLayout'>
                    {active === key && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-x-0 bottom-0 bg-primary-600 h-0.5 rounded-full"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          }

          {
            MenuItems.map((items, idx) => {
              const key = `static-bottom-${idx}`

              return (
                <div
                  key={items.name}
                  className={`${idx === MenuItems.length - 1 ? "ml-auto" : ""} h-full relative px-1.5 group flex items-center text-sm font-medium text-primary-500`}
                  onMouseEnter={() => setActive(key)}
                  onMouseLeave={() => setActive(null)}
                >
                  <Link
                    href={items.path}
                    className='h-full flex items-center gap-1.5'
                  >
                    {/* {idx === MenuItems.length - 1 && <Sprout size={16} />} */}
                    {items.name}
                  </Link>
                  <AnimatePresence mode='popLayout'>
                    {active === key && (
                      <motion.span
                        layoutId="nav-hover"
                        className="absolute inset-x-0 bottom-0 bg-primary-600 h-0.5 rounded-full"
                        initial={{ opacity: 0, scale: 0.97 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ type: "tween", ease: [0.22, 1, 0.36, 1], duration: 0.5 }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              )
            })
          }

          <Link href={"/novasac-recycling"}
            className="relative hidden md:flex items-center justify-center w-10 h-10 ">
            {/* <Recycle className="text-white" size={28} strokeWidth={1} fill='white' /> */}
            <Image
              src="/images/recycle.png"
              alt="Recycle"
              width={64}
              height={64}
              className='size-8'
            />
          </Link>

        </div>

        {/* <AnimatePresence mode='wait'>
          {
            scrolled && (
              <motion.div className='flex items-center gap-3'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 1 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ ease: 'easeInOut', duration: 0.2 }}
              >
                <button className="cursor-pointer">
                  <Heart className="text-primary-500" size={28} strokeWidth={1} fill='#ff710a' />
                </button>

                <button className="cursor-pointer">
                  <ShoppingCart className="text-primary-500" size={28} strokeWidth={1} fill='#ff710a' />
                </button>

                <button className="cursor-pointer">
                  <User className="text-primary-500" size={28} strokeWidth={1} fill='#ff710a' />
                </button>
              </motion.div>
            )
          }
        </AnimatePresence> */}
      </div>
    </div>
  )
}
