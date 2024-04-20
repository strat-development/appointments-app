import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";
import { Input } from "@/components/Input";
import { Modal } from "@/components/Modal";
import { BusinessData } from "@/types/types";

interface BusinesDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const BusinessDataModal = ({ onClose, isOpen }:BusinesDataModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const [businessName, setBusinessName] = useState<string>("");
    const [businessEmail, setBusinessEmail] = useState<string>("");
    const [businessAddress, setBusinessAddress] = useState<string>("");
    const [businessPhoneNumber, setBusinessPhoneNumber] = useState<string>("");
    const queryClient = useQueryClient();
    const { userId } = useUserContext();

    const addBusinessData = useMutation(
        async (newBusinessData: BusinessData[]) => {
            await supabase
                .from("business-info")
                .upsert(newBusinessData)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['business-info']);

                toast.success('Business added!')
            },

            onError: () => {
                toast.error('Error adding the business!')
            }
        }
    );
    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <div>
                    <label htmlFor="user name">Business name</label>
                    <Input
                        id="business name"
                        label="business name"
                        type="text"
                        placeholder="Your business name..."
                        onChange={(e) => setBusinessName(e.target.value)}
                        value={businessName || ''}
                    />
                    <label htmlFor="email">Business Email</label>
                    <Input
                        id="business email"
                        label="business email"
                        type="text"
                        placeholder="Your business email..."
                        onChange={(e) => setBusinessEmail(e.target.value)}
                        value={businessEmail || ''}
                    />
                    <label htmlFor="phone number">Business Phone number</label>
                    <Input
                        id="phone number"
                        label="phone number"
                        type="text"
                        placeholder="Your phone number..."
                        onChange={(e) => setBusinessPhoneNumber(e.target.value)}
                        value={businessPhoneNumber || ''}
                    />
                    <label htmlFor="address">Business Address</label>
                    <Input
                        id="business address"
                        label="business address"
                        type="text"
                        placeholder="Business address..."
                        onChange={(e) => setBusinessAddress(e.target.value)}
                        value={businessAddress || ''}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addBusinessData.mutateAsync([{
                            business_name: businessName,
                            business_email: businessEmail,
                            business_phone_number: businessPhoneNumber,
                            business_address: businessAddress,
                            business_owner: userId
                        }] as BusinessData[]);
                    }}
                >
                    Save
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={onClose}
            title=''
            body={bodyContent}
        />
    );
}