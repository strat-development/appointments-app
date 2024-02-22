import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useQuery } from "react-query";
import { UploadImagesButton } from "./UploadImagesButton";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/libs/admin";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { BusinessServices } from "./BusinessServices";

type Images = Database['public']['Tables']['business-images']['Row'];
type Business = Database['public']['Tables']['business-info']['Row'];

export const BusinessHero = () => {
    const supabase = createClientComponentClient<Database>();
    const businessName = "Visio";
    const [imageUrls, setImageUrls] = useState<{ publicUrl: string }[]>([]);


    const { data: business } = useQuery<Business>(
        ['business'],
        async () => {
            const { data, error } = await supabase
                .from('business-info')
                .select('*')
                .eq('business_name', businessName);
            if (error) {
                throw error;
            }
            return data?.[0];
        }
    )

    const { data: images } = useQuery<Images[]>(
        ['business-images'],
        async () => {
            const { data, error } = await supabase
                .from('business-images')
                .select('*')
                .eq('business_name', businessName);
            if (error) {
                throw error;
            }
            return data || [];
        }
    );

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image) => {
                const { data: publicURL } = await supabaseAdmin.storage
                    .from('business-page-photos')
                    .getPublicUrl(image.image_url);

                return { publicUrl: publicURL.publicUrl };

            }))
                .then((publicUrls) => setImageUrls(publicUrls))
                .catch(console.error);
        }
    }, [images]);

    return (
        <>
            <div className="flex flex-col gap-4">
                <div>
                    <div className="max-w-[800px] rounded-2xl">
                        <Swiper className='h-[500px] rounded-2xl'
                            spaceBetween={0}
                            slidesPerView={1}>
                            {imageUrls.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Image src={image.publicUrl} alt="Business image" fill={true} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    <UploadImagesButton />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{business?.business_name}</h2>
                    <p className="text-base text-black/70">{business?.business_address}</p>
                </div>
                <BusinessServices />
            </div>
        </>
    );
}