import { Database } from "@/types/supabase";
import { BusinessTypeData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

export const BusinessTypeFilter = () => {
    const supabase = createClientComponentClient<Database>();
    const [businessType, setBusinessType] = useState<BusinessTypeData[]>([]);

    const { data: businessTypeData, isLoading, isError } = useQuery(
        ['businessTypeData'],
        async () => {
            const { data, error, status } = await supabase
                .from("business-types")
                .select("*")

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                setBusinessType(data as BusinessTypeData[]);
            }
        },
    );

    console.log(businessType)

    return (
        <div className="relative flex justify-between text-black/70 self-center w-full p-4 gap-4 rounded-md overflow-auto">
            {businessType.map((type) => (
                <Link className="hover:text-black transition w-fit" 
                href={`/business-browse-page/${type.id}`} key={type.id}>
                    <p>{type["business-type"]}</p>
                </Link>
            ))}
        </div>
    )
}