import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { BusinessSlugIdProps, ServicesData } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "react-query";
import { NavigationType } from "react-router-dom";

interface BookVisitButtonProps {
    businessSlugId: BusinessSlugIdProps["businessSlugId"];
    startTime: string;
    endTime: string;
    selectedService?: ServicesData[];
    selectedWorker: string;
    navigate?: NavigationType;
    phoneNumber: string;
    clientName: string;
}

export const BookVisitButton = ({
    businessSlugId,
    startTime,
    endTime,
    selectedService,
    selectedWorker,
    phoneNumber, 
    clientName
    // navigate
}: BookVisitButtonProps) => {
    const supabase = createClientComponentClient<Database>();
    const queryClient = useQueryClient();
    const { userId } = useUserContext();
    const router = useRouter();
    // const navigation = useNavigate();

    console.log(selectedService);

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
                            service_id: selectedService?.map(item => item.service_id)[0],
                            employee: selectedWorker,
                            phone_number: phoneNumber,
                            status: 'Active',
                            client_name: clientName,
                            client_id: userId || null
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
                // navigation('localhost:3001/api/mail',{state:{clientId:"123",businessId:"123",mailTemplate:"123"}});
                toast.success('Visit booked successfully');
                queryClient.invalidateQueries('visits');
                router.refresh();
            }
        }
    );

    return (
        <button className="px-4 py-2 rounded-full hover:opacity-90 transition bg-gradient-to-b from-violet-600 to-violet-500 text-white w-full"
            onClick={() => bookVistiMutation.mutateAsync()}>
            Book a visit</button>
    )
}