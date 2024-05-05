import { Modal } from "@/components/Modal";
import { daysOfWeek } from "@/consts/consts";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

interface OpeningHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type OpeningHours = Database["public"]["Tables"]["business-opening-hours"]["Row"] & {
    [key: string]: any;
};

export const OpeningHoursModal = ({ onClose, isOpen }: OpeningHoursModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const { businessId } = useBusinessContext();
    const [openingHours, setOpeningHours] = useState<OpeningHours>({} as OpeningHours);
    const queryClient = useQueryClient();

    const openingHoursMutation = useMutation(
        async () => {
            await supabase
                .from('business-opening-hours')
                .upsert({
                    business_id: businessId,
                    opening_hours: JSON.stringify(openingHours)
                })
        },
        {
            onSuccess: () => {
                toast.success('Opening hours updated');
                queryClient.invalidateQueries('business-opening-hours');
            },
            onError: () => {
               toast.error('Error updating opening hours');
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
        <div>
            {daysOfWeek.map(day => (
                <div key={day} className="flex justify-between items-center">
                    <p>{day}</p>
                    <div className="flex gap-2">
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
                    <div>
                        <input
                            type="checkbox"
                            name={`${day}Closed`}
                            id={`${day}Closed`}
                            onChange={event => handleClosedChange(day, event)}
                        />
                        <label htmlFor={`${day}Closed`}>Closed</label>
                    </div>
                </div>
            ))}
            <button onClick={async () => {
                await openingHoursMutation.mutateAsync();
            }}>
                Save
            </button>
        </div>

    )

    return (
        <>
            <Modal isOpen={isOpen}
                onClose={onClose}
                title='Opening hours'
                body={bodyContent} />
        </>
    );
}