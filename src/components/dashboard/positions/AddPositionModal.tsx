import { useState } from "react";
import { Input } from "../../Input";
import { Modal } from "../../Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";

interface NewVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Positions = Database["public"]["Tables"]["positions"]["Row"]

export const AddPositionModal = ({ isOpen, onClose }: NewVisitModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const businessName = "Visio";
    const [positionNames, setPositionNames] = useState<string[]>(['']);

    const addNewPosition = useMutation(
        async (newPosition: Positions[]) => {
            await supabase
                .from("positions")
                .upsert(newPosition)
                .eq("business_name", businessName);
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

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                {positionNames.map((positionName, index) => (
                    <div key={index}>
                        <label htmlFor={`Position ${index + 1}`}>Position {index + 1}</label>
                        <Input
                            id={`position ${index + 1}`}
                            label={`Position ${index + 1}`}
                            type="text"
                            placeholder="Position name"
                            onChange={(e) => {
                                const newPositions = [...positionNames];
                                newPositions[index] = e.target.value;
                                setPositionNames(newPositions);
                            }}
                            value={positionName}
                        />
                    </div>
                ))}
                <button onClick={() => setPositionNames([...positionNames, ''])}>
                    Add more
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addNewPosition.mutateAsync(
                            positionNames.map(positionName => ({
                                position_name: positionName,
                                business_name: businessName
                            } as Positions))
                        );
                        onClose();
                    }}>
                    Add positions
                </button>
            </div>
        </>
    )

    const clearStates = () => {
        setPositionNames(['']);
    }

    const handleClose = () => {
        clearStates();
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