import { Database } from "@/types/supabase";
import { BusinessTypeData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Filter } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";
import { useQuery } from "react-query";

interface BusinessTypeFilterProps {
    city: string | null;
}

export const BusinessFilter = ({ city }: BusinessTypeFilterProps) => {
    const supabase = createClientComponentClient<Database>();
    const [businessType, setBusinessType] = useState<BusinessTypeData[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const toggleFilters = () => setShowFilters(!showFilters);

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

    return (
        <div className="relative flex flex-col gap-8 mt-24 text-black/70 max-w-[1200px] w-full m-auto max-lg:text-lg">
            {showFilters === false && (
                <button className="px-4 py-2 flex gap-2 border-[1px] rounded-md w-fit" onClick={toggleFilters}>
                    <Filter /> <p>Filters</p>
                </button>
            ) || (
                    <button className="px-4 py-2 flex gap-2 border-[1px] bg-violet-500 text-white rounded-md w-fit" onClick={toggleFilters}>
                        <Filter /> <p>Filters</p>
                    </button>
                )}

            <div className="flex flex-wrap">
                {showFilters && (
                    businessType.map((type) => (
                        <Link href={`/business-browse-page/${type.id}?city=${city}`} key={type.id}>
                            <button className="px-4 py-2 hover:border-[1px] hover:border-violet-500 hover:text-black transition w-fit rounded-md">
                                {type["business-type"]}
                            </button>
                        </Link>
                    ))
                )}
            </div>
        </div>
    )
}