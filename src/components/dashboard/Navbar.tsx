"use client"


import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import { Calendar, Card, ChemicalGlass, Coin1, LogoutCurve, Note, People, Profile2User, Settings, Shop, StatusUp, Task, UserAdd } from 'iconsax-react';
import { useEffect } from "react";
import { useUserContext } from "@/providers/userContextProvider";

export const Navbar = () => {
    const router = useRouter();
    const supabase = createClientComponentClient<Database>();
    const { userRole, userName, clearUserRole } = useUserContext();
    const linkStyle = "p-2 transition rounded-full hover:text-white hover:bg-gradient-to-b hover:from-violet-600 hover:to-violet-500 text-[#404040] flex gap-4"
    const activeStyle = "p-2 transition rounded-full text-white bg-gradient-to-b from-violet-600 to-violet-500 flex gap-4"
    const currentRoute = usePathname();
    const workerLinks = [
        {
            name: "Schedule",
            link: "/dashboard/schedule",
            icon: <Calendar size="24" />
        },
        {
            name: "Statistics",
            link: "/dashboard/statistics",
            icon: <StatusUp size="24" />
        },
        {
            name: "Clients",
            link: "/dashboard/clients",
            icon: <Profile2User size="24" />
        },
    ]
    const Links = [
        {
            name: "Business page",
            link: "/dashboard/business-page",
            icon: <Shop size="24" />
        },
        {
            name: "Employees",
            link: "/dashboard/employees",
            icon: <People size="24" />
        },
        {
            name: "Services and prices",
            link: "/dashboard/services",
            icon: <Coin1 size="24" />
        },
        {
            name: "Positions",
            link: "/dashboard/positions",
            icon: <ChemicalGlass size="24" />
        },
        {
            name: "Subscription",
            link: "/dashboard/subscription",
            icon: <Card size="24" />
        }
    ]

    useEffect(() => {
        if (!userRole) {
            router.push("/");
        }
    }, [userRole, router])

    return (
        <>
            <div className="bg-white h-screen z-[99999] flex flex-col justify-center border-r-[1px] max-[1024px]:h-fit max-[1024px]:fixed max-[1024px]:bottom-0 max-[1024px]:w-full">
                <div className="flex flex-col justify-between items-start h-[80vh] w-[300px] px-8 max-[1024px]:flex-row max-[1024px]:h-fit max-[1024px]:px-6 max-[1024px]:py-4 max-[1024px]:shadow-[0_0px_10px_0px_rgba(0,0,0,0.1)] max-[1024px]:w-screen max-[320px]:px-2">
                    <div className="flex flex-col gap-8 max-[1024px]:justify-between max-[1024px]:w-full">
                        <div className="flex items-center gap-4 max-[1024px]:hidden">
                            <div className="bg-violet-500 w-12 h-12 rounded-full flex items-center justify-center text-white text-xl uppercase">
                                <p>
                                    {userName.split(' ').map(name => name.charAt(0)).join('')}
                                </p>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-violet-600 truncate w-32">{userName}</h1>
                                <p className="text-base font-semibold text-black/70">{userRole}</p>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4 max-[1024px]:flex-row max-[1024px]:w-full max-[1024px]:justify-between max-[1024px]:gap-0">
                            {workerLinks.map((link, index) => (
                                <Link className={currentRoute === link.link ? activeStyle : linkStyle}
                                    href={link.link} key={index}>
                                    {link.icon}
                                    <p className="max-[1024px]:hidden">{link.name}</p>
                                </Link>
                            ))}
                            {(userRole === "Employer" || userRole === "Employee") && (
                                <>
                                    {Links.map((link, index) => (
                                        <Link className={currentRoute === link.link ? activeStyle : linkStyle}
                                            href={link.link} key={index}>
                                            {link.icon}
                                            <p className="max-[1024px]:hidden">{link.name}</p>
                                        </Link>
                                    ))}
                                </>
                            )}

                            <button className="min-[1024px]:hidden p-2 transition rounded-full hover:text-white hover:bg-gradient-to-b hover:from-violet-600 hover:to-violet-500 text-[#404040] gap-4"
                                onClick={async () => {
                                    await supabase.auth.signOut();
                                    router.push('/')
                                }}
                                type="submit">
                                <LogoutCurve size="24" />
                                <p className="max-[1024px]:hidden">Log out</p>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 self-start">
                        <button className="max-[1024px]:hidden p-2 transition rounded-full hover:text-white hover:bg-gradient-to-b hover:from-violet-600 hover:to-violet-500 text-[#404040] flex self-end gap-4"
                            onClick={async () => {
                                await supabase.auth.signOut();
                                clearUserRole();

                                router.push('/')
                            }}
                            type="submit">
                            <LogoutCurve size="24" />
                            <p className="max-[1024px]:hidden">Log out</p>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}