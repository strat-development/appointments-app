import { useState } from "react";
import { Input } from "../../../components/Input";
import { Modal } from "../../../components/Modal";
import { useMutation, useQueryClient } from "react-query";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { Database } from "@/types/supabase";
import { useBusinessContext } from "@/providers/businessContextProvider";

interface NewServiceModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Service = Database["public"]["Tables"]["services"]["Row"]

export const AddServiceModal = ({ isOpen, onClose }: NewServiceModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const {businessId} = useBusinessContext();
    const [serviceNames, setServiceNames] = useState<string[]>(['']);
    const [prices, setPrices] = useState<string[]>(['']);
    const [durations, setDurations] = useState<string[]>(['']);

    const addNewService = useMutation(
        async (newService: Service[]) => {
            await supabase
                .from("services")
                .upsert(newService)
                .eq("business_id", businessId);
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['services', businessId]);

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
                {serviceNames.map((serviceName, index) => (
                    <div key={index}>
                        <label htmlFor={`Service ${index + 1}`}>Service {index + 1}</label>
                        <Input
                            id={`service ${index + 1}`}
                            label={`Service ${index + 1}`}
                            type="text"
                            placeholder="Service name"
                            onChange={(e) => {
                                const newServices = [...serviceNames];
                                newServices[index] = e.target.value;
                                setServiceNames(newServices);
                            }}
                            value={serviceName}
                        />
                        <Input
                            id={`price ${index + 1}`}
                            label={`Price ${index + 1}`}
                            type="text"
                            placeholder="Price"
                            onChange={(e) => {
                                const newPrices = [...prices];
                                newPrices[index] = e.target.value;
                                setPrices(newPrices);
                            }}
                            value={prices[index] || ''}
                        />
                        <Input
                            id={`duration ${index + 1}`}
                            label={`Duration ${index + 1}`}
                            type="text"
                            placeholder="Duration"
                            onChange={(e) => {
                                const newDurations = [...durations];
                                newDurations[index] = e.target.value;
                                setDurations(newDurations);
                            }}
                            value={durations[index] || ''}
                        />
                    </div>
                ))}
                <button onClick={() => {
                    setServiceNames([...serviceNames, '']);
                    setPrices([...prices, '']);
                    setDurations([...durations, '']);
                }}>
                    Add more
                </button>
                <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                    onClick={() => {
                        addNewService.mutateAsync(
                            serviceNames.map((serviceName, index) => ({
                                title: serviceName,
                                price: prices[index],
                                duration: durations[index],
                                business_id: businessId,
                            } as Service))
                        );
                        onClose();
                    }}>
                    Add services
                </button>
            </div>
        </>
    )

    return (
        <Modal isOpen={isOpen}
            onClose={onClose}
            title='New services'
            body={bodyContent}
        />
    );
}