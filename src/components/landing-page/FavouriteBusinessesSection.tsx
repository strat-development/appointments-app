import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
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

    const { data: businessData } = useQuery(
        ['businesses'],
        async () => {
            const id = favouriteBusinesses?.map((business) => business.business_id);

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
            <div className="flex flex-col gap-4 self-center max-[1024px]:w-fit overflow-hidden">
                <h1 className="text-xl font-medium tracking-wide text-black/70">Favourite businesses</h1>
                <div className="flex gap-4 rounded-lg overflow-x-scroll overflow-hidden w-[700px] pb-4 max-md:max-w-[500px] max-[520px]:w-[348px]">
                    {favouriteBusinesses?.map((business) => {
                        const businessUrl = imageUrls.find((image) => image.businessId === business.business_id)?.publicUrl;
                        return (
                            <Link key={business.business_id} href={`/business-page/${business.business_id}`}>
                                <div className="flex flex-col gap-4 w-[350px] bg-white p-4 rounded-xl shadow-md">
                                    {businessUrl ?
                                        <Image className="rounded-xl object-cover h-[250px] w-full" src={businessUrl as string} alt="" width={2000} height={1000} />
                                        :
                                        <div className="h-[250px] w-full border-[1px] flex items-center justify-center rounded-lg bg-black/10">
                                            <p className="text-xl text-black/70 font-semibold">No image available 😔</p>
                                        </div>
                                    }
                                    <div className="flex flex-col gap-2">
                                        <h2 className="text-lg font-bold">{businessData?.find((data) => data.id === business.business_id)?.business_name}</h2>
                                        <p className="text-black/70">{businessData?.find((data) => data.id === business.business_id)?.business_address}</p>
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