import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useQuery } from "react-query";
import { UploadImagesButton } from "./UploadImagesButton";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/libs/admin";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { DeleteImagesModal } from "./DeleteImagesModal";

type Images = Database['public']['Tables']['business-images']['Row'];

export const BusinessHero = ({ businessSlugId }: { businessSlugId: string }) => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ publicUrl: string }[]>([]);
    const { businessAddress, businessId, businessName } = useBusinessContext();

    console.log(businessSlugId);

    const { data: images, isLoading } = useQuery<Images[]>(
        ['business-images', businessSlugId || businessId],
        async () => {
            const id = businessSlugId || businessId;
            if (!id) {
                return [];
            }
            const { data, error } = await supabase
                .from('business-images')
                .select('*')
                .eq('business_id', id)
            if (error) {
                throw error;
            }
            return data || [];
        },
        {
            enabled: !!businessSlugId || !!businessId
        }
    );

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image) => {
                const { data: publicURL } = await supabase.storage
                    .from('business-page-photos')
                    .getPublicUrl(image.image_url)

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
                    <div className="max-w-[800px] rounded-2xl relative z-10">
                        <Swiper className='h-[500px] rounded-2xl  relative z-10'
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
                    <DeleteImagesModal />
                </div>
                <div>
                    <h2 className="text-xl font-bold">{businessName}</h2>
                    <p className="text-base text-black/70">{businessAddress}</p>
                </div>
            </div>
        </>
    );
}