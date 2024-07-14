"use client"

import useWeb3forms from "@web3forms/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "./Modal";
import toast from "react-hot-toast";

interface ContactFormProps {
    isOpen: boolean;
    onClose: () => void;
}

export const ContactForm = ({ onClose, isOpen }: ContactFormProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        mode: "onTouched",
    });
    const [isSuccess, setIsSuccess] = useState(false);
    const [message, setMessage] = useState(false);
    const apiKey = process.env.PUBLIC_ACCESS_KEY || process.env.NEXT_PUBLIC_CONTACT_FORM_KEY || "";

    const { submit: onSubmit } = useWeb3forms({
        access_key: apiKey,
        settings: {
            from_name: "Visio Client",
            subject: "New Contact Message from your Website",
        },
        onSuccess: (msg, data) => {
            setIsSuccess(true);
            setMessage(Boolean(msg));
            reset();
            toast.success("Message sent successfully");
            onClose();
        },
        onError: (msg, data) => {
            setIsSuccess(false);
            setMessage(Boolean(msg));
            toast.error("Something went wrong. Please try again.");
        },
    });

    const bodyContent = (
        <>
            <form
                onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="checkbox"
                    id=""
                    className="hidden"
                    style={{ display: "none" }}
                    {...register("botcheck")}></input>

                <div className="mb-5">
                    <input
                        type="text"
                        placeholder="Full Name"
                        autoComplete="false"
                        className={`w-full px-4 py-3 outline-1 outline-black/30 placeholder:text-black/50 text-black/70 rounded-xl outline-none bg-white  ${errors.name
                            ? "border-red-600 focus:border-red-600 ring-red-100 ring-0"
                            : "border-white/10 ring-gray-100 focus:border-white/10 ring-0"
                            } `}
                        {...register("name", {
                            required: "Full name is required",
                            maxLength: 80,
                        })}
                    />
                    {errors.name && (
                        <div className="mt-1 text-red-600">
                            <small>{errors.name.message as any}</small>
                        </div>
                    )}
                </div>

                <div className="mb-5">
                    <label htmlFor="email_address" className="sr-only">
                        Email Address
                    </label>
                    <input
                        id="email_address"
                        type="email"
                        placeholder="Email Address"
                        autoComplete="false"
                        className={`w-full px-4 py-3 outline-1 outline-black/30 placeholder:text-black/50 text-black/70 rounded-xl outline-none bg-white  ${errors.name
                            ? "border-red-600 focus:border-red-600 ring-red-100 ring-0"
                            : "border-white/10 ring-gray-100 focus:border-white/10 ring-0"
                            } `}
                        {...register("email", {
                            required: "Enter your email",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Please enter a valid email",
                            },
                        })}
                    />
                    {errors.email && (
                        <div className="mt-1 text-red-600">
                            <small>{errors.email.message as any}</small>
                        </div>
                    )}
                </div>

                <div className="mb-3">
                    <textarea
                        placeholder="Your Message"
                        className={`max-w-[400px] h-[300px] w-full px-4 py-3 outline-1 outline-black/30 placeholder:text-black/50 text-black/70 rounded-xl outline-none bg-white  ${errors.name
                            ? "border-red-600 focus:border-red-600 ring-red-100 ring-0"
                            : "border-white/10 ring-gray-100 focus:border-white/10 ring-0"
                            } `}
                        {...register("message", {
                            required: "Enter your Message",
                        })}
                    />
                    {errors.message && (
                        <div className="mt-1 text-red-600">
                            {" "}
                            <small>{errors.message.message as any}</small>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    className="bg-gradient-to-b from-violet-600 to-violet-500 text-white text-center w-full py-4 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                    {isSubmitting ? (
                        <svg
                            className="w-5 h-5 mx-auto text-black animate-spin"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        "Send Message"
                    )}
                </button>
            </form>
        </>
    );

    return (
        <>
            <Modal body={bodyContent}
                title="Say hi to our team ;)"
                onClose={onClose}
                isOpen={isOpen}
            />

        </>
    )
}