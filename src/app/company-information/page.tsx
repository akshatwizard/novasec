"use client";

import Section from "@/components/ui/section";
import Wrapper from "@/components/ui/wrapper";
import { motion, Variants } from "motion/react";
import Image from "next/image";


export default function LegalInformation() {
    return (
        <main className="min-h-screen">

            <Section className="relative overflow-hidden">
                <div
                    className="absolute top-0 right-0 md:w-1/2 w-4/5 h-full overflow-hidden"
                    style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)" }}
                >
                    <Image src={"/images/hero/company.jpeg"} fill alt="bags-each-clean-up" className="w-full h-full object-cover object-right" />
                </div>
                <Wrapper className="p-0!">
                    <section className="relative overflow-hidden border-b border-stone-200">
                        <div className="relative py-16 md:py-24">
                            <motion.p
                                className="font-sans text-xs tracking-[0.2em] uppercase text-primary-500 mb-4"
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, ease: "easeOut" }}
                            >
                                Novasac Packaging
                            </motion.p>
                            <motion.h1
                                className="font-mono text-4xl md:text-6xl font-light text-stone-900 leading-tight mb-5"
                                initial={{ opacity: 0, y: 22 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
                            >
                                Company &amp;<br />
                                <strong className="text-primary-600">Legal Information</strong>
                            </motion.h1>
                            <motion.p
                                className="md:text-base text-sm text-stone-500 max-w-md leading-relaxed"
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
                            >
                                All official company details, registration numbers, bank information,
                                and legal notices for Novasac Packaging.
                            </motion.p>
                        </div>
                    </section>
                </Wrapper>
            </Section>

            <Section>
                <Wrapper className="p-0!">
                    <section className="py-14 md:py-20">
                        <div className="grid md:grid-cols-2 gap-5">

                            {/* Owner */}
                            <Card icon={<IconUser />} title="Owner" delay={0}>
                                <InfoTable
                                    rows={[
                                        { label: "Name", value: "Ms. Laura Sanjuan" },
                                        { label: "Title", value: "Owner of Novasac Packaging" },
                                    ]}
                                />
                            </Card>

                            {/* Company Details */}
                            <Card icon={<IconBuilding />} title="Company Details" delay={0.08}>
                                <InfoTable
                                    rows={[
                                        { label: "VAT Number", value: "B75357491" },
                                        { label: "EORI Number", value: "B75357491" },
                                    ]}
                                />
                            </Card>

                            {/* Registered Address */}
                            <Card icon={<IconMapPin />} title="Registered Address" delay={0.12}>
                                <address className="not-italic space-y-1">
                                    <p className="font-sans text-sm text-stone-700 font-medium">Novasac Packaging</p>
                                    <p className="font-sans text-sm text-stone-500">C/ Pepe Alba 29, 3, 12</p>
                                    <p className="font-sans text-sm text-stone-500">46022 Valencia, Spain</p>
                                </address>
                                <a
                                    href="https://maps.google.com/?q=C/+Pepe+Alba+29,+46022+Valencia,+Spain"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-5 font-sans text-xs text-primary-600 hover:text-primary-700 transition-colors duration-150"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                    </svg>
                                    View on map
                                </a>
                            </Card>

                            {/* Bank Details */}
                            <Card icon={<IconBank />} title="Bank Details" delay={0.16}>
                                <InfoTable
                                    rows={[
                                        { label: "Bank", value: "Banco Sabadell" },
                                        { label: "IBAN", value: "ES29 0081 0145 0500 0459 8168" },
                                    ]}
                                />
                                <div className="mt-5 p-3 bg-primary-50 border border-primary-100 rounded-xl">
                                    <p className="font-sans text-xs text-primary-600 leading-relaxed">
                                        Please use your order number as payment reference when making a bank transfer.
                                    </p>
                                </div>
                            </Card>

                            {/* Office Hours */}
                            <Card icon={<IconClock />} title="Office Hours" delay={0.2}>
                                <div className="flex items-start gap-4">
                                    <div className="flex-1">
                                        <p className="font-sans text-xs uppercase tracking-widest text-stone-400 mb-1">Mon – Fri</p>
                                        <p className="font-mono text-2xl font-light text-stone-900">08:30 – 17:30</p>
                                    </div>
                                    <div className="w-px h-12 bg-stone-100 self-center" />
                                    <div className="flex-1">
                                        <p className="font-sans text-xs uppercase tracking-widest text-stone-400 mb-1">Weekend</p>
                                        <p className="font-mono text-2xl font-light text-stone-400">Closed</p>
                                    </div>
                                </div>
                                <p className="font-sans text-xs text-stone-400 leading-relaxed mt-5">
                                    We are also available outside office hours via our{" "}
                                    <a href="/contact" className="text-primary-600 hover:underline">
                                        chat and contact form
                                    </a>
                                    .
                                </p>
                            </Card>

                            {/* Warehouse Address */}
                            <Card icon={<IconWarehouse />} title="Warehouse Address" delay={0.24}>
                                <address className="not-italic space-y-1">
                                    <p className="font-sans text-sm text-stone-700 font-medium">Parque Logístico de Valencia</p>
                                    <p className="font-sans text-sm text-stone-500">Avda. Puerto de Sagunto, 8</p>
                                    <p className="font-sans text-sm text-stone-500">46190 – Ribarroja del Turia, Spain</p>
                                </address>
                                <a
                                    href="https://maps.google.com/?q=Avda.+Puerto+de+Sagunto+8,+46190+Ribarroja+del+Turia,+Spain"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-5 font-sans text-xs text-primary-600 hover:text-primary-700 transition-colors duration-150"
                                >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                                    </svg>
                                    View on map
                                </a>
                            </Card>

                        </div>

                        {/* ── Full-width cards ── */}
                        <div className="mt-5 grid gap-5">

                            {/* Data Protection */}
                            <Card icon={<IconShield />} title="Data Protection" delay={0.28}>
                                <div className="grid md:grid-cols-2 gap-6 items-start">
                                    <p className="md:text-base text-sm text-stone-500 leading-relaxed">
                                        Your personal information and privacy are very important to us. At Novasac,
                                        we handle your data with the highest level of professionalism and never share
                                        it with third parties without your consent.
                                    </p>
                                    <div className="flex flex-col gap-3">
                                        <a
                                            href="/privacy"
                                            className="inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors duration-200 group"
                                        >
                                            <span className="font-sans text-sm">Privacy Policy</span>
                                            <svg className="group-hover:translate-x-0.5 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                        <a
                                            href="/terms"
                                            className="inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl border border-stone-200 bg-white text-stone-600 hover:border-primary-200 hover:text-primary-700 transition-colors duration-200 group"
                                        >
                                            <span className="font-sans text-sm">Terms &amp; Conditions</span>
                                            <svg className="group-hover:translate-x-0.5 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7" />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </Card>

                            {/* Liability */}
                            <Card icon={<IconScale />} title="Liability" delay={0.32}>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <p className="md:text-base text-sm text-stone-500 leading-relaxed">
                                        Novasac continually updates the content of this website. However, we cannot
                                        guarantee the accuracy or completeness of all information at all times.
                                        All text, images, design, and other content on this website are the property
                                        of Novasac Packaging and may not be copied or distributed without prior
                                        written permission.
                                    </p>
                                    <p className="md:text-base text-sm text-stone-500 leading-relaxed">
                                        Novasac is not liable for any damages arising from the use of information
                                        published on this website. For more information, please refer to our{" "}
                                        <a href="/terms" className="text-primary-600 hover:underline">
                                            General Terms &amp; Conditions
                                        </a>
                                        .
                                    </p>
                                </div>
                            </Card>

                        </div>
                    </section>
                </Wrapper>
            </Section>

            <Section>
                <Wrapper className="p-0!">
                    <section className="border-t border-stone-200 bg-white">
                        <div className="py-10 flex flex-col sm:flex-row items-center justify-between gap-5">
                            <div>
                                <p className="font-mono text-lg font-light text-stone-900">Have a question?</p>
                                <p className="font-sans text-sm text-stone-400 mt-1">
                                    Our team is available Monday to Friday, 08:30 – 17:30.
                                </p>
                            </div>
                            <a
                                href="/contact"
                                className="font-sans shrink-0 text-sm px-8 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors duration-300"
                            >
                                Contact us
                            </a>
                        </div>
                    </section>
                </Wrapper>
            </Section>

        </main>
    );
}

interface InfoRow {
    label: string;
    value: string;
}

interface SectionCard {
    id: string;
    icon: React.ReactNode;
    title: string;
    rows?: InfoRow[];
    content?: React.ReactNode;
}


const fadeUp: Variants = {
    hidden: { opacity: 0, y: 28 },
    show: (delay: number = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
    }),
};

const IconUser = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

const IconBuilding = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M9 9h1m5 0h1M9 13h1m5 0h1M9 17h1m5 0h1" />
    </svg>
);

const IconMapPin = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

const IconBank = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 10v11M12 10v11M16 10v11" />
    </svg>
);

const IconClock = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 3" />
    </svg>
);

const IconWarehouse = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
);

const IconShield = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const IconScale = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 3v18M3 9l9-6 9 6M5 20h14" />
        <path d="M5 9l-2 6h4L5 9zM19 9l-2 6h4l-2-6z" />
    </svg>
);


function InfoTable({ rows }: { rows: InfoRow[] }) {
    return (
        <dl className="space-y-3">
            {rows.map(({ label, value }) => (
                <div key={label} className="flex flex-col sm:flex-row sm:gap-4">
                    <dt className="font-sans text-xs uppercase tracking-widest text-stone-400 sm:w-36 shrink-0 pt-0.5">
                        {label}
                    </dt>
                    <dd className="font-sans text-sm text-stone-700 font-medium">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

function Card({
    icon,
    title,
    children,
    delay = 0,
}: {
    icon: React.ReactNode;
    title: string;
    children: React.ReactNode;
    delay?: number;
}) {
    return (
        <motion.div
            className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 hover:border-primary-200 hover:[box-shadow:var(--shadow-soft)] transition-all duration-300"
            variants={fadeUp}
            custom={delay}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.15 }}
        >
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                    {icon}
                </div>
                <h2 className="font-mono text-lg font-light text-stone-900">{title}</h2>
            </div>
            {children}
        </motion.div>
    );
}