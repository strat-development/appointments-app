import { Modal } from "@/components/Modal";
import { socialMedia } from "@/consts/consts";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

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

    const handleNoSocialChange = (day: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setSocials(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                closed: event.target.checked,
            },
        }));
    }

    const bodyContent = (
        <div>
            {socialMedia.map((social) => {
                return (
                    <div key={social}>
                        <label htmlFor={social}>{social}</label>
                        <input type="checkbox" id={social} onChange={(e) => handleNoSocialChange(social, e)} />
                        <input type="text" onChange={(e) => handleSocialChange(social, 'link', e)} placeholder="Socials link..." />
                    </div>
                )
            })}
            <button onClick={async () => {
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