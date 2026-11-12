import Link from 'next/link';
import Image from "next/image";
import { ArrowRight, Printer, Ruler } from 'lucide-react';
import Section from './ui/section'
import Wrapper from './ui/wrapper'

/**
 * Custom-made Bulk Bags banner: picture on the left, heading, text, highlighted
 * "custom built and custom print" message and Contact Us button on the right.
 * (Stacks picture-then-text on phones.)
 */
export default function BentoGrid() {
    return (
        <Section>
            <Wrapper>
                <div className="group grid overflow-hidden rounded-3xl border border-primary-100 bg-white shadow-soft md:grid-cols-2">

                    {/* Picture */}
                    <Link
                        href="/custom-made-bags"
                        className="relative block aspect-[4/3] overflow-hidden bg-white md:aspect-auto md:min-h-[440px]"
                        tabIndex={-1}
                        aria-hidden="true"
                    >
                        <Image
                            src="/images/custom-bag/bag.jpg"
                            alt="Custom-made bulk bag"
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            className="object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                    </Link>

                    {/* Content */}
                    <div className="relative flex flex-col justify-center gap-5 overflow-hidden bg-linear-to-br from-primary-50 via-white to-white p-6 sm:p-8 lg:p-12">
                        <span aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full border-[36px] border-primary-100/70" />

                        <span className="relative inline-flex w-fit items-center gap-2 rounded-full border border-primary-200 bg-white px-3.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary-700">
                            <span className="size-1.5 rounded-full bg-primary-500" />
                            Made to order
                        </span>

                        <h2 className="relative lg:text-[44px] md:text-4xl text-3xl leading-tight font-light text-zinc-900">
                            Custom-made <em className="text-primary-500">Bulk Bags</em>
                        </h2>

                        <p className="relative max-w-lg text-pretty text-zinc-600 md:text-lg text-base">
                            Tailor-made bulk bags built to your exact specifications.
                        </p>

                        {/* Highlighted message */}
                        <div className="relative flex w-fit max-w-full items-center gap-3 rounded-2xl bg-linear-to-r from-primary-600 to-primary-500 px-5 py-4 text-white shadow-lg shadow-primary-500/30">
                            <span className="flex shrink-0 items-center gap-1.5">
                                <Ruler size={20} />
                                <Printer size={20} />
                            </span>
                            <p className="text-base font-bold leading-snug md:text-lg">
                                Get your bags custom built and custom print
                            </p>
                        </div>

                        <Link
                            href="/custom-made-bags"
                            className="relative inline-flex w-fit items-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:bg-primary-600 active:scale-[0.98]"
                        >
                            Contact Us
                            <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </div>
                </div>
            </Wrapper>
        </Section>
    );
}
