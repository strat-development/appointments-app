import { Modal } from "@/components/Modal"
import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, VisitsData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery, useQueryClient } from "react-query";

interface BookVisitModalProps {
    isOpen: boolean;
    onClose: () => void;
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
}

export const BookVisitModal = ({ onClose, isOpen, businessSlugId }: BookVisitModalProps) => {
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
        <div>
            <h2>{businessData?.employee}</h2>
            <div>
                <input type="datetime-local" />
                <button onClick={() => {
                    console.log(businessData?.client_name)
                }}
                >Book</button>
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