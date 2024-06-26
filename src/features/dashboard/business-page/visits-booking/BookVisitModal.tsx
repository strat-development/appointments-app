import { Modal } from "@/components/Modal"
import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, ServicesData, VisitsData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";
import { DatePickSlider } from "./DatePickSlider";

interface BookVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    selectedService?: ServicesData[];
}

export const BookVisitModal = ({ onClose, isOpen, businessSlugId, selectedService }: BookVisitModalProps) => {
    const supabase = createClientComponentClient<Database>();
    const [businessData, setBusinessData] = useState<VisitsData>();

    const { data: business } = useQuery<VisitsData>(
        ['business', businessSlugId],
        async () => {
            const { data, error } = await supabase
                .from('visits')
                .select('*')
                .eq('id', businessSlugId || "")
                .single()
            if (error) {
                throw error;
            } else {
                setBusinessData(data);
            }

            return data || [];
        }
    )

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <h2>{businessData?.employee}</h2>
            <div>
                <DatePickSlider businessSlugId={businessSlugId}
                    selectedService={selectedService}
                />
            </div>
        </div>
    )

    return (
        <div>
            <Modal isOpen={isOpen}
                onClose={onClose}
                title='Book a visit'
                body={bodyContent}
            />
        </div>
    )
}