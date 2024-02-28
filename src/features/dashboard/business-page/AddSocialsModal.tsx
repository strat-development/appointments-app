import { Modal } from "@/components/Modal";
import { socialMedia } from "@/consts/consts";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

interface AddSocialsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Socials = Database["public"]["Tables"]["socials"]["Row"] & {
    [key: string]: any;
};

export const AddSocialsModal = ({ onClose, isOpen }: AddSocialsModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const { businessName } = useBusinessContext()
    const [socials, setSocials] = useState<Socials>({} as Socials);
   
    const addSocialsMutation = useMutation(
        async () => {
            await supabase
                .from('socials')
                .upsert({
                    business_name: businessName,
                    socials_data: JSON.stringify(socials)
                })
                .eq('business_name', businessName)
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
                await addSocialsMutation.mutateAsync();
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