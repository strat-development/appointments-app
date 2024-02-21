import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useQuery } from "react-query";
import { UploadImagesButton } from "./UploadImagesButton";
import { useEffect, useState } from "react";
import { supabaseAdmin } from "@/libs/admin";

type Images = Database['public']['Tables']['business-images']['Row'];

export const ImagesCarousel = () => {
    const supabase = createClientComponentClient<Database>();
    const businessName = "Visio";
    const [imageUrls, setImageUrls] = useState<{ publicUrl: string }[]>([]);

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

                console.log(publicURL);
                return { publicUrl: publicURL.publicUrl };

            }))
                .then((publicUrls) => setImageUrls(publicUrls))
                .catch(console.error);
        }
    }, [images]);

    console.log(imageUrls);

    return (
        <div>
                {imageUrls.map((url, index) => (
                    <Image
                        key={index}
                        src={url.publicUrl}
                        alt={`business image ${index}`}
                        width={500}
                        height={500}
                    />
                ))}
            <UploadImagesButton />
        </div>
    );
}