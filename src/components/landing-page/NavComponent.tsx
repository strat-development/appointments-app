"use client"

import { useModal } from "@/hooks/useModal";
import { useUserContext } from "@/providers/userContextProvider";
import { AuthModal } from "../../features/auth-modal/AuthModal";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { CloseCircle, Menu } from "iconsax-react";
import { useCityContext } from "@/providers/cityContextProvider";

export const NavComponent = () => {
    const authModal = useModal();
    const { userRole, clearUserRole } = useUserContext();
    const supabase = createClientComponentClient<Database>();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const router = useRouter();
    const { city } = useCityContext();

    return (
        <>
            <header className="border-b-[1px] w-full z-[222222222] backdrop-blur-xl max-lg:px-8 max-[1200px]:px-8 max-[480px]:px-4 bg-white">
                <nav className="m-auto flex items-center justify-between py-4 max-w-[1200px]">
                    <Link href="/">
                        <Image className="max-[480px]:w-[72px]"
                            src="/Visio_logo.svg" width={100} height={100} alt="logo" />
                    </Link>
                    <div className="flex gap-16 text-black/70 max-[1024px]:hidden">
                        <Link href="/">
                            About
                        </Link>
                        <Link href={`/business-browse-page/${"all"}?city=${city}`}>
                            Businesess
                        </Link>
                        <Link className="font-semibold"
                            href="/business-landing">
                            <p>
                                Visio <span className="bg-gradient-to-br from-[#FF1B6B] to-[#8390CE] bg-clip-text text-transparent">PRO</span>
                            </p>
                        </Link>
                    </div>


                    {isMenuOpen === false && (
                        <button
                            className="lg:hidden block text-violet-600 p-2 rounded-md"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <Menu />
                        </button>
                    ) || (
                            <button
                                className="lg:hidden block text-violet-600 p-2 rounded-md"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <CloseCircle />
                            </button>
                        )}
                    <div className={`${isMenuOpen ? '-translate-x-0' : 'translate-x-full'} fixed inset-y-0 top-[72px] right-0 w-[348px] h-screen bg-white p-5 transition-transform duration-300 ease-in-out lg:hidden flex flex-col gap-16 max-[480px]:w-full`}>
                        <div className="flex flex-col gap-8">
                            <Link href="/">
                                About
                            </Link>
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
                        <div className="w-full flex flex-col gap-4">
                            {!userRole && (
                                <div className="flex flex-col gap-4 border-t-[1px]">
                                    <button onClick={() => {
                                        authModal.onOpen();
                                        setIsMenuOpen(false);
                                    }}
                                        className="flex rounded-xl text-black/70 border-[1px] font-medium border-black/20 items-center justify-center px-8 py-2 hover:scale-95 duration-300 max-lg:py-4 max-lg:hover:bg-violet-500/20">
                                        Login
                                    </button>
                                    <button onClick={() => {
                                        authModal.onOpen();
                                        setIsMenuOpen(false);
                                    }}
                                        className="bg-gradient-to-b text-center from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:py-4">
                                        Register
                                    </button>
                                </div>
                            ) || (
                                    <>
                                        {userRole === "Client" && (
                                            <Link href="/dashboard/visits"
                                                className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm text-center">
                                                Dashboard
                                            </Link>
                                        ) || (
                                                <Link href="/dashboard/schedule"
                                                    className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm text-center">
                                                    Dashboard
                                                </Link>
                                            )}
                                        <button
                                            onClick={async () => {
                                                await supabase.auth.signOut();
                                                clearUserRole();
                                                router.refresh();
                                                setIsMenuOpen(false);
                                            }}
                                            className="flex rounded-xl text-black/70 border-[1px] font-medium border-black/20 items-center justify-center px-8 py-2 hover:scale-95 duration-300 max-lg:text-sm max-lg:py-1 max-sm:hidden">
                                            Logout
                                        </button>
                                    </>
                                )}
                        </div>
                    </div>

                    {!userRole && (
                        <>
                            <div className="flex gap-4 max-[1024px]:hidden">
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
                            <div className="flex gap-4 max-[1024px]:hidden">
                                {userRole === "Client" && (
                                    <Link href="/dashboard/visits"
                                        className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                                        Dashboard
                                    </Link>
                                ) || (
                                        <Link href="/dashboard/schedule"
                                            className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-xl font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                                            Dashboard
                                        </Link>
                                    )}
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