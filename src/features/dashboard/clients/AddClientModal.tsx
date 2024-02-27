import { useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { useUserContext } from "@/providers/userContextProvider";

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Clients = Database["public"]["Tables"]["clients"]["Row"]

export const AddClientModal = ({ isOpen, onClose }: NewClientModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const [clientNames, setClientNames] = useState<string[]>(['']);
    const [emails, setEmails] = useState<string[]>(['']);
    const [notes, setNotes] = useState<string[]>(['']);
    const [phoneNumbers, setPhoneNumbers] = useState<string[]>(['']);
    const { businessName } = useBusinessContext();
    const { userId } = useUserContext();

    const addNewClient = useMutation(
        async (newClient: Clients[]) => {
            await supabase
                .from("clients")
                .upsert(newClient)
                .eq("business_name", businessName);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['clients', clientNames]);

                toast.success('Client added!')
            },

            onError: () => {
                toast.error('Error adding the client!')
            }
        }
    );

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                {clientNames.map((client, index) => (
                    <div key={index}>
                        <label htmlFor={`Client ${index + 1}`}>Client {index + 1}</label>
                        <Input
                            id={`client ${index + 1}`}
                            label={`Client ${index + 1}`}
                            type="text"
                            placeholder="Client's name..."
                            onChange={(e) => {
                                const newClients = [...clientNames];
                                newClients[index] = e.target.value;
                                setClientNames(newClients);
                            }}
                            value={client}
                        />
                        <Input
                            id={`email ${index + 1}`}
                            label={`Email ${index + 1}`}
                            type="text"
                            placeholder="Email"
                            onChange={(e) => {
                                const newEmails = [...emails];
                                newEmails[index] = e.target.value;
                                setEmails(newEmails);
                            }}
                            value={emails[index] || ''}
                        />
                        <Input
                            id={`phone number ${index + 1}`}
                            label={`Phone number ${index + 1}`}
                            type="text"
                            placeholder="Phone number"
                            onChange={(e) => {
                                const newPhoneNumber = [...phoneNumbers];
                                newPhoneNumber[index] = e.target.value;
                                setPhoneNumbers(newPhoneNumber);
                            }}
                            value={emails[index] || ''}
                        />
                        <textarea className="w-full rounded-2xl border-[.5px] outline-none"
                            id={`note ${index + 1}`}
                            placeholder="Add a note..."
                            onChange={(e) => {
                                const newNotes = [...notes];
                                newNotes[index] = e.target.value;
                                setNotes(newNotes);
                            }}
                            value={notes[index] || ''}
                        />
                    </div>
                ))}
                <button onClick={() => {
                    setClientNames([...clientNames, '']);
                    setEmails([...emails, '']);
                    setNotes([...notes, '']);
                }}>
                    Add more
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addNewClient.mutateAsync(
                            clientNames.map((client, index) => ({
                                full_name: client,
                                email: emails[index],
                                description: notes[index],
                                business_name: businessName,
                                phone_number: phoneNumbers[index],
                                employee_id: userId
                            } as unknown as Clients))
                        );
                        onClose();
                    }}>
                    Add client
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={onClose}
            title='New client'
            body={bodyContent}
        />
    );
}