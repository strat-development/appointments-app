import { Modal } from "@/components/Modal";
import { supabaseAdmin } from "@/libs/admin";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { Images } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

export const DeleteImagesModal = () => {
    const supabase = createClientComponentClient<Database>();
    const [imageUrls, setImageUrls] = useState<{ publicUrl: string }[]>([]);
    const { businessId } = useBusinessContext();
    const queryClient = useQueryClient();
    const [selectedImages, setSelectedImages] = useState<string[]>([]);
    const fileNames = selectedImages.map((url) => url.split('/').pop());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleClose = () => {
        setIsModalOpen(false);
    }

    const { data: images } = useQuery<Images[]>(
        ['business-images'],
        async () => {
            const { data, error } = await supabase
                .from('business-images')
                .select('*')
                .eq('business_id', businessId);
            if (error) {
                throw error;
            }
            return data || [];
        }
    );

    const deleteSelectedImagesMutation = useMutation(
        async () => {
            const { data, error } = await supabase
                .from('business-images')
                .delete()
                .in('image_url', fileNames);
            if (error) {
                throw error;
            }
            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('business-images');
            }
        }
    );

    const deleteImaegsFromStorageMutation = useMutation(
        async () => {
            const { data, error } = await supabaseAdmin.storage
                .from('business-page-photos')
                .remove(fileNames as string[]);
            if (error) {
                throw error;
            }
            return data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('business-images');
            }
        }
    );

    useEffect(() => {
        if (images) {
            Promise.all(images.map(async (image) => {
                const { data: publicURL } = await supabaseAdmin.storage
                    .from('business-page-photos')
                    .getPublicUrl(image.image_url)
                return { publicUrl: publicURL.publicUrl };


            }))
                .then((publicUrls) => setImageUrls(publicUrls))
                .catch(console.error);
        }
    }, [images]);

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4 items-start ">
                <div className="grid grid-cols-4 gap-4">
                    {imageUrls.map((image, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <input
                                type="checkbox"
                                value={image.publicUrl}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setSelectedImages(prevSelectedImages => [...prevSelectedImages, image.publicUrl]);
                                    } else {
                                        setSelectedImages(prevSelectedImages => prevSelectedImages.filter((url) => url !== image.publicUrl));
                                    }
                                }}
                            />
                            <Image src={image.publicUrl} width={100} height={100} alt="Business image" className="w-20 h-20" />
                        </div>
                    ))}
                </div>
                <button onClick={() => {
                    deleteSelectedImagesMutation.mutateAsync();
                    deleteImaegsFromStorageMutation.mutateAsync();
                    setIsModalOpen(false);
                }}>
                    Delete selected images
                </button>
            </div>
        </>
    )

    return (
        <>
            <Modal
                isOpen={isModalOpen}
                onClose={handleClose}
                title='Select images to delete'
                body={bodyContent}
            />
            <button onClick={() => setIsModalOpen(true)}>
                Delete images
            </button>
        </>
    )
}