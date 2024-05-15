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
    const [selectedService, setSelectedService] = useState<ServicesData[]>();
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
                <div className="border-[.5px] rounded-2xl p-4 flex justify-between hover:shadow-md transition duration-300 ease-in-out"
                    key={index}>
                    <div className="flex flex-col gap-2">
                        <h2 className="text-lg">{service.title}</h2>
                        <div className="flex gap-4">
                            <p>{service.duration}min</p>
                            <p>{service.price}zł</p>
                        </div>
                    </div>
                    {!userRole &&
                        <button className="px-6 py-2 h-fit rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white"
                            value={service.title}
                            onClick={() => {
                                setIsModalOpen(true)
                                setSelectedService([service as ServicesData])
                            }
                            }>
                            Book
                        </button>
                    }
                </div>
            ))}
            <BookVisitModal businessSlugId={businessSlugId}
                isOpen={isModalOpen}
                onClose={handleClose}
                selectedService={selectedService}
            />
        </>
    )
}