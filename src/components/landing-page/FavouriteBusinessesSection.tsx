import { useUserContext } from "@/providers/userContextProvider";
import { Database } from "@/types/supabase";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useQuery } from "react-query";

export const FavouriteBusinessesSection = () => {
    const supabase = createClientComponentClient<Database>();
    const { userId } = useUserContext();

    const { data: favouriteBusinesses, isLoading } = useQuery(
        ['favourite-businesses', userId],
        async () => {
            const { data, error } = await supabase
                .from('favourite-businesses')
                .select('*')
                .eq('user_id', userId)

            if (error) {
                throw error;
            }

            return data;
        }
    )

    return (
        <>
            
                {favouriteBusinesses?.map((business) => (
                    <div key={business.business_id}>
                        <p>{business.business_id}</p>
                    </div>
                ))}
           
        </>
    )
}