import { Database } from "@/types/supabase";
import { BusinessSlugIdProps } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { NavigationType, useNavigate } from "react-router-dom";

interface BookVisitButtonProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
    selectedService: number;
    selectedWorker: string;
    navigate: NavigationType;
}

export const BookVisitButton = ({
    businessSlugId,
    startTime,
    endTime,
    selectedService,
    navigate
}: BookVisitButtonProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const bookVistiMutation = useMutation(
        async () => {
            try {
                const { data, error } = await supabase
                    .from('visits')
                    .insert([
                        {
                            business_id: businessSlugId,
                            start_time: startTime,
                            end_time: endTime,
                            service_id: selectedService,
                        }
                    ]);
    
                if (error) {
                    throw error;
                }
    
                return data;
            } catch (error) {
                console.error(error);
                throw error;
            }
        },
        {
            onSuccess: () => {
                const navigate = useNavigate()
                navigate('localhost:3001/api/mail',{state:{clientId:"123",businessId:"123",mailTemplate:"123"}});
                queryClient.invalidateQueries('visits');
            }
        }
    );

    return (
        <div>
            <button onClick={() => bookVistiMutation.mutateAsync()} 
            className="p-2 border-[1px]">Book a visit</button>
        </div>
    )
}