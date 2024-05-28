import { Modal } from "@/components/Modal";
import { socialMedia } from "@/consts/consts";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { SocialMediaTypes } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Facebook, Instagram } from "iconsax-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoLogoTwitter } from "react-icons/io";
import { useMutation, useQueryClient } from "react-query";

interface EditSocialsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Socials = Database["public"]["Tables"]["socials"]["Row"] & {
    [key: string]: any;
};

export const EditSocialsModal = ({ onClose, isOpen }: EditSocialsModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const { businessId } = useBusinessContext()
    const [socials, setSocials] = useState<Socials>({} as Socials);
    const queryClient = useQueryClient();
    const socialMediaIcons: Record<SocialMediaTypes, JSX.Element> = {
        Facebook: <Facebook />,
        Instagram: <Instagram />,
        Twitter: <IoLogoTwitter />,
    };

    const editSocialsMutation = useMutation(
        async () => {
            await supabase
                .from('socials')
                .update({
                    socials_data: JSON.stringify(socials)
                })
                .eq('business_id', businessId)
        },
        {
            onSuccess: () => {
                toast.success('Socials updated');
                queryClient.invalidateQueries('socials');
            },
            onError: () => {
                toast.error('Error updating socials');
            }
        }
    )

    const handleSocialChange = (day: string, socialsType: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setSocials(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                [socialsType]: event.target.value,
            },
        }));
    };

    const bodyContent = (
        <div className="flex items-center flex-col gap-4">
            {socialMedia.map((social) => {
                const Icon = socialMediaIcons[social as SocialMediaTypes];

                return (
                    <div className="flex items-center gap-4 cursor-pointer"
                        key={social}>
                        <label className="text-2xl"
                            htmlFor={social}>{Icon}</label>
                        <input className="outline-none p-2 border-[1px] rounded-full"
                            type="text" onChange={(e) => handleSocialChange(social, 'link', e)} placeholder={`${social} link...`} />
                    </div>
                )
            })}
            <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                onClick={async () => {
                    await editSocialsMutation.mutateAsync();
                    onClose();
                }}>
                Save
            </button>
        </div>

    )

    return (
        <>
            <Modal isOpen={isOpen}
                onClose={onClose}
                title='Add socials'
                body={bodyContent} />
        </>
    );
}