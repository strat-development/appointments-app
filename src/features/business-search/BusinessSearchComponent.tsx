import { Database } from "@/types/supabase";
import { BusinessTypeData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "react-query";
import Fuse from "fuse.js";
import { Star1 } from "iconsax-react";

interface BusinessSearchComponentProps {
    city: string | null;
}

export const BusinessSearchComponent = ({ city }: BusinessSearchComponentProps) => {
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
            router.push(`/business-browse-page/${bestMatch.id}?city=${city}`);
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
        <div className="items-end gap-4 relative self-center w-fit max-[1024px]:mt-16 max-[1024px]:items-between max-[400px]:max-w-[380px] max-[1024px]:flex-col">
            <div className="flex flex-col gap-8 w-full">
                <label className="w-[350px] text-black/70 text-xl font-bold tracking-wide max-[1024px]:text-center max-[1024px]:text-2xl max-[1024px]:w-[400px] max-[1024px]:font-bold max-[580px]:text-xl max-[400px]:max-w-[320px]"
                    htmlFor="search">
                    Search for the best businesses and services in your area
                </label>
                <div className="flex gap-4 max-[1024px]:items-center">
                    <input className="border-[1px] px-4 py-2 max-[1024px]:max-w-[500px] max-[1024px]:p-4 rounded-xl outline-none max-md:w-full max-[1024px]:w-full max-[400px]:w-[250px]"
                        id="search"
                        onChange={(e) => handleInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        type="text" placeholder="Search for a business or service" />
                    <button className="bg-gradient-to-b from-violet-600 to-violet-500 text-white py-2 px-4 max-[1024px]:p-4 rounded-xl"
                        onClick={handleSearch}>Search</button>
                </div>
            </div>
            {suggestions.length > 0 && (
                <div className="suggestions absolute top-32 p-4 flex flex-col max-h-[350px] w-[350px] overflow-auto border-[1px] rounded-xl bg-white">
                    {suggestions.map((suggestion, index) => (
                        <Link href={`/business-browse-page/${suggestion.id}?city=${city}`}
                            key={suggestion.id}>
                            <div key={index}
                                className="flex gap-2 p-2 border-b-[1px] rounded-md hover:bg-black/5 transition duration-300">
                                <Star1 />
                                <p key={suggestion.id}>
                                    {suggestion['business-type']}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    )
}