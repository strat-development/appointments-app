import { useState } from "react";
import { Input } from "../Input";
import { Modal } from "../Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";

interface UserDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UserData = Database["public"]["Tables"]["users"]["Row"]

export const UserDataModal = ({ onClose, isOpen }: UserDataModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const [userName, setUserName] = useState<string>("");
    const [userEmail, setUserEmail] = useState<string>("");
    const [userPhoneNumber, setUserPhoneNumber] = useState<string>("");
    const queryClient = useQueryClient();
    const { userId } = useUserContext();

    const addUserData = useMutation(
        async (newUserData: UserData[]) => {
            await supabase
                .from("users")
                .upsert(newUserData)
                .eq("id", userId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['users']);

                toast.success('Data added!')
            },

            onError: () => {
                toast.error('Error adding the data!')
            }
        }
    );
    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="user name">Full name</label>
                    <Input
                        id="user name"
                        label="user name"
                        type="text"
                        placeholder="Your name..."
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName || ''}
                    />
                    <label htmlFor="email">Email</label>
                    <Input
                        id="email"
                        label="email"
                        type="text"
                        placeholder="Your email..."
                        onChange={(e) => setUserEmail(e.target.value)}
                        value={userEmail || ''}
                    />
                    <label htmlFor="phone number">Phone number</label>
                    <Input
                        id="phone number"
                        label="phone number"
                        type="text"
                        placeholder="Your phone number..."
                        onChange={(e) => setUserPhoneNumber(e.target.value)}
                        value={userPhoneNumber || ''}
                    />
                </div>

                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addUserData.mutateAsync([{
                            full_name: userName,
                            email: userEmail,
                            phone_number: userPhoneNumber,
                            id: userId
                        }] as UserData[]);
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