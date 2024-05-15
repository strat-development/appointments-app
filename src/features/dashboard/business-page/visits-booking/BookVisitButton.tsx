import { Database } from "@/types/supabase";
import { BusinessSlugIdProps } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

interface BookVisitButtonProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
    selectedService: number;
    selectedWorker: string;
}

export const BookVisitButton = ({
    businessSlugId,
    startTime,
    endTime,
    selectedService,
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
                toast.success('Visit booked successfully');
                queryClient.invalidateQueries('visits');
            }
        }
    );

    return (
        <>
            <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
                onClick={() => bookVistiMutation.mutateAsync()}>Book a visit</button>
        </>
    )
}