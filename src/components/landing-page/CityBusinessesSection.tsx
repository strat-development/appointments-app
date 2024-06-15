import { Database } from "@/types/supabase";
import { BusinessData, Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { set } from "date-fns";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface CityBusinessesSectionProps {
    city: string | null;
}

export const CityBusinessesSection = ({ city }: CityBusinessesSectionProps) => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);
    // const [suggestedBusinesses, setSuggestedBusinesses] = useState<BusinessData[]>([]);


    const { data: suggestedBusinesses, isLoading } = useQuery(
        ['business-info', city],
        async () => {
            let countQuery = supabase
                .from('business-info')
                .select('count');

            if (city) {
                countQuery = countQuery.eq('business_city', city);
            }

            const { data: countData, error: countError } = await countQuery as any;

            const count = Number(countData?.[0]?.count) as number;

            if (countError) {
                throw countError;
            }

            if (isNaN(count)) {
                throw new Error('Count is not a number.');
            }

            if (count === null) {
                throw new Error('Count is null.');
            }

            let dataQuery = supabase
                .from('business-info')
                .select('*');

            if (city) {
                dataQuery = dataQuery.eq('business_city', city);
            }

            const { data, error } = await dataQuery;

            if (error) {
                throw error;
            }

            return data;
        }
    );


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
                {
                    city &&
                    <h1 className="text-xl font-medium tracking-wide text-black/70">Suggested businesses in {city}</h1>
                    ||
                    <h1 className="text-xl font-medium tracking-wide text-black/70">Discover new businesses</h1>
                }
                <div className="flex gap-4 ">
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