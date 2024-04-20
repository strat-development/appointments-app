import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "@/types/supabase";
import { useUserContext } from "@/providers/userContextProvider";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { ServicesData, VisitsData } from "@/types/types";

interface EditVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    startTime: string | null | undefined;
    endTime: string | null | undefined;
    visitId: string;
}

export const EditVisitModal = ({ isOpen, onClose, startTime, endTime, visitId }: EditVisitModalProps) => {
    const [email, setEmail] = useState<string | null>(null);
    const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
    const [service, setService] = useState<number | null>(null);
    const [client, setClient] = useState<string | null>(null);
    const [clientId, setClientId] = useState<string | null>(null)
    const [status, setStatus] = useState<string | null>('');
    const [note, setNote] = useState<string | null>(null);
    const [availiableServices, setAvailiableServices] = useState<ServicesData[]>([]);
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();
    const queryClient = useQueryClient();
    const { businessName, businessId } = useBusinessContext();

    const editVisitsMutation = useMutation(
        async (newVisits: VisitsData) => {
            await supabase
                .from("visits")
                .update(newVisits)
                .eq("visit_id", visitId);
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

    const deleteVisitsMutation = useMutation(
        async (eventId: string) => {
            await supabase.from('visits')
                .delete()
                .eq('visit_id', eventId);
        },
        {
            onSuccess: () => {
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your visits have been deleted.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1000,
                });
                queryClient.invalidateQueries(['visits', userId]);
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
        if (visitId && isOpen) {
            supabase
                .from("visits")
                .select("*")
                .eq("visit_id", visitId)
                .then(({ data, error }) => {
                    if (error) {
                        console.error("Error fetching client data:", error);
                    } else if (data && data.length > 0) {
                        const clientData = data[0];
                        setPhoneNumber(clientData.phone_number);
                        setClient(clientData.client_name);
                        setNote(clientData.client_description);
                        setStatus(clientData.status);
                        setService(clientData.service_id);
                        setClientId(clientData.client_id);
                    }
                });
        }
    }, [visitId, isOpen]);

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
                    onChange={(e) => setService(parseInt(e.target.value))}>
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
                            value={startTime || ''}
                        /> - <Input
                            id="Sevice"
                            label=""
                            type="text"
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
                        editVisitsMutation.mutateAsync({
                            business_id: businessId,
                            client_description: note || '',
                            client_id: clientId,
                            client_name: client,
                            employee: userId,
                            end_time: endTime || '',
                            label: '',
                            start_time: startTime || '',
                            status: status,
                            phone_number: phoneNumber,
                            service_id: service
                        } as VisitsData)

                        handleClose();
                    }
                    }>
                    Edit appointment
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-red-600 to-red-500 text-white w-full"
                    onClick={() => {
                        deleteVisitsMutation.mutateAsync(visitId);
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