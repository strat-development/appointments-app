import { useState } from "react";
import { Input } from "../Input";
import { Modal } from "../Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";
import toast from "react-hot-toast";

interface NewVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
}

type Hours = Database["public"]["Tables"]["hours"]["Row"]

export const NewVisitModal = ({ isOpen, onClose, startTime, endTime }: NewVisitModalProps) => {
    const [email, setEmail] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [service, setService] = useState<string | null>(null);
    const [client, setClient] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(null);
    // const [selectedStartTime, setSelectedStartTime] = useState<string | null | undefined>(null);
    // const [selectedEndTime, setSelectedEndTime] = useState<string | null | undefined>(null);
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();
    const queryClient = useQueryClient();


    const addHoursMutation = useMutation(
        async (newHours: Hours) => {
            await supabase
                .from("hours")
                .upsert(newHours)
                .eq("userId", userId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['hours', userId]);

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
                <Input
                    id="client"
                    label="Client"
                    type="text"
                    onChange={(e) => setClient(e.target.value)}
                    value={client || ''}
                />
                <Input
                    id="Phone number"
                    label="Phone number"
                    type="text"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber || ''}
                />
                <Input
                    id="Service"
                    label="Service"
                    type="text"
                    onChange={(e) => setService(e.target.value)}
                    value={service || ''}
                />
                <div>
                    <label htmlFor="Start time">Time</label>
                    <div className="flex gap-4 items-center">
                        <Input
                            id="Start time"
                            label=""
                            type="text"
                            // onChange={(e) => setSelectedStartTime(e.target.value)}
                            value={startTime || ''}
                        /> - <Input
                            id="Sevice"
                            label=""
                            type="text"
                            // onChange={(e) => setSelectedEndTime(e.target.value)}
                            value={endTime || ''}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-start justify-start">
                    <label htmlFor="Note">{`Note (optional)`}</label>
                    <textarea className="border-1 outline-none rounded-2xl p-4 w-full h-32"
                        id="Note"
                        placeholder="Write a note..."
                        onChange={(e) => setNote(e.target.value)}
                        value={note || ''}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addHoursMutation.mutateAsync({
                            userId: userId,
                            title: client,
                            phone_number: phoneNumber,
                            service: service,
                            startTime: startTime || '',
                            endTime: endTime || '',
                            description: note || '',
                            label: '',
                            status: 'Active'

                        } as Hours)

                        onClose();
                        setEmail(null);
                        setPhoneNumber(null);
                        setService(null);
                        setClient(null);
                        setNote(null);
                    }
                    }>
                    Add appointment
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={onClose}
            title='New appointment'
            body={bodyContent}
        />
    );
}