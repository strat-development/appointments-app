"use client"

import { Footer } from "@/components/landing-page/Footer";
import { Navbar } from "@/components/landing-page/Navbar";
import { Database } from "@/types/supabase";
import { BusinessData, Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";

export default function BusinessPagesBrowser({
    params
}: {
    params: {
        slug: string
    }
}) {
    const supabase = createClientComponentClient<Database>();
    const [businessPages, setBusinessPages] = useState<BusinessData[]>([]);
    const [imageUrls, setImageUrls] = useState<{ businessId: string, publicUrl: string }[]>([]);

    const { data: allBusinessPagesData } = useQuery(
        ['businessPages'],
        async () => {
            const { data, error, status } = await supabase
                .from("business-type-info-linker")
                .select(`
                    business-info (
                        business_name,
                        business_address,
                        id
                    )
                `)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                const mappedData = data.map((item: any) => item['business-info']);
                const uniqueData = Array.from(new Set(mappedData.map((item: any) => item.id)))
                    .map(id => {
                        return mappedData.find((item: any) => item.id === id);
                    });
                setBusinessPages(uniqueData as BusinessData[]);
            }
        },
        {
            enabled: params.slug === "all",
        }
    )

    const { data: businessPagesDataNotAll, isLoading: isLoadingNotAll, isError: isErrorNotAll } = useQuery(
        ['businessPagesNotAll'],
        async () => {
            const { data, error, status } = await supabase
                .from("business-type-info-linker")
                .select(`
                    business-info (
                        business_name,
                        business_address,
                        id
                    )
                `)
                .eq('business_type_id', params.slug)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                const mappedData = data.map((item: any) => item['business-info']);
                const uniqueData = Array.from(new Set(mappedData.map((item: any) => item.id)))
                    .map(id => {
                        return mappedData.find((item: any) => item.id === id);
                    });
                setBusinessPages(uniqueData as BusinessData[]);
            }
        },
        {
            enabled: params.slug !== "all",
        }
    );

    const { data: images } = useQuery(
        ['business-images'],
        async () => {
            const { data, error } = await supabase
                .from('business-type-info-linker')
                .select(`
                    business-images (
                        business_id,
                        image_url
                    )
                `)

            if (error) {
                throw error;
            }

            return data || [];
        }
    )

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image: any) => {
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

    console.log(imageUrls);

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-center">
                <div className="relative top-24 grid grid-cols-3 gap-8 max-w-[1200px] w-full mx-auto">
                    {businessPages.map((businessPage) => (
                        <Link key={businessPage.id}
                            href={`/business-page/${businessPage.id}`}>
                            <div className="border-[.5px] rounded-2xl p-4 flex justify-between"
                                key={businessPage.id}>
                                <div className="flex flex-col gap-2">
                                    <div className="max-h-[200px]">
                                        <p>{imageUrls.find((image) => image.businessId === businessPage.id)?.publicUrl || ''}</p>
                                    </div>
                                    <div className="flex gap-4">
                                        <p>{businessPage.business_name}</p>
                                        <p>{businessPage.business_address}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                <Footer />
            </div>
        </>
    )
}