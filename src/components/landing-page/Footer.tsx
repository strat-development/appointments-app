"use client"

import { ArchiveTick, Box2, Briefcase, Calendar, Call, Grid3, Instagram, MessageQuestion, Notification, ShieldSecurity, Star } from "iconsax-react"
import Image from "next/image"
import { ContactForm } from "../ContactForm"
import { useState } from "react";
import Link from "next/link";

export const Footer = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <footer className="w-full border-t-[1px] mt-36 mb-8">
                <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-12 mt-8">
                    <Image src="/Visio_logo.svg" width={75} height={75} alt="logo" />
                    <div className="flex justify-between">
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-2 items-center">
                                    <Star className="text-[#5100D6]" size="24" />
                                    <h4 className="text-lg font-semibold text-black/70">Functionality</h4>
                                </div>
                                <ul className="flex flex-col gap-4">
                                    <Link href="/schedule-features">
                                        <li className="flex gap-2 items-center">
                                            <Calendar className="text-[#5100D6]" size="18" />
                                            <p className="text-black/70 text-sm">Schedule</p>
                                        </li>
                                    </Link>
                                    <Link href="/notifications-features">
                                        <li className="flex gap-2 items-center">
                                            <Notification className="text-[#5100D6]" size="18" />
                                            <p className="text-black/70 text-sm">Notifications</p>
                                        </li>
                                    </Link>
                                    <Link href="/business-page-features">
                                        <li className="flex gap-2 items-center">
                                            <ArchiveTick className="text-[#5100D6]" size="18" />
                                            <p className="text-black/70 text-sm">On-line appointments</p>
                                        </li>
                                    </Link>
                                    <Link href="/positions-features">
                                        <li className="flex gap-2 items-center">
                                            <Briefcase className="text-[#5100D6]" size="18" />
                                            <p className="text-black/70 text-sm">Business management</p>
                                        </li>
                                    </Link>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-2 items-center">
                                    <Grid3 className="text-[#5100D6]" size="24" />
                                    <h4 className="text-lg font-semibold text-black/70">Product</h4>
                                </div>
                                <ul className="flex flex-col gap-4">
                                    <Link href="/business-landing/#FAQ">
                                        <li className="flex gap-2 items-center">
                                            <MessageQuestion className="text-[#5100D6]" size="18" />
                                            <p className="text-black/70 text-sm">FAQ</p>
                                        </li>
                                    </Link>
                                    <li className="flex gap-2 items-center">
                                        <Call className="text-[#5100D6]" size="18" />
                                        <button onClick={() => setIsModalOpen(true)}
                                            className="text-black/70 text-sm">Contact</button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="flex flex-col gap-8">
                                <div className="flex gap-2 items-center">
                                    <Box2 className="text-[#5100D6]" size="24" />
                                    <h4 className="text-lg font-semibold text-black/70">Other</h4>
                                </div>
                                <ul className="flex flex-col gap-4">
                                    <li className="flex gap-2 items-center">
                                        <ShieldSecurity className="text-[#5100D6]" size="18" />
                                        <p className="text-black/70 text-sm">Privacy policy</p>
                                    </li>
                                    <li className="flex gap-2 items-center">
                                        <Instagram className="text-[#5100D6]" size="18" />
                                        <p className="text-black/70 text-sm">Instagram</p>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <Image src="/business-page-images/APPSTORE.svg" width={124} height={150} alt="App Store" />
                        <Image src="/business-page-images/GOOGLEPLAY.svg" width={124} height={150} alt="Google Play" />
                    </div>
                </div>
            </footer>
            <ContactForm isOpen={isModalOpen}
                onClose={closeModal}
            />
        </>
    )
}