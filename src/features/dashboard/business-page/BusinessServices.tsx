import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";
import { BookVisitModal } from "./visits-booking/BookVisitModal";
import { useState } from "react";
import { BusinessSlugIdProps, ServicesData } from "@/types/types";
import { useUserContext } from "@/providers/userContextProvider";



export const BusinessServices = ({ businessSlugId }: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userRole } = useUserContext();
    const handleClose = () => {
        setIsModalOpen(false);
    }
    const { data: services } = useQuery<ServicesData[]>(
        ['services'],
        async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('business_id', businessSlugId || "")
            if (error) {
                throw error;
            }
            return data || [];
        }
    )

    return (
        <>
            {services?.map((service, index) => (
                <div className="border-[.5px] rounded-2xl p-4 flex justify-between"
                    key={index}>
                    <div className="flex flex-col gap-2">
                        <h2>{service.title}</h2>
                        <div className="flex gap-4">
                            <p>{service.duration}</p>
                            <p>{service.price}</p>
                        </div>
                    </div>
                    {!userRole &&
                        <button value={service.title}
                            onClick={() => setIsModalOpen(true)}>
                            Book
                        </button>
                    }
                </div>
            ))}
            <BookVisitModal businessSlugId={businessSlugId}
                isOpen={isModalOpen}
                onClose={handleClose} />
        </>
    )
}