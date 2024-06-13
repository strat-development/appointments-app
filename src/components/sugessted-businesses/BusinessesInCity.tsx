import { Database } from "@/types/supabase";
import { Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface BusinessesInCity {
    city: string | null;
}

export const BusinessesInCity = ({ city }: BusinessesInCity) => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);

    const { data: suggestedBusinesses, isLoading } = useQuery(
        ['business-info', city],
        async () => {
            const { data, error } = await supabase
                .from('business-info')
                .select('*')
                .eq('business_city', city ?? '')

            if (error) {
                throw error;
            }

            return data;
        }
    )

    const { data: images } = useQuery<Images[]>(
        ['business-images'],
        async () => {
            const id = suggestedBusinesses?.map((business) => business.id);

            if (!id) {
                return [];
            }

            const { data, error } = await supabase
                .from('business-images')
                .select('*')
                .in('business_id', id)

            if (error) {
                throw error;
            }

            return data || [];
        },
        {
            enabled: !!suggestedBusinesses
        }
    )

    const { data: businessData } = useQuery(
        ['businesses'],
        async () => {
            const id = suggestedBusinesses?.map((business) => business.id);

            if (!id) {
                return [];
            }

            const { data, error } = await supabase
                .from('business-info')
                .select('*')
                .in('id', id)

            if (error) {
                throw error;
            }

            return data || [];
        },
        {
            enabled: !!suggestedBusinesses
        }
    )

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image) => {
                const { data: publicURL } = await supabase.storage
                    .from('business-page-photos')
                    .getPublicUrl(image.image_url)

                return { businessId: image.business_id, publicUrl: publicURL.publicUrl };
            }))
                .then((publicUrls) => {
                    const filteredUrls = publicUrls.filter(url => url.businessId !== null);
                    setImageUrls(filteredUrls as { businessId: string, publicUrl: string }[]);
                })
                .catch(console.error);
        }
    }, [images]);

    return (
        <>
            <div className="flex flex-col gap-8 self-center w-full">
                <h1 className="text-xl font-medium tracking-wide text-black/70">Discover Businesses in {city}</h1>
                <div className="flex gap-8">
                    {suggestedBusinesses?.map((business) => {
                        const businessUrl = imageUrls.find((image) => image.businessId === business.id)?.publicUrl;
                        return (
                            <div key={business.id}>
                                {businessUrl ? <Image className="rounded-xl object-cover h-[250px] w-[300px]" src={businessUrl as string} alt="" width={2000} height={1000} /> : <p>No image available</p>}
                                <div className="business-data">
                                    <h2>{business.business_name}</h2>
                                    <p>{business.business_address}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    )
}