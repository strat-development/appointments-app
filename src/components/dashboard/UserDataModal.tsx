import { useState } from "react";
import { Input } from "../Input";
import { Modal } from "../Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";

interface NewPositionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type UserData = Database["public"]["Tables"]["users"]["Row"]

export const AddPositionModal = ({ isOpen, onClose }: NewPositionModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const [userName,setUserName]= useState<string>("");
    const [userEmail,setUserEmail]= useState<string>("");
    const [userPhoneNumber,setUserPhoneNumber]= useState<string>("");
    const queryClient = useQueryClient();
    const businessName = "Visio";
    const {userId}= useUserContext();

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

                toast.success('Visit added!')
            },

            onError: () => {
                toast.error('Error adding the visit!')
            }
        }
    );

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">

                    <div key={}>
                        <label htmlFor="user name">gówno!</label>
                        <Input
                            id="user name"
                            label="user name"
                            type="text"
                            placeholder="user name"
                            onChange={(e) => {
                                setUserName(userName),
                            
                            }}
                            value={userName}
                        />
                    </div>

                <button onClick={}>
                    Add more
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={()=>{
                        addUserData.mutateAsync({
                            full_name: userName ,
                        } as UserData;) 

                    }}>
                    Add positions
                </button>
            </div>
        </>
    )


    const handleClose = () => {

        onClose();
    }

    return (
        <Modal isOpen={isOpen}
            onClose={handleClose}
            title='New position'
            body={bodyContent}
        />
    );
}