import { useEffect, useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { ServicesData } from "@/types/types";

interface NewServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    serviceName: string;
    serviceId: number;
    servicePrice: string;
    serviceDuration: string;
}

export const EditServiceModal = ({ isOpen, onClose, serviceName, serviceId, serviceDuration, servicePrice }: NewServiceModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const [serviceNames, setServiceNames] = useState<string>(serviceName);
    const [price, setPrice] = useState<string>(servicePrice);
    const [duration, setDuration] = useState<string>(serviceDuration);

    useEffect(() => {
        setServiceNames(serviceName);
        setPrice(servicePrice);
        setDuration(serviceDuration);

    }, [serviceName, servicePrice, serviceDuration]);

    const editPosition = useMutation(
        async (newService: ServicesData) => {
            await supabase
                .from("services")
                .update(newService)
                .eq("id", serviceId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['services', serviceId]);

                toast.success('Service added!')
            },

            onError: () => {
                toast.error('Error adding the service!')
            }
        }
    );

    const deleteServiceMutation = useMutation(
        async () => {
            await supabase
                .from("services")
                .delete()
                .eq("id", serviceId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['services', serviceId]);
                toast.success('Service deleted!')
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
                    <label htmlFor="Service">Service</label>
                    <Input
                        id="position"
                        label="Service"
                        type="text"
                        placeholder="Service name"
                        onChange={(e) => {
                            setServiceNames(e.target.value);
                        }}
                        value={serviceNames}
                    />
                    <Input
                        id="price"
                        label="Service price"
                        type="text"
                        placeholder="Set service price"
                        onChange={(e) => {
                            setPrice(e.target.value);
                        }}
                        value={price}
                    />
                    <Input
                        id="duration"
                        label="Duration"
                        type="text"
                        placeholder="Service duration"
                        onChange={(e) => {
                            setDuration(e.target.value);
                        }}
                        value={duration}
                    />
                </div>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        editPosition.mutateAsync({
                            title: serviceNames,
                            price: price,
                            duration: duration
                        } as ServicesData);
                        handleClose();
                    }}>
                    Edit
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-red-600 to-red-500 text-white w-full"
                    onClick={() => {
                        deleteServiceMutation.mutate();
                        handleClose();
                    }}>
                    Delete
                </button>
            </div>
        </>
    )

    const clearStates = () => {
        setServiceNames('');
        setPrice('');
        setDuration('');
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