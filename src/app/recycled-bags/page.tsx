import Section from '@/components/ui/section'
import Wrapper from '@/components/ui/wrapper'
import Link from 'next/link'
import {
    Package,
    Sun,
    ShieldCheck,
    Globe,
    ShoppingBag,
    BadgeCheck,
    ArrowRight,
} from 'lucide-react'
import Image from 'next/image'

const stats = [
    { value: 'UNE-EN 15343', label: 'Certified Standard' },
    { value: 'AENOR', label: 'Certification Body' },
    { value: '100%', label: 'Traceable Recycled Content' },
    { value: 'EU', label: 'Regulation Compliant' },
]

const commitments = [
    {
        icon: <Package className="w-6 h-6" />,
        title: 'Post-Consumer & Post-Industrial Materials',
        description:
            'We integrate both post-consumer and post-industrial recycled plastics into our production, maximising material recovery and reducing landfill burden.',
    },
    {
        icon: <Sun className="w-6 h-6" />,
        title: 'Reduced Carbon Footprint',
        description:
            'By choosing recycled materials over virgin polymers, our bags generate significantly lower CO₂ emissions throughout their production lifecycle.',
    },
    {
        icon: <ShieldCheck className="w-6 h-6" />,
        title: 'Certified Traceability',
        description:
            'Full traceability under UNE-EN 15343 ensures every kilogram of recycled content is verifiable, giving our clients complete confidence in their sustainable sourcing.',
    },
    {
        icon: <Globe className="w-6 h-6" />,
        title: 'European Environmental Compliance',
        description:
            'Our products meet current EU environmental regulations, supporting businesses with their regulatory obligations and ESG reporting requirements.',
    },
]

const products = [
    {
        id: 'fibc',
        badge: 'FIBC / Jumbo Bags',
        title: 'Big Bags Made from 100% Recycled PP',
        subtitle: 'High-performance bulk bags for sustainable large-volume handling',
        description:
            'A sustainable solution for bulk material handling, manufactured entirely from recycled polypropylene. These bags give recycled material a second life while offering a practical, versatile packaging solution for industrial applications.',
        specs: [
            { label: 'Bag Type', value: 'FIBC with Recycled PP Fabric' },
            { label: 'Size Range', value: '80×80×90 cm — 100×100×120 cm' },
            { label: 'Fabric', value: 'Recycled PP Woven Fabric' },
            { label: 'Fabric GSM', value: '140 – 220 GSM' },
            { label: 'Safe Working Load', value: '500 – 2,000 kg' },
            { label: 'Safety Factor', value: '5:1 / 6:1' },
            { label: 'Liner', value: 'Optional (LDPE / Form-Fit)' },
            { label: 'Loop Configuration', value: '4 Corner / Cross Corner Loops' },
            { label: 'Filling / Discharge', value: 'Customizable' },
            { label: 'UV Stabilization', value: 'Optional' },
            { label: 'Certification', value: 'UN / AENOR / EN 15343' },
        ],
        panelGradient: 'from-primary-50 to-primary-100',
        border: 'border-primary-200',
        badgeBg: 'bg-primary-600 text-white',
        subtitleColor: 'text-primary-700',
        ctaBg: 'bg-primary-600 hover:bg-primary-500',
        images: "/images/recycled/fibc.jpg",
        // The new photo carries its own "100% Recycled PP" + AENOR marks (top-left / top-right) and is square,
        // so: don't overlay the EN 15343 pill on top of it, and use a white panel so it blends in.
        hideCertBadge: true,
        imagePanelGradient: 'from-white to-white',
    },
    {
        id: 'ppws',
        badge: 'PP Woven Sacks',
        title: 'PP Woven Sacks with Recycled Content',
        subtitle: 'Durable, cost-effective sacks for industrial and agricultural use',
        description:
            'Our recycled PP woven sacks offer a sustainable alternative for packaging a wide range of bulk dry goods. From fertilisers and grains to minerals and chemicals, these sacks deliver reliability at scale while incorporating verified recycled material.',
        specs: [
            { label: 'Bag Type', value: 'PP Woven Sack (Recycled)' },
            { label: 'Size Range', value: '50×80 cm — 70×110 cm' },
            { label: 'Fabric', value: 'Recycled PP Fabric' },
            { label: 'Fabric GSM', value: '70 – 120 GSM' },
            { label: 'Capacity', value: '10 – 50 kg' },
            { label: 'Liner', value: 'Optional' },
            { label: 'Lamination', value: 'Optional' },
            { label: 'Printing', value: 'Customizable' },
            { label: 'UV Stabilization', value: 'Optional' },
            { label: 'Certification', value: 'EN 15343 compliant / AENOR' },
        ],
        panelGradient: 'from-primary-50 to-primary-100',
        border: 'border-primary-200',
        badgeBg: 'bg-primary-600 text-white',
        subtitleColor: 'text-primary-700',
        ctaBg: 'bg-primary-600 hover:bg-primary-500',
        images: "/images/recycled/pp-woven.jpg"
    },
    {
        id: 'garden',
        badge: 'Garden Bags',
        title: 'Garden Bags with Recycled Content',
        subtitle: 'Reusable outdoor waste collection bags built from recycled PP',
        description:
            'Designed for sustainable garden and green waste collection, these bags combine the strength of woven polypropylene with a commitment to circular packaging. Available in multiple sizes to suit municipal, landscaping, and domestic applications.',
        specs: [
            { label: 'Type', value: 'Big Bag' },
            { label: 'Safety Factor', value: '6:1' },
            { label: 'Available Sizes', value: '45×45×45 cm / 80×80×80 cm / 50×30×50 cm' },
            { label: 'Filling System', value: 'Open Top' },
            { label: 'Emptying System', value: 'Flat Base' },
            { label: 'Fabric', value: 'Non-Laminated Recycled Polypropylene' },
            { label: 'Loops', value: 'Two Loops' },
            { label: 'Liner', value: 'None' },
            { label: 'Safe Working Load', value: '500 kg' },
            { label: 'Colour', value: 'White' },
            { label: 'Sort of Use', value: 'Garden Waste' },
        ],
        panelGradient: 'from-primary-50 to-primary-100',
        border: 'border-primary-200',
        badgeBg: 'bg-primary-600 text-white',
        subtitleColor: 'text-primary-700',
        ctaBg: 'bg-primary-600 hover:bg-primary-500',
        images: "/images/recycled/garden.jpg"
    },
    {
        id: 'garbage',
        badge: 'Garbage Bags',
        title: 'Garbage Bags with Recycled Content',
        subtitle: 'Eco-conscious waste disposal bags from recycled LDPE/HDPE',
        description:
            'Our recycled-content garbage bags provide an eco-friendly solution for general waste disposal. Manufactured from recycled LDPE and HDPE, they retain full puncture and tear resistance while significantly reducing the use of virgin plastics.',
        specs: [
            { label: 'Type', value: 'Big Bag' },
            { label: 'Safety Factor', value: '6:1' },
            { label: 'Available Sizes', value: '45×45×45 cm / 80×80×80 cm / 50×30×50 cm' },
            { label: 'Filling System', value: 'Open Top' },
            { label: 'Emptying System', value: 'Flat Base' },
            { label: 'Fabric', value: 'Non-Laminated Recycled Polypropylene' },
            { label: 'Loops', value: 'Two Loops' },
            { label: 'Liner', value: 'None' },
            { label: 'Safe Working Load', value: '500 kg' },
            { label: 'Colour', value: 'White' },
            { label: 'Sort of Use', value: 'General Waste' },
        ],
        panelGradient: 'from-primary-50 to-primary-100',
        border: 'border-primary-200',
        badgeBg: 'bg-primary-600 text-white',
        subtitleColor: 'text-primary-700',
        ctaBg: 'bg-primary-600 hover:bg-primary-500',
        images: "/images/recycled/garbage.jpg"
    },
]
export default function RecycledBags() {
    return (
        <>
            <Section className="relative overflow-hidden pt-0">
                <div
                    className="pointer-events-none absolute inset-0 bg-cover bg-center scale-105"
                    style={{
                        backgroundImage: `url('/images/hero/recycle.jpeg')`,
                        backgroundPosition: 'center 0%',
                    }}
                >

                    <div
                        className="absolute inset-0 bg-linear-to-r from-black/95 via-slate-900/80 to-slate-900/40"
                    />
                </div>

                {/* Subtle brand-colored glow on top of image */}
                <div className="pointer-events-none absolute inset-0 z-1 overflow-hidden">
                    <div className="absolute -top-32 -right-32 h-120 w-120 rounded-full bg-primary-500/10 blur-3xl" />
                    <div className="absolute bottom-0 -left-24 h-64 w-64 rounded-full bg-primary-400/10 blur-2xl" />
                </div>

                <Wrapper className="relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* left copy */}
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-primary-500/15 border border-primary-500/30 px-4 py-1.5 backdrop-blur-sm">
                                <span className="h-2 w-2 rounded-full bg-primary-400 animate-pulse" />
                                <span className="text-primary-300 text-xs font-semibold uppercase tracking-widest">
                                    Certified Sustainable Packaging
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                                Bags with<br />
                                <strong className="text-primary-600">
                                    Recycled Content
                                </strong>
                            </h1>

                            <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl">
                                At Novasac, sustainability is at the core of our innovation. We offer a wide range of
                                flexible packaging solutions manufactured with recycled content — reducing environmental
                                impact while maintaining high performance and durability.
                            </p>

                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                                Our products are developed in compliance with{' '}
                                <strong className="text-white">UNE-EN 15343</strong>, ensuring full traceability of
                                recycled plastics, and are certified by{' '}
                                <strong className="text-white">AENOR</strong> for guaranteed transparency and reliability.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-500 transition-colors text-white font-semibold px-6 py-3 rounded-full text-sm"
                                >
                                    Request a Quote
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                                <Link
                                    href="#products"
                                    className="inline-flex items-center gap-2 border border-slate-600 hover:border-primary-500 hover:text-primary-300 transition-colors text-slate-300 font-medium px-6 py-3 rounded-full text-sm backdrop-blur-sm"
                                >
                                    Explore Products
                                </Link>
                            </div>
                        </div>

                        {/* right stats grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {stats.map((s) => (
                                <div
                                    key={s.label}
                                    className="rounded-2xl bg-white/5 border border-primary-500/20 backdrop-blur-md p-6 flex flex-col gap-2 hover:bg-primary-500/10 hover:border-primary-400/40 transition-colors"
                                >
                                    <p className="text-2xl font-bold text-white">{s.value}</p>
                                    <p className="text-sm text-slate-400">{s.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </Wrapper>
            </Section>

            {/* ── Commitment section ── */}
            <Section className="bg-white">
                <Wrapper>
                    <div className="flex flex-col gap-4 max-w-2xl">
                        <span className="text-xs font-medium uppercase tracking-widest text-primary-600">
                            Our Commitment
                        </span>
                        <h2 className="text-3xl md:text-4xl font-medium text-stone-900 ">
                            Sustainability at Every Step
                        </h2>
                        <p className="text-slate-500 text-sm">
                            From raw material selection to certified delivery, every Novasac recycled-content bag
                            is built on a foundation of environmental responsibility.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {commitments.map((c) => (
                            <div
                                key={c.title}
                                className="group flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-soft hover:-translate-y-1 transition-all duration-300 p-6"
                            >
                                <div className="w-12 h-12 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    {c.icon}
                                </div>
                                <h3 className="font-semibold text-stone-900  text-base leading-snug">{c.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{c.description}</p>
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </Section>

            {/* ── Product sections ── */}
            <Section id="products" className="bg-slate-50">
                <Wrapper>
                    <div className="text-center flex flex-col items-center gap-3">
                        <span className="text-xs font-medium uppercase tracking-widest text-primary-600">
                            Product Range
                        </span>
                        <h2 className="text-3xl md:text-4xl font-medium text-stone-900 max-w-xl">
                            Four Categories, One Commitment
                        </h2>
                        <p className="text-slate-500 max-w-2xl text-sm">
                            All product lines carry verified recycled content certified under EN 15343 and AENOR,
                            so your packaging choices support a circular economy — without compromise.
                        </p>
                    </div>

                    <div className="flex flex-col gap-16">
                        {products.map((p, i) => (
                            <div
                                key={p.id}
                                id={p.id}
                                className={`grid lg:grid-cols-2 gap-10 items-start ${i % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
                                    }`}
                            >
                                {/* Image placeholder panel */}
                                <div
                                    className={`relative rounded-3xl overflow-hidden bg-linear-to-br ${p.imagePanelGradient ?? p.panelGradient} border ${p.border} aspect-4/3 flex items-center justify-center`}
                                >
                                    <div className="flex flex-col items-center gap-3 text-center p-8">
                                        {/* <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg">
                                            <ShoppingBag className="w-8 h-8" />
                                        </div>
                                        <p className={`font-bold text-lg ${p.subtitleColor}`}>{p.badge}</p>
                                        <p className="text-slate-500 text-sm">Product image coming soon</p> */}
                                        <Image
                                            src={p.images}
                                            alt={p.title}
                                            fill
                                            sizes='(max-width: 1024px) 100vw, 50vw'
                                            className='w-full h-full object-contain'
                                        />
                                    </div>

                                    {/* certification badge */}
                                    {!p.hideCertBadge && (
                                        <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-sm">
                                            <BadgeCheck className="w-3.5 h-3.5 text-primary-600" />
                                            <span className="text-xs font-semibold text-slate-700">EN 15343 / AENOR</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-6">
                                    <div className="flex flex-col gap-3">
                                        <span
                                            className={`inline-flex w-fit text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${p.badgeBg}`}
                                        >
                                            {p.badge}
                                        </span>
                                        <h3 className="text-2xl md:text-3xl font-bold text-stone-900 ">{p.title}</h3>
                                        <p className={`text-base font-medium ${p.subtitleColor}`}>{p.subtitle}</p>
                                        <p className="text-slate-500 leading-relaxed">{p.description}</p>
                                    </div>

                                    {/* Specs table */}
                                    <div className={`rounded-2xl border ${p.border} overflow-hidden`}>
                                        <div
                                            className={`px-5 py-3 bg-linear-to-r ${p.panelGradient} border-b ${p.border}`}
                                        >
                                            <p className="text-xs font-bold uppercase tracking-widest text-slate-600">
                                                Technical Specifications
                                            </p>
                                        </div>
                                        <div className="divide-y divide-slate-100">
                                            {p.specs.map((spec) => (
                                                <div
                                                    key={spec.label}
                                                    className="flex items-center justify-between px-5 py-2.5 bg-white"
                                                >
                                                    <span className="text-sm text-slate-500 font-medium">{spec.label}</span>
                                                    <span className="text-sm text-slate-800 font-semibold text-right max-w-[55%]">
                                                        {spec.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <Link
                                        href="/contact"
                                        className={`inline-flex w-fit items-center gap-2 ${p.ctaBg} transition-colors text-white font-semibold px-6 py-3 rounded-full text-sm`}
                                    >
                                        Request Samples
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </Section>

            {/* ── CTA Banner ── */}
            <Section className="bg-linear-to-r from-primary-500 to-primary-600">
                <Wrapper>
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
                        <div className="flex flex-col gap-3">
                            <h2 className="text-3xl font-bold text-white">Ready to go circular?</h2>
                            <p className="text-primary-100 text-lg max-w-xl">
                                Our team will help you select the right recycled-content bag for your application,
                                volume, and sustainability goals.
                            </p>
                        </div>
                        <div className="flex flex-wrap justify-center gap-3 shrink-0">
                            <Link
                                href="/contact"
                                className="bg-white text-primary-700 hover:bg-primary-50 transition-colors font-bold px-8 py-3.5 rounded-full text-sm"
                            >
                                Contact Our Team →
                            </Link>
                            <Link
                                href="/custom-made-bags"
                                className="border border-white/40 hover:border-white/80 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-colors"
                            >
                                Custom-Made Bags
                            </Link>
                        </div>
                    </div>
                </Wrapper>
            </Section>
        </>
    )
}