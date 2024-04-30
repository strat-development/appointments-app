import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

type BusinessTypeData = Database["public"]["Tables"]["business-types"]["Row"]

export const BusinessTypeFilter = () => {
    const supabase = createClientComponentClient<Database>();
    const [businessType, setBusinessType] = useState<BusinessTypeData[]>([]);

    const { data: businessTypeData, isLoading, isError } = useQuery(
        ['businessType'],
        async () => {
            const { data, error, status } = await supabase
                .from("business-types")
                .select("*")

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                console.log(data);
                setBusinessType(data as BusinessTypeData[]);
            }
        },
    );

    return (
        <div className="relative top-36">
            {businessType.map((type) => (
                <Link href={`/business-browse-page/${type.id}`} key={type.id}>
                    <p>{type["business-type"]}</p>
                </Link>
            ))}
        </div>
    )
}