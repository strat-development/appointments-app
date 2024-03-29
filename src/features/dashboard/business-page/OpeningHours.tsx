import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";
import { OpeningHoursModal } from "./OpeningHoursModal";
import { EditOpeningHoursModal } from "./EditOpeningHoursModal";
import { useBusinessContext } from "@/providers/businessContextProvider";

type OpeningHours = Database["public"]["Tables"]["business-opening-hours"]["Row"];

export const OpeningHours = () => {
    const supabase = createClientComponentClient<Database>();
    const { businessId } = useBusinessContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const onClose = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    }

    const { data: openingHours, isLoading } = useQuery<OpeningHours>(
        ['opening-hours'],
        async () => {
            const { data, error } = await supabase
                .from('business-opening-hours')
                .select('*')
                .eq('business_id', businessId);
            if (error) {
                throw error;
            }
            return data?.[0];
        }
    )

    if (isLoading || !openingHours) {
        return <div>Loading...</div>;
    }

    const parsedOpeningHours = JSON.parse(openingHours.opening_hours as string);

    return (
        <>
            <div>
                <h2>Opening Hours</h2>
                <div>
                    {Object.entries(parsedOpeningHours).map(([day, hours]) => {
                        const hoursAsObj = hours as { start?: string, end?: string, closed?: boolean };
                        return (
                            <div key={day}>
                                <h3>{day}</h3>
                                {hoursAsObj.closed
                                    ? <p>Closed</p>
                                    : <p>Open from {hoursAsObj.start} to {hoursAsObj.end}</p>}
                            </div>
                        );
                    })}
                </div>
                {!openingHours ? (
                    <button onClick={() => setIsModalOpen(true)}>
                        Add hours
                    </button>
                ) : (
                    <button onClick={() => setIsEditModalOpen(true)}>
                        Edit hours
                    </button>
                )}
            </div>
            <OpeningHoursModal isOpen={isModalOpen} onClose={onClose} />
            <EditOpeningHoursModal isOpen={isEditModalOpen} onClose={onClose} />
        </>
    )
}