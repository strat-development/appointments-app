"use client"

import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

type BusinessInfo = Database["public"]["Tables"]["business-info"]["Row"];

export default function BusinessPagesBrowser() {
    const queryClient = useQueryClient();
    const supabase = createClientComponentClient<Database>();
    const [businessPages, setBusinessPages] = useState<BusinessInfo[]>([]);

    const { data: businessPagesData, isLoading, isError } = useQuery(
        ['businessPages'],
        async () => {
            const { data, error, status } = await supabase
                .from("business-info")
                .select("*")

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setBusinessPages(data);
                queryClient.invalidateQueries(['businessPages']);
            }
        },
    );

    return (
        <div>
            {businessPages.map((businessPage) => (
                <Link href={`/business-page/${businessPage.business_name}`}>
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
    )
}