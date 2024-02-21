import { useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
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
type Clients = Database["public"]["Tables"]["clients"]["Row"]
type Services = Database["public"]["Tables"]["services"]["Row"]

export const NewVisitModal = ({ isOpen, onClose, startTime, endTime }: NewVisitModalProps) => {
    const [email, setEmail] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [service, setService] = useState<string | null>(null);
    const [client, setClient] = useState<string | null>(null);
    const [note, setNote] = useState<string | null>(null);
    const [availiableServices, setAvailiableServices] = useState<Services[]>([])
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const businessName = "Visio";
    const [existingClients, setExistingClients] = useState<Clients[]>([]);
    const [addingNewClient, setAddingNewClient] = useState(false);

    useQuery(
        ['clients', userId],
        async () => {
            const { data, error, status } = await supabase
                .from("clients")
                .select("*")
                .eq("employee_id", userId)

            if (error && status !== 406) {
                throw error;
            }

            if (data) {
                return data;
            }
        },
        {
            onSuccess: (data) => {
                setExistingClients(data as Clients[])
            }
        }
    )


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

    const addNewClient = useMutation(
        async (newClient: Clients) => {
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
                setAvailiableServices(data as Services[])
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
                                    }
                                }
                            }}
                        >
                            {existingClients.map((client) => (
                                <option key={client.id} value={client.full_name ?? ''}>{client.full_name}</option>
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
                        <option key={service.id} value={service.title}>{service.title}</option>
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
                            // onChange={(e) => setSelectedStartTime(e.target.value)}
                            value={startTime || ''}
                        /> - <Input
                            id="Sevice"
                            label=""
                            type="text"
                            placeholder="End time"
                            // onChange={(e) => setSelectedEndTime(e.target.value)}
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
                        } as Hours);

                        const clientExists = existingClients.some(existingClient => existingClient.full_name === client);

                        if (!clientExists) {
                            addNewClient.mutateAsync({
                                full_name: client || '',
                                phone_number: phoneNumber || '',
                                email: email || '',
                                employee_id: userId,
                                description: note || '',
                                label: "",
                                business_name: businessName
                            } as Clients);
                        }

                        handleClose();

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