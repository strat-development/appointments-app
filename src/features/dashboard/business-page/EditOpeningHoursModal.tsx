import { Modal } from "@/components/Modal";
import { daysOfWeek } from "@/consts/consts";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { IoMdCheckmark } from "react-icons/io";
import { useMutation, useQueryClient } from "react-query";

interface EditOpeningHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type OpeningHours = Database["public"]["Tables"]["business-opening-hours"]["Row"] & {
    [key: string]: any;
};

export const EditOpeningHoursModal = ({ onClose, isOpen }: EditOpeningHoursModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const { businessId } = useBusinessContext()
    const [openingHours, setOpeningHours] = useState<OpeningHours>({} as OpeningHours);
    const queryClient = useQueryClient();


    const openingHoursMutation = useMutation(
        async () => {
            await supabase
                .from('business-opening-hours')
                .update({
                    business_id: businessId,
                    opening_hours: JSON.stringify(openingHours)
                })
                .eq('business_id', businessId)
        },
        {
            onSuccess: () => {
                toast.success('Opening hours updated')
                queryClient.invalidateQueries('business-opening-hours')

            },
            onError: () => {
                toast.error('Error updating opening hours')
            }
        }
    )

    const handleTimeChange = (day: string, timeType: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setOpeningHours(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                [timeType]: event.target.value,
            },
        }));
    };

    const handleClosedChange = (day: string, event: React.ChangeEvent<HTMLInputElement>) => {
        setOpeningHours(prevState => ({
            ...prevState,
            [day]: {
                ...prevState[day],
                closed: event.target.checked,
            },
        }));
    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
                {daysOfWeek.map(day => (
                    <div key={day} className="grid grid-cols-3 justify-items-center items-center">
                        <p>{day}</p>
                        <div className="flex gap-4">
                            <input
                                type="time"
                                name={`${day}Start`}
                                id={`${day}Start`}
                                onChange={event => handleTimeChange(day, 'start', event)}
                            />
                            <span>-</span>
                            <input
                                type="time"
                                name={`${day}End`}
                                id={`${day}End`}
                                onChange={event => handleTimeChange(day, 'end', event)}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <label className={`flex gap-2 cursor-pointer hover:bg-red-500/70 hover:text-white p-2 rounded-full transition ${openingHours[day]?.closed ? 'closed-checkbox-checked' : ""}`} htmlFor={`${day}Closed`}>Closed</label>
                        </div>
                        <input
                            className="hidden"
                            type="checkbox"
                            name={`${day}Closed`}
                            id={`${day}Closed`}
                            onChange={event => handleClosedChange(day, event)}
                        />
                    </div>
                ))}
            </div>
            <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                onClick={async () => {
                    await openingHoursMutation.mutateAsync();
                    onClose();
                }}>
                Save
            </button>
        </div>
    )

    return (
        <>
            <Modal isOpen={isOpen}
                onClose={onClose}
                title='Edit opening hours'
                body={bodyContent} />
        </>
    );
}