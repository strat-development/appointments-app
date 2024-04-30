"use client"

import { Navbar } from "@/components/landing-page/Navbar";
import { Database } from "@/types/supabase";
import { BusinessData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

export default function BusinessPagesBrowser({
    params
}: {
    params: {
        slug: string
    }
}) {
    const supabase = createClientComponentClient<Database>();
    const [businessPages, setBusinessPages] = useState<BusinessData[]>([]);


    const { data: businessPagesData, isLoading, isError } = useQuery(
        ['businessPages'],
        async () => {
            const { data, error, status } = await supabase
                .from("business-type-info-linker")
                .select(`
                    business-info (
                        business_name,
                        business_address,
                        id
                    )
                `)
                .eq("business_type_id", params.slug)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                const mappedData = data.map((item: any) => item['business-info']);
                setBusinessPages(mappedData as BusinessData[]);
            }
        }
    );

    return (
        <>
            <Navbar />
            <div className="relative top-24">
                {businessPages.map((businessPage) => (
                    <Link href={`/business-page/${businessPage.id}`}>
                        <div className="border-[.5px] rounded-2xl p-4 flex justify-between"
                            key={businessPage.id}>
                            <div className="flex flex-col gap-2">
                                <h2>{businessPage.business_name}</h2>
                                <div className="flex gap-4">
                                    <p>{businessPage.business_name}</p>
                                    <p>{businessPage.business_address}</p>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}