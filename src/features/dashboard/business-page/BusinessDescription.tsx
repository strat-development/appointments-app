import { Database } from "@/types/supabase";
import { BusinessData, BusinessSlugIdProps } from "@/types/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { useQuery } from "react-query";

export const BusinessDescription = ({ businessSlugId }: BusinessSlugIdProps) => {
    const supabase = createClientComponentClient<Database>();
    const [businessInfoData, setBusinessInfoData] = useState<BusinessData>();

    const { data: businessData, isLoading } = useQuery(
        ['business-data', businessSlugId],
        async () => {
            const { data, error } = await supabase
                .from('business-info')
                .select('*')
                .eq('id', businessSlugId || "")
                .single()
            if (error) {
                throw error;
            } else {
                setBusinessInfoData(data);
            }
        }
    )

    return (
        <>
            {isLoading ? <div>Loading...</div> : (
                <div>
                    <h1>{businessInfoData?.business_name}</h1>
                    <p>{businessInfoData?.business_address}</p>
                </div>
            )}
        </>
    )
}