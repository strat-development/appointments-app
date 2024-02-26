import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useBusinessContext } from "@/providers/businessContextProvider";

interface NewPositionModalProps {
    isOpen: boolean;
    onClose: () => void;
    positionName: string;
    positionId: number;
}

type Positions = Database["public"]["Tables"]["positions"]["Row"]

export const EditPositionModal = ({ isOpen, onClose, positionName, positionId }: NewPositionModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const { businessName } = useBusinessContext();
    const [positionNames, setPositionNames] = useState<string>(positionName);

    useEffect(() => {
        setPositionNames(positionName);

    }, [positionName]);

    const editPosition = useMutation(
        async (newPosition: Positions) => {
            await supabase
                .from("positions")
                .update(newPosition)
                .eq("id", positionId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['positions', businessName]);

                toast.success('Visit added!')
            },

            onError: () => {
                toast.error('Error adding the visit!')
            }
        }
    );

    const deletePositionMutation = useMutation(
        async () => {
            await supabase
                .from("positions")
                .delete()
                .eq("id", positionId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['positions', businessName]);
                toast.success('Position deleted!')
            },
            onError: () => {
                toast.error('Error deleting the position!')
            }
        }
    );

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">

                <div>
                    <label htmlFor="Position">Position</label>
                    <Input
                        id="postition"
                        label="Position"
                        type="text"
                        placeholder="Position name"
                        onChange={(e) => {
                            setPositionNames(e.target.value);
                        }}
                        value={positionNames}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        editPosition.mutateAsync({
                            position_name: positionNames,
                            business_name: businessName
                        } as Positions);
                        handleClose();
                    }}>
                    Edit
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-red-600 to-red-500 text-white w-full"
                    onClick={() => {
                        deletePositionMutation.mutate();
                        handleClose();
                    }}>
                    Delete
                </button>
            </div>
        </>
    )

    const clearStates = () => {
        setPositionNames('');
    }

    const handleClose = () => {
        clearStates();
        onClose();
    }

    return (
        <Modal isOpen={isOpen}
            onClose={handleClose}
            title='Edit position'
            body={bodyContent}
        />
    );
}