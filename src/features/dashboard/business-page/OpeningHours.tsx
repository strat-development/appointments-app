import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";
import { OpeningHoursModal } from "./OpeningHoursModal";
import { EditOpeningHoursModal } from "./EditOpeningHoursModal";
import { useUserContext } from "@/providers/userContextProvider";
import { BusinessSlugIdProps, OpeningHoursData } from "@/types/types";

export const OpeningHours = ({businessSlugId}: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { userRole } = useUserContext();
    const onClose = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
    }

    const { data: openingHours, isLoading } = useQuery<OpeningHoursData>(
        ['opening-hours'],
        async () => {
            const { data, error } = await supabase
                .from('business-opening-hours')
                .select('*')
                .eq('business_id', businessSlugId || "")
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
            <div className="flex flex-col gap-4 w-full">
                <h2 className="self-center text-xl font-semibold">Opening Hours</h2>
                <div className="flex flex-col gap-2 w-full">
                    {Object.entries(parsedOpeningHours).map(([day, hours]) => {
                        const hoursAsObj = hours as { start?: string, end?: string, closed?: boolean };
                        return (
                            <div className="flex justify-between w-full"  
                            key={day}>
                                <h3>{day}</h3>
                                {hoursAsObj.closed
                                    ? <p className="text-black/70">Closed</p>
                                    : <p className="text-black/70">{hoursAsObj.start} - {hoursAsObj.end}</p>}
                            </div>
                        );
                    })}
                </div>
                {!openingHours && userRole === "Employer" && (
                    <button onClick={() => setIsModalOpen(true)}>
                        Add hours
                    </button>
                )} 
                {openingHours && userRole === "Employer" && (
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