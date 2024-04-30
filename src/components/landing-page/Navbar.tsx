"use client"

import { useModal } from "@/hooks/useModal";
import { useUserContext } from "@/providers/userContextProvider";
import { AuthModal } from "../../features/auth-modal/AuthModal";
import Link from "next/link";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useRouter } from "next/navigation";

export const Navbar = () => {
    const authModal = useModal();
    const { userRole, clearUserRole } = useUserContext();
    const supabase = createClientComponentClient<Database>();
    const router = useRouter();

    return (
        <header className="fixed border-b bg-violet-50 w-full z-[22222222222] backdrop-blur-xl max-lg:px-8 max-[1200px]:px-8 max-[480px]:px-4">
            <nav className="m-auto flex items-center justify-between py-4 max-w-[1200px]">
                <Link href="/" className="text-3xl font-sans font-semibold text-[#1b0b3b] m-0 max-lg:text-2xl">Visio</Link>
                {!userRole && (
                    <>
                        <Link href="/business-browse-page">
                            Businesess
                        </Link>
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
                    </>
                )}
                {userRole && (
                    <>
                        <Link href="/business-browse-page">
                            Businesess
                        </Link>
                        <div className="flex gap-4">
                            <Link href="/dashboard/schedule" className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-8 py-2 rounded-full font-medium hover:scale-95 hover:opacity-80 duration-300 max-lg:text-sm">
                                Dashboard
                            </Link>
                            <button onClick={async () => {
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
        </header >
    );
};