import { Database } from "@/types/supabase";
import { BusinessTypeData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";
import Fuse from "fuse.js";
import { h } from "@fullcalendar/core/preact.js";

export const BusinessSearchComponent = () => {
    const supabase = createClientComponentClient<Database>();
    const [searchPrompt, setSearchPrompt] = useState<string>("");
    const [businessType, setBusinessType] = useState<BusinessTypeData[]>([]);
    const [suggestions, setSuggestions] = useState<BusinessTypeData[]>([]);
    const router = useRouter();
    const options = {
        keys: ['business-type'],
        includeScore: true,
        threshold: 0.3
    }
    const fuse = new Fuse(businessType, options);

    const handleInput = (query: string) => {
        setSearchPrompt(query);
        const result = fuse.search(query);
        setSuggestions(result.map(({ item }) => item));
    };

    const handleSearch = () => {
        const result = fuse.search(searchPrompt);
        if (result.length > 0) {
            const bestMatch = result[0].item;
            router.push(`/business-browse-page/${bestMatch.id}`);
        }
    };



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
        <div className="flex flex-col items-start gap-4 relative top-36 w-fit">
            <div className="flex items-center gap-4">
                <input className="border-[1px] p-2 rounded-full"
                    onChange={(e) => handleInput(e.target.value)}
                    type="text" placeholder="Search for a business" />
                <button onClick={handleSearch}>Search</button>
            </div>
            <div className="suggestions">
                {suggestions.map((suggestion) => (
                    <Link href={`/business-browse-page/${suggestion.id}`} key={suggestion.id}>
                        {suggestion['business-type']}
                    </Link>
                ))}
            </div>
            <div className="border-[1px] w-full p-4 flex flex-wrap gap-4 rounded-md">
                {businessType.map((type) => (
                    <Link href={`/business-browse-page/${type.id}`} key={type.id}>
                        <p>{type["business-type"]}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}