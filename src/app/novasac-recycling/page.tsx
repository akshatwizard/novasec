import Section from '@/components/ui/section'
import Wrapper from '@/components/ui/wrapper'
import {
    Recycle,
    Factory,
    Truck,
    Leaf,
    ArrowRight,
    Archive,
    PhoneCall,
    Pickaxe,
    FlaskConical,
    Package,
    Building2,
    Wheat,
    ShieldCheck,
    BadgeCheck,
    MapPin,
    Phone,
    Mail,
} from "lucide-react";
import Image from 'next/image';
import Link from 'next/link';



const heroStats = [
    {
        value: "100%",
        label: "Recycling Focus",
        icon: Recycle,
    },
    {
        value: "40+",
        label: "Years Experience",
        icon: Factory,
    },
    {
        value: "EU",
        label: "Collection Support",
        icon: Truck,
    },
    {
        value: "Eco",
        label: "Sustainable Disposal",
        icon: Leaf,
    },
];

const trustItems = [
    "Polypropylene Bag Recovery",
    "Industrial Recycling Support",
    "Sustainable Waste Solutions",
    "Responsible Disposal",
];

const industries = [
    {
        title: "Agriculture",
        icon: Wheat,
    },
    {
        title: "Construction",
        icon: Building2,
    },
    {
        title: "Food Production",
        icon: Package,
    },
    {
        title: "Chemical Industry",
        icon: FlaskConical,
    },
    {
        title: "Mining",
        icon: Pickaxe,
    },
    {
        title: "Logistics",
        icon: Truck,
    },
    {
        title: "Manufacturing",
        icon: Factory,
    },
    {
        title: "Recycling",
        icon: Recycle,
    },
];

const steps = [
    {
        step: "01",
        title: "You Have Old fibc Bags",
        description:
            "Used woven polypropylene bags that are no longer required.",
        icon: Archive,
    },
    {
        step: "02",
        title: "Contact Novasac",
        description:
            "Our team will discuss collection options and requirements.",
        icon: PhoneCall,
    },
    {
        step: "03",
        title: "Send The Bags",
        description:
            "Arrange collection or delivery through an agreed process.",
        icon: Truck,
    },
    {
        step: "04",
        title: "We Recycle & Recover",
        description:
            "The materials are diverted from landfill and responsibly processed.",
        icon: Recycle,
    },
];

const benefits = [
    {
        title: "Sustainable Recovery",
        description:
            "Reduce landfill waste and support responsible recycling initiatives.",
        icon: Leaf,
    },
    {
        title: "Industry Expertise",
        description:
            "Decades of experience in industrial packaging and material handling.",
        icon: Factory,
    },
    {
        title: "Trusted Partner",
        description:
            "Work with a recognised packaging company that understands your needs.",
        icon: ShieldCheck,
    },
    {
        title: "Simple Collection Process",
        description:
            "Easy communication and straightforward collection arrangements.",
        icon: BadgeCheck,
    },
];

const stats = [
    {
        value: "40+",
        label: "Years Experience",
    },
    {
        value: "1000+",
        label: "Businesses Served",
    },
    {
        value: "EU",
        label: "Packaging Expertise",
    },
    {
        value: "Eco",
        label: "Sustainable Solutions",
    },
];

export default function Recycling() {
    return (
        <>
            <Section className="relative overflow-hidden pt-0">
                <div
                    className="pointer-events-none absolute inset-0 bg-cover bg-center scale-105"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2000')",
                    }}
                >
                    <div className="absolute inset-0 bg-linear-to-r from-forest-950/95 via-forest-900/70 to-forest-950/30" />
                </div>

                <Wrapper className="relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left Content */}
                        <div className="flex flex-col gap-6">
                            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-forest-500/10 border border-forest-500/30 px-4 py-1.5 backdrop-blur-sm">
                                <span className="h-2 w-2 rounded-full bg-forest-500 animate-pulse" />

                                <span className="text-forest-500 text-xs font-semibold uppercase tracking-widest">
                                    FIBC Bag Recycling Initiative · Valencia
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">
                                Can't dispose your
                                <br />
                                <strong className="text-forest-500">
                                    old FIBC bags? <br />
                                </strong>
                                Give them to us.
                            </h1>

                            <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-xl">
                                Don't send used woven polypropylene bags to landfill.
                                Novasac helps businesses responsibly recover,
                                recycle, and repurpose old fibc bags through
                                a dedicated collection initiative.
                            </p>

                            <p className="text-slate-300 text-xs md:text-sm leading-relaxed max-w-xl">
                                Whether you're in agriculture, construction,
                                chemicals, food production, or industrial packaging,
                                we provide a simple and sustainable route for
                                disposing of used bags responsibly.
                            </p>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 bg-forest-500 hover:bg-forest-600 transition-colors text-white font-semibold px-6 py-3 rounded-full text-sm"
                                >
                                    Contact Us

                                    <ArrowRight className="w-4 h-4" />
                                </Link>

                                <Link
                                    href="#how"
                                    className="inline-flex items-center gap-2 border border-white/20 hover:border-forest-500 hover:text-forest-500 transition-colors text-slate-300 font-medium px-6 py-3 rounded-full text-sm backdrop-blur-sm"
                                >
                                    How It Works
                                </Link>
                            </div>
                        </div>

                        {/* Right Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            {heroStats.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="rounded-2xl bg-white/5 border border-forest-500/20 backdrop-blur-md p-6 flex flex-col gap-3 hover:bg-forest-500/10 hover:border-forest-500/40 transition-all "
                                    >
                                        <Icon className="w-8 h-8 text-forest-500" />

                                        <p className="text-2xl font-bold text-white">
                                            {item.value}
                                        </p>

                                        <p className="text-sm text-slate-300">
                                            {item.label}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Wrapper>
            </Section>

            <section className="bg-forest-500 border-y border-white/5">
                <Wrapper className="py-0!">
                    <div className="grid md:grid-cols-2 lg:grid-cols-4">
                        {trustItems.map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-center gap-3 px-6 py-5 border-b md:border-b-0 lg:border-r border-white/10 last:border-r-0"
                            >
                                <span className="h-2 w-2 rounded-full bg-white/70 shrink-0" />

                                <span className="text-white text-xs uppercase tracking-wider font-semibold text-center">
                                    {item}
                                </span>
                            </div>
                        ))}
                    </div>
                </Wrapper>
            </section>

            <Section
                id="who"
                className="bg-forest-50"
            >
                <Wrapper>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Image */}

                        <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-soft">
                            <Image
                                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1600"
                                alt="Recycling"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}

                        <div>
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-600">
                                Who Is This For
                            </span>

                            <h2 className="mt-4 text-4xl font-bold text-forest-500">
                                Businesses Looking For A Sustainable Disposal Solution
                            </h2>

                            <p className="mt-6 text-content-muted leading-relaxed">
                                We work with companies across multiple industries that
                                regularly use woven polypropylene and fibc bags.
                            </p>

                            <p className="mt-4 text-content-muted leading-relaxed">
                                Instead of sending used bags to landfill, Novasac helps
                                businesses recover and recycle packaging materials through
                                a simple collection and recycling initiative.
                            </p>

                            <div className="grid grid-cols-2 gap-3 mt-8">
                                {industries.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="flex items-center gap-3 rounded-2xl bg-white border border-border-soft p-4 hover:border-forest-500 hover:bg-forest-100 transition-all"
                                        >
                                            <Icon className="w-5 h-5 text-forest-500 shrink-0" />

                                            <span className="text-sm font-medium text-content">
                                                {item.title}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </Section>

            <Section
                id="how"
                className="bg-white"
            >
                <Wrapper>
                    <div className="max-w-3xl">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-600">
                            How It Works
                        </span>

                        <h2 className="mt-4 text-4xl font-bold text-forest-500">
                            A Simple Four-Step Recycling Process
                        </h2>

                        <p className="mt-5 text-content-muted leading-relaxed">
                            Getting rid of old fibc bags shouldn't be complicated.
                            We've designed a straightforward process that helps businesses
                            dispose of packaging responsibly.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-14">
                        {steps.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.step}
                                    className="relative rounded-3xl border border-border-soft bg-white p-8 hover:bg-forest-50 transition-all hover:shadow-soft"
                                >
                                    {index !== steps.length - 1 && (
                                        <div className="hidden xl:flex absolute -right-4 top-10 z-10 h-8 w-8 rounded-full bg-forest-500 items-center justify-center text-white">
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    )}

                                    <span className="text-xs font-bold tracking-widest uppercase text-forest-500">
                                        Step {item.step}
                                    </span>

                                    <Icon className="w-10 h-10 text-forest-500 mt-5" />

                                    <h3 className="mt-5 text-lg font-semibold text-content">
                                        {item.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-content-muted">
                                        {item.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Wrapper>
            </Section>

            <Section
                id="why"
                className="bg-forest-50"
            >
                <Wrapper>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-500">
                                Why Novasac
                            </span>

                            <h2 className="mt-4 text-4xl font-bold text-forest-500">
                                A Responsible Partner For FIBC Bag Recovery
                            </h2>

                            <p className="mt-6 text-content-muted leading-relaxed">
                                We combine decades of packaging expertise with a commitment
                                to sustainability, helping businesses find practical
                                alternatives to landfill disposal.
                            </p>

                            <div className="mt-10 space-y-4">
                                {benefits.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div
                                            key={item.title}
                                            className="flex gap-4 bg-white border-l-4 border-forest-500 rounded-2xl p-5 shadow-sm"
                                        >
                                            <Icon className="w-6 h-6 text-forest-500 shrink-0 mt-1" />

                                            <div>
                                                <h3 className="font-semibold text-forest-500">
                                                    {item.title}
                                                </h3>

                                                <p className="mt-2 text-sm text-content-muted leading-relaxed">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Image */}

                        <div className="relative aspect-4/3 overflow-hidden rounded-3xl shadow-soft">
                            <Image
                                src="https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?q=80&w=1600"
                                alt="Sustainability"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </Wrapper>
            </Section>

            <Section
                id="about"
                className="bg-forest-500"
            >
                <Wrapper>
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-white">
                                About Novasac
                            </span>

                            <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-white">
                                Decades Of Packaging Experience
                            </h2>

                            <p className="mt-6 text-white leading-relaxed">
                                Novasac has been serving industrial and commercial
                                packaging markets for decades, helping businesses
                                across Europe source reliable woven polypropylene
                                packaging solutions.
                            </p>

                            <p className="mt-4 text-white leading-relaxed">
                                Through this recycling initiative, we help companies
                                divert used fibc bags away from landfill and into
                                more responsible recovery channels.
                            </p>

                            <div className="grid grid-cols-2 gap-px overflow-hidden rounded-3xl bg-white/10 border border-white/20 mt-10">
                                {stats.map((item) => (
                                    <div
                                        key={item.label}
                                        className="bg-white/5 p-8 text-center"
                                    >
                                        <p className="text-4xl font-bold text-white">
                                            {item.value}
                                        </p>

                                        <p className="text-xs uppercase tracking-widest text-white/90 mt-2">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right */}

                        <div className="flex flex-col items-center gap-8">
                            <div className="w-full rounded-3xl bg-white p-10 flex justify-center">
                                <Image
                                    src="/images/logo/logo.png"
                                    alt="Novasac"
                                    width={260}
                                    height={100}
                                    className="h-auto"
                                />
                            </div>

                            <blockquote className="text-center text-white italic leading-relaxed max-w-lg">
                                “Helping businesses move towards more sustainable
                                packaging recovery and recycling solutions.”
                            </blockquote>
                        </div>
                    </div>
                </Wrapper>
            </Section>


            <section className="bg-forest-800">
                <Wrapper className="py-20">
                    <div className="text-center max-w-4xl mx-auto">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-light">
                            Get Started
                        </span>

                        <h2 className="mt-4 text-4xl lg:text-5xl font-bold text-white">
                            Ready To Recycle Your Old FIBC Bags?
                        </h2>

                        <p className="mt-6 text-white/80 leading-relaxed max-w-2xl mx-auto">
                            Contact our team today to discuss collection options,
                            recycling support, and sustainable disposal solutions.
                        </p>

                        <div className="flex flex-wrap justify-center gap-4 mt-10">
                            <Link
                                href="/contact"
                                className="
                  inline-flex items-center gap-2
                  bg-white
                  text-forest-900
                  px-8 py-4
                  rounded-full
                  font-semibold
                  hover:bg-forest-50
                  transition-colors
                "
                            >
                                Contact Our Team

                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <Link
                                href="/contact"
                                className="
                  inline-flex items-center gap-2
                  border border-white/20
                  text-white
                  px-8 py-4
                  rounded-full
                  font-semibold
                  hover:border-forest-light
                  hover:text-forest-light
                  transition-colors
                "
                            >
                                Request Collection Information
                            </Link>
                        </div>
                    </div>
                </Wrapper>
            </section>

            <Section
                id="contact"
            // className="bg-forest-50"
            >
                <Wrapper>
                    <div className="text-center max-w-3xl mx-auto">
                        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-forest-500">
                            Contact Information
                        </span>

                        <h2 className="mt-4 text-4xl font-bold text-forest-500">
                            Let's Talk About Recycling
                        </h2>

                        <p className="mt-5 text-content-muted">
                            Reach out to our team for collection enquiries,
                            sustainability initiatives, or packaging support.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6 mt-14">
                        <div
                            className="bg-white border border-border-soft rounded-3xl p-8 hover:shadow-soft hover:border-forest-700 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center">
                                <Mail className="w-6 h-6 text-forest-500" />
                            </div>

                            <p className="mt-6 text-xs uppercase tracking-widest text-content-soft">
                                Email
                            </p>

                            <Link
                                href="mailto:laura.sanjuan@novasac.es"
                                className="block mt-2 font-semibold text-content hover:text-forest-500"
                            >
                                laura.sanjuan@novasac.es
                            </Link>
                        </div>

                        <div
                            className="bg-white border border-border-soft rounded-3xl p-8 hover:shadow-soft hover:border-forest-700 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center">
                                <Phone className="w-6 h-6 text-forest-500" />
                            </div>

                            <p className="mt-6 text-xs uppercase tracking-widest text-content-soft">
                                Phone
                            </p>

                            <Link
                                href="tel:+34628188044"
                                className="block mt-2 font-semibold text-content hover:text-forest-500"
                            >
                                +34 628 188 044
                            </Link>
                        </div>

                        <div
                            className=" bg-white border border-border-soft rounded-3xl p-8 hover:shadow-soft hover:border-forest-700 transition-all"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-forest-100 flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-forest-500" />
                            </div>

                            <p className="mt-6 text-xs uppercase tracking-widest text-content-soft">
                                Location
                            </p>

                            <p className="mt-2 font-semibold text-content">
                                Valencia, Spain
                            </p>
                        </div>
                    </div>
                </Wrapper>
            </Section>
        </>
    )
}
