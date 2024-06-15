"use client"

import { useModal } from "@/hooks/useModal";
import { useUserContext } from "@/providers/userContextProvider";
import { AuthModal } from "../../features/auth-modal/AuthModal";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ContactForm } from "../ContactForm";
import { useState } from "react";

export const NavComponent = () => {
    const authModal = useModal();
    const { userRole, clearUserRole } = useUserContext();
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <ContactForm isOpen={isModalOpen}
                onClose={closeModal}
            />
            <header className="border-b-[1px] w-full z-[222222222] backdrop-blur-xl max-lg:px-8 max-[1200px]:px-8 max-[480px]:px-4 bg-white">
                <nav className="m-auto flex items-center justify-between py-4 max-w-[1200px]">
                    <Link href="/" className="text-3xl font-sans font-semibold text-[#1b0b3b] m-0 max-lg:text-2xl">
                        <Image src="/Visio_logo.svg" width={100} height={100} alt="logo" />
                    </Link>
                    <div className="flex gap-16 text-black/70">
                        <Link href="/">
                            About
                        </Link>
                        <button onClick={() => setIsModalOpen(true)}>
                            Contact
                        </button>
                        <Link href={`/business-browse-page/${"all"}`}>
                            Businesess
                        </Link>
                        <Link className="font-semibold"
                            href="/business-landing">
                            <p>
                                Visio <span className="bg-gradient-to-br from-[#FF1B6B] to-[#8390CE] bg-clip-text text-transparent">PRO</span>
                            </p>
                        </Link>
                    </div>
                    {!userRole && (
                        <>
                            <div className="flex gap-4">
                                <button onClick={authModal.onOpen}
                                    className="flex rounded-xl text-black/70 border-[1px] font-medium border-black/20 items-center justify-center px-8 py-2 hover:scale-95 duration-300 max-lg:text-sm max-lg:py-1 max-sm:hidden">
                                    Login
                                </button>
                                <button onClick={authModal.onOpen}
                                    className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                                    Register
                                </button>
                            </div>
                        </>
                    )}
                    {userRole && (
                        <>
                            <div className="flex gap-4">
                                <Link href="/dashboard/schedule"
                                    className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                                    Dashboard
                                </Link>
                                <button className="flex rounded-xl text-black/70 border-[1px] font-medium border-black/20 items-center justify-center px-8 py-2 hover:scale-95 duration-300 max-lg:text-sm max-lg:py-1 max-sm:hidden"
                                    onClick={async () => {
                                        await supabase.auth.signOut();
                                        router.refresh()

                                        clearUserRole();
                                    }}>
                                    Logout
                                </button>
                            </div>
                        </>
                    )}
                    <AuthModal />
                </nav>
            </header>
        </>
    );
};