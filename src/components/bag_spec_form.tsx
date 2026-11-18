"use client";

import { useState, ChangeEvent, FormEvent, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { motion } from "motion/react";
import toast from "react-hot-toast";
import { Info, Ruler } from "lucide-react";
import Section from "@/components/ui/section";
import Wrapper from "@/components/ui/wrapper";

const ENDPOINT = "https://www.gangapapers.in/novasac/api/custom-made-bags/specification";
const OTHER = "Other";
const NOT_SURE = "Not sure – please advise";

/** Choices for each dropdown; every list also gets "Not sure" and "Other (specify)". */
const OPTIONS = {
    loopType: ["Corner loops (4)", "Cross-corner loops (4)", "Sleeve / tunnel loops", "1 loop", "2 loops"],
    loopSize: ["20 cm", "25 cm", "30 cm", "35 cm", "40 cm"],
    swl: ["500 kg", "750 kg", "1,000 kg", "1,250 kg", "1,500 kg", "2,000 kg"],
    gsm: ["120 g/m²", "140 g/m²", "160 g/m²", "180 g/m²", "200 g/m²", "220 g/m²"],
    printing: ["No printing", "1 side", "2 sides", "3 sides", "4 sides"],
    colours: ["1 colour", "2 colours", "3 colours", "4 colours"],
    fabricType: ["Uncoated (breathable)", "Coated / laminated", "UV-stabilised", "Conductive (Type C)", "Static-dissipative (Type D)", "Food grade"],
    topOption: ["Open top", "Filling spout", "Duffle / skirt top", "Top flap / cover"],
    bottomOption: ["Flat bottom (closed)", "Discharge spout", "Full-open bottom"],
    liner: ["No liner", "Loose liner", "Form-fit liner", "Glued-in liner"],
} as const;

type SpecKey = keyof typeof OPTIONS;

type FormState = {
    companyName: string;
    name: string;
    email: string;
    phone: string;
    length: string;
    width: string;
    height: string;
    quantity: string;
} & Record<SpecKey, string> & Record<`${SpecKey}Other`, string>;

const emptySpecs = Object.keys(OPTIONS).reduce((acc, key) => {
    acc[key] = "";
    acc[`${key}Other`] = "";
    return acc;
}, {} as Record<string, string>);

const initialState = {
    companyName: "", name: "", email: "", phone: "",
    length: "", width: "", height: "", quantity: "",
    ...emptySpecs,
} as FormState;

type Errors = Partial<Record<"name" | "email" | "phone" | "dimensions" | "quantity", string>>;

const inputClass =
    "w-full font-sans text-sm text-stone-800 bg-white border border-stone-200 rounded-xl px-4 py-3 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 transition-all duration-200 placeholder:text-stone-300";
const errorClass = "border-red-300 focus:border-red-400 focus:ring-red-100";

function Field({ label, required, error, hint, children }: { label: string; required?: boolean; error?: string; hint?: string; children: ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="font-sans text-xs uppercase tracking-widest text-stone-500">
                {label}
                {required && <span className="text-primary-600 ml-0.5">*</span>}
            </label>
            {children}
            {hint && !error && <p className="font-sans text-[11px] text-stone-400">{hint}</p>}
            {error && <p className="font-sans text-xs text-red-500 mt-0.5">{error}</p>}
        </div>
    );
}

/**
 * "Bag Specification Form" on the Custom-made Bulk Bags page, below the enquiry form.
 * Sent to the backend, which saves it (admin > Enquiries) and emails it to the Novasac team.
 */
export default function BagSpecForm() {
    const [form, setForm] = useState<FormState>(initialState);
    const [errors, setErrors] = useState<Errors>({});

    const set = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        const errorKey = ["length", "width", "height"].includes(name) ? "dimensions" : name;
        if (errors[errorKey as keyof Errors]) setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
    };

    /** The value sent for a dropdown: the choice, or the typed text when "Other" is picked. */
    const specValue = (key: SpecKey) =>
        form[key] === OTHER ? form[`${key}Other`].trim() || OTHER : form[key];

    const validate = () => {
        const next: Errors = {};
        if (!form.name.trim()) next.name = "Name is required.";
        if (!form.email.trim()) next.email = "Email is required.";
        else if (!/\S+@\S+\.\S+/.test(form.email)) next.email = "Enter a valid email address.";
        if (!form.phone.trim()) next.phone = "Phone number is required.";
        else if (!/^\+?[0-9\s().-]{6,30}$/.test(form.phone.trim())) next.phone = "Enter a valid phone number.";
        const dims = [form.length, form.width, form.height].map(Number);
        if (dims.some((d) => !d || d <= 0)) next.dimensions = "Enter length, width and height in cm.";
        if (!Number(form.quantity) || Number(form.quantity) < 1) next.quantity = "Enter the number of bags.";
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const { mutate, isPending, isSuccess, reset } = useMutation({
        mutationFn: async () => {
            const payload: Record<string, string> = {
                companyName: form.companyName.trim(),
                name: form.name.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                length: form.length,
                width: form.width,
                height: form.height,
                quantity: String(Math.round(Number(form.quantity))),
            };
            (Object.keys(OPTIONS) as SpecKey[]).forEach((key) => { payload[key] = specValue(key); });
            return (await axios.post(ENDPOINT, payload, { headers: { Accept: "application/json" } })).data;
        },
        onSuccess() {
            toast.success("Bag specification sent!");
            setForm(initialState);
        },
        onError(err: AxiosError<{ errors?: Record<string, string[]>; message?: string }>) {
            const serverErrors = err.response?.data?.errors;
            if (serverErrors) {
                const first = Object.values(serverErrors)[0]?.[0];
                toast.error(first ?? "Please check the form.");
            } else {
                toast.error("Your specification could not be sent. Please try again.");
            }
        },
    });

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) mutate();
    };

    const select = (key: SpecKey, label: string, hint?: string) => (
        <Field label={label} hint={hint}>
            <select name={key} value={form[key]} onChange={set} className={`${inputClass} ${form[key] ? "" : "text-stone-400"}`}>
                <option value="">Select…</option>
                {OPTIONS[key].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                <option value={NOT_SURE}>{NOT_SURE}</option>
                <option value={OTHER}>Other (please specify)</option>
            </select>
            {form[key] === OTHER && (
                <input
                    type="text"
                    name={`${key}Other`}
                    value={form[`${key}Other`]}
                    onChange={set}
                    maxLength={150}
                    placeholder={`Specify ${label.toLowerCase()}`}
                    className={inputClass}
                    autoFocus
                />
            )}
        </Field>
    );

    return (
        <Section id="bag-specification">
            <Wrapper>
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex flex-col gap-6"
                >
                    <div className="flex flex-col gap-3">
                        <p className="font-sans text-xs tracking-[0.2em] uppercase text-primary-500">
                            Bag Specification Form
                        </p>
                        <h2 className="font-mono text-3xl md:text-4xl font-light text-stone-900 max-w-3xl">
                            Prefer to Share Exact Bag Specifications?{" "}
                            <strong className="text-primary-600">Fill Out the Form Below.</strong>
                        </h2>
                        <div className="flex w-fit max-w-full items-start gap-2.5 rounded-xl border border-primary-200 bg-primary-50 px-4 py-3">
                            <Info size={18} className="mt-0.5 shrink-0 text-primary-600" />
                            <p className="font-sans text-sm text-primary-800">
                                Fill either the enquiry form above <strong>or</strong> the detailed bag specification form below.
                            </p>
                        </div>
                    </div>

                    {isSuccess ? (
                        <div className="bg-white border border-primary-200 rounded-2xl p-10 text-center">
                            <div className="w-14 h-14 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center mx-auto mb-5">
                                <Ruler size={24} />
                            </div>
                            <h3 className="font-mono text-2xl font-light text-stone-900 mb-2">Specification sent!</h3>
                            <p className="font-sans text-sm text-stone-500 leading-relaxed max-w-md mx-auto">
                                Thank you. Our team will review your bag specification and get back to you with a quote as soon as possible.
                            </p>
                            <button type="button" onClick={() => reset()} className="mt-6 font-sans text-sm text-primary-600 hover:underline">
                                Send another specification
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} noValidate className="bg-white border border-stone-200 rounded-2xl p-6 md:p-8 flex flex-col gap-8">

                            {/* Contact */}
                            <fieldset className="flex flex-col gap-5">
                                <legend className="mb-4 font-sans text-sm font-semibold text-stone-800">Your details</legend>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <Field label="Company Name">
                                        <input type="text" name="companyName" value={form.companyName} onChange={set} placeholder="Your company name" className={inputClass} />
                                    </Field>
                                    <Field label="Your Name" required error={errors.name}>
                                        <input type="text" name="name" value={form.name} onChange={set} placeholder="Full name" className={`${inputClass} ${errors.name ? errorClass : ""}`} />
                                    </Field>
                                    <Field label="Your Email" required error={errors.email}>
                                        <input type="email" name="email" value={form.email} onChange={set} placeholder="you@company.com" className={`${inputClass} ${errors.email ? errorClass : ""}`} />
                                    </Field>
                                    <Field label="Phone Number" required error={errors.phone}>
                                        <input type="tel" name="phone" value={form.phone} onChange={set} placeholder="+34 000 000 000" className={`${inputClass} ${errors.phone ? errorClass : ""}`} />
                                    </Field>
                                </div>
                            </fieldset>

                            {/* Specifications */}
                            <fieldset className="flex flex-col gap-5">
                                <legend className="mb-4 font-sans text-sm font-semibold text-stone-800">Bag specifications</legend>

                                <div className="grid sm:grid-cols-2 gap-5">
                                    <Field label="Bag Dimensions (cm)" required error={errors.dimensions} hint="Length × Width × Height">
                                        <div className="grid grid-cols-3 gap-2">
                                            {(["length", "width", "height"] as const).map((dim) => (
                                                <input
                                                    key={dim}
                                                    type="number"
                                                    inputMode="decimal"
                                                    min={1}
                                                    name={dim}
                                                    value={form[dim]}
                                                    onChange={set}
                                                    placeholder={dim === "length" ? "L" : dim === "width" ? "W" : "H"}
                                                    aria-label={`${dim} in cm`}
                                                    className={`${inputClass} text-center ${errors.dimensions ? errorClass : ""}`}
                                                />
                                            ))}
                                        </div>
                                    </Field>
                                    <Field label="Quantity (bags)" required error={errors.quantity}>
                                        <input type="number" inputMode="numeric" min={1} step={1} name="quantity" value={form.quantity} onChange={set} placeholder="e.g. 1000" className={`${inputClass} ${errors.quantity ? errorClass : ""}`} />
                                    </Field>

                                    {select("loopType", "Loop Type")}
                                    {select("loopSize", "Loop Size", "Loop height")}
                                    {select("swl", "SWL", "Safe working load")}
                                    {select("gsm", "GSM", "Fabric weight")}
                                    {select("printing", "Printing")}
                                    {select("colours", "Colours", "Number of print colours")}
                                    {select("fabricType", "Fabric Type")}
                                    {select("liner", "Liner Requirements")}
                                    {select("topOption", "Top Option")}
                                    {select("bottomOption", "Bottom Option")}
                                </div>
                            </fieldset>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full font-sans text-sm px-6 py-4 bg-primary-600 text-white rounded-xl hover:bg-primary-700 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isPending ? "Sending specification..." : "Send Bag Specification"}
                            </button>
                        </form>
                    )}
                </motion.div>
            </Wrapper>
        </Section>
    );
}
