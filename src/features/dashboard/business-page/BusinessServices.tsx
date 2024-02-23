import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

type Services = Database['public']['Tables']['services']['Row'];

export const BusinessServices = () => {
    const supabase = createClientComponentClient<Database>();
    const businessName = "Visio";

    const { data: services } = useQuery<Services[]>(
        ['services'],
        async () => {
            const { data, error } = await supabase
                .from('services')
                .select('*')
                .eq('business_name', businessName);
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
                    <button>
                        Book
                    </button>
                </div>
            ))}
        </>
    )
}