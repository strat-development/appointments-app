import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useQuery } from "react-query";
import { UploadImagesButton } from "./UploadImagesButton";
import { useEffect, useState } from "react";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { DeleteImagesModal } from "./DeleteImagesModal";
import { useUserContext } from "@/providers/userContextProvider";
import { BusinessSlugIdProps, Images } from "@/types/types";

export const BusinessImages = ({ businessSlugId }: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ publicUrl: string }[]>([]);
    const { userRole } = useUserContext();

    const { data: images, isLoading } = useQuery<Images[]>(
        ['business-images', businessSlugId],
        async () => {
            const id = businessSlugId;
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
            enabled: !!businessSlugId
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
            <div className="flex flex-col gap-32">
                <div>
                    <div className="max-w-[800px] rounded-2xl relative z-10">
                        <Swiper className='h-[500px] rounded-2xl relative z-10'
                            spaceBetween={0}
                            slidesPerView={1}
                            autoplay={
                                {
                                    delay: 100,
                                    disableOnInteraction: false
                                }

                            }>
                            {imageUrls.map((image, index) => (
                                <SwiperSlide key={index}>
                                    <Image src={image.publicUrl} alt="Business image" fill={true} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    {userRole === 'Employer' && (
                        <>
                            <UploadImagesButton />
                            <DeleteImagesModal />
                        </>
                    )}
                </div>
            </div>
        </>
    );
}