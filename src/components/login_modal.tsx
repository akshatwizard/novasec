"use client";
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { X, Mail, Phone, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/auth_context';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    currentStep: "login" | "otp";
    changeStep: Dispatch<SetStateAction<"login" | "otp">>;
};

const OTP_LENGTH = 6;

function OtpInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    const refs = useRef<(HTMLInputElement | null)[]>([]);

    const handleKey = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
        if (e.key === "Backspace") {
            if (value[idx]) {
                const next = value.split("");
                next[idx] = "";
                onChange(next.join(""));
            } else if (idx > 0) {
                refs.current[idx - 1]?.focus();
                const next = value.split("");
                next[idx - 1] = "";
                onChange(next.join(""));
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
        const char = e.target.value.replace(/\D/g, "").slice(-1);
        if (!char) return;
        const next = value.split("").concat(Array(OTP_LENGTH).fill("")).slice(0, OTP_LENGTH);
        next[idx] = char;
        onChange(next.join(""));
        if (idx < OTP_LENGTH - 1) refs.current[idx + 1]?.focus();
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
        onChange(pasted.padEnd(OTP_LENGTH, ""));
        refs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
        e.preventDefault();
    };

    return (
        <div className="flex gap-2 justify-center">
            {Array.from({ length: OTP_LENGTH }).map((_, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05, type: "spring", stiffness: 280, damping: 22 }}
                >
                    <input
                        ref={(el) => { refs.current[idx] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[idx] ?? ""}
                        onChange={(e) => handleChange(e, idx)}
                        onKeyDown={(e) => handleKey(e, idx)}
                        onPaste={handlePaste}
                        className={`
                            w-11 h-13 text-center text-xl font-semibold rounded-xl border-2 outline-none
                            transition-all duration-200 bg-amber-50/60 text-zinc-800
                            ${value[idx]
                                ? "border-amber-500 shadow-[0_0_0_3px_rgba(245,158,11,0.15)]"
                                : "border-stone-200 focus:border-amber-400 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.12)]"
                            }
                        `}
                    />
                </motion.div>
            ))}
        </div>
    );
}

type InputMode = "email" | "phone";

export default function LoginModal({ isOpen, onClose, currentStep, changeStep }: Props) {
    const [inputMode, setInputMode] = useState<InputMode>("email");
    const [contact, setContact] = useState("");
    const [otp, setOtp] = useState("");
    const [resendCount, setResendCount] = useState(0);
    const { login, user } = useAuth()
    const router = useRouter()

    const maskedContact = contact.length > 4
        ? inputMode === "email"
            ? contact.replace(/(.{2}).+(@.+)/, "$1••••$2")
            : contact.slice(0, 3) + "•••" + contact.slice(-3)
        : contact;


    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            return (
                await axios.post("https://www.gangapapers.in/novasac/api/customer/login", { contact })
            )
        },
        onSuccess: async (val) => {
            toast.success(val.data.message);
            console.log(val.data);
            changeStep("otp");
        },
        onError: (err: AxiosError<{ error: string }>) =>
            toast.error(err.response?.data?.error || "Failed"),
    })
    const { mutate: resendMutate, isPending: resendPending } = useMutation({
        mutationFn: async () => {
            return (
                await axios.post("https://www.gangapapers.in/novasac/api/customer/resend-otp", { contact })
            )
        },
        onSuccess: async (val) => {
            toast.success(val.data.message);
        },
        onError: (err: AxiosError<{ error: string }>) =>
            toast.error(err.response?.data?.error || "Failed"),
    })
    const { mutate: verifyOtp, isPending: pendingOtp } = useMutation({
        mutationFn: async () => {
            return (
                await axios.post("https://www.gangapapers.in/novasac/api/customer/verify-otp", {
                    contact, otp
                })
            )
        },
        onSuccess: async (val) => {
            const data = val.data.data
            login(data)
            toast.success(val.data.message);
            setContact("");
            setOtp("");
            changeStep("login");
            router.refresh()
            onClose();
        },
        onError: (err: AxiosError<{ error: string }>) =>
            toast.error(err.response?.data?.error || "Failed"),
    })
    const { mutate: googleLoginMutate, isPending: googlePending } = useMutation({
        mutationFn: async (google_id_token: string) => {
            return await axios.post(
                "https://www.gangapapers.in/novasac/api/customer/google-login",
                { google_id_token }
            );
        },
        onSuccess: async (val) => {
            const data = val.data.data;
            login(data);
            // console.log(data);
            toast.success(val.data.message);
            setContact("");
            setOtp("");
            changeStep("login");
            router.refresh();
            onClose();
        },
        onError: (err: AxiosError<{ error: string }>) => {
            // console.log(err.response?.data);
            toast.error(err.response?.data?.error || "Google login failed")
        }
    });

    const handleSendOtp = () => {
        if (!contact.trim()) return;
        mutate();
    };

    const handleResend = () => {
        if (!contact.trim()) return;
        resendMutate()
    }

    const handleVerify = () => {
        if (otp.length !== OTP_LENGTH) return;
        verifyOtp()
    };

    const spring = { type: "spring" as const, stiffness: 260, damping: 22 };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
                >
                    <motion.div
                        key="card"
                        initial={{ opacity: 0, scale: 0.94, y: 32, filter: "blur(6px)" }}
                        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.94, y: 32, filter: "blur(6px)" }}
                        transition={spring}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md rounded-3xl overflow-hidden bg-white shadow-2xl shadow-stone-300/60 border border-stone-100"
                    >
                        <div className="h-1 w-full bg-linear-to-r from-amber-400 via-orange-400 to-rose-400" />

                        <div className="p-7">
                            <div className="flex items-start justify-between mb-8">
                                <Image
                                    src="/images/logo/logo-b.svg"
                                    width={150}
                                    height={64}
                                    alt="Wooden Souvenir"
                                    className="w-24 h-auto"
                                />
                                <button
                                    onClick={onClose}
                                    className="
                                        size-8 flex items-center justify-center rounded-full
                                        bg-stone-100 border border-stone-200 text-stone-500
                                        hover:bg-stone-200 hover:text-stone-700
                                        transition-all duration-150 cursor-pointer
                                    "
                                    aria-label="Close"
                                >
                                    <X size={15} />
                                </button>
                            </div>

                            <AnimatePresence mode="wait">

                                {currentStep === "login" && (
                                    <motion.div
                                        key="login"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={spring}
                                    >
                                        <h2 className="text-center text-2xl font-bold text-zinc-800 tracking-tight">Welcome back</h2>
                                        <p className="text-center text-sm text-stone-400 mt-1 mb-7">
                                            Sign in to your account to continue
                                        </p>

                                        {/* <GoogleLogin
                                            onSuccess={
                                                (credentialResponse) => {
                                                    googleLoginMutate(credentialResponse.credential ?? "");
                                                }}
                                            onError={() => {
                                                console.log('Login Failed');
                                            }}
                                            useOneTap
                                            auto_select
                                        /> */}

                                        {/* Divider */}
                                        <div className="flex items-center gap-3 my-5">
                                            <div className="flex-1 h-px bg-stone-100" />
                                            <span className="text-xs text-stone-400 font-medium">use email / phone</span>
                                            <div className="flex-1 h-px bg-stone-100" />
                                        </div>

                                        <div className="flex bg-stone-100 rounded-xl p-1 mb-4">
                                            {(["email", "phone"] as InputMode[]).map((mode) => (
                                                <button
                                                    key={mode}
                                                    onClick={() => { setInputMode(mode); setContact(""); }}
                                                    className={`
                                                        flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                                                        text-xs font-semibold transition-all duration-200 cursor-pointer
                                                        ${inputMode === mode
                                                            ? "bg-white text-zinc-800 shadow-sm"
                                                            : "text-stone-400 hover:text-stone-600"
                                                        }
                                                    `}
                                                >
                                                    {mode === "email" ? <Mail size={13} /> : <Phone size={13} />}
                                                    {mode === "email" ? "Email" : "Phone"}
                                                </button>
                                            ))}
                                        </div>

                                        <div className="relative">
                                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
                                                {inputMode === "email" ? <Mail size={16} /> : <Phone size={16} />}
                                            </div>
                                            <input
                                                type={inputMode === "email" ? "email" : "tel"}
                                                placeholder={inputMode === "email" ? "you@example.com" : "+91 98765 43210"}
                                                value={contact}
                                                onChange={(e) => setContact(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                                                className="
                                                    w-full pl-10 pr-4 py-3 rounded-2xl border-2 border-stone-200
                                                    bg-amber-50/40 text-sm text-zinc-800 placeholder:text-stone-400
                                                    outline-none focus:border-amber-400
                                                    focus:shadow-[0_0_0_4px_rgba(245,158,11,0.1)]
                                                    transition-all duration-200
                                                "
                                            />
                                        </div>

                                        <button
                                            onClick={handleSendOtp}
                                            disabled={!contact.trim()}
                                            className="
                                                mt-4 w-full flex items-center justify-center gap-2
                                                py-3 px-5 rounded-2xl font-semibold text-sm text-white
                                                bg-linear-to-r from-amber-500 to-orange-500
                                                hover:from-amber-400 hover:to-orange-400
                                                disabled:opacity-40 disabled:cursor-not-allowed
                                                active:scale-[0.98] shadow-md shadow-amber-200
                                                transition-all duration-150 cursor-pointer
                                            "
                                        >
                                            {isPending ? <div className="w-4 h-4 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" /> :
                                                <>
                                                    Send OTP
                                                    <ArrowRight size={15} />
                                                </>

                                            }
                                        </button>

                                        <p className="text-center text-xs text-stone-400 mt-5 leading-relaxed">
                                            By continuing you agree to our{" "}
                                            <a href="/terms" className="text-amber-600 hover:underline">Terms</a>
                                            {" & "}
                                            <a href="/privacy" className="text-amber-600 hover:underline">Privacy Policy</a>
                                        </p>
                                    </motion.div>
                                )}

                                {currentStep === "otp" && (
                                    <motion.div
                                        key="otp"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={spring}
                                    >
                                        {/* Icon */}
                                        <div className="size-12 rounded-2xl bg-amber-100 flex items-center justify-center mb-5">
                                            <ShieldCheck className="text-amber-600" size={22} />
                                        </div>

                                        <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">Verify it's you</h2>
                                        <p className="text-sm text-stone-400 mt-1 mb-7">
                                            We sent a 6-digit code to{" "}
                                            <span className="text-zinc-600 font-medium">{maskedContact || "your contact"}</span>
                                        </p>

                                        <OtpInput value={otp} onChange={setOtp} />

                                        {/* Verify CTA */}
                                        <button
                                            onClick={handleVerify}
                                            disabled={otp.length !== OTP_LENGTH || pendingOtp || resendPending}
                                            className="
                                                mt-6 w-full flex items-center justify-center gap-2
                                                py-3 px-5 rounded-2xl font-semibold text-sm text-white
                                                bg-linear-to-r from-amber-500 to-orange-500
                                                hover:from-amber-400 hover:to-orange-400
                                                disabled:opacity-40 disabled:cursor-not-allowed
                                                active:scale-[0.98] shadow-md shadow-amber-200
                                                transition-all duration-150 cursor-pointer
                                            "
                                        >
                                            {pendingOtp || resendPending ? <div className="w-4 h-4 border-2 border-stone-200 border-t-stone-500 rounded-full animate-spin" /> : <>
                                                Verify & Sign In
                                                <ArrowRight size={15} />
                                            </>
                                            }
                                        </button>

                                        <div className="flex items-center justify-between mt-5">
                                            <button
                                                onClick={() => { changeStep("login"); setOtp(""); }}
                                                className="text-xs text-stone-400 hover:text-zinc-600 transition-colors cursor-pointer"
                                            >
                                                ← Change contact
                                            </button>
                                            <button
                                                onClick={handleResend}
                                                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors cursor-pointer"
                                            >
                                                <RotateCcw size={11} />
                                                Resend OTP{resendCount > 0 ? ` (${resendCount})` : ""}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                            </AnimatePresence>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

