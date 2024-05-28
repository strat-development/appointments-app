

import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export const FavouriteBusinessesSection = () => {
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);

    const { data: favouriteBusinesses, isLoading } = useQuery(
        ['favourite-businesses', userId],
        async () => {
            const { data, error } = await supabase
                .from('favourite-businesses')
                .select('*')
                .eq('user_id', userId)

            if (error) {
                throw error;
            }

            return data;
        }
    )

    const { data: images } = useQuery<Images[]>(
        ['business-images'],
        async () => {
            const id = favouriteBusinesses?.map((business) => business.business_id);

            console.log(id);

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
            enabled: !!favouriteBusinesses
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
                <h1 className="text-xl font-medium tracking-wide text-black/70">Favourite Businesses</h1>
                {favouriteBusinesses?.map((business) => {
                    const businessUrl = imageUrls.find((image) => image.businessId === business.business_id)?.publicUrl;
                    return (
                        <div className="flex gap-4 h-[250px] w-[350px]" key={business.business_id}>
                            {businessUrl ? <Image className="rounded-xl object-cover" src={businessUrl as string} alt="" width={2000} height={1000} /> : <p>No image available</p>}
                            {/* <div className="flex flex-col gap-4">
                                <h2>{business.business_name}</h2>
                                <p>{business.business_description}</p>
                            </div> */}
                        </div>
                    );
                })}
            </div>
        </>
    )
}