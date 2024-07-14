"use client"

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { Calendar, ChemicalGlass, Coin1, Heart, LogoutCurve, Note, People, Profile2User, Setting, Settings, Shop, StatusUp } from 'iconsax-react';
import { useUserContext } from "@/providers/userContextProvider";
import { useEffect, useState } from "react";
import { UserDataModal } from "./UserDataModal";
import { useBusinessContext } from "@/providers/businessContextProvider";
import toast from "react-hot-toast";
import { SettingsModal } from "@/features/dashboard/settings/SettingsModal";

export const Navbar = () => {
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();
    const { userRole, userName, clearUserRole } = useUserContext();
    const { businessId } = useBusinessContext();
    const linkStyle = "p-2 transition rounded-full hover:text-white hover:bg-gradient-to-b hover:from-violet-600 hover:to-violet-500 text-[#404040] flex gap-4 max-[480px]:p-1"
    const activeStyle = "p-2 transition rounded-full text-white bg-gradient-to-b from-violet-600 to-violet-500 flex gap-4 max-[480px]:p-1"
    const currentRoute = usePathname();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const closeModal = () => {
        setIsModalOpen(false);
        setIsSettingsOpen(false);
        router.refresh();
    };

    useEffect(() => {
        if (!userName || userName.length == 0 || !userRole || userRole.length == 0) {
            setIsModalOpen(true);
        }
    })


    const ClientLinks = [
        {
            name: "My visits",
            link: "/dashboard/visits",
            icon: <Note className="max-[480px]:w-[20px]" size="24" />
        },
        {
            name: "Favorites",
            link: "/dashboard/favorites",
            icon: <Heart className="max-[480px]:w-[20px]" size="24" />
        },
    ]

    const AppointmentsLinks = [
        {
            name: "Schedule",
            link: "/dashboard/schedule",
            icon: <Calendar className="max-[480px]:w-[20px]" size="24" />
        },
        {
            name: "Statistics",
            link: "/dashboard/statistics",
            icon: <StatusUp className="max-[480px]:w-[20px]" size="24" />
        },
        {
            name: "Clients",
            link: "/dashboard/clients",
            icon: <Profile2User className="max-[480px]:w-[20px]" size="24" />
        },
    ]

    const ManagamentLinks = [
        {
            name: "Business page",
            link: `/dashboard/${businessId}`,
            icon: <Shop className="max-[480px]:w-[20px]" size="24" />
        },
        {
            name: "Employees",
            link: "/dashboard/employees",
            icon: <People className="max-[480px]:w-[20px]" size="24" />
        },
        {
            name: "Services and prices",
            link: "/dashboard/services",
            icon: <Coin1 className="max-[480px]:w-[20px]" size="24" />
        },
        {
            name: "Positions",
            link: "/dashboard/positions",
            icon: <ChemicalGlass className="max-[480px]:w-[20px]" size="24" />
        }
    ]

    return (
        <>
            <div className="bg-white h-screen z-[2222222] flex flex-col justify-center border-r-[1px] max-[1024px]:h-fit max-[1024px]:fixed max-[1024px]:bottom-0 max-[1024px]:w-full">
                <div className="flex flex-col justify-between items-start h-[80vh] w-[300px] px-8 max-[1024px]:flex-row max-[1024px]:h-fit max-[1024px]:px-6 max-[1024px]:py-4 max-[1024px]:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] max-[1024px]:w-screen max-[320px]:px-2">
                    <div className="flex flex-col gap-8 max-[1024px]:justify-between max-[1024px]:w-full">
                        <div className="flex items-center gap-4 max-[1024px]:hidden">
                            <div className="bg-violet-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl uppercase">
                                <p>
                                    {userName?.split(' ').map(name => name.charAt(0)).join('')}
                                </p>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-violet-600 truncate w-32">{userName}</h1>
                                <p className="text-base font-semibold text-black/70">{userRole}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 max-[1024px]:flex-row max-[1024px]:w-full max-[1024px]:justify-between max-[1024px]:gap-0">
                            <h3 className="text-xl font-bold max-[1024px]:hidden">Appointments</h3>
                            {(userRole === "Client") && (
                                <>
                                    {ClientLinks.map((link, index) => (
                                        <Link className={currentRoute === link.link ? activeStyle : linkStyle}
                                            href={link.link} key={index}>
                                            {link.icon}
                                            <p className="max-[1024px]:hidden">{link.name}</p>
                                        </Link>
                                    ))}
                                </>
                            )}
                            {(userRole === "Employer" || userRole === "Employee") && (
                                <>
                                    {AppointmentsLinks.map((link, index) => (
                                        <Link className={currentRoute === link.link ? activeStyle : linkStyle}
                                            href={link.link} key={index}>
                                            {link.icon}
                                            <p className="max-[1024px]:hidden">{link.name}</p>
                                        </Link>
                                    ))}
                                </>
                            )}
                            <h3 className="text-xl font-bold max-[1024px]:hidden">Management</h3>
                            {(userRole === "Employer") && (
                                <>
                                    {ManagamentLinks.map((link, index) => (
                                        <Link className={currentRoute === link.link ? activeStyle : linkStyle}
                                            href={link.link} key={index}>
                                            {link.icon}
                                            <p className="max-[1024px]:hidden">{link.name}</p>
                                        </Link>
                                    ))}
                                </>
                            )}
                            <div className="flex flex-col gap-4 self-start">
                                <button className="p-2 transition rounded-full hover:text-white hover:bg-gradient-to-b hover:from-violet-600 hover:to-violet-500 text-[#404040] flex gap-4 max-[480px]:p-1"
                                    onClick={() => {
                                        setIsSettingsOpen(true)
                                    }}>
                                    <Setting className="max-[480px]:w-[20px]" size="24" />
                                    <p className="max-[1024px]:hidden">Settings</p>
                                </button>
                                <button className="p-2 transition rounded-full hover:text-white hover:bg-gradient-to-b hover:from-violet-600 hover:to-violet-500 text-[#404040] flex self-end gap-4 max-[480px]:p-1"
                                    onClick={async () => {
                                        await clearUserRole();
                                        await supabase.auth.signOut();
                                        toast.success('Logged out successfully!')

                                        router.push('/')
                                    }}
                                    type="submit">
                                    <LogoutCurve className="max-[480px]:w-[20px]" size="24" />
                                    <p className="max-[1024px]:hidden">Log out</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <SettingsModal isOpen={isSettingsOpen}
                onClose={closeModal} />


            {(!userName || userName.length == 0) && (
                <UserDataModal isOpen={isModalOpen}
                    onClose={() => closeModal} />
            )}
        </>
    )
}