import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { ClientsData } from "@/types/types";

interface NewClientModalProps {
    isOpen: boolean;
    onClose: () => void;
    clientName: string;
    clientId: string;
    clientEmail: string;
    clientPhoneNumber: string;
}

export const EditClientModal = ({ isOpen, onClose, clientName, clientId, clientEmail, clientPhoneNumber }: NewClientModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const [clientNames, setclientNames] = useState<string>(clientName);
    const [phoneNumbers, setPhoneNumbers] = useState<string>(clientPhoneNumber);
    const [emails, setEmails] = useState<string>(clientEmail);

    useEffect(() => {
        setclientNames(clientName);
        setPhoneNumbers(clientPhoneNumber);
        setEmails(clientEmail);
    }, [clientName]);

    const editClient = useMutation(
        async (newClient: ClientsData) => {
            await supabase
                .from("clients")
                .update(newClient)
                .eq("id", clientId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['clients', clientId]);
                toast.success('Visit added successfully!')
            },

            onError: () => {
                toast.error('Error adding the visit!')
            }
        }
    );

    const deleteClientMutation = useMutation(
        async () => {
            await supabase
                .from("clients")
                .delete()
                .eq("client_id", clientId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['clients', clientId]);
                toast.success('client deleted!')
            },
            onError: () => {
                toast.error('Error deleting the position!')
            }
        }
    );

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <label htmlFor="client">client</label>
                    <Input
                        id="Client"
                        label="Client name"
                        type="text"
                        placeholder="client name"
                        onChange={(e) => {
                            setclientNames(e.target.value);
                        }}
                        value={clientNames}
                    />
                    <Input
                        id="phone number"
                        label="Phone number"
                        type="text"
                        placeholder="Client phone number"
                        onChange={(e) => {
                            setPhoneNumbers(e.target.value);
                        }}
                        value={phoneNumbers}
                    />
                    <Input
                        id="email"
                        label="Email"
                        type="text"
                        placeholder="Client email"
                        onChange={(e) => {
                            setEmails(e.target.value);
                        }}
                        value={emails}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        editClient.mutateAsync({
                            full_name: clientNames,
                            phone_number: phoneNumbers,
                            email: emails
                        } as ClientsData);
                        handleClose();
                    }}>
                    Edit
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-red-600 to-red-500 text-white w-full"
                    onClick={() => {
                        deleteClientMutation.mutate();
                        handleClose();
                    }}>
                    Delete
                </button>
            </div>
        </>
    )

    const clearStates = () => {
        setclientNames('');
        setPhoneNumbers('');
        setEmails('');
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