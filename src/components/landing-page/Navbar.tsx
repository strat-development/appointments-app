"use client"

import { useModal } from "@/hooks/useModal";
import { useUserContext } from "@/providers/userContextProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AuthModal } from "../../features/auth-modal/AuthModal";
import Link from "next/link";

export const Navbar = () => {
    const authModal = useModal();
    const { userRole } = useUserContext();

    return (
        <header className="fixed border-b bg-violet-50 w-full z-[22222222222] backdrop-blur-xl max-lg:px-8 max-[1200px]:px-8 max-[480px]:px-4">
            <nav className="m-auto flex items-center justify-between py-4 max-w-[1200px]">
                <h1 className="text-3xl font-sans font-semibold text-[#1b0b3b] m-0 max-lg:text-2xl">Visio</h1>
                {!userRole && (
                    <div className="flex gap-4">
                        <button onClick={authModal.onOpen}
                            className="flex rounded-full text-violet-600 border-2 font-medium border-violet-600 items-center justify-center px-8 py-2 hover:scale-95 duration-300 max-lg:text-sm max-lg:py-1 max-sm:hidden">
                            Login
                        </button>
                        <button onClick={authModal.onOpen}
                            className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-full font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                            Register
                        </button>
                    </div>
                )}
                {userRole && (
                    <Link href="/dashboard/schedule" className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-full font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                        Dashboard
                    </Link>
                )}
                <AuthModal />
            </nav>
        </header>
    );
};