import { useEffect, useState } from "react";
import { Input } from "../../Input";
import { Modal } from "../../Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface EditVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
    hourId: string;
}

type Hours = Database["public"]["Tables"]["hours"]["Row"]
type Services = Database["public"]["Tables"]["services"]["Row"]

export const EditVisitModal = ({ isOpen, onClose, startTime, endTime, hourId }: EditVisitModalProps) => {
    const [email, setEmail] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [service, setService] = useState<string | null>(null);
    const [client, setClient] = useState<string | null>(null);
    const [status, setStatus] = useState<string | null>('');
    const [note, setNote] = useState<string | null>(null);
    const [availiableServices, setAvailiableServices] = useState<Services[]>([]);
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const businessName = "Visio";

    const addHoursMutation = useMutation(
        async (newHours: Hours) => {
            await supabase
                .from("hours")
                .update(newHours)
                .eq("id", hourId);
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



    const deleteHoursMutation = useMutation(
        async (eventId: string) => {
            await supabase.from('hours')
                .delete()
                .eq('id', eventId);
        },
        {
            onSuccess: () => {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your hours have been deleted.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                });
                queryClient.invalidateQueries(['hours', userId]);
            },
            onError: () => {
                Swal.fire({
                    title: 'Error!',
                    text: 'Something went wrong.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 1000,
                });
            },
        }
    );

    useEffect(() => {
        if (hourId) {
            // Fetch the client data
            supabase
                .from("hours")
                .select("*")
                .eq("id", hourId)
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Error fetching client data:", error);
                    } else if (data && data.length > 0) {
                        const clientData = data[0];
                        setPhoneNumber(clientData.phone_number);
                        setClient(clientData.title);
                        setNote(clientData.description);
                        setStatus(clientData.status);
                        setService(clientData.service);
                    }
                });
        }
    }, [hourId]);

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
    }

    const handleClose = () => {
        clearStates();
        onClose();
    }

    const bodyContent = (
        <>
            <div className="flex flex-col gap-4">
                <label htmlFor="Client">Client</label>
                <Input
                    id="client"
                    label="Client"
                    type="text"
                    onChange={(e) => setClient(e.target.value)}
                    value={client || ''}
                />
                <label htmlFor="Phone number">Phone number</label>
                <Input
                    id="Phone number"
                    label="Phone number"
                    type="text"
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    value={phoneNumber || ''}
                />
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
                <select className="peer w-full py-2 pl-4 font-light bg-white border-[.5px] rounded-2xl outline-none transition disabled:opacity-70 disabled:cursor-not-allowed"
                    onChange={(e) => setStatus(e.target.value)}>
                    <option value="Active">Active</option>
                    <option value="Canceled">Canceled</option>
                </select>
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
                        addHoursMutation.mutateAsync({
                            userId: userId,
                            title: client,
                            phone_number: phoneNumber,
                            service: service,
                            startTime: startTime || '',
                            endTime: endTime || '',
                            description: note || '',
                            label: '',
                            status: status

                        } as Hours)

                        handleClose();
                    }
                    }>
                    Edit appointment
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-red-600 to-red-500 text-white w-full"
                    onClick={() => {
                        deleteHoursMutation.mutateAsync(hourId);
                        handleClose();
                    }
                    }>
                    Delete appointment
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={handleClose}
            title='Edit appointment'
            body={bodyContent}
        />
    );
}