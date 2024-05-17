import { Database } from "@/types/supabase";
import { BusinessTypeData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";
import Fuse from "fuse.js";
import { h } from "@fullcalendar/core/preact.js";
import { Star1 } from "iconsax-react";

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
                setBusinessType(data as BusinessTypeData[]);
            }
        },
    );

    return (
        <div className="flex flex-col items-start gap-4 relative top-36 w-fit">
            <div className="relatve flex items-end gap-4">
                <div className="flex flex-col gap-4">
                    <label className="w-[350px] text-black/70 text-lg tracking-wide"
                        htmlFor="search">
                        Search for the best businesses and services in your area
                    </label>
                    <input className="border-[1px] w-[350px] p-2 rounded-xl outline-none"
                        id="search"
                        onChange={(e) => handleInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        type="text" placeholder="Search for a business or service" />
                </div>
                <button className="bg-gradient-to-b from-violet-600 to-violet-500 text-white px-4 py-2 rounded-xl"
                    onClick={handleSearch}>Search</button>
                {suggestions.length > 0 && (
                    <div className="suggestions absolute top-32 p-4 flex flex-col gap-4 max-h-[350px] w-[350px] overflow-auto border-[1px] rounded-xl bg-white">
                        {suggestions.map((suggestion) => (
                            <div className="flex gap-2 pb-2 border-b-[1px]">
                                <Star1 />
                                <Link href={`/business-browse-page/${suggestion.id}`} key={suggestion.id}>
                                    {suggestion['business-type']}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}