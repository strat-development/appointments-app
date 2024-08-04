import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, ServicesData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";

interface BookVisitButtonProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
    selectedService?: ServicesData[];
    selectedWorker: string;
    email: string;
    clientName: string;
}

export const BookVisitButton = ({
    businessSlugId,
    startTime,
    endTime,
    selectedService,
    selectedWorker,
    email,
    clientName
}: BookVisitButtonProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const { userId } = useUserContext();
    const router = useRouter();

    const bookVisitMutation = useMutation(
        async () => {
            try {
                const { data, error } = await supabase
                    .from('visits')
                    .insert([
                        {
                            business_id: businessSlugId,
                            start_time: startTime,
                            end_time: endTime,
                            service_id: selectedService?.map(item => item.service_id)[0],
                            employee: selectedWorker,
                            client_email: email,
                            status: 'Active',
                            client_name: clientName,
                            client_id: userId || null
                        }
                    ]);

                if (error) {
                    throw error;
                }

                const emailResponse = await fetch('/api/new-visit-mail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        userFirstname: clientName
                    })
                });

                if (!emailResponse.ok) {
                    throw new Error('Failed to send email');
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
                router.refresh();
            },

            onError: () => {
                toast.error('Failed to book visit');
            }
        }
    );

    return (
        <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
            onClick={() => bookVisitMutation.mutateAsync()}>
            Book a visit</button>
    )
}