import { Database } from "@/types/supabase";
import { Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

interface BusinessesInCity {
    city: string | null;
}

export const BusinessesInCity = ({ city }: BusinessesInCity) => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);

    const { data: suggestedBusinesses, isLoading } = useQuery(
        ['random-business-info', city],
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
            <div className="flex flex-col gap-4 self-center w-full overflow-hidden">
                {
                    city &&
                    <h1 className="text-xl font-medium tracking-wide text-black/70">Suggested businesses in {city}</h1>
                    ||
                    <h1 className="text-xl font-medium tracking-wide text-black/70">Discover new businesses</h1>
                }
                <div className="flex gap-4 overflow-x-auto rounded-xl">
                    {suggestedBusinesses?.map((business) => {
                        const businessUrl = imageUrls.find((image) => image.businessId === business.id)?.publicUrl;
                        return (
                            <Link href={`/business-page/${business.id}`} 
                            key={business.id}>
                                <div key={business.id} className="flex flex-col gap-4 min-w-[350px] border-[1px] bg-white p-4 rounded-xl shadow-md">
                                    {imageUrls.find((image) => image.businessId === business.id)?.publicUrl ? (
                                        <Image className="rounded-xl object-cover h-[250px] w-full"
                                            src={businessUrl as string}
                                            alt={business.business_name as string}
                                            width={2000}
                                            height={1000}
                                        />
                                    ) : (
                                        <div className="h-[250px] w-full border-[1px] flex items-center justify-center rounded-lg bg-black/10">
                                            <p className="text-xl text-black/70 font-semibold">No image available 😔</p>
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-lg font-bold">{business.business_name}</h2>
                                        <p className="text-black/70">{business.business_address}</p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </>
    )
}