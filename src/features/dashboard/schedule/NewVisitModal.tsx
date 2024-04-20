import { useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";
import toast from "react-hot-toast";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { ClientsData, ServicesData, VisitsData } from "@/types/types";

interface NewVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
}

export const NewVisitModal = ({ isOpen, onClose, startTime, endTime }: NewVisitModalProps) => {
    const [email, setEmail] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [service, setService] = useState<string | null>(null);
    const [client, setClient] = useState<string | null>(null);
    const [clientId, setClientId] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const [availiableServices, setAvailiableServices] = useState<ServicesData[]>([])
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const { businessName, businessId } = useBusinessContext();
    const [existingClients, setExistingClients] = useState<ClientsData[]>([]);
    const [addingNewClient, setAddingNewClient] = useState(false);
    const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
    const [selectedEndTime, setSelectedEndTime] = useState<string | null>(null);

    useQuery(
        ['clients'],
        async () => {
            const { data, error, status } = await supabase
                .from("clients")
                .select("*")
                .eq("business_name", businessName)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                return data;
            }
        },
        {
            onSuccess: (data) => {
                setExistingClients(data as ClientsData[])
            }
        }
    )


    const addVisitsMutation = useMutation(
        async (newVisits: VisitsData) => {
            await supabase
                .from("visits")
                .upsert(newVisits)
                .eq("userId", userId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['visits', userId]);

                toast.success('Visit added!')
            },

            onError: () => {
                toast.error('Error adding the visit!')
            }
        }
    );

    const addNewClient = useMutation(
        async (newClient: ClientsData) => {
            await supabase
                .from("clients")
                .upsert(
                    newClient
                )
                .eq("business_name", businessName)
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['clients', userId]);
            },
        }
    );

    useQuery(
        ['services', userId],
        async () => {
            const { data, error, status } = await supabase
                .from("services")
                .select("*")
                .eq("business_id", businessId)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                return data;
            }
        },
        {
            onSuccess: (data) => {
                setAvailiableServices(data as ServicesData[])
            }
        }
    )

    const clearStates = () => {
        setEmail(null);
        setPhoneNumber(null);
        setService(null);
        setClient(null);
        setNote(null);
        setAddingNewClient(false);
    }

    const handleClose = () => {
        clearStates();
        onClose();
    }

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <label htmlFor="Client">Client</label>
                {addingNewClient === false && existingClients.length > 0 && (
                    <>
                        <select
                            id="Client"
                            className="peer w-full py-2 pl-4 font-light bg-white border-[.5px] rounded-2xl outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                            onChange={(e) => {
                                if (e.target.value === "add_new") {
                                    setAddingNewClient(true);
                                } else {
                                    const selectedClient = existingClients.find(client => client.full_name === e.target.value);
                                    if (selectedClient) {
                                        setClient(selectedClient.full_name);
                                        setPhoneNumber(selectedClient.phone_number);
                                        setEmail(selectedClient.email);
                                        setClientId(selectedClient.client_id);
                                    }
                                }
                            }}
                        >
                            {existingClients.map((client) => (
                                <option key={client.client_id} value={client.full_name ?? ''}>{client.full_name}</option>
                            ))}
                        </select>
                        <button onClick={() => {
                            setAddingNewClient(true)
                            setClient('')
                            setPhoneNumber('')
                            setEmail('')
                        }}>Add new client
                        </button>
                    </>
                )}

                {(addingNewClient === true || existingClients.length == 0) && (
                    <>
                        <Input
                            id="client"
                            label="Client"
                            type="text"
                            placeholder="Client name"
                            onChange={(e) => setClient(e.target.value)}
                            value={client || ''}
                        />
                        <Input
                            id="Phone number"
                            label="Phone number"
                            type="tel"
                            placeholder="Phone number"
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            value={phoneNumber || ''}
                        />
                        <Input
                            id="Email"
                            label="Email"
                            type="email"
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email || ''}
                        />
                    </>
                )}
                <label htmlFor="Service">Service</label>
                <select
                    id="Service"
                    className="peer w-full py-2 pl-4 font-light bg-white border-[.5px] rounded-2xl outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                    onChange={(e) => setService(e.target.value)}>
                    {availiableServices.map((service) => (
                        <option key={service.service_id} value={service.service_id}>{service.title}</option>
                    ))}
                </select>
                <div>
                    <label htmlFor="Start time">Time</label>
                    <div className="flex gap-4 items-center">
                        <Input
                            id="Start time"
                            label=""
                            type="text"
                            placeholder="Start time"
                            onChange={(e) => setSelectedStartTime(e.target.value)}
                            value={startTime || ''}
                        /> - <Input
                            id="End time"
                            label=""
                            type="text"
                            placeholder="End time"
                            onChange={(e) => setSelectedEndTime(e.target.value)}
                            value={endTime || ''}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-start justify-start">
                    <label htmlFor="Note">{`Note (optional)`}</label>
                    <textarea className="border-[.5px] rounded-2xl outline-none p-4 w-full h-32"
                        id="Note"
                        placeholder="Write a note..."
                        onChange={(e) => setNote(e.target.value)}
                        value={note || ''}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {

                        if (!client?.trim() || !phoneNumber?.trim() || !service?.trim()) {
                            toast.error('Please fill in all required fields!');
                            return;
                        }

                        addVisitsMutation.mutateAsync({
                            employee: userId,
                            client_name: client,
                            phone_number: phoneNumber,
                            service_id: service,
                            start_time: startTime || '',
                            end_time: endTime || '',
                            client_description: note || '',
                            label: '',
                            status: 'Active',
                            business_id: businessId,
                            client_id: clientId,
                        } as unknown as VisitsData);

                        const clientExists = existingClients.some(existingClient => existingClient.full_name === client);

                        if (!clientExists) {
                            addNewClient.mutateAsync({
                                phone_number: phoneNumber || '',
                                email: email || '',
                                employee: userId,
                                client_description: note || '',
                                label: "",
                                business_name: businessName,
                                client_id: '',
                                full_name: client || '',
                                visit_count: 0,
                            } as ClientsData);
                        }

                        handleClose();
                    }
                    }>
                    Add appointment
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={handleClose}
            title='New appointment'
            body={bodyContent}
        />
    );
}