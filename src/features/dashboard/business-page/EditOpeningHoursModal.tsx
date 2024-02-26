import { Modal } from "@/components/Modal";
import { useBusinessContext } from "@/providers/businessContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useMutation } from "react-query";

interface EditOpeningHoursModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type OpeningHours = Database["public"]["Tables"]["business-opening-hours"]["Row"] & {
    [key: string]: any;
};

export const EditOpeningHoursModal = ({ onClose, isOpen }: EditOpeningHoursModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const { businessName } = useBusinessContext()
    
    const daysOfWeek = ([
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]);
    const [openingHours, setOpeningHours] = useState<OpeningHours>({} as OpeningHours);


    const openingHoursMutation = useMutation(
        async () => {
            await supabase
                .from('business-opening-hours')
                .update({
                    business_name: businessName,
                    opening_hours: JSON.stringify(openingHours)
                })
                .eq('business_name', businessName)
        },
        {
            onSuccess: () => {
                console.log('Opening hours updated')
            },
            onError: () => {
                console.log('Error updating opening hours')
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
                title='Edit opening hours'
                body={bodyContent} />
        </>
    );
}